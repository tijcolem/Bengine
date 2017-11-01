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
		    	code.bank		- name of bank (could be user)
		    	code.type		- the service, like 'sage'
		    	code.code		- the code to run
		    	code.namespace	- the namespace to store variables under
		    	code.pid		- page id
		    	code.vars		- any variables to store from the run
		    	code.version	- any variables to store from the run
		*/
	    var code = JSON.parse(body);
    
	    var serviceURL = null;
	    try {
	    	serviceURL = request.app.get("services")[code.type];
	    } catch(err) {
		    result.msg = 'err';
			result.data.error = String(error);
			response.setHeader('content-type','application/json');
			response.end(JSON.stringify(result));
			return;
	    }
	    
	    var requestData = {};
	    requestData[code['type']] = code['code'];
	    requestData['vars'] = code['vars'].replace(/ /g,'').replace(/\n$/,'').split(/\n|,/g); // split into array
	    
	    orequest({
		    url: serviceURL + "/" + code.type,
		    method: "POST",
		    body: requestData,
		    json: true
		}, function (error, oresponse, obody) {
			var rnow = true; // if resources are requested, set to false to send response data after promises
			if(error) {
				result.msg = 'err';
				result.data.error = String(error);
			} else if (oresponse.statusCode !== 200) {
				result.msg = 'err';
				result.data.error = 'service return status code: ' + oresponse.statusCode;
			} else {
				result.data[code['namespace']] = {'variables':{},'resources':[]};
				
				/* grab variables and resource names */
				var resourceQueue = [];
				for(var key in obody) {
					if(!obody.hasOwnProperty(key)) continue;
					if(key[0] === '_') {
						let rpromise = new Promise((resolve,reject) => {
							orequest({
								url: serviceURL + "/static/" + obody[key],
								method:"GET",
								encoding: null
							}, function(error,sresponse,sbody) {
								if(error) {
									reject(error);
								} else if (sresponse.statusCode !== 200) {
									reject(sresponse.statusCode);
								} else {
									resolve({'name':key,'file':obody[key][0],'content':sbody});
								}
							});
						});
						resourceQueue.push(rpromise);
					} else {
						result.data[code['namespace']]['variables'][key] = obody[key][0];
					}
				}
				
				/* fetch any requested resources*/
				if(resourceQueue.length > 0) {
					const mime = require('mime');
					const fs = require('fs');
					rnow = false;
					Promise.all(resourceQueue).then(values => {
						writeQueue = [];
						values.forEach(function(fdata) {							
							let wpromise = new Promise((resolve,reject) => {
								let path = ["./public/content/",code.bank,'/',code.pid,'/',code.version,'/',fdata['file']].join('');
								fs.writeFile(path,fdata['content'],function(err) {
									if(err) {
										reject(err);
									} else {
										resolve('');	
									}
								});
							});
							writeQueue.push(wpromise);

							let path = ["/content/",code.bank,'/',code.pid,'/',code.version,'/',fdata['file']].join('');
							result.data[code['namespace']]['variables'][fdata['name']] = path;
						});
						
						Promise.all(writeQueue).then(values => {
							result.msg = 'done';
							response.setHeader('content-type','application/json');
							response.end(JSON.stringify(result));
						}).catch(error => {
							result.msg = 'err';
							result.data.error = 'Error writing requested resource: ' + String(error);
							response.setHeader('content-type','application/json');
							response.end(JSON.stringify(result));
						});
					}).catch(error => {
						result.msg = 'err';
						result.data.error = 'Error retrieving requested resource: ' + String(error);
						response.setHeader('content-type','application/json');
						response.end(JSON.stringify(result));
					});
				}
				
				result.msg = 'done';
	        }
	        
	        if(rnow) {
		        response.setHeader('content-type','application/json');
				response.end(JSON.stringify(result));
	        }
	        
	    });
	});
};