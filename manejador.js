// Codigo Creado por Félix 

import './yatsuba.js';

export const handler = {
  /**
   * Verifica si el usuario es creador
   */
  esCreador: (jid) => global.creador.includes(jid.replace(/[^0-9]/g, '')),

  /**
   * Verifica si el mensaje es de grupo
   */
  esGrupo: (msg) => !!msg.key.remoteJid.endsWith('@g.us'),

  /**
   * Verifica si es el propio bot
   */
  esBot: (jid) => jid === global.botjid,

  /**
   * Mensaje si no es creador
   */
  creador: (comando) => `☆ El comando ${comando} solo puede ser usado por mi creador.`,

  /**
   * Mensaje si no es grupo
   */
  grupos: (comando) => `☆ El comando ${comando} solo puede ser usado en grupos.`,

  /**
   * Mensaje si solo es para el bot/socket
   */
  bot: (comando) => `☆ El comando ${comando} solo puede ser usado por el socket.`,

  /**
   * Handler central para comandos (ejemplo)
   */
  async manejarComando(sock, msg) {
    let texto = msg.message?.conversation || msg.message?.extendedTextMessage?.text || '';
    let jid = msg.key.participant || msg.key.remoteJid;
    let isGroup = this.esGrupo(msg);

    // Ejemplo de comando solo para creadores
    if (texto.startsWith('!soloowner')) {
      if (!this.esCreador(jid)) {
        await sock.sendMessage(msg.key.remoteJid, { text: this.creador('!soloowner') });
        return;
      }
      await sock.sendMessage(msg.key.remoteJid, { text: '¡Comando ejecutado solo por el creador!' });
    }

    // Ejemplo de comando solo para grupos
    if (texto.startsWith('!sologrupo')) {
      if (!isGroup) {
        await sock.sendMessage(msg.key.remoteJid, { text: this.grupos('!sologrupo') });
        return;
      }
      await sock.sendMessage(msg.key.remoteJid, { text: '¡Comando ejecutado solo en grupos!' });
    }

    // Ejemplo: usar variables globales y tipo
    if (texto.startsWith('!info')) {
      await sock.sendMessage(msg.key.remoteJid, { text: `Hola soy ${global.botname} (${global.tipo})` });
    }
  }
};
