
[![Build Status](https://travis-ci.org/efossas/Bengine.svg?branch=master)](https://travis-ci.org/efossas/Bengine)
[![Gitter chat](https://badges.gitter.im/gitterHQ/gitter.png)](https://gitter.im/BlockEngine/Lobby)

# Bengine
A browser block engine.

Bengine handles the creating and deleting of "blocks", which are just html elements. You can create custom blocks with special javascript functionality and add them to Bengine. Those custom blocks are coded into constructor objects which are called "extensibles".

Bengine also supports Opaque, LTI, & API protocols for acting as a quiz engine for learning management systems.

For a simple example of the block engine, visit [wisepool playground](http://wisepool.io/play).

## Wanted Extensibles

If you would like to contribute to this project, please consider coding the following wanted extensibles:

- PythonTutor block
- Chartjs block
- Blockly block
- draw.io block

## Getting Started Locally

Download & enter the repo.

```
git clone https://github.com/efossas/Bengine ~
cd ~/Bengine
```

Install the node dependencies.

```
npm install
```

Change any configuration you need in `config.json`. Then run the back-end server.

```
./run.sh
```

Now go to the index page: [http://localhost:2020](http://localhost:2020)
