import { io } from "https://cdn.socket.io/4.7.2/socket.io.esm.min.js";
var socket = io('http://localhost:3000')

const messages = document.getElementById("message-container")
const form = document.getElementById('form')
const messageInput = document.getElementById('message-input')
let currRoom = 'General'
const allRooms = document.querySelectorAll(".rooms h1")
const roomName = document.querySelector(".currRoom span")
const roomNameBorder = document.querySelector(".currRoom")

const roomNameColors = ["yellow", "lightgreen", "lightsteelblue"]

allRooms.forEach((e, idx) => {
  const room = e.textContent
  roomName.style.color = roomNameColors[0]
  roomNameBorder.style.borderColor = roomNameColors[0]
  e.style.color = roomNameColors[idx]
  e.addEventListener("click", () => {
    if (currRoom !== room) {
      if (currRoom) {
        socket.emit('leave-room', currRoom)
      }
      currRoom = room
      roomName.textContent = currRoom
      roomName.style.color = roomNameColors[idx]
      roomNameBorder.style.borderColor = roomNameColors[idx]
      socket.emit("join-room", currRoom)
    }
  })
})

function displayMessage(message, senderName) {
  const li = document.createElement("li")
  const sender = document.createElement("div")
  sender.classList.add("sender")
  sender.textContent = senderName
  const sentMessage = document.createElement("div")
  sentMessage.classList.add("sentMessage")
  sentMessage.textContent = message
  const hr = document.createElement("hr")
  li.append(sender)
  li.append(sentMessage)
  messages.append(li)
  messages.append(hr)
}

form.addEventListener('submit', function (e) {
  e.preventDefault()

  let senderName = document.querySelector("#nickname").value
  const errors = document.querySelector(".error")
  if (senderName.trim()) {
    if (senderName.length > 47) {
      errors.style.display = "block"
      errors.textContent = "Max characters in nickname is 47."
    } else if (senderName.split(" ").length > 1) {
      errors.style.display = "block"
      errors.textContent = "Nickname should not contain any spaces."
    } else {
      errors.style.display = "none"
      let message = messageInput.value
      if (message === "") return
      displayMessage(message, senderName)
      socket.emit('send-message', message, currRoom, senderName)
      messageInput.value = ""
    }
  } else {
    errors.style.display = "block"
    errors.textContent = "Enter a nickname."
  }
})


socket.on("receive-message", (msg, senderName) => {
  displayMessage(msg, senderName)
})

socket.on('user-count', userCount => {
  document.querySelector(".activeUsers span").textContent = userCount
})
