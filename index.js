import express from 'express';
import socketIO from 'socket.io';
import { DH_UNABLE_TO_CHECK_GENERATOR } from 'constants';
const app = express();
var server = app.listen(3000);

var host = server.address().address;
var port = server.address().port;

app.use(express.static('public'));

const io = socketIO(server);

var buttons = new Array(10*10).fill(false);

io.on('connection', (socket) => {
  
  socket.emit('init', buttons);

  console.log('connected');
  socket.on('click', (data) => {

    console.log('clicked at ' + data.index);
    buttons[data.index] = !buttons[data.index];
    socket.broadcast.emit('click', data);
  });

  socket.on('disconnect', () => {
  });

});