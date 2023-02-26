#!/usr/bin/env node
import * as yargs from 'yargs';
import { writeFileSync } from 'fs';

import * as dree from '../lib/index';
import { ParseOptions, ScanOptions, SortDiscriminator, SortMethodPredefined } from '../lib/index';

function escapeStringRegexp(string) {
	return string
		.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
		.replace(/-/g, '\\x2d');
}

function parseRegExp(patterns: string[]): (RegExp | string)[] {
    const isRegexRegex = /^\/(?<pattern>.*)\/(?<flags>[igm]*)?$/;
    return patterns ? patterns.map(pattern => {
        const match = pattern.match(isRegexRegex);
        return match ? new RegExp(escapeStringRegexp(match.groups!.pattern), match.groups!.flags) : pattern;
    }) : [];
}

function parseSorted(sorted?: SortMethodPredefined | 'ascending' | 'descending'): SortDiscriminator | SortMethodPredefined | boolean | undefined {
    if (!sorted) {
        return undefined;
    }

    switch (sorted) {
        case 'ascending':
            return SortMethodPredefined.ALPHABETICAL;
        case 'descending':
            return SortMethodPredefined.ALPHABETICAL_REVERSE;
        default:
            return sorted;
    }
}

yargs
    .scriptName('dree')
    .command(
        'parse <source>',
        'Save the directory tree as a text file',
        (yargs: yargs.Argv) => {
            yargs.positional('source', {
                describe: 'The path of the root of the directory tree',
                type: 'string'
            });
        },
        argv => {
            const args: any = argv;
            const options: ParseOptions = {
                symbolicLinks: args.symbolicLinks,
                followLinks: args.followLinks,
                showHidden: args.showHidden,
                depth: args.depth,
                exclude: parseRegExp(args.exclude),
                extensions: args.extensions,
                sorted: parseSorted(args.sorted),
                skipErrors: args.skipErrors
            }
            const source: string = args.source;
            const dest: string | undefined = args.dest;
            const show: boolean = !args.dest || args.show;
            const tree = dree.parse(source, options);
            if (show) {
                console.log(tree);
            }
            if (dest) {
                writeFileSync(dest, tree);
            }
        }
    )
    .command(
        'scan <source>',
        'Save the directory tree as a json file',
        (yargs: yargs.Argv) => {
            yargs
                .positional('source', {
                    describe: 'The path of the root of the directory tree',
                    type: 'string'
                })
                .options({
                    'tabs': {
                        describe: 'How many tabs will be used to indent the resulted json',
                        type: 'number',
                        default: 0
                    },
                    'pretty': {
                        describe: 'If the resulted json will be pretty printed with 4 tabs. Overwrites the tabs option',
                        type: 'boolean',
                        default: false
                    }
                });
        },
        argv => {
            const args: any = argv;
            const options: ScanOptions = {
                stat: args.stat,
                normalize: args.normalize,
                symbolicLinks: args.symbolicLinks,
                followLinks: args.followLinks,
                sizeInBytes: args.sizeInBytes,
                size: args.size,
                hash: args.hash,
                hashAlgorithm: args.hashAlgorithm,
                hashEncoding: args.hashEncoding,
                showHidden: args.showHidden,
                depth: args.depth,
                exclude: parseRegExp(args.exclude),
                matches: parseRegExp(args.matches),
                emptyDirectory: args.emptyDirectory,
                excludeEmptyDirectories: args.excludeEmptyDirectories,
                descendants: args.descendants,
                descendantsIgnoreDirectories: args.descendantsIgnoreDirectories,
                extensions: args.extensions,
                sorted: parseSorted(args.sorted),
                skipErrors: args.skipErrors
            }
            const source: string = args.source;
            const dest: string | undefined = args.dest;
            const show: boolean = !args.dest || args.show;
            const pretty: boolean = args.pretty;
            const tabs: number = pretty ? 4 : args.tabs;
            const tree = JSON.stringify(dree.scan(source, options), null, tabs);
            if (show) {
                console.log(tree);
            }
            if (dest) {
                writeFileSync(dest, tree);
            }
        }
    )
    .demandCommand(1, 'You must use either parse of scan command')
    .options({
        'dest': {
            alias: 'd',
            describe: 'The path of the output file destination. If not specified, in any case the result will be printed on the command line.',
            type: 'string'
        },
        'show': {
            alias: 's',
            default: false,
            describe: 'Whether you want to print the result on the command line. This will be ignored and set to true if no destination is specified.',
            type: 'boolean'
        },
        'stat': {
            default: false,
            describe: 'Whether you want the fs.stat included in the json result',
            type: 'boolean',
            hidden: true
        },
        'normalize': {
            default: false,
            describe: 'Whether you want to normalize the path in the json result',
            type: 'boolean',
            hidden: true
        },
        'symbolic-links': {
            default: true,
            describe: 'Whether you want to consider symbolic links during the elaboration, could not work on windows',
            type: 'boolean',
            hidden: true
        },
        'follow-links': {
            default: false,
            describe: 'Whether you want to follow symbolic links during the elaboration, could not work on windows',
            type: 'boolean',
            hidden: true
        },
        'size-in-bytes': {
            default: true,
            describe: 'Whether you want to include the size in bytes in the json result',
            type: 'boolean',
            hidden: true
        },
        'size': {
            default: true,
            describe: 'Whether you want to include the size in a proper unit in the json result',
            type: 'boolean',
            hidden: true
        },
        'hash': {
            default: true,
            describe: 'Whether you want to include the hash in the json result',
            type: 'boolean',
            hidden: true
        },
        'hash-algorithm': {
            default: 'md5',
            describe: 'The hash algorithm that you want to use for the hash in the json result',
            type: 'string',
            choices: ['md5', 'sha1'],
            hidden: true
        },
        'hash-encoding': {
            default: 'hex',
            describe: 'The hash encoding that you want to use for the hash in the json result',
            type: 'string',
            choiches: ['hex', 'base64', 'latin1'],
            hidden: true
        },
        'show-hidden': {
            default: true,
            describe: 'Whether you want to consider hidden files during the elaboration',
            type: 'boolean',
            hidden: true
        },
        'depth': {
            default: undefined,
            describe: 'The max depth wich could be reached during the elaboration from the given folder',
            type: 'number',
            hidden: true
        },
        'exclude': {
            describe: 'An array of strings (glob patterns) or regex (just write them as you would with js, e.g. /^[a-b]*$/g) whose all matched path will not be considered during the elaboration',
            type: 'array',
            hidden: true
        },
        'matches': {
            describe: 'An array of strings (glob patterns) or regex (just write them as you would with js, e.g. /^[a-b]*$/g) and all the non-matching paths will not be considered by the algorithm. Note: All the ancestors of a matching node will be added',
            type: 'array',
            hidden: true
        },
        'extensions': {
            describe: 'An array of strings containing all the extensions wich will be considered',
            type: 'array',
            hidden: true
        },
        'empty-directory': {
            default: false,
            describe: 'Whether you want to include the property isEmpty in the result',
            type: 'boolean',
            hidden: true
        },
        'exclude-empty-directories': {
            default: false,
            describe: 'Whether you want to exclude all the empty directories from the result, even if they contains nodes excluded by other options',
            type: 'boolean',
            hidden: true
        },
        'sorted': {
            default: undefined,
            describe: 'Whether you want the result to contain values sorted with a dree pre-defined sorting method. \'ascending\' or \'descending\' are kept for retrocompatibility. If not specified, the result values are not ordered.',
            type: 'string',
            choices: [...Object.values(SortMethodPredefined), 'ascending', 'descending'],
            hidden: true,
        },
        'descendants': {
            default: false,
            describe: 'Whether you want the result to contain the number of descendants for each node',
            type: 'boolean',
            hidden: true,
        },
        'descendants-ignore-directories': {
            default: false,
            describe: 'Whether you want the result directories to be ignored when calculating the number of descendants',
            type: 'boolean',
            hidden: true,
        },
        'skip-errors': {
            default: true,
            describe: 'Whether you want to skip folders and files wich give errors during the execution',
            type: 'boolean',
            hidden: true
        },
        'options': {
            alias: 'o',
            describe: 'A path to a json config file. If an option is both on the file and in the command, the command one will be considered',
            config: true
        }
    })
    .showHidden('all-options')
    .epilogue('For more information, find our manual at https://github.com/euberdeveloper/dree#readme')
    .argv;