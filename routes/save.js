exports.process = function(request,response) {
	const fs = require('fs');
	const path = require('path');
	const valid = require('../lib/valid.js');
	const rest = require('../lib/rest.js');
        const randomstring = require('randomstring');
        const Cookies = require( "cookies" );

        cookies = new Cookies( request, response )

	var body = '';
    request.on('data',function(data) {
        body += data;
        
        if (body.length > 1e6) {
			request.connection.destroy();
			rest.respond(response,413,'Body Is Too Large',{});
			return;
		}
    });

	var rData = {};
    request.on('end',function() {
	    blocks = JSON.parse(body);
	    
	    /*
		    types		[string,...]		block types
		    content		[object,...]		block content
		    fpath		(string)			path to assets
		    tabid		(number)			0 -> temp save, 1 -> perm save
		*/
		
		// validate path
		if(!valid.type(blocks.fpath,'string')) {
			rest.respond(response,400,'Invalid Type: assets path',{});
			return;
		}
		if(blocks.fpath.length < 1) {
			rest.respond(response,400,'Invalid Length: assets path',{});
			return;
		}
		
		blocks.fpath = blocks.fpath.replace(/^\/(.+)?\/$/g,"$1");
		
		// create page directory if not exists
		const targetDir = ["public","content",blocks.fpath].join(path.sep);
		const initDir = path.isAbsolute(targetDir) ? path.sep : '';
		
		targetDir.split(path.sep).reduce((parentDir, childDir) => {
			const curDir = path.resolve(parentDir, childDir);
			if (!fs.existsSync(curDir)) {
				fs.mkdirSync(curDir);
			}
			
			return curDir;
		}, initDir);
		
	
                // generate a new random string to prefix to filename and store in cookie
                var prefix_file = null;                                                       
                if (cookies.get('filename')) {                                                
                        prefix_file = cookies.get('filename')                                 
                        console.log(request.cookies)                                          
                }                                                                             
                 else {                                                                       
                      let options = {                                                         
                      maxAge: 1000 * 60 * 60 * 6, // 6 hours                
                      httpOnly: false, 
                      signed: false              
                       }                                                                      
                      prefix_file = randomstring.generate(10);                                
                      response.cookie('filename', prefix_file, options) // options is optional
                 }                                                                          
                                                                                            
                                                                                            
                var fileName = prefix_file + "_bengine.json";                               
                var fileContent = JSON.stringify(blocks);                         
	
		// write file
		fs.writeFile(targetDir + path.sep + fileName, fileContent, function(error) {
			if(error) {
				rest.respond(response,400,String(error),{});
				return;
			}
			rest.respond(response,200,'done',{});
		});
		
		/// clean up unused resources now
	});
};


