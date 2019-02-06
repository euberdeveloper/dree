"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const crypto_1 = require("crypto");
const fs_1 = require("fs");
var Type;
(function (Type) {
    Type["DIRECTORY"] = "directory";
    Type["FILE"] = "file";
})(Type = exports.Type || (exports.Type = {}));
function _dree(root, path) {
    const relativePath = (root == path) ? '.' : path_1.relative(root, path);
    const name = path_1.basename(path);
    const stat = fs_1.statSync(path);
    const type = stat.isFile() ? Type.FILE : Type.DIRECTORY;
    const hash = crypto_1.createHash('md5');
    hash.update(name);
    const dirTree = {
        name: name,
        path: path,
        relativePath: relativePath,
        type: type,
        size: '',
        stat: stat
    };
    switch (type) {
        case Type.DIRECTORY:
            const children = [];
            fs_1.readdirSync(path).forEach(file => children.push(_dree(root, path_1.resolve(path, file))));
            if (children.length) {
                dirTree.children = children;
            }
            break;
        case Type.FILE:
            const data = fs_1.readFileSync(path);
            hash.update(data);
            dirTree.extension = path_1.extname(path);
            break;
    }
    dirTree.hash = hash.digest('hex');
    return dirTree;
}
function dree(root) {
    const path = path_1.resolve(root);
    return _dree(path, path);
}
exports.dree = dree;
