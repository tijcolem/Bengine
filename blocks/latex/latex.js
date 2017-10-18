BengineConfig.extensibles.latex = new function Latex() {
	this.type = "latex";
	this.name = "latex";
	this.category = "text";
	this.upload = false;

	var latexObj = this;
	var blocklimit = 2097;
	
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
			inner: `MathJax.Hub.Config({tex2jax:{processClass:'latexImage',ignoreClass:'body'},messageStyle:'none'});`,
			integrity: '',
			source: '',
			type: 'text/x-mathjax-config'
		}
		
		return [mathjax,mathjaxConfig];
	}

	this.insertContent = function(block,bcontent) {
		var latexpreview = document.createElement('div');
		latexpreview.setAttribute('class','latexImage');

		var latexBlock = document.createElement('div');
		latexBlock.setAttribute('class','xLtx');
		latexBlock.onblur = function() {
			latexObj.f.renderLatex(this);
		};
		latexBlock.contentEditable = true;
		/* defaul text */
		if(BengineConfig.options.defaultText && emptyObject(bcontent)) {
			latexBlock.innerHTML = 'LaTeX \\ Mark \\ Up: \\quad \\frac{d}{dx}\\left( \\int_{0}^{x} f(u)\\,du\\right)=f(x)';
		} else {
			latexBlock.innerHTML = bcontent['content'];
		}

		/* set limit function on keydown event */
		function setLimit(block,event) {
			if(event.keyCode !== 8 && block.innerText.length > blocklimit) {
				event.preventDefault();
			}
		}

		if (latexBlock.addEventListener) {
			latexBlock.addEventListener("keydown",setLimit.bind(null,block),false);
		} else if (latexBlock.attachEvent) {
			latexBlock.attachEvent("onkeydown",setLimit.bind(null,block));
		} else {
			latexBlock.onkeydown = setLimit.bind(null,block);
		}

		/* set limit on paste */
		latexBlock.onpaste = function(event) {
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

		block.appendChild(latexpreview);
		block.appendChild(latexBlock);

		return block;
	};

	this.afterDOMinsert = function(bid,data) {
		this.f.renderLatex(document.getElementById(bid).childNodes[1]);
	};

	this.saveContent = function(bid) {
		return {'content':document.getElementById(bid).children[1].innerHTML};
	};

	this.showContent = function(block,bcontent) {
		var latexpreview = document.createElement('div');
		latexpreview.setAttribute('class','latexImage-show');

		var latexBlock = document.createElement('div');
		latexBlock.setAttribute('class','xLtx');
		latexBlock.setAttribute('style','display:none;visibility:hidden;');
		latexBlock.innerHTML = bcontent['content'];

		block.appendChild(latexpreview);
		block.appendChild(latexBlock);

		this.f.renderLatex(latexBlock);

		return block;
	};

	this.styleBlock = function() {
		var stylestr = `.xLtx {
			display: inline-block;
			width: 100%;
			height: auto;
			border: 1px solid black;
			background-color: white;

			padding: 8px 6px;
			margin: 0;
			box-sizing: border-box;
		}

		.latexImage, .latexImage-show {
			display: inline-block;
			width: 100%;
			height: auto;
			border: 1px solid black;
			background-color: white;

			padding: 8px 6px;
			margin: 0px;
			box-sizing: border-box;
		}`;
		return stylestr;
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
	
	this.g = {};
};
