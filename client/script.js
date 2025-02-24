import { io } from "https://cdn.socket.io/4.7.2/socket.io.esm.min.js";
var socket = io('http://localhost:3000')

const messages = document.getElementById("message-container")
const form = document.getElementById('form')
const input = document.getElementById('message-input')
let roomTitle = document.querySelector(".title").textContent
// const messageThings = document.querySelector(".message")
// const roomThings = document.querySelector(".room")
// const roomBut = document.querySelector('#room-button')
// const roomOptions = document.querySelector('#room-input')


// function roomCheck(){if(roomTitle == "Choose a Room"){
//   messageThings.style.display="none"
//   messageThings.style.display="none"
//   messages.style.display="none"
// }else{
//   roomThings.style.display="none"
//   messageThings.style.display="block"
//   messageThings.style.display="block"
//   messages.style.display="block"
// }
// }
// roomCheck()

// roomBut.addEventListener("click", ()=>{
//   console.log(roomTitle)
//   roomTitle = roomOptions.value
//   roomCheck()
// })

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
