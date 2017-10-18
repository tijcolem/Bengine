exports.process = function(request,response) {
	var result = {msg:"",data:{}};

	var body = '';
    request.on('data',function(data) {
        body += data;
    });

    request.on('end',function() {
	    blocks = JSON.parse(body);
	    
	    /*
		    types		[array]		block types
		    content		[array]		block content (should be object, save as string)
		    xid			[number]	used to identify which user's page to save this to
		    pagetype	[string]	used to identify which table schema to use
		    tabid		[number]	0 -> temp save, 1 -> perm save
		*/
	    
		result.msg = 'blocksaved';
		response.setHeader('content-type','application/json');
		response.end(JSON.stringify(result));
	});
};