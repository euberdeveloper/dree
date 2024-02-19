'use strict';
const fs = require('fs');
const os = require('os');
const dree = require('../dist/lib/index');

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

const expect = require('chai').expect;


describe('Dree module tests', function() {
    const path = 'test/sample';
    require('./scan/scan.test')(expect, fs, os, dree, path);
    require('./scan/scanAsync.test')(expect, fs, os, dree, path);
    require('./parse/parse.test')(expect, dree, path);
    require('./parse/parseAsync.test')(expect, dree, path);
    require('./parseTree/parseTree.test')(expect, dree, path);
    require('./parseTree/parseTreeAsync.test')(expect, dree, path);
});