import Reader from './Reader'
import CardReaderNFC from './nfc-reader/nfc-reader'

export default async io => {
  const cardReader = CardReaderNFC(io)
  const scannerBarcode = Reader(io)
  await cardReader.connect()
  await scannerBarcode.connect()

  io.on('connection', socket => {
    console.log(`Установлено соединение с сокетом (ID: ${socket.id})`)
    socket.emit('status_card_reader', cardReader.connected)
    socket.emit('status_barcode_scanner', scannerBarcode.connected)
    socket.on('get_status_card_reader', () => {
      socket.emit('status_card_reader', cardReader.connected)
    })
    socket.on('get_status_barcode_scanner', () => {
      socket.emit('status_barcode_scanner', scannerBarcode.connected)
    })
    socket.on('reconnect', () => {
      socket.emit('status_barcode_scanner', scannerBarcode.connected)
      socket.emit('status_card_reader', cardReader.connected)
    })
    socket.on('disconnect', reason => {
      console.log(`Отключение сокета ID: ${socket.id} по причине: ${reason}`)
    })
  })
}
