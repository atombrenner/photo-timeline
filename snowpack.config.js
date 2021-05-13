/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  mount: {
    'webapp/public': { url: '/', static: true },
    webapp: { url: '/dist' },
  },
  plugins: [
    ['@snowpack/plugin-typescript', { args: '--project webapp/tsconfig.json' }],
    '@prefresh/snowpack',
  ],
  routes: [
    /* Enable an SPA Fallback in development: */
    // {"match": "routes", "src": ".*", "dest": "/index.html"},
  ],
  optimize: {
    /* Example: Bundle your final build: */
    bundle: true,
    minify: true,
  },
  packageOptions: {
    /* ... */
  },
  devOptions: {
    /* ... */
  },
  buildOptions: {
    /* ... */
  },
}
