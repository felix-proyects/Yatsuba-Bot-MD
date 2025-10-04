import readline from 'readline'

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
1. Escribe 'qr' para generar el código QR de vinculación del bot principal.
2. Escribe 'code' para generar el código de 8 dígitos para vinculación del bot principal.
`)

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

rl.on('line', async (input) => {
  input = input.trim().toLowerCase()
  if (input === 'qr') {
    await generarQRPrincipal()
  } else if (input === 'code') {
    await generarCodePrincipal()
  } else {
    console.log('Opción no válida. Escribe "qr" o "code".')
  }
})

// --- CONEXIÓN PRINCIPAL ---
async function generarQRPrincipal() {
  // Importación dinámica solo cuando se necesita
  const { useMultiFileAuthState, fetchLatestBaileysVersion } = await import('@whiskeysockets/baileys')
  const qrcode = (await import('qrcode')).default
  const fs = (await import('fs')).default || (await import('fs'))
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
      console.log('Escanea este QR en WhatsApp para vincular el bot principal:')
      console.log(await qrcode.toString(update.qr, { type: 'terminal', small: true }))
    }
    if (update.connection === 'open') {
      console.log('¡Conexión principal establecida con éxito!')
      process.exit(0)
    }
    if (update.connection === 'close') {
      console.log('Conexión cerrada o pendiente. Elimina la carpeta ./Session si quieres reiniciar.')
      process.exit(1)
    }
  })
}

async function generarCodePrincipal() {
  const { useMultiFileAuthState, fetchLatestBaileysVersion } = await import('@whiskeysockets/baileys')
  const fs = (await import('fs')).default || (await import('fs'))
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
    browser: ['Chrome', 'Chrome', '1.0.0']
  })
  sock.ev.on('creds.update', saveCreds)
  sock.ev.on('connection.update', async (update) => {
    if (typeof sock.requestPairingCode === "function") {
      let code = await sock.requestPairingCode("123456789") // Cambia el número si quieres
      code = code.match(/.{1,4}/g)?.join("-")
      console.log("Código de 8 dígitos:", code)
    }
    if (update.connection === 'open') {
      console.log('¡Conexión principal establecida con éxito!')
      process.exit(0)
    }
    if (update.connection === 'close') {
      console.log('Conexión cerrada o pendiente. Elimina la carpeta ./Session si quieres reiniciar.')
      process.exit(1)
    }
  })
}