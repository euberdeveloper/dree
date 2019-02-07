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
    symbolicLinks: false,
    followLinks: false,
    sizeInBytes: true,
    size: true,
    hash: true,
    hashAlgorithm: 'md5',
    hashEncoding: 'hex',
    showHidden: true,
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
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let i;
    for (i = 0; i < units.length && size > 1000; i++) {
        size /= 1000;
    }
    return size + ' ' + units[i];
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
    const lstat = fs_1.lstatSync(path);
    const symbolicLink = lstat.isSymbolicLink();
    const type = stat.isFile() ? Type.FILE : Type.DIRECTORY;
    if (!options.showHidden && name.charAt(0) === '.') {
        return null;
    }
    if (!options.symbolicLinks && symbolicLink) {
        return null;
    }
    let hash;
    if (options.hash) {
        const hashAlgorithm = options.hashAlgorithm;
        hash = crypto_1.createHash(hashAlgorithm);
        hash.update(name);
    }
    const dirTree = {
        name: name,
        path: options.normalize ? path.replace(/\\/g, '/') : path,
        relativePath: options.normalize ? relativePath.replace(/\\/g, '/') : relativePath,
        type: type,
        isSymbolicLink: symbolicLink,
        stat: options.stat ? (options.followLinks ? stat : lstat) : undefined
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
            if (options.sizeInBytes || options.size) {
                const size = children.reduce((previous, current) => previous + current.sizeInBytes, 0);
                dirTree.sizeInBytes = options.sizeInBytes ? size : undefined;
                dirTree.size = options.size ? parseSize(size) : undefined;
            }
            break;
        case Type.FILE:
            dirTree.extension = path_1.extname(path).replace('.', '');
            if (options.extensions && options.extensions.indexOf(dirTree.extension) == -1) {
                return null;
            }
            if (options.sizeInBytes || options.size) {
                const size = (options.followLinks ? stat.size : lstat.size);
                dirTree.sizeInBytes = options.sizeInBytes ? size : undefined;
                dirTree.size = options.size ? parseSize(size) : undefined;
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
