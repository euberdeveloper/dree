import { resolve, basename, extname, relative } from 'path';
import { createHash } from 'crypto';
import { statSync, readdirSync, readFileSync, lstatSync } from 'fs';

/* DECLARATION OF @types/crypto AND @types/fs NEEDED TO AVOID @types/node DEPENDENCY */

declare type HexBase64Latin1Encoding = "latin1" | "hex" | "base64";
declare class Stats {
    isFile(): boolean;
    isDirectory(): boolean;
    isBlockDevice(): boolean;
    isCharacterDevice(): boolean;
    isSymbolicLink(): boolean;
    isFIFO(): boolean;
    isSocket(): boolean;
    dev: number;
    ino: number;
    mode: number;
    nlink: number;
    uid: number;
    gid: number;
    rdev: number;
    size: number;
    blksize: number;
    blocks: number;
    atimeMs: number;
    mtimeMs: number;
    ctimeMs: number;
    birthtimeMs: number;
    atime: Date;
    mtime: Date;
    ctime: Date;
    birthtime: Date;
}

/* DREE TYPES */

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

export interface ScanOptions {
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

export interface ParseOptions {
    symbolicLinks?: boolean;
    followLinks?: boolean;
    showHidden?: boolean;
    depth?: number;
    exclude?: RegExp | RegExp[];
    extensions?: string[];
}

export type Callback = (dirTree: Dree, stat: Stats) => void;

/* DEFAULT OPTIONS */

const SCAN_DEFAULT_OPTIONS: ScanOptions = {
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

const PARSE_DEFAULT_OPTIONS: ParseOptions = {
    symbolicLinks: true,
    followLinks: false,
    showHidden: true,
    depth: undefined,
    exclude: undefined,
    extensions: undefined
};

/* SUPPORT FUNCTIONS */

function mergeScanOptions(options?: ScanOptions): ScanOptions {
    let result: ScanOptions = {};
    if(options) {
        for(const key in SCAN_DEFAULT_OPTIONS) {
            result[key] = (options[key] !== undefined) ? options[key] : SCAN_DEFAULT_OPTIONS[key];
        }
        if(result.depth as number < 0) {
            result.depth = 0;
        }
    }
    else {
        result = SCAN_DEFAULT_OPTIONS;
    }
    return result;
}

function mergeParseOptions(options?: ParseOptions): ParseOptions {
    let result: ParseOptions = {};
    if(options) {
        for(const key in PARSE_DEFAULT_OPTIONS) {
            result[key] = (options[key] !== undefined) ? options[key] : PARSE_DEFAULT_OPTIONS[key];
        }
        if(result.depth as number < 0) {
            result.depth = 0;
        }
    }
    else {
        result = PARSE_DEFAULT_OPTIONS;
    }
    return result;
}

function parseSize(size: number): string {
    const units = [ 'B', 'KB', 'MB', 'GB', 'TB' ];
    let i: number;
    for(i = 0; i < units.length && size > 1000; i++) {
        size /= 1000;
    }
    return Math.round(size * 100) / 100 + ' ' + units[i];
}

function _scan(root: string, path: string, depth: number, options: ScanOptions, onFile?: Callback, onDir?: Callback): Dree | null {

    if(options.depth !== undefined && depth > options.depth) {
        return null;
    }

    if(options.exclude && root !== path) {
        const excludes = (options.exclude instanceof RegExp) ? [options.exclude] : options.exclude;
        if(excludes.some(pattern => pattern.test(path))) {
            return null;
        }
    }

    const relativePath = (root === path) ? '.' : relative(root, path);
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
                const child: Dree | null = _scan(root, resolve(path, file), depth + 1, options, onFile, onDir);
                if(child !== null) {
                    children.push(child);
                }
            });
            if(options.sizeInBytes || options.size) {
                const size = children.reduce((previous, current) => previous + (current.sizeInBytes as number), 0);
                dirTree.sizeInBytes = size;
                dirTree.size = options.size ? parseSize(size) : undefined;
                if(!options.sizeInBytes) {
                    children.forEach(child => child.sizeInBytes = undefined);
                }
            }
            if(options.hash) {
                const hashEncoding = options.hashEncoding as HexBase64Latin1Encoding;
                dirTree.hash = hash.digest(hashEncoding);
            }
            if(children.length) {
                dirTree.children = children;
            }
            break;
        case Type.FILE:
            dirTree.extension = extname(path).replace('.', '');
            if(options.extensions && options.extensions.indexOf(dirTree.extension) === -1) {
                return null;
            }
            if(options.sizeInBytes || options.size) {
                const size = (options.followLinks ? stat.size : lstat.size);
                dirTree.sizeInBytes = size;
                dirTree.size = options.size ? parseSize(size) : undefined;
            }
            if(options.hash) {
                const data = readFileSync(path);
                hash.update(data);
                const hashEncoding = options.hashEncoding as HexBase64Latin1Encoding;
                dirTree.hash = hash.digest(hashEncoding);
            }
            break;
        default:
            return null;
    } 

    if(onFile && type === Type.FILE) {
        onFile(dirTree, options.followLinks ? stat : lstat);
    }
    else if(onDir && type === Type.DIRECTORY) {
        onDir(dirTree, options.followLinks ? stat : lstat);
    }

    return dirTree;
}

function skip(child: Dree, options: ParseOptions, depth: number): boolean {
    return (!options.symbolicLinks && child.isSymbolicLink) 
    || (!options.showHidden && child.name.charAt(0) === '.') 
    || (options.extensions !== undefined && child.type === Type.FILE
        && (options.extensions.indexOf(child.extension as string) === -1)) 
    || (options.exclude instanceof RegExp && options.exclude.test(child.path)) 
    || (Array.isArray(options.exclude) && options.exclude.some(pattern => pattern.test(child.path))) 
    || (options.depth !== undefined && depth > options.depth); 
}

function _parse(children: string[], prefix: string, options: ParseOptions, depth: number): string {
    let result = '';
    const lines = children.map((child, index) => {
        let result = '';

        if(options.depth !== undefined && depth > options.depth) {
            return '';
        }
    
        if(options.exclude) {
            const excludes = (options.exclude instanceof RegExp) ? [options.exclude] : options.exclude;
            if(excludes.some(pattern => pattern.test(child))) {
                return '';
            }
        }
    
        const name = basename(child);
        const stat = statSync(child);
        const lstat = lstatSync(child);
        const symbolicLink = lstat.isSymbolicLink();
        const type = stat.isFile() ? Type.FILE : Type.DIRECTORY;
    
        if(!options.showHidden && name.charAt(0) === '.') {
            return '';
        }
        if(!options.symbolicLinks && symbolicLink) {
            return '';
        }
        const extension = extname(child).replace('.', '');
        if(options.extensions && type === Type.FILE && options.extensions.indexOf(extension) === -1) {
            return '';
        }

        const last = symbolicLink ? '>>' : (type === Type.DIRECTORY ? '─> ' : '── ');
        const newPrefix = prefix + (index === children.length - 1 ?  '    ' : '│   ');
        result += last + name;

        if((options.followLinks || !symbolicLink) && type === Type.DIRECTORY) {
            const children = readdirSync(child).map(file => resolve(child, file));
            result += children.length ? _parse(children, newPrefix, options, depth + 1) : '';
        }

        return result;
    });
    lines.filter(line => !!line).forEach((line, index, lines) => {
        result += prefix + (index === lines.length - 1 ? '└' + line : '├' + line);
    });
    return result;
}

function _parseTree(children: Dree[], prefix: string, options: ParseOptions, depth: number): string {
    let result = '';
    children.filter(child => !skip(child, options, depth)).forEach((child, index, children) => {
            const last = child.isSymbolicLink ? '>>' : (child.type === Type.DIRECTORY ? '─> ' : '── ');
            const line = (index === children.length - 1) ? '└' + last : '├' + last;
            const newPrefix = prefix + (index === children.length - 1 ?  '    ' : '│   ');
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
export function scan(path: string, options?: ScanOptions, onFile?: Callback, onDir?: Callback): Dree {
    const root = resolve(path);
    const opt = mergeScanOptions(options);
    const result = _scan(root, root, 0, opt, onFile, onDir) as Dree;
    result.sizeInBytes = opt.sizeInBytes ? result.sizeInBytes : undefined;
    return result;
}

/**
 * Retrurns a string representation of a Directory Tree given a path to a directory or file
 * @param  {string} dirTree The path wich you want to inspect
 * @param  {object} options An object used as options of the function
 * @return {string} A string representing the Directory Tree of the given path
 */
export function parse(path: string, options?: ParseOptions): string {
    let result = '';

    const root = resolve(path);
    const opt = mergeParseOptions(options);
    const name = basename(root);
    result += name;

    const stat = statSync(path);
    const lstat = lstatSync(path);
    const symbolicLink = lstat.isSymbolicLink();

    if((opt.followLinks || !symbolicLink) && stat.isDirectory()) {
        const children = readdirSync(root).map(file => resolve(root, file));
        result += children.length ? _parse(children, '\n ', opt, 1) : '';
    }

    return result;
}

/**
 * Retrurns a string representation of a Directory Tree given an object returned from scan
 * @param  {object} dirTree The object returned from scan, wich will be parsed
 * @param  {object} options An object used as options of the function
 * @return {string} A string representing the object given as first parameter
 */
export function parseTree(dirTree: Dree, options?: ParseOptions): string {
    let result = '';
    const opt = mergeParseOptions(options);
    result += dirTree ? dirTree.name : '';
    result += (dirTree.children ? _parseTree(dirTree.children, '\n ', opt, 1) : '');
    return result;
}