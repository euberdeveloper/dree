module.exports = (expect, dree, path) => {

    describe('Test: parseTree function', function() {

        it('Should return the exported content of "test/parseTree/first.test.js"', function() {

            const result = dree.parseTree(dree.scan(path));
            const expected = require('./first.test');
            expect(result).to.equal(expected);

        });

        it('Should return the exported content of "test/parseTree/second.test.js"', function() {

            const options = {
                extensions: [ '', 'ts', 'txt' ],
                symbolicLinks: false
            };

            const result = dree.parseTree(dree.scan(path), options);
            const expected = require('./second.test');
            expect(result).to.equal(expected);

        });

        it('Should return the exported content of "test/parseTree/second.test.js"', function() {

            const options = {
                depth: 2,
                exclude: /firebase/,
                showHidden: false
            };

            const result = dree.parseTree(dree.scan(path), options);
            const expected = require('./third.test');
            expect(result).to.equal(expected);
        });

        it('Should return the exported content of "test/parseTree/fourth.test.js"', function() {

            const options = {
                depth: -1
            };

            const result = dree.parseTree(dree.scan(path), options);
            const expected = require('./fourth.test');
            expect(result).to.equal(expected);
        });

        it('Should return the exported content of "test/parseTree/fifth.test.js"', function() {

            const options = {
                depth: 2,
                exclude: [/firebase/],
                showHidden: false
            };

            const result = dree.parseTree(dree.scan(path), options);
            const expected = require('./fifth.test');
            expect(result).to.equal(expected);
        });

        it('Should return the exported content of "test/parseTree/sixth.test.js"', function() {

            const options = {
                followLinks: true
            };

            const result = dree.parseTree(dree.scan(path, options), options);
            const expected = require('./sixth.test');
            expect(result).to.equal(expected);
        });

    });

}