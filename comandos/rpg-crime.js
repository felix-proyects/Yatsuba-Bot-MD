// Dependencias necesarias
const fs = require('fs');
const path = require('path');

// Ruta del archivo JSON
const crimePath = path.join(__dirname, 'jsons/rpg/crime.json');

// Mapa para gestión de cooldowns
const cooldowns = {};

// Función utilitaria para cooldown por usuario/grupo
function canRunCrimeCommand(sender, groupId) {
    const key = `${sender}:${groupId}`;
    const now = Date.now();
    if (cooldowns[key] && now - cooldowns[key] < 5 * 60 * 1000) {
        return false;
    }
    cooldowns[key] = now;
    return true;
}

// Evento de mensajes (ajusta según tu estructura)
conn.ev.on('messages.upsert', async ({ messages }) => {
    let m = messages[0];
    if (!m.message) return;
    // Solo aceptar mensajes en grupo
    if (!m.key.remoteJid.endsWith('@g.us')) return;

    // Texto recibido
    const text = m.message.conversation || m.message.extendedTextMessage?.text || "";

    // Regex para detectar el comando
    if (/^#crime(n)?$/i.test(text.trim())) {
        const sender = m.key.participant || m.key.remoteJid; // Ajusta según tu sistema
        const groupId = m.key.remoteJid;

        // Cooldown de 5 minutos por usuario por grupo
        if (!canRunCrimeCommand(sender, groupId)) {
            await conn.sendMessage(groupId, { text: "⏳ Debes esperar 5 minutos antes de volver a usar este comando." }, { quoted: m });
            return;
        }

        // Leer frases del JSON
        let crimes = [];
        try {
            crimes = JSON.parse(fs.readFileSync(crimePath, 'utf8'));
        } catch (e) {
            await conn.sendMessage(groupId, { text: "❌ Error al leer las frases de crimen." }, { quoted: m });
            return;
        }

        // Elegir frase al azar
        const crime = crimes[Math.floor(Math.random() * crimes.length)];

        // Enviar mensaje
        const msg = `${crime.frase}, obtuviste ${crime.cantidad}`;
        await conn.sendMessage(groupId, { text: msg }, { quoted: m });
    }
});