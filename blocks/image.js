extensibles.image = new function image() {
	this.type = "image";
	this.name = "image";
	this.upload = true;

	this.insertContent = function(block,content) {
		var ximg = document.createElement("img");
		ximg.setAttribute("class","xImg");
		ximg.src = content;

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
		return imagestr.replace(location.href.substring(0,location.href.lastIndexOf('/') + 1),"");
	};

	this.showContent = function(block,content) {
		var ximg = document.createElement("img");
		ximg.setAttribute("class","xImg-show");
		ximg.src = content;

		block.appendChild(ximg);

		return block;
	};

	this.styleBlock = function() {
		var stylestr = `.xImg, .xImg-show {
			display: inline-block;
			width: 100%;
			height: 506px;
			border: 1px solid black;
			border-radius: 2px;

			padding: 0px;
			margin: 0px;
			box-sizing: border-box;
		}`;
		return stylestr;
	};
};
