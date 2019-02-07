import { resolve, basename, extname, relative } from 'path';
import { createHash, HexBase64Latin1Encoding } from 'crypto';
import { Stats, statSync, readdirSync, readFileSync } from 'fs';

export enum Type {
    DIRECTORY = 'directory',
    FILE = 'file'
}

export interface Dree {
    name: string;
    path: string;
    relativePath: string;
    type: Type;
    size?: string;
    hash?: string;
    extension?: string;
    stat?: Stats;
    children?: Dree[];
}

export interface Options {
    stat?: boolean;
    normalize?: boolean;
    size?: boolean;
    hash?: boolean;
    hashAlgorithm?: 'md5' | 'sha1';
    hashEncoding?: HexBase64Latin1Encoding;
    depth?: number;
    exclude?: RegExp | RegExp[];
    extensions?: string[];
}

const DEFAULT_OPTIONS: Options = {
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

function mergeOptions(options?: Options): Options {
    let result: Options = {};
    if(options) {
        for(const key in DEFAULT_OPTIONS) {
            result[key] = (options[key] != undefined) ? options[key] : DEFAULT_OPTIONS[key];
        }
    }
    else {
        result = DEFAULT_OPTIONS;
    }
    return result;
}

function parseSize(size?: string): number {
    let result: number;
    if(size) {
        result = +size.replace('B', '');
    }
    else {
        result = 0;
    }
    return result;
}

function _dree(root: string, path: string, depth: number, options: Options): Dree | null {

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
    const type = stat.isFile() ? Type.FILE : Type.DIRECTORY;
    
    let hash: any;
    if(options.hash){
        const hashAlgorithm = options.hashAlgorithm as string;
        hash = createHash(hashAlgorithm);
        hash.update(name);
    }

    const dirTree: Dree = {
        name: name,
        path: options.normalize ? path.replace(/\\/g, '/') : path,
        relativePath: relativePath,
        type: type,
        stat: options.stat ? stat : undefined
    };

    switch(type) {
        case Type.DIRECTORY:
            const children: Dree[] = [];
            readdirSync(path).forEach(file => {
                const child: Dree | null = _dree(root, resolve(path, file), depth + 1, options);
                if(child != null) {
                    children.push(child);
                }
            });
            if(children.length) {
                dirTree.children = children;
            }
            if(options.size) {
                dirTree.size = children.reduce((previous, current) => previous + parseSize(current.size), 0) + 'B';
            }
            break;
        case Type.FILE:
            dirTree.extension = extname(path).replace('.', '');
            if(options.extensions && options.extensions.indexOf(dirTree.extension) == -1) {
                return null;
            }
            if(options.size) {
                dirTree.size = stat.size + 'B';
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
    
    return dirTree;
}

/**
 * Retrurns the Directory Tree of a given path
 * @param  {string} path The path wich you want to inspect
 * @param  {object} options An object used as options of the function
 * @return {object} The directory tree as a Dree object
 */
export function dree(path: string, options?: Options): Dree {
    const root = resolve(path);
    return _dree(root, root, 0, mergeOptions(options)) as Dree;
}