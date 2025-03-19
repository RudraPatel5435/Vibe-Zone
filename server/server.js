const express = require("express");
const path = require("path");
const cors = require("cors");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
    cors: {
        origin: "*",
    },
});

let userCount = 0;

let generalMessages = [];
let dsaMessages = [];
let webdevMessages = [];

app.use(express.static(path.join(__dirname, "../client")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/index.html"));
});

io.on("connection", (socket) => {
    socket.on("disconnect", () => {
        userCount--;
        io.emit("user-count", userCount);
    });
    io.emit("receive-message", generalMessages, dsaMessages, webdevMessages);
    io.emit("user-count", userCount);
    userCount++;
    io.emit("user-count", userCount);
    socket.on('change-room', ()=>{
        io.emit("receive-message", generalMessages, dsaMessages, webdevMessages);
    })
    socket.on("send-message", (message, room, senderName, nicknameColor) => {
        if (room == "General") {
            generalMessages.push({
                nickname: senderName,
                msg: message,
                color: nicknameColor
            });
        }
        if (room == "DSA") {
            dsaMessages.push({
                nickname: senderName,
                msg: message,
                color: nicknameColor
            });
        }
        if (room === "WebDev") {
            webdevMessages.push({
                nickname: senderName,
                msg: message,
                color: nicknameColor
            });
        }
        io.emit("receive-message", generalMessages, dsaMessages, webdevMessages);
    });
});

server.listen(3000, () => {
    console.log("listening on *:3000");
});
