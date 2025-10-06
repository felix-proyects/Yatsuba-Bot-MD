// Código creado por Félix ofc 
// Respeta créditos
// Sistema para ver tu perfil (#profile)
// Puedes usar esta base o código pero respeta créditos porque solo yo se todo el esfuerzo que ago creando códigos va?


import fetch from 'node-fetch'

let handler = async (m, { conn, usedPrefix }) => {
  try {
    // Detecta el usuario mencionado o el que ejecuta el comando
    let userId = m.mentionedJid && m.mentionedJid.length > 0
      ? m.mentionedJid[0]
      : (m.quoted ? m.quoted.sender : m.sender)

    // Obtiene datos del usuario
    if (!global.db.data.users) global.db.data.users = {}
    const user = global.db.data.users[userId] || {}

    // Suma monedas
    const coin = user.coin || 0
    const bank = user.bank || 0
    const totalMonedas = coin + bank

    // Moneda configurada
    const moneda = global.config?.moneda || 'Coins'
    // Nombre del bot
    const botname = global.botname || 'Yatsuba Nakano'
    // Texto personalizado
    const texto = global.textoperfil || '¡Este es tu perfil personalizado!'

    // Nombre de usuario (mención)
    const username = user.name || userId.split('@')[0]
    // Foto de perfil (por defecto si no tiene)
    let pp
    try {
      pp = await conn.profilePictureUrl(userId, 'image')
    } catch {
      pp = 'https://i.imgur.com/5MuvYQn.png'
    }

    // Mensaje final
    const mensaje = `
❖ Usuario » @${username}
✰ ${moneda} » *${totalMonedas.toLocaleString()}*
✰ Bot » *${botname}*

> ${texto}
`.trim()

    // Envía la foto con el mensaje y mención
    await conn.sendMessage(m.chat, {
      image: { url: pp },
      caption: mensaje,
      mentions: [userId]
    }, { quoted: m })

  } catch (error) {
    await m.reply(`*🜸 Error, intenta más tarde.*`, m, rcanal)
  }
}

handler.command = ['perfil', 'profile']
handler.group = true
export default handler