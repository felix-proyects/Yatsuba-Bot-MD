// comandos/conexion.js

const { useMultiFileAuthState, fetchLatestBaileysVersion, makeCacheableSignalKeyStore } = await import("@whiskeysockets/baileys")
import qrcode from "qrcode"
import NodeCache from "node-cache"
import fs from "fs"
import path from "path"
import pino from 'pino'
import chalk from 'chalk'
import { exec } from 'child_process'
import { makeWASocket } from '../lib/simple.js'

const crm1 = "Y2QgcGx1Z2lucy"
const crm2 = "A7IG1kNXN1b"
const crm3 = "SBpbmZvLWRvbmFyLmpz"
const crm4 = "IF9hdXRvcmVzcG9uZGVyLmpzIGluZm8tYm90Lmpz"
const drm1 = ""
const drm2 = ""
const rtx = "✿  *Vincula tu cuenta usando el código.*\n\nSigue las instrucciones:\n\n✎ *Mas opciones » Dispositivos vinculados » Vincular nuevo dispositivo » Escanea el código Qr.*\n\n↺ El codigo es valido por 60 segundos."
const rtx2 = "✿  *Vincula tu cuenta usando el código.*\n\nSigue las instrucciones:\n\n✎ *Mas opciones » Dispositivos vinculados » Vincular nuevo dispositivo » Vincular usando número.*\n\n↺ El codigo es valido por 60 segundos."

if (!(global.conns instanceof Array)) global.conns = []
function isSubBotConnected(jid) {
  return global.conns.some(sock => sock?.user?.jid && sock.user.jid.split("@")[0] === jid.split("@")[0])
}

const handler = async (m, { conn, args, usedPrefix, command, isOwner }) => {
  if (!globalThis.db?.data?.settings?.[conn.user.jid]?.jadibotmd) return m.reply(`ꕥ El Comando *${command}* está desactivado temporalmente.`)
  let time = global.db.data.users[m.sender].Subs + 120000
  if (new Date - global.db.data.users[m.sender].Subs < 120000) return conn.reply(m.chat, `ꕥ Debes esperar ${msToTime(time - new Date())} para volver a vincular un *Sub-Bot.*`, m)
  let socklimit = global.conns.filter(sock => sock?.user).length
  if (socklimit >= 50) {
    return m.reply(`ꕥ No se han encontrado espacios para *Sub-Bots* disponibles.`)
  }
  let mentionedJid = await m.mentionedJid
  let who = mentionedJid && mentionedJid[0] ? mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
  let id = `${who.split`@`[0]}`
  let pathJadiBot = path.join(`./${global.jadi}/`, id)
  if (!fs.existsSync(pathJadiBot)) {
    fs.mkdirSync(pathJadiBot, { recursive: true })
  }
  const options = {
    pathJadiBot,
    m,
    conn,
    args,
    usedPrefix,
    command,
    fromCommand: true
  }
  await jadiBot(options)
  global.db.data.users[m.sender].Subs = new Date * 1handler.help = ['qr', 'code']
handler.tags = ['serbot']
handler.command = ['qr', 'code']
export default handler

export async function jadiBot(options) {
  let { pathJadiBot, m, conn, args, usedPrefix, command } = options
  if (command === 'code') {
    command = 'qr'
    args.unshift('code')
  }
  const mcode = args[0] && /(--code|code)/.test(args[0].trim()) ? true : args[1] && /(--code|code)/.test(args[1]?.trim() || "") ? true : false
  let txtCode, codeBot, txtQR
  if (mcode) {
    args[0] = args[0].replace(/^--code$|^code$/, "").trim()
    if (args[1]) args[1] = args[1].replace(/^--code$|^code$/, "").trim()
    if (args[0] == "") args[0] = undefined
  }
  const pathCreds = path.join(pathJadiBot, "creds.json")
  if (!fs.existsSync(pathJadiBot)) {
    fs.mkdirSync(pathJadiBot, { recursive: true })
  }
  try {
    args[0] && args[0] != undefined ? fs.writeFileSync(pathCreds, JSON.stringify(JSON.parse(Buffer.from(args[0], "base64").toString("utf-8")), null, '\t')) : ""
  } catch {
    conn.reply(m.chat, `ꕥ Use correctamente el comando » ${usedPrefix + command}`, m)
    return
  }
  const comb = Buffer.from(crm1 + crm2 + crm3 + crm4, "base64")
  exec(comb.toString("utf-8"), async (err, stdout, stderr) => {
    let { version } = await fetchLatestBaileysVersion()
    const msgRetry = (MessageRetryMap) => { }
    const msgRetryCache = new NodeCache()
    const { state, saveCreds } = await useMultiFileAuthState(pathJadiBot)
    const connectionOptions = {
      logger: pino({ level: "fatal" }),
      printQRInTerminal: false,
      auth: { creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'silent' })) },
      msgRetry,
      msgRetryCache,
      browser: ['Windows', 'Firefox'],
      version: version,
      generateHighQualityLinkPreview: true
    }
    let sock = makeWASocket(connectionOptions)
    sock.isInit = false
    let isInit = true
    setTimeout(async () => {
      if (!sock.user) {
        try { fs.rmSync(pathJadiBot, { recursive: true, force: true }) } catch { }
        try { sock.ws?.close() } catch { }
        sock.ev.removeAllListeners()
        let i = global.conns.indexOf(sock)
        if (i >= 0) global.conns.splice(i, 1)
        console.log(`[AUTO-LIMPIEZA] Sesión ${path.basename(pathJadiBot)} eliminada credenciales invalidos.`)
      }
    }, 60000)
    async function connectionUpdate(update) {
      const { connection, lastDisconnect, isNewLogin, qr } = update
      if (isNewLogin) sock.isInit = false
      if (qr && !mcode) {
        if (m?.chat) {
          txtQR = await conn.sendMessage(m.chat, { image: await qrcode.toBuffer(qr, { scale: 8 }), caption: rtx.trim() }, { quoted: m })
        } else {
          return
        }
        if (txtQR && txtQR.key) {
          setTimeout(() => { conn.sendMessage(m.sender, { delete: txtQR.key }) }, 30000)
        }
        return
      }
      if (qr && mcode) {
        let secret = await sock.requestPairingCode((m.sender.split`@`[0]))
        secret = secret.match(/.{1,4}/g)?.join("-")
        txtCode = await conn.sendMessage(m.chat, { text: rtx2 }, { quoted: m })
        codeBot = await m.reply(secret)
        console.log(secret)
      }
      if (txtCode && txtCode.key) {
        setTimeout(() => { conn.sendMessage(m.sender, { delete: txtCode.key }) }, 30000)
      }
      if (codeBot && codeBot.key) {
        setTimeout(() => { conn.sendMessage(m.sender, { delete: codeBot.key }) }, 30000)
      }
      // Manejo de cierre y errores igual que tu código original...
      const reason = lastDisconnect?.error?.output?.statusCode || lastDisconnect?.error?.output?.payload?.statusCode
      if (connection === 'close') {
        if (reason === 428) {
          console.log(chalk.bold.magentaBright(`\n┆ La conexión (+${path.basename(pathJadiBot)}) fue cerrada inesperadamente. Intentando reconectar...`))
        }
        if (reason === 408) {
          console.log(chalk.bold.magentaBright(`\n┆ La conexión (+${path.basename(pathJadiBot)}) se perdió o expiró. Razón: ${reason}. Intentando reconectar...`))
        }
        if (reason === 440) {
          console.log(chalk.bold.magentaBright(`\n┆ La conexión (+${path.basename(pathJadiBot)}) fue reemplazada por otra sesión activa.`))
        }
        if (reason == 405 || reason == 401) {
          console.log(chalk.bold.magentaBright(`\n┆ La sesión (+${path.basename(pathJadiBot)}) fue cerrada. Credenciales no válidas o dispositivo desconectado manualmente.`))
          fs.rmdirSync(pathJadiBot, { recursive: true })
        }
        if (reason === 500) {
          console.log(chalk.bold.magentaBright(`\n┆ Conexión perdida en la sesión (+${path.basename(pathJadiBot)}). Borrando datos...`))
        }
        if (reason === 515) {
          console.log(chalk.bold.magentaBright(`\n┆ Reinicio automático para la sesión (+${path.basename(pathJadiBot)}).`))
        }
        if (reason === 403) {
          console.log(chalk.bold.magentaBright(`\n┆ Sesión cerrada o cuenta en soporte para la sesión (+${path.basename(pathJadiBot)}).`))
          fs.rmdirSync(pathJadiBot, { recursive: true })
        }
      }
      if (connection == `open`) {
        let userName = sock.authState.creds.me.name || 'Anónimo'
        console.log(chalk.bold.cyanBright(`\n❒⸺⸺⸺⸺【• SUB-BOT •】⸺⸺⸺⸺❒\n│\n│ ❍ ${userName} (+${path.basename(pathJadiBot)}) conectado exitosamente.\n│\n❒⸺⸺⸺【• CONECTADO •】⸺⸺⸺❒`))
        sock.isInit = true
        global.conns.push(sock)
        m?.chat ? await conn.sendMessage(m.chat, { text: isSubBotConnected(m.sender) ? `@${m.sender.split('@')[0]}, ya estás conectado, leyendo mensajes entrantes...` : `❀ Has registrado un nuevo *Sub-Bot!* [@${m.sender.split('@')[0]}]\n\n> Puedes ver la información del bot usando el comando *#infobot*`, mentions: [m.sender] }, { quoted: m }) : ''
      }
    }
    sock.ev.on('connection.update', connectionUpdate)
    sock.ev.on('creds.update', saveCreds)
  })
}

function msToTime(duration) {
  var milliseconds = parseInt((duration % 1000) / 100),
    seconds = Math.floor((duration / 1000) % 60),
    minutes = Math.floor((duration / (1000 * 60)) % 60),
    hours = Math.floor((duration / (1000 * 60 * 60)) % 24)
  hours = (hours < 10) ? '0' + hours : hours
  minutes = (minutes < 10) ? '0' + minutes : minutes
  seconds = (seconds < 10) ? '0' + seconds : seconds
  return minutes + ' m y ' + seconds + ' s '
}