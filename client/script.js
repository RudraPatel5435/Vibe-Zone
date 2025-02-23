import { io } from "https://cdn.socket.io/4.7.2/socket.io.esm.min.js";
var socket = io('http://localhost:3000')

const messages = document.getElementById("message-container")
const form = document.getElementById('form')
const input = document.getElementById('message-input')

form.addEventListener('submit', function (e) {
  e.preventDefault()
  if (input.value) {
    socket.emit('chat', input.value)
    input.value = ""
  }
})
socket.on('chat', function (msg) {
  var item = document.createElement('li');
  item.textContent = msg;
  messages.appendChild(item);
})