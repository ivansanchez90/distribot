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
// const fs = require('fs')
// const util = require('util')
// const exec = util.promisify(require('child_process').exec)

// // Carga de productos desde CSV
// const productos = []
// try {
//   const csv = fs.readFileSync('productos.csv', 'utf8')
//   const lines = csv.split('\n').filter((l) => l.trim())
//   const headers = lines
//     .shift()
//     .split(',')
//     .map((h) => h.trim().toLowerCase())
//   lines.forEach((line) => {
//     const cols = line.split(',').map((c) => c.trim())
//     const obj = {}
//     headers.forEach((h, i) => (obj[h] = cols[i] || ''))
//     productos.push(obj)
//   })
//   console.log(`Cargados ${productos.length} productos desde CSV`)
// } catch (e) {
//   console.error('Error al leer productos.csv:', e)
// }

// // Función para consultar LLM local con Ollama
// async function queryLLM(prompt) {
//   try {
//     const { stdout } = await exec(
//       `ollama run llama3 --quiet --prompt "${prompt.replace(/"/g, '\\"')}"`
//     )
//     return stdout.trim()
//   } catch (e) {
//     console.error('Error al ejecutar Ollama:', e)
//     return 'Lo siento, ocurrió un error al procesar tu consulta.'
//   }
// }

// // Flow que procesa la consulta del usuario
// const flowProcesarConsulta = addKeyword([/.*/]).addAnswer(async (ctx) => {
//   console.log('Consulta de productos:', ctx.body)

//   const term = ctx.body.trim().toLowerCase()
//   const matches = productos.filter((p) =>
//     Object.values(p).some((v) => v.toLowerCase().includes(term))
//   )
//   if (matches.length === 0) {
//     return ['Lo siento, no encontré productos que coincidan con tu búsqueda.']
//   }
//   const prompt = `
// Eres un asistente experto en productos de Grupo Distrigas.
// Dispones de esta lista de productos:
// ${JSON.stringify(matches.slice(0, 10), null, 2)}

// Consulta del usuario: "${ctx.body.trim()}"

// Responde sugiriendo hasta 5 productos relevantes con nombre, categoría, precio y link si está disponible.
//     `.trim()

//   const respuestaLLM = await queryLLM(prompt)
//   return [respuestaLLM]
// })

// // Flow de consulta de productos - Paso 1: solicitud de término de búsqueda
// const flowConsultaProductos = addKeyword('9').addAnswer(
//   [
//     '🛒 Consulta de productos',
//     'Por favor, indícanos qué producto o característica estás buscando.',
//   ],
//   { capture: true },
//   (ctx, { fallBack }) => {
//     console.log('Consulta de productos:', ctx.body.trim())

//     // const term = ctx.body && ctx.body.trim()
//     // if (!term) {
//     //   return fallBack(
//     //     '❌ No entendí tu consulta. Por favor, escribe el nombre o categoría del producto.'
//     //   )
//     // }
//     ctx.body.trim()
//   },
//   [flowProcesarConsulta]
// )

const linkMap = {
  1: 'https://grupodistrigasmayorista.mitiendanube.com/bidones-de-agua/',
  2: 'https://grupodistrigasmayorista.mitiendanube.com/tapas/',
  3: 'https://grupodistrigasmayorista.mitiendanube.com/precintos-termocontraibles/',
  4: 'https://grupodistrigasmayorista.mitiendanube.com/filtros-de-agua/',
  5: 'https://grupodistrigasmayorista.mitiendanube.com/carcazas-portafiltros/',
  6: 'https://grupodistrigasmayorista.mitiendanube.com/repuestos-dispensers/',
  7: 'https://grupodistrigasmayorista.mitiendanube.com/dispenser-de-agua-frio-calor/',
  8: 'https://grupodistrigasmayorista.mitiendanube.com/dispenser-de-agua-naturales/',
  9: 'https://grupodistrigasmayorista.mitiendanube.com/bolsas-para-bidones/',
  10: 'https://grupodistrigasmayorista.mitiendanube.com/productos-para-limpieza/',
}

const ventasMayoristas = addKeyword('9').addAnswer(
  [
    '👋¡Hola! Bienvenido a Grupo Distrigas Mayorista.',
    'Contamos con una amplia gama de productos.',
    'Podes verlos en nuestra pagina web:',
    'https://grupodistrigasmayorista.mitiendanube.com/',
    'o seleccione una de las siguientes categorías:',
    '1️⃣ Bidones de agua',
    '2️⃣ Tapas',
    '3️⃣ Precintos termocontraibles',
    '4️⃣ Filtros de agua',
    '5️⃣ Carcazas/Porta Filtros',
    '6️⃣ Repuestos de dispensers',
    '7️⃣ Dispenser de agua frio/calor',
    '8️⃣ Dispenser de agua natrual',
    '9️⃣ Bolsas para bidones',
    '🔟 Productos para limpieza',
  ],
  { capture: true },
  (ctx, { fallBack }) => {
    const validOptions = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
    const choice = ctx.body.trim()
    if (validOptions.includes(choice)) {
      Object.entries(linkMap).forEach(async ([key, url]) => {
        if (key === choice) {
          await open(url)
        }
      })
    } else {
      // si no es válida, mostramos mensaje de error y reimprimimos el menú
      return fallBack(
        '❌ Opción no válida. Por favor elegí sólo uno de los números del 1️⃣ al 🔟:'
      )
    }
  }
)

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

// const flowMayoristas = addKeyword('10').addAnswer(
//   [
//     'Muchas gracias por elegir Grupo Distrigas.',
//     'Contamos con una amplia gama de productos para mayoristas.',
//     'Podes verlos en nuestra pagina web:',
//     'https://www.grupodistrigas.com/',
//   ],
//   null,
//   null
// )

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
  'hols',
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
    '9️⃣ Consulta de productos',
    '🔟 Acceso Ventas Mayoristas',
  ],

  { capture: true },
  (ctx, { fallBack }) => {
    const validOptions = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
    const choice = ctx.body.trim()
    if (validOptions.includes(choice)) {
      return true // la entrada es correcta, continúa al sub-flujo correspondiente
    }
    // si no es válida, mostramos mensaje de error y reimprimimos el menú
    return fallBack(
      '❌ Opción no válida. Por favor elegí sólo uno de los números del 1️⃣ al 🔟:'
    )
  },
  [
    // flowMayoristas,
    // flowConsultaProductos,
    ventasMayoristas,
    flowMatafuegos,
    flowFiltros,
  ]
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
