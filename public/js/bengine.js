/* eslint-env browser, es6 */
/******
	Title: Block Engine
	This is the front-end for the Block Engine.
	
	The following is a list of DOM ids you can use to display Bengine info:
	
	bengine-savestatus-[engine-name]-			<div> : displays whether the page is saved or not
	bengine-progressbar-[engine-name]-			<progress> : displays save/upload progress
	
******/

/* list any objects js dependencies */
/*
	global alertify:true
*/

/* append all configuration to this in other scripts */
var BengineConfig = {
	extensibles: {},
	funcs: {},
	options: {}
}

/***
	Bengine
	
	Public Attributes

		options	: object
			- bengine configuration options

			blockLimit : number	: 8		
				- number of blocks allowed on page
			
			enableSave : boolean : true
				- enable save function, bengine.saveBlocks() will send block info to DOMAIN/save
			
			enableSingleView : boolean : false
				- enable single view, bengine.blockContentShow() will display blocks as a slideshow
			
			loadStyles : boolean : true
				- load bengine css styles. if false, you should supply your own bengine styles
			
			mediaLimit : number : 100
				- number of megabytes to limit media upload sizes to
			
			playableMediaLimit : number : 180
				- number of seconds to limie media upload play times to
			
			swidth : string : 900px
				- the width of the page before bengine goes into mobile responsive view
			
		resources : object
			- any resources created by qengine blocks are stored here
		
		variables : object
			- any variables created by qengine blocks are stored here
			
			qengine : object
				- the only default namespace that comes with a new bengine instance. it will contain 'randomseed'
	
	Public Methods
	
		blockContentShow
		
		blockEngineStart
		
		saveBlocks
		
		revertBlocks
	
	Private Attributes
	
		categoryCounts : object
			- keeps track of how many blocks for each block type are in the extensibles
			
			code : number
				- the number of code blocks in the extensibles
			
			media : number
				- the number of media blocks in the extensibles
			
			text : number
				- the number of text blocks in the extensibles
			
			qengine : number
				- the number of qengine blocks in the extensibles
	
		extensibles : object
			- bengine block objects are attached to this
	
		main : string
			- the name of this bengine instance. used to refer to this instance in the DOM by id
	
	Replaceable Private Methods
	
		createURL 
			- creates a url based of the current one. 
			
			path : string
				- the path to add to the url, protocol + // + domain + path
		
		progressFinalize
			- updates progress bar, autosave bar, and save bar
			
			msg : string
				- message to display on save bar
			max : number
				- max value to set on progress bar
		
		progressInitialize
		
		progressUpdate
	
	Non-Replaceable Private Methods
		
		countBlocks
		
		generateBlocks
		
		blockStyle
		
		blockScripts
		
		blockButtons
		
		runCodeBlock
		
		addRunBtn
		
		makeSpace
		
		insertBlock
		
		createBlock
		
		addBlock
		
		closeSpace
		
		removeBlock
		
		deleteBlock
		
		uploadMedia
		
***/
function Bengine(extensibles,funcs,options) {

/***
	Section: Bengine Public Attributes
	Create Bengine's public attributes
***/

var _public = {};
_public.options = options;
_public.resources = {};
_public.variables = {'qengine':{}};;

this.options = _public.options;
this.resources = _public.resources;
this.variables = _public.variables;

/***
	Section: Bengine Private Attributes
	Create Bengine's private attributes
***/

var _private = {};
_private.categoryCounts = {};
_private.extensibles = extensibles;
_private.main = '';

/***
	Section: Configuration Options
	Load configuration options or set their default
***/

_public.options.blockLimit = options.blockLimit || 8;
_public.options.enableSave = (options.enableSave !== false);
_public.options.enableSingleView = options.enableSingleView || false;
_public.options.loadStyles = (options.loadStyles !== false);
_public.options.mediaLimit = options.mediaLimit || 100; // mb
_public.options.playableMediaLimit = options.playableMediaLimit || 180; // seconds
_public.options.swidth = options.swidth || "900px";

/***
	Section: Start Up Code
	Any necessary start up code for Bengine goes here.
***/

this.variables.qengine.randomseed = Math.floor(Math.random() * 4294967296);

_private.categoryCounts.code = 0;
_private.categoryCounts.media = 0;
_private.categoryCounts.text = 0;
_private.categoryCounts.qengine = 0;

if(_public.options.loadStyles) {
	var style = document.createElement('style');
	style.type = 'text/css';
	style.innerHTML = `
	.bengine-block-style {
	}
	.bengine-instance {
		overflow: hidden;
	}
	.bengine-block-style-embed {
		height: 85vh !important;
		margin: 0 !important;
	}
	.bengine-x-blocks {
	
	}
	.bengine-single-view {
		width: 100%;
		height: 15vh;
		position: absolute;
		bottom: 0;
		right: 0;
	}
	.bengine-btn-embed {
		border: 0;
		color: black;
		float: left;
		width: 100%;
		height: 100%;
		padding: 0px 30px;
		text-align: center;
		cursor: pointer;
		transition: background-color .5s;
		touch-action: manipulation;
		font-size: 1em;
		font-weight: 400;
	}
	.bengine-btn-color {
		background-color: rgb(0, 0, 0);
		color: white;
		font-size: 1.3em;
	}
	.bengine-btn-color:hover {
		background-color: rgba(0, 0, 0, 0.6);
		color: black;
	}
	.bengine-block {
		margin: 0;
		padding: 0;
	}
	.bengine-blockbtns {
		margin: 50px auto 0px auto;
		position: relative;
	}
	
	.bengine-blockbtn {
		color: black;
		border: 1px solid black;
	
		width: 100%;
	
		padding: 6px 12px;
		text-align: center;
	
		cursor: pointer;
		transition: background-color .5s;
		touch-action: manipulation;
	
		font-size: 1em;
		font-weight: 400;
	}
	.bengine-addbtn {
		background-color: white;
	}
	.bengine-addbtn:hover {
		background-color: lightgray;
	}
	.bengine-delbtn {
		background-color: #ff1818;
	}
	.bengine-delbtn:hover {
		background-color: #a81313;
	}
	@media screen and (max-width: ${_public.options.swidth}) {
	    .bengine-blockbtns { width: 100%; }
		.bengine-blockbtn { width: 100%; }
	}
	`;
	
	/* grid system */
	style.innerHTML += `.col{box-sizing:border-box;position:relative;float:left;min-height:1px}.col-1{width:1%}.col-2{width:2%}.col-3{width:3%}.col-4{width:4%}.col-5{width:5%}.col-6{width:6%}.col-7{width:7%}.col-8{width:8%}.col-9{width:9%}.col-10{width:10%}.col-11{width:11%}.col-12{width:12%}.col-13{width:13%}.col-14{width:14%}.col-15{width:15%}.col-16{width:16%}.col-17{width:17%}.col-18{width:18%}.col-19{width:19%}.col-20{width:20%}.col-21{width:21%}.col-22{width:22%}.col-23{width:23%}.col-24{width:24%}.col-25{width:25%}.col-26{width:26%}.col-27{width:27%}.col-28{width:28%}.col-29{width:29%}.col-30{width:30%}.col-31{width:31%}.col-32{width:32%}.col-33{width:33%}.col-34{width:34%}.col-35{width:35%}.col-36{width:36%}.col-37{width:37%}.col-38{width:38%}.col-39{width:39%}.col-40{width:40%}.col-41{width:41%}.col-42{width:42%}.col-43{width:43%}.col-44{width:44%}.col-45{width:45%}.col-46{width:46%}.col-47{width:47%}.col-48{width:48%}.col-49{width:49%}.col-50{width:50%}.col-51{width:51%}.col-52{width:52%}.col-53{width:53%}.col-54{width:54%}.col-55{width:55%}.col-56{width:56%}.col-57{width:57%}.col-58{width:58%}.col-59{width:59%}.col-60{width:60%}.col-61{width:61%}.col-62{width:62%}.col-63{width:63%}.col-64{width:64%}.col-65{width:65%}.col-66{width:66%}.col-67{width:67%}.col-68{width:68%}.col-69{width:69%}.col-70{width:70%}.col-71{width:71%}.col-72{width:72%}.col-73{width:73%}.col-74{width:74%}.col-75{width:75%}.col-76{width:76%}.col-77{width:77%}.col-78{width:78%}.col-79{width:79%}.col-80{width:80%}.col-81{width:81%}.col-82{width:82%}.col-83{width:83%}.col-84{width:84%}.col-85{width:85%}.col-86{width:86%}.col-87{width:87%}.col-88{width:88%}.col-89{width:89%}.col-90{width:90%}.col-91{width:91%}.col-92{width:92%}.col-93{width:93%}.col-94{width:94%}.col-95{width:95%}.col-96{width:96%}.col-97{width:97%}.col-98{width:98%}.col-99{width:99%}.col-100{width:100%}.col-1_1{width:100%}.col-1_2{width:50%}.col-1_3{width:33.33%}.col-2_3{width:66.66%}.col-1_4{width:25%}.col-1_5{width:20%}.col-1_6{width:16.66%}.col-1_7{width:14.28%}.col-1_8{width:12.5%}.col-1_9{width:11.11%}.col-1_10{width:10%}.col-1_11{width:9.09%}.col-1_12{width:8.33%}`;
	
	document.getElementsByTagName('head')[0].appendChild(style);
}

/***
	Section: Validate Extensibles
***/

var validExtAttr = ["type","name","category","upload","accept","fetchDependencies","insertContent","afterDOMinsert","saveContent","showContent","styleBlock","f","g"];

for(var prop in _private.extensibles)(function(prop) {
	var extensibleAttributes = Object.keys(_private.extensibles[prop]);
	
	for(let i = 0; i < validExtAttr; i++) {
		if(validExtAttr.includes(extensibleAttributes[i]) !== true) {
			console.log("Bengine: invalid extensible configuration in " + _private.extensibles[prop]);
		}
	}
	
	if(_private.extensibles.hasOwnProperty(prop)) {
		switch(_private.extensibles[prop].category) {
			case "code":
				_private.categoryCounts.code++; break;
			case "media":
				_private.categoryCounts.media++; break;
			case "text":
				_private.categoryCounts.text++; break;
			case "qengine":
				_private.categoryCounts.qengine++; break;
			default:
				throw new Error("Invalid Category In Extensibles");
		}
	}
})(prop);


/***
	Section: Replaceable Functions
	These functions are essentially helper functions that can be replaced by custom functions passed into Bengine.
***/

// <<<code>>>

/*
	Function: emptyDiv

	Remove div contents.

	Parameters:

		node - The element whose contents will be cleared

	Returns:

		nothing - *
*/
var emptyDiv = function(node) {
	if (typeof node === "object") {
		while (node.hasChildNodes()) {
			node.removeChild(node.lastChild);
		}
	}
};

/*
	Function: createURL

	Detects local or remote host and constructs desired url.

	Parameters:

		path - The path or the url after the host, like http://localhost:80 + path

	Returns:

		nothing - *
*/
if(funcs.hasOwnProperty('createURL') && typeof funcs.createURL === 'function') {
	_private.createURL = funcs.createURL;
} else {
	_private.createURL = function(path) {
		var url = window.location.href;
		var splitUrl = url.split("/");

		/* detect local or remote routes */
		if(splitUrl[2].match(/localhost.*/)) {
			url = splitUrl[0] + "//" + splitUrl[2] + encodeURI(path);
		} else {
			url = splitUrl[0] + "//" + splitUrl[2] + encodeURI(path);
		}

		return url;
	};
}

/*
	Function: progressFinalize

	Parameters:

		msg - string, for displaying what is being progressed
		max - int, the value representing a completed progress load

	Returns:

		none - *
*/
if(funcs.hasOwnProperty('progressFinalize') && typeof funcs.progressFinalize === 'function') {
	_private.progressFinalize = funcs.progressFinalize;
} else {
	_private.progressFinalize = function(msg,max) {
		let progressbar = document.getElementById("bengine-progressbar" + _private.main);
		if(progressbar !== null) {
			progressbar.setAttribute("value",max);
			progressbar.style.visibility = "hidden";
			progressbar.style.display = "none";
		}

		let autosave = document.getElementById("bengine-autosave" + _private.main);
		if(autosave !== null) {
			autosave.style.visibility = "visible";
			autosave.style.display = "block";

		}
		
		let savebar = document.getElementById("bengine-savestatus" + _private.main)
		if(savebar !== null) {
			savebar.innerHTML = msg;
		}
	};
}

/*
	Function: progressInitialize

	Parameters:

		msg - string, for displaying what is being progressed
		max - int, the value representing a completed progress load

	Returns:

		none - *
*/
if(funcs.hasOwnProperty('progressInitialize') && typeof funcs.progressInitialize === 'function') {
	_private.progressInitialize = funcs.progressInitialize;
} else {
	_private.progressInitialize = function(msg,max) {
		let autosave = document.getElementById("bengine-autosave" + _private.main);
		if(autosave !== null) {
			autosave.style.visibility = "hidden";
			autosave.style.display = "none";
		}

		let progressbar = document.getElementById("bengine-progressbar" + _private.main);
		if(progressbar !== null) {
			progressbar.setAttribute("value",0);
			progressbar.setAttribute("max",max);
			progressbar.style.visibility = "visible";
			progressbar.style.display = "block";
		}
		
		let statusbar = document.getElementById("bengine-savestatus" + _private.main);
		if(statusbar !== null) {
			statusbar.innerHTML = msg;
		}
	};
}

/*
	Function: progressUpdate

	Parameters:

		value - int, represent current progress

	Returns:

		none - *
*/
if(funcs.hasOwnProperty('progressUpdate') && typeof funcs.progressUpdate === 'function') {
	_private.progressUpdate = funcs.progressUpdate;
} else {
	_private.progressUpdate = function(value) {
		let progressbar = document.getElementById("bengine-progressbar" + _private.main);
		if(progressbar !== null) {
			progressbar.setAttribute("value",value);
		}
	};
}

// <<<fold>>>

/***
	Section: StartUp Functions
	These are functions that need to be called on a page to start the block engine.
***/

// <<<code>>>

/*
	Function: blockContentShow

	This function create the show blocks div & returns it.

	Parameters:

	main - string, id of an html div that is already attached to the DOM.
	id - array, [name of id,id number], like [bp,1] where 1 is pid
	data - array, array of the block data [type,content,type,content,etc.]

	Returns:

		success - number, block count
*/
this.blockContentShow = function(main,id,data) {
	/* set object global, used to separate one engine from another */
	_private.main = "-" + main + "-";

	/* main div */
	var mainDiv = document.getElementById(main);

	if(mainDiv === 'undefined') {
		return -1;
	}

	/* engine div */
	var enginediv;
	enginediv = document.createElement('div');
	enginediv.setAttribute('class','bengine-instance');
	enginediv.setAttribute('id','bengine-instance' + _private.main);
	mainDiv.appendChild(enginediv);

	/* blocks */
	var blocksdiv = document.createElement('div');
	blocksdiv.setAttribute('class','bengine-x-blocks');
	blocksdiv.setAttribute('id','bengine-x-blocks' + _private.main);

	/* append blocks div to engine div */
	enginediv.appendChild(blocksdiv);

	/* append block styles */
	_private.blockStyle();
	
	/* append block dependencies */
	_private.blockScripts();

	var count = 0;
	var i = 1;
	var doubleBlockCount = data.length;

	while(count < doubleBlockCount) {
		/* create the block */
		var block = _private.generateBlock(i,data[count]);
		var retblock = _private.extensibles[data[count]].showContent(block,data[count + 1]);

		if(_public.options.enableSingleView) {
			retblock.children[0].className += " bengine-block-style-embed";
		} else {
			retblock.children[0].className += " bengine-block-style";
		}

		/* create the block div */
		var group = document.createElement('div');
		group.setAttribute('class','bengine-block bengine-block' + _private.main);
		group.setAttribute('id','bengine' + _private.main + i);

		if(_public.options.enableSingleView && i !== 1) {
			group.setAttribute('style','display:none;visibility:hidden;');
		}

		/* append group to blocks div */
		group.appendChild(retblock);
		blocksdiv.appendChild(group);

		count += 2;
		i++;
	}

	function changeBlock(dir) {
		/* back:false, forward:true */
		var direction = -1;
		if(dir) {
			direction = 1;
		}

		var viewDiv = document.getElementById('bengine-currentBlock' + _private.main);
		var viewStatus = Number(viewDiv.getAttribute('data-currentBlock'));

		var next = viewStatus + direction;

		var nextBlock = document.getElementById('bengine' + _private.main + next);
		if(nextBlock !== null) {
			var currentBlock = document.getElementById('bengine' + _private.main + viewStatus);
			currentBlock.setAttribute('style','display:none;visibility:hidden;');

			nextBlock.setAttribute('style','display:block;visibility:visible;');

			viewDiv.setAttribute('data-currentBlock',next);
		}
	}

	if(_public.options.enableSingleView) {
		var singleViewBtnsDiv = document.createElement('div');
		singleViewBtnsDiv.setAttribute('id','bengine-single-view' + _private.main);
		singleViewBtnsDiv.setAttribute('class','bengine-single-view');

		var btnBack = document.createElement('button');
		btnBack.setAttribute('class','bengine-btn-embed bengine-btn-color');
		btnBack.setAttribute('style','width: 50%;');
		btnBack.innerHTML = '&larr;';
		btnBack.onclick = function() {
			changeBlock(false);
		};

		var btnForward = document.createElement('button');
		btnForward.setAttribute('class','bengine-btn-embed bengine-btn-color');
		btnForward.setAttribute('style','width: 50%;');
		btnForward.innerHTML = '&rarr;';
		btnForward.onclick = function() {
			changeBlock(true);
		};

		var currentSingle = document.createElement('div');
		currentSingle.setAttribute('id','bengine-currentBlock' + _private.main);
		currentSingle.setAttribute('data-currentBlock',1);
		currentSingle.setAttribute('style','display:none;visibility:hidden;');

		singleViewBtnsDiv.appendChild(btnBack);
		singleViewBtnsDiv.appendChild(btnForward);
		singleViewBtnsDiv.appendChild(currentSingle);
		enginediv.appendChild(singleViewBtnsDiv);
	}

	return i;
};

/*
	Function: blockEngineStart

	This function create the blocks div & returns it.

	Parameters:

		main - string, id of an html div that is already attached to the DOM.
		id - array, [page type,xid,directory id], like ['page',1,'t'] where 1 is xid
		data - array, array of the block data [type,content,type,content,etc.]

	Returns:

		success - number, block count
*/
this.blockEngineStart = function(main,id,data) {
	/* set object global, used to separate one engine from another */
	_private.main = "-" + main + "-";

	/* main div */
	var mainDiv = document.getElementById(main);

	if(mainDiv === 'undefined') {
		return -1;
	}

	/* engine div */
	var enginediv;
	enginediv = document.createElement('div');
	enginediv.setAttribute('class','bengine-instance');
	enginediv.setAttribute('id','bengine-instance' + _private.main);
	mainDiv.appendChild(enginediv);

	/* blocks */
	var blocksdiv = document.createElement('div');
	blocksdiv.setAttribute('class','bengine-x-blocks');
	blocksdiv.setAttribute('id','bengine-x-blocks' + _private.main);

	/* append blocks div to engine div */
	enginediv.appendChild(blocksdiv);

	/* append block styles */
	_private.blockStyle();
	
	/* append block dependencies */
	_private.blockScripts();

	/* initial first block buttons, get count for style requirement below */
	var buttons = _private.blockButtons(0);
	var buttonCount = buttons.childNodes.length;
	blocksdiv.appendChild(buttons);

	var count = 0;
	var i = 1;
	var doubleBlockCount = data.length;

	/* hide the first delete button if no blocks, else show it */
	if(doubleBlockCount < 2) {
		buttons.childNodes[0].children[buttonCount - 1].style.visibility = 'hidden';
	} else {
		buttons.childNodes[0].children[buttonCount - 1].style.visibility = 'visible';
	}

	while(count < doubleBlockCount) {
		/* create the block */
		var block = _private.generateBlock(i,data[count]);		
		var retblock = _private.extensibles[data[count]].insertContent(block,data[count + 1]);
		retblock = _private.addRunBtn(i,_private.extensibles[data[count]],retblock);

		/* create the block buttons */
		buttons = _private.blockButtons(i);

		/* hide the last delete button */
		if(count === doubleBlockCount - 2) {
			/* last button is delete, so hide last delete button */
			buttons.childNodes[buttonCount - 1].children[0].style.visibility = 'hidden';
		} else {
			buttons.childNodes[buttonCount - 1].children[0].style.visibility = 'visible';
		}

		/* create block + button div */
		var group = document.createElement('div');
		group.setAttribute('class','bengine-block bengine-block' + _private.main);
		group.setAttribute('id','bengine' + _private.main + i);

		group.appendChild(retblock);
		group.appendChild(buttons);

		/* append group to blocks div */
		blocksdiv.appendChild(group);

		/* do any rendering the block needs */
		_private.extensibles[data[count]].afterDOMinsert('bengine-a' + _private.main + i,null);

		count += 2;
		i++;
	}

	/*** HIDDEN FILE FORM ***/

	/* hidden form for media uploads */
	var fileinput = document.createElement('input');
	fileinput.setAttribute('type','file');
	fileinput.setAttribute('id','bengine-file-select' + _private.main);

	var filebtn = document.createElement('button');
	filebtn.setAttribute('type','submit');
	filebtn.setAttribute('id','upload-button');

	var url = _private.createURL("/uploadmedia");

	var fileform = document.createElement('form');
	fileform.setAttribute('id','file-form');
	fileform.setAttribute('action',url);
	fileform.setAttribute('method','POST');
	fileform.style.visibility = 'hidden';

	fileform.appendChild(fileinput);
	fileform.appendChild(filebtn);

	/* append the hidden file form to the blocksdiv */
	enginediv.appendChild(fileform);

	/*** HIDDEN PAGE TYPE, XID, & DID (directory id) ***/

	/* add page id & name to hidden div */
	var idDiv = document.createElement("input");
	idDiv.setAttribute("id","bengine-x-id" + _private.main);
	idDiv.setAttribute("name",id[0]);
	idDiv.setAttribute("data-xid",id[1]);
	idDiv.setAttribute("data-did",id[2]);
	idDiv.style.visibility = 'hidden';
	idDiv.style.display = 'none';
	enginediv.appendChild(idDiv);

	/*** HIDDEN STATUS ID DIV ***/

	/* this is set to 0 after block adds and deletes & 1 after saves */
	/* it is checked when exiting a window to notify the user that the page hasn't been saved */
	var statusid = document.createElement('input');
	statusid.setAttribute('type','hidden');
	statusid.setAttribute('id','bengine-statusid' + _private.main);
	statusid.setAttribute('value','1');
	enginediv.appendChild(statusid);

	/*** HIDDEN MAIN ID DIV ***/
	var mainid = document.createElement('input');
	mainid.setAttribute('type','hidden');
	mainid.setAttribute('id','x-mainid');
	mainid.setAttribute('value',main);
	enginediv.appendChild(mainid);

	return i;
};

// <<<fold>>>

/***
	Section: Block Functions
	These are functions that handle the block generator
***/

// <<<code>>>

/*
	Function: countBlocks

	Counts the blocks on the page.

	Parameters:

		none

	Returns:

		success - number, block count
*/
_private.countBlocks = function() {

	/* block IDs are just numbers, so count the number of IDs */
	var num = 0;
	var miss = true;
	while (miss === true) {
		num++;

		/* undefined is double banged to false, and node is double banged to true */
		miss = Boolean(document.getElementById('bengine' + _private.main + num));
	}

	/* decrement num, since the check for id happens after increment */
	return --num;
};

/*
	Function: generateBlock

	Creates a content block with the given block type and block id provided.

	Parameters:

		bid - the block id
		btype - the block type

	Returns:

		success - html node, block
*/
_private.generateBlock = function(bid,btype) {
	var block = document.createElement('div');
	if(!_public.options.enableSingleView && btype !== 'title') {
		block.setAttribute('style','margin-bottom:26px;');
	}
	block.setAttribute('data-btype',btype);
	block.setAttribute('id','bengine-a' + _private.main + bid);

	return block;
};

/*
	Function: blockStyle

	Appends custom block css styles to dom.

	Parameters:

		none

	Returns:

		none
*/
_private.blockStyle = function() {
	for(var prop in _private.extensibles)(function(prop) {
		if(_private.extensibles.hasOwnProperty(prop)) {
			/* attach the blocks styline */
			var style = document.createElement('style');
			style.type = 'text/css';
			style.innerHTML = _private.extensibles[prop].styleBlock();
			document.getElementsByTagName('head')[0].appendChild(style);
		}
	})(prop);
};

/*
	Function: blockScripts

	Appends remote javascript for blocks to dom.

	Parameters:

		none

	Returns:

		none
*/
_private.blockScripts = function() {
	/* 
		function that fetches all scripts, synchronously 
		
		existing - array of src already retrieved
		scriptArray - array of objects containing script data
		position - position in scriptArray to retrieve
		wait - name of object that must exist before fetching next script
		tries - number of times to wait for wait object before giving up
	*/
	function fetchScript(existing,scriptArray,position,wait,tries) {
		if(wait && typeof window[wait] == 'undefined' && tries < 4) {
			tries++;
			setTimeout(function() { fetchScript(existing,scriptArray,position,wait,tries) },1000);
		} else {
			var element = scriptArray[position];
			if(element.source === '' || existing.indexOf(element.source) < 0) {
				existing.push(element.source);

				/* attach the blocks dependencies */
				var scripts = document.createElement('script');
				scripts.src = element.source;
				scripts.type = element.type;
				if(element.integrity) {
					scripts.integrity = element.integrity;
				}
				scripts.innerHTML = element.inner;
				document.getElementsByTagName('head')[0].appendChild(scripts);
	
				/* fetch next script */
				if(scriptArray.length > (position + 1)) {
					fetchScript(existing,scriptArray,position+1,element.wait,0);
				}
			}
		}
	}
	
	/* get script data for each extensibles */
	for(var prop in _private.extensibles)(function(prop) {
		if(_private.extensibles.hasOwnProperty(prop)) {
			var scriptArray = _private.extensibles[prop].fetchDependencies();
			if(scriptArray !== null) {
				fetchScript([],scriptArray,0,'',0);
			}
		}
	})(prop);
};

/*
	Function: blockButtons

	This creates a div that holds all of the buttons for creating and deleting blocks. This function returns that div.

	Parameters:

		bid - the block id, which is used to determine where a block should inserted or removed

	Returns:

		success - html node, button div
*/
_private.blockButtons = function(bid) {

	/* this div will hold the buttons inside of it */
	var buttonDiv = document.createElement('div');
	buttonDiv.setAttribute('class','row');
	buttonDiv.setAttribute('id','bengine-b' + _private.main + bid);

	var catDiv = document.createElement("div");
	catDiv.setAttribute("id","bengine-cat" + _private.main + bid);
	catDiv.setAttribute("class","bengine-blockbtns row");
	buttonDiv.appendChild(catDiv);

	var categoryArray = ["code","media","text","qengine"];
	
	categoryArray.forEach(function(element) {
		var colDiv = document.createElement('div');
		colDiv.setAttribute('class','col col-1_5');
		
		/* create category button */
		var btn = document.createElement('button');
		btn.onclick = function() {
			catDiv.setAttribute("style","display:none;visibility:hidden");
			var row = document.getElementById("bengine" + _private.main + element + "-" + bid);
			row.setAttribute("style","display:block;visibility:visible;");
		};
		btn.setAttribute("class","bengine-blockbtn bengine-addbtn");
		btn.innerHTML = element;
		
		/* create div for block buttons in category */
		var subRow = document.createElement("div");
		subRow.setAttribute("id","bengine" + _private.main + element + "-" + bid);
		subRow.setAttribute("class","bengine-blockbtns row");
		subRow.setAttribute("style","display:none;visibility:hidden;");
		buttonDiv.appendChild(subRow);
		
		/* create back button to categories */
		var colBackDiv = document.createElement('div');
		colBackDiv.setAttribute('class','col col-1_' + (_private.categoryCounts[element] + 1));
		
		var btnBack = document.createElement('button');
		btnBack.onclick = function() {
			catDiv.setAttribute("style","display:block;visibility:visible");
			var row = document.getElementById("bengine" + _private.main + element + "-" + bid);
			row.setAttribute("style","display:none;visibility:hidden;");
		};
		btnBack.setAttribute("class","bengine-blockbtn bengine-addbtn");
		btnBack.innerHTML = "&larr;";
		
		colBackDiv.appendChild(btnBack);
		subRow.appendChild(colBackDiv);

		/* append everything */
		colDiv.appendChild(btn);
		catDiv.appendChild(colDiv);
	});
	
	var delDiv = document.createElement('div');
	delDiv.setAttribute('class','col col-1_5');

	var delBtn = document.createElement('button');
	delBtn.setAttribute('id','bengine-d' + _private.main + bid);
	delBtn.setAttribute("class","bengine-blockbtn bengine-delbtn");
	delBtn.onclick = function() {
		_private.deleteBlock(bid);
	};
	delBtn.style.visibility = 'hidden';
	delBtn.innerHTML = "&darr;";

	delDiv.appendChild(delBtn);
	catDiv.appendChild(delDiv);
	
	/* add block buttons to each category */
	for(var prop in _private.extensibles)(function(prop) {
		if(_private.extensibles.hasOwnProperty(prop)) {
			var btn = document.createElement('button');
			btn.onclick = function() {
				_private.addBlock(bid,_private.extensibles[prop].type);
				catDiv.setAttribute("style","display:block;visibility:visible");
				var row = document.getElementById("bengine" + _private.main + _private.extensibles[prop].category + "-" + bid);
				row.setAttribute("style","display:none;visibility:hidden;");
			};
			btn.setAttribute("class","bengine-blockbtn bengine-addbtn");
			btn.innerHTML = _private.extensibles[prop].name;

			var subRow = buttonDiv.childNodes[categoryArray.indexOf(_private.extensibles[prop].category) + 1];
			
			var colDiv = document.createElement('div');
			colDiv.setAttribute('class','col col-1_' + (_private.categoryCounts[_private.extensibles[prop].category] + 1));

			colDiv.appendChild(btn);
			subRow.appendChild(colDiv);
		}
	})(prop);

	return buttonDiv;
};

/*
	Function: runCodeBlock
	
	This function sends block content to be run on a back-end service
	
	Parameters:
	
		bid - the block id
		type - the type of block
		getCode - a function that can retrieve the block code,namespace,vars by bid
*/
_private.runCodeBlock = function(bid,type,getCode) {
	// data should have: 'code', 'vars', 'namespace'
	var data = getCode(bid);
	
	data['type'] = type;
	
	var url = _private.createURL("/code");

	var xmlhttp = new XMLHttpRequest();
	xmlhttp.open("POST",url,true);
	xmlhttp.setRequestHeader("Content-type","application/json");

	xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState === XMLHttpRequest.DONE) {
			if(xmlhttp.status === 200) {
				var result = JSON.parse(xmlhttp.responseText);

				switch(result.msg) {
					case 'blockrun':
						// result.data ->
						//		_public.resources[data['namespace'] = result.data.resources
						//		_public.variables[data['namespace'] = result.data.variables
						break;
					case 'err':
						alertify.alert(result.data.error);
						break;
					default:
						alertify.alert("An Unknown Save Error Occurred");
				}
			}
		}
	}
	
	xmlhttp.send(JSON.stringify(data));
}

/*
	Function: addRunBtn
	
	This function adds a button to code blocks for sending code to the backend to be run
	
	Parameters:
	
		bid - the block id
		type - the type of block
		block - the block
*/
_private.addRunBtn = function(bid,ext,block) {	
	if(ext.category === "code") {
		var runBtn = document.createElement('button');
		runBtn.innerHTML = 'Run Code';
		runBtn.onclick = _private.runCodeBlock.bind(null,'bengine-a' + _private.main + bid,ext.type,ext.saveContent);
		block.appendChild(runBtn);
	}
	
	return block;
}

/*
	Function: makeSpace

	This function creates space for a block that is going to be inserted. In other words, if there are three block 1,2,3, and a block wants to be inserted into the 2nd position, this function will change the current block IDs to 1,3,4.

	Parameters:

		bid - the block id to make room for
		count - the number of block on the page

	Returns:

		none
*/
_private.makeSpace = function(bid,count) {
	var track = count;
	while(bid < track) {
		/* change blocks to this value */
		var next = track + 1;

		/* replace the button IDs */
		var buttons = _private.blockButtons(next);
		document.getElementById('bengine-b' + _private.main + track).parentNode.replaceChild(buttons,document.getElementById('bengine-b' + _private.main + track));

		/* replace the content block id */
		document.getElementById('bengine-a' + _private.main + track).setAttribute('id','bengine-a' + _private.main + next);

		/* replace the block id */
		document.getElementById('bengine' + _private.main + track).setAttribute('id','bengine' + _private.main + next);

		/* update the count */
		track--;
	}
};

/*
	Function: insertBlock

	This function creates a block, appends a content block & buttons div to it, and inserts it on the page.

	Parameters:

		block - a content block
		buttons - a buttons div
		bid - the block id of the block to be inserted
		count - the number of block on the page

	Returns:

		none
*/
_private.insertBlock = function(block,buttons,bid,count) {

	/* grab the blocks container */
	var blocksdiv = document.getElementById('bengine-x-blocks' + _private.main);

	/* create the block div */
	var group = document.createElement('div');
	group.setAttribute('class','bengine-block bengine-block' + _private.main);
	group.setAttribute('id','bengine' + _private.main + bid);

	/* append the content block & buttons div to the block div */
	group.appendChild(block);
	group.appendChild(buttons);

	/* find the location to insert the block and insert it */
	if(bid <= count) {
		var position = blocksdiv.children[bid];
		blocksdiv.insertBefore(group,position);
	} else {
		/* you do this if the block goes at the end, it's the last block */
		blocksdiv.appendChild(group);
	}
};

/*
	Function: createBlock

	This function calls all of the necessary functions to put a block on the page.

	Parameters:

		bid - the block id
		btype - the block type

	Returns:

		none
*/
_private.createBlock = function(cbid,blockObj) {

	var blockCount = _private.countBlocks();

	/* make space if inserting block, if appending block, ignore */
	if(cbid < blockCount) {
		_private.makeSpace(cbid,blockCount);
	}

	/* create and insert block */
	var bid = cbid + 1;

	var block = _private.generateBlock(bid,blockObj.type);
	var retblock = blockObj.insertContent(block,{});
	retblock = _private.addRunBtn(bid,blockObj,retblock);
		
	var blockbuttons = _private.blockButtons(bid);
	_private.insertBlock(retblock,blockbuttons,bid,blockCount);
	blockObj.afterDOMinsert('bengine-a' + _private.main + bid,null);

	/* make delete buttons visible */
	var i = 0;
	while(i <= blockCount) {
		document.getElementById('bengine-d' + _private.main + i).style.visibility = 'visible';
		i++;
	}
};

/*
	Function: addBlock

	This function is the starting point for adding a block. It calls the right function for creating a block according to the block type.

	Parameters:

		bid - the block id
		btype - the block type

	Returns:

		none
*/
_private.addBlock = function(bid,blockTypeName) {
	if(_public.options.blockLimit < (document.getElementsByClassName("bengine-block" + _private.main).length + 1)) {
		alertify.alert("You Have Reached The Block Limit");
		return;
	}

	var blockObj = _private.extensibles[blockTypeName];

	/* media blocks only allowed in-house, all other block (text-based) route to regular process */
	if (blockObj.upload) {
		/* these blocks call uploadMedia() which uploads media and then calls createBlock() */
		_private.uploadMedia(bid + 1,blockObj);
	} else {
		/* these blocks call createBlock() to add the block */
		_private.createBlock(bid,blockObj);
		/* save blocks to temp table, indicated by false */
		saveBlocks(false);
	}
};

/*
	Function: closeSpace

	This function closes the space left by a removed block. In other words, if there are three block 1,2,3, and a the 2nd block is removed, this function will change the current block IDs from 1,3 to 1,2.

	Parameters:

		bid - the block id to close on
		count - the number of block on the page

	Returns:

		none
*/
_private.closeSpace = function(cbid,count) {
	var bid = cbid;
	while(bid < count) {
		/* change blocks to this value */
		var next = bid + 1;

		/* replace the button IDs */
		var buttons = _private.blockButtons(bid);
		document.getElementById('bengine-b' + _private.main + next).parentNode.replaceChild(buttons,document.getElementById('bengine-b' + _private.main + next));

		/* replace the content block id */
		document.getElementById('bengine-a' + _private.main + next).setAttribute('id','bengine-a' + _private.main + bid);

		/* replace the block id */
		document.getElementById('bengine' + _private.main + next).setAttribute('id','bengine' + _private.main + bid);

		/* update the bid */
		bid++;
	}
};

/*
	Function: removeBlock

	This function removes a block.

	Parameters:

		bid - the block id of the block to remove

	Returns:

		nothing - *
*/
_private.removeBlock = function(bid) {
	var element = document.getElementById('bengine' + _private.main + bid);
	element.parentNode.removeChild(element);
};

/*
	Function: deleteBlock

	This function is the starting point for removing a block. It calls the needed functions to handle block removal.

	Parameters:

		bid - the block id of the block to remove

	Returns:

		nothing - *
*/
_private.deleteBlock = function(cbid) {
	var blockCount = _private.countBlocks();

	var bid = cbid + 1;

	/* delete the block */
	_private.removeBlock(bid);

	/* close space if removing block from middle, otherwise ignore */
	if(bid < blockCount) {
		_private.closeSpace(bid,blockCount);
	}

	/* make delete buttons visible & last button invisible */
	var i = 0;
	blockCount = _private.countBlocks();
	while(i < blockCount) {
		document.getElementById('bengine-d' + _private.main + i).style.visibility = 'visible';
		i++;
	}
	document.getElementById('bengine-d' + _private.main + i).style.visibility = 'hidden';

	/* save blocks to temp table, indicated by false */
	saveBlocks(false);
};

// <<<fold>>>

/***
	Section: Ajax Functions
	These are functions to retrieve data from the back-end.
***/

// <<<code>>>

/*
	Function: revertBlocks

	This function loads the page with last permanent save data.

	Parameters:

		pageDisplayFunc - function, the page function that loads the page.

	Returns:

		nothing - *
*/
this.revertBlocks = function() {
	/* create the url destination for the ajax request */
	var url = _private.createURL("/revertblocks");

	/* get the pid & page name */
	var xid = document.getElementById('bengine-x-id' + _private.main).getAttribute('data-xid');
	var xidName = document.getElementById('bengine-x-id' + _private.main).getAttribute('name');

	/* get the did for restarting the bengine instance */
	var did = document.getElementById('bengine-x-id' + _private.main).getAttribute('data-did');

	var xmlhttp;
	xmlhttp = new XMLHttpRequest();

	var params = "xid=" + xid + "&pagetype=" + xidName;

	xmlhttp.open("POST",url,true);

	xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");

	xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState === XMLHttpRequest.DONE) {
			if(xmlhttp.status === 200) {
				var result = JSON.parse(xmlhttp.responseText);

				switch(result.msg) {
					case 'success':
						var oldBengine = document.getElementById('bengine-instance' + _private.main);
						var main = oldBengine.parentNode;
						main.removeChild(oldBengine);
						if(result.data === "") {
							blockEngineStart(main.getAttribute('id'),[xidName,xid,did],[]);
						} else {
							blockEngineStart(main.getAttribute('id'),[xidName,xid,did],result.data.split(","));
						}
						document.getElementById("bengine-savestatus" + _private.main).innerHTML = "Saved";
						break;
					case 'noxid':
						alertify.alert("This Page Is Not Meant To Be Visited Directly."); break;
					case 'norevertloggedout':
						alertify.alert("Revert Error. You Are Not Logged In."); break;
					case 'err':
					default:
						alertify.alert("An Error Occured. Please Try Again Later");
				}
			} else {
				alertify.alert("Error:" + xmlhttp.status + ": Please Try Again Later");
			}
        }
    };

	xmlhttp.send(params);
};

/*
	Function: saveBlocks

	This function grabs block data and sends it to the back-end for saving.

	Parameters:

		which - should be a boolean. false saves blocks to database temporary table, true saves blocks to database permanent table.

	Returns:

		nothing - *
*/
if(_public.options.enableSave === false) {
	saveBlocks = function(which) { /* do nothing */ };
} else {
var saveBlocks = function(which) {

	/* set parameter to be sent to back-end that determines which table to save to, temp or perm, & set save status display */
	var table;
	if(which === false) {
		table = 0;
		let statusbar = document.getElementById("bengine-savestatus" + _private.main);
		if(statusbar !== null) {
			statusbar.innerHTML = "Not Saved";
		}
	} else {
		table = 1;
	}

	document.getElementById('bengine-statusid' + _private.main).setAttribute('value',table);

	/* variables for storing block data */
	var blockType = [];
	var blockContent = [];

	var blockCount = _private.countBlocks();
	var bid = 1;

	/* get the block types & contents */
	var contentToSave = {};
	if(blockCount > 0) {
		var i = 0;
		while(blockCount >= bid) {
			/* get the block type */
			var btype = document.getElementById('bengine-a' + _private.main + bid).getAttribute('data-btype');
			blockType[i] = btype;

			/* get the block content */
			blockContent[i] = _private.extensibles[btype].saveContent('bengine-a' + _private.main + bid);

			i++;
			bid++;
		}

		/* merge mediaType & mediaContent arrays into default comma-separated strings */
		contentToSave['types'] = blockType;
		contentToSave['content'] = blockContent;
	}

	/* create the url destination for the ajax request */
	var url = _private.createURL("/save");

	/* get the pid & page name */
	var xid = document.getElementById('bengine-x-id' + _private.main).getAttribute('data-xid');
	var xidName = document.getElementById('bengine-x-id' + _private.main).getAttribute('name');

	var xmlhttp;
	xmlhttp = new XMLHttpRequest();

	/* if this is temp save, don't show saving progress */
	if(which !== false) {
		xmlhttp.upload.onprogress = function(e) {
			if (e.lengthComputable) {
				_private.progressUpdate(e.loaded);
			}
		};
		xmlhttp.upload.onloadstart = function(e) {
			_private.progressInitialize("Saving...",e.total);
		};
		xmlhttp.upload.onloadend = function(e) {
			_private.progressFinalize("Saved",e.total);
		};
	}

	contentToSave['xid'] = xid;
	contentToSave['pagetype'] = xidName;
	contentToSave['tabid'] = table;

	var params = JSON.stringify(contentToSave);

	xmlhttp.open("POST",url,true);

	xmlhttp.setRequestHeader("Content-type","application/json");

	xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState === XMLHttpRequest.DONE) {
			if(xmlhttp.status === 200) {
				var result = JSON.parse(xmlhttp.responseText);

				switch(result.msg) {
					case 'blocksaved':
						if(table === 1) {
							let statusbar = document.getElementById("bengine-savestatus" + _private.main);
							if(statusbar !== null) {
								statusbar.innerHTML = "Saved";
							}
						}
						break;
					case 'nosaveloggedout':
						alertify.alert("You Can't Save This Page Because You Are Logged Out. Log In On A Separate Page, Then Return Here & Try Again.");
						break;
					case 'err':
					default:
						alertify.alert("An Unknown Save Error Occurred");
				}
			} else {
				alertify.alert("Error:" + xmlhttp.status + ": Please Try Again Later");
			}
        }
    };

	xmlhttp.send(params);
};
}

this.saveBlocks = function(which) {
	saveBlocks(which);
};

/*
	Function: uploadMedia

	This function make an ajax request to upload user media. After the response, the media is loaded and rendered.

	Parameters:

		bid - the bid of the media block
		btype - the type of media, "image" "audio" "video" "slide"

	Returns:

		none
*/
_private.uploadMedia = function(bid,blockObj) {

	/* get the hidden file-select object that will store the user's file selection */
	var fileSelect = document.getElementById('bengine-file-select' + _private.main);
	
	if(blockObj.accept !== 'undefined' && typeof blockObj.accept === 'string') {
		fileSelect.setAttribute("accept", blockObj.accept);
	} else {
		fileSelect.setAttribute("accept","");
	}

	/* uploadMedia() is called when a block button is pressed, to show file select pop-up box, force click the file-select object */
	fileSelect.click();

	/* only upload media when a file select change has occurred, this prevents an empty block creation if the user presses 'cancel' */
	fileSelect.onchange = function() {

		/* grab the selected file */
		var file = fileSelect.files[0];

		/* validation */
		var notvalid = false;
		var nofile = false;
		var errorMsg;
		if(fileSelect.files.length > 0) {
			if(file.size > (_public.options.mediaLimit * 1048576)) {
				notvalid = true;
				errorMsg = `Files Must Be Less Than ${_public.options.mediaLimit} MB`;
			}
		} else {
			nofile = true;
		}

		var checklengthvideo = false;
		var checklengthaudio = false;
		switch(blockObj.type) {
			case "audio":
				var audTempElement = document.createElement('audio');
				var audFileURL = URL.createObjectURL(file);
				audTempElement.src = audFileURL;
				checklengthaudio = true;
				break;
			case "video":
				var vidTempElement = document.createElement('video');
				var vidFileURL = URL.createObjectURL(file);
				vidTempElement.src = vidFileURL;
				checklengthvideo = true;
				break;
			default:
		}

		if(nofile) {
			/* do nothing, no file selected */
			this.value = null;
			return;
		}

		if(notvalid) {
			alertify.alert(errorMsg);
		} else {
			/* this gets called below where length check occurs */
			function uploadProcess() {
				/* create the block to host the media */
				_private.createBlock(bid - 1,blockObj);

				/* wrap the ajax request in a promise */
				var promise = new Promise(function(resolve,reject) {

					/* create javascript FormData object and append the file */
					var formData = new FormData();
					formData.append('media',file,file.name);

					/* get the directory id */
					var did = document.getElementById('bengine-x-id' + _private.main).getAttribute('data-did');

					/* grab the domain and create the url destination for the ajax request */
					var url = _private.createURL("/uploadmedia?did=" + did + "&btype=" + blockObj.type);

					var xmlhttp = new XMLHttpRequest();
					xmlhttp.open('POST',url,true);

					/* upload progress */
					xmlhttp.upload.onloadstart = function(e) {
						_private.progressInitialize("Uploading...",e.total);
					};
					xmlhttp.upload.onprogress = function(e) {
						if (e.lengthComputable) {
							_private.progressUpdate(e.loaded);
						}
					};
					xmlhttp.upload.onloadend = function(e) {
						_private.progressFinalize("Uploaded",e.total);
					};

					function counter(reset) {
						if(typeof counter.track === 'undefined' || counter.track === 0) {
							counter.track = 1;
							return 1;
						} else if(reset) {
							counter.track = 0;
							return 0;
						} else {
							counter.track++;
						}
						return counter.track;
					}

					function position(spot) {
						if(typeof position.prev === 'undefined') {
							position.prev = 0;
							position.curr = spot;
						} else if (position.curr !== spot) {
							position.prev = position.curr;
							position.curr = spot;
						}
						return [position.prev,position.curr];
					}

					/* conversion progress */
					xmlhttp.onprogress = function(e) {
						var spotArray = position(xmlhttp.responseText.length);
						var current = counter(false);
						var val = xmlhttp.responseText.slice(spotArray[0],spotArray[1]).split(",");
						if(current === 1) {
							_private.progressInitialize("Converting...",val[val.length - 1]);
						} else {
							_private.progressUpdate(val[val.length - 1]);
						}
					};

					xmlhttp.onloadend = function(e) {
						var spotArray = position(xmlhttp.responseText.length);
						var val = xmlhttp.responseText.slice(spotArray[0],spotArray[1]).split(",");
						_private.progressFinalize("Not Saved",val[val.length - 1]);
						counter(true);
					};

					xmlhttp.onreadystatechange = function() {
						if (xmlhttp.readyState === XMLHttpRequest.DONE) {
							if(xmlhttp.status === 200) {
								if(xmlhttp.responseText === "err") {
									reject("err");
								} else if(xmlhttp.responseText === "convertmediaerr") {
									reject("convertmediaerr");
								} else if(xmlhttp.responseText === "nopatherr") {
									reject("nopatherr");
								} else if (xmlhttp.responseText === "nouploadloggedout") {
									_private.deleteBlock(bid - 1);
									alertify.alert("You Can't Upload Media Because You Are Logged Out. Log Back In On A Separate Page, Then Return Here & Try Again.");
									reject("err");
								} else {
									var spotArray = position(xmlhttp.responseText.length);
									var val = xmlhttp.responseText.slice(spotArray[0],spotArray[1]).split(",");
									/* reset position */
									position(0); position(0);
									resolve(val[val.length - 1]);
								}
							} else {
								alertify.alert('Error:' + xmlhttp.status + ": Please Try Again");
								reject("err");
							}
						}
					};

					xmlhttp.send(formData);
				});

				promise.then(function(data) {
					blockObj.afterDOMinsert('bengine-a' + _private.main + bid,data);

					/* save blocks to temp table, indicated by false */
					saveBlocks(false);
				},function(error) {
					if(error === "convertmediaerr") {
						alertify.log("There was an error with that media format. Please try a different file type.");
					} else if (error === "nopatherr") {
						alertify.log("Bad path error.");
					} else {
						alertify.log("There was an unknown error during media upload.");
					}
				});
			}

			if(checklengthvideo) {
				vidTempElement.ondurationchange = function() {
					if(this.duration > _public.options.playableMediaLimit) {
						alertify.alert(`Videos Must Be Less Than ${_public.options.playableMediaLimit} Seconds`);
					} else {
						uploadProcess();
					}
				};
			} else if(checklengthaudio) {
				audTempElement.ondurationchange = function() {
					if(this.duration > _public.options.playableMediaLimit) {
						alertify.alert(`Videos Must Be Less Than ${_public.options.playableMediaLimit} Seconds`);
					} else {
						uploadProcess();
					}
				};
			} else {
				uploadProcess();
			}
		}
		/* resets selection to nothing, in case user decides to upload the same file, onchange will still fire */
		this.value = null;
	};
};

// <<<fold>>>

} // end of Bengine
