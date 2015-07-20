var heldKeys = [];


$(function () {
    var ws, url;
    if (window.ctsapp) {
        url = 'ws://' + ctsapp.getDeviceIP() + ':5000';
        console.log(url);
        ws = new WebSocket(url);
    } else {
        url = 'ws://10.150.30.185:5000';
        console.log(url);
        ws = new WebSocket(url);
        ws.binaryType = 'arraybuffer';
    }
    ws.onopen = function() {
        console.log("Opened WebSocket connection");
        var data = {
            'request':'connect',
            'username':'lab',
            'password':'lab',
            'host':'172.18.194.55'
        };
        ws.send(JSON.stringify(data));
        var command = {
            'request':'command',
            'commandString':'en'
        }
        var command2 = {
            'request':'command',
            'commandString':'lab'
        }
        setTimeout(function (){
            ws.send(JSON.stringify(command));
            ws.send(JSON.stringify(command2));
        }, 1000);
    }

    ws.onmessage = function (event) {
        console.log(event.data);
        console.log('Websocket Return: ' + ab2str(event.data));
        $('#term').html($('#term').html() + ab2str(event.data).replace("\n", " <br /> %> "));
        $('#term').animate({scrollTop: $('#term').prop("scrollHeight")}, 200);
    };


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

function focusOnHiddenInput () {
    $('#getChar').focus();
}

function test (message) {
    console.log(message);
}

function blobToUint8Array(b) {
    var uri = URL.createObjectURL(b),
        xhr = new XMLHttpRequest(),
        i,
        ui8;

    xhr.open('GET', uri, false);
    xhr.send();

    URL.revokeObjectURL(uri);

    ui8 = new Uint8Array(xhr.response.length);

    for (i = 0; i < xhr.response.length; ++i) {
        ui8[i] = xhr.response.charCodeAt(i);
    }

    return ui8;
}

function bin2String(array) {
  var result = "";
  for (var i = 0; i < array.length; i++) {
    result += String.fromCharCode(parseInt(array[i], 2));
  }
  return result;
}

function convert(data) {
     return new ArrayBuffer(data);
}
