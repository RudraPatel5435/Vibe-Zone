import { io } from "https://cdn.socket.io/4.7.2/socket.io.esm.min.js";
var socket = io('http://localhost:3000')

const messages = document.getElementById("message-container")
const form = document.getElementById('form')
const messageInput = document.getElementById('message-input')
let currRoom = 'General'
const allRooms = document.querySelectorAll(".rooms h1")
const roomName = document.querySelector(".rooms .currRoom span")

const roomNameColors = ["rgb(253, 33, 33)", "lightgreen", "lightblue"]

allRooms.forEach((e, idx)=>{
  const room = e.textContent
  roomName.style.color = roomNameColors[0]
  e.style.color = roomNameColors[idx]
  e.addEventListener("click", ()=>{
    if(currRoom !== room) {
      if(currRoom){
        socket.emit('leave-room', currRoom)
      }
      currRoom = room
      roomName.textContent = currRoom
      roomName.style.color = roomNameColors[idx]
      socket.emit("join-room", currRoom)
    }
  })
})

function displayMessage(message){
  const li = document.createElement("li")
  li.textContent = message
  messages.append(li)
}

form.addEventListener('submit', function (e) {
  e.preventDefault()
  let message = messageInput.value
  if (message==="") return
    displayMessage(message)
    socket.emit('send-message', message, currRoom)
  messageInput.value = ""
})

socket.on("receive-message", msg => {
  displayMessage(msg)
})

socket.on('user-count', userCount => {
  document.querySelector(".activeUsers span").textContent = userCount 
})