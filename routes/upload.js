exports.process = function(request,response) {
	var result = {msg:"",data:{}};

	var body = '';
    request.on('data',function(data) {
        body += data;
    });
    
    // mp3 mp4 jpg

    request.on('end',function() {
		result.msg = 'success';
		response.setHeader('content-type','application/json');
		response.end(JSON.stringify(result));
	});
};