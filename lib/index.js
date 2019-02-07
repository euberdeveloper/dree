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
const DEFAULT_OPTIONS = {
    stat: false,
    normalize: false,
    size: true,
    hash: true,
    hashAlgorithm: 'md5',
    hashEncoding: 'hex',
    depth: undefined,
    exclude: undefined,
    extensions: undefined
};
function mergeOptions(options) {
    let result = {};
    if (options) {
        for (const key in DEFAULT_OPTIONS) {
            result[key] = (options[key] != undefined) ? options[key] : DEFAULT_OPTIONS[key];
        }
    }
    else {
        result = DEFAULT_OPTIONS;
    }
    return result;
}
function parseSize(size) {
    let result;
    if (size) {
        result = +size.replace('B', '');
    }
    else {
        result = 0;
    }
    return result;
}
function _dree(root, path, depth, options) {
    if (options.depth && depth > options.depth) {
        return null;
    }
    if (options.exclude && root != path) {
        const excludes = (options.exclude instanceof RegExp) ? [options.exclude] : options.exclude;
        if (excludes.some(pattern => pattern.test(path))) {
            return null;
        }
    }
    const relativePath = (root == path) ? '.' : path_1.relative(root, path);
    const name = path_1.basename(path);
    const stat = fs_1.statSync(path);
    const type = stat.isFile() ? Type.FILE : Type.DIRECTORY;
    let hash;
    if (options.hash) {
        const hashAlgorithm = options.hashAlgorithm;
        hash = crypto_1.createHash(hashAlgorithm);
        hash.update(name);
    }
    const dirTree = {
        name: name,
        path: options.normalize ? path.replace(/\\/g, '/') : path,
        relativePath: relativePath,
        type: type,
        stat: options.stat ? stat : undefined
    };
    switch (type) {
        case Type.DIRECTORY:
            const children = [];
            fs_1.readdirSync(path).forEach(file => {
                const child = _dree(root, path_1.resolve(path, file), depth + 1, options);
                if (child != null) {
                    children.push(child);
                }
            });
            if (children.length) {
                dirTree.children = children;
            }
            if (options.size) {
                dirTree.size = children.reduce((previous, current) => previous + parseSize(current.size), 0) + 'B';
            }
            break;
        case Type.FILE:
            dirTree.extension = path_1.extname(path).replace('.', '');
            if (options.extensions && options.extensions.indexOf(dirTree.extension) == -1) {
                return null;
            }
            if (options.size) {
                dirTree.size = stat.size + 'B';
            }
            if (options.hash) {
                const data = fs_1.readFileSync(path);
                hash.update(data);
            }
            break;
        default:
            return null;
    }
    if (options.hash) {
        const hashEncoding = options.hashEncoding;
        dirTree.hash = hash.digest(hashEncoding);
    }
    return dirTree;
}
/**
 * Retrurns the Directory Tree of a given path
 * @param  {string} path The path wich you want to inspect
 * @param  {object} options An object used as options of the function
 * @return {object} The directory tree as a Dree object
 */
function dree(path, options) {
    const root = path_1.resolve(path);
    return _dree(root, root, 0, mergeOptions(options));
}
exports.dree = dree;
