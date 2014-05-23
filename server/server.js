'use strict';

var util = require('util');

var socketio=require('socket.io'),
    cfg = {
        secure: true,
        port: process.argv[2] || 443,
        pfx: require('fs').readFileSync(__dirname+'/cert.pfx')
    },
    connected = 0;

// https server that responds with the number of active websockets
var httpServer = require('https').createServer(cfg, function(req,res){
	global.gc();
    res.writeHead(200, {'Content-Type': 'application/json'});
	res.write(util.inspect(process.memoryUsage()));
	res.write('\n');
    res.end(JSON.stringify({'connected':connected}));
});

// socket.io server bound to the https server
var io = socketio.listen(httpServer);
io.set('transports', ['websocket']);
io.set('log', false);
io.set('log level',1); 

io.sockets.on('connection', function(socket) {
    ++connected;
    
    socket.on('error', function(e){
        --connected;
        console.log('socket error', connected);
    });
	
    socket.on('disconnect', function(r){
        --connected;
        //console.log('socket disconnect', connected);
    });
    socket.on('ping', function(ack){
        if(typeof ack === 'function') {
            ack('pong');
        }
    });
});

httpServer.listen(cfg.port, function(){
    console.log('server listening on port',cfg.port);
});
