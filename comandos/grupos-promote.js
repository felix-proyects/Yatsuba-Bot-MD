var handler = async (m, { conn, usedPrefix, command }) => {
    let mentionedJid = await m.mentionedJid
    let user = mentionedJid && mentionedJid.length ? mentionedJid[0] : m.quoted && await m.quoted.sender ? await m.quoted.sender : null
    if (!user) return conn.reply(m.chat, `*${emoji} Menciona a un usuario para promoverlo.*`, m)
    try {
        const groupInfo = await conn.groupMetadata(m.chat)
        const ownerGroup = groupInfo.owner || m.chat.split('-')[0] + '@s.whatsapp.net'
        // Si ya es owner o admin, mensaje
        if (user === ownerGroup || groupInfo.participants.some(p => p.id === user && p.admin))
            return conn.reply(m.chat, '*${emoji} El usuario ya es admins.*', m)
        // Promover
        await conn.groupParticipantsUpdate(m.chat, [user], 'promote')
        await conn.reply(m.chat, `*${emoji} Éxito. Espero disfrute.*`, m)
    } catch (e) {
        conn.reply(m.chat, `*${emoji} Se produjo un error, intenta más tarde.*`, m)
    }
}

handler.command = ['promote']
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler