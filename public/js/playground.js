var playBlockStartCode = `function() {

/**************************************
type (string) - should match property name you add to extensibles, must be 5 letters or less
name (string) - the name that appears to the user to create your block
category (string) - must be one of these [code, media, text, qengine]
upload (boolean) - whether this block requires uploading media
accept (string) - comma-separated extensions to accept for uploading media
***************************************/

this.type = "tarea";
this.name = "textarea";
this.category = "text";
this.upload = false;
this.accept = "";

/**************************************
fetchDependencies()
loads remote javascript libraries needed for the block. 
return null if not needed or return an array of objects, each object should have these properties:

inner: any javascript to run between <script> tags
source: the src attribute of the <script> tag
type: the type attribute of the <script> tag
***************************************/

this.fetchDependencies = function() {		
	return null;
};

/**************************************
insertContent(block,content)
creates your block in editing mode. attach your custom block to the block element and return the block

block - attach your custom block to this element
content - any content from the database
***************************************/

this.insertContent = function(block,content) {
	var xtarea = document.createElement("textarea");
	xtarea.setAttribute("class","xTar");
	xtarea.value = content;
	
	if(content === "") {
		xtarea.placeholder = "textarea text goes here...";
	}

	block.appendChild(xtarea);

	return block;
};

/**************************************
afterDOMinsert(bid,data)
any code to run after the block has been attached to the dom

bid - the block id, so you can getElementById
data - this is always null, it might become something in later versions
***************************************/

this.afterDOMinsert = function(bid,data) {
	// this simple example requires no code after appending block to dom
};

/**************************************
saveContent(bid)
grab only the necessary values to save to the database and return them

bid - the block id, so you can getElementById
***************************************/

this.saveContent = function(bid) {
	var textstr = document.getElementById('bengine-a' + bid).children[0].value;
	return textstr;
};

/**************************************
showContent(block,content)
creates your block in show mode. attach your custom block to the block element and return the block

block - attach your custom block to this element
content - any content from the database
***************************************/

this.showContent = function(block,content) {
	var xtarea = document.createElement("textarea");
	xtarea.setAttribute("class","xTar-show"); // set class for styling
	xtarea.src = content;
    xtarea.setAttribute('readonly','true');

	block.appendChild(xtarea);

	return block;
};

/**************************************
add your custom css here

should contain two classes, one for edit mode & one for show mode
***************************************/

this.styleBlock = function() {
    var stylestr = \`
    .tarea {
    	max-width: 100%;
    	margin: 0px auto 0 auto;
    }

    .xTar, .xTar-show {
    	display: inline-block;
    	overflow-y: auto;

    	width: 100%;
    	height: 200px;
    	border: 1px solid black;
    	border-radius: 2px;
    	background-color: white;

    	padding: 8px;
    	margin: 0px;
    	box-sizing: border-box;

    	font-family: Arial, Helvetica, sans-serif;
    	font-size: 1em;
    	font-weight: 300;
    	color: black;

        resize: none;
    }

    .xTar-show {
    	padding: 8px;
    	margin-bottom: 12px;
    }
    \`;

    return stylestr;
};

/**************************************
use this to attach functions you need during runtime.
you can use them by calling this.f.myfunction in other parts of this extensible.
you may have to use javascript's .bind() function when calling it.
***************************************/

this.f = {
    // our simple example requires no runtime functions
};

}
`;

var playBlock = document.getElementById("play");

var playCodeMirror = CodeMirror(playBlock,{
    value: playBlockStartCode,
    mode:  "javascript",
    lineWrapping: true
});
playCodeMirror.setSize('100%',500);

function loadCustomBlock() {
    var nodeDiv = document.getElementById("content");
	while (nodeDiv.hasChildNodes()) {
		nodeDiv.removeChild(nodeDiv.lastChild);
	}

    var code = playCodeMirror.getValue();

    try {
        var BlockFunction = eval('(' + code + ')');
    } catch (e) {
        if (e instanceof SyntaxError) {
            alertify.alert(e.message);
        }
        return;
    }

    var blockObject = new BlockFunction();
    console.log(blockObject);
    blockExtensibles[blockObject.type] = blockObject;

    var playEngine = new Bengine(blockExtensibles,blockCustomFunctions,blockOptions);
    playEngine.blockEngineStart('content',['page',1,1],[]);
}
