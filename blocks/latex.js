x.latex = new function latex() {
	this.type = "latex";
	this.name = "latex";
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
		var latexpreview = document.createElement('div');
		latexpreview.setAttribute('class','latexImage');

		var latexBlock = document.createElement('div');
		latexBlock.setAttribute('class','xLtx');
		latexBlock.setAttribute('onblur','x["' + this.type + '"].f.renderLatex(this)');
		latexBlock.contentEditable = true;
		/* defaul text */
		if(globalScope.defaulttext && content === "") {
			latexBlock.innerHTML = 'LaTeX \\ Mark \\ Up: \\quad \\frac{d}{dx}\\left( \\int_{0}^{x} f(u)\\,du\\right)=f(x)';
		} else {
			latexBlock.innerHTML = deparseBlock(content);
		}

		block.appendChild(latexpreview);
		block.appendChild(latexBlock);

		return block;
	};

	this.afterDOMinsert = function(bid,data) {
		this.f.renderLatex(document.getElementById('bengine-a' + bid).childNodes[1]);
	};

	this.saveContent = function(bid) {
		/* replace() is for escaping backslashes */
		var blockContent = document.getElementById('bengine-a' + bid).children[1].innerHTML;
		return parseBlock(blockContent);
	};

	this.showContent = function(block,content) {
		var latexpreview = document.createElement('div');
		latexpreview.setAttribute('class','latexImage-show');

		var latexBlock = document.createElement('div');
		latexBlock.setAttribute('class','xLtx');
		latexBlock.setAttribute('style','display:none;visibility:hidden;');
		latexBlock.innerHTML = deparseBlock(content);

		block.appendChild(latexpreview);
		block.appendChild(latexBlock);

		this.f.renderLatex(latexBlock);

		return block;
	};

	this.styleBlock = function() {
		var stylestr = `.xLtx {
			display: inline-block;
			width: 100%;
			height: 100px;
			border: 1px solid black;
			border-radius: 2px;
			background-color: white;

			padding: 4px 6px;
			margin: 2px 0 0 0;
			box-sizing: border-box;
		}

		.latexImage, .latexImage-show {
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
		return "";
	};

	this.f = {
		renderLatex: function(block) {
			/* get the math notation and prepend/append double dollars, which is how MathJax identifies LaTeX markup language */
			var str = "$$" + block.textContent + "$$";

			/* put the latex into the image preview block */
			var imageBlock = block.parentNode.childNodes[0];
			imageBlock.innerHTML = str;

			/* render the image */
			MathJax.Hub.Queue(["Typeset",MathJax.Hub,imageBlock]);
		}
	};
};
