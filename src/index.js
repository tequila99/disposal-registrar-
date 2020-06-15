import app from './app'
const PORT = process.env.PORT || 3040

app.set('port', PORT)

app.listen(PORT, () => {
  console.log(`Local server running on port: ${PORT}`)
})
