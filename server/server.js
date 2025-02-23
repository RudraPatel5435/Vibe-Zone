const express = require('express')
const path = require('path')
const cors = require('cors')
const app = express()
const http = require('http')
const server = http.createServer(app)
const { Server } = require('socket.io')
const io = new Server(server, {
  cors: {
    origin: "*"
  }
})

app.use(express.static(path.join(__dirname, "../client")))

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'))
})

io.on('connection', (socket) => {
  console.log("a user connected")
  socket.on('disconnect', () => {
    console.log('user disconnected')
  })
  socket.on('chat', (msg)=>{
    io.emit('chat', msg)
    console.log("message: " + msg)
  })
})

server.listen(3000, () => {
  console.log("listening on *:3000")
})