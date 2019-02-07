const dree = require('../lib/index');
const fs = require('fs');

const options = {
    stat: false,
    hash: true,
    sizeInBytes: true,
    size: true,
    normalize: true
};

fs.writeFile('test/output.json', JSON.stringify(dree.dree('test/sample', options)), error => {
    if(error) {
        console.error('error in witing output', error);
    }
    else {
        console.log('file written');
    }
});
