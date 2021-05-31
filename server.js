const express = require('express');
const app = express();
const socket = require('socket.io');
const path = require('path');

const tasks = [];

app.use(express.static(path.join(__dirname, "/client/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/client/build/index.html"));
});

const server = app.listen(process.env.PORT || 3000, () => {
  console.log('Server is running on port: 3000');
});


const io = socket(server);

io.on('connection', (socket) => {
  socket.emit('updateData', tasks);

  socket.on('addTask', (task) => {
    tasks.push(task);

    socket.broadcast.emit('addTask', task);
  })

  socket.on('removeTask', (task) => {
    tasks.filter(data => data.id !== task.id);

    socket.broadcast.emit('removeTask', task);
  })
})