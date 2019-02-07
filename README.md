# dree
A nodejs module wich helps you handle a directory tree. It provides you an object of a directory tree with custom configuration and optional callback method when a file or dir is scanned. With Typescript support.

## Install

```bash
$ npm install dree
```

## Usage

Simple:

```js
const dree = require('dree');
const tree = dree.scan('./folder');
```

With custom configuration:

```js
const dree = require('dree');

const options = {
  stat: false,
  normalize: true,
  followLinks: true,
  size: true,
  hash: true,
  depth: 5,
  exclude: /nofetchdir/g,
  extensions: [ 'txt', 'jpg' ]
};

const tree = dree.scan('./folder', options);
```

With file and dir callbacks:

```js
const dree = require('dree');

const options = {
  stat: false
};

const fileCallback = function (element, stat) {
  console.log('Found file named ' + element.name + ' created on ' + stat.ctime);
};
const dirCallback = function (element, stat) {
  console.log('Found file named ' + element.name + ' created on ' + stat.ctime);
};

const tree = dree.scan('./folder', options, fileCallback, dirCallback);
```

## Result

Given a directory structured like this:

```
sample
├── backend
│   └── firebase.json
│   └── server
│       └── server.ts
└── frontend
│    └── angular
│       ├── app.ts
│       └── index.html
└── .gitignore
```
With this configurations:

```js
const options = {
    stat: false,
    hash: false,
    sizeInBytes: false,
    size: true,
    normalize: true,
    extensions: [ 'ts', 'json' ]
};
```

The result will be:

```json
{
  "name": "sample",
  "path": "D:/Github/dree/test/sample",
  "relativePath": ".",
  "type": "directory",
  "isSymbolicLink": false,
  "size": "1.79 MB",
  "children": [
    {
      "name": "backend",
      "path": "D:/Github/dree/test/sample/backend",
      "relativePath": "backend",
      "type": "directory",
      "isSymbolicLink": false,
      "size": "1.79 MB",
      "children": [
        {
          "name": "firebase.json",
          "path": "D:/Github/dree/test/sample/backend/firebase.json",
          "relativePath": "backend/firebase.json",
          "type": "file",
          "isSymbolicLink": false,
          "extension": "json",
          "size": "29 B"
        }, 
        {
          "name": "server",
          "path": "D:/Github/dree/test/sample/backend/server",
          "relativePath": "backend/server",
          "type": "directory",
          "isSymbolicLink": false,
          "size": "1.79 MB",
          "children": [
            {
              "name": "server.ts",
              "path": "D:/Github/dree/test/sample/backend/server/server.ts",
              "relativePath": "backend/server/server.ts",
              "type": "file",
              "isSymbolicLink": false,
              "extension": "ts",
              "size": "1.79 MB"
            }
          ]
        }
      ]
    }
  ]
}
```
## Documentation

TODO

## Note

On **Windows** it could be possible that symbolic links are not detected, due to a problem with node fs module. If `symbolicLinks` is set to true, then `isSymbolicLink` could result `false` for al the tree nodes. In addition, if `followLinks` is set to true, it could be possible that links will not be followed instead.

The **callbacks** have a tree representation of the node and its stat as parameters. The tree parameter **reflects** the options given to `scan`. For example, if you set `hash` to `false`, then the tree parameter of a callback will not have the hash value. The stat parameter **depends** on the `followLinks` option. If it is true it will be the result of `fs.stat`, otherwise it will be the result of `fs.lstat`.

Properties as **hash** or **size** are computed considering only the **not filtered** nodes. For instance, the result size of a folder could be different from its actual size, if some of its inner files have not been considered due to filters as `exclude`.

The **hash** of two nodes with the same content could be **different**, because also the **name** is take in consideration.

## Dev

To run tests go to the package root in your CLI and run

```bash
$ npm test
```
Make sure you have the dev dependencies installed.
