const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = module.exports.io = require('socket.io')(server);

const PORT = process.env.PORT || 3001;

const SocketConfig = require('./socket');

app.use(express.static(__dirname +  '/../../build' ));
io.on('connection', SocketConfig);

server.listen(PORT, () => console.log('connected to port: ', PORT));