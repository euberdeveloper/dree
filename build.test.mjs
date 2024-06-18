import fs from 'node:fs';
import { build } from 'esbuild';
import * as importMap from "esbuild-plugin-import-map";

import packageJson from './package.json' assert { type: 'json' };

importMap.load({
    imports: {
        '../dist/lib/index.js': '../../bundled/lib/esm/index.esm.js'
    }
});

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
        sourcemap: true
    };

    await build({
        ...shared,
        outfile: 'bundled/test/index.esm.js',
        format: 'esm',
        plugins: [importMap.plugin()],
        external: getExternalDependencies()
    });
}

await buildModule();