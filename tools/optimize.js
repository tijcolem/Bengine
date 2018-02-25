/* eslint-env node, es6 */
/* eslint no-console: "off" */

const fs = require('fs');
const https = require("https");

console.log("Welcome. This will create faster Bengine pages by downloading block dependencies.\n");
console.log("If no block types are listed in the command line arguments, then all dependencies will be added to the optimized page.");
console.log("Usage: node optimize.js [blocktype, ...]\n");

var getRequestSaveFile = (url,path) => {
	console.log("getting... " + url);
	https.get(url, (response) => {
		response.setEncoding("utf8");
		let body = "";
		response.on("data", (data) => {
			body += data;
		});
	  	response.on("end", () => {
		  	let fpath = url.split("/").pop().split("?")[0];
		  	console.log("writing... " + fpath);
	    	fs.writeFile(path + "/" + fpath, body, function(error) {
			    if(error) {
			        console.log(error);
			    }
			});
		});
	});
};

var readBlocks = (resolve,reject) => {
	var blocks = {};
	var optimize = [];
	fs.readdir(__dirname + "/../blocks", (err, files) => {
		files.forEach((file) => {
			blocks[file] = __dirname + "/../blocks/" + file + "/" + file + ".js";
			if(process.argv.length < 3) {
				optimize.push(file);
			}
		});
		
		if(optimize.length <= 0) {
			for(let i = 0; i < process.argv.length; i++) {
				if(process.argv[i].indexOf("node") !== -1 && process.argv[i].indexOf("optimize.js") !== -1)
				optimize.push(process.argv[i]);
			}
		}
		
		resolve({"blocks":blocks,"optimize":optimize});
	});
};

var evalBlocks = (result) => {
	var blocks = result["blocks"];
	var optimize = result["optimize"];
	
	var Bengine = {"extensibles":{}};
	var Blocks = Object.keys(blocks);
	optimize.forEach((block) => {
		if(Blocks.indexOf(block) > -1) {
			console.log("reading... " + block);
			var data = fs.readFileSync(blocks[block], {encoding: 'utf-8'});
			eval(data);
			
			// minify block while we're at it
			console.log("minifying... " + block);
			var result = UglifyJS.minify(data);
			if(result.error) {
				console.log(result.error);
			} else {
				console.log("writing... " + block + ".min.js");
				fs.writeFile(__dirname + "/../public/blocks_minified/" + block + ".min.js", result.code, function(error) {
				    if(error) {
				        console.log(error);
				    }
				});
			}
		}
	});
	
	return Bengine;
};

var getBlockDependencies = (Bengine) => {
	let depDir = __dirname + "/../public/block_dependencies";
	console.log("checking for directory: " + depDir);
	if (!fs.existsSync(depDir)){
	    fs.mkdirSync(depDir);
	}
	
	let minDir = __dirname + "/../public/blocks_minified";
	console.log("checking for directory: " + minDir);
	if (!fs.existsSync(minDir)){
	    fs.mkdirSync(minDir);
	}
	
	let retrievedScripts = []; // used to stop repetitive dependency requests
	for(var prop in Bengine.extensibles)(function(prop) {
		if(Bengine.extensibles.hasOwnProperty(prop)) {
			var scriptArray = Bengine.extensibles[prop].fetchDependencies();
			if(scriptArray !== null) {
				scriptArray.forEach((script) => {
					if(script.source && retrievedScripts.indexOf(script.source) === -1) {
						retrievedScripts.push(script.source);
						getRequestSaveFile(script.source,depDir);
					} 
				})
			}
		}
	})(prop);
};

/* download block dependencies */
new Promise(readBlocks).then(evalBlocks).then((Bengine) => {
	getBlockDependencies(Bengine);
});

/* minify bengine js & css */
const UglifyJS = require("uglify-es");

fs.readFile(__dirname + "/../public/js/bengine.js", {encoding: 'utf-8'}, (err, data) => {
	console.log("minifying... bengine.js");
	var result = UglifyJS.minify(data);
	if(result.error) {
		console.log(result.error);
	} else {
		console.log("writing... bengine.min.js");
		fs.writeFile(__dirname + "/../public/js/bengine.min.js", result.code, function(error) {
		    if(error) {
		        console.log(error);
		    }
		});
	}
});

/* // minify css? it's embeded in js files
var CleanCSS = require('clean-css');
var input = 'a{font-weight:bold;}';
var options = {};
var output = new CleanCSS(options).minify(input);
*/


