Bengine.extensibles.video = new function Video() {
	this.type = "video";
	this.name = "video";
	this.category = "media";
	this.upload = true;
	this.accept = ".avi,.flv,.mov,.mp4,.mpeg,.ogg,.rm,.webm,.wmv";

	var thisBlock = this;
	var _private = {};
	
	this.destroy = function() {
		return;
	};
	
	this.fetchDependencies = function() {
		return null;
	}

	this.insertContent = function(block,bcontent) {
		var video = document.createElement("video");
		video.setAttribute("class","xVid");
		video.volume = 0.8;
		video.setAttribute("controls","controls");

		var videosource = document.createElement("source");
		if(bcontent['url']) {
			videosource.setAttribute("src",bcontent['url']);
		}
		videosource.setAttribute("type","video/mp4");

		video.appendChild(videosource);
		block.appendChild(video);

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
		var mediastr = document.getElementById(bid).children[0].children[0].src;
		return {'url':mediastr.replace(location.href.substring(0,location.href.lastIndexOf('/') + 1),"")};
	};

	this.showContent = function(block,bcontent) {
		var video = document.createElement("video");
		video.setAttribute("class","xVid-show");
		video.volume = 0.8;
		video.setAttribute("controls","controls");

		var videosource = document.createElement("source");
		videosource.setAttribute("src",bcontent['url']);
		videosource.setAttribute("type","video/mp4");

		video.appendChild(videosource);
		block.appendChild(video);

		return block;
	};

	this.styleBlock = function() {
		var stylestr = `.xVid, .xVid-show {
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
