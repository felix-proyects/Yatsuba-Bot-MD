import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import './yatsuba.js'
import * as contextos from './implementar/contextos.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export class Handler {
  constructor(conn) {
    this.conn = conn
    this.comandos = []
  }

  async cargarComandos(directorio = './comandos') {
    const ruta = path.join(__dirname, directorio)
    const archivos = fs.readdirSync(ruta).filter(f => f.endsWith('.js'))
    for (let file of archivos) {
      const modulo = await import(path.join(ruta, file))
      const handler = modulo.default
      if (handler && handler.command) {
        this.comandos.push(handler)
      }
    }
  }

  // Helpers de permisos
  esCreador(jid) {
    return global.creador.includes(jid?.replace(/[^0-9]/g, ''))
  }
  esGrupo(m) {
    return m.chat?.endsWith('@g.us')
  }
  esBot(jid) {
    return jid === global.botjid
  }

  mensajePermiso(tipo, comando) {
    switch (tipo) {
      case 'creador':  return `☆ El comando ${comando} solo puede ser usado por mi creador.`
      case 'grupos':   return `☆ El comando ${comando} solo puede ser usado en grupos.`
      case 'bot':      return `☆ El comando ${comando} solo puede ser usado por el socket.`
      default:         return 'Permiso denegado.'
    }
  }

  async manejarMensaje(m) {
    let texto = m.message?.conversation || m.message?.extendedTextMessage?.text || m.body || ''
    if (!texto) return

    const args = texto.trim().split(/\s+/)
    const cmd = args[0].replace(/^([!#/.])/, '').toLowerCase()

    for (let handler of this.comandos) {
      if (!handler.command) continue
      const triggers = Array.isArray(handler.command) ? handler.command : [handler.command]
      if (!triggers.includes(cmd)) continue

      // Restricciones clásicas
      if (handler.onlyOwner && !this.esCreador(m.sender || m.participant || m.key?.participant)) {
        await this.conn.sendMessage(m.chat, { text: this.mensajePermiso('creador', cmd) }, { quoted: m })
        return
      }
      if (handler.onlyGroup && !this.esGrupo(m)) {
        await this.conn.sendMessage(m.chat, { text: this.mensajePermiso('grupos', cmd) }, { quoted: m })
        return
      }
      if (handler.onlyBot && !this.esBot(m.sender || m.participant || m.key?.participant)) {
        await this.conn.sendMessage(m.chat, { text: this.mensajePermiso('bot', cmd) }, { quoted: m })
        return
      }

      try {
        // Ejecutar comando, pasando contextos y globales
        await handler(m, {
          conn: this.conn,
          args,
          texto,
          contextos,
          botname: global.botname,
          tipo: global.tipo,
          global
        })
      } catch (e) {
        await this.conn.sendMessage(m.chat, { text: `✘ Ocurrió un error.\n\n${e}` }, { quoted: m })
        console.error(e)
      }
      break // solo ejecuta el primer comando que coincida
    }
  }
}