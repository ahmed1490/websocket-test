// Require HTTP module (to start server) and Socket.IO
var http = require('http'), 
io = require('socket.io'),
path = require('path'),
url = require('url'),
fs = require('fs');
var mimeTypes = {
    "html": "text/html",
    "jpeg": "image/jpeg",
    "jpg": "image/jpeg",
    "png": "image/png",
    "js": "text/javascript",
    "css": "text/css"
};

// Start the server at port 8080
server = http.createServer(function(req, res) {
    var uri = url.parse(req.url).pathname;
    var filename = path.join(process.cwd(), uri);
    fs.exists(filename, function(exists) {
        if(!exists) {
            console.log("not exists: " + filename);
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.write('404 Not Found\n');
            res.end();
		return;
        }
        var mimeType = mimeTypes[path.extname(filename).split(".")[1]];
        res.writeHead(200, mimeType);

        var fileStream = fs.createReadStream(filename);
        fileStream.pipe(res);

    }); //end path.exists
});

server.listen(8080);

// Create a Socket.IO instance, passing it our server
var socket = io.listen(server).set('transports', [                     // enable all transports (optional if you want flashsocket)
    'websocket',
  ,'flashsocket'
	, 'xhr-polling'
  , 'htmlfile'
  , 'jsonp-polling'
]);


// Add a connect listener
socket.on('connection', function(client){ 
//	console.log("client is :",client)	
	// Success!  Now listen to messages to be received
	client.on('message',function(event){ 
		console.log('Received message from client!',event);
		client.emit('mm',event);
	});
	client.on('disconnect',function(){
		//clearInterval(interval);
		console.log('Server has disconnected');
	});

});
