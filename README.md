![Test](https://github.com/euberdeveloper/dree/workflows/Test/badge.svg)
![Build](https://github.com/euberdeveloper/dree/workflows/Build/badge.svg)
[![Coverage Status](https://coveralls.io/repos/github/euberdeveloper/dree/badge.svg?branch=main)](https://coveralls.io/github/euberdeveloper/dree?branch=main)
[![Codecov Status](https://codecov.io/gh/euberdeveloper/dree/branch/main/graph/badge.svg)](https://codecov.io/gh/euberdeveloper/dree)
[![Known Vulnerabilities](https://snyk.io/test/github/euberdeveloper/dree/badge.svg?targetFile=package.json)](https://snyk.io/test/github/euberdeveloper/dree?targetFile=package.json)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![License](https://img.shields.io/npm/l/dree.svg)](https://github.com/euberdeveloper/dree/blob/main/LICENSE)
[![Uptime Robot Day](https://badgen.net/uptime-robot/day/m784048696-57a1270a68a79b45e7e693d2)](https://badgen.net/uptime-robot/day/m784048696-57a1270a68a79b45e7e693d2)
[![GitHub issues](https://img.shields.io/github/issues/euberdeveloper/dree.svg)](https://github.com/euberdeveloper/dree/issues)
[![GitHub stars](https://img.shields.io/github/stars/euberdeveloper/dree.svg)](https://github.com/euberdeveloper/dree/stargazers)
![npm](https://img.shields.io/npm/v/dree.svg)
[![Average time to resolve an issue](https://isitmaintained.com/badge/resolution/euberdeveloper/dree.svg)](https://isitmaintained.com/project/euberdeveloper/dree)
[![Types](https://img.shields.io/npm/types/dree.svg)](https://www.npmjs.com/package/dree)
[![Test Coverage](https://api.codeclimate.com/v1/badges/55ea9114bc9bdeb44e77/test_coverage)](https://codeclimate.com/github/euberdeveloper/dree/test_coverage)

# dree
A nodejs module which helps you handle a directory tree. It provides you an object of a directory tree with custom configuration and optional callback method when a file or dir is scanned. You will also be able to turn the tree into a string representation. With Typescript support and both sync and async support.

## The name

A little explaination of the name **dree**: 

I chose it because it comes from the union of **D**irectory T**ree**.

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

With typescript and by changing the objects onDir and onFile:

```ts
import * as dree from 'dree';

interface CustomResult extends dree.Dree {
  description: string;
}

const options: dree.Options = {
  stat: false
};

const fileCallback: dree.Callback<CustomResult> = function (node, stat) {
  node.description = `${node.name} (${node.size})`;
};

const dirCallback: dree.Callback<CustomResult> = function (node, stat) {
  node.description = `${node.name} (${node.size})`;
};

const tree: CustomResult = dree.scan<CustomResult>('./folder', options, fileCallback, dirCallback);
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

### Get an object and print on stdout

```bash
$ dree scan <source>
```

This way the result will be printed on stdout

### Get an object and save in a file

```bash
$ dree scan <source> --dest ./output/result.json
```

This way the result will be saved in `./output/result.json`

### Get a string and print on stdout

```bash
$ dree parse <source>
```

This way the result will be printed on stdout

### Get a string and save in a file

```bash
$ dree parse <source> --dest ./output/result.txt
```

This way the result will be saved in `./output/result.txt`

### Log the result and save in a file

```bash
$ dree parse <source> --dest ./output/result.txt --show
```
With `--show` option, the result will also be printed with on stdout even if also saved in a file

### See all options

`scan` and `parse` accept the same options of their analog local functions. The options can be specified both as command arguments and json file.

```bash
$ dree --help --all-options
```

### Code completion

In case you wanted to add the code completion for cli commands, you can use the following command:

```bash
$ dree completion
```

It will output the code completion for your shell. You can then add it to your `.bashrc` or `.zshrc` file.

For instance, if you want to add it to your `.bashrc` file, you can do it like this:

```bash
$ dree completion >> ~/.bashrc
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

## Action

Based on this module the is the github action **[ga-dree](https://github.com/euberdeveloper/ga-dree)**, that allows you to keep a markdown representation of your directory tree updated in your repository's README.md file.

## API

### Online documentation

The documentation generated with **TypeDoc** is available in this **[site](https://dree.euberdeveloper.vercel.app/globals.html)**.
There is also a more specific version for development in this **[site](https://dree-dev.euberdeveloper.vercel.app/globals.html)**.

### scan

**Syntax:**

`dree.scan(path, options, fileCallback, dirCallback)`

**Description:**

Given a path, returns an object representing its directory tree. The result could be customized with options and a callback for either each file and each directory is provided. Executed synchronously. See __Usage__ to have an example.

**Parameters:**

* __path__: Is of type `string`, and is the relative or absolute path the file or directory that you want to scan
* __options__: Optional. Is of type `object` and allows you to customize the function behaviour.
* __fileCallback__: Optional. Called each time a file is added to the tree. It provides you the node, which **reflects** the given options, and its status returned by fs.stat (fs.lstat if `followLinks` option is enabled). Note that it can be used also to modify the node (only by extending it) and that there are generics typings for it.
* __dirCallback__: Optional. Called each time a directory is added to the tree. It provides you the node, which **reflects** the given options, and its status returned by fs.lstat (fs.stat if `followLinks` option is enabled). Note that it can be used also to modify the node (only by extending it) and that there are generics typings for it.

**Options parameters:**

* __stat__: Default value: `false`. If true every node of the result will contain `stat` property, provided by `fs.lstat` or `fs.stat`.
* __normalize__: Default value: `false`. If true, on windows, normalize each path replacing each backslash `\\` with a slash `/`.
* __symbolicLinks__: Default value: `true`. If true, all symbolic links found will be included in the result. Could not work on Windows.
* __followLinks__: Default value: `false`. If true, all symbolic links will be followed, including even their content if they link to a folder. Could not work on Windows.
* __sizeInBytes__: Default value: `true`. If true, every node in the result will contain `sizeInBytes` property as the number of bytes of the content. If a node is a folder, only its considered inner files will be computed to have this size.
* __size__: Default value: `true`. If true, every node in the result will contain `size` property. Same as `sizeInBytes`, but it is a string rounded to the second decimal digit and with an appropriate unit.
* __hash__: Default value: `true`. If true, every node in the result will contain `hash` property, computed by taking in consideration the name and the content of the node. If the node is a folder, all his considered inner files will be used by the algorithm.
* __hashAlgorithm__: Values: `md5`(default) and `sha1`. Hash algorithm used by `cryptojs` to return the hash.
* __hashEncoding__: Values: `hex`(default), `binary`, `base64url` and `base64`. Hash encoding used by `cryptojs` to return the hash.
* __showHidden__: Default value: `true`. If true, all hidden files and dirs will be included in the result. A hidden file or a directory has a name which starts with a dot and in some systems like Linux are hidden.
* __depth__: Default value: `undefined`. It is a number which says the max depth the algorithm can reach scanning the given path. All files and dirs which are beyound the max depth will not be considered by the algorithm.
* __exclude__: Default value: `undefined`. It is a regex, string (glob patterns) or array of them and all the matched paths will not be considered by the algorithm.
* __matches__: Default value: `undefined`. It is a regex, string (glob patterns) or array of them and all the non-matching paths will not be considered by the algorithm. Note: All the ancestors of a matching node will be added.
* __extensions__: Default value: `undefined`. It is an array of strings and all the files whose extension is not included in that array will be skipped by the algorithm. If value is `undefined`, all file extensions will be considered, if it is `[]`, no files will be included.
* __emptyDirectory__: Default value: `false`. If value is `true`, the `isEmpty` property will be added in all the directory nodes in the result. Its value will be `true` if the directory contains no files and no directories, `false` otherwise.
* __excludeEmptyDirectories__: Default value: `false`. If value is `true`, all empty directories will be excluded from the result. Even directories which are not empty but all their children are excluded are excluded from the result because of other options will be considered empty.
* __descendants__: Default value `false`. If true, also the number of descendants of each node will be added to the result.
* __descendantsIgnoreDirectories__: Default value `false`. If true, only files will be count as descendants of a node. It does not have effect if descendants option is not true.
* __sorted__: Default value: `false`. If true, directories and files will be scanned ordered by path. The value can be both boolean for default alpha order, a custom sorting function or a predefined sorting method in SortMethodPredefined.
* __postSorted__: Default value: `false`. If true, the child nodes of a node will be ordered. The value can be both boolean for default alpha order, a custom sorting function or a predefined sorting method in PostSortMethodPredefined.
* __homeShortcut__: Default value: `false`. If true, the unix homedir shortcut ~ will be expanded to the user home directory.
* __skipErrors__: Default value: `true`. If true, folders whose user has not permissions will be skipped. An error will be thrown otherwise. Note: in fact every error thrown by `fs` calls will be ignored.

**SortMethodPredefined enum:**

In Javascript it is an object, in Typescript an enum, whose values are used to determine how the paths should be sorted.

* __ALPHABETICAL__: Alphabetical order.
* __ALPHABETICAL_REVERSE__: Alphabetical order, reversed.
* __ALPHABETICAL_INSENSITIVE__: Alphabetical order, case insensitive.
* __ALPHABETICAL_INSENSITIVE_REVERSE__: Alphabetical order, reversed, case insensitive.

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
* __descendants__: The number of descendants of the node. Returned only if the node is a directory and descendants option is specified.
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
* __fileCallback__: Optional. Called each time a file is added to the tree. It provides you the node, which **reflects** the given options, and its status returned by fs.stat (fs.lstat if `followLinks` option is enabled). The callback can be an **async function**. Note that it can be used also to modify the node (only by extending it) and that there are generics typings for it.
* __dirCallback__: Optional. Called each time a directory is added to the tree. It provides you the node, which **reflects** the given options, and its status returned by fs.lstat (fs.stat if `followLinks` option is enabled). The callback can be an **async function**. Note that it can be used also to modify the node (only by extending it) and that there are generics typings for it.

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
* __descendants__: The number of descendants of the node. Returned only if the node is a directory and descendants option is specified.
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
* __exclude__: Default value: `undefined`. It is a regex, string (glob patterns) or array of them and all the matched paths will not be considered by the algorithm.
* __extensions__: Default value: `undefined`. It is an array of strings and all the files whose extension is not included in that array will be skipped by the algorithm. If value is `undefined`, all file extensions will be considered, if it is `[]`, no files will be included.
* __sorted__: Default value: `undefined`. If true, directories and files will be scanned ordered by path. The value can be both boolean for default alpha order, a custom sorting function or a predefined sorting method in SortMethodPredefined.
* __homeShortcut__: Default value: `false`. If true, the unix homedir shortcut ~ will be expanded to the user home directory.
* __skipErrors__: Default value: `true`. If true, folders whose user has not permissions will be skipped. An error will be thrown otherwise. Note: in fact every error thrown by `fs` calls will be ignored.

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

The **callbacks** for `scanAsync` can return a promise, hence **async callbacks** are supported.

Properties as **hash** or **size** are computed considering only the **not filtered** nodes. For instance, the result size of a folder could be different from its actual size, if some of its inner files have not been considered due to filters as `exclude`.

The **hash** of two nodes with the same content could be **different**, because also the **name** is take in consideration.

In the **global** usage, if an option is given both in the command **args** and in the **options** json file, the **args** one is considered.

Executing the **asynchronous** version of `scan` could return a different object to the one returned by the synchronous one. This is why the asynchronous and synchronous versions read the directory in a **different** order.

## Project structure

[//]: # (dree - BEGIN)
Made with [dree](https://github.com/marketplace/actions/ga-dree)


```
dree
 ├── .env.example
 ├── .release-it.json
 ├── CHANGELOG.md
 ├── CODE_OF_CONDUCT.md
 ├── CONTRIBUTING.md
 ├── LICENSE
 ├── README.md
 ├── build.mjs
 ├── build.test.mjs
 ├─> docs
 │   └─> tree
 │       └── dree.config.json
 ├── package.json
 ├── pnpm-lock.yaml
 ├─> scripts
 │   └── generate-expected-tests-results.js
 ├─> source
 │   ├─> bin
 │   │   ├── index.ts
 │   │   └── shims.d.ts
 │   ├─> lib
 │   │   └── index.ts
 │   └── tsconfig.json
 ├─> test
 │   ├── .gitignore
 │   ├─> parse
 │   ├─> parseTree
 │   ├─> sample
 │   ├─> scan
 │   └── test.js
 ├── typedoc.cjs
 └── typedoc.dev.cjs
```
[//]: # (dree - END)


## Development

Make sure that you have all the dependencies installed

### Transpile

To transpile the typescript code

```bash
$ npm run transpile
```

The transpiled code will be in the `dist` folder.

### Bundle

To bundle the library with esbuild:

```bash
$ npm run bundle
```

The bundled code will be in the `bundled` folder.

### Test

After having transpiled the code:

```bash
$ npm test
```

The tests with mocha will be run.
