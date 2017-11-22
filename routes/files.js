exports.process = function(request,response) {
	const orequest = require('request');
	const fs = require('fs');
	const path = require('path');
	const rest = require('../lib/rest.js');
	
	var rData = {};

	var body = '';
    request.on('data',function(data) {
        body += data;
        
        if (body.length > 1e6) {
			request.connection.destroy();
			rest.respond(response,413,'Body Is Too Large',{});
			return;
		}
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
	    rData['files'] = {};
	    checkQueue = [];
	    fdata.files.forEach(function(element) {

			if(element.indexOf('http') > -1) {
				var fparts = element.split('/');
				var fname = fparts[fparts.length-1];
				var findex = fname;
				
				var dirs = ['/content/',fdata.bank,'/',fdata.pid,'/',fdata.version,'/assets/'].join('');
				var fpath = dirs + fname;
				
				// create asset directory if not exists
				const targetDir = './public' + dirs;
				const initDir = path.isAbsolute(targetDir) ? path.sep : '';
				
				targetDir.split(path.sep).reduce((parentDir, childDir) => {
					const curDir = path.resolve(parentDir, childDir);
					if (!fs.existsSync(curDir)) {
						fs.mkdirSync(curDir);
					}
					return curDir;
				}, initDir);
				
				var cpromise = new Promise((resolve,reject) => {
					orequest({
					    url: element,
					    method: "GET",
					    encoding: null
					}, function(error,sresponse,sbody) {
						if(error) {
							reject('Message: ' + error);
						} else if (sresponse.statusCode === 404) {
							reject('Could not retrieve: ' + element);
						} else if (sresponse.statusCode !== 200) {
							reject('Status: ' + sresponse.statusCode);
						} else {
							fs.writeFile('./public' + fpath,sbody,function(err) {
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
			    var fpath = ['/content/',fdata.bank,'/',fdata.pid,'/',fdata.version,'/assets/',element].join('');
			    var cpromise = new Promise((resolve,reject) => {
				    fs.stat('./public' + fpath,function(err,stat) {
					    if(err == null) {
						    resolve('');
						} else {
							reject(element);
						}
					});
			    });
			}
		    checkQueue.push(cpromise);
		    
		    rData.files[findex] = fpath;
		});
	    
	    Promise.all(checkQueue).then(values => {
		    rest.respond(response,200,'done',rData);
		}).catch(error => {
			rest.respond(response,404,'Error. ' + error,rData);
		});
	});
};