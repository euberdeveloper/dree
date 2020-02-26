[![Build Status](https://travis-ci.org/euberdeveloper/dree.svg?branch=master)](https://travis-ci.org/euberdeveloper/dree)
[![CircleCI](https://circleci.com/gh/euberdeveloper/dree.svg?style=svg)](https://circleci.com/gh/euberdeveloper/dree)
[![Coverage Status](https://coveralls.io/repos/github/euberdeveloper/dree/badge.svg?branch=master)](https://coveralls.io/github/euberdeveloper/dree?branch=master)
[![Codecov Status](https://codecov.io/gh/euberdeveloper/dree/branch/master/graph/badge.svg)](https://codecov.io/gh/euberdeveloper/dree)
[![Known Vulnerabilities](https://snyk.io/test/github/euberdeveloper/dree/badge.svg?targetFile=package.json)](https://snyk.io/test/github/euberdeveloper/dree?targetFile=package.json)
[![dependencies Status](https://david-dm.org/euberdeveloper/dree/status.svg)](https://david-dm.org/euberdeveloper/dree)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![License](https://img.shields.io/npm/l/dree.svg)](https://github.com/euberdeveloper/dree/blob/master/LICENSE)
[![Uptime Robot Day](https://badgen.net/uptime-robot/day/m784048696-57a1270a68a79b45e7e693d2)](https://badgen.net/uptime-robot/day/m784048696-57a1270a68a79b45e7e693d2)
[![GitHub issues](https://img.shields.io/github/issues/euberdeveloper/dree.svg)](https://github.com/euberdeveloper/dree/issues)
[![GitHub stars](https://img.shields.io/github/stars/euberdeveloper/dree.svg)](https://github.com/euberdeveloper/dree/stargazers)
![npm](https://img.shields.io/npm/v/dree.svg)
[![Average time to resolve an issue](https://isitmaintained.com/badge/resolution/euberdeveloper/dree.svg)](https://isitmaintained.com/project/euberdeveloper/dree)

# dree
A nodejs module which helps you handle a directory tree. It provides you an object of a directory tree with custom configuration and optional callback method when a file or dir is scanned. You will also be able to turn the tree into a string representation. With Typescript support and both sync and async support.

## Install

To install dree as a local module:

```bash
$ npm install dree
```

To install dree as a global module:

```bash
$ npm install -g dree
```

## Usage (local module)

### Get an object

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
  exclude: /dir_to_exclude/,
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

With the asynchronous version:

```js
const dree = require('dree');

const options = {
  stat: false,
  normalize: true,
  followLinks: true,
  size: true,
  hash: true,
  depth: 5,
  exclude: /dir_to_exclude/,
  extensions: [ 'txt', 'jpg' ]
};

dree.scanAsync('./folder', options)
  .then(function (tree) {
    console.log(tree);
  });
```

### Get a string

Simple:

```js
const dree = require('dree');
const string = dree.parse('./folder');
```

With custom configuration:

```js
const dree = require('dree');

const options = {
  followLinks: true,
  depth: 5,
  exclude: /dir_to_exclude/,
  extensions: [ 'txt', 'jpg' ]
};

const string = dree.parse('./folder', options);
```

Get a string from an object:

```js
const dree = require('dree');
const tree = dree.scan('./folder');

const options = {
  followLinks: true,
  depth: 5,
  exclude: /dir_to_exclude/,
  extensions: [ 'txt', 'jpg' ]
};

const string = dree.parseTree(tree, options);
```

With the asynchronous version:

```js
const dree = require('dree');

const options = {
  followLinks: true,
  depth: 5,
  exclude: /dir_to_exclude/,
  extensions: [ 'txt', 'jpg' ]
};

dree.parseAsync('./folder', options)
  .then(function (string) {
    console.log(string);
  });
```

## Usage (global module)

### Get an object

```bash
$ dree scan <source> --dest ./output --name result
```

This way the result will be saved in `./output/result.json`

### Get a string

```bash
$ dree parse <source> --dest ./output --name result
```

This way the result will be saved in `./output/result.txt`

### Log the result

```bash
$ dree scan|parse <source> --dest ./output --name result --show
```
With `--show` option, the result will also be printed with `console.log()`

### See all options

`scan` and `parse` accept the same options of their analog local functions. The options can be specified both as command arguments and json file.

```bash
$ dree --help --all-options
```

## Result

Given a directory structured like this:

```
sample
├── backend
│   └── firebase.json
│   └── notes.txt
│   └── server
│       └── server.ts
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

The object returned from scan will be:

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
With similar configurations, parse will return:

```
sample
 └─> backend
     ├── firebase.json
     ├── hello.txt
     └─> server
         └── server.ts
```
## API

### online documentation

The documentation generated with **TypeDoc** is available in this **[site](https://dree.euberdeveloper.now.sh/globals.html)**.

### scan

**Syntax:**

`dree.scan(path, options, fileCallback, dirCallback)`

**Description:**

Given a path, returns an object representing its directory tree. The result could be customized with options and a callback for either each file and each directory is provided. Executed synchronously. See __Usage__ to have an example.

**Parameters:**

* __path__: Is of type `string`, and is the relative or absolute path the file or directory that you want to scan
* __options__: Optional. Is of type `object` and allows you to customize the function behaviour.
* __fileCallback__: Optional. Called each time a file is added to the tree. It provides you the node, which **reflects** the fiven options, and its status returned by fs.stat (fs.lstat if `followLinks` option is enabled).
* __dirCallback__: Optional. Called each time a directory is added to the tree. It provides you the node, which **reflects** the fiven options, and its status returned by fs.lstat (fs.stat if `followLinks` option is enabled).

**Options parameters:**

* __stat__: Default value: `false`. If true every node of the result will contain `stat` property, provided by `fs.lstat` or `fs.stat`.
* __normalize__: Default value: `false`. If true, on windows, normalize each path replacing each backslash `\\` with a slash `/`.
* __symbolicLinks__: Default value: `true`. If true, all symbolic links found will be included in the result. Could not work on Windows.
* __followLinks__: Default value: `false`. If true, all symbolic links will be followed, including even their content if they link to a folder. Could not work on Windows.
* __sizeInBytes__: Default value: `true`. If true, every node in the result will contain `sizeInBytes` property as the number of bytes of the content. If a node is a folder, only its considered inner files will be computed to have this size.
* __size__: Default value: `true`. If true, every node in the result will contain `size` property. Same as `sizeInBytes`, but it is a string rounded to the second decimal digit and with an appropriate unit.
* __hash__: Default value: `true`. If true, every node in the result will contain `hash` property, computed by taking in consideration the name and the content of the node. If the node is a folder, all his considered inner files will be used by the algorithm.
* __hashAlgorithm__: Values: `md5`(default) and `sha1`. Hash algorithm used by `cryptojs` to return the hash.
* __hashEncoding__: Values: `hex`(default), `latin1` and `base64`. Hash encoding used by `cryptojs` to return the hash.
* __showHidden__: Default value: `true`. If true, all hidden files and dirs will be included in the result. A hidden file or a directory has a name which starts with a dot and in some systems like Linux are hidden.
* __depth__: Default value: `undefined`. It is a number which says the max depth the algorithm can reach scanning the given path. All files and dirs which are beyound the max depth will not be considered by the algorithm.
* __exclude__: Default value: `undefined`. It is a regex or array of regex and all the matched paths will not be considered by the algorithm.
* __extensions__: Default value: `undefined`. It is an array of strings and all the files whose extension is not included in that array will be skipped by the algorithm. If value is `undefined`, all file extensions will be considered, if it is `[]`, no files will be included.
* __emptyDirectory__: Default value: `false`. If value is `true`, the `isEmpty` property will be added in all the directory nodes in the result. Its value will be `true` if the directory contains no files and no directories, `false` otherwise.
* __excludeEmptyDirectories__: Default value: `false`. If value is `true`, all empty directories will be excluded from the result. Even directories which are not empty but all their children are excluded are excluded from the result because of other options will be considered empty.
* __skipErrors__: Default value: `true`. If true, folders whose user has not permissions will be skipped. An error will be thrown otherwise. Note: in fact every error thrown by `fs` calls will be ignored. Considere

**Result object parameters:**

* __name__: Always returned. The name of the node as a string.
* __path__: Always returned. The absolute path of the node.
* __relativePath__: Always returned. The relative path from the root of the node.
* __type__: Always returned. Values: `file` or `directory`.
* __isSymbolicLink__: Always returned. A boolean with true value if the node is a symbolic link.
* __sizeInBytes__: The size in bytes of the node, returned as a number.
* __size__: The size of the node, returned as a string rounded to two decimals and appropriate unit.
* __hash__: The hash of the node.
* __extension__: The extension (without dot) of the node. Returned only if the node is a file.
* __isEmpty__: A boolean with true value if the node is a directory containig no files and no directories.
* __stat__: The `fs.lstat` or `fs.fstat` of the node.
* __children__: An array of object structured like this one, containing all the children of the node.

This is also the structure of the callbacks' first parameter.

### scanAsync

**Syntax:**

`dree.scanAsync(path, options, fileCallback, dirCallback)`

**Description:**

Given a path, returns a promise to an object representing its directory tree. The result could be customized with options and a callback for either each file and each directory is provided. Executed asynchronously, it is the asynchronous analog of the `scan` function. See __Usage__ to have an example.

**Parameters:**

* __path__: Is of type `string`, and is the relative or absolute path the file or directory that you want to scan
* __options__: Optional. Is of type `object` and allows you to customize the function behaviour.
* __fileCallback__: Optional. Called each time a file is added to the tree. It provides you the node, which **reflects** the fiven options, and its status returned by fs.stat (fs.lstat if `followLinks` option is enabled).
* __dirCallback__: Optional. Called each time a directory is added to the tree. It provides you the node, which **reflects** the fiven options, and its status returned by fs.lstat (fs.stat if `followLinks` option is enabled).

**Options parameters:**

They are exactly the same of the `scan`'s function option parameters.

**Result object parameters:**

* __name__: Always returned. The name of the node as a string.
* __path__: Always returned. The absolute path of the node.
* __relativePath__: Always returned. The relative path from the root of the node.
* __type__: Always returned. Values: `file` or `directory`.
* __isSymbolicLink__: Always returned. A boolean with true value if the node is a symbolic link.
* __sizeInBytes__: The size in bytes of the node, returned as a number.
* __size__: The size of the node, returned as a string rounded to two decimals and appropriate unit.
* __hash__: The hash of the node.
* __extension__: The extension (without dot) of the node. Returned only if the node is a file.
* __isEmpty__: A boolean with true value if the node is a directory containig no files and no directories.
* __stat__: The `fs.lstat` or `fs.fstat` of the node.
* __children__: An array of object structured like this one, containing all the children of the node.

This is also the structure of the callbacks' first parameter.


### parse

**Syntax:**

`dree.parse(path, options)`

**Description:**

Given a path, returns a string representing its directory tree. The result could be customized with options. Executed synchronously. See __Usage__ to have an example.

**Parameters:**

* __path__: Is of type `string`, and is the relative or absolute path the file or directory that you want to parse
* __options__: Optional. Is of type `object` and allows you to customize the function behaviour.

**Options parameters:**

* __symbolicLinks__: Default value: `true`. If true, all symbolic links found will be included in the result. Could not work on Windows.
* __followLinks__: Default value: `false`. If true, all symbolic links will be followed, including even their content if they link to a folder. Could not work on Windows.
* __showHidden__: Default value: `true`. If true, all hidden files and dirs will be included in the result. A hidden file or a directory has a name which starts with a dot and in some systems like Linux are hidden.
* __depth__: Default value: `undefined`. It is a number which says the max depth the algorithm can reach scanning the given path. All files and dirs which are beyound the max depth will not be considered by the algorithm.
* __exclude__: Default value: `undefined`. It is a regex or array of regex and all the matched paths will not be considered by the algorithm.
* __extensions__: Default value: `undefined`. It is an array of strings and all the files whose extension is not included in that array will be skipped by the algorithm. If value is `undefined`, all file extensions will be considered, if it is `[]`, no files will be included.

**Result string:**

The result will be a string representing the Directory Tree of the path given as first parameter. Folders will be preceded by `>` and symbolic links by `>>`.

**Syntax:**

`dree.parseAsync(path, options)`

**Description:**

Given a path, returns a promise to a string representing its directory tree. The result could be customized with options. Executed asynchronously. See __Usage__ to have an example.

**Parameters:**

* __path__: Is of type `string`, and is the relative or absolute path the file or directory that you want to parse
* __options__: Optional. Is of type `object` and allows you to customize the function behaviour.

**Options parameters:**

They are exactly the same of the `parse`'s function options parameters.

**Result string:**

The result will be a promise to string representing the Directory Tree of the path given as first parameter. Folders will be preceded by `>` and symbolic links by `>>`.

### parseTree

**Syntax:**

`dree.parseTree(dirTree, options)`

**Description:**

The same as `parse`, but the first parameter is an object returned by `scan` function. Executed synchronously.

**Parameters:**

* __dirTree__: Is of type `object`, and is the object representing a Directory Tree that you want to parse into a string.
* __options__: Optional. Is of type `object` and allows you to customize the function behaviour. 

**Options parameters:**

Same parameters of `parse`, with one more parameter, `skipErrors`: is the same parameter in `scan` options.

**Result string:**

The result will be a string representing the Directory Tree of the object given as first parameter. Folders will be preceded by `>` and symbolic links by `>>`.

### parseTreeAsync

**Syntax:**

`dree.parseTreeAsync(dirTree, options)`

**Description:**

The same as `parseAsync`, but the first parameter is an object returned by `scan` function. Executed asynchronously.

**Parameters:**

* __dirTree__: Is of type `object`, and is the object representing a Directory Tree that you want to parse into a string.
* __options__: Optional. Is of type `object` and allows you to customize the function behaviour. 

**Options parameters:**

Same parameters of `parse`, with one more parameter, `skipErrors`: is the same parameter in `scan` options.

**Result string:**

The result will be a promise to string representing the Directory Tree of the object given as first parameter. Folders will be preceded by `>` and symbolic links by `>>`.

## Note

On **Windows** it could be possible that symbolic links are not detected, due to a problem with node fs module. If `symbolicLinks` is set to true, then `isSymbolicLink` could result `false` for al the tree nodes. In addition, if `followLinks` is set to true, it could be possible that links will not be followed instead.

The **callbacks** have a tree representation of the node and its stat as parameters. The tree parameter **reflects** the options given to `scan`. For example, if you set `hash` to `false`, then the tree parameter of a callback will not have the hash value. The stat parameter **depends** on the `followLinks` option. If it is true it will be the result of `fs.stat`, otherwise it will be the result of `fs.lstat`.

Properties as **hash** or **size** are computed considering only the **not filtered** nodes. For instance, the result size of a folder could be different from its actual size, if some of its inner files have not been considered due to filters as `exclude`.

The **hash** of two nodes with the same content could be **different**, because also the **name** is take in consideration.

In the **global** usage, if an option is given both in the command **args** and in the **options** json file, the **args** one is considered.

Executing the **asynchronous** version of `scan` could return a different object to the one returned by the synchronous one. This is why the asynchronous and synchronous versions read the directory in a **different** order.

## Build

To build the module make sure you have Typescript installed or install the dev dependencies. After this, run:

```bash
$ npm run transpile
```

The `source` folder will be compiled in the `dist` folder.

## Dev

To run tests go to the repository root using your CLI and run

```bash
$ npm test
```
Make sure you have the dev dependencies installed.
