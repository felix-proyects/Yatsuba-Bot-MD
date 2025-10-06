import fs from 'fs'

// Lee el objeto de comandos permitidos
const comandos = JSON.parse(fs.readFileSync('./jsons/comandos.json'))

// Esta función debe ser llamada por tu sistema de mensajes antes de ejecutar cualquier comando
export async function before(m, { conn, usedPrefix }) {
  if (!m.text) return
  if (!m.text.startsWith(usedPrefix)) return

  // Saca el nombre del comando (sin prefijo ni argumentos)
  const comando = m.text.slice(usedPrefix.length).split(/\s/)[0].toLowerCase()

  // Si el comando NO existe en el objeto comandos, advierte al usuario
  if (!comandos[comando]) {
    await conn.reply(m.chat, `${emoji} El comando *${usedPrefix}${comando}* no existe o está deshabilitado.`, m)
    return !0
  }
}