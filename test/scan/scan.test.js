module.exports = (expect, fs, dree, path) => {

    describe('Test: scan function', () => {

        before('Checking if should run scan tests', function() {
            if(!process.argv.find(arg => arg === '--scan')) {
                this.skip();
            }
        });

        it('Should return the content of "test/scan/first.test.json"', () => {

            const result = JSON.stringify(dree.scan(path));
            const expected = fs.readFileSync('test/scan/first.test.json', 'utf8');
            expect(result).to.equal(expected);

        });

        it('Should return the content of "test/scan/second.test.json"', () => {

            const options = {
                extensions: [ '', 'ts', 'json' ]
            };

            const result = JSON.stringify(dree.scan(path, options));
            const expected = fs.readFileSync('test/scan/second.test.json', 'utf8');
            expect(result).to.equal(expected);

        });

        it('Should return the content of "test/scan/third.test.json"', () => {

            const options = {
                extensions: [ '', 'ts', 'json' ],
                symbolicLinks: false
            };

            const result = JSON.stringify(dree.scan(path, options));
            const expected = fs.readFileSync('test/scan/third.test.json', 'utf8');
            expect(result).to.equal(expected);

        });

        it('Should return the content of "test/scan/fourth.test.json"', () => {

            const options = {
                stat: false,
                normalize: true,
                sizeInBytes: true,
                size: true,
                hash: true,
                hashAlgorithm: 'sha1',
                hashEncoding: 'base64',
                showHidden: 'false'
            };

            const result = JSON.stringify(dree.scan(path, options));
            const expected = fs.readFileSync('test/scan/fourth.test.json', 'utf8');
            expect(result).to.equal(expected);

        });

        it('Should return the content of "test/scan/fifth.test.json" and compute folders and files sizes', () => {

            const options = {
                depth: 2,
                exclude: /firebase/
            };

            let filesSize = 0, foldersSize = 0;
            const filesCallback = (dirTree, _stat) => {
                filesSize += dirTree.sizeInBytes;
            }
            const foldersCallback = (dirTree, _stat) => {
                foldersSize += dirTree.sizeInBytes;
            }

            const result = JSON.stringify(dree.scan(path, options, filesCallback, foldersCallback));
            const expected = fs.readFileSync('test/scan/fifth.test.json', 'utf8');
            expect(result).to.equal(expected);
            expect(filesSize).to.equal(5);
            expect(foldersSize).to.equal(10);

        });

    });

}