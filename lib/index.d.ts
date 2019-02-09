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
export declare enum Type {
    DIRECTORY = "directory",
    FILE = "file"
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
export declare type Callback = (dirTree: Dree, stat: Stats) => void;
/**
 * Retrurns the Directory Tree of a given path
 * @param  {string} path The path wich you want to inspect
 * @param  {object} options An object used as options of the function
 * @param  {function} onFile A function called when a file is added - has the tree object and its stat as parameters
 * @param  {function} onDir A function called when a dir is added - has the tree object and its stat as parameters
 * @return {object} The directory tree as a Dree object
 */
export declare function scan(path: string, options?: ScanOptions, onFile?: Callback, onDir?: Callback): Dree;
/**
 * Retrurns a string representation of a Directory Tree given a path to a directory or file
 * @param  {string} dirTree The path wich you want to inspect
 * @param  {object} options An object used as options of the function
 * @return {string} A string representing the Directory Tree of the given path
 */
export declare function parse(path: string, options?: ParseOptions): string;
/**
 * Retrurns a string representation of a Directory Tree given an object returned from scan
 * @param  {object} dirTree The object returned from scan, wich will be parsed
 * @param  {object} options An object used as options of the function
 * @return {string} A string representing the object given as first parameter
 */
export declare function parseTree(dirTree: Dree, options?: ParseOptions): string;
export {};
