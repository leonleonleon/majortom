// client.js

(function() {
    var socket = io.connect(window.location.hostname + ':' + 3000);
    var textinput = document.getElementById('textinput');

    function emitValue(input, e) {
        socket.emit('msg', {
            input: e.target.value,
        });
    }
    input = textinput.value;
    textinput.addEventListener('keyup', emitValue.bind(null, input ));


    socket.on('connect', function(data) {
        socket.emit('join', 'Client is connected!');
    });

    socket.on('msg', function(data) {
        // var color = data.color;
        // document.getElementById(color).value = data.value;
        console.log( data );
    });
}());
