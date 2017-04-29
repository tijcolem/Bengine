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

## Getting Started

Download & enter the repo.

```
git clone https://github.com/efossas/Bengine ~
cd ~/Bengine
```

Install the node dependencies.

```
npm install
```

Run the back end server. The number is the port to listen on.

```
node main 3030
```

To view a page with all blocks installed, go to [http://localhost:3030](http://localhost:3030 "All Blocks")

For instructions on how to make & test a new block, go to [http://localhost:3030/playground.html](http://localhost:3030/playground.html "Create New Blocks")

## Next Steps

The front end is fully functional.

The back end requires your own code. Specifically 3 routes: upload, save, revert. It's up to you to decide where you want to put uploaded media, save block content, and handle block content retrieval.
