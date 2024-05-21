'use strict';
import fs from 'node:fs';
import os from 'node:os';

import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

import * as dree from '../dist/lib/index.js';

import testScan from './scan/scan.test.mjs';
import testScanAsync from './scan/scanAsync.test.mjs';
import testParse from './parse/parse.test.mjs';
import testParseAsync from './parse/parseAsync.test.mjs';
import testParseTree from './parseTree/parseTree.test.mjs';
import testParseTreeAsync from './parseTree/parseTreeAsync.test.mjs';

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