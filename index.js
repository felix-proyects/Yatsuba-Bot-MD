import fs from 'fs'
import readline from 'readline'
import path from 'path'
import { fileURLToPath } from 'url'

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

Yatsuba-Bot-MD
`)

console.log(`
Selecciona una opción:
1. Escribe 'qr' para código QR de subbot.
2. Escribe 'code' para código de 8 dígitos de subbot.
`)

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

rl.on('line', async (input) => {
  input = input.trim().toLowerCase()
  if (['qr', 'code'].includes(input)) {
    try {
      // Importa el comando correspondiente solo cuando se usa
      const comando = await import(`./comandos/conexion.js`)
      // Simula el mensaje y el contexto de la consola
      const fakeMsg = {
        chat: 'terminal',
        sender: 'terminal@whatsapp.net',
        fromMe: true,
        body: input,
        text: input,
        mentionedJid: [],
        args: [input]
      }
      await comando.default(fakeMsg, {
        conn: {
          sendMessage: (chat, obj) => {
            if (obj.text) console.log('[BOT]', obj.text)
            if (obj.image) console.log('[BOT] (Imagen QR generada)')
          },
          reply: (chat, text) => console.log('[BOT]', text)
        },
        args: [input],
        usedPrefix: '',
        command: input,
        isOwner: true
      })
    } catch (e) {
      console.error('Error al ejecutar el comando:', e)
    }
  } else {
    console.log('Opción no válida. Usa qr o code.')
  }
})