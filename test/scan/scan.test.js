module.exports = (expect, fs, dree, path) => {

    describe('Test: scan function', function() {

        const isWin = process.platform === 'win32'

        function parsePath(expected, normalize) {
            if(isWin) {
                if(normalize) {
                    expected = expected.replace(/PATH/g, process.cwd().replace(/\\/g, '/'));
                }
                else {
                    expected = expected.replace(/PATH/g, process.cwd().replace(/\\/g, '\\\\'));
                }
            } 
            else {
                expected = expected.replace(/PATH/g, process.cwd()).replace(/\\\\/g, '\\').replace(/\\/g, '/');
            }
            return expected;
        } 

        function removeUndeterminedProperties(tree) {
            if(tree) {
                delete tree.hash;
                delete tree.sizeInBytes;
                delete tree.size;
                if(isWin) delete tree.isSymbolicLink;
                if(tree.children) {
                    for(const child of tree.children) {
                        removeUndeterminedProperties(child);
                    }
                }
            }
            return tree;
        }

        function getExpected(path, normalize, undetermined) {
            let expected = fs.readFileSync(path, 'utf8');
            expected = parsePath(expected, normalize);
            if(undetermined) {
                expected = JSON.stringify(removeUndeterminedProperties(JSON.parse(expected)));
            }
            return expected;
        }

        function getResult(tree, remove) {
            return JSON.stringify(remove ? removeUndeterminedProperties(tree) : tree);
        }

        it('Should return the content of "test/scan/first.test.json"', function() {

            const result = getResult(dree.scan(path), true);
            const expected = getExpected('test/scan/first.test.json', false, true);
            expect(result).to.equal(expected);

        });

        it('Should return the content of "test/scan/second.test.json"', function() {

            const options = {
                extensions: [ '', 'ts', 'json' ]
            };

            const result = getResult(dree.scan(path, options), true);
            const expected = getExpected('test/scan/second.test.json', false, true);
            expect(result).to.equal(expected);

        });

        it('Should return the content of "test/scan/third.test.json"', function() {

            const options = {
                extensions: [ '', 'ts', 'json' ],
                symbolicLinks: false
            };

            const result = getResult(dree.scan(path, options), true);
            const expected = getExpected('test/scan/third.test.json', false, true);
            expect(result).to.equal(expected);

        });

        it('Should return the content of "test/scan/fourth.test.json"', function() {

            const options = {
                stat: false,
                normalize: true,
                sizeInBytes: true,
                size: true,
                hash: true,
                hashAlgorithm: 'sha1',
                hashEncoding: 'base64',
                showHidden: false
            };

            const result = getResult(dree.scan(path, options), true);
            const expected = getExpected('test/scan/fourth.test.json', true, true);
            expect(result).to.equal(expected);

        });

        it('Should return the content of "test/scan/fifth.test.json" and compute folders and files sizes', function() {

            const options = {
                depth: 2,
                exclude: /firebase/
            };

            let filesSize = 0, foldersSize = 0;
            const filesCallback = (_dirTree, stat) => {
                filesSize += stat.size;
            }
            const foldersCallback = (_dirTree, stat) => {
                foldersSize += stat.size;
            }

            const result = getResult(dree.scan(path, options, filesCallback, foldersCallback), true);            
            const expected = getExpected('test/scan/fifth.test.json', false, true);
            expect(result).to.equal(expected);
            if(isWin) {
                expect(filesSize).to.equal(5);
                expect(foldersSize).to.equal(0);
            }
        });

        it('Should return the content of "test/scan/sixth.test.json"', function() {

            const options = {
                depth: -1
            };

            const result = getResult(dree.scan(path, options), true);
            const expected = getExpected('test/scan/sixth.test.json', false, true);

            expect(result).to.equal(expected);
        });

        it('Should return the content of "test/scan/seventh.test.json"', function() {

            const options = {
                depth: 2,
                exclude: [/firebase/]
            };

            const result = getResult(dree.scan(path, options), true);
            const expected = getExpected('test/scan/seventh.test.json', false, true);

            expect(result).to.equal(expected);
        });

    });

}