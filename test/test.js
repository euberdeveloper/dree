'use strict';
import fs from 'node:fs';
import os from 'node:os';

import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

import * as dree from '../dist/lib/index.js';

import testScan from './scan/scan.test.js';
import testScanAsync from './scan/scanAsync.test.js';
import testParse from './parse/parse.test.js';
import testParseAsync from './parse/parseAsync.test.js';
import testParseTree from './parseTree/parseTree.test.js';
import testParseTreeAsync from './parseTree/parseTreeAsync.test.js';

chai.use(chaiAsPromised);
const { expect } = chai;

describe('Dree module tests', async function() {
    const path = 'test/sample';
    testScan(expect, fs, os, dree, path);
    testScanAsync(expect, fs, os, dree, path);
    testParse(expect, dree, path);
    testParseAsync(expect, dree, path);
    testParseTree(expect, dree, path);
    testParseTreeAsync(expect, dree, path);
});