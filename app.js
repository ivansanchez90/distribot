const {
  createBot,
  createProvider,
  createFlow,
  addKeyword,
} = require('@bot-whatsapp/bot')
require('dotenv').config()

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock')
// const ChatGPTClass = require('./chatgpt.class')

const precioRecargaMatafuego = addKeyword('1').addAnswer([
  'El precio de la recarga de matafuego de 1kg es de $5500',
  'el tiempo de espera es de aproximadamente 1 hora',
])
const matafuegoNuevo1 = addKeyword('5').addAnswer(
  ['Matafuego Nuevo de 1 Kg', 'Precio: $31.000,00'],
  {
    media:
      'https://d22fxaf9t8d39k.cloudfront.net/8660b0b8dda0cd7d3e4cf01be9ba78c4a1ae26142ccab862e54185ea7450a71e84467.jpg',
  }
)

const flowMatafuegos = addKeyword('4').addAnswer(
  [
    'MATAFUEGOS:',
    'Nuestro local se encuentra en Av. Alvear 395 (Esquina Donovan)',
    'Los horarios de atencion son de Lunes a Viernes de 8:00 a 12:00 y de 16:00 a 20:00',
    'Sabados de 8:00 a 13:00',
    '1️⃣ Recarga Matafuego 1Kg',
    '2️⃣ Recarga Matafuego 2,5Kg',
    '3️⃣ Recarga Matafuego 5Kg',
    '4️⃣ Recarga Matafuego 10Kg',
    '5️⃣ Matafuego Nuevo 1Kg',
    '6️⃣ Matafuego Nuevo 2,5Kg',
    '7️⃣ Matafuego Nuevo 5Kg',
    '8️⃣Matafuego Nuevo 10Kg',
  ],
  null,
  null,
  [precioRecargaMatafuego, matafuegoNuevo1]
)

const flowFiltros = addKeyword('1').addAnswer(
  [
    'FILTROS DE AGUA Y PURIFICADORES:',
    'Contamos con una amplia gama de filtros de agua y purificadores.',
    'Podes verlos en nuestra pagina web:',
    'https://www.grupodistrigas.com/purificacion-y-tratamientos-de-agua/',
  ],
  null,
  null
)

const flowPrincipal = addKeyword([
  'hola',
  'alo',
  'ola',
  'buenas',
  'buenos',
]).addAnswer(
  [
    '👋¡Hola! Bienvenido a Grupo Distrigas.',
    'Somos especialistas en agua, seguridad industrial, gases y más. ¿Sobre qué categoría querés consultar?',
    '1️⃣ Filtros de agua y purificadores',
    '2️⃣ Dispensers de agua frío/calor',
    '3️⃣ Recarga de gases industriales (CO₂, Butano, Nitrógeno, Oxígeno)',
    '4️⃣ Venta y recarga de matafuegos',
    '5️⃣ Productos para piscinas',
    '6️⃣ Electrodomésticos (línea hogar y seguridad)',
    '7️⃣ Estado de un pedido o servicio',
    '8️⃣ Hablar con un asesor humano',
  ],

  { capture: true },
  (ctx, { fallBack }) => {
    const validOptions = ['1', '2', '3', '4', '5', '6', '7', '8']
    const choice = ctx.body.trim()
    if (validOptions.includes(choice)) {
      return true // la entrada es correcta, continúa al sub-flujo correspondiente
    }
    // si no es válida, mostramos mensaje de error y reimprimimos el menú
    return fallBack(
      '❌ Opción no válida. Por favor elegí sólo uno de los números del 1️⃣ al 8️⃣:'
    )
  },
  [flowMatafuegos, flowFiltros]
)

// const createBotGPT = async ({ provider, database }) => {
//   return new ChatGPTClass(database, provider)
// }

const main = async () => {
  const adapterDB = new MockAdapter()
  const adapterFlow = createFlow([flowPrincipal])
  const adapterProvider = createProvider(BaileysProvider)

  createBot({
    flow: adapterFlow,
    provider: adapterProvider,
    database: adapterDB,
  })

  QRPortalWeb()
}

main()
