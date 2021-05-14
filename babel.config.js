// babel.config.js
module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 14 } }],
    '@babel/preset-typescript',
    ['@babel/preset-react', { importSource: 'preact', runtime: 'automatic' }],
  ],
  plugins: [['@babel/plugin-syntax-import-meta']],
}
