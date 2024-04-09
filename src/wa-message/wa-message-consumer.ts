import { Client, ClientOptions, LocalAuth, Message } from "whatsapp-web.js"
import qrcode from "qrcode-terminal"
import logger from "../utils/logger";


const waNumbers = ['6281234567890', '6281234567891']

const clients: Record<string, Client> = {}

waNumbers.forEach((waNumber) => {
  const clientConfig: ClientOptions = {
    authStrategy: new LocalAuth({
      clientId: waNumber
    })
  }

  const client = new Client(clientConfig)

  client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true })
  })

  client.on('authenticated', (session) => {
    logger.info(`Client ${waNumber} authenticated`)
  })

  client.on('ready', () => {
    logger.info(`Client ${waNumber} ready`)
  })

  client.on('message', (message: Message) => {
    logger.info(`Client ${waNumber} received message: ${message.body}`)
    client.sendMessage(message.from, `You said: ${message.body}`)
  })

  clients[waNumber] = client

  client.initialize()

})

export default clients