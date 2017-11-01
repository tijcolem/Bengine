BengineConfig.extensibles.qcss = new function Qcss() {
	this.type = "qcss";
	this.name = "css";
	this.category = "quiz";
	this.upload = false;
	this.accept = null;

	var thisBlock = this;
	var _private = {};
	
	_private.renderCSS = function(block,sid) {
		/* get or make style block */
		let styleblock;
		try {
			styleblock = document.getElementById('qengine-styles-' + sid);
		} catch(err) {
			// ignore, just an id doesn't exist err
		} finally {
			if(!styleblock) {
				styleblock = document.createElement('style');
				styleblock.setAttribute("id", 'qengine-styles-' + sid);
				document.getElementsByTagName('head')[0].appendChild(styleblock);
			}
		}
		
		/* render css */
		styleblock.innerHTML = block.innerText;
	};
	
	this.destroy = function(block) {
		let sid = block.childNodes[0].getAttribute('data-sid');
		let styletag = document.getElementById('qengine-styles-' + sid);
		
		styletag.parentNode.removeChild(styletag);
	}
	
	this.fetchDependencies = function() {
		return null;
	}

	this.insertContent = function(block,bcontent) {
		var qcssBlock = document.createElement('div');
		qcssBlock.setAttribute('class','xQcss');
		
		let sid = thisBlock.p.createUUID();
		qcssBlock.setAttribute('data-sid',sid);
		qcssBlock.contentEditable = true;
		
		if(!thisBlock.p.emptyObject(bcontent)) {
			qcssBlock.innerText = bcontent['content'];
		} else {
			qcssBlock.innerText = '.place-css-here { background-color:white; }';
		}

		block.appendChild(qcssBlock);

		return block;
	};

	this.afterDOMinsert = function(bid,data) {
		let sid = document.getElementById(bid).childNodes[0].getAttribute('data-sid');
		_private.renderCSS(document.getElementById(bid).childNodes[0],sid);
	};
	
	this.runBlock = function(bid) {
		var qcssBlock = document.getElementById(bid).childNodes[0];
		let sid = qcssBlock.getAttribute('data-sid');
		_private.renderCSS(qcssBlock,sid);
	}

	this.saveContent = function(bid) {
		return {'content':document.getElementById(bid).children[0].innerHTML};
	};

	this.showContent = function(block,bcontent) {
		var qcssBlock = document.createElement('div');
		qcssBlock.setAttribute('class','xQcss');
		qcssBlock.setAttribute('style','display:none;visibility:hidden;');
		qcssBlock.innerHTML = bcontent['content'];
		
		block.appendChild(qcssBlock);

		_private.renderCSS(qcssBlock,thisBlock.p.createUUID());

		return block;
	};

	this.styleBlock = function() {
		var stylestr = `.xQcss {
			display: inline-block;
			width: 100%;
			height: auto;
			border: 1px solid black;
			background-color: white;

			padding: 8px 6px;
			margin: 0;
			box-sizing: border-box;

			font-family: Arial, Helvetica, sans-serif;
		}`;
		return stylestr;
	};
};
