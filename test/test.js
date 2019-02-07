const fs = require('fs');
const dree = require('../lib/index');

const options = {
    stat: false,
    hash: true,
    size: true,
    depth: 1
};

fs.writeFile('test/output.json', JSON.stringify(dree.dree('test/sample', options)), error => {
    if(error) {
        console.error('error in witing output', error);
    }
    else {
        console.log('file written');
    }
});
