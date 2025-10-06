import fs from 'fs';

const CRIME_PATH = './jsons/rpg/crime.json';
const COOLDOWN = 5 * 60 * 1000; // 5 minutos

let handler = async (m, { conn, usedPrefix, command }) => {
  // Solo en grupos
  if (!m.isGroup) return conn.reply(m.chat, 'Este comando solo puede usarse en grupos.', m);

  let user = global.db.data.users[m.sender];
  user.lastCrime = user.lastCrime || 0;
  user.coin = user.coin || 0;

  const now = Date.now();
  if (now < user.lastCrime) {
    const wait = formatTime(user.lastCrime - now);
    return conn.reply(m.chat, `🧡 Debes esperar *${wait}* para usar *${usedPrefix + command}* de nuevo.`, m, fake);
  }

  // Leer frases desde el JSON externo
  let crimes = [];
  try {
    crimes = JSON.parse(fs.readFileSync(CRIME_PATH));
  } catch {
    return conn.reply(m.chat, '🧡 Error al cargar las frases de crimen.', m, fake);
  }

  // Elegir crimen aleatorio
  const picked = crimes[Math.floor(Math.random() * crimes.length)];

  // Actualizar monedas y cooldown
  user.coin += picked.cantidad;
  user.lastCrime = now + COOLDOWN;

  // Mensaje de resultado
  await conn.reply(m.chat, `🧡 ${picked.frase}, obtuviste *${picked.cantidad.toLocaleString()}* monedas.`, m, fake);
};

handler.command = ['crimen', 'crime'];
handler.group = true;
export default handler;

// Utilidad para formato de tiempo
function formatTime(ms) {
  let totalSec = Math.ceil(ms / 1000);
  let min = Math.floor(totalSec / 60);
  let sec = totalSec % 60;
  return `${min ? min + 'm ' : ''}${sec}s`;
}