module.exports = (expect, fs, dree, path) => {

    describe('Test: scanAsync function', async function () {

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

        function orderTree(node) {
            function compareNode(x, y) {
                if (x.name === y.name) {
                    return 0;
                }
                else if (x.name > y.name) {
                    return 1;
                }
                else {
                    return -1;
                }
            }

            if (node.type === 'directory') {
                delete node.hash;
                if (node.children !== undefined) {
                    const orderedChildren = node.children.sort((x, y) => compareNode(x, y));
                    node.children = [...orderedChildren];
                    node.children.forEach(child => orderTree(child));
                }
            }
        }

        function parsePath(expected, normalize) {
            if (platform === 'windows') {
                if (normalize) {
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

        function getExpected(path, normalize) {
            let expected = fs.readFileSync(path, 'utf8');
            expected = parsePath(expected, normalize);
            const tree = JSON.parse(expected);
            orderTree(tree);
            expected = JSON.stringify(tree, null, 2);
            return expected;
        }

        function getResult(tree) {
            //console.log('before', JSON.stringify(tree, null, 2))

            orderTree(tree);
            //console.log('after', JSON.stringify(tree, null, 2))

            return JSON.stringify(tree, null, 2);
        }

        it(`Should return the content of "test/scan/${platform}/first.test.json"`, async function () {

            const result = getResult(await dree.scanAsync(path));
            const expected = getExpected(`test/scan/${platform}/first.test.json`);
            expect(result).to.equal(expected);

        });

        it(`Should return the content of "test/scan/${platform}/second.test.json"`, async function () {

            const options = {
                extensions: ['', 'ts', 'json']
            };

            const result = getResult(await dree.scanAsync(path, options));
            const expected = getExpected(`test/scan/${platform}/second.test.json`);
            expect(result).to.equal(expected);

        });

        it(`Should return the content of "test/scan/${platform}/third.test.json"`, async function () {

            const options = {
                extensions: ['', 'ts', 'json'],
                symbolicLinks: false
            };

            const result = getResult(await dree.scanAsync(path, options));
            const expected = getExpected(`test/scan/${platform}/third.test.json`);
            expect(result).to.equal(expected);

        });

        it(`Should return the content of "test/scan/${platform}/fourth.test.json"`, async function () {

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

            const result = getResult(await dree.scanAsync(path, options));
            const expected = getExpected(`test/scan/${platform}/fourth.test.json`, true);
            expect(result).to.equal(expected);

        });

        it(`Should return the content of "test/scan/${platform}/fifth.test.json" and compute folders and files sizes`, async function () {

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

            const result = getResult(await dree.scanAsync(path, options, filesCallback, foldersCallback));
            const expected = getExpected(`test/scan/${platform}/fifth.test.json`);
            expect(result).to.equal(expected);
            switch (platform) {
                case 'windows':
                    expect(filesSize).to.equal(60);
                    expect(foldersSize).to.equal(0);
                    break;
                case 'linux':
                    expect(filesSize).to.equal(49);
                    expect(foldersSize).to.equal(24586);
                    break;
            }
        });

        it(`Should return the content of "test/scan/${platform}/fifth.test.json" and compute folders and files sizes by using promises callbacks`, async function () {

            const options = {
                depth: 2,
                exclude: /firebase/
            };

            let filesSize = 0, foldersSize = 0;
            const filesCallback = async (_dirTree, stat) => new Promise((resolve, _reject) => {
                filesSize += stat.size;
                setTimeout(resolve(), 10);
            });
            const foldersCallback = async (_dirTree, stat) => new Promise((resolve, _reject) => {
                foldersSize += stat.size;
                setTimeout(resolve(), 10);
            });

            const result = getResult(await dree.scanAsync(path, options, filesCallback, foldersCallback));
            const expected = getExpected(`test/scan/${platform}/fifth.test.json`);
            expect(result).to.equal(expected);
            switch (platform) {
                case 'windows':
                    expect(filesSize).to.equal(60);
                    expect(foldersSize).to.equal(0);
                    break;
                case 'linux':
                    expect(filesSize).to.equal(49);
                    expect(foldersSize).to.equal(24586);
                    break;
            }
        });

        it(`Should return the content of "test/scan/${platform}/sixth.test.json"`, async function () {

            const options = {
                depth: -1
            };

            const result = getResult(await dree.scanAsync(path, options));
            const expected = getExpected(`test/scan/${platform}/sixth.test.json`);

            expect(result).to.equal(expected);
        });

        it(`Should return the content of "test/scan/${platform}/seventh.test.json"`, async function () {

            const options = {
                depth: 2,
                exclude: [/firebase/]
            };

            const result = getResult(await dree.scanAsync(path, options));
            const expected = getExpected(`test/scan/${platform}/seventh.test.json`);

            expect(result).to.equal(expected);
        });

        it(`Should return the content of "test/scan/${platform}/eight.test.json"`, async function () {

            const options = {
                emptyDirectory: true,
                excludeEmptyDirectories: true,
                exclude: /.ts/
            };

            const result = getResult(await dree.scanAsync(path, options));
            const expected = getExpected(`test/scan/${platform}/eight.test.json`);

            expect(result).to.equal(expected);
        });

        it(`Should return the content of "test/scan/${platform}/ninth.test.json"`, async function () {

            const options = {
                sizeInBytes: false,
                size: true
            };

            const result = getResult(await dree.scanAsync(path, options));
            const expected = getExpected(`test/scan/${platform}/ninth.test.json`);

            expect(result).to.equal(expected);
        });

        it(`Should return the content of "test/scan/${platform}/tenth.test.json"`, async function () {

            const options = {
                followLinks: true
            };

            const result = getResult(await dree.scanAsync(path, options));
            const expected = getExpected(`test/scan/${platform}/tenth.test.json`);

            expect(result).to.equal(expected);
        });

        it(`Should return the content of "test/scan/${platform}/eleventh.test.json"`, async function () {

            const options = {
                matches: process.platform === 'win32' ? /^.*\\f\w+(\.\w+)?$/ : /^.*\/f\w+(\.\w+)?$/
            };

            const result = getResult(await dree.scanAsync(path, options));
            const expected = getExpected(`test/scan/${platform}/eleventh.test.json`);

            expect(result).to.equal(expected);
        });

        it(`Should return the content of "test/scan/${platform}/twelfth.test.json"`, async function () {

            const options = {
                matches: process.platform === 'win32' ? [/^.*\\f\w+(\.\w+)?$/, /^.*\\\w+s\w(\.\w+)?$/] : [/^.*\/f\w+(\.\w+)?$/, /^.*\/\w+s\w(\.\w+)?$/]
            };

            const result = getResult(await dree.scanAsync(path, options));
            const expected = getExpected(`test/scan/${platform}/twelfth.test.json`);

            expect(result).to.equal(expected);
        });

        it(`Should return null`, async function () {

            const wrongPath = 'wrong';

            const result = await dree.scanAsync(wrongPath);
            const expected = null;

            expect(result).to.equal(expected);

        });

        it(`Should throw an error`, async function () {

            const wrongPath = 'wrong';
            const options = {
                skipErrors: false
            }; 

            const willThrow = async function() {
                await dree.scanAsync(wrongPath, options);
            }

            expect(willThrow()).to.be.rejected;

        });

    });

}