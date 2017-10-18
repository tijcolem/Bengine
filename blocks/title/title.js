BengineConfig.extensibles.title = new function Title() {
	this.type = "title";
	this.name = "title";
	this.category = "text";
	this.upload = false;

	var titleObj = this;
	var blocklimit = 64;

	var emptyObject = function(obj) {
		if(Object.keys(obj).length === 0 && obj.constructor === Object) {
			return true;
		}
		return false;
	}
	
	this.fetchDependencies = function() {
		return null;
	}

	this.insertContent = function(block,bcontent) {
		var str;
		if(!emptyObject(bcontent)) {
			str = '<input type="text" class="xTit" maxlength="' + blocklimit + '" value="' + bcontent['content'] + '">';
		} else {
			str = '<input type="text" class="xTit" maxlength="' + blocklimit + '" placeholder="Title">';
		}

		block.innerHTML = str;

		return block;
	};

	this.afterDOMinsert = function(bid,data) {
		/* nothing to do */
	};

	this.saveContent = function(bid) {
		return {'content':document.getElementById(bid).children[0].value};
	};

	this.showContent = function(block,bcontent) {
		var str = '<div class="xTit-show">' + bcontent['content'] + '</div>';
		block.innerHTML = str;

		return block;
	};

	this.styleBlock = function() {
		var stylestr = `.xTit {
			display: inline-block;
			width: 100%;
			height: 32px;
			border: 1px solid black;

			padding: 4px 6px;
			margin: 0px;
			box-sizing: border-box;

			text-align: center;

			font-family: Arial, Helvetica, sans-serif;
			font-size: 1em;
			font-weight: 300;
			color: black;
		}

		.xTit-show {
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
	
	this.f = {};
	
	this.g = {};
};
