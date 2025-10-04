import {
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore
} from "@whiskeysockets/baileys"
import qrcode from "qrcode"
import NodeCache from "node-cache"
import fs from "fs"
import path from "path"
import pino from 'pino'
import { makeWASocket } from '../lib/simple.js'

const handler = async (m, { conn, args }) => {
  // Determinar si el usuario pidió code o qr
  const isCode = (m.body || m.text || '').toLowerCase().includes('code')
  const id = (m.sender || "terminal").split("@")[0]
  const pathJadiBot = path.join(global.jadi, id)
  if (!fs.existsSync(pathJadiBot)) fs.mkdirSync(pathJadiBot, { recursive: true })
  let { version } = await fetchLatestBaileysVersion()
  const msgRetryCache = new NodeCache()
  const { state, saveCreds } = await useMultiFileAuthState(pathJadiBot)
  const connectionOptions = {
    logger: pino({ level: "fatal" }),
    printQRInTerminal: false,
    auth: { creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, pino({level: 'silent'})) },
    msgRetryCache,
    browser: ['Windows', 'Firefox'],
    version: version,
    generateHighQualityLinkPreview: true
  }
  let sock = makeWASocket(connectionOptions)
  sock.ev.on('creds.update', saveCreds)
  sock.ev.on('connection.update', async (update) => {
    const { connection, qr } = update
    if (qr && !isCode) {
      let buffer = await qrcode.toBuffer(qr, { scale: 8 })
      await conn.sendMessage(m.chat, {
        image: buffer,
        caption: "✿  *Vincula tu cuenta usando el código.*\n\nSigue las instrucciones:\n\n✎ *Mas opciones » Dispositivos vinculados » Vincular nuevo dispositivo » Escanea el código Qr.*\n\n↺ El código es válido por 60 segundos."
      }, { quoted: m })
      return
    }
    if (typeof sock.requestPairingCode === "function" && isCode && m?.sender) {
      let code = await sock.requestPairingCode(m.sender.split("@")[0])
      code = code.match(/.{1,4}/g)?.join("-")
      await conn.sendMessage(m.chat, {
        text: `✿  *Vincula tu cuenta usando el código.*\n\nSigue las instrucciones:\n\n✎ *Más opciones » Dispositivos vinculados » Vincular nuevo dispositivo » Vincular usando número.*\n\n↺ El código es válido por 60 segundos.\n\n*Código:*\n${code}`
      }, { quoted: m })
      return
    }
    if (connection === 'open') {
      await conn.sendMessage(m.chat, { text: 'Conexión establecida con éxito.' }, { quoted: m })
      global.conns = global.conns || []
      global.conns.push(sock)
    } else if (connection === 'close') {
      await conn.sendMessage(m.chat, { text: `Session pendiente, borra la carpeta de ${pathJadiBot}` }, { quoted: m })
    }
  })
}

handler.command = ['qr', 'code']

export default handler