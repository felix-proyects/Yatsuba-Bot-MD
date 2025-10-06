// Código creado por Félix OFC 

let handler = async (m, { conn, isAdmin }) => {
  if (!m.isGroup) return;
  if (!isAdmin) {
    await conn.reply(m.chat, `${emoji} Solo los administradores pueden activar o desactivar el detector de actividades.`, m);
    return;
  }
  const chat = global.db.data.chats[m.chat];
  if (!chat) return;
  const arg = m.text.trim().split(/\s+/)[1]?.toLowerCase();
  if (arg === 'on') {
    chat.detectActivity = true;
    await conn.reply(m.chat, `${emoji} Detector de actividades *activado*.`, m);
  } else if (arg === 'off') {
    chat.detectActivity = false;
    await conn.reply(m.chat, `${emoji} Detector de actividades *desactivado*.`, m);
  } else {
    await conn.reply(m.chat, `${emoji} Usa: #detect on | #detect off`, m);
  }
};
handler.command = ['detect'];
handler.group = true;
export default handler;

  // Database 

  const chat = global.db.data.chats[update.id];
  if (!chat?.detectActivity) return; // Solo si está activado

  const botJid = (conn.user.id || conn.user.jid || '').split('@')[0];

  for (const participant of update.participants) {
    // Si quien promovió/degradó fue el bot mismo, no avisar
    if (update.who && update.who.split('@')[0] === botJid) continue;

    if (update.action === 'promote') {
      await conn.sendMessage(update.id, {
        text: `${emoji} @${participant.split('@')[0]} fue promovido a administrador del grupo por @${update.who ? update.who.split('@')[0] : 'alguien'}`,
        mentions: [participant, update.who]
      });
    }
    if (update.action === 'demote') {
      await conn.sendMessage(update.id, {
        text: `${emoji} @${participant.split('@')[0]} fue degradado de administrador del grupo por @${update.who ? update.who.split('@')[0] : 'alguien'}`,
        mentions: [participant, update.who]
      });
    }
  }
});