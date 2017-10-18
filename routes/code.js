exports.process = function(request,response) {
	var orequest = require('request');
	
	var result = {msg:"",data:{}};

	var body = '';
    request.on('data',function(data) {
        body += data;
    });

    request.on('end',function() {
	    /*
		    json should contain:
		    	code.type		- the service, like 'sage'
		    	code.code		- the code to run
		    	code.namespace	- the namespace to store variables under
		    	code.vars		- any variables to store from the run
		*/
	    var code = JSON.parse(body);
    
	    var serviceURL = null;
	    try {
	    	serviceURL = request.app.get("services")[code.type] + "/" + code.type;
	    } catch(err) {
		    result.msg = 'err';
			result.data.error = String(error);
			response.setHeader('content-type','application/json');
			response.end(JSON.stringify(result));
			return;
	    }
	    
	    var requestData = {};
	    requestData[code['type']] = code['code'];
	    requestData['vars'] = code['vars'].replace(/ /g,'').split(/\n|,/g); // split into array
	    
	    orequest({
		    url: serviceURL,
		    method: "POST",
		    json: requestData
		}, function (error, oresponse, body) {
			
			if(error) {
				result.msg = 'err';
				result.data.error = String(error);
			} else if (oresponse.statusCode !== 200) {
				result.msg = 'err';
				result.data.error = 'service return status code: ' + oresponse.statusCode;
			} else {
	        	result.msg = 'blockrun';
	        	/// attach like: result.data[code['namespace']] = JSON.parse(body)
				/// result.data.resources = <- i'll have to fetch these right?
	        }
	        
	        response.setHeader('content-type','application/json');
			response.end(JSON.stringify(result));
	    });
	    
		
	});
};