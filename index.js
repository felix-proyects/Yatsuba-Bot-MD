// Archivo index.js simplificado y adaptable para Perro Hoshino Bot

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '1'

import readline from 'readline'
import cfonts from 'cfonts'
import chalk from 'chalk'
import fs from 'fs'
import path from 'path'

// --- Mensajes de bienvenida ---
console.clear()
cfonts.say('Perro-Bot', {
  font: 'chrome',
  align: 'center',
  gradient: ['#ff4fcb', '#ff77ff'],
})
cfonts.say('Desarroll', {
  font: 'console',
  align: 'center',
  colors: ['blueBright']
})

console.log(chalk.magentaBright(`CONEXIÓN  CON ${botname}.

Este proyecto está desarrollado por Félix ofc y modificado o editado por ${dev}.`))

console.log(chalk.white(`
Selecciona una opción para vincular el bot:
1. Escribe 'qr' para vincular por código QR.
2. Escribe 'code' para vincular por código de 8 dígitos.
`))

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

// --- Menú ---
rl.on('line', async (input) => {
  input = input.trim().toLowerCase()
  if (input === 'qr') {
    await iniciarBotPrincipalQR()
  } else if (input === 'code') {
    await iniciarBotPrincipalCodigo()
  } else {
    console.log(chalk.red('Opción inválida. Escribe "qr" o "code".'))
  }
})

// --- Función para iniciar por QR ---
async function iniciarBotPrincipalQR() {
  const { useMultiFileAuthState, fetchLatestBaileysVersion } = await import('@whiskeysockets/baileys')
  const qrcode = (await import('qrcode')).default
  const pino = (await import('pino')).default
  const { makeWASocket } = await import('./lib/simple.js')
  const SESSION_FOLDER = './Session'

  if (!fs.existsSync(SESSION_FOLDER)) fs.mkdirSync(SESSION_FOLDER, { recursive: true })
  const { state, saveCreds } = await useMultiFileAuthState(SESSION_FOLDER)
  const { version } = await fetchLatestBaileysVersion()
  const sock = makeWASocket({
    auth: state,
    version,
    logger: pino({ level: "fatal" }),
    browser: ['Chrome', 'Chrome', '1.0.0'],
    printQRInTerminal: false
  })
  sock.ev.on('creds.update', saveCreds)
  sock.ev.on('connection.update', async (update) => {
    if (update.qr) {
      console.log(chalk.bold.cyan('\nEscanea este QR en WhatsApp para vincular tu bot:'))
      console.log(await qrcode.toString(update.qr, { type: 'terminal', small: true }))
    }
    if (update.connection === 'open') {
      console.log(chalk.bold.green('\n¡Bot Perro Hoshino conectado con éxito!'))
      await cargarHandler(sock)
      process.exit(0)
    }
    if (update.connection === 'close') {
      console.log(chalk.red('\nConexión cerrada. Elimina la carpeta ./PerroSession para reiniciar.'))
      process.exit(1)
    }
  })
}

// --- Función para iniciar por número/código de 8 dígitos ---
async function iniciarBotPrincipalCodigo() {
  const { useMultiFileAuthState, fetchLatestBaileysVersion } = await import('@whiskeysockets/baileys')
  const pino = (await import('pino')).default
  const { makeWASocket } = await import('./lib/simple.js')
  const SESSION_FOLDER = './Session'

  if (!fs.existsSync(SESSION_FOLDER)) fs.mkdirSync(SESSION_FOLDER, { recursive: true })
  const { state, saveCreds } = await useMultiFileAuthState(SESSION_FOLDER)
  const { version } = await fetchLatestBaileysVersion()
  const sock = makeWASocket({
    auth: state,
    version,
    logger: pino({ level: "fatal" }),
    browser: ['Chrome', 'Chrome', '1.0.0'],
    printQRInTerminal: false
  })
  sock.ev.on('creds.update', saveCreds)
  sock.ev.on('connection.update', async (update) => {
    if (typeof sock.requestPairingCode === "function") {
      let telefono = await pedirNumeroTelefono()
      let code = await sock.requestPairingCode(telefono)
      code = code.match(/.{1,4}/g)?.join("-")
      console.log(chalk.bold.magenta('\nCódigo de vinculación:'), chalk.bold.white(code))
    }
    if (update.connection === 'open') {
      console.log(chalk.bold.green('\nEXITO EN LA CONEXIÓN'))
      await cargarHandler(sock)
      process.exit(0)
    }
    if (update.connection === 'close') {
      console.log(chalk.red('\nConexión cerrada. Elimina la carpeta ./PerroSession para reiniciar.'))
      process.exit(1)
    }
  })
}

// --- Pedir número de teléfono ---
async function pedirNumeroTelefono() {
  return await new Promise(resolve => {
    rl.question(chalk.bold.yellow('\n✦ Ingresa tu número de WhatsApp (ej: 573123456789): '), num => {
      num = num.replace(/\D/g, '')
      if (!num.startsWith('+' && num.length > 8)) num = `+${num}`
      rl.pause()
      resolve(num)
    })
  })
}

// --- Cargar handler principal ---
async function cargarHandler(sock) {
  // Aquí puedes importar tu handler.js y conectar eventos
  try {
    let handler = await import('./manejador.js')
    if (handler.default) handler = handler.default
    sock.ev.on('messages.upsert', handler)
    // Puedes agregar más eventos aquí
  } catch (e) {
    console.error('Error cargando handler:', e)
  }
}
