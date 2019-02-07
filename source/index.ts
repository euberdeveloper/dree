import { resolve, basename, extname, relative } from 'path';
import { createHash, HexBase64Latin1Encoding } from 'crypto';
import { Stats, statSync, readdirSync, readFileSync, lstatSync } from 'fs';

export enum Type {
    DIRECTORY = 'directory',
    FILE = 'file'
}

export interface Dree {
    name: string;
    path: string;
    relativePath: string;
    type: Type;
    isSymbolicLink: boolean;
    sizeInBytes?: number;
    size?: string;
    hash?: string;
    extension?: string;
    stat?: Stats;
    children?: Dree[];
}

export interface Options {
    stat?: boolean;
    normalize?: boolean;
    symbolicLinks?: boolean;
    followLinks?: boolean;
    sizeInBytes?: boolean;
    size?: boolean;
    hash?: boolean;
    hashAlgorithm?: 'md5' | 'sha1';
    hashEncoding?: HexBase64Latin1Encoding;
    showHidden?: boolean;
    depth?: number;
    exclude?: RegExp | RegExp[];
    extensions?: string[];
}

export type Callback = (dirTree: Dree, stat: Stats) => void;

const DEFAULT_OPTIONS: Options = {
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

function mergeOptions(options?: Options): Options {
    let result: Options = {};
    if(options) {
        for(const key in DEFAULT_OPTIONS) {
            result[key] = (options[key] != undefined) ? options[key] : DEFAULT_OPTIONS[key];
        }
        if(result.depth as number < 0) {
            result.depth = 0;
        }
    }
    else {
        result = DEFAULT_OPTIONS;
    }
    return result;
}

function parseSize(size: number): string {
    const units = [ 'B', 'KB', 'MB', 'GB', 'TB' ];
    let i: number;
    for(i = 0; i < units.length && size > 1000; i++) {
        size /= 1000;
    }
    return size + ' ' + units[i];
}

function _dree(root: string, path: string, depth: number, options: Options, onFile?: Callback, onDir?: Callback): Dree | null {

    if(options.depth && depth > options.depth) {
        return null;
    }

    if(options.exclude && root != path) {
        const excludes = (options.exclude instanceof RegExp) ? [options.exclude] : options.exclude;
        if(excludes.some(pattern => pattern.test(path))) {
            return null;
        }
    }

    const relativePath = (root == path) ? '.' : relative(root, path);
    const name = basename(path);
    const stat = statSync(path);
    const lstat = lstatSync(path);
    const symbolicLink = lstat.isSymbolicLink();
    const type = stat.isFile() ? Type.FILE : Type.DIRECTORY;

    if(!options.showHidden && name.charAt(0) === '.') {
        return null;
    }
    if(!options.symbolicLinks && symbolicLink) {
        return null;
    }
    
    let hash: any;
    if(options.hash){
        const hashAlgorithm = options.hashAlgorithm as string;
        hash = createHash(hashAlgorithm);
        hash.update(name);
    }

    const dirTree: Dree = {
        name: name,
        path: options.normalize ? path.replace(/\\/g, '/') : path,
        relativePath: options.normalize ? relativePath.replace(/\\/g, '/') : relativePath,
        type: type,
        isSymbolicLink: symbolicLink,
        stat: options.stat ? (options.followLinks ? stat : lstat) : undefined
    };

    switch(type) {
        case Type.DIRECTORY:
            const children: Dree[] = [];
            readdirSync(path).forEach(file => {
                const child: Dree | null = _dree(root, resolve(path, file), depth + 1, options, onFile, onDir);
                if(child != null) {
                    children.push(child);
                }
            });
            if(children.length) {
                dirTree.children = children;
            }
            if(options.sizeInBytes || options.size) {
                const size = children.reduce((previous, current) => previous + (current.sizeInBytes as number), 0);
                dirTree.sizeInBytes = options.sizeInBytes ? size : undefined;
                dirTree.size = options.size ? parseSize(size) : undefined;
            }
            break;
        case Type.FILE:
            dirTree.extension = extname(path).replace('.', '');
            if(options.extensions && options.extensions.indexOf(dirTree.extension) == -1) {
                return null;
            }
            if(options.sizeInBytes || options.size) {
                const size = (options.followLinks ? stat.size : lstat.size);
                dirTree.sizeInBytes = options.sizeInBytes ? size : undefined;
                dirTree.size = options.size ? parseSize(size) : undefined;
            }
            if(options.hash) {
                const data = readFileSync(path);
                hash.update(data);
            }
            break;
        default:
            return null;
    } 

    if(options.hash) {
        const hashEncoding = options.hashEncoding as HexBase64Latin1Encoding;
        dirTree.hash = hash.digest(hashEncoding);
    }

    if(onFile && type == Type.FILE) {
        onFile(dirTree, options.followLinks ? stat : lstat);
    }
    else if(onDir && type == Type.DIRECTORY) {
        onDir(dirTree, options.followLinks ? stat : lstat);
    }

    return dirTree;
}

/**
 * Retrurns the Directory Tree of a given path
 * @param  {string} path The path wich you want to inspect
 * @param  {object} options An object used as options of the function
 * @return {object} The directory tree as a Dree object
 */
export function dree(path: string, options?: Options, onFile?: Callback, onDir?: Callback): Dree {
    const root = resolve(path);
    return _dree(root, root, 0, mergeOptions(options), onFile, onDir) as Dree;
}