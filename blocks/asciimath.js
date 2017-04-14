extensibles.xmath = new function xmath() {
	this.type = "xmath";
	this.name = "math";
	this.upload = false;

	var xmathObj = this;
	var blocklimit = 2047;

	var parseBlock = function(blockText) {
		var element = document.createElement('div');
		element.innerHTML = blockText.replace(/\\/g,"\\\\").replace(/</g,"@@LT").replace(/>/g,"@@RT").replace(/<br>/g,"@@BR");
		return encodeURIComponent(element.textContent).replace(/'/g,"%27");
	};

	var deparseBlock = function(blockText) {
		return decodeURIComponent(blockText).replace(/\\\\/g,'\\').replace(/@@LT/g,"<").replace(/@@RT/g,">").replace(/@@BR/g,"<br>").replace(/%27/g,"'");
	};

	this.insertContent = function(block,content) {
		var mathpreview = document.createElement('div');
		mathpreview.setAttribute('class','mathImage');

		var mathBlock = document.createElement('div');
		mathBlock.setAttribute('class','xMat');
		mathBlock.onblur = function() {
			xmathObj.f.renderMath(this);
		};
		mathBlock.contentEditable = true;
		/* defaul text */
		if(globalScope.defaulttext && content === "") {
			mathBlock.innerHTML = 'AsciiMath \\ Mark \\ Up: \\ \\ \\ sum_(i=1)^n i^3=((n(n+1))/2)^2';
		} else {
			mathBlock.innerHTML = deparseBlock(content);
		}

		/* set limit function on keydown event */
		function setLimit(block,event) {
			if(event.keyCode !== 8 && block.innerText.length > blocklimit) {
				event.preventDefault();
			}
		}

		if (mathBlock.addEventListener) {
			mathBlock.addEventListener("keydown",setLimit.bind(null,block),false);
		} else if (mathBlock.attachEvent) {
			mathBlock.attachEvent("onkeydown",setLimit.bind(null,block));
		} else {
			mathBlock.onkeydown = setLimit.bind(null,block);
		}

		/* set limit on paste */
		mathBlock.onpaste = function(event) {
			var ptext;
			if (window.clipboardData && window.clipboardData.getData) {
				ptext = window.clipboardData.getData('Text');
			} else if (event.clipboardData && event.clipboardData.getData) {
				ptext = event.clipboardData.getData('text/plain');
			}

			if((this.innerText.length + ptext.length) > blocklimit) {
				return false;
			}
			return true;
		};

		block.appendChild(mathpreview);
		block.appendChild(mathBlock);

		return block;
	};

	this.afterDOMinsert = function(bid,data) {
		this.f.renderMath(document.getElementById('bengine-a' + bid).childNodes[1]);
	};

	this.saveContent = function(bid) {
		/* replace() is for escaping backslashes */
		var blockContent = document.getElementById('bengine-a' + bid).children[1].innerHTML;
		return parseBlock(blockContent);
	};

	this.showContent = function(block,content) {
		var mathpreview = document.createElement('div');
		mathpreview.setAttribute('class','mathImage-show');

		var mathBlock = document.createElement('div');
		mathBlock.setAttribute('class','xMat');
		mathBlock.setAttribute('style','display:none;visibility:hidden;');
		mathBlock.innerHTML = deparseBlock(content);

		block.appendChild(mathpreview);
		block.appendChild(mathBlock);

		this.f.renderMath(mathBlock);

		return block;
	};

	this.styleBlock = function() {
		var stylestr = `.xMat {
			display: inline-block;
			width: 100%;
			height: auto;
			border: 1px solid black;
			border-radius: 2px;
			background-color: white;

			padding: 8px 6px;
			margin: 2px 0 0 0;
			box-sizing: border-box;

			font-family: Arial, Helvetica, sans-serif;
		}

		.mathImage, .mathImage-show {
			display: inline-block;
			width: 100%;
			height: auto;
			border: 1px solid black;
			border-radius: 2px;
			background-color: white;

			padding: 8px 6px;
			margin: 0px;
			box-sizing: border-box;
		}`;
		return stylestr;
	};

	this.f = {
		renderMath: function(block) {
			/* get the math notation and prepend/append backticks, which is how MathJax identifies ASCIIMath markup language */
			var str = "`" + block.textContent + "`";

			/* put the asciimath into the image preview block */
			var imageBlock = block.parentNode.childNodes[0];
			imageBlock.innerHTML = str;

			/* render the image */
			MathJax.Hub.Queue(["Typeset",MathJax.Hub,imageBlock]);
		}
	};
};
