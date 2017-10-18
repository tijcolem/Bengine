BengineConfig.extensibles.xmath = new function Xmath() {
	this.type = "xmath";
	this.name = "asciimath";
	this.category = "text";
	this.upload = false;

	var xmathObj = this;
	var blocklimit = 2047;
	
	var emptyObject = function(obj) {
		if(Object.keys(obj).length === 0 && obj.constructor === Object) {
			return true;
		}
		return false;
	}
	
	this.fetchDependencies = function() {
		var mathjax = {
			inner: '',
			integrity: '',
			source: 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.1/MathJax.js?config=TeX-MML-AM_CHTML',
			type: 'text/javascript'
		};
		var mathjaxConfig = {
			inner: `MathJax.Hub.Config({mml2jax:{processClass:'mathImage',ignoreClass:'xample'},asciimath2jax:{processClass:'mathImage',ignoreClass:'body'},messageStyle:'none'});`,
			integrity: '',
			source: '',
			type: 'text/x-mathjax-config'
		}
		
		return [mathjax,mathjaxConfig];
	};

	this.insertContent = function(block,bcontent) {		
		var mathpreview = document.createElement('div');
		mathpreview.setAttribute('class','mathImage');

		var mathBlock = document.createElement('div');
		mathBlock.setAttribute('class','xMat');
		mathBlock.onblur = function() {
			xmathObj.f.renderMath(this);
		};
		mathBlock.contentEditable = true;
		/* defaul text */
		if(BengineConfig.options.defaultText && emptyObject(bcontent)) {
			mathBlock.innerHTML = 'AsciiMath \\ Mark \\ Up: \\ \\ \\ sum_(i=1)^n i^3=((n(n+1))/2)^2';
		} else {
			mathBlock.innerHTML = bcontent['content'];
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
		this.f.renderMath(document.getElementById(bid).childNodes[1]);
	};

	this.saveContent = function(bid) {
		return {'content':document.getElementById(bid).children[1].innerHTML};
	};

	this.showContent = function(block,bcontent) {
		var mathpreview = document.createElement('div');
		mathpreview.setAttribute('class','mathImage-show');

		var mathBlock = document.createElement('div');
		mathBlock.setAttribute('class','xMat');
		mathBlock.setAttribute('style','display:none;visibility:hidden;');
		mathBlock.innerHTML = bcontent['content'];

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
			background-color: white;

			padding: 8px 6px;
			margin: 0;
			box-sizing: border-box;

			font-family: Arial, Helvetica, sans-serif;
		}

		.mathImage, .mathImage-show {
			display: inline-block;
			width: 100%;
			height: auto;
			border: 1px solid black;
			background-color: white;
			
			text-align:center;

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
	
	this.g = {};
};
