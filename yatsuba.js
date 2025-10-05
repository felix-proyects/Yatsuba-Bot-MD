// Código creado por Félix 
// Si quieres cambiar el nombre a este archivo solo copia todo el contenido, borra el archivo y crea uno nuevo con este contenido y un nuevo nombre.

import apis from './jsons/apis.json' assert { type: 'json' };
global.apis = apis;

import fs from 'fs'

const pathCreador = './jsons/creador.json'

let creador = []
try {
  creador = JSON.parse(fs.readFileSync(pathCreador, 'utf8'))
} catch (e) {
  console.error('[Yatsuba] Error cargando creador:', e)
  creador = []
}

// Configuraciones principales 

global.texto = '𝐌ᥲძᥱ 𝐖і𝗍һ ᑲᥡ 𝐃ᥱ᥎ 𝐅ᥱᥣі᥊';
global.dev = 'Félix ofc';
global.botname = 'ᥡᥲ𝗍sᥙᑲᥲ ᥒᥲkᥲᥒ᥆';
global.canal = '120363403383693686@newsletter';
global.grupo = '120363422151459611@g.us';
global.menu = 'https://files.catbox.moe/tgxh5z.jpg';
global.logo = 'https://files.catbox.moe/gr48op.jpg';
global.moneda = 'Coins';
global.creador = creador

// Configuraciones para vincular 

global.sessions = "Session"           // Carpeta de sesión principal del bot
global.jadi = "JadiBots"              // Carpeta para almacenar las sesiones de subbots
global.Jadibots = true

// Configuración final 

console.log(chalk.redBright("Update 'yatsuba.js'"))
import(`${file}?update=${Date.now()}`)
})
