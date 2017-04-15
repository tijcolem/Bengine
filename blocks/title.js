extensibles.title = new function title() {
	this.type = "title";
	this.name = "title";
	this.upload = false;

	var titleObj = this;
	var blocklimit = 64;

	var parseBlock = function(blockText) {
		var element = document.createElement('div');
		element.innerHTML = blockText.replace(/</g,"@@LT").replace(/>/g,"@@RT").replace(/<br>/g,"@@BR");
		return encodeURIComponent(element.textContent).replace(/'/g,"%27");
	};

	var deparseBlock = function(blockText) {
		return decodeURIComponent(blockText).replace(/@@LT/g,"<").replace(/@@RT/g,">").replace(/@@BR/g,"<br>").replace(/%27/g,"'");
	};

	this.insertContent = function(block,content) {
		var str = '<input type="text" class="xTit" maxlength="' + blocklimit + '" value="' + deparseBlock(content) + '">';
		block.innerHTML = str;

		return block;
	};

	this.afterDOMinsert = function(bid,data) {
		/* nothing to do */
	};

	this.saveContent = function(bid) {
		var blockContent = document.getElementById('bengine-a' + bid).children[0].value;
		return parseBlock(blockContent);
	};

	this.showContent = function(block,content) {
		var str = '<div class="xTit-show">' + deparseBlock(content) + '</div>';
		block.innerHTML = str;

		return block;
	};

	this.styleBlock = function() {
		var stylestr = `.xTit {
			display: inline-block;
			width: 100%;
			height: 32px;
			border: 1px solid black;
			border-radius: 2px;

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
			background-color: rgba(118, 118, 118, 0.2);
			border: 1px solid black;
			border-bottom-color: rgba(118, 118, 118, 0.2);
			border-radius: 2px;

			padding: 6px 6px;
			margin: 0px;
			margin-bottom: -12px;
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
