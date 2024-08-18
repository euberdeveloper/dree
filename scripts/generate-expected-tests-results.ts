import fs from 'node:fs';
import path from 'node:path';
import { 
    scan,
    scanAsync,
    parse,
    parseAsync,
    parseTree,
    parseTreeAsync,
    SortMethodPredefined,
    type ScanOptions,
    type ParseOptions, 
    type Dree,
    PostSortMethodPredefined,
    ASCII_SYMBOLS
} from '../source/lib/index.js';

/*******************************************************
** Generates the expected test results reflecting the **
** current transpiled version of dree, for a given    **
** platform (linux, windows or mac).                  **
*******************************************************/

const args = process.argv.slice(2);
const platform = args[0];

if (!['linux', 'windows', 'mac'].includes(platform)) {
    console.error('Invalid platform: ' + platform);
    console.log("Usage: [SCRIPT_PATH] <platform>\nWhere platform is one of: linux, windows or mac");
}

interface TestDetails<T> {
    name: string;
    opt: T;
}

/* SCAN and SCAN ASYNC */

type ScanTestDetails = TestDetails<ScanOptions>;

const scanTestsDetails: ScanTestDetails[] = [
    {
        name: 'first',
        opt: {}
    },
    {
        name: 'second',
        opt: {
            extensions: ['', 'ts', 'json']
        }
    },
    {
        name: 'third',
        opt: {
            extensions: ['', 'ts', 'json'],
            symbolicLinks: false
        }
    },
    {
        name: 'fourth',
        opt: {
            stat: false,
            normalize: true,
            sizeInBytes: true,
            size: true,
            hash: true,
            hashAlgorithm: 'sha1',
            hashEncoding: 'base64',
            showHidden: false
        }
    },
    {
        name: 'fifth',
        opt: {
            depth: 2,
            exclude: /firebase/
        }
    },
    {
        name: 'sixth',
        opt: {
            depth: -1
        }
    },
    {
        name: 'seventh',
        opt: {
            depth: 2,
            exclude: [/firebase/]
        }
    },
    {
        name: 'eight',
        opt: {
            emptyDirectory: true,
            excludeEmptyDirectories: true,
            exclude: /.ts/
        }
    },
    {
        name: 'ninth',
        opt: {
            sizeInBytes: false,
            size: true
        }
    },
    {
        name: 'tenth',
        opt: {
            followLinks: true
        }
    },
    {
        name: 'eleventh',
        opt: {
            matches: platform === 'windows' ? /^.*\\f\w+(\.\w+)?$/ : /^.*\/f\w+(\.\w+)?$/
        }
    },
    {
        name: 'twelfth',
        opt: {
            matches: platform === 'windows' ? [/^.*\\f\w+(\.\w+)?$/, /^.*\\\w+s\w(\.\w+)?$/] : [/^.*\/f\w+(\.\w+)?$/, /^.*\/\w+s\w(\.\w+)?$/]
        }
    },
    {
        name: 'thirteenth',
        opt: {
            sorted: true
        }
    },
    {
        name: 'fourteenth',
        opt: {
            sorted: (x, y) => y.localeCompare(x)
        }
    },
    {
        name: 'fifteenth',
        opt: {
            descendants: true
        }
    },
    {
        name: 'sixteenth',
        opt: {
            descendants: true,
            descendantsIgnoreDirectories: true,
            exclude: [/firebase/]
        }
    },
    {
        name: 'seventeenth',
        opt: {
            exclude: [/firebase/, '/**/notes.*']
        }
    },
    {
        name: 'eighteenth',
        opt: {
            exclude: ['/**/firebase.*']
        }
    },
    {
        name: 'nineteenth',
        opt: {
            sorted: SortMethodPredefined.ALPHABETICAL
        }
    },
    {
        name: 'twentieth',
        opt: {
            sorted: SortMethodPredefined.ALPHABETICAL_REVERSE
        }
    },
    {
        name: 'twentyfirst',
        opt: {
            sorted: SortMethodPredefined.ALPHABETICAL_INSENSITIVE
        }
    },
    {
        name: 'twentysecond',
        opt: {
            sorted: SortMethodPredefined.ALPHABETICAL_INSENSITIVE_REVERSE
        }
    },
    {
        name: 'twentythird',
        opt: {
            postSorted: PostSortMethodPredefined.FILES_FIRST
        }
    }
];

function purgePath(data: Dree): Dree {
    data.path = 'PATH' + data.path.slice(process.cwd().length);
    if (data.type === 'directory' && data.children) {
        data.children.forEach(child => purgePath(child));
    }
    return data;
}

function generateScan(testDetails: ScanTestDetails) {
    const text = JSON.stringify(purgePath(scan(path.join(process.cwd(), 'test', 'sample'), testDetails.opt)), null, 2);
    fs.writeFileSync(path.join(process.cwd(), 'test', 'scan', platform, `${testDetails.name}.test.json`), text);
}
scanTestsDetails.forEach(testDetails => {
    generateScan(testDetails);
});

/* PARSE and PARSE ASYNC */

type ParseTestDetails = TestDetails<ParseOptions>;

const parseTestsDetails: ParseTestDetails[] = [
    {
        name: 'first',
        opt: {}
    },
    {
        name: 'second',
        opt: {
            extensions: ['', 'ts', 'txt'],
            symbolicLinks: false
        }
    },
    {
        name: 'third',
        opt: {
            depth: 2,
            exclude: /firebase/,
            showHidden: false
        }
    },
    {
        name: 'fourth',
        opt: {
            depth: -1,
            exclude: [/firebase/]
        }
    },
    {
        name: 'fifth',
        opt: {
            followLinks: true
        }
    },
    {
        name: 'sixth',
        opt: {
            sorted: true
        }
    },
    {
        name: 'seventh',
        opt: {
            sorted: (x, y) => y.localeCompare(x)
        }
    },
    {
        name: 'eighth',
        opt: {
            exclude: [/firebase/, '/**/notes.*']
        }
    },
    {
        name: 'ninth',
        opt: {
            exclude: ['/**/firebase.*']
        }
    },
    {
        name: 'tenth',
        opt: {
            sorted: SortMethodPredefined.ALPHABETICAL
        }
    },
    {
        name: 'eleventh',
        opt: {
            sorted: SortMethodPredefined.ALPHABETICAL_REVERSE
        }
    },
    {
        name: 'twelfth',
        opt: {
            sorted: SortMethodPredefined.ALPHABETICAL_INSENSITIVE
        }
    },
    {
        name: 'thirteenth',
        opt: {
            sorted: SortMethodPredefined.ALPHABETICAL_INSENSITIVE_REVERSE
        }
    },
    {
        name: 'fourteenth',
        opt: {
            symbols: ASCII_SYMBOLS
        }
    }
];
function generateParse(testDetails: ParseTestDetails) {
    const tree = parse(path.join(process.cwd(), 'test', 'sample'), testDetails.opt);
    const text = 'export default\n`' + tree.replaceAll('`', '\\`')  + '`;';
    fs.writeFileSync(path.join(process.cwd(), 'test', 'parse', platform, `${testDetails.name}.test.js`), text);
}
parseTestsDetails.forEach(testDetails => {
    generateParse(testDetails);
});

/* PARSE TREE */

const parseTreeTestsDetails: ParseTestDetails[] = [
    {
        name: 'first',
        opt: {}
    },
    {
        name: 'second',
        opt: {
            extensions: ['', 'ts', 'txt'],
            symbolicLinks: false
        }
    },
    {
        name: 'third',
        opt: {
            depth: 2,
            exclude: /firebase/,
            showHidden: false
        }
    },
    {
        name: 'fourth',
        opt: {
            depth: -1
        }
    },
    {
        name: 'fifth',
        opt: {
            depth: 2,
            exclude: [/firebase/],
            showHidden: false
        }
    },
    {
        name: 'sixth',
        opt: {
            followLinks: true
        }
    },
    {
        name: 'seventh',
        opt: {
            sorted: true
        }
    },
    {
        name: 'eighth',
        opt: {
            sorted: (x, y) => y.localeCompare(x)
        }
    },
    {
        name: 'ninth',
        opt: {
            exclude: [/firebase/, '/**/notes.*']
        }
    },
    {
        name: 'tenth',
        opt: {
            exclude: ['/**/firebase.*']
        }
    },
    {
        name: 'eleventh',
        opt: {
            sorted: SortMethodPredefined.ALPHABETICAL
        }
    },
    {
        name: 'twelfth',
        opt: {
            sorted: SortMethodPredefined.ALPHABETICAL_REVERSE
        }
    },
    {
        name: 'thirteenth',
        opt: {
            sorted: SortMethodPredefined.ALPHABETICAL_INSENSITIVE
        }
    },
    {
        name: 'fourteenth',
        opt: {
            sorted: SortMethodPredefined.ALPHABETICAL_INSENSITIVE_REVERSE
        }
    }
];
function generateParseTree(testDetails: ParseTestDetails) {
    const text = 'export default\n`' + parseTree(scan(path.join(process.cwd(), 'test', 'sample'), testDetails.opt), testDetails.opt) + '`;';
    fs.writeFileSync(path.join(process.cwd(), 'test', 'parseTree', platform, `${testDetails.name}.test.js`), text);
}
parseTreeTestsDetails.forEach(testDetails => {
    generateParseTree(testDetails);
});