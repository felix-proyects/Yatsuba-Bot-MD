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
import { conectarPrincipal, conectarSubbot } from './comandos/subs-conexion.js'

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
    await conectarPrincipal({ tipo: 'qr' })
  } else if (input === 'code') {
    await conectarPrincipal({ tipo: 'code' })
  } else if (input === 'subqr') {
    await conectarSubbot({ tipo: 'qr' })
  } else if (input === 'subcode') {
    await conectarSubbot({ tipo: 'code' })
  } else {
    console.log('Opción no válida. Usa qr, code, subqr o subcode.')
  }
})