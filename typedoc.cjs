module.exports = {
    entryPointStrategy: 'expand',
    entryPoints: [
        './source/lib/index.ts'
    ],
    name: 'dree',
    navigationLinks: {
        'Github': 'https://github.com/euberdeveloper/dree'
    },
    sidebarLinks: {
        'DEV docs': 'https://dree-dev.euber.dev'
    },
    plugin: ['typedoc-plugin-ga'],
    excludeExternals: true,
    includeVersion: true,
    tsconfig: 'source/tsconfig.json',
    gaID: process.env.GA_TOKEN,
    excludePrivate: true,
    excludeProtected: true,
    disableSources: true,
    cleanOutputDir: true,
    out: './docs/documentation/html'
};