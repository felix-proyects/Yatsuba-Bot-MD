// Código creado por Félix OFC 

import fs from 'fs'

// Carga los comandos válidos desde el archivo JSON como objeto
const comandos = JSON.parse(fs.readFileSync('./jsons/comandos.json'))

export async function before(m, { conn, usedPrefix }) {
  if (!m.text) return
  if (!m.text.startsWith(usedPrefix)) return

  // Extrae el comando sin prefijo ni argumentos
  const comando = m.text.slice(usedPrefix.length).split(/\s/)[0].toLowerCase()

  // Si el comando NO está en el objeto comandos, advierte
  if (!comandos[comando]) {
    await conn.reply(m.chat, `${emoji} El comando *${usedPrefix}${comando}* no existe o está deshabilitado.`, m)
    return !0
  }
}