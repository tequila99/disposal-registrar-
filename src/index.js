import app from './app'
import socketio from 'socket.io'
import socket from './socket'
import { createServer } from 'http'

const server = createServer(app)
const io = socketio(server)

const defaultOptions = {
  port: process.env.PORT || 3030,
  cardReader: false,
  scanner: true
}

// app.set('port', PORT)

/**
 *
 * @param {{port: number, cardReader: boolean, scanner: boolean}} options
 */
const periphery = (options = defaultOptions) => {
  const { port = defaultOptions.port, cardReader = defaultOptions.cardReader, scanner = defaultOptions.scanner } = options
  socket(io, cardReader, scanner)
  app.set('port', port)
  server.listen(port, () => {
    console.log('*********************************************************************')
    console.log(`Сервис для работы с локальным оборудованием запущен на порту: ${port}`)
    console.log('*********************************************************************')
  })
}

const NODE_ENV = process.env.NODE_ENV || 'development'

// this module was run directly from the command line as in node xxx.js
// require.main === module && NODE_ENV === 'development' && periphery({ port: 3035, cardReader: false, scanner: true })
require.main === module && NODE_ENV === 'development' && periphery()

module.exports = periphery
