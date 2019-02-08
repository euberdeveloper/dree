const dree = require('../lib/index');
const fs = require('fs');

const options = {
    stat: false,
    hash: false,
    sizeInBytes: false,
    size: false,
    normalize: true
};

const file = (dree, stat) => {
    console.log("found file " + dree.name + " created at " + stat.ctime);
}
const dir = (dree, stat) => {
    console.log("found dir " + dree.name + " created at " + stat.ctime);
}

const tree = dree.scan('test/sample', options, file, dir);

const data = JSON.stringify(tree);
fs.writeFile('test/output.json', data, error => {
    if(error) {
        console.error('\n\n\nerror in witing output', error);
    }
    else {
        console.log('\n\n\nfile written');
    }
});

console.log('\n\n\n' + dree.parse(tree, { showHidden: false }));
