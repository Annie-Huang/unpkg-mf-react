const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const deps = require('./package.json').dependencies;
const { merge } = require('webpack-merge');
const path = require('path');
const { camelCase } = require('camel-case');

const pkg = require('./package.json');
const name = camelCase(pkg.name);

// The modules you want to expose
const exposes = {
  './slider': './src/Slider.tsx',
};

const shared = {
  ...deps,
  react: {
    singleton: true,
    requiredVersion: deps.react,
  },
};

/** @type {webpack.Configuration} */
const baseConfig = {
  mode: process.env.NODE_ENV === 'development' ? 'development' : 'production',
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
  },

  module: {
    rules: [
      {
        test: /\.m?js/,
        type: 'javascript/auto',
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.json$/,
        loader: 'json-loader',
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(ts|tsx|js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
};

/** @type {webpack.Configuration} */
const browserConfig = {
  output: {
    path: path.resolve('./dist/browser'),
  },
  plugins: [
    new ModuleFederationPlugin({
      name,
      filename: 'remote-entry.js',
      // remotes: {},
      exposes,
      shared,
    }),
  ],
};

/** @type {webpack.Configuration} */
const nodeConfig = {
  target: 'node',
  output: {
    path: path.resolve('./dist/node'),
  },
  plugins: [
    new ModuleFederationPlugin({
      name,
      filename: 'remote-entry.js',
      library: { type: 'commonjs' },
      // remotes: {},
      exposes,
      shared,
    }),
  ],
};

module.exports = [
  merge(baseConfig, browserConfig),
  merge(baseConfig, nodeConfig),
];
