const dree = require('../lib/index');
const fs = require('fs');

const options = {
    stat: false,
    hash: true,
    sizeInBytes: false,
    size: true,
    normalize: true
};

const file = (dree, stat) => {
    console.log("dree file " + dree.name + " created at " + stat.ctime);
}
const dir = (dree, stat) => {
    console.log("dree dir " + dree.name + " created at " + stat.ctime);
}

const data = JSON.stringify(dree.dree('test/sample', options, file, dir));

fs.writeFile('test/output.json', data, error => {
    if(error) {
        console.error('error in witing output', error);
    }
    else {
        console.log('file written');
    }
});
