const http = require("http");
const express = require("express");
const path = require("path");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const users = {};

// Socket.io
io.on("connection", (socket) => {
    socket.on("new-user-joined", (userName) => {
        users[socket.id] = userName;
        io.emit("user-joined", userName); 
    });

    socket.on('send', (message) => {
        io.emit('receive', { message: message, userName: users[socket.id] }); 
    });

    socket.on('disconnect', () => {
        const userName = users[socket.id];
        delete users[socket.id];
        io.emit('left', userName);
    });
});


app.use(express.static(path.resolve("../")));


app.get("/", (req, res) => {
    res.sendFile(path.resolve("index.html"));
});


server.listen(9000, () => console.log(`Server Started at PORT:9000`));