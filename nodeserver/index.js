const http = require("http");
const express = require("express");
const path = require("path");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const users = {};

// Serving static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Handle root URL
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// WebSocket connection handling
io.on("connection", (socket) => {
    console.log(`New connection: ${socket.id}`);

    socket.on("new-user-joined", (userName) => {
        users[socket.id] = userName;
        io.emit("user-joined", userName);
    });

    socket.on("send", (message) => {
        io.emit("receive", { message, userName: users[socket.id] });
    });

    socket.on("disconnect", () => {
        const userName = users[socket.id];
        delete users[socket.id];
        io.emit("left", userName);
    });
});

// Start the server
const PORT = 9000;
server.listen(PORT, () => console.log(`Server started on http://localhost:${PORT}`));
