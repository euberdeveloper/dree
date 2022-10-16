const fs = require('fs');
const path = require('path');
const dree = require('../dist/lib');

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

/* SCAN and SCAN ASYNC */

const scanOptions = [
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
        opt:
        {
            exclude: [/firebase/, 'notes']
        }
    },
    {
        name: 'eighteenth',
        opt:
        {
            exclude: ['firebase']
        }
    }
];

function purgePath(data) {
    data.path = 'PATH' + data.path.slice(process.cwd().length);
    if (data.type === 'directory' && data.children) {
        data.children.forEach(child => purgePath(child));
    }
    return data;
}

function generateScan(option) {
    const text = JSON.stringify(purgePath(dree.scan(path.join(process.cwd(), 'test', 'sample'), option.opt)), null, 2);
    fs.writeFileSync(path.join(process.cwd(), 'test', 'scan', platform, `${option.name}.test.json`), text);
}
scanOptions.forEach(option => {
    generateScan(option);
});

/* PARSE and PARSE ASYNC */

const parseOptions = [
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
            exclude: [/firebase/, 'notes']
        }
    },
    {
        name: 'ninth',
        opt: {
            exclude: ['firebase']
        }
    }
];
function generateParse(option) {
    const text = 'module.exports =\n`' + dree.parse(path.join(process.cwd(), 'test', 'sample'), option.opt) + '`;';
    fs.writeFileSync(path.join(process.cwd(), 'test', 'parse', platform, `${option.name}.test.js`), text);
}
parseOptions.forEach(option => {
    generateParse(option);
});

/* PARSE TREE */

const parseTreeOptions = [
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
            exclude: [/firebase/, 'notes']
        }
    },
    {
        name: 'tenth',
        opt: {
            exclude: ['firebase']
        }
    }
];
function generateParseTree(option) {
    const text = 'module.exports =\n`' + dree.parseTree(dree.scan(path.join(process.cwd(), 'test', 'sample'), option.opt), option.opt) + '`;';
    fs.writeFileSync(path.join(process.cwd(), 'test', 'parseTree', platform, `${option.name}.test.js`), text);
}
parseTreeOptions.forEach(option => {
    generateParseTree(option);
});