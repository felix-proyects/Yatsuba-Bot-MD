// comandos/menu.js

const handler = async (m, { conn }) => {
  const nombre = '@' + (m.sender?.split('@')[0] || 'usuario');
  const texto = `Hola ${nombre} soy ${global.botname}
Aquí tienes la lista de comandos:

( aquí pondré los comandos )

Recuerda usar el prefijo del bot para cada comando.`;

  await conn.sendMessage(m.chat, { text: texto, mentions: [m.sender] }, { quoted: m });
};

handler.command = ['menu', 'help'];

export default handler;