export default {
    input: 'lib/index.js',
    output: {
        file: 'lib/index.umd.js',
        format: 'umd',
        name: 'IpcDecorator',
        globals: {
            'electron-better-ipc': 'ElectronBetterIpc'
        },
        exports: 'named'
    },
    external: ['electron-better-ipc', 'reflect-metadata']
}