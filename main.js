if(process.argv.length !== 3) {
	console.log("Usage: node main [port]");
	process.exit();
} else {
	var port = process.argv[2];
}

var server = require('./server.js')(port);
if(server === 'err') {
	process.exit();
}