const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');

// GET username from URL
const {username, room} = Qs.parse(location.search, {
  ignoreQueryPrefix: true
});

const socket = io();
// Join chatroom
socket.emit('joinRoom', { username, room });


// Get message from server
socket.on('message', message => {
   outputMessage(message);

   chatMessages.scrollTop = chatMessages.scrollHeight;
});

socket.on('roomUsers', ({room, users})=> {
  console.log(room, users);
  outputRoomUsers(users);
})

chatForm.addEventListener('submit', (e)=> {
  e.preventDefault();
  const msg = e.target.elements.msg.value;

  // Send message to server
  socket.emit('chatMessage', msg);
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
})

// Output message to DOM
function outputMessage({username, text, time}) {
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = `	<p class="meta">${username}<span>${time}</span></p>
  <p class="text">
    ${text}
  </p>`;
  document.querySelector('.chat-messages').appendChild(div);
}

function outputRoomUsers(users) {
  const userList = document.getElementById('users');
  userList.innerHTML = `${users.map(user=> `<li>${user.username}</li>`).join('')}`; 
}