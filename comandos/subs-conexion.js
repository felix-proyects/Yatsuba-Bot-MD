// comandos/subs-conexion.js

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

export async function subbotQR(m, conn, args) {
  // Ruta para la sesión del subbot: ./JadiBots/<id>
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
    if (qr) {
      if (m?.chat) {
        let buffer = await qrcode.toBuffer(qr, { scale: 8 })
        await conn.sendMessage(m.chat, {
          image: buffer,
          caption: "✿  *Vincula tu cuenta usando el código.*\n\nSigue las instrucciones:\n\n✎ *Mas opciones » Dispositivos vinculados » Vincular nuevo dispositivo » Escanea el código Qr.*\n\n↺ El codigo es valido por 60 segundos."
        }, { quoted: m })
      } else {
        console.log('[SUBBOT] QR generado. Escanéalo desde WhatsApp.')
      }
      return
    }
    if (connection === 'open') {
      if (m?.chat) await conn.sendMessage(m.chat, { text: 'Conexión establecida con éxito.' }, { quoted: m })
      else console.log('Conexión establecida con éxito.')
      global.conns.push(sock)
    } else if (connection === 'close') {
      if (m?.chat) await conn.sendMessage(m.chat, { text: `Session pendiente, borra la carpeta de ${pathJadiBot}` }, { quoted: m })
      else console.log(`Session pendiente, borra la carpeta de ${pathJadiBot}`)
    }
  })
}

export async function subbotCode(m, conn, args) {
  // Ruta para la sesión del subbot: ./JadiBots/<id>
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
    if (typeof sock.requestPairingCode === "function" && m?.sender) {
      let code = await sock.requestPairingCode(m.sender.split("@")[0])
      code = code.match(/.{1,4}/g)?.join("-")
      await conn.sendMessage(m.chat, {
        text: `✿  *Vincula tu cuenta usando el código.*\n\nSigue las instrucciones:\n\n✎ *Mas opciones » Dispositivos vinculados » Vincular nuevo dispositivo » Vincular usando número.*\n\n↺ El codigo es valido por 60 segundos.\n\n*Código:*\n${code}`
      }, { quoted: m })
      return
    }
    if (connection === 'open') {
      if (m?.chat) await conn.sendMessage(m.chat, { text: 'Conexión establecida con éxito.' }, { quoted: m })
      else console.log('Conexión establecida con éxito.')
      global.conns.push(sock)
    } else if (connection === 'close') {
      if (m?.chat) await conn.sendMessage(m.chat, { text: `Session pendiente, borra la carpeta de ${pathJadiBot}` }, { quoted: m })
      else console.log(`Session pendiente, borra la carpeta de ${pathJadiBot}`)
    }
  })
}

handler.command = ['code', 'qr,'];

export default handler 