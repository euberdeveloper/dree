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

    describe('Test: parseTree function', function () {

        it('Should return the exported content of "test/parseTree/first.test.js"', function () {

            const result = dree.parseTree(dree.scan(path));
            const expected = require(`./${platform}/first.test`);
            expect(result).to.equal(expected);

        });

        it('Should return the exported content of "test/parseTree/second.test.js"', function () {

            const options = {
                extensions: ['', 'ts', 'txt'],
                symbolicLinks: false
            };

            const result = dree.parseTree(dree.scan(path), options);
            const expected = require(`./${platform}/second.test`);
            expect(result).to.equal(expected);

        });

        it('Should return the exported content of "test/parseTree/third.test.js"', function () {

            const options = {
                depth: 2,
                exclude: /firebase/,
                showHidden: false
            };

            const result = dree.parseTree(dree.scan(path), options);
            const expected = require(`./${platform}/third.test`);
            expect(result).to.equal(expected);
        });

        it('Should return the exported content of "test/parseTree/fourth.test.js"', function () {

            const options = {
                depth: -1
            };

            const result = dree.parseTree(dree.scan(path), options);
            const expected = require(`./${platform}/fourth.test`);
            expect(result).to.equal(expected);
        });

        it('Should return the exported content of "test/parseTree/fifth.test.js"', function () {

            const options = {
                depth: 2,
                exclude: [/firebase/],
                showHidden: false
            };

            const result = dree.parseTree(dree.scan(path), options);
            const expected = require(`./${platform}/fifth.test`);
            expect(result).to.equal(expected);
        });

        it('Should return the exported content of "test/parseTree/sixth.test.js"', function () {

            const options = {
                followLinks: true
            };

            const result = dree.parseTree(dree.scan(path, options), options);
            const expected = require(`./${platform}/sixth.test`);
            expect(result).to.equal(expected);
        });

        it('Should return the exported content of "test/parseTree/seventh.test.js"', function () {

            const options = {
                sorted: true
            };

            const result = dree.parseTree(dree.scan(path, options), options);
            const expected = require(`./${platform}/seventh.test`);
            expect(result).to.equal(expected);
        });

        it('Should return the exported content of "test/parseTree/eighth.test.js"', function () {

            const options = {
                sorted: (x, y) => y.localeCompare(x)
            };

            const result = dree.parseTree(dree.scan(path, options), options);
            const expected = require(`./${platform}/eighth.test`);
            expect(result).to.equal(expected);
        });

        it(`Should return the content of "test/scan/${platform}/ninth.test.json"`, function () {

            const options = {
                exclude: [/firebase/, '/**/notes.*']
            };

            const result = dree.parseTree(dree.scan(path, options), options);
            const expected = require(`./${platform}/ninth.test`);

            expect(result).to.equal(expected);

        });

        it(`Should return the content of "test/scan/${platform}/tenth.test.json"`, function () {

            const options = {
                exclude: '/**/firebase.*'
            };

            const result = dree.parseTree(dree.scan(path, options), options);
            const expected = require(`./${platform}/tenth.test`);

            expect(result).to.equal(expected);

        });

        it(`Should return the content of "test/scan/${platform}/eleventh.test.json"`, function () {
            const options = {
                sorted: 'alpha'
            };

            const result = dree.parseTree(dree.scan(path, options), options);
            const expected = require(`./${platform}/eleventh.test`);

            expect(result).to.equal(expected);

        });

        it(`Should return the content of "test/scan/${platform}/twelfth.test.json"`, function () {
            const options = {
                sorted: 'antialpha'
            };

            const result = dree.parseTree(dree.scan(path, options), options);
            const expected = require(`./${platform}/twelfth.test`);

            expect(result).to.equal(expected);

        });

        it(`Should return the content of "test/scan/${platform}/thirteenth.test.json"`, function () {
            const options = {
                sorted: 'alpha-insensitive'
            };

            const result = dree.parseTree(dree.scan(path, options), options);
            const expected = require(`./${platform}/thirteenth.test`);

            expect(result).to.equal(expected);

        });

        it(`Should return the content of "test/scan/${platform}/fourteenth.test.json"`, function () {
            const options = {
                sorted: 'antialpha-insensitive'
            };

            const result = dree.parseTree(dree.scan(path, options), options);
            const expected = require(`./${platform}/fourteenth.test`);

            expect(result).to.equal(expected);

        });


    });

}