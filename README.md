# Bengine
A javascript browser block engine.

Bengine handles the creating and deleting of "blocks", which are just html elements. You can create custom blocks with special javascript functionality and add them to Bengine. Those custom blocks are coded into contructor objects which are called "extensibles".

For a simple example of the block engine, visit [wisepool playground](http://wisepool.io/play).

## Wanted Extensibles

If you would like to contribute to this project, please consider coding the following wanted extensibles:

- CodeMirror block
- PythonTutor block
- Blockly block
- draw.io block

## A Basic Example Of Bengine

Create these objects. You'll need to add an extensible to the `blockExtensibles` object. You can find code for a simple one at [wisepool playground](http://wisepool.io/play).

```javascript
var blockExtensibles = {};
var blockGlobals = {};  
var blockCustomFunctions = {};  
var blockOptions = { enableSave:false };
```

Create a div for your block engine and append it to the document.

```javascript
var div = document.createElement("div");
div.id = 'engineID';
body.appendChild(div);
```

Create & start your block bengine.

```javascript
var myEngine = new Bengine(blockExtensibles,blockGlobals,blockCustomFunctions,blockOptions);
myEngine.blockEngineStart("bengineID",["",0,0],[]);
```

## Bengine HTML Prefixes

Bengine prefixes all its id & class names with 'bengine-'

- 'bengine-' + number
- 'bengine-b' + number
- 'bengine-a' + number
- 'bengine-d' + number
- 'bengine-instance'
- 'bengine-x-blocks'
- 'bengine-file-select'
- 'bengine-x-id'
- 'bengine-progressbar'
- 'bengine-autosave'
- 'bengine-savestatus'
- 'bengine-statusid'

## Save Routes

If you plan on using saving services, set up the following routes:

- /saveblocks
- /uploadmedia
- /revertblocks

*if you need to change up the path, pass in a custom createURL() function to Bengine.*

## Creating A Bengine Object

Everything is wrapped in the Bengine() object. Use `new Bengine()` to get instance;

Bengine() takes the following parameters:
- extensibles (object) - properties of this object are block objects with the correct API
- globals (object) - holds any globals needed by the extensibles
- funcs (object) - holds any custom functions to replace a Bengine function
- options (object) - holds key-values to set Bengine options

## Starting Bengine

To start the engine, you run `blockEngineStart()`, with the following parameters
- main (string) - the id of the div to append the block engine to
- id (array) [page type,xid,directory id]
  * page type (string) - an id to recognize the block engine on the back-end, used for saving/retrieval
  * xid (string) - an id to recognize the page on the back-end, used for saving/retrieval
  * did (string) - and id to recognize the directory where uploaded media is stored on the back-end
- data (array) [type,content,...]
  * type (string) - the block type, should match the type property of a block in the extensibles
  * content (string) - block content, it is passed to an extensible's `insertContent()` & `showContent()` function
  
## Creating An Extensible

You can find a playground for creating extensibles here: [wisepool playground](http://wisepool.io/play)

Extensibles are objects with the following properties:

- type (string)
- name (string)
- upload (boolean)
- insertContent (function) {block,content}
  * block (object)
  * content (object)
- afterDOMinsert (function) {bid,data}
  * bid (object)
  * data (object)
- saveContent (function) {bid}
  * bid (object)
- showContent (function) {block,content}
  * block (object)
  * content (object)
- styleBlock (function)
- f (object)






