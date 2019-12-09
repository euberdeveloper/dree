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

        it('Should return the exported content of "test/parse/third.test.js"', function() {

            const options = {
                depth: 2,
                exclude: /firebase/,
                showHidden: false
            };

            const result = dree.parse(path, options);
            const expected = require('./third.test');
            expect(result).to.equal(expected);
        });

        it('Should return the exported content of "test/parse/fourth.test.js"', function() {

            const options = {
                depth: -1,
                exclude: [/firebase/]
            };

            const result = dree.parse(path, options);
            const expected = require('./fourth.test');
            expect(result).to.equal(expected);
        });

        it('Should return the exported content of "test/parse/fifth.test.js"', function() {

            const options = {
                followLinks: true
            };

            const result = dree.parse(path, options);
            const expected = require('./fifth.test');
            expect(result).to.equal(expected);
        });

    });

}