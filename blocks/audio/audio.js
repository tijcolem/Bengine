Bengine.extensibles.audio = new function Audio() {
	this.type = "audio";
	this.name = "audio";
	this.category = "media";
	this.upload = true;
	this.accept = ".aac,.aiff,.m4a,.mp3,.ogg,.ra,.wav,.wma";

	var thisBlock = this;
	var _private = {};
	
	this.destroy = function() {
		return;
	};

	this.fetchDependencies = function() {
		return null;
	}

	this.insertContent = function(block,bcontent) {		
		var audio = document.createElement("audio");
		audio.setAttribute("class","xAud");
		audio.volume = 0.8;
		audio.setAttribute("controls","controls");

		var audiosource = document.createElement("source");
		audiosource.setAttribute("src",bcontent['url']);
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
	
	this.runBlock = null;

	this.saveContent = function(bid) {
		/* replace() is for escaping backslashes and making relative path */
		var mediastr = document.getElementById(bid).children[0].children[0].src;
		return {'url':mediastr.replace(location.href.substring(0,location.href.lastIndexOf('/') + 1),"")};
	};

	this.showContent = function(block,bcontent) {
		var audio = document.createElement("audio");
		audio.setAttribute("class","xAud-show");
		audio.volume = 0.8;
		audio.setAttribute("controls","controls");

		var audiosource = document.createElement("source");
		audiosource.setAttribute("src",bcontent['url']);
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
