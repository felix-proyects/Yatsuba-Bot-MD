const handler = async (m, { conn }) => {
  const nombre = '@' + (m.sender?.split('@')[0] || 'usuario');
  const texto = `Hola ${nombre} soy ${global.botname} 

Subbots:
• #code
• #qr

RPG:

• #daily

> ${global.texto}`;

  await conn.sendMessage(
    m.chat,
    {
      image: { url: global.menu }, // Usa la imagen desde global.menu
      caption: texto,
      mentions: [m.sender]
    },
    { quoted: m }
  );
};

handler.command = ['menu', 'help'];

export default handler;