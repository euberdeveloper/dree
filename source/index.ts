import { resolve, basename, extname, relative } from 'path';
import { createHash } from 'crypto';
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
    size: string;
    hash: string;
    extension?: string;
    stat?: Stats;
    children?: Dree[];
}

function _dree(root: string, path: string): Dree {
    const relativePath = (root == path) ? '.' : relative(root, path);
    const name = basename(path);
    const stat = statSync(path);
    const type = stat.isFile() ? Type.FILE : Type.DIRECTORY;
    const hash = createHash('md5');
    hash.update(name);

    const dirTree: any = {
        name: name,
        path: path,
        relativePath: relativePath,
        type: type,
        size: '',
        stat: stat
    };

    switch(type) {
        case Type.DIRECTORY:
            const children: Dree[] = [];
            readdirSync(path).forEach(file => children.push(_dree(root, resolve(path, file))));
            if(children.length) {
                dirTree.children = children;
            }
            break;
        case Type.FILE:
            const data = readFileSync(path);
            hash.update(data);
            dirTree.extension = extname(path);
            break;
    } 

    dirTree.hash = hash.digest('hex');
    
    return dirTree;
}

export function dree(root: string): Dree {
    const path = resolve(root);
    return _dree(path, path);
}