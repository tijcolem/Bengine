
[![Build Status](https://travis-ci.org/efossas/Bengine.svg?branch=master)](https://travis-ci.org/efossas/Bengine)
[![Stories in Ready](https://badge.waffle.io/efossas/Bengine.png?label=ready&title=Ready)](http://waffle.io/efossas/Bengine)
[![Gitter chat](https://badges.gitter.im/gitterHQ/gitter.png)](https://gitter.im/BlockEngine/Lobby)

# Bengine
A javascript browser block engine.

Bengine handles the creating and deleting of "blocks", which are just html elements. You can create custom blocks with special javascript functionality and add them to Bengine. Those custom blocks are coded into contructor objects which are called "extensibles".

For a simple example of the block engine, visit [wisepool playground](http://wisepool.io/play).

## Wanted Extensibles

If you would like to contribute to this project, please consider coding the following wanted extensibles:

- PythonTutor block
- Chartjs block
- Blockly block
- D3js blocks
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

Run the back end server. The number is the port to listen on.

```
node main 3030
```

To view a page with all blocks installed, go to [http://localhost:3030](http://localhost:3030 "All Blocks")

For instructions on how to make & test a new block, go to [http://localhost:3030/playground.html](http://localhost:3030/playground.html "Create New Blocks")

## Getting Started Docker

There is a docker image with everything installed and ready to go: [Bengine Docker Image](https://hub.docker.com/r/ericfossas/bengine/ "Bengine Docker")

Download and run the container with port 80 mapped to some host port.

Enter the container and run the following commands:

```
service apache2 restart
cd /var/www/bengine
node main 3030
```

You should be able to see Bengine by opening a browser and going to http://localhost:PORT where PORT is the host port you chose to map to the docker container.

## Next Steps

The front end is fully functional.

The back end requires your own code. Specifically 3 routes: upload, save, revert. It's up to you to decide where you want to put uploaded media, save block content, and handle block content retrieval.
