
[![Build Status](https://travis-ci.org/academicsystems/Bengine.svg?branch=master)](https://travis-ci.org/academicsystems/Bengine)
[![Gitter chat](https://badges.gitter.im/gitterHQ/gitter.png)](https://gitter.im/BlockEngine/Lobby)

# Bengine
A browser block engine.

The purpose of Bengine is to provide a simple platform for creating dynamic web resources.

Bengine handles the creating and deleting of "blocks", which are just html elements. You can view the available block types in the "blocks" folder. You can always create your own block if you don't see the functionality you want.

Bengine also works as a front-end for developing and testing dynamic questions that work with Qengine.

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
npm start
```

Now go to the index page: [http://localhost:2020](http://localhost:2020)
