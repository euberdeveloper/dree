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

    describe('Test: parse function', function () {

        it('Should return the exported content of "test/parse/first.test.js"', function () {

            const result = dree.parse(path);
            const expected = require(`./${platform}/first.test`);
            expect(result).to.equal(expected);

        });

        it('Should return the exported content of "test/parse/second.test.js"', function () {

            const options = {
                extensions: ['', 'ts', 'txt'],
                symbolicLinks: false
            };

            const result = dree.parse(path, options);
            const expected = require(`./${platform}/second.test`);
            expect(result).to.equal(expected);

        });

        it('Should return the exported content of "test/parse/third.test.js"', function () {

            const options = {
                depth: 2,
                exclude: /firebase/,
                showHidden: false
            };

            const result = dree.parse(path, options);
            const expected = require(`./${platform}/third.test`);
            expect(result).to.equal(expected);
        });

        it('Should return the exported content of "test/parse/fourth.test.js"', function () {

            const options = {
                depth: -1,
                exclude: [/firebase/]
            };

            const result = dree.parse(path, options);
            const expected = require(`./${platform}/fourth.test`);
            expect(result).to.equal(expected);
        });

        it('Should return the exported content of "test/parse/fifth.test.js"', function () {

            const options = {
                followLinks: true
            };

            const result = dree.parse(path, options);
            const expected = require(`./${platform}/fifth.test`);
            expect(result).to.equal(expected);
        });

        it('Should return the exported content of "test/parse/sixth.test.js"', function () {

            const options = {
                sorted: true
            };

            const result = dree.parse(path, options);
            const expected = require(`./${platform}/sixth.test`);
            expect(result).to.equal(expected);
        });

        it('Should return the exported content of "test/parse/seventh.test.js"', function () {

            const options = {
                sorted: (x, y) => y.localeCompare(x)
            };

            const result = dree.parse(path, options);
            const expected = require(`./${platform}/seventh.test`);
            expect(result).to.equal(expected);
        });

        it(`Should return the content of "test/scan/${platform}/eighth.test.json"`, function () {

            const options = {
                exclude: [/firebase/, '/**/notes.*']
            };

            const result = dree.parse(path, options);
            const expected = require(`./${platform}/eighth.test`);

            expect(result).to.equal(expected);

        });

        it(`Should return the content of "test/scan/${platform}/ninth.test.json"`, function () {

            const options = {
                exclude: '/**/firebase.*'
            };

            const result = dree.parse(path, options);
            const expected = require(`./${platform}/ninth.test`);

            expect(result).to.equal(expected);

        });

        it(`Should return the content of "test/scan/${platform}/tenth.test.json"`, function () {

            const options = {
                sorted: 'alpha'
            };

            const result = dree.parse(path, options);
            const expected = require(`./${platform}/tenth.test`);

            expect(result).to.equal(expected);

        });

        it(`Should return the content of "test/scan/${platform}/eleventh.test.json"`, function () {

            const options = {
                sorted: 'antialpha'
            };

            const result = dree.parse(path, options);
            const expected = require(`./${platform}/eleventh.test`);

            expect(result).to.equal(expected);

        });

        it(`Should return the content of "test/scan/${platform}/twelfth.test.json"`, function () {

            const options = {
                sorted: 'alpha-insensitive'
            };

            const result = dree.parse(path, options);
            const expected = require(`./${platform}/twelfth.test`);

            expect(result).to.equal(expected);

        });

        it(`Should work with ~ and homeShortcut`, function () {

            const options = {
                depth: 1
            };

            const errResult = dree.parse('~', options);
            expect(errResult).to.equal(null);

            options.homeShortcut = true;
            const result = dree.parse('~', options);
            expect(result).to.not.equal(null);

        });

        it(`Should return the content of "test/scan/${platform}/thirteenth.test.json"`, function () {

            const options = {
                sorted: 'antialpha-insensitive'
            };

            const result = dree.parse(path, options);
            const expected = require(`./${platform}/thirteenth.test`);

            expect(result).to.equal(expected);

        });

    });

}