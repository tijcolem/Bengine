extensibles.xcode = new function xcode() {
	this.type = "xcode";
	this.name = "code";
	this.upload = false;

	var xcodeObj = this;
	var blocklimit = 15; // these are lines <br>, not chars

	var parseBlock = function(blockText) {
		var element = document.createElement('div');
		element.innerHTML = blockText.replace(/<span[^>]*>/g,"").replace(/<\/span>/g,"").replace(/</g,"@@LT").replace(/>/g,"@@RT").replace(/<br>/g,"@@BR");
		return encodeURIComponent(element.textContent).replace(/'/g,"%27");
	};

	var deparseBlock = function(blockText) {
		return decodeURIComponent(blockText).replace(/@@LT/g,"<").replace(/@@RT/g,">").replace(/@@BR/g,"<br>").replace(/%27/g,"'");
	};

	this.insertContent = function(block,content) {
		var codeBlock = document.createElement("code");
		codeBlock.setAttribute("class","xCde");
		codeBlock.onblur = function() {
			xcodeObj.f.renderCode(this);
		};
		codeBlock.contentEditable = true;

		/* defaul text */
		if(globalScope.defaulttext && content === "") {
			codeBlock.innerHTML = "var description = 'Programming languages are auto-detected.';<br>function default(parameter) {<br>&nbsp;&nbsp;&nbsp;&nbsp;var instructions = 'When you click outside the block syntax is highlighted.';<br>&nbsp;&nbsp;&nbsp;&nbsp;alert(parameter + instructions);<br>}<br>default(description);";
		} else {
			codeBlock.innerHTML = deparseBlock(content);
		}

		block.appendChild(codeBlock);

		/* attach keyboard shortcuts to iframe */
		if (codeBlock.addEventListener) {
			codeBlock.addEventListener("keydown",this.f.codeKeys.bind(null,block),false);
		} else if (codeBlock.attachEvent) {
			codeBlock.attachEvent("onkeydown",this.f.codeKeys.bind(null,block));
		} else {
			codeBlock.onkeydown = this.f.codeKeys.bind(null,block);
		}

		/* set limit on paste */
		codeBlock.onpaste = function(event) {
			var ptext;
			if (window.clipboardData && window.clipboardData.getData) {
				ptext = window.clipboardData.getData('Text');
			} else if (event.clipboardData && event.clipboardData.getData) {
				ptext = event.clipboardData.getData('text/plain');
			}

			var breakCount = (this.innerHTML.match(/<br>/g) || []).length;
			var lineCount = (ptext.match(/\n/g) || []).length;

			if((breakCount + lineCount) >= blocklimit) {
				return false;
			} else {
				return true;
			}
		};

		return block;
	};

	this.afterDOMinsert = function(bid,data) {
		var codeBlock = document.getElementById('bengine-a' + bid).childNodes[0];
		this.f.renderCode(codeBlock);
	};

	this.saveContent = function(bid) {
		var blockContent = document.getElementById('bengine-a' + bid).children[0].innerHTML;
		return parseBlock(blockContent);
	};

	this.showContent = function(block,content) {
		var codeBlock = document.createElement("div");
		codeBlock.setAttribute("class","xCde-show");
		codeBlock.innerHTML = deparseBlock(content);

		block.appendChild(codeBlock);
		this.f.renderCode(codeBlock);

		return block;
	};

	this.styleBlock = function() {
		var stylestr = `.xCde, .xCde-show {
			white-space: pre-line;

			display: inline-block;
			width: 100%;
			min-height: 62px;
			height: auto;
			border: 1px solid black;
			border-radius: 2px;
			background-color: white;

			line-height: 1.8em;
			word-wrap: break-word;
			overflow:hidden;

			background-image: -webkit-linear-gradient(#ccc, #ccc 3px, white 4px, white 18px, #ccc 19px, #ccc 32px);
		    background-image: -moz-linear-gradient(#ccc, #ccc 3px, white 4px, white 18px, #ccc 19px, #ccc 32px);
		    background-image: -ms-linear-gradient(#ccc, #ccc 3px, white 4px, white 18px, #ccc 19px, #ccc 32px);
		    background-image: -o-linear-gradient(#ccc, #ccc 3px, white 4px, white 18px, #ccc 19px, #ccc 32px);
			background-image: linear-gradient(#efefef, #efefef 5px, white 6px, white 28px, #efefef 29px, #efefef 50px);

			background-size: 100% 50px;

			padding: 4px 6px;
			margin: 0px;
			box-sizing: border-box;
		}`;
		return stylestr;
	};

	this.f = {
		/*
			Function: codeKeys

			This function is attached as the event listener to the code block. It detects key presses and applies styling.

			Parameters:

				block - the <code> tag
				event - the keydown event that triggers the function

			Returns:

				none
		*/
		codeKeys: function codeKeys(block,event) {
			var breakCount = (block.innerHTML.match(/(<br>|\n)/g) || []).length;
			if(event.keyCode === 13 && (breakCount + 1) >= blocklimit) {
				event.preventDefault();
			} else if(event.keyCode !== 8 && breakCount >= blocklimit) {
				event.preventDefault();
			} else {
				/* tab */
				if (event.keyCode === 9) {

					/* prevent default tab behavior */
					event.preventDefault();

					/* grab the cursor location */
					var doc = block.ownerDocument.defaultView;
					var sel = doc.getSelection();
					var range = sel.getRangeAt(0);

					/* insert 4 spaces representing a tab */
					var tabNode = document.createTextNode("\u00a0\u00a0\u00a0\u00a0");
					range.insertNode(tabNode);

					/* replace cursor to after tab location */
					range.setStartAfter(tabNode);
					range.setEndAfter(tabNode);
					sel.removeAllRanges();
					sel.addRange(range);
				}
			}
		},
		/*
			Function: renderCode

			This function is a wrapper for whatever function parses and styles the code block. Validation might also be included in here.

			Parameters:

				block - the block to render

			Returns:

				none
		*/
		renderCode: function renderCode(block) {
			/* add code formatting */
			hljs.highlightBlock(block);
		}
	};
};
