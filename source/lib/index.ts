import { resolve, basename, extname, relative } from 'path';
import { BinaryToTextEncoding, createHash, Hash } from 'crypto';
import { makeRe } from 'minimatch';
import { statSync, readdirSync, readFileSync, lstatSync, Stats } from 'fs';
import { stat as statAsync, readdir as readdirAsync, readFile as readFileAsync, lstat as lstatAsync } from 'fs/promises';

/* DREE TYPES */

/**
 * Enum whose values are DIRECTORY or FILE
 */
export enum Type {
    DIRECTORY = 'directory',
    FILE = 'file'
}

/**
 * Callback used by [[scan]] when a file or dir is encountered
 */
export type Callback = (dirTree: Dree, stat: Stats) => void;
/**
 * Callback used by [[scanAsync]] when a file or dir is encountered
 */
export type CallbackAsync = (dirTree: Dree, stat: Stats) => void | Promise<void>;


/**
 * Enum whose values are used to determine how the paths should be sorted
 */
export enum SortMethodPredefined {
    /** Alphabetical order */
    ALPHABETICAL = 'alpha',
    /** Alphabetical order, reversed */
    ALPHABETICAL_REVERSE = 'antialpha',
    /** Alphabetical order, case insensitive */
    ALPHABETICAL_INSENSITIVE = 'alpha-insensitive',
    /** Alphabetical order, reversed, case insensitive */
    ALPHABETICAL_INSENSITIVE_REVERSE = 'antialpha-insensitive'
};
/**
 * Function used to sort paths
 */
export type SortDiscriminator = (x: string, y: string) => number;

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
     * Optional. True if the node is a directory and contains no files and no directories
     */
    isEmpty?: boolean;
    /**
     * Optional. The fs.lstat or fs.fstat of the node
     */
    stat?: Stats;
    /**
     * Optional. The number of descendants of the node. Returned only if the node is a directory and [[descendants]] option is specified
     */
    descendants?: number;
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
    hashEncoding?: BinaryToTextEncoding;
    /**
     * If true, all hidden files and dirs will be included in the result. A hidden file or a directory 
     * has a name which starts with a dot and in some systems like Linux are hidden
     */
    showHidden?: boolean;
    /**
     * It is a number which says the max depth the algorithm can reach scanning the given path. 
     * All files and dirs which are beyound the max depth will not be considered by the algorithm
     */
    depth?: number;
    /**
     * It is a regex, string (glob patterns) or array of them and all the matching paths will not be considered by the algorithm.
     */
    exclude?: string | RegExp | (RegExp | string)[];
    /**
     * It is a regex, string (glob pattern) or array of them and all the non-matching paths will not be considered by the algorithm. Note: All the
     * ancestors of a matching node will be added.
     */
    matches?: string | RegExp | (RegExp | string)[];
    /**
     * It is an array of strings and all the files whose extension is not included in that array will be skipped by the algorithm. 
     * If value is undefined, all file extensions will be considered, if it is [], no files will be included
     */
    extensions?: string[];
    /**
     * If true, every node of type directory in the result will contain isEmpty property, which will be true if the folder contains 
     * no files and no directories
     */
    emptyDirectory?: boolean;
    /**
     * If true, every empty directory will be excluded from the result. If the directory is not empty but all the contained files 
     * and directories are excluded by other options such as exclude or extensions, the directory will not be included in the result
     */
    excludeEmptyDirectories?: boolean;
    /**
     * If true, also the number of descendants of each node will be added to the result.
     */
    descendants?: boolean;
    /**
     * If true, only files will be count as descendants of a node. It does not have effect if [[descendants]] option is not true.
     */
    descendantsIgnoreDirectories?: boolean;
    /**
     * If true, directories and files will be scanned ordered by path. The value can be both boolean for default alpha order, a 
     * custom sorting function or a predefined sorting method in [[SortMethodPredefined]].
     */
    sorted?: boolean | SortMethodPredefined | SortDiscriminator;
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
     * has a name which starts with a dot and in some systems like Linux are hidden
     */
    showHidden?: boolean;
    /**
     * It is a number which says the max depth the algorithm can reach scanning the given path. 
     * All files and dirs which are beyound the max depth will not be considered by the algorithm
     */
    depth?: number;
    /**
     * It is a regex, string (glob patterns) or array of them and all the matched paths will not be considered by the algorithm
     */
    exclude?: string | RegExp | (RegExp | string)[];
    /**
     * It is an array of strings and all the files whose extension is not included in that array will be skipped by the algorithm. 
     * If value is undefined, all file extensions will be considered, if it is [], no files will be included
     */
    extensions?: string[];
    /**
     * If true, directories and files will be scanned ordered by path. The value can be both boolean for default alpha order, a 
     * custom sorting function or a predefined sorting method in [[SortMethodPredefined]].
     */
    sorted?: boolean | SortMethodPredefined | SortDiscriminator;
    /**
     * If true, folders whose user has not permissions will be skipped. An error will be thrown otherwise. Note: in fact every
     * error thrown by fs calls will be ignored
     */
    skipErrors?: boolean;
}

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
    matches: undefined,
    extensions: undefined,
    emptyDirectory: false,
    excludeEmptyDirectories: false,
    descendants: false,
    descendantsIgnoreDirectories: false,
    sorted: false,
    skipErrors: true
};

const PARSE_DEFAULT_OPTIONS: ParseOptions = {
    symbolicLinks: true,
    followLinks: false,
    showHidden: true,
    depth: undefined,
    exclude: undefined,
    extensions: undefined,
    sorted: false,
    skipErrors: true
};

/* SUPPORT FUNCTIONS */

function purgePatternsIntoArrayOfRegex(patterns: string | RegExp | (RegExp | string)[]): RegExp[] {
    return (Array.isArray(patterns) ? patterns : [patterns]).map(pattern => pattern instanceof RegExp ? pattern : makeRe(pattern, {
        dot: true,

    })).filter(pattern => pattern instanceof RegExp) as RegExp[];
}

function mergeScanOptions(options?: ScanOptions): ScanOptions {
    let result: ScanOptions = {};
    if (options) {
        for (const key in SCAN_DEFAULT_OPTIONS) {
            result[key] = (options[key] !== undefined) ? options[key] : SCAN_DEFAULT_OPTIONS[key];
        }
        if (result.depth as number < 0) {
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
    if (options) {
        for (const key in PARSE_DEFAULT_OPTIONS) {
            result[key] = (options[key] !== undefined) ? options[key] : PARSE_DEFAULT_OPTIONS[key];
        }
        if (result.depth as number < 0) {
            result.depth = 0;
        }
    }
    else {
        result = PARSE_DEFAULT_OPTIONS;
    }
    return result;
}

function parseSize(size: number): string {
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let i: number;
    for (i = 0; i < units.length && size > 1000; i++) {
        size /= 1000;
    }
    return Math.round(size * 100) / 100 + ' ' + units[i];
}

function sortAlphabetical(a: string, b: string): number {
    return a.localeCompare(b);
}

function sortAlphabeticalInsensitive(a: string, b: string): number {
    return a.toLowerCase().localeCompare(b.toLowerCase());
}

function sortFiles(files: string[], sortOption: boolean | SortMethodPredefined | SortDiscriminator): string[] {
    if (!sortOption) {
        return files;
    }

    if (sortOption === true) {
        return files.sort(sortAlphabetical);
    }
    else if (typeof sortOption === 'string') {
        switch (sortOption) {
            case SortMethodPredefined.ALPHABETICAL:
                return files.sort(sortAlphabetical);
            case SortMethodPredefined.ALPHABETICAL_REVERSE:
                return files.sort(sortAlphabetical).reverse();
            case SortMethodPredefined.ALPHABETICAL_INSENSITIVE:
                return files.sort(sortAlphabeticalInsensitive);
            case SortMethodPredefined.ALPHABETICAL_INSENSITIVE_REVERSE:
                return files.sort(sortAlphabeticalInsensitive).reverse();
            default:
                return files;
        }
    }
    else if (typeof sortOption === 'function') {
        return files.sort(sortOption);
    }
}

function sortDreeNodes(dreeNodes: Dree[], sortOption: boolean | SortMethodPredefined | SortDiscriminator): Dree[] {
    if (!sortOption) {
        return dreeNodes;
    }

    if (sortOption === true) {
        return dreeNodes.sort((x, y) => sortAlphabetical(x.relativePath, y.relativePath));
    }
    else if (typeof sortOption === 'string') {
        switch (sortOption) {
            case SortMethodPredefined.ALPHABETICAL:
                return dreeNodes.sort((x, y) => sortAlphabetical(x.relativePath, y.relativePath));
            case SortMethodPredefined.ALPHABETICAL_REVERSE:
                return dreeNodes.sort((x, y) => sortAlphabetical(x.relativePath, y.relativePath)).reverse();
            case SortMethodPredefined.ALPHABETICAL_INSENSITIVE:
                return dreeNodes.sort((x, y) => sortAlphabeticalInsensitive(x.relativePath, y.relativePath));
            case SortMethodPredefined.ALPHABETICAL_INSENSITIVE_REVERSE:
                return dreeNodes.sort((x, y) => sortAlphabeticalInsensitive(x.relativePath, y.relativePath)).reverse();
            default:
                return dreeNodes;
        }
    }
    else if (typeof sortOption === 'function') {
        return dreeNodes.sort((x, y) => sortOption(x.relativePath, y.relativePath));
    }
}

function _scan(root: string, path: string, depth: number, options: ScanOptions, onFile?: Callback, onDir?: Callback): Dree | null {
    if (options.depth !== undefined && depth > options.depth) {
        return null;
    }

    const relativePath = (root === path) ? '.' : relative(root, path);

    if (options.exclude && root !== path) {
        const excludes = purgePatternsIntoArrayOfRegex(options.exclude);
        if (excludes.some(pattern => pattern.test(`/${relativePath}`))) {
            return null;
        }
    }

    const name = basename(path);
    let stat: Stats;
    try {
        stat = statSync(path);
    }
    catch (exception) {
        /* istanbul ignore next */
        if (options.skipErrors) {
            return null;
        }
        else {
            throw exception;
        }
    }
    let lstat: Stats;
    try {
        lstat = lstatSync(path);
    }
    catch (exception) {
        /* istanbul ignore next */
        if (options.skipErrors) {
            return null;
        }
        else {
            throw exception;
        }
    }
    const symbolicLink = lstat.isSymbolicLink();
    const type = stat.isFile() ? Type.FILE : Type.DIRECTORY;

    if (!options.showHidden && name.charAt(0) === '.') {
        return null;
    }
    if (!options.symbolicLinks && symbolicLink) {
        return null;
    }

    let hash: Hash;
    if (options.hash) {
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
        stat: options.followLinks ? stat : lstat
    };
    if (!options.stat) {
        delete dirTree.stat;
    }

    switch (type) {
        case Type.DIRECTORY:
            const children: Dree[] = [];
            let files: string[];
            if (options.followLinks || !symbolicLink) {
                try {
                    files = readdirSync(path);
                    files = sortFiles(files, options.sorted);
                }
                catch (exception) {
                    /* istanbul ignore next */
                    if (options.skipErrors) {
                        return null;
                    }
                    else {
                        throw exception;
                    }
                }
                if (options.emptyDirectory) {
                    dirTree.isEmpty = !files.length
                }
                files.forEach(file => {
                    const child: Dree | null = _scan(root, resolve(path, file), depth + 1, options, onFile, onDir);
                    if (child !== null) {
                        children.push(child);
                    }
                });
                if (options.excludeEmptyDirectories && !children.length) {
                    return null;
                }
            }
            if (options.matches && root !== path) {
                const handledMatches = purgePatternsIntoArrayOfRegex(options.matches);
                if (!children.length && handledMatches.some(pattern => !pattern.test(`/${relativePath}`))) {
                    return null;
                }
            }
            if (options.sizeInBytes || options.size) {
                const size = children.reduce((previous, current) => previous + (current.sizeInBytes as number), 0);
                dirTree.sizeInBytes = size;
                dirTree.size = options.size ? parseSize(size) : undefined;
                if (!options.sizeInBytes) {
                    children.forEach(child => child.sizeInBytes = undefined);
                }
            }
            if (options.hash) {
                children.forEach(child => {
                    hash.update(child.hash);
                });
                const hashEncoding = options.hashEncoding as BinaryToTextEncoding;
                dirTree.hash = hash.digest(hashEncoding);
            }
            if (options.descendants) {
                dirTree.descendants = children.reduce((acc, child) => acc + (child.type === Type.DIRECTORY && options.descendantsIgnoreDirectories ? 0 : 1) + (child.descendants ?? 0), 0);
            }
            if (children.length) {
                dirTree.children = children;
            }
            break;
        case Type.FILE:
            dirTree.extension = extname(path).replace('.', '');
            if (options.extensions && options.extensions.indexOf(dirTree.extension) === -1) {
                return null;
            }
            if (options.matches && root !== path) {
                const handledMatches = purgePatternsIntoArrayOfRegex(options.matches);
                if (handledMatches.some(pattern => !pattern.test(`/${relativePath}`))) {
                    return null;
                }
            }
            if (options.sizeInBytes || options.size) {
                const size = (options.followLinks ? stat.size : lstat.size);
                dirTree.sizeInBytes = size;
                dirTree.size = options.size ? parseSize(size) : undefined;
            }
            if (options.hash) {
                let data: Buffer;
                try {
                    data = readFileSync(path);
                }
                catch (exception) {
                    /* istanbul ignore next */
                    if (options.skipErrors) {
                        return null;
                    }
                    else {
                        throw exception;
                    }
                }
                hash.update(data);
                const hashEncoding = options.hashEncoding as BinaryToTextEncoding;
                dirTree.hash = hash.digest(hashEncoding);
            }
            break;
        default:
            /* istanbul ignore next */
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

async function _scanAsync(root: string, path: string, depth: number, options: ScanOptions, onFile?: CallbackAsync, onDir?: CallbackAsync): Promise<Dree | null> {

    if (options.depth !== undefined && depth > options.depth) {
        return null;
    }

    const relativePath = (root === path) ? '.' : relative(root, path);

    if (options.exclude && root !== path) {
        const excludes = purgePatternsIntoArrayOfRegex(options.exclude);
        if (excludes.some(pattern => pattern.test(`/${relativePath}`))) {
            return null;
        }
    }

    const name = basename(path);
    let stat: Stats;
    try {
        stat = await statAsync(path);
    }
    catch (exception) {
        /* istanbul ignore next */
        if (options.skipErrors) {
            return null;
        }
        else {
            throw exception;
        }
    }
    let lstat: Stats;
    try {
        lstat = await lstatAsync(path);
    }
    catch (exception) {
        /* istanbul ignore next */
        if (options.skipErrors) {
            return null;
        }
        else {
            throw exception;
        }
    }
    const symbolicLink = lstat.isSymbolicLink();
    const type = stat.isFile() ? Type.FILE : Type.DIRECTORY;

    if (!options.showHidden && name.charAt(0) === '.') {
        return null;
    }
    if (!options.symbolicLinks && symbolicLink) {
        return null;
    }

    let hash: any;
    if (options.hash) {
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
        stat: options.followLinks ? stat : lstat
    };
    if (!options.stat) {
        delete dirTree.stat;
    }

    switch (type) {
        case Type.DIRECTORY:
            let children: Dree[] = [];
            let files: string[];
            if (options.followLinks || !symbolicLink) {
                try {
                    files = await readdirAsync(path);
                    files = sortFiles(files, options.sorted);
                }
                catch (exception) {
                    /* istanbul ignore next */
                    if (options.skipErrors) {
                        return null;
                    }
                    else {
                        throw exception;
                    }
                }
                if (options.emptyDirectory) {
                    dirTree.isEmpty = !files.length
                }
                children = await Promise.all(files.map(async file => {
                    const child: Dree | null = await _scanAsync(root, resolve(path, file), depth + 1, options, onFile, onDir);
                    return child;
                }));
                children = children.filter(ch => ch !== null);
                if (options.excludeEmptyDirectories && !children.length) {
                    return null;
                }
            }
            if (options.matches && root !== path) {
                const handledMatches = purgePatternsIntoArrayOfRegex(options.matches);
                if (!children.length && handledMatches.some(pattern => !pattern.test(`/${relativePath}`))) {
                    return null;
                }
            }
            if (options.sizeInBytes || options.size) {
                const size = children.reduce((previous, current) => previous + (current.sizeInBytes as number), 0);
                dirTree.sizeInBytes = size;
                dirTree.size = options.size ? parseSize(size) : undefined;
                if (!options.sizeInBytes) {
                    children.forEach(child => child.sizeInBytes = undefined);
                }
            }
            if (options.hash) {
                children.forEach(child => {
                    hash.update(child.hash);
                });
                const hashEncoding = options.hashEncoding as BinaryToTextEncoding;
                dirTree.hash = hash.digest(hashEncoding);
            }
            if (options.descendants) {
                dirTree.descendants = children.reduce((acc, child) => acc + (child.type === Type.DIRECTORY && options.descendantsIgnoreDirectories ? 0 : 1) + (child.descendants ?? 0), 0);
            }
            if (children.length) {
                dirTree.children = children;
            }
            break;
        case Type.FILE:
            dirTree.extension = extname(path).replace('.', '');
            if (options.extensions && options.extensions.indexOf(dirTree.extension) === -1) {
                return null;
            }
            if (options.matches && root !== path) {
                const handledMatches = purgePatternsIntoArrayOfRegex(options.matches);
                if (handledMatches.some(pattern => !pattern.test(`/${relativePath}`))) {
                    return null;
                }
            }
            if (options.sizeInBytes || options.size) {
                const size = (options.followLinks ? stat.size : lstat.size);
                dirTree.sizeInBytes = size;
                dirTree.size = options.size ? parseSize(size) : undefined;
            }
            if (options.hash) {
                let data: Buffer;
                try {
                    data = await readFileAsync(path);
                }
                catch (exception) {
                    /* istanbul ignore next */
                    if (options.skipErrors) {
                        return null;
                    }
                    else {
                        throw exception;
                    }
                }
                hash.update(data);
                const hashEncoding = options.hashEncoding as BinaryToTextEncoding;
                dirTree.hash = hash.digest(hashEncoding);
            }
            break;
        default:
            /* istanbul ignore next */
            return null;
    }

    if (onFile && type === Type.FILE) {
        await onFile(dirTree, options.followLinks ? stat : lstat);
    }
    else if (onDir && type === Type.DIRECTORY) {
        await onDir(dirTree, options.followLinks ? stat : lstat);
    }

    return dirTree;
}

function skip(child: Dree, options: ParseOptions, depth: number): boolean {
    return (!options.symbolicLinks && child.isSymbolicLink)
        || (!options.showHidden && child.name.charAt(0) === '.')
        || (options.extensions !== undefined && child.type === Type.FILE
            && (options.extensions.indexOf(child.extension as string) === -1))
        || (options.exclude && purgePatternsIntoArrayOfRegex(options.exclude).some(pattern => pattern.test(`/${child.relativePath}`)))
        || (options.depth !== undefined && depth > options.depth);
}

function _parse(root: string, children: string[], prefix: string, options: ParseOptions, depth: number): string {
    let result = '';
    const lines = children.map((child, index) => {
        let result = '';

        if (options.depth !== undefined && depth > options.depth) {
            return '';
        }

        if (options.exclude) {
            const excludes = purgePatternsIntoArrayOfRegex(options.exclude);
            if (excludes.some(pattern => pattern.test(`/${relative(root, child)}`))) {
                return '';
            }
        }

        const name = basename(child);
        let stat: Stats;
        try {
            stat = statSync(child);
        }
        catch (exception) {
            /* istanbul ignore next */
            if (options.skipErrors) {
                return null;
            }
            else {
                throw exception;
            }
        }
        let lstat: Stats;
        try {
            lstat = lstatSync(child);
        }
        catch (exception) {
            /* istanbul ignore next */
            if (options.skipErrors) {
                return null;
            }
            else {
                throw exception;
            }
        }
        const symbolicLink = lstat.isSymbolicLink();
        const type = stat.isFile() ? Type.FILE : Type.DIRECTORY;

        if (!options.showHidden && name.charAt(0) === '.') {
            return '';
        }
        if (!options.symbolicLinks && symbolicLink) {
            return '';
        }
        const extension = extname(child).replace('.', '');
        if (options.extensions && type === Type.FILE && options.extensions.indexOf(extension) === -1) {
            return '';
        }

        const last = symbolicLink ? '>>' : (type === Type.DIRECTORY ? '─> ' : '── ');
        const newPrefix = prefix + (index === children.length - 1 ? '    ' : '│   ');
        result += last + name;

        if ((options.followLinks || !symbolicLink) && type === Type.DIRECTORY) {
            let children: string[];
            try {
                children = readdirSync(child).map(file => resolve(child, file));
                children = sortFiles(children, options.sorted);
            }
            catch (exception) {
                /* istanbul ignore next */
                if (options.skipErrors) {
                    return null;
                }
                else {
                    throw exception;
                }
            }
            result += children.length ? _parse(root, children, newPrefix, options, depth + 1) : '';
        }

        return result;
    });
    lines.filter(line => !!line).forEach((line, index, lines) => {
        result += prefix + (index === lines.length - 1 ? '└' + line : '├' + line);
    });
    return result;
}

async function _parseAsync(root: string, children: string[], prefix: string, options: ParseOptions, depth: number): Promise<string> {
    let result = '';
    const lines = await Promise.all(children.map(async (child, index) => {
        let result = '';

        if (options.depth !== undefined && depth > options.depth) {
            return '';
        }

        if (options.exclude) {
            const excludes = purgePatternsIntoArrayOfRegex(options.exclude);
            if (excludes.some(pattern => pattern.test(`/${relative(root, child)}`))) {
                return '';
            }
        }

        const name = basename(child);
        let stat: Stats;
        try {
            stat = await statAsync(child);
        }
        catch (exception) {
            /* istanbul ignore next */
            if (options.skipErrors) {
                return null;
            }
            else {
                throw exception;
            }
        }
        let lstat: Stats;
        try {
            lstat = await lstatAsync(child);
        }
        catch (exception) {
            /* istanbul ignore next */
            if (options.skipErrors) {
                return null;
            }
            else {
                throw exception;
            }
        }
        const symbolicLink = lstat.isSymbolicLink();
        const type = stat.isFile() ? Type.FILE : Type.DIRECTORY;

        if (!options.showHidden && name.charAt(0) === '.') {
            return '';
        }
        if (!options.symbolicLinks && symbolicLink) {
            return '';
        }
        const extension = extname(child).replace('.', '');
        if (options.extensions && type === Type.FILE && options.extensions.indexOf(extension) === -1) {
            return '';
        }

        const last = symbolicLink ? '>>' : (type === Type.DIRECTORY ? '─> ' : '── ');
        const newPrefix = prefix + (index === children.length - 1 ? '    ' : '│   ');
        result += last + name;

        if ((options.followLinks || !symbolicLink) && type === Type.DIRECTORY) {
            let children: string[];
            try {
                children = (await readdirAsync(child)).map(file => resolve(child, file));
                children = sortFiles(children, options.sorted);
            }
            catch (exception) {
                /* istanbul ignore next */
                if (options.skipErrors) {
                    return null;
                }
                else {
                    throw exception;
                }
            }
            result += children.length ? (await _parseAsync(root, children, newPrefix, options, depth + 1)) : '';
        }

        return result;
    }));
    lines.filter(line => !!line).forEach((line, index, lines) => {
        result += prefix + (index === lines.length - 1 ? '└' + line : '├' + line);
    });
    return result;
}

function _parseTree(children: Dree[], prefix: string, options: ParseOptions, depth: number): string {
    let result = '';
    children = sortDreeNodes(children, options.sorted);
    children
        .filter(child => !skip(child, options, depth))
        .forEach((child, index, children) => {
            const last = child.isSymbolicLink ? '>>' : (child.type === Type.DIRECTORY ? '─> ' : '── ');
            const line = (index === children.length - 1) ? '└' + last : '├' + last;
            const newPrefix = prefix + (index === children.length - 1 ? '    ' : '│   ');
            result += prefix + line + child.name;
            result += (child.children && (options.followLinks || !child.isSymbolicLink) ? _parseTree(child.children, newPrefix, options, depth + 1) : '');
        });
    return result;
}

async function _parseTreeAsync(children: Dree[], prefix: string, options: ParseOptions, depth: number): Promise<string> {
    let result = '';
    children = sortDreeNodes(children, options.sorted);
    const filteredChildren = children.filter(child => !skip(child, options, depth));
    for (let index = 0; index < filteredChildren.length; index++) {
        const child = filteredChildren[index];
        const last = child.isSymbolicLink ? '>>' : (child.type === Type.DIRECTORY ? '─> ' : '── ');
        const line = (index === filteredChildren.length - 1) ? '└' + last : '├' + last;
        const newPrefix = prefix + (index === filteredChildren.length - 1 ? '    ' : '│   ');
        result += prefix + line + child.name;
        result += (child.children && (options.followLinks || !child.isSymbolicLink) ? (await _parseTreeAsync(child.children, newPrefix, options, depth + 1)) : '');
    }
    return result;
}

/* EXPORTED FUNCTIONS */

/**
 * Returns the Directory Tree of a given path. This function in synchronous.
 * @param  {string} path The path which you want to inspect
 * @param  {object} options An object used as options of the function
 * @param  {function} onFile A function called when a file is added - has the tree object and its stat as parameters
 * @param  {function} onDir A function called when a dir is added - has the tree object and its stat as parameters
 * @return {object} The directory tree as a Dree object
 */
export function scan(path: string, options?: ScanOptions, onFile?: Callback, onDir?: Callback): Dree {
    const root = resolve(path);
    const opt = mergeScanOptions(options);
    const result = _scan(root, root, 0, opt, onFile, onDir) as Dree;
    if (result) {
        result.sizeInBytes = opt.sizeInBytes ? result.sizeInBytes : undefined;
    }
    return result;
}

/**
 * Returns in a promise the Directory Tree of a given path. This function is asynchronous.
 * @param  {string} path The path which you want to inspect
 * @param  {object} options An object used as options of the function
 * @param  {function} onFile A function called when a file is added - has the tree object and its stat as parameters
 * @param  {function} onDir A function called when a dir is added - has the tree object and its stat as parameters
 * @return {Promise<object>} A promise to the directory tree as a Dree object
 */
export async function scanAsync(path: string, options?: ScanOptions, onFile?: CallbackAsync, onDir?: CallbackAsync): Promise<Dree> {
    const root = resolve(path);
    const opt = mergeScanOptions(options);
    const result = await _scanAsync(root, root, 0, opt, onFile, onDir) as Dree;
    if (result) {
        result.sizeInBytes = opt.sizeInBytes ? result.sizeInBytes : undefined;
    }
    return result;
}

/**
 * Returns a string representation of a Directory Tree given a path to a directory or file
 * @param  {string} dirTree The path which you want to inspect
 * @param  {object} options An object used as options of the function
 * @return {string} A string representing the Directory Tree of the given path
 */
export function parse(path: string, options?: ParseOptions): string {
    let result = '';

    const root = resolve(path);
    const opt = mergeParseOptions(options);
    const name = basename(root);
    result += name;

    let stat: Stats;
    try {
        stat = statSync(path);
    }
    catch (exception) {
        /* istanbul ignore next */
        if (opt.skipErrors) {
            return null;
        }
        else {
            throw exception;
        }
    }
    let lstat: Stats;
    try {
        lstat = lstatSync(path);
    }
    catch (exception) {
        /* istanbul ignore next */
        if (opt.skipErrors) {
            return null;
        }
        else {
            throw exception;
        }
    }
    const symbolicLink = lstat.isSymbolicLink();

    if ((opt.followLinks || !symbolicLink) && stat.isDirectory()) {
        let children: string[];
        try {
            children = readdirSync(root).map(file => resolve(root, file));
            children = sortFiles(children, opt.sorted);
        }
        catch (exception) {
            /* istanbul ignore next */
            if (opt.skipErrors) {
                return null;
            }
            else {
                throw exception;
            }
        }
        result += children.length ? _parse(path, children, '\n ', opt, 1) : '';
    }

    return result;
}

/**
 * Returns a promise to a string representation of a Directory Tree given a path to a directory or file
 * @param  {string} path The path which you want to inspect
 * @param  {object} options An object used as options of the function
 * @return {Promise<string>} A promise to a string representing the Directory Tree of the given path
 */
export async function parseAsync(path: string, options?: ParseOptions): Promise<string> {
    let result = '';

    const root = resolve(path);
    const opt = mergeParseOptions(options);
    const name = basename(root);
    result += name;

    let stat: Stats;
    try {
        stat = await statAsync(path);
    }
    catch (exception) {
        /* istanbul ignore next */
        if (opt.skipErrors) {
            return null;
        }
        else {
            throw exception;
        }
    }
    let lstat: Stats;
    try {
        lstat = await lstatAsync(path);
    }
    catch (exception) {
        /* istanbul ignore next */
        if (opt.skipErrors) {
            return null;
        }
        else {
            throw exception;
        }
    }
    const symbolicLink = lstat.isSymbolicLink();

    if ((opt.followLinks || !symbolicLink) && stat.isDirectory()) {
        let children: string[];
        try {
            children = (await readdirAsync(root)).map(file => resolve(root, file));
            children = sortFiles(children, opt.sorted);
        }
        catch (exception) {
            /* istanbul ignore next */
            if (opt.skipErrors) {
                return null;
            }
            else {
                throw exception;
            }
        }
        result += children.length ? (await _parseAsync(path, children, '\n ', opt, 1)) : '';
    }

    return result;
}

/**
 * Returns a string representation of a Directory Tree given an object returned from scan
 * @param  {object} dirTree The object returned from scan, which will be parsed
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

/**
 * Returns a promise to a string representation of a Directory Tree given an object returned from scan
 * @param  {object} dirTree The object returned from scan, which will be parsed
 * @param  {object} options An object used as options of the function
 * @return {Promise<string>} A promise to a string representing the object given as first parameter
 */
export async function parseTreeAsync(dirTree: Dree, options?: ParseOptions): Promise<string> {
    let result = '';
    const opt = mergeParseOptions(options);
    result += dirTree ? dirTree.name : '';
    result += (dirTree.children ? (await _parseTreeAsync(dirTree.children, '\n ', opt, 1)) : '');
    return result;
}