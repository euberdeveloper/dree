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

        it('Should return the exported content of "test/parse/first.test.mjs"', async function () {
            const result = dree.parse(path);
            const expected = await importSample(`./${platform}/first.test.mjs`);
            expect(result).to.equal(expected);
        });

        it('Should return the exported content of "test/parse/second.test.mjs"', async function () {

            const options = {
                extensions: ['', 'ts', 'txt'],
                symbolicLinks: false
            };

            const result = dree.parse(path, options);
            const expected = await importSample(`./${platform}/second.test.mjs`);
            expect(result).to.equal(expected);

        });

        it('Should return the exported content of "test/parse/third.test.mjs"', async function () {

            const options = {
                depth: 2,
                exclude: /firebase/,
                showHidden: false
            };

            const result = dree.parse(path, options);
            const expected = await importSample(`./${platform}/third.test.mjs`);
            expect(result).to.equal(expected);
        });

        it('Should return the exported content of "test/parse/fourth.test.mjs"', async function () {

            const options = {
                depth: -1,
                exclude: [/firebase/]
            };

            const result = dree.parse(path, options);
            const expected = await importSample(`./${platform}/fourth.test.mjs`);
            expect(result).to.equal(expected);
        });

        it('Should return the exported content of "test/parse/fifth.test.mjs"', async function () {

            const options = {
                followLinks: true
            };

            const result = dree.parse(path, options);
            const expected = await importSample(`./${platform}/fifth.test.mjs`);
            expect(result).to.equal(expected);
        });

        it('Should return the exported content of "test/parse/sixth.test.mjs"', async function () {

            const options = {
                sorted: true
            };

            const result = dree.parse(path, options);
            const expected = await importSample(`./${platform}/sixth.test.mjs`);
            expect(result).to.equal(expected);
        });

        it('Should return the exported content of "test/parse/seventh.test.mjs"', async function () {

            const options = {
                sorted: (x, y) => y.localeCompare(x)
            };

            const result = dree.parse(path, options);
            const expected = await importSample(`./${platform}/seventh.test.mjs`);
            expect(result).to.equal(expected);
        });

        it(`Should return the content of "test/scan/${platform}/eighth.test.mjs"`, async function () {

            const options = {
                exclude: [/firebase/, '/**/notes.*']
            };

            const result = dree.parse(path, options);
            const expected = await importSample(`./${platform}/eighth.test.mjs`);

            expect(result).to.equal(expected);

        });

        it(`Should return the content of "test/scan/${platform}/ninth.test.mjs"`, async function () {

            const options = {
                exclude: '/**/firebase.*'
            };

            const result = dree.parse(path, options);
            const expected = await importSample(`./${platform}/ninth.test.mjs`);

            expect(result).to.equal(expected);

        });

        it(`Should return the content of "test/scan/${platform}/tenth.test.mjs"`, async function () {

            const options = {
                sorted: 'alpha'
            };

            const result = dree.parse(path, options);
            const expected = await importSample(`./${platform}/tenth.test.mjs`);

            expect(result).to.equal(expected);

        });

        it(`Should return the content of "test/scan/${platform}/eleventh.test.mjs"`, async function () {

            const options = {
                sorted: 'antialpha'
            };

            const result = dree.parse(path, options);
            const expected = await importSample(`./${platform}/eleventh.test.mjs`);

            expect(result).to.equal(expected);

        });

        it(`Should return the content of "test/scan/${platform}/twelfth.test.mjs"`, async function () {

            const options = {
                sorted: 'alpha-insensitive'
            };

            const result = dree.parse(path, options);
            const expected = await importSample(`./${platform}/twelfth.test.mjs`);

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

        it(`Should return the content of "test/scan/${platform}/thirteenth.test.mjs"`, async function () {

            const options = {
                sorted: 'antialpha-insensitive'
            };

            const result = dree.parse(path, options);
            const expected = await importSample(`./${platform}/thirteenth.test.mjs`);

            expect(result).to.equal(expected);

        });

    });

}