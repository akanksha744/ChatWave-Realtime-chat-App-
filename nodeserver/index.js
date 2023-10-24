const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const users = {};

io.on('connection', socket => {
    socket.on('new-user-joined', userName => {
        users[socket.id] = userName;
        socket.broadcast.emit('user-joined', userName);
    });

    socket.on('send', message => {
        socket.broadcast.emit('receive', { message, userName: users[socket.id] });
    });

    socket.on('disconnect', () => {
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    });
});

server.listen(8000, () => {
    console.log('Server is running on port 8000');
});
