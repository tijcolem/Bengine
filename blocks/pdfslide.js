extensibles.slide = new function slide() {
	(function() {
		blockGlobals.pdfObjects = {};
	})();

	this.type = "slide";
	this.name = "slide";
	this.upload = true;

	var slideObj = this;

	this.insertContent = function(block,content) {
		/* data-page attribute keeps track of which page is being displayed */
		var canvas = document.createElement("canvas");
		canvas.setAttribute("class","xSli");
		canvas.setAttribute("id",content);
		canvas.setAttribute("data-page","1");

		block.appendChild(canvas);

		/* if block was just made, don't try to load pdf */
		if (content !== "") {
			PDFJS.getDocument(content).then(function(pdfObj) {
				blockGlobals.pdfObjects[content] = pdfObj;

				var tag = block.childNodes[0];

				blockExtensibles.slide.f.renderPDF(pdfObj,1,tag);
			});
		}

		/* event listener for changing slides left & right */
		block.onmouseup = function(event) {
			var X = event.pageX - this.offsetLeft;
			/// var Y = event.pageY - this.offsetTop;

			/* get the <canvas> tag, current page, pdf url/id, and the pdf total page count */
			var canvas = this.childNodes[0];
			var pageNum = canvas.getAttribute("data-page");
			var pdfID = canvas.getAttribute("id");
			var pageCount = blockGlobals.pdfObjects[pdfID].numPages;

			/* determine whether left or right side was clicked, then render prev or next page */
			if(X > this.offsetWidth / 1.7) {
				if(pageNum < pageCount) {
					pageNum++;
					canvas.setAttribute("data-page",pageNum);
					blockExtensibles.slide.f.renderPDF(blockGlobals.pdfObjects[pdfID],pageNum,canvas);
				}
			} else {
				if(pageNum > 1) {
					pageNum--;
					canvas.setAttribute("data-page",pageNum);
					blockExtensibles.slide.f.renderPDF(blockGlobals.pdfObjects[pdfID],pageNum,canvas);
				}
			}
		};

		return block;
	};

	this.afterDOMinsert = function(bid,data) {
		var objCopy = this;
		if(data !== null) {
			/* add the pdf to the pdfObjects array and render the first page */
			PDFJS.getDocument(data).then(function(pdfObj) {

				blockGlobals.pdfObjects[data] = pdfObj;

				var slidetag = document.getElementById('bengine-a' + bid).childNodes[0];
				slidetag.setAttribute("id",data);

				objCopy.f.renderPDF(pdfObj,1,slidetag);
			});
		}
	};

	this.saveContent = function(bid) {
		var slidestr = document.getElementById('bengine-a' + bid).children[0].id;
		return slidestr.replace(location.href.substring(0,location.href.lastIndexOf('/') + 1),"");
	};

	this.showContent = function(block,content) {
		/* data-page attribute keeps track of which page is being displayed */
		var canvas = document.createElement("canvas");
		canvas.setAttribute("class","xSli-show");
		canvas.setAttribute("id",content);
		canvas.setAttribute("data-page","1");

		block.appendChild(canvas);

		/* if block was just made, don't try to load pdf */
		if (content !== "") {
			PDFJS.getDocument(content).then(function(pdfObj) {
				blockGlobals.pdfObjects[content] = pdfObj;

				var tag = block.childNodes[0];

				blockExtensibles.slide.f.renderPDF(pdfObj,1,tag);
			});
		}

		/* event listener for changing slides left & right */
		block.onmouseup = function(event) {
			var X = event.pageX - this.offsetLeft;
			/// var Y = event.pageY - this.offsetTop;

			/* get the <canvas> tag, current page, pdf url/id, and the pdf total page count */
			var canvas = this.childNodes[0];
			var pageNum = canvas.getAttribute("data-page");
			var pdfID = canvas.getAttribute("id");
			var pageCount = blockGlobals.pdfObjects[pdfID].numPages;

			/* determine whether left or right side was clicked, then render prev or next page */
			if(X > this.offsetWidth / 1.7) {
				if(pageNum < pageCount) {
					pageNum++;
					canvas.setAttribute("data-page",pageNum);
					blockExtensibles.slide.f.renderPDF(blockGlobals.pdfObjects[pdfID],pageNum,canvas);
				}
			} else {
				if(pageNum > 1) {
					pageNum--;
					canvas.setAttribute("data-page",pageNum);
					blockExtensibles.slide.f.renderPDF(blockGlobals.pdfObjects[pdfID],pageNum,canvas);
				}
			}
		};

		return block;
	};

	this.styleBlock = function() {
		var stylestr = `.xSli, .xSli-show {
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

	this.f = {
		renderPDF: function(pdfDoc,pageNum,canvas) {
			/*
				pdfDoc - pdf object from pdfObject global array
				pageNum - pdf page to render, found in data-page attribute of <canvas>
				canvas - the <canvas> tag to render pdf page to
			*/

			/// I have no idea what scale does, but it's needed
			var scale = 0.8;

			/* call pdfDoc object's getPage function to get desired page to render */
			pdfDoc.getPage(pageNum).then(function(page) {

				/* define <canvas> attributes */
				var viewport = page.getViewport(scale);
				canvas.height = viewport.height;
				canvas.width = viewport.width;

				/* define more <canvas> attributes for render() function */
				var renderContext = {
					canvasContext: canvas.getContext('2d'),
					viewport: viewport
				};

				/* finally, render the pdf page to canvas */
				var renderTask = page.render(renderContext);

				renderTask.promise.then(function() {
					/// update stuff here, page has been rendered
				});
			});
		}
	};
};
