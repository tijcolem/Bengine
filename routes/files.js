exports.process = function(request,response) {
	var orequest = require('request');
	var fs = require('fs');
	
	var result = {msg:"",data:{}};

	var body = '';
    request.on('data',function(data) {
        body += data;
    });

    request.on('end',function() {
	    /*
		    json should contain:
		    	fdata.bank			- name of bank (could be user)
		    	fdata.files			- array of files to retrieve
		    	fdata.namespace		- the namespace to put files under
		    	fdata.pid			- page id
		    	fdata.version		- any variables to store from the run
		    	
		    	files are stored like: bank/pid/version
		    		* they can really be interpreted any way you like, for example:
		    			arithmetic/addition/1.1
		    			bob_the_user/bobs_awesome_pages/bobs_first_awesome_page
		*/
	    var fdata = JSON.parse(body);
	    
	    /* just send back the path to the files, check they exist though */
	    result.data['files'] = {};
	    checkQueue = [];
	    fdata.files.forEach(function(element) {

			if(element.indexOf('http') > -1) {
				var fparts = element.split('/');
				var fname = fparts[fparts.length-1];
				var findex = fname;
				var path = ['/content/',fdata.bank,'/',fdata.pid,'/',fdata.version,'/',fname].join('');
				
				var cpromise = new Promise((resolve,reject) => {
					orequest({
					    url: element,
					    method: "GET",
					    encoding: null
					}, function(error,sresponse,sbody) {
						if(error) {
							reject(error);
						} else if (sresponse.statusCode !== 200) {
							reject(sresponse.statusCode);
						} else {
							fs.writeFile('./public' + path,sbody,function(err) {
								if(err) {
									reject(err);
								} else {
									resolve('');	
								}
							});
						}
					});
				});
			} else {
				var findex = element;
			    var path = ['/content/',fdata.bank,'/',fdata.pid,'/',fdata.version,'/',element].join('');
			    var cpromise = new Promise((resolve,reject) => {
				    fs.stat('./public' + path,function(err,stat) {
					    if(err == null) {
						    resolve('');
						} else {
							reject(element);
						}
					});
			    });
			}
		    checkQueue.push(cpromise);
		    
		    result.data.files[findex] = path;
		});
	    
	    Promise.all(checkQueue).then(values => {
		    result.msg = 'done';
			response.setHeader('content-type','application/json');
			response.end(JSON.stringify(result));
		}).catch(error => {
			result.msg = 'err';
			result.data.error = 'A resource does not exist: ' + String(error);
			response.setHeader('content-type','application/json');
			response.end(JSON.stringify(result));
		});
	});
};