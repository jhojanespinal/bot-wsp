const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client();
let timeoutId = null;
const TIMEOUT_DURATION = 600000; // 10 minutos

client.on('qr', qr => {
  qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
  console.log('Cliente logueado!');
});

client.on('message', message => {
  clearTimeout(timeoutId);
  // Verificar si el mensaje es un comando del usuario
  switch (message.body) {
    case '👉🏻 menu':
      sendMenu(message.from);
      break;
    case '👉🏻 RESERVAR':
      sendReservationInstructions(message.from);
      break;
    case '👉🏻 GRACIAS':
      sendThanksMessage(message.from);
      break;
    default:
      sendDefaultResponse(message.from);
      break;
  }
});

client.initialize();

function startTimeoutTimer(recipient) {
  timeoutId = setTimeout(() => {
    client.sendMessage(recipient, 'Hemos notado que no has interactuado con el menú por un tiempo. ¿En qué más podemos ayudarte?');
    sendDefaultResponse(recipient);
  }, TIMEOUT_DURATION);
}

function sendMenu(recipient) {
  const menu = `
    🍽️ El menú del día de hoy:
    - Entrada: Ensalada César
    - Plato Principal: Lomo Saltado
    - Postre: Tarta de Manzana
    - Bebida: Pisco Sour

    Opciones adicionales:
    - Entrada: Sopa de Mariscos
    - Plato Principal: Ceviche Mixto
    - Postre: Flan de Caramelo
    - Bebida: Chicha Morada
  `;
  client.sendMessage(recipient, menu);
  startTimeoutTimer(recipient);
}

function sendReservationInstructions(recipient) {
  const instructions = `
    ✅ Reservación:
    Para hacer una reserva, envía un mensaje con la siguiente información:
    - Fecha y hora de la reserva.
    - Número de personas.
    - Nombre de contacto.
  `;
  client.sendMessage(recipient, instructions);
  startTimeoutTimer(recipient);
}

function sendThanksMessage(recipient) {
  const thanksMessage = `
    🙏 ¡Gracias por tu compra! Esperamos que hayas disfrutado de tu experiencia en nuestro restaurante. ¡Vuelve pronto!
  `;
  client.sendMessage(recipient, thanksMessage);
  startTimeoutTimer(recipient);
}

function sendDefaultResponse(recipient) {
  const defaultMessage = `
  ¡Hola! Bienvenido al Restaurante "EL COSTEÑO" 🍽️
    ¿En qué puedo ayudarte?
    - Para ver el menú, envía 👉🏻 menu.
    - Para hacer una reserva, envía 👉🏻 RESERVAR.
    - Para agradecer por tu compra, envía 👉🏻 GRACIAS.
  `;
  client.sendMessage(recipient, defaultMessage);
  startTimeoutTimer(recipient);
}
