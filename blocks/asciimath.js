extensibles.xmath = new function xmath() {
	this.type = "xmath";
	this.name = "math";
	this.upload = false;

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
		mathBlock.setAttribute('onblur','x["' + this.type + '"].f.renderMath(this)');
		mathBlock.contentEditable = true;
		/* defaul text */
		if(globalScope.defaulttext && content === "") {
			mathBlock.innerHTML = 'AsciiMath \\ Mark \\ Up: \\ \\ \\ sum_(i=1)^n i^3=((n(n+1))/2)^2';
		} else {
			mathBlock.innerHTML = deparseBlock(content);
		}

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
			height: 100px;
			border: 1px solid black;
			border-radius: 2px;
			background-color: white;

			padding: 4px 6px;
			margin: 2px 0 0 0;
			box-sizing: border-box;

			font-family: Arial, Helvetica, sans-serif;
		}

		.mathImage, .mathImage-show {
			display: inline-block;
			width: 100%;
			height: 200px;
			border: 1px solid black;
			border-radius: 2px;
			background-color: white;

			padding: 4px 6px;
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
