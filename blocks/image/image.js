BengineConfig.extensibles.image = new function Image() {
	this.type = "image";
	this.name = "image";
	this.category = "media";
	this.upload = true;
	this.accept = ".bmp,.bmp2,.bmp3,.jpeg,.jpg,.pdf,.png,.svg";

	var thisBlock = this;
	var _private = {};
	
	this.destroy = function() {
		return;
	};
	
	this.fetchDependencies = function() {
		return null;
	}

	this.insertContent = function(block,bcontent) {
		var ximg = document.createElement("img");
		ximg.setAttribute("class","xImg");
		ximg.src = bcontent['url'];

		block.appendChild(ximg);

		return block;
	};

	this.afterDOMinsert = function(bid,data) {
		if(data !== null) {
			var imagetag = document.getElementById(bid).childNodes[0];
			imagetag.src = data;
		}
	};
	
	this.runBlock = null;

	this.saveContent = function(bid) {
		/* replace() is for escaping backslashes and making relative path */
		var imagestr = document.getElementById(bid).children[0].src;
		return {'url':imagestr.replace(location.href.substring(0,location.href.lastIndexOf('/') + 1),"")};
	};

	this.showContent = function(block,content) {
		var ximg = document.createElement("img");
		ximg.setAttribute("class","xImg-show");
		ximg.src = bcontent['url'];

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
