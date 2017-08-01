BengineConfig.extensibles.sage = new function Sage() {
	this.type = "sage";
	this.name = "sage";
	this.category = "math";
	this.upload = false;

	var sageObj = this;
	var blocklimit = 2097;

	var parseBlock = function(blockText) {
		???
	};

	var deparseBlock = function(blockText) {
		???
	};

	this.fetchDependencies = function() {
		return null;
	}

	this.insertContent = function(block,content) {
	    ???
	};

	this.afterDOMinsert = function(bid,data) {
		???
	};

	this.saveContent = function(bid) {
		???
	};

	this.showContent = function(block,content) {
	       ???
	};

	this.styleBlock = function() {
		var stylestr = `.xSgx {
			display: inline-block;
			width: 100%;
			height: auto;
			border: 1px solid black;
			border-radius: 2px;
			background-color: white;

			padding: 8px 6px;
			margin: 2px 0 0 0;
			box-sizing: border-box;
		}

		.sageOutput, .sageOutput-show {
			display: inline-block;
			width: 100%;
			height: auto;
			border: 1px solid black;
			border-radius: 2px;
			background-color: white;

			padding: 8px 6px;
			margin: 0px;
			box-sizing: border-box;
		}`;
		return stylestr;
	};

	this.f = {};

	this.g = {};
};
