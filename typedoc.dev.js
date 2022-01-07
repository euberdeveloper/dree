module.exports = {
    entryPointStrategy: 'expand',
    entryPoints: [
        './source'
    ],
    name: 'dree - DEV',
    tsconfig: 'source/tsconfig.json',
    gaID: process.env.GA_TOKEN,
    out: './docs/documentation/html-dev',
    cleanOutputDir: true
};