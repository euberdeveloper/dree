module.exports = {
    entryPointStrategy: 'expand',
    entryPoints: [
        './source'
    ],
    name: 'dree - DEV',
    navigationLinks: {
        'Github': 'https://github.com/euberdeveloper/dree'
    },
    sidebarLinks: {
        'Module docs': 'https://dree.euber.dev'
    },
    tsconfig: 'source/tsconfig.json',
    gaID: process.env.GA_TOKEN,
    out: './docs/documentation/html-dev',
    cleanOutputDir: true
};