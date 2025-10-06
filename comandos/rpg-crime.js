// Codigo Creado por Félix ofc

import fs from 'fs';
import './yatsuba.js';

const cooldown = 5 * 60 * 1000; // 5 minutos
const used = {};

const handler = async (m, { isGroup, sender, chat }) => {
  if (!isGroup) return m.reply('${global.emoji} Este comando solo funciona en grupos.');

  const key = `${chat}:${sender}`;
  if (used[key] && (Date.now() - used[key]) < cooldown) {
    const t = Math.ceil((cooldown - (Date.now() - used[key])) / 60000);
    return m.reply(`${global.emoji} Debes esperar ${t} minuto(s) antes de volver a usar este comando.`);
  }
  used[key] = Date.now();

  const crimeData = JSON.parse(fs.readFileSync('./jsons/rpg/crime.json'));
  const pick = crimeData[Math.floor(Math.random() * crimeData.length)];
  
  m.reply(`${global.emoji} ${pick.frase}, obtuviste ${pick.cantidad} ${global.moneda}`);
};

handler.command = /^([#.])(crime|crimen)$/i;
export default handler;