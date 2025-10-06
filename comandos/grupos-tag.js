// Código creado por Félix 

const handler = async (m, { conn, text, participants, isAdmin, isBotAdmin }) => {
  // Verifica si el usuario es admin
  if (!isAdmin) {
    await conn.sendMessage(
      m.chat,
      { text: `*${global.emoji} Este comando solo puede ser usado por admins.*` },
      { quoted: m }
    );
    return;
  }

  // Verifica que haya texto
  if (!text) {
    await conn.sendMessage(
      m.chat,
      { text: `*${global.emoji} Escribe el mensaje a enviar. Ejemplo: #tag Hola grupo.*` },
      { quoted: m }
    );
    return;
  }

  // Obtén todos los ids de los participantes salvo el bot
  let mentions = participants
    .filter(u => u.id !== conn.user.jid) // omite al bot
    .map(u => u.id);

  // Envía el mensaje mencionando a todos
  await conn.sendMessage(
    m.chat,
    { text, mentions },
    { quoted: m }
  );
};

handler.command = ['tag', 'hidetag'];
handler.group = true; // solo en grupos

export default handler;