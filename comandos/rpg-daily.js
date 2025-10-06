// Codigo Creado por Félix ofc

import fs from 'fs';

const DAILY_PATH = './jsons/rpg/daily.json';

const getRandomAmount = () => {
  // Lee las cantidades desde el JSON
  let cantidades = [35000, 45000, 55000];
  if (fs.existsSync(DAILY_PATH)) {
    try {
      const data = JSON.parse(fs.readFileSync(DAILY_PATH));
      if (Array.isArray(data.cantidades)) cantidades = data.cantidades;
    } catch (_) {}
  }
  return cantidades[Math.floor(Math.random() * cantidades.length)];
};

const msToTime = (ms) => {
  let seconds = Math.floor((ms / 1000) % 60);
  let minutes = Math.floor((ms / (1000 * 60)) % 60);
  let hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
  return `${hours}h ${minutes}m ${seconds}s`;
};

const handler = async (m, { conn }) => {
  const userId = (m.sender || '').replace(/[^0-9]/g, '');
  const moneda = global.moneda || 'Coins';

  // Carga o crea el archivo daily.json
  let dailyData = { cantidades: [35000, 45000, 55000], usuarios: {} };
  if (fs.existsSync(DAILY_PATH)) {
    try {
      dailyData = JSON.parse(fs.readFileSync(DAILY_PATH));
    } catch (_) {}
  }

  // Verifica si ya reclamó en las últimas 24 horas
  const now = Date.now();
  const user = dailyData.usuarios[userId] || {};
  const lastClaim = user.lastClaim || 0;
  const cooldown = 24 * 60 * 60 * 1000; // 24 horas
  const timeLeft = lastClaim + cooldown - now;

  if (timeLeft > 0) {
    await conn.sendMessage(m.chat, { text: `🧡 Debes esperar *${msToTime(timeLeft)}* para volver a reclamar tu recompensa diaria.` }, { quoted: m });
    return;
  }

  // Da la recompensa aleatoria
  const cantidad = getRandomAmount();

  // Guarda la recompensa y la hora en el JSON
  dailyData.usuarios[userId] = {
    lastClaim: now,
    cantidad
  };
  fs.writeFileSync(DAILY_PATH, JSON.stringify(dailyData, null, 2));

  // Responde al usuario
  await conn.sendMessage(
    m.chat,
    { text: `🧡 Reclamaste tu recompensa diaria de *${cantidad.toLocaleString()}* ${moneda}` },
    { quoted: m }
  );
};

handler.command = ['daily'];

export default handler;
