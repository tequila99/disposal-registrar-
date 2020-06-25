import app from './app'
import socketio from 'socket.io'
import socket from './socket'
import { createServer } from 'http'

const PORT = process.env.PORT || 3030
const server = createServer(app)
const io = socketio(server)

app.set('port', PORT)

socket(io)

server.listen(PORT, () => {
  console.log('*********************************************************************')
  console.log(`Сервис для работы с локальным оборудованием запущен на порту: ${PORT}`)
  console.log('*********************************************************************')
})
