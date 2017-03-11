extensibles.video = new function video() {
	this.type = "video";
	this.name = "video";
	this.upload = true;

	this.insertContent = function(block,content) {
		var video = document.createElement("video");
		video.setAttribute("class","xVid");
		video.volume = 0.8;
		video.setAttribute("controls","controls");

		var videosource = document.createElement("source");
		videosource.setAttribute("src",content);
		videosource.setAttribute("type","video/mp4");

		video.appendChild(videosource);
		block.appendChild(video);

		return block;
	};

	this.afterDOMinsert = function(bid,data) {
		if(data !== null) {
			/* audio & video divs have their src set in an extra child node */
			var mediatag = document.getElementById('bengine-a' + bid).childNodes[0].childNodes[0];
			mediatag.src = data;
			mediatag.parentNode.load();
		}
	};

	this.saveContent = function(bid) {
		var mediastr = document.getElementById('bengine-a' + bid).children[0].children[0].src;
		return mediastr.replace(location.href.substring(0,location.href.lastIndexOf('/') + 1),"");
	};

	this.showContent = function(block,content) {
		var video = document.createElement("video");
		video.setAttribute("class","xVid-show");
		video.volume = 0.8;
		video.setAttribute("controls","controls");

		var videosource = document.createElement("source");
		videosource.setAttribute("src",content);
		videosource.setAttribute("type","video/mp4");

		video.appendChild(videosource);
		block.appendChild(video);

		return block;
	};

	this.styleBlock = function() {
		var stylestr = `.xVid, .xVid-show {
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
