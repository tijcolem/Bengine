extensibles.audio = new function audio() {
	this.type = "audio";
	this.name = "audio";
	this.upload = true;

	var audioObj = this;
	
	var parseBlock = function(blockText) {
		return encodeURIComponent(blockText);
	};

	var deparseBlock = function(blockText) {
		return decodeURIComponent(blockText);
	};

	this.insertContent = function(block,content) {
		var audio = document.createElement("audio");
		audio.setAttribute("class","xAud");
		audio.volume = 0.8;
		audio.setAttribute("controls","controls");

		var audiosource = document.createElement("source");
		audiosource.setAttribute("src",deparseBlock(content));
		audiosource.setAttribute("type","audio/mpeg");

		audio.appendChild(audiosource);
		block.appendChild(audio);

		return block;
	};

	this.afterDOMinsert = function(bid,data) {
		if(data !== null) {
			/* audio & video divs have their src set in an extra child node */
			var mediatag = document.getElementById(bid).childNodes[0].childNodes[0];
			mediatag.src = data;
			mediatag.parentNode.load();
		}
	};

	this.saveContent = function(bid) {
		var mediastr = document.getElementById(bid).children[0].children[0].src;
		return parseBlock(mediastr.replace(location.href.substring(0,location.href.lastIndexOf('/') + 1),""));
	};

	this.showContent = function(block,content) {
		var audio = document.createElement("audio");
		audio.setAttribute("class","xAud-show");
		audio.volume = 0.8;
		audio.setAttribute("controls","controls");

		var audiosource = document.createElement("source");
		audiosource.setAttribute("src",deparseBlock(content));
		audiosource.setAttribute("type","audio/mpeg");

		audio.appendChild(audiosource);
		block.appendChild(audio);

		return block;
	};

	this.styleBlock = function() {
		var stylestr = `.xAud, .xAud-show {
			display: inline-block;
			width: 100%;

			padding: 0px;
			margin: 0px;
			box-sizing: border-box;
		}`;
		return stylestr;
	};
};
