'use strict';

var five = require('johnny-five'), lcd;
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);


app.use(express.static(__dirname + '/public'));
app.get('/', function(req, res, next) {
  res.sendFile(__dirname + '/index.html')
});

five.Board().on('ready', function() {
  console.log('Arduino is ready.');

  // Initial state for the LED light
  let state = {
    input: 'i love #0'
  };

  const lcd = new five.LCD({
    // LCD pin name  RS  EN  DB4 DB5 DB6 DB7
    // Arduino pin # 7    8   9   10  11  12
    pins: [12, 11, 5, 4, 3, 2],
    backlight: 6,
    rows: 2,
    cols: 16
  });

  // Listen to the web socket connection
  io.on('connection', function(client) {
    client.on('join', function(handshake) {
      console.log(handshake);
    });

    // Every time a 'rgb' event is sent, listen to it and grab its new values for each individual colour
    client.on('msg', function(data) {
      state.input = data.input === 'wait' ? data.input : state.input;
      console.log( data );

      lcd.clear().cursor(0, 0).print( data.input );


      client.emit('msg', data);
      client.broadcast.emit('msg', data);
    });

    // Turn on the RGB LED
    // led.on();
  });
});

const port = process.env.PORT || 3000;

server.listen(port);
console.log(`Server listening on http://localhost:${port}`);
