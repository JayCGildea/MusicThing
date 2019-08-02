import express from 'express';
import socketIO from 'socket.io';
const app = express();
var server = app.listen(3000);

var host = server.address().address;
var port = server.address().port;

app.use(express.static('public'));

const io = socketIO(server);

var buttons = new Array(10*10).fill('');
var waveform = 'sine';

setInterval(() => io.sockets.emit('start'), 5000);

io.on('connection', (socket) => {
  
  socket.emit('init', {buttons: buttons});

  console.log('connected');
  socket.on('click', (data) => {
    
    console.log('clicked at ' + data.index);
    buttons[data.index] = data.waveform;
    socket.broadcast.emit('click', data);
  });

  // socket.on('waveform', (data) => {
  //   waveform = data;
  //   socket.broadcast.emit('waveform', data);
  // })

  socket.on('disconnect', () => {
  });
  

});