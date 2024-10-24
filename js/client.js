const socket = io("http://localhost:9000");

const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector(".container");
const audio = new Audio('sound.mp3');

// Function to append messages
const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message', position);
    messageContainer.append(messageElement);

    if (position === 'left') {
        audio.play();
    }
};

// Form submit event
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`, 'right');
    socket.emit('send', message);
    messageInput.value = '';
});

// Prompt for username and emit the event
const userName = prompt('Enter your name to join');
socket.emit('new-user-joined', userName);

// Handle 'user-joined' event
socket.on('user-joined', (userName) => {
    append(`${userName} joined the chat`, 'right');
});

// Handle 'receive' event
socket.on('receive', (data) => {
    append(`${data.userName}: ${data.message}`, 'left');
});

// Handle 'left' event
socket.on('left', (userName) => {
    append(`${userName} left the chat`, 'left');
});
