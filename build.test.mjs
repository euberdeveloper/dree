import fs from 'node:fs';
import { build } from 'esbuild';
import * as importMap from "esbuild-plugin-import-map";

import packageJson from './package.json' assert { type: 'json' };

async function loadImportMapForBundle(bundledPath) {
    importMap.clear();
    await importMap.load({
        imports: {
            '../dist/lib/index.js': bundledPath
        }
    });
}

function getExternalDependencies(allow = []) {
    const deps = packageJson.dependencies ? Object.keys(packageJson.dependencies).filter(dep => !allow.includes(dep)) : [];
    const peerDeps = packageJson.peerDependencies ? Object.keys(packageJson.peerDependencies).filter(dep => !allow.includes(dep)) : [];
    return [...deps, ...peerDeps];
}

async function buildModule() {
    const shared = {
        platform: 'node',
        entryPoints: ['test/test.js'],
        bundle: true,
        minify: false,
        treeShaking: false,
        sourcemap: true,
        external: getExternalDependencies(),
        define: {
            'process.env.__PARSE_TEST_RELATIVE_PATH__': `'../../../test/parse'`,
            'process.env.__PARSE_TREE_TEST_RELATIVE_PATH__': `'../../../test/parseTree'`,
        }
    };

    loadImportMapForBundle('../../../bundled/lib/commonjs/index.js');
    await build({
        ...shared,
        outfile: 'bundled/test/commonjs/index.js',
        format: 'cjs',
        plugins: [importMap.plugin()]
    });

    loadImportMapForBundle('../../../bundled/lib/esm/index.esm.js');
    await build({
        ...shared,
        outfile: 'bundled/test/esm/index.esm.js',
        format: 'esm',
        plugins: [importMap.plugin()]
    });
}

function generateCommonjsPackageJson() {
    const packageJsonCommonJs = JSON.stringify({ ...packageJson, type: undefined }, null, 2);
    fs.writeFileSync('./bundled/test/commonjs/package.json', packageJsonCommonJs);
}

await buildModule();
generateCommonjsPackageJson();