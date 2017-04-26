/* this server exists for testing basic back-end functionality */

module.exports = function(port) {

	var express = require('express');
	var busboy = require('connect-busboy');
	var routes = require('./routes.js');
	
	var app = express();
	app.use(express.static('public'));
	
	app.post('/revert',routes.revert);
	app.post('/save',routes.save);
	app.post('/upload',routes.upload);
	
	app.all('*',function(request,response) {
		response.status(404);
		response.end("page not found");
	});
		
	app.listen(port,function() {
		console.log("bengine server listening at " + port);
	});
	
	return app;
}