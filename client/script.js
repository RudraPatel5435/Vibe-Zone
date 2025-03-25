import { io } from "https://cdn.socket.io/4.7.2/socket.io.esm.min.js";
var socket = io("https://vibe-zone.onrender.com");

const messages = document.getElementById("message-container");
const form = document.getElementById("form");
const messageInput = document.getElementById("message-input");
let currRoom = "General";
const allRooms = document.querySelectorAll(".rooms h1");
const roomName = document.querySelector(".currRoom span");
const roomNameBorder = document.querySelector(".currRoom");
let roomMessages = [];

const roomNameColors = ["yellow", "lightgreen", "lightblue"];
const randomBrightColors = ["tomato", "yellow", "lightgreen", 'lightsteelblue', 'cyan', "indigo", "slateblue", "lightblue", 'coral', 'lavender', 'lime', 'lightseagreen']
const nicknameColor = randomBrightColors[Math.floor(Math.random()*(randomBrightColors.length - 1))]

allRooms.forEach((e, idx) => {
    const room = e.textContent;
    roomName.style.color = roomNameColors[0];
    roomNameBorder.style.borderColor = roomNameColors[0];
    e.style.color = roomNameColors[idx];
    e.addEventListener("click", () => {
        if (currRoom !== room) {
            currRoom = room;
            roomName.textContent = currRoom;
            roomName.style.color = roomNameColors[idx];
            roomNameBorder.style.borderColor = roomNameColors[idx];
            document.querySelector(".message").style.borderColor = roomNameColors[idx]
            document.querySelector("#send-button").style.borderColor = roomNameColors[idx]
            messages.innerHTML = ""
            socket.emit('change-room')
        }
    });
});

function displayMessage(message, senderName, nickColor) {
    const li = document.createElement("li");
    const sender = document.createElement("div");
    sender.classList.add("sender");
    sender.textContent = senderName;
    sender.style.color=nickColor
    const sentMessage = document.createElement("div");
    sentMessage.classList.add("sentMessage");
    sentMessage.textContent = message;
    const hr = document.createElement("hr");
    li.append(sender);
    li.append(sentMessage);
    messages.append(li);
    messages.append(hr);
    messages.scrollTop = messages.scrollHeight;
}

form.addEventListener("submit", function (e) {
    e.preventDefault();

    let senderName = document.querySelector("#nickname").value;
    const errors = document.querySelector(".error");
    if (senderName.trim()) {
        if (senderName.length > 47) {
            errors.style.display = "block";
            errors.textContent = "Max characters in nickname is 47.";
        } else if (senderName.split(" ").length > 1) {
            errors.style.display = "block";
            errors.textContent = "Nickname should not contain any spaces.";
        } else {
            errors.style.display = "none";
            let message = messageInput.value;
            if (message === "") return;
            socket.emit("send-message", message, currRoom, senderName, nicknameColor);
            messageInput.value = "";
        }
    } else {
        errors.style.display = "block";
        errors.textContent = "Enter a nickname.";
    }
});
socket.on("receive-message", (generalMessages, dsaMessages, webdevMessages) => {
    if (currRoom == "General") {
        roomMessages = generalMessages;
        messages.innerHTML = "";
    } else if (currRoom == "DSA") {
        roomMessages = dsaMessages;
        messages.innerHTML = "";
    } else if (currRoom == "WebDev") {
        roomMessages = webdevMessages;
        messages.innerHTML = "";
    }
    roomMessages.forEach((e) => {
        displayMessage(e.msg, e.nickname, e.color);
    });
});

socket.on("user-count", (userCount) => {
    document.querySelector(".activeUsers span").textContent = userCount;
});
