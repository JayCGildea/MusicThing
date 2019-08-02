import express from 'express';

const app = express();
var server = app.listen(3000);

var host = server.address().address;
var port = server.address().port;
console.log('Server listening at http://' + host + ':' + port);

app.use(express.static('public'));