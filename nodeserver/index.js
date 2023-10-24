const server = require('http').createServer();
const io = require('socket.io')(server, {
  cors: {
    origin: "*",
  }
});

const users = {};

io.on('connection', (socket) => {
  socket.on('new-user-joined', (userName) => {
    users[socket.id] = userName;
    socket.broadcast.emit('user-joined', userName);
  });

  socket.on('send', (message) => {
    socket.broadcast.emit('receive', { message, userName: users[socket.id] });
  });

  socket.on('disconnect', () => {
    const userName = users[socket.id];
    if (userName) {
      socket.broadcast.emit('left', userName);
      delete users[socket.id];
    }
  });
});

const port = 8000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
