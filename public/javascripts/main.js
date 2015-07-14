var url = 'ws://10.150.30.31:8080';
var ws = new WebSocket(url);
var heldKeys = [];

ws.onopen = function() {
    console.log("Opened WebSocket connection");
}

ws.onmessage = function (event) {
    console.log('Websocket Return: ' + event.data);
    $('#term').html($('#term').html() + event.data);
    $('#term').animate({scrollTop: $('#term').prop("scrollHeight")}, 200);
};

$(function () {
    $('#getChar').focus();

    $('#getChar').on('input', function (event) {
        if (ws.readyState === 1) {
            var s = $(this).val();
            $(this).val('');
            ws.send(s);
        }
    });

    $('#getChar').on('keyup', function (event) {
        while(heldKeys.indexOf(event.which) !== -1) {
            heldKeys.splice(heldKeys.indexOf(event.which), 1);
        }
        if (ws.readyState === 1) {
            if (event.which === 8) {
                ws.send(" backspace ");
            } else if (event.which === 13) {
                ws.send(" <br /> %> ");
            } else if (event.which === 16) {
                ws.send(" shift ");
            } else if (event.which === 32) {
                ws.send(" spacebar ");
            } else if (event.which === 67 && heldKeys.indexOf(17) !== -1) {
                ws.send(" Ctrl-C <br /> Exiting...");
                $('#getChar').blur();
            }
        }
    });

    $('#getChar').on('keydown', function (event) {
        heldKeys.push(event.which);
    });

    $(document).on('click', function () {
        $('#getChar').focus();
    });

});

function ab2str(buf) {
  return String.fromCharCode.apply(null, new Uint8Array(buf));
}

function str2ab(str) {
  var buf = new ArrayBuffer(str.length*2); // 2 bytes for each char
  var bufView = new Uint8Array(buf);
  for (var i=0, strLen=str.length; i<strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

$(document).unload(function () {
    ws.close();
});
