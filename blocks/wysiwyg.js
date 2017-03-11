extensibles.xtext = new function xtext() {
	this.type = "xtext";
	this.name = "text";
	this.upload = false;

	var parseBlock = function(blockText) {
		var element = document.createElement('div');
		element.innerHTML = blockText.replace(/</g,"@@LT").replace(/>/g,"@@RT").replace(/<br>/g,"@@BR");
		return encodeURIComponent(element.textContent).replace(/'/g,"%27");
	};

	var deparseBlock = function(blockText) {
		return decodeURIComponent(blockText).replace(/@@LT/g,"<").replace(/@@RT/g,">").replace(/@@BR/g,"<br>").replace(/%27/g,"'");
	};

	this.insertContent = function(block,content) {
		/* WYSIWIG uses iframe */
		var textBlock = document.createElement("iframe");
		textBlock.setAttribute("class","xTex");
		textBlock.setAttribute("maxlength","1023");

		block.appendChild(textBlock);

		/* have to make a copy to use "this", when setTimout is called, this will refer to window, not block obj */
		var objCopy = this;

		/* iframe has to be put with document first or some bullshit, so wait one millisecond for that to happen and then insert content */
		setTimeout(function() {
			var iframe = block.childNodes[0].contentDocument;
			iframe.open();

			/* create link to css style for iframe content
			var cssLink = document.createElement("link");
			cssLink.href = "http://abaganon.com/css/block.css";
			cssLink.rel = "stylesheet";
			cssLink.type = "text/css";
			iframe.head.appendChild(cssLink); this can be used in show mode,not in edit mode
			*/

			/* defaul text */
			if(globalScope.defaulttext && content === "") {
				iframe.write("You can turn this default text off on your Profile Page.<br><br>Press&nbsp;<kbd>shift</kbd>&nbsp;and&nbsp;<kbd>ctrl</kbd>&nbsp;with the following keys to style text:<br><br><kbd>p</kbd>&nbsp;plain<br><kbd>b</kbd>&nbsp;<b>bold</b><br><kbd>i</kbd>&nbsp;<i>italics</i><br><kbd>h</kbd>&nbsp;<span style='background-color: yellow;'>highlight</span><br><kbd>+</kbd>&nbsp;<sup>superscript</sup><br><kbd>-</kbd>&nbsp;<sub>subscript</sub><br><kbd>a</kbd>&nbsp;<a href='http://abaganon.com/'>anchor link</a><ul><li><kbd>l</kbd>&nbsp;list</li></ul><kbd>j</kbd>&nbsp;justify left<br><i>For the things we have to learn before we can do them, we learn by doing them</i>. -Aristotle &nbsp;<i>I hear and I forget.&nbsp;I&nbsp;see and I remember. I do and I understand</i>. &nbsp;-? &nbsp;<i>If you want to go fast, go it alone. If you want to go far, go together.&nbsp;</i>-? &nbsp;<i>If you can't explain it simply, you don't understand it well enough.&nbsp;</i>-Einstein &nbsp;<i>Age is an issue of mind over matter. If you don't mind, it doesn't matter.</i>&nbsp;-Twain<br><br><kbd>f</kbd>&nbsp;justify full<div style='text-align: justify;'><i style='text-align: start;'>For the things we have to learn before we can do them, we learn by doing them</i><span style='text-align: start;'>. -Aristotle &nbsp;</span><i style='text-align: start;'>I hear and I forget.&nbsp;I&nbsp;see and I remember. I do and I understand</i><span style='text-align: start;'>. &nbsp;-? &nbsp;</span><i style='text-align: start;'>If you want to go fast, go it alone. If you want to go far, go together.&nbsp;</i><span style='text-align: start;'>-? &nbsp;</span><i style='text-align: start;'>If you can't explain it simply, you don't understand it well enough.&nbsp;</i><span style='text-align: start;'>-Einstein &nbsp;</span><i style='text-align: start;'>Age is an issue of mind over matter. If you don't mind, it doesn't matter.</i><span style='text-align: start;'>&nbsp;-Twain</span>");
			} else {
				iframe.write(deparseBlock(content));
			}
			iframe.close();

			var retblock = block.childNodes[0];

			/* attach keyboard shortcuts to iframe */
			if (iframe.addEventListener) {
				iframe.addEventListener("keydown",objCopy.f.detectKey.bind(null,retblock),false);
			} else if (iframe.attachEvent) {
				iframe.attachEvent("onkeydown",objCopy.f.detectKey.bind(null,retblock));
			} else {
				iframe.onkeydown = objCopy.f.detectKey.bind(null,retblock);
			}

		},1);

		return block;
	};

	this.afterDOMinsert = function(bid,data) {
		/* grab the block iframe that was just made */
		var blocki = document.getElementById("bengine-a" + bid).childNodes[0];
		var blockDoc = blocki.contentDocument;

		/* make iframe editable */
		blockDoc.designMode = "on";
	};

	this.saveContent = function(bid) {
		/* execCommand() applies style tags to <body> tag inside <iframe>, hence .getElementsByTagName('body')[0] */
		var blockContent = document.getElementById('bengine-a' + bid).children[0].contentDocument.getElementsByTagName('body')[0].innerHTML;
		return parseBlock(blockContent);
	};

	this.showContent = function(block,content) {
		var textBlock = document.createElement("div");
		textBlock.setAttribute("class","xTex-show");
		textBlock.innerHTML = deparseBlock(content);

		block.appendChild(textBlock);

		return block;
	};

	this.styleBlock = function() {
		var stylestr = `.xTex, .xTex-show {
			display: inline-block;
			overflow-y: auto;

			width: 100%;
			height: 200px;
			border: 1px solid black;
			border-radius: 2px;
			background-color: white;

			padding: 0px;
			margin: 0px;
			box-sizing: border-box;

			font-family: Arial, Helvetica, sans-serif;
			font-size: 1em;
			font-weight: 300;
			color: black;
		}

		.xTex-show {
			padding: 8px;
		}`;
		return stylestr;
	};

	this.f = {
		/*
			Function: detectKey

			This function is attached as the event listener to the WYSIWIG block. It detects key presses and calls the corresponding js built in execCommand() function on the block to apply html tags to the text. It's useful to note that iframe.contentDocument is the same as iframe.contentWindow.document.

			Parameters:

				iframe - an iframe node
				event - the keydown event that triggers the function

			Returns:

				none
		*/
		detectKey: function detectKey(iframe,event) {

			/* p : plain */
			if(event.shiftKey && event.ctrlKey && event.keyCode === 80) {
				iframe.contentDocument.execCommand('removeFormat',false,null);
			}
			/* b : bold */
			if(event.shiftKey && event.ctrlKey && event.keyCode === 66) {
				iframe.contentDocument.execCommand('bold',false,null);
			}
			/* i : italics */
			if(event.shiftKey && event.ctrlKey && event.keyCode === 73) {
				iframe.contentDocument.execCommand('italic',false,null);
			}
			/* h : highlight */
			if(event.shiftKey && event.ctrlKey && event.keyCode === 72) {
				iframe.contentDocument.execCommand('backColor',false,"yellow");
			}
			/* l : list */
			if(event.shiftKey && event.ctrlKey && event.keyCode === 76) {
				iframe.contentDocument.execCommand('insertUnorderedList',false,null);
			}
			/* + : superscript */
			if(event.shiftKey && event.ctrlKey && event.keyCode === 187) {
				iframe.contentDocument.execCommand('superscript',false,null);
			}
			/* - : subscript */
			if(event.shiftKey && event.ctrlKey && event.keyCode === 189) {
				iframe.contentDocument.execCommand('subscript',false,null);
			}
			/* j : justify left */
			if(event.shiftKey && event.ctrlKey && event.keyCode === 74) {
				iframe.contentDocument.execCommand('justifyLeft',false,null);
			}
			/* f : justify full */
			if(event.shiftKey && event.ctrlKey && event.keyCode === 70) {
				iframe.contentDocument.execCommand('justifyFull',false,null);
			}
			/* tab : indent */
			if(event.keyCode === 9) {
				iframe.contentDocument.execCommand('insertHTML',false,'&nbsp;&nbsp;&nbsp;&nbsp;');
			}
			/* a - anchor */
			if(event.shiftKey && event.ctrlKey && event.keyCode === 65) {
				function callback(event,str) {
					if(event) {
						if (str.indexOf("http://") < 0 && str.indexOf("https://") < 0) {
							iframe.contentDocument.execCommand('createLink',false,"http://" + str);
						} else if (str.indexOf("http://") === 0 || str.indexOf("https://") === 0) {
							iframe.contentDocument.execCommand('createLink',false,str);
						} else {
							alertify.log("Not A Valid Link!","error");
						}
					} else { /* cancel */ }
				}
				alertify.prompt('Enter the link: ',callback,'http://');
			}

			/* Command + letter, works for these, but include for consistency */
			/* x : cut */
			if(event.shiftKey && event.ctrlKey && event.keyCode === 88) {
				iframe.contentDocument.execCommand('cut',false,null);
			}
			/* c : copy */
			if(event.shiftKey && event.ctrlKey && event.keyCode === 67) {
				iframe.contentDocument.execCommand('copy',false,null);
			}
			/* v : paste */
			if(event.shiftKey && event.ctrlKey && event.keyCode === 86) {
				iframe.contentDocument.execCommand('paste',false,null);
			}
			/* z : undo */
			if(event.shiftKey && event.ctrlKey && event.keyCode === 90) {
				iframe.contentDocument.execCommand('undo',false,null);
			}
			/* y : redo */
			if(event.shiftKey && event.ctrlKey && event.keyCode === 89) {
				iframe.contentDocument.execCommand('redo',false,null);
			}

			/// is this necessary ??
			event.stopPropagation();
		}
	};
};
