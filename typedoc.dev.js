module.exports = {
    mode: 'modules',
    name: 'dree - DEV',
    entryPoint: 'source/lib/index.ts',
    includeVersion: true,
    tsconfig: 'source/tsconfig.json',
    gaID: process.env.GA_TOKEN,
    out: './docs/documentation/html-dev'
};