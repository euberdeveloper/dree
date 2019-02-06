const fs = require('fs');
const dree = require('../lib/index');

fs.writeFile('output.txt', JSON.stringify(dree.dree('sample')), error => {
    if(error) {
        console.error('error in witing output', error);
    }
    else {
        console.log('file written');
    }
});
