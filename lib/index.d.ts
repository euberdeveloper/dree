import { HexBase64Latin1Encoding } from 'crypto';
import { Stats } from 'fs';
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
export declare type Callback = (dirTree: Dree, stat: Stats) => void;
/**
 * Retrurns the Directory Tree of a given path
 * @param  {string} path The path wich you want to inspect
 * @param  {object} options An object used as options of the function
 * @return {object} The directory tree as a Dree object
 */
export declare function dree(path: string, options?: Options, onFile?: Callback, onDir?: Callback): Dree;
