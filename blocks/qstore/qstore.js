BengineConfig.extensibles.qstore = new function Qstore() {
	this.type = "qstore";
	this.name = "store";
	this.category = "quiz";
	this.upload = false;
	this.accept = null;

	var thisBlock = this;
	var _private = {};
	
	this.destroy = function() {
		return;
	};
	
	this.fetchDependencies = function() {
		return null;
	}

	this.insertContent = function(block,bcontent) {
		var storeVars = document.createElement("textarea");
		storeVars.setAttribute("class","xQst");
		
		if(!thisBlock.p.emptyObject(bcontent)) {
			storeVars.setAttribute("value",bcontent['content']);
		}
		
		storeVars.setAttribute("placeholder","Comma or newline separated variables you want to keep for the next quiz step.\nPrepend with 'perm' to keep variable permanently. Prepend with 'temp' to keep for just one step. Example: temp.namespace.variable");

		block.appendChild(storeVars);

		return block;
	};

	this.afterDOMinsert = function(bid,data) {
		/* nothing to do */
	};
	
	this.runBlock = null;

	this.saveContent = function(bid) {
		return {'content':document.getElementById(bid).children[0].value};
	};

	this.showContent = function(block,bcontent) {
		var str = '<div class="xQst-show">' + bcontent['content'] + '</div>';
		block.innerHTML = str;

		return block;
	};

	this.styleBlock = function() {
		var stylestr = `.xQst {
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
	    	
	    	resize: vertical;
		}

		.xQst-show {
			display: inline-block;
			width: 100%;
			height: auto;
			background-color: rgba(118, 118, 118, 0.15);
			border: 1px solid black;
			border-bottom-color: rgba(118, 118, 118, 0.15);

			padding: 6px 6px;
			margin: 0px;
			box-sizing: border-box;

			text-align: center;

			font-family: Arial, Helvetica, sans-serif;
			font-size: 2em;
			font-weight: 900;
			color: black;
		}`;
		return stylestr;
	};
};
