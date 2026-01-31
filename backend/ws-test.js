const { io } = require('socket.io-client');

const socket = io('http://localhost:3000', {
  auth: {
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5ODAyZGZmZC00NjEzLTQ1MjYtYmM0NS0yZTg5YTYwNjdiYTgiLCJlbWFpbCI6InVzZXIxQHB1bHNlLmFwcCIsImlhdCI6MTc2OTg2MjE5NywiZXhwIjoxNzY5ODY1Nzk3fQ.ZpLBDvACxMVBj0PRFJb4XD_pwdZmgfzhKiwOoxWuVKk',
  },
});

socket.on('connect', () => {
  console.log('Connected to Pulse WebSocket');
});

socket.on('chat_history', (messages) => {
  console.log('Chat history received:');
  messages.forEach((msg) => {
    console.log(`[${msg.createdAt}] ${msg.senderId}: ${msg.content}`);
  });

  // Send a new message after history loads
  socket.emit('send_message', {
  toUserId: '12272928-9dc3-41d2-9a87-10c894315e0f',
  content: 'Hello in private!',
});
});

socket.on('new_message', (msg) => {
  console.log('New message:', msg);
});