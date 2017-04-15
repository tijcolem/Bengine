extensibles.image = new function image() {
	this.type = "image";
	this.name = "image";
	this.upload = true;

	var imageObj = this;
	
	var parseBlock = function(blockText) {
		return encodeURIComponent(blockText);
	};

	var deparseBlock = function(blockText) {
		return decodeURIComponent(blockText);
	};

	this.insertContent = function(block,content) {
		var ximg = document.createElement("img");
		ximg.setAttribute("class","xImg");
		ximg.src = deparseBlock(content);

		block.appendChild(ximg);

		return block;
	};

	this.afterDOMinsert = function(bid,data) {
		if(data !== null) {
			var imagetag = document.getElementById('bengine-a' + bid).childNodes[0];
			imagetag.src = data;
		}
	};

	this.saveContent = function(bid) {
		/* replace() is for escaping backslashes and making relative path */
		var imagestr = document.getElementById('bengine-a' + bid).children[0].src;
		return parseBlock(imagestr.replace(location.href.substring(0,location.href.lastIndexOf('/') + 1),""));
	};

	this.showContent = function(block,content) {
		var ximg = document.createElement("img");
		ximg.setAttribute("class","xImg-show");
		ximg.src = deparseBlock(content);

		block.appendChild(ximg);

		return block;
	};

	this.styleBlock = function() {
		var stylestr = `.xImg, .xImg-show {
			display: inline-block;
			width: 100%;
			height: 100%;
			border: 1px solid black;
			border-radius: 2px;

			padding: 0px;
			margin: 0px;
			box-sizing: border-box;
		}`;
		return stylestr;
	};
};
