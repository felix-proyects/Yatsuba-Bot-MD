// Código creado por Félix ofc 
// Respeta créditos
// Sistema para ver tu perfil (#profile)
// Puedes usar esta base o código pero respeta créditos porque solo yo se todo el esfuerzo que ago creando códigos va?

import fs from 'fs'
import path from 'path'

let handler = async (m, { conn, usedPrefix, command }) => {
  // Obtén el usuario que ejecutó el comando
  const usuario = m.sender
  const username = usuario.split('@')[0]

  // Carga la configuración de moneda
  let moneda = global.config?.moneda || 'Coins'

  // Ruta de los archivos de monedas
  const dailyPath = path.join(process.cwd(), 'comandos', 'rpg-daily.js')
  const crimePath = path.join(process.cwd(), 'comandos', 'rpg-crime.js')

  // Función para obtener monedas de un archivo
  const getMonedas = (filePath) => {
    if (!fs.existsSync(filePath)) return 0
    try {
      const data = require(filePath)
      return (typeof data === 'object' && data[usuario]) ? Number(data[usuario]) : 0
    } catch (e) {
      return 0
    }
  }

  // Suma total de monedas
  const monedasDaily = getMonedas(dailyPath)
  const monedasCrime = getMonedas(crimePath)
  const totalMonedas = monedasDaily + monedasCrime

  // Obtiene el nombre del bot
  const botname = global.botname || 'Yatsuba IA'

  // Obtiene el texto desde configuración o pon un mensaje por defecto
  const texto = global.textoperfil || '¡Este es tu perfil personalizado!'

  // Foto de perfil
  let pp
  try {
    pp = await conn.profilePictureUrl(usuario, 'image')
  } catch (e) {
    pp = 'https://i.imgur.com/5MuvYQn.png' // Imagen por defecto si no tiene foto
  }

  // Mensaje a enviar
  const mensaje = `
❖ Usuario » @${username}
✰ ${moneda} » *${totalMonedas}*
✰ Bot » *${botname}*

> ${texto}
`.trim()

  // Envía la foto con el mensaje, mencionando al usuario
  await conn.sendMessage(m.chat, { 
    image: { url: pp }, 
    caption: mensaje, 
    mentions: [usuario]
  }, { quoted: m })
}

// Comando
handler.command = ['perfil', 'profile']
export default handler