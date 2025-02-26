import { io } from "https://cdn.socket.io/4.7.2/socket.io.esm.min.js";
var socket = io('http://localhost:3000')

const messages = document.getElementById("message-container")
const form = document.getElementById('form')
const messageInput = document.getElementById('message-input')
let currRoom = ''
const allRooms = document.querySelectorAll(".rooms h1")

allRooms.forEach((e,idx)=>{
  const room = e.textContent
  e.addEventListener("click", ()=>{
    currRoom = room
    socket.emit("join-room", room)
  })
})

socket.on("receive-message", msg => {
  displayMessage(msg)
})

form.addEventListener('submit', function (e) {
  e.preventDefault()
  let message = messageInput.value
  if (message==="") return
    displayMessage(message)
    socket.emit('send-message', message, currRoom)
  message = ""
})

function displayMessage(message){
  const li = document.createElement("li")
  li.textContent = message
  messages.append(li)
}