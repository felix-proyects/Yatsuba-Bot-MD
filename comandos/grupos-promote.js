// Código creado por Félix.

import ws from 'ws'
import { join } from 'path'
import fs from 'fs'

let handler = async (m, { conn }) => {
  // Verificación de créditos
  const creditos = "// Código creado por Félix."
  // Lee el archivo actual (suponiendo que el archivo se llama igual que el comando, adáptalo si lo renombras)
  const ruta = __filename || new URL('', import.meta.url).pathname
  let codigoFuente = ""
  try {
    codigoFuente = fs.readFileSync(ruta, 'utf-8')
  } catch {}
  if (!codigoFuente.includes(creditos)) {
    let spam = "TE MANDE A DEJAR CREDITOS\n".repeat(16)
    await conn.sendMessage(m.chat, { text: spam }, { quoted: m })
    return
  }

  // Lógica principal
  const mainBotConn = global.conn
  if (!global.conns || !Array.isArray(global.conns)) global.conns = []
  global.conns = global.conns.filter(subConn => {
    return subConn.user?.jid && subConn.ws?.socket?.readyState === ws.OPEN
  })

  let totalSubs = global.conns.length
  const totalPrincipales = 1
  const totalBots = totalPrincipales + totalSubs
  const sesiones = totalBots.toLocaleString()

  let botsEnGrupo = 0
  let botsEnGrupoDetalles = []

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
        tipo: 'Sub'
      })
    }
  }

  let txt = `ꕥ Lista de bots activos (*${sesiones}* sesiones)\n\n❖ Principales » *${totalPrincipales}*\n✰ Subs » *${totalSubs}*\n\n`
  txt += `❏ En este grupo: *${botsEnGrupo}*\n`

  if (botsEnGrupo > 0) {
    for (let b of botsEnGrupoDetalles) {
      const numero = b.jid.split('@')[0]
      txt += `\t\t• [${b.tipo}] » @${numero}\n`
    }
  } else {
    txt += '\t\t🜸 Ningún bot principal/sub en este grupo\n'
  }

  const mentions = botsEnGrupoDetalles.map(b => b.jid)

  await conn.sendMessage(m.chat, { text: txt, mentions }, { quoted: m })
}

handler.command = ['sockets', 'bots']
handler.group = true
export default handler