import ws from 'ws'
import { join } from 'path'
import fs from 'fs'

let handler = async (m, { conn }) => {
  const mainBotConn = global.conn

  if (!global.conns || !Array.isArray(global.conns)) global.conns = []

  global.conns = global.conns.filter(subConn => {
    return subConn.user?.jid && subConn.ws?.socket?.readyState === ws.OPEN
  })

  let totalSubs = 0
  let totalPremium = 0
  let totalTemporales = 0

  for (let subConn of global.conns) {
    const subBotNumber = subConn.user.jid.split('@')[0]
    const subBotConfigPath = join('./JadiBot', subBotNumber, 'config.json')

    let premium = false
    let temporal = false

    if (fs.existsSync(subBotConfigPath)) {
      try {
        const subBotConfig = JSON.parse(fs.readFileSync(subBotConfigPath, 'utf-8'))
        if (subBotConfig.premium === true) premium = true
        if (subBotConfig.type && subBotConfig.type.toLowerCase() === 'temporal') temporal = true
      } catch {}
    }

    if (premium) totalPremium++
    else if (temporal) totalTemporales++
    else totalSubs++
  }

  const totalPrincipales = 1
  const totalBots = totalPrincipales + totalPremium + totalSubs + totalTemporales
  const sesiones = totalBots.toLocaleString()

  let botsEnGrupo = 0
  let botsEnGrupoDetalles = []

  function botTipoNombre(subConn) {
    const subBotNumber = subConn.user.jid.split('@')[0]
    const subBotConfigPath = join('./serbots', subBotNumber, 'config.json')
    if (fs.existsSync(subBotConfigPath)) {
      try {
        const subBotConfig = JSON.parse(fs.readFileSync(subBotConfigPath, 'utf-8'))
        if (subBotConfig.premium === true) return 'Premium'
        if (subBotConfig.type && subBotConfig.type.toLowerCase() === 'temporal') return 'Temporal'
      } catch {}
    }
    return 'Sub'
  }

  if (mainBotConn.chats && mainBotConn.chats[m.chat]) {
    botsEnGrupo++
    botsEnGrupoDetalles.push({
      jid: mainBotConn.user.jid,
      tipo: 'Principal'
    })
  }

  for (let subConn of global.conns) {
    if (subConn.chats && subConn.chats[m.chat]) {
      botsEnGrupo++
      botsEnGrupoDetalles.push({
        jid: subConn.user.jid,
        tipo: botTipoNombre(subConn)
      })
    }
  }

  let txt = `ꕥ Lista de bots activos (*${sesiones}* sesiones)\n\n❖ Principales » *${totalPrincipales}*\n✰ Subs » *${totalSubs}*\n\n`

  txt += `❏ En este grupo: *${botsEnGrupo}*\n`

  if (botsEnGrupo > 0) {
    for (let b of botsEnGrupoDetalles) {
      const numero = b.jid.split('@')[0]
      txt += `\t\t• [${b.tipo} ${botname}] » @${numero}\n`
    }
  } else {
    txt += '\t\t🜸 Ningún bot en este grupo\n'
  }

  const mentions = botsEnGrupoDetalles.map(b => b.jid)

  await conn.sendMessage(m.chat, { text: txt, mentions, contextInfo: { ...m.contextInfo, mentionedJid: mentions }
  }, { quoted: m })
}

handler.command = ['sockets', 'bots']
handler.group = true
export default handler