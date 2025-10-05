import comandos from '../jsons/comandos.json' assert { type: 'json' }; 

const handler = async (conn, m, prefijo, comando) => {
  if (!comandos[comando]) {
    const emoji = global.emoji || '❌';
    const texto = `${emoji} El comando [${prefijo}${comando}] no existe.\nPara ver la lista de comandos usa:\n> #help`;
    await conn.sendMessage(m.chat, { text: texto }, { quoted: m });
    if (typeof conn.sendMessage === "function") {
      await conn.sendMessage(m.chat, { react: { text: emoji, key: m.key } });
    }
    return true;
  }
  return false;
};

export default handler;