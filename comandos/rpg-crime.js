import fs from 'fs';
import './yatsuba.js'; // Asegúrate de importar el archivo donde están global.emoji y global.canal

const cooldown = 5 * 60 * 1000; // 5 minutos
const used = {};

const handler = async (m, { isGroup, sender, chat, conn }) => {
  if (!isGroup) return m.reply(`${global.emoji} Este comando solo funciona en grupos.`, null, {
    forwardingScore: 999,
    isForwarded: true,
    externalAdReply: {
      title: 'Yatsuba Channel',
      body: '',
      sourceUrl: '',
      mediaType: 1,
      renderLargerThumbnail: false,
      showAdAttribution: false,
      previewType: 'PHOTO',
      thumbnailUrl: '',
      thumbnail: null,
      jpegThumbnail: null,
      contextInfo: { 
        forwardingScore: 999, 
        isForwarded: true, 
        mentionedJid: [],
        externalAdReply: {
          title: 'Yatsuba Channel',
          sourceUrl: '',
          mediaType: 1,
          thumbnailUrl: '',
        },
        forwardingScore: 999,
        isForwarded: true,
        forwardingScore: 999,
        isForwarded: true,
        forwardingScore: 999,
        isForwarded: true,
      },
      contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
        forwardingScore: 999,
        isForwarded: true,
        participant: global.canal,
        forwardingScore: 999,
        isForwarded: true,
        // Si tu framework soporta nombre de canal, puede requerir más propiedades, revisa documentación.
        // Si no soporta, con el participant y forwardingScore ya da la apariencia.
      }
    }
  });

  const key = `${chat}:${sender}`;
  if (used[key] && (Date.now() - used[key]) < cooldown) {
    const t = Math.ceil((cooldown - (Date.now() - used[key])) / 60000);
    return m.reply(`${global.emoji} Debes esperar ${t} minuto(s) antes de volver a usar este comando.`, null, {
      contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
        participant: global.canal,
        forwardingScore: 999,
        isForwarded: true,
      }
    });
  }
  used[key] = Date.now();

  const crimeData = JSON.parse(fs.readFileSync('./jsons/rpg/crime.json'));
  const pick = crimeData[Math.floor(Math.random() * crimeData.length)];
  
  m.reply(`${global.emoji} ${pick.frase}, obtuviste ${pick.cantidad}`, null, {
    contextInfo: {
      forwardingScore: 999,
      isForwarded: true,
      participant: global.canal,
      forwardingScore: 999,
      isForwarded: true,
      // Algunos frameworks aceptan 'forwardingScore'/'isForwarded' y 'participant' para aparentar reenviado de canal
      // Si tu framework soporta más campos, puedes agregar 'remoteJid', 'fromMe', 'mentionedJid', etc. según necesidad.
      // El nombre visible será "Yatsuba Channel" si tu bot soporta mostrarlo, si no, puedes personalizar el mensaje.
    }
  });
};

handler.command = /^([#.])(crime|crimen)$/i;
export default handler;