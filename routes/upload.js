exports.process = function(request,response) {
	const rest = require('../lib/rest.js');
	const fs = require('fs');
	const orequest = require('request');
    
    // mp3 mp4 jpg
    
    /*
	    query should contain:
	    	query.fpath		- path to file assets
	    	query.btype		- the service, like 'sage'
	*/

	request.pipe(request.busboy);

    request.busboy.on('file',function(fieldname,file,filename) {
	    /* handle file size limits */
		file.on('limit',function(data) {
			file.resume();
			rest.respond(response,413,'File Is Too Large',{});
		});
		
		/* create page directory if not exists */
		var reldir = decodeURIComponent(request.query.fpath).replace(/^\/(.+)?\/$/g,"$1") + "/assets/";
		var absdir = './public/content/' + reldir;
		const initDir = path.isAbsolute(absdir) ? path.sep : '';
		
		asbdir.split(path.sep).reduce((parentDir, childDir) => {
			const curDir = path.resolve(parentDir, childDir);
			if (!fs.existsSync(curDir)) {
				fs.mkdirSync(curDir);
			}
			
			return curDir;
		}, initDir);
		
		/* replace spaces with underscores, fixes issues with shell commands */
		var fileinput = filename.replace(/ /g,"_");
		var fullpath = absdir + fileinput;

		/* save the file, then process it */
		var fstream = fs.createWriteStream(fullpath);
		file.pipe(fstream);

		fstream.on('close',function() {
			// if service exists, run it
			try {
				const service = require('../blocks/' + request.query.btype + '/service.js');
				
				/* this is necessary to allow browsers to continually receive responses, opposed to just one at the end */
				response.writeHead(200,{'Content-Type':'text/plain','X-Content-Type-Options':'nosniff'});
				
				/*
					Media Services Expect:
						{
							'input' : '$file-name-to-convert'
							'cmd'   : [command,to,run]
						}
					* cmd array requires 'INPUT' & 'OUTPUT' to tell service where to insert input and output file names
				*/
				var serveData = {
					'input':reldir + fileinput,
					'cmd':service.command
				}
			
				serviceURL = request.app.get("services")[query.btype];
				
				orequest.post({
				    url: serviceURL + "/service",
				    body: serveData,
				    json: true
				}).on('error', function(error) {
					response.status = 400;
					response.end(String(error));
				}).on('data', function(data) {
					service.process(response,data);
				}).on('response', function(response) {
					response.end('');
				});
			} catch(err) {
				// could not load service, just return uploaded file path
				response.end("," + '/content/' + reldir + fileinput);
			}
		});
	});	
};