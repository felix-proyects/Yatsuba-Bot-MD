const handler = async (m, { conn }) => {
  // Verifica si el usuario es el creador
  const senderId = (m.sender || '').replace(/[^0-9]/g, '');
  const creador = '18297933865';
  if (senderId !== creador) {
    await conn.sendMessage(m.chat, { text: '💛 *Este comando solo puede usarlo el creador del bot.*' }, { quoted: m });
    return;
  }

  // Muestra los números directamente aquí
  const numeros = [
    '18297933865'
  ];

  await conn.sendMessage(
    m.chat,
    { text: `💛 Números del sistema:\n${numeros.join('\n')}` },
    { quoted: m }
  );
};

handler.command = ['update', 'up'];

export default handler;