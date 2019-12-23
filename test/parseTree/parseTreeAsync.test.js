module.exports = (expect, dree, path) => {

    let platform = null;
    switch (process.platform) {
        case 'win32':
            platform = 'windows';
            break;
        case 'linux':
            platform = 'linux';
            break;
        case 'darwin':
            platform = 'mac';
            break;
    }

    describe('Test: parseTreeAsync function', async function() {

        it('Should return the exported content of "test/parseTree/first.test.js"', async function() {

            const result = await dree.parseTreeAsync(dree.scan(path));
            const expected = require(`./${platform}/first.test`);
            expect(result).to.equal(expected);

        });

        it('Should return the exported content of "test/parseTree/second.test.js"', async function() {

            const options = {
                extensions: [ '', 'ts', 'txt' ],
                symbolicLinks: false
            };

            const result = await dree.parseTreeAsync(dree.scan(path), options);
            const expected = require(`./${platform}/second.test`);
            expect(result).to.equal(expected);

        });

        it('Should return the exported content of "test/parseTree/third.test.js"', async function() {

            const options = {
                depth: 2,
                exclude: /firebase/,
                showHidden: false
            };

            const result = await dree.parseTreeAsync(dree.scan(path), options);
            const expected = require(`./${platform}/third.test`);
            expect(result).to.equal(expected);
        });

        it('Should return the exported content of "test/parseTree/fourth.test.js"', async function() {

            const options = {
                depth: -1
            };

            const result = await dree.parseTreeAsync(dree.scan(path), options);
            const expected = require(`./${platform}/fourth.test`);
            expect(result).to.equal(expected);
        });

        it('Should return the exported content of "test/parseTree/fifth.test.js"', async function() {

            const options = {
                depth: 2,
                exclude: [/firebase/],
                showHidden: false
            };

            const result = await dree.parseTreeAsync(dree.scan(path), options);
            const expected = require(`./${platform}/fifth.test`);
            expect(result).to.equal(expected);
        });

        it('Should return the exported content of "test/parseTree/sixth.test.js"', async function() {

            const options = {
                followLinks: true
            };

            const result = await dree.parseTreeAsync(dree.scan(path, options), options);
            const expected = require(`./${platform}/sixth.test`);
            expect(result).to.equal(expected);
        });

    });

}