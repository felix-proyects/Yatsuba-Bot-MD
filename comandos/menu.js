const handler = async (m, { conn }) => {
  const nombre = '@' + (m.sender?.split('@')[0] || 'usuario');
  const texto = `𝐇𝐨𝐥𝐚! *${nombre},* soy $*{global.botname}.*


╭⬣「 ✰ 𝐈𝐧𝐟𝐨-𝐁𝐨𝐭 ✰ 」⬣
│Creador: Félix
│Estado: Activado
│Comandos: 3
╰───────────

╭⬣「 ✰ 𝐑𝐏𝐆 ✰ 」⬣
│#daily
╰────────

╭⬣「 ✰ 𝐆𝐑𝐔𝐏𝐎𝐒 ✰ 」
│#tag
│#hidetag
╰────────

╭⬣「 ✰ 𝐒𝐔𝐁𝐒 ✰ 」⬣
│#qr
│#code
╰────────

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
handler.group = true;

export default handler;