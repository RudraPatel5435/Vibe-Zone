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

let userCount = 0

app.use(express.static(path.join(__dirname, "../client")))

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'))
})

io.on('connection', (socket) => {
  socket.on('disconnect', ()=>{
    userCount--
  })
  userCount++
  io.emit("user-count", userCount)
  socket.on('join-room', room =>{
    socket.join(room)
  })
  socket.on('leave-room', room =>{
    socket.leave(room)
  })
  socket.on('send-message', (message, room)=>{
    if(room===""){
      socket.broadcast.emit("receive-message", message)
    } else {
      socket.to(room).emit("receive-message", message)
    }
  })
})

server.listen(3000, () => {
  console.log("listening on *:3000")
})