"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = require("path");
var crypto_1 = require("crypto");
var fs_1 = require("fs");
/* DREE TYPES */
/**
 * Enum whose values are DIRECTORY or FILE
 */
var Type;
(function (Type) {
    Type["DIRECTORY"] = "directory";
    Type["FILE"] = "file";
})(Type = exports.Type || (exports.Type = {}));
/* DEFAULT OPTIONS */
var SCAN_DEFAULT_OPTIONS = {
    stat: false,
    normalize: false,
    symbolicLinks: true,
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
var PARSE_DEFAULT_OPTIONS = {
    symbolicLinks: true,
    followLinks: false,
    showHidden: true,
    depth: undefined,
    exclude: undefined,
    extensions: undefined
};
/* SUPPORT FUNCTIONS */
function mergeScanOptions(options) {
    var result = {};
    if (options) {
        for (var key in SCAN_DEFAULT_OPTIONS) {
            result[key] = (options[key] !== undefined) ? options[key] : SCAN_DEFAULT_OPTIONS[key];
        }
        if (result.depth < 0) {
            result.depth = 0;
        }
    }
    else {
        result = SCAN_DEFAULT_OPTIONS;
    }
    return result;
}
function mergeParseOptions(options) {
    var result = {};
    if (options) {
        for (var key in PARSE_DEFAULT_OPTIONS) {
            result[key] = (options[key] !== undefined) ? options[key] : PARSE_DEFAULT_OPTIONS[key];
        }
        if (result.depth < 0) {
            result.depth = 0;
        }
    }
    else {
        result = PARSE_DEFAULT_OPTIONS;
    }
    return result;
}
function parseSize(size) {
    var units = ['B', 'KB', 'MB', 'GB', 'TB'];
    var i;
    for (i = 0; i < units.length && size > 1000; i++) {
        size /= 1000;
    }
    return Math.round(size * 100) / 100 + ' ' + units[i];
}
function _scan(root, path, depth, options, onFile, onDir) {
    if (options.depth !== undefined && depth > options.depth) {
        return null;
    }
    if (options.exclude && root !== path) {
        var excludes = (options.exclude instanceof RegExp) ? [options.exclude] : options.exclude;
        if (excludes.some(function (pattern) { return pattern.test(path); })) {
            return null;
        }
    }
    var relativePath = (root === path) ? '.' : path_1.relative(root, path);
    var name = path_1.basename(path);
    var stat = fs_1.statSync(path);
    var lstat = fs_1.lstatSync(path);
    var symbolicLink = lstat.isSymbolicLink();
    var type = stat.isFile() ? Type.FILE : Type.DIRECTORY;
    if (!options.showHidden && name.charAt(0) === '.') {
        return null;
    }
    if (!options.symbolicLinks && symbolicLink) {
        return null;
    }
    var hash;
    if (options.hash) {
        var hashAlgorithm = options.hashAlgorithm;
        hash = crypto_1.createHash(hashAlgorithm);
        hash.update(name);
    }
    var dirTree = {
        name: name,
        path: options.normalize ? path.replace(/\\/g, '/') : path,
        relativePath: options.normalize ? relativePath.replace(/\\/g, '/') : relativePath,
        type: type,
        isSymbolicLink: symbolicLink,
        stat: options.stat ? (options.followLinks ? stat : lstat) : undefined
    };
    switch (type) {
        case Type.DIRECTORY:
            var children_1 = [];
            fs_1.readdirSync(path).forEach(function (file) {
                var child = _scan(root, path_1.resolve(path, file), depth + 1, options, onFile, onDir);
                if (child !== null) {
                    children_1.push(child);
                }
            });
            if (options.sizeInBytes || options.size) {
                var size = children_1.reduce(function (previous, current) { return previous + current.sizeInBytes; }, 0);
                dirTree.sizeInBytes = size;
                dirTree.size = options.size ? parseSize(size) : undefined;
                if (!options.sizeInBytes) {
                    children_1.forEach(function (child) { return child.sizeInBytes = undefined; });
                }
            }
            if (options.hash) {
                var hashEncoding = options.hashEncoding;
                dirTree.hash = hash.digest(hashEncoding);
            }
            if (children_1.length) {
                dirTree.children = children_1;
            }
            break;
        case Type.FILE:
            dirTree.extension = path_1.extname(path).replace('.', '');
            if (options.extensions && options.extensions.indexOf(dirTree.extension) === -1) {
                return null;
            }
            if (options.sizeInBytes || options.size) {
                var size = (options.followLinks ? stat.size : lstat.size);
                dirTree.sizeInBytes = size;
                dirTree.size = options.size ? parseSize(size) : undefined;
            }
            if (options.hash) {
                var data = fs_1.readFileSync(path);
                hash.update(data);
                var hashEncoding = options.hashEncoding;
                dirTree.hash = hash.digest(hashEncoding);
            }
            break;
        default:
            return null;
    }
    if (onFile && type === Type.FILE) {
        onFile(dirTree, options.followLinks ? stat : lstat);
    }
    else if (onDir && type === Type.DIRECTORY) {
        onDir(dirTree, options.followLinks ? stat : lstat);
    }
    return dirTree;
}
function skip(child, options, depth) {
    return (!options.symbolicLinks && child.isSymbolicLink)
        || (!options.showHidden && child.name.charAt(0) === '.')
        || (options.extensions !== undefined && child.type === Type.FILE
            && (options.extensions.indexOf(child.extension) === -1))
        || (options.exclude instanceof RegExp && options.exclude.test(child.path))
        || (Array.isArray(options.exclude) && options.exclude.some(function (pattern) { return pattern.test(child.path); }))
        || (options.depth !== undefined && depth > options.depth);
}
function _parse(children, prefix, options, depth) {
    var result = '';
    var lines = children.map(function (child, index) {
        var result = '';
        if (options.depth !== undefined && depth > options.depth) {
            return '';
        }
        if (options.exclude) {
            var excludes = (options.exclude instanceof RegExp) ? [options.exclude] : options.exclude;
            if (excludes.some(function (pattern) { return pattern.test(child); })) {
                return '';
            }
        }
        var name = path_1.basename(child);
        var stat = fs_1.statSync(child);
        var lstat = fs_1.lstatSync(child);
        var symbolicLink = lstat.isSymbolicLink();
        var type = stat.isFile() ? Type.FILE : Type.DIRECTORY;
        if (!options.showHidden && name.charAt(0) === '.') {
            return '';
        }
        if (!options.symbolicLinks && symbolicLink) {
            return '';
        }
        var extension = path_1.extname(child).replace('.', '');
        if (options.extensions && type === Type.FILE && options.extensions.indexOf(extension) === -1) {
            return '';
        }
        var last = symbolicLink ? '>>' : (type === Type.DIRECTORY ? '─> ' : '── ');
        var newPrefix = prefix + (index === children.length - 1 ? '    ' : '│   ');
        result += last + name;
        if ((options.followLinks || !symbolicLink) && type === Type.DIRECTORY) {
            var children_2 = fs_1.readdirSync(child).map(function (file) { return path_1.resolve(child, file); });
            result += children_2.length ? _parse(children_2, newPrefix, options, depth + 1) : '';
        }
        return result;
    });
    lines.filter(function (line) { return !!line; }).forEach(function (line, index, lines) {
        result += prefix + (index === lines.length - 1 ? '└' + line : '├' + line);
    });
    return result;
}
function _parseTree(children, prefix, options, depth) {
    var result = '';
    children.filter(function (child) { return !skip(child, options, depth); }).forEach(function (child, index, children) {
        var last = child.isSymbolicLink ? '>>' : (child.type === Type.DIRECTORY ? '─> ' : '── ');
        var line = (index === children.length - 1) ? '└' + last : '├' + last;
        var newPrefix = prefix + (index === children.length - 1 ? '    ' : '│   ');
        result += prefix + line + child.name;
        result += (child.children && (options.followLinks || !child.isSymbolicLink) ? _parseTree(child.children, newPrefix, options, depth + 1) : '');
    });
    return result;
}
/* EXPORTED FUNCTIONS */
/**
 * Retrurns the Directory Tree of a given path
 * @param  {string} path The path wich you want to inspect
 * @param  {object} options An object used as options of the function
 * @param  {function} onFile A function called when a file is added - has the tree object and its stat as parameters
 * @param  {function} onDir A function called when a dir is added - has the tree object and its stat as parameters
 * @return {object} The directory tree as a Dree object
 */
function scan(path, options, onFile, onDir) {
    var root = path_1.resolve(path);
    var opt = mergeScanOptions(options);
    var result = _scan(root, root, 0, opt, onFile, onDir);
    result.sizeInBytes = opt.sizeInBytes ? result.sizeInBytes : undefined;
    return result;
}
exports.scan = scan;
/**
 * Retrurns a string representation of a Directory Tree given a path to a directory or file
 * @param  {string} dirTree The path wich you want to inspect
 * @param  {object} options An object used as options of the function
 * @return {string} A string representing the Directory Tree of the given path
 */
function parse(path, options) {
    var result = '';
    var root = path_1.resolve(path);
    var opt = mergeParseOptions(options);
    var name = path_1.basename(root);
    result += name;
    var stat = fs_1.statSync(path);
    var lstat = fs_1.lstatSync(path);
    var symbolicLink = lstat.isSymbolicLink();
    if ((opt.followLinks || !symbolicLink) && stat.isDirectory()) {
        var children = fs_1.readdirSync(root).map(function (file) { return path_1.resolve(root, file); });
        result += children.length ? _parse(children, '\n ', opt, 1) : '';
    }
    return result;
}
exports.parse = parse;
/**
 * Retrurns a string representation of a Directory Tree given an object returned from scan
 * @param  {object} dirTree The object returned from scan, wich will be parsed
 * @param  {object} options An object used as options of the function
 * @return {string} A string representing the object given as first parameter
 */
function parseTree(dirTree, options) {
    var result = '';
    var opt = mergeParseOptions(options);
    result += dirTree ? dirTree.name : '';
    result += (dirTree.children ? _parseTree(dirTree.children, '\n ', opt, 1) : '');
    return result;
}
exports.parseTree = parseTree;
