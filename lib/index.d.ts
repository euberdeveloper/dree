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
    size: string;
    hash: string;
    extension?: string;
    stat?: Stats;
    children?: Dree[];
}
export declare function dree(root: string): Dree;
