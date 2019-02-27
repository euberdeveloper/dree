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
                showHidden: 'false'
            };

            const result = dree.parseTree(dree.scan(path), options);
            const expected = require('./third.test');
            expect(result).to.equal(expected);
        });

    });

}