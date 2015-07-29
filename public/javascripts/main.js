var heldKeys = [];


$(function () {
    var ws, url;
    if (window.ctsapp) {
        url = 'ws://127.0.0.1:5000';
        console.log(url);
        ws = new WebSocket(url);
        ws.binaryType = 'arraybuffer';
    } else {
        url = 'ws://10.150.28.247:5000';
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

    }

    ws.onmessage = function (event) {
        console.log(event.data);
        console.log(event.type);
        console.log('Websocket Return: ' + ab2str(event.data));

        if (event.data instanceof Blob) {

        } else if (typeof event.data === 'string'){
            console.log('parsed json' + JSON.stringify(event.data));
            var jsonobj = JSON.parse(event.data);
            console.log('parsed json == ' + jsonobj.request);
            var str1 = JSON.stringify(jsonobj.request);
            console.log('request == ' + str1);
            if ('onConnect'.localeCompare(str1)) {
                var command = {
                    'request':'sendChar',
                    'key':101
                }
                var command2 = {
                   'request':'sendChar',
                   'key':110
                }
                var command3 = {
                    'request':'sendChar',
                    'key':13
                }
                var command4 = {
                    'request':'sendChar',
                    'key':114
                }
                var command5 = {
                    'request':'sendChar',
                    'key':108
                }
                var command6 = {
                    'request':'sendChar',
                    'key':97
                }
                var command7 = {
                    'request':'sendChar',
                    'key':98
                }

                var disconnect = {
                    'request':'disconnect'
                }
                var newline = {
                    'request':'sendChar',
                    'key':110
                }

                var shRun = {
                    'request':'sendLine',
                    'text':'sh run\r'
                }

                var qcode = {
                    'request':'sendLine',
                    'text':'q'
                }

                var disable = {
                    'request':'sendLine',
                    'text':'disable\r'
                }

                /*setTimeout(function (){
                     ws.send(JSON.stringify(command));
                     ws.send(JSON.stringify(command2));
                     ws.send(JSON.stringify(command3));
                     ws.send(JSON.stringify(command5));
                     ws.send(JSON.stringify(command6));
                     ws.send(JSON.stringify(command7));
                     ws.send(JSON.stringify(command3));
                     ws.send(JSON.stringify(shRun));
                     ws.send(JSON.stringify(qcode));
                     ws.send(JSON.stringify(disable));
                }, 1000);

                setTimeout(function (){
                    ws.send(JSON.stringify(disconnect));
                }, 10000);*/


            }

        }
        $('#term').html($('#term').html() + ab2str(event.data).replace("\n", "<br />").replace(/[\n\r]/g, " <br />"));
        $('#term').animate({scrollTop: $('#term').prop("scrollHeight")}, 200);
    };


    $('#getChar').focus();

    $('#getChar').on('input', function (event) {
        if (ws.readyState === 1) {
            var s = $(this).val();
            $(this).val('');
            var data = {
                'request':'sendChar',
                'key': s.charCodeAt(0)
            };
            ws.send(JSON.stringify(data));
        }
    });

    $('#getChar').on('keyup', function (event) {
        console.log(event.which);
        if (ws.readyState === 1) {
            if (event.which === 13) {
                var data = {
                    'request':'sendChar',
                    'key': 13
                };
                ws.send(JSON.stringify(data));
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
