const { io } = require('socket.io-client');

const socket = io('http://localhost:3000', {
  auth: {
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5ODAyZGZmZC00NjEzLTQ1MjYtYmM0NS0yZTg5YTYwNjdiYTgiLCJlbWFpbCI6InVzZXIxQHB1bHNlLmFwcCIsImlhdCI6MTc2OTg1NzE4MCwiZXhwIjoxNzY5ODYwNzgwfQ.AYWytbtg_BhdskjPELZqfQGItx_DdvDP9wgPulFlxUk',
  },
});

socket.on('connect', () => {
  console.log('Connected to Pulse WebSocket');
  socket.emit('send_message', 'Hello from Node test');
});

socket.on('new_message', (msg) => {
  console.log('Received:', msg);
});
