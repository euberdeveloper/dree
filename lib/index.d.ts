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

/**
 * Enum whose values are DIRECTORY or FILE
 */
export declare enum Type {
    DIRECTORY = "directory",
    FILE = "file"
}

/**
 * Interface of an object representing a Directory Tree
 */
export interface Dree {
    /**
     *  The name of the node as a string
     */
    name: string;
    /**
     * The absolute path of the node
     */
    path: string;
    /**
     * The relative path from the root of the node
     */
    relativePath: string;
    /**
     * Values: Type.DIRECTORY or Type.FILE
     */
    type: Type;
    /**
     * A boolean with true value if the node is a symbolic link
     */
    isSymbolicLink: boolean;
    /**
     * Optional. The size in bytes of the node
     */
    sizeInBytes?: number;
    /**
     * Optional. The size of the node, rounded to two decimals and appropriate unit
     */
    size?: string;
    /**
     * Optional. The hash of the node
     */
    hash?: string;
    /**
     * Optional. The extension (without dot) of the node. Returned only if the node is a file
     */
    extension?: string;
    /**
     * Optional. The fs.lstat or fs.fstat of the node
     */
    stat?: Stats;
    /**
     * Optional. An array of Dree objects, containing all the children of the node
     */
    children?: Dree[];
}

/**
 * Interface of the options object used with "scan" function
 */
export interface ScanOptions {
    /**
     * If true every node of the result will contain stat property, provided by fs.lstat or fs.stat
     */
    stat?: boolean;
    /**
     * If true, on windows, normalize each path replacing each backslash \\\\ with a slash /
     */
    normalize?: boolean;
    /**
     * If true, all symbolic links found will be included in the result. Could not work on Windows
     */
    symbolicLinks?: boolean;
    /**
     * If true, all symbolic links will be followed, including even their content if they link to a folder.
     * Could not work on Windows
     */
    followLinks?: boolean;
    /**
     * If true, every node in the result will contain sizeInBytes property as the number of bytes of the content.
     * If a node is a folder, only its considered inner files will be computed to have this size
     */
    sizeInBytes?: boolean;
    /**
     * If true, every node in the result will contain size property. Same as sizeInBytes, but it
     * is a string rounded to the second decimal digit and with an appropriate unit
     */
    size?: boolean;
    /**
     * If true, every node in the result will contain hash property, computed by taking in consideration
     * the name and the content of the node. If the node is a folder, all his considered inner files will be used by the algorithm
     */
    hash?: boolean;
    /**
     * Hash algorithm used by cryptojs to return the hash
     */
    hashAlgorithm?: 'md5' | 'sha1';
    /**
     * Hash encoding used by cryptojs to return the hash
     */
    hashEncoding?: HexBase64Latin1Encoding;
    /**
     * If true, all hidden files and dirs will be included in the result. A hidden file or a directory
     * has a name wich starts with a dot and in some systems like Linux are hidden
     */
    showHidden?: boolean;
    /**
     * It is a number wich says the max depth the algorithm can reach scanning the given path.
     * All files and dirs wich are beyound the max depth will not be considered by the algorithm
     */
    depth?: number;
    /**
     * It is a regex or array of regex and all the matched paths will not be considered by the algorithm
     */
    exclude?: RegExp | RegExp[];
    /**
     * It is an array of strings and all the files whose extension is not included in that array will be skipped by the algorithm.
     * If value is undefined, all file extensions will be considered, if it is [], no files will be included
     */
    extensions?: string[];
    /**
     * If true, folders whose user has not permissions will be skipped. An error will be thrown otherwise. Note: in fact every
     * error thrown by fs calls will be ignored
     */
    skipErrors?: boolean;
}

/**
 * Interface of the options object used with "parse" or "parseTree" functions
 */
export interface ParseOptions {
    /**
     * If true, all symbolic links found will be included in the result. Could not work on Windows
     */
    symbolicLinks?: boolean;
    /**
     * If true, all symbolic links will be followed, including even their content if they link to a folder.
     * Could not work on Windows
     */
    followLinks?: boolean;
    /**
     * If true, all hidden files and dirs will be included in the result. A hidden file or a directory
     * has a name wich starts with a dot and in some systems like Linux are hidden
     */
    showHidden?: boolean;
    /**
     * It is a number wich says the max depth the algorithm can reach scanning the given path.
     * All files and dirs wich are beyound the max depth will not be considered by the algorithm
     */
    depth?: number;
    /**
     * It is a regex or array of regex and all the matched paths will not be considered by the algorithm
     */
    exclude?: RegExp | RegExp[];
    /**
     * It is an array of strings and all the files whose extension is not included in that array will be skipped by the algorithm.
     * If value is undefined, all file extensions will be considered, if it is [], no files will be included
     */
    extensions?: string[];
    /**
     * If true, folders whose user has not permissions will be skipped. An error will be thrown otherwise. Note: in fact every
     * error thrown by fs calls will be ignored
     */
    skipErrors?: boolean;
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
