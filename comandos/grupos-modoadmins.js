let handler = async (m, { conn, args, isAdmin, isBotAdmin, groupMetadata }) => {
  // Sólo se ejecuta en grupos
  if (!m.isGroup) return m.reply('*❖ Este comando solo puede usarse en grupos.*', m)

  // Inicializamos la variable de modo admin por grupo
  global.db.data.chats = global.db.data.chats || {}
  let chat = global.db.data.chats[m.chat] = global.db.data.chats[m.chat] || {}
  chat.modoadmin = chat.modoadmin || false

  // Verifica si es admin
  if (!isAdmin) {
    return m.reply('*❖ Solo admins pueden usar este comando.*', m)
  }

  // Sin argumentos, muestra ayuda
  if (!args[0]) {
    return m.reply(
      `🜸 Puedes activar o desactivar este modo usando:\n\n  Activar modo admin
  if (/^(on|activar|true)$/i.test(args[0])) {
    if (chat.modoadmin) {
      return m.reply('*❖ Este modo ya estaba activado.*', m)
    }
    chat.modoadmin = true
    return m.reply('*❖ Modo solo admins activado.*', m)
  }

  // Desactivar modo admin
  if (/^(off|desactivar|false)$/i.test(args[0])) {
    if (!chat.modoadmin) {
      return m.reply('*❖ Este modo ya estaba desactivado.*', m, rcanal)
    }
    chat.modoadmin = false
    return m.reply('*❖ Modo solo admins desactivado.*', m)
  }

  // Opciones inválidas
  return m.reply(
    `🜸 Puedes activar o desactivar este modo usando:\n\n` +
    `✰ on » para activar.\n` +
    `✰ off » para desactivar.`
  , m)
}

handler.command = ['modoadmin', 'onlyadmin']
handler.group = true
handler.admin = true // Opcional, para que sólo admins puedan usarlo

export default handler