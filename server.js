/* this server exists for testing basic back-end functionality */

module.exports = function(config) {

	const busboy = require('connect-busboy');
	const express = require('express');
	const https = require('https');
	const http = require('http');
	const cookieParser = require('cookie-parser');
	const routes = require('./routes.js');
	
	/* test if any routes are broken */
	for (var route in routes) {
	    if (routes.hasOwnProperty(route)) {
	        if(typeof routes[route] === 'undefined') {
	            console.log('fatal error, undefined route: ' + route);
	            process.send({code:'fatal'});
	        }
	    }
	}
	
	/* get express server object */
	var app = express();
	
	/* add config to express.request object */
	app.set("domain",config["domain"]);
	
	/* set "level" */
	if(config["level"].indexOf("dev") > -1) {
		app.set("testing",true);
	} else if(config["level"].indexOf("sta") > -1) {
		app.set("testing",true);
	} else if(config["level"].indexOf("pro") > -1) {
		app.set("testing",false);
	}
	
	/* set any back-end routes */
	app.set("services",config["services"]);
	
	/* set static file path */
	app.use(express.static('public'));
	
	/* disable this http header */
	app.disable('x-powered-by');
	
	/* set up path to persistent files */
	app.set("fileRoute",__dirname + "/public/");
	
	/* set uploaded file size limit */
	app.use(busboy({
		limits: {
			fileSize: config["filesizelimit"]
		}
	}));
	
	/* set up cookie parser */
	app.use(cookieParser());
	
	/* set up database */
	if(config["persistence"]["type"].indexOf("mysql") > -1) {
		var mysql = require('mysql');

		var db = mysql.createPool({
			connectionLimit : 100,
			host     : config["persistence"]["host"],
			user     : config["persistence"]["user"],
			password : config["persistence"]["password"],
			database : config["persistence"]["database"]
		});
		
		db.getConnection(function(error,connection) {
			if(error || typeof connection === 'undefined') {
				console.log('db connection error: ' + error + '\n');
				if(connection !== 'undefined') {
		            connection.release();
		        }
				process.send({code:'fatal'});
			} else {
				app.set("db",db);
				connection.release();
			}
		});
	} else if(config["persistence"]["type"].indexOf("mongo") > -1) {
		var MongoClient = require('mongodb').MongoClient;
		var f = require('util').format;

		let muser = encodeURIComponent(config["persistence"]["user"]);
		let mpassword = encodeURIComponent(config["persistence"]["password"]);
		let mhost = config["persistence"]["host"];
		let mdatabase = config["persistence"]["database"];
		let authMechanism = 'DEFAULT';
		
		var mongourl = f('mongodb://%s:%s@%s/%s?authMechanism=%s',mongoUser,mongoPassword,mhost,mdatabase,authMechanism);
		
		/* default mongodb url */
		MongoClient.connect(mongourl,function(err,db) {
			if(err) {
				console.log('db connection error: ' + err + '\n');
				process.send({code:'fatal'});
			} else {
				app.set("db",db);
			}
		});
	} else if(config["persistence"]["type"].indexOf("file") > -1) {
		/// how to set file database?
	} else {
		app.set("db",null);
	}
	
	/* set up cache database */
	if (config["cache"]["type"].indexOf("redis") > -1) {
		var redis = require("redis");

		var cache = redis.createClient();
		cache.auth(config["cache"]["password"]);
		cache.select(config["cache"]["database"],function() { /* ... */ });
		
		cache.on('error',function(err) {
			console.log(err);
		});
		
		/* request.app.get("cache") */
		app.set("cache",cache);
	} else {
		app.set("cache",null);
	}
	
	var session = require('express-session');
	var sessionStore = null;
	if(config["sessionstore"]["type"] === "mysql") {
		var MySQLStore = require('express-mysql-session')(session);
		sessionStore = new MySQLStore({
			connectionLimit : 100,
			host     : config["sessionstore"]["host"],
			user     : config["sessionstore"]["user"],
			password : config["sessionstore"]["password"],
			database : config["sessionstore"]["database"]
		});
	} else if(config["sessionstore"]["type"] === "redis") {
		var RedisStore = require('connect-redis')(session);
		sessionStore = new RedisStore({
			host: config["sessionstore"]["host"],
			port: 6379,
			client: redis.createClient(),
			db: config["sessionstore"]["database"],
			pass: config["sessionstore"]["password"],
			disableTTL: true,
			prefix: 'session:'
		});
	}
	
	if(sessionStore !== null) {
		app.use(session({
			key : config["session"]["key"],
			secret: config["session"]["secrety"],
			resave: config["session"]["resave"],
			saveUninitialized: config["session"]["saveUninitialized"],
			store: sessionStore
		}));
	}
	
	/* routes */
	/// log in 
	/// log out
	/// edit page
	/// preview page
	/// embed page
	app.post('/code',routes.code);
	app.post('/revert',routes.revert);
	app.post('/save',routes.save);
	app.post('/upload',routes.upload);
	
	app.all('*',function(request,response) {
		response.status(404);
		response.end("Page Not Found");
	});
	
	/* start http server */
	if(config["port"]["http"]) {
		http.createServer(app).listen(config["port"]["http"],function() {
			console.log("bengine http server listening at " + config["port"]["http"]);
		});
	}
	
	if(config["port"]["https"]) {
		/* get ssl certificates */
		const fs = require("fs");
		var privateKey = fs.readFileSync(__dirname + '/ssl/bengine.key');
		var certificate = fs.readFileSync(__dirname + '/ssl/bengine.pem');
		
		/* start https server */
		https.createServer({
		    key: privateKey,
		    cert: certificate
		}, app).listen(config["port"]["https"],function() {
			console.log("bengine https server listening at " + config["port"]["https"]);
		});
	}

	process.on('SIGINT',function() {
		// place any clean up here
	    process.exit();
	});
	
	return app;
}