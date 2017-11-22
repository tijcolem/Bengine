Bengine.extensibles.files = new function Files() {
	this.type = "files";
	this.name = "files";
	this.category = "quiz";
	this.upload = false;
	this.accept = null;

	var thisBlock = this;
	_private = {};
	
	_private.getFiles = function(namespace,files) {			
		let filesStr = files.replace(/ /g,'').replace(/\n$/,'');
		let filesArray = [];
		if(filesStr.length > 0) {
			filesArray = filesStr.split(/\n|,/g);
		}
		
		let dataObj = {
			bank:thisBlock.d.getPageBank(),
			files:filesArray,
			namespace:namespace,
			pid:thisBlock.d.getPagePid(),
			version:thisBlock.d.getPageVersion()
		}
		
		thisBlock.p.sendData('/files',dataObj).then(function(result) {
			let cnt = Object.keys(result.data.files).length;
			if(cnt > 0) {
				thisBlock.d.variables[namespace] = result.data.files;
				thisBlock.p.alerts.log('complete','success');
				console.log(thisBlock.d.variables);
			}
		},function(error) {
			thisBlock.p.alerts.alert(error.msg);
		});
	};
	
	this.destroy = function() {
		return;
	};
	
	this.fetchDependencies = function() {
		return null;
	}

	this.insertContent = function(block,bcontent) {
		var filesNS = document.createElement("input");
		filesNS.setAttribute("type","text");
		filesNS.setAttribute("class","bengine-x-ns-cond col col-50");
		filesNS.setAttribute("placeholder","Enter The Namespace For This Files Block.");
		
		var blockCond = document.createElement("input");
		blockCond.setAttribute("type","text");
		blockCond.setAttribute("class","bengine-x-ns-cond col col-50");
		blockCond.setAttribute("placeholder","Block Conditional (optional)");
		
		var filesBlock = document.createElement('textarea');
		filesBlock.setAttribute('class','xFiles');
		filesBlock.setAttribute("placeholder","Comma or newline separated files to retrieve.");	
		
		if(!thisBlock.p.emptyObject(bcontent)) {
			filesBlock.value = bcontent['content'];
			filesNS.value = bcontent['namespace'];
			blockCond.value = bcontent['conditional'];
		}
		
		block.appendChild(filesNS);
		block.appendChild(blockCond);
		block.appendChild(filesBlock);

		return block;
	};

	this.afterDOMinsert = function(bid,data) {
		_private.getFiles(document.getElementById(bid).childNodes[0].value,document.getElementById(bid).childNodes[1].value);
	};
	
	this.runBlock = function(bid) {
		_private.getFiles(document.getElementById(bid).childNodes[0].value,document.getElementById(bid).childNodes[1].value);
	}

	this.saveContent = function(bid) {
		var namespace = document.getElementById(bid).children[0].value.trim();
		var conditional = document.getElementById(bid).children[0].value.trim();
		var content= document.getElementById(bid).children[2].value;
		return {'content':content,'namespace':namespace,'conditional':conditional};
	};

	this.showContent = function(block,bcontent) {
		// this block shows nothing, it retrives files on the back-end
		return block;
	};

	this.styleBlock = function() {
		var stylestr = `.xFiles {
			max-width: 100%;
			margin: 0px auto 0 auto;
			width: 100%;
	    	height: 100px;
	    	border: 1px solid black;
	    	border-radius: 2px;
	    	background-color: white;
	
	    	padding: 8px;
	    	margin: 0px;
	    	box-sizing: border-box;
	
	    	font-family: Arial, Helvetica, sans-serif;
	    	font-size: 1em;
	    	font-weight: 300;
	    	color: black;
		}`;
		return stylestr;
	};
};
