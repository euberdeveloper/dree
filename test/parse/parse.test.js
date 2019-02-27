module.exports = (expect, dree, path) => {

    describe('Test: parse function', function() {

        it('Should return the exported content of "test/parse/first.test.js"', function() {

            const result = dree.parse(path);
            const expected = require('./first.test');
            expect(result).to.equal(expected);

        });

        it('Should return the exported content of "test/parse/second.test.js"', function() {

            const options = {
                extensions: [ '', 'ts', 'txt' ],
                symbolicLinks: false
            };

            const result = dree.parse(path, options);
            const expected = require('./second.test');
            expect(result).to.equal(expected);

        });

        it('Should return the exported content of "test/parse/second.test.js"', function() {

            const options = {
                depth: 2,
                exclude: /firebase/,
                showHidden: 'false'
            };

            const result = dree.parse(path, options);
            const expected = require('./third.test');
            expect(result).to.equal(expected);
        });

    });

}