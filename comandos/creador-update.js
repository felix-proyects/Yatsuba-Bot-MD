const handler = async (m, { conn }) => {
  // Verifica si el usuario es el creador
  const senderId = (m.sender || '').replace(/[^0-9]/g, '');
  const creadores = global.creador?.map(id => id.replace(/[^0-9]/g, '')) || [];
  if (!creadores.includes(senderId)) {
    await conn.sendMessage(m.chat, { text: '${global.emoji} *Este comando solo puede usarlo el creador del bot.*' }, { quoted: m });
    return;
  }

  await conn.sendMessage(m.chat, { text: '${global.emoji} Reiniciando el bot para aplicar actualizaciones...' }, { quoted: m });
  await new Promise(resolve => setTimeout(resolve, 1500)); // Mensaje visible antes de reinicio
  process.exit(0); // Reinicia el proceso; el panel lo volverá a iniciar automáticamente
};

handler.command = ['update', 'up'];

export default handler;