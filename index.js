// index.js

import { execSync } from 'child_process'
import fs from 'fs'

// Instala dependencias si no existe node_modules
if (!fs.existsSync('node_modules')) {
  console.log('Instalando dependencias desde package.json...')
  try {
    execSync('npm install', { stdio: 'inherit' })
    console.log('✔ Dependencias instaladas correctamente.\n')
  } catch (e) {
    console.error('✘ Hubo un error instalando las dependencias:', e)
    process.exit(1)
  }
}

import './yatsuba.js'
import readline from 'readline'
import path from 'path'
import { fileURLToPath } from 'url'
import { generarQR, generarCode, subbotQR, subbotCode } from './comandos/subs-conexion.js'

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
4. Escribe 'subcode' para vincular un SUB-BOT (código de 8 dígitos).
`)

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

rl.on('line', async (input) => {
  input = input.trim().toLowerCase()
  if (input === 'qr') {
    await generarQR(path.join('./', global.sessions))
  } else if (input === 'code') {
    await generarCode(path.join('./', global.sessions))
  } else if (input === 'subqr' || input === 'subcode') {
    // Simula un mensaje para la función subbotQR/subbotCode
    let fakeMsg = {
      chat: 'owner-console',
      sender: 'console-owner@whatsapp.net',
      fromMe: true,
      args: [],
      mentionedJid: [],
    }
    if (input === 'subqr') {
      await subbotQR(fakeMsg, {
        sendMessage: (chat, contenido) => {
          if (contenido.text) console.log('[SUBBOT]', contenido.text)
          if (contenido.image) console.log('[SUBBOT] (Imagen QR generada)')
        },
        reply: (chat, texto) => console.log('[SUBBOT]', texto)
      }, [])
    } else {
      await subbotCode(fakeMsg, {
        sendMessage: (chat, contenido) => {
          if (contenido.text) console.log('[SUBBOT]', contenido.text)
        },
        reply: (chat, texto) => console.log('[SUBBOT]', texto)
      }, [])
    }
  } else {
    console.log('Opción no válida. Usa qr, code, subqr o subcode.')
  }
})