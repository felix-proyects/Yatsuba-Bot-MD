// index.js

import './yatsuba.js'
import readline from 'readline'
import { generarQR, generarCode } from './comandos/subs-conexion.js'

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
1. Escribe qr para código QR.
2. Escribe code para código de 8 dígitos.
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
  } else {
    console.log('Opción no válida. Usa qr o code.')
  }
})