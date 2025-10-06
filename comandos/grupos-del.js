let handler = async (m, { conn, isAdmin }) => {
  // Solo admins pueden usarlo
  if (!isAdmin) {
    await conn.reply(m.chat, `${emoji} Solo los administradores pueden usar este comando.`, m)
    return
  }
  // Debe ser respuesta a un mensaje
  if (!m.quoted) {
    await conn.reply(m.chat, `${emoji} Debes responder al mensaje que quieres eliminar usando este comando.`, m)
    return
  }
  // Elimina el mensaje citado
  await conn.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: m.quoted.id, participant: m.quoted.sender }})
}
handler.command = ['del', 'delete']
handler.group = true
export default handler