const socket = io("http://localhost:8000", { transports: ["polling"] });


const users = {};

io.on('connection', socket =>{
    socket.on('new-user-joined', userName =>{
        users[socket.id] = userName;
        socket.broadcast.emit('user-joined', userName);

    });
    socket.on('send', message =>{
        socket.broadcast.emit('receive',{message: message, userName:users[socket.id]})
    });
    socket.on('disconnect', message =>{
        socket.broadcast.emit('left',users[socket.id]);
        delete users[socket.id];

    });
});