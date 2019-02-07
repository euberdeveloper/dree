const dree = require('../lib/index');
const fs = require('fs');

const options = {
    stat: false,
    hash: false,
    sizeInBytes: false,
    size: true,
    normalize: true,
    extensions: [ 'ts', 'json' ]
};

const file = (dree, stat) => {
    console.log("dree file " + dree.name + " created at " + stat.ctime);
}
const dir = (dree, stat) => {
    console.log("dree dir " + dree.name + " created at " + stat.ctime);
}

const data = JSON.stringify(dree.scan('test/sample', options, file, dir));

fs.writeFile('test/output.json', data, error => {
    if(error) {
        console.error('error in witing output', error);
    }
    else {
        console.log('file written');
    }
});
