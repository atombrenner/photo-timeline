// jest.config.js
// Sync object
module.exports = {
  moduleNameMapper: {
    '.css$': 'identity-obj-proxy',
  },
  transform: {
    '^.+\\.[t|j]sx?$': 'babel-jest',
  },
}
