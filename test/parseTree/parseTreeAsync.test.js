export default function (expect, dree, path) {

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

    describe('Test: parseTreeAsync function', async function () {

        it('Should return the exported content of "test/parseTree/first.test.js"', async function () {

            const result = await dree.parseTreeAsync(dree.scan(path));
            const expected = await importSample(`./${platform}/first.test.js`);
            expect(result).to.equal(expected);

        });

        it('Should return the exported content of "test/parseTree/second.test.js"', async function () {

            const options = {
                extensions: ['', 'ts', 'txt'],
                symbolicLinks: false
            };

            const result = await dree.parseTreeAsync(dree.scan(path), options);
            const expected = await importSample(`./${platform}/second.test.js`);
            expect(result).to.equal(expected);

        });

        it('Should return the exported content of "test/parseTree/third.test.js"', async function () {

            const options = {
                depth: 2,
                exclude: /firebase/,
                showHidden: false
            };

            const result = await dree.parseTreeAsync(dree.scan(path), options);
            const expected = await importSample(`./${platform}/third.test.js`);
            expect(result).to.equal(expected);
        });

        it('Should return the exported content of "test/parseTree/fourth.test.js"', async function () {

            const options = {
                depth: -1
            };

            const result = await dree.parseTreeAsync(dree.scan(path), options);
            const expected = await importSample(`./${platform}/fourth.test.js`);
            expect(result).to.equal(expected);
        });

        it('Should return the exported content of "test/parseTree/fifth.test.js"', async function () {

            const options = {
                depth: 2,
                exclude: [/firebase/],
                showHidden: false
            };

            const result = await dree.parseTreeAsync(dree.scan(path), options);
            const expected = await importSample(`./${platform}/fifth.test.js`);
            expect(result).to.equal(expected);
        });

        it('Should return the exported content of "test/parseTree/sixth.test.js"', async function () {

            const options = {
                followLinks: true
            };

            const result = await dree.parseTreeAsync(dree.scan(path, options), options);
            const expected = await importSample(`./${platform}/sixth.test.js`);
            expect(result).to.equal(expected);
        });

        it('Should return the exported content of "test/parseTree/seventh.test.js"', async function () {

            const options = {
                sorted: true
            };

            const result = await dree.parseTreeAsync(dree.scan(path, options), options);
            const expected = await importSample(`./${platform}/seventh.test.js`);
            expect(result).to.equal(expected);
        });

        it('Should return the exported content of "test/parseTree/eighth.test.js"', async function () {

            const options = {
                sorted: (x, y) => y.localeCompare(x)
            };

            const result = await dree.parseTreeAsync(dree.scan(path, options), options);
            const expected = await importSample(`./${platform}/eighth.test.js`);
            expect(result).to.equal(expected);
        });

        it(`Should return the content of "test/scan/${platform}/ninth.test.js"`, async function () {

            const options = {
                exclude: [/firebase/, '/**/notes.*']
            };

            const result = await dree.parseTreeAsync(dree.scan(path, options), options);
            const expected = await importSample(`./${platform}/ninth.test.js`);

            expect(result).to.equal(expected);

        });

        it(`Should return the content of "test/scan/${platform}/tenth.test.js"`, async function () {

            const options = {
                exclude: '/**/firebase.*'
            };

            const result = await dree.parseTreeAsync(dree.scan(path, options), options);
            const expected = await importSample(`./${platform}/tenth.test.js`);

            expect(result).to.equal(expected);

        });

        it(`Should return the content of "test/scan/${platform}/eleventh.test.js"`, async function () {

            const options = {
                sorted: 'alpha'
            };

            const result = await dree.parseTreeAsync(dree.scan(path, options), options);
            const expected = await importSample(`./${platform}/eleventh.test.js`);

            expect(result).to.equal(expected);

        });

        it(`Should return the content of "test/scan/${platform}/twelfth.test.js"`, async function () {

            const options = {
                sorted: 'antialpha'
            };

            const result = await dree.parseTreeAsync(dree.scan(path, options), options);
            const expected = await importSample(`./${platform}/twelfth.test.js`);

            expect(result).to.equal(expected);

        });

        it(`Should return the content of "test/scan/${platform}/thirteenth.test.js"`, async function () {

            const options = {
                sorted: 'alpha-insensitive'
            };

            const result = await dree.parseTreeAsync(dree.scan(path, options), options);
            const expected = await importSample(`./${platform}/thirteenth.test.js`);

            expect(result).to.equal(expected);

        });

        it(`Should return the content of "test/scan/${platform}/fourteenth.test.js"`, async function () {

            const options = {
                sorted: 'antialpha-insensitive'
            };

            const result = await dree.parseTreeAsync(dree.scan(path, options), options);
            const expected = await importSample(`./${platform}/fourteenth.test.js`);

            expect(result).to.equal(expected);

        });

    });

}