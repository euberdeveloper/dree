'use strict';
const expect = require('chai').expect;
const fs = require('fs');
const dree = require('../dist/lib/index');

describe('Dree module tests', function() {
    const path = 'test/sample';
    require('./scan/scan.test')(expect, fs, dree, path);
    require('./scan/scanAsync.test')(expect, fs, dree, path);
    require('./parse/parse.test')(expect, dree, path);
    require('./parseTree/parseTree.test')(expect, dree, path);
});