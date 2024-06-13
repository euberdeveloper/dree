import fs from 'node:fs';
import { build } from 'esbuild';
import * as importMap from "esbuild-plugin-import-map";

import packageJson from './package.json' assert { type: 'json' };

importMap.load({
    imports: {
        '../lib/index.js': '../lib/esm/index.esm.js'
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
        entryPoints: ['source/lib/index.ts'],
        bundle: true,
        minify: true,
        treeShaking: true,
        sourcemap: false
    };

    await build({
        ...shared,
        outfile: 'bundled/lib/commonjs/index.js',
        format: 'cjs',
        external: getExternalDependencies()
    });

    await build({
        ...shared,
        outfile: 'bundled/lib/esm/index.esm.js',
        format: 'esm',
        external: getExternalDependencies()
    });

    await build({
        ...shared,
        entryPoints: ['source/bin/index.ts'],
        outfile: 'bundled/bin/index.js',
        format: 'esm',
        external: getExternalDependencies(),
        plugins: [importMap.plugin()],
        define: {
            '__VERSION__': `"${packageJson.version}"`
          }
    });
}

function generateCommonjsPackageJson() {
    const packageJsonCommonJs = JSON.stringify({ ...packageJson, type: undefined }, null, 2);
    fs.writeFileSync('./bundled/lib/commonjs/package.json', packageJsonCommonJs);
}

await buildModule();
generateCommonjsPackageJson();