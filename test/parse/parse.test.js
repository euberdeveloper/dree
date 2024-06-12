export default function  (expect, dree, path) {

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

    async function importSample(filePath) {
        return (await import (filePath)).default
    }

    describe('Test: parse function', function () {

        it('Should return the exported content of "test/parse/first.test.js"', async function () {
            const result = dree.parse(path);
            const expected = await importSample(`./${platform}/first.test.js`);
            expect(result).to.equal(expected);
        });

        it('Should return the exported content of "test/parse/second.test.js"', async function () {

            const options = {
                extensions: ['', 'ts', 'txt'],
                symbolicLinks: false
            };

            const result = dree.parse(path, options);
            const expected = await importSample(`./${platform}/second.test.js`);
            expect(result).to.equal(expected);

        });

        it('Should return the exported content of "test/parse/third.test.js"', async function () {

            const options = {
                depth: 2,
                exclude: /firebase/,
                showHidden: false
            };

            const result = dree.parse(path, options);
            const expected = await importSample(`./${platform}/third.test.js`);
            expect(result).to.equal(expected);
        });

        it('Should return the exported content of "test/parse/fourth.test.js"', async function () {

            const options = {
                depth: -1,
                exclude: [/firebase/]
            };

            const result = dree.parse(path, options);
            const expected = await importSample(`./${platform}/fourth.test.js`);
            expect(result).to.equal(expected);
        });

        it('Should return the exported content of "test/parse/fifth.test.js"', async function () {

            const options = {
                followLinks: true
            };

            const result = dree.parse(path, options);
            const expected = await importSample(`./${platform}/fifth.test.js`);
            expect(result).to.equal(expected);
        });

        it('Should return the exported content of "test/parse/sixth.test.js"', async function () {

            const options = {
                sorted: true
            };

            const result = dree.parse(path, options);
            const expected = await importSample(`./${platform}/sixth.test.js`);
            expect(result).to.equal(expected);
        });

        it('Should return the exported content of "test/parse/seventh.test.js"', async function () {

            const options = {
                sorted: (x, y) => y.localeCompare(x)
            };

            const result = dree.parse(path, options);
            const expected = await importSample(`./${platform}/seventh.test.js`);
            expect(result).to.equal(expected);
        });

        it(`Should return the content of "test/scan/${platform}/eighth.test.js"`, async function () {

            const options = {
                exclude: [/firebase/, '/**/notes.*']
            };

            const result = dree.parse(path, options);
            const expected = await importSample(`./${platform}/eighth.test.js`);

            expect(result).to.equal(expected);

        });

        it(`Should return the content of "test/scan/${platform}/ninth.test.js"`, async function () {

            const options = {
                exclude: '/**/firebase.*'
            };

            const result = dree.parse(path, options);
            const expected = await importSample(`./${platform}/ninth.test.js`);

            expect(result).to.equal(expected);

        });

        it(`Should return the content of "test/scan/${platform}/tenth.test.js"`, async function () {

            const options = {
                sorted: 'alpha'
            };

            const result = dree.parse(path, options);
            const expected = await importSample(`./${platform}/tenth.test.js`);

            expect(result).to.equal(expected);

        });

        it(`Should return the content of "test/scan/${platform}/eleventh.test.js"`, async function () {

            const options = {
                sorted: 'antialpha'
            };

            const result = dree.parse(path, options);
            const expected = await importSample(`./${platform}/eleventh.test.js`);

            expect(result).to.equal(expected);

        });

        it(`Should return the content of "test/scan/${platform}/twelfth.test.js"`, async function () {

            const options = {
                sorted: 'alpha-insensitive'
            };

            const result = dree.parse(path, options);
            const expected = await importSample(`./${platform}/twelfth.test.js`);

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

        it(`Should return the content of "test/scan/${platform}/thirteenth.test.js"`, async function () {

            const options = {
                sorted: 'antialpha-insensitive'
            };

            const result = dree.parse(path, options);
            const expected = await importSample(`./${platform}/thirteenth.test.js`);

            expect(result).to.equal(expected);

        });

    });

}