import './yatsuba.js'
import readline from 'readline'
import path from 'path'
import { fileURLToPath } from 'url'
import { generarQR, generarCode, JadiBot } from './comandos/subs-conexion.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

console.clear()
console.log(`
██████╗  █████╗ ████████╗██╗   ██╗███████╗██╗   ██╗██████╗  █████╗ 
██╔══██╗██╔══██╗╚══██╔══╝██║   ██║██╔════╝██║   ██║██╔══██╗██╔══██╗
██████╔╝███████║   ██║   ██║   ██║█████╗  ██║   ██║██████╔╝███████║
██╔═══╝ ██╔══██║   ██║   ██║   ██║██╔══╝  ██║   ██║██╔══██╗██╔══██║
██║     ██║  ██║   ██║   ╚██████╔╝███████╗╚██████╔╝██║  ██║██║  ██║
╚═╝     ╚═╝  ╚═╝   ╚═╝    ╚═════╝ ╚══════╝ ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝

${global.botname}
DEV: ${global.texto}
`)

console.log(`
Selecciona una opción:
1. Escribe 'qr' para código QR del BOT principal.
2. Escribe 'code' para código de 8 dígitos del BOT principal.
3. Escribe 'subqr' para vincular un SUB-BOT (QR).
4. Escribe 'subcode' para vincular un SUB-BOT (código).
`)

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

rl.on('line', async (input) => {
  input = input.trim().toLowerCase()
  if (input === 'qr') {
    await generarQR(global.primario)
  } else if (input === 'code') {
    await generarCode(global.primario)
  } else if (input === 'subqr' || input === 'subcode') {
    // Simula un mensaje para la función JadiBot
    let fakeMsg = {
      chat: 'owner-console',
      sender: 'console-owner@whatsapp.net',
      fromMe: true,
      command: input === 'subqr' ? 'qr' : 'code',
      args: [],
      mentionedJid: [],
    }
    await JadiBot({
      pathJadiBot: path.join(global.jadi, 'console-owner'),
      m: fakeMsg,
      conn: {
        sendMessage: (chat, contenido) => {
          if (contenido.text) console.log('[BOT]', contenido.text)
          if (contenido.image) console.log('[BOT] (Imagen QR generada)')
        },
        reply: (chat, texto) => console.log('[BOT]', texto)
      },
      args: [input === 'subcode' ? '--code' : ''],
      usedPrefix: '',
      command: input === 'subqr' ? 'qr' : 'code',
      fromCommand: true
    })
  } else {
    console.log('Opción no válida. Usa qr, code, subqr o subcode.')
  }
})