import fs from 'fs';

let handler = async (m, { conn, participants, isAdmin, isBotAdmin }) => {
    // Solo admins pueden usar este comando
    if (!isAdmin) throw `*${emoji} Este comando solo puede ser usado por admins.*`;

    // El bot debe ser admin para promover
    if (!isBotAdmin) throw `*${emoji} Necesito ser admins para ejecutar este comando.*`;

    // Determinar a quién promover: mención o respuesta
    let user = m.mentionedJid?.[0] || m.quoted?.sender;
    if (!user) throw `*${emoji} Menciona o responde al mensaje del usuario que deseas promover.*`;

    // Revisar si ya es admin
    let isTargetAdmin = participants.some(p => p.id === user && p.admin);
    if (isTargetAdmin) throw `${emoji} El usuario mencionado ya es admin.`;

    // Promover
    await conn.groupParticipantsUpdate(m.chat, [user], 'promote');
    m.reply(`*${emoji} Usuario promovido a admin correctamente.*`);
};

handler.command = /^promote$/i; // Reconoce el comando con prefijos (# . etc.)
handler.group = true; // Solo en grupos

export default handler;