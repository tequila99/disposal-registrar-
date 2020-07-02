import Reader from './Reader'
import CardReaderNFC from './nfc-reader/nfc-reader'

export default async (io, useCardReader = true, useScanner = true) => {
  let cardReader = {}
  let scannerBarcode = {}

  if (useCardReader) {
    cardReader = CardReaderNFC(io)
    await cardReader.connect()
  } else cardReader = { connected: 'disabled_in_settings' }

  if (useScanner) {
    scannerBarcode = Reader(io)
    await scannerBarcode.connect()
  } else scannerBarcode = { connected: 'disabled_in_settings' }

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
