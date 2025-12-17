module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: '12',
        },
        modules: false,
        loose: true,
      },
    ],
    '@babel/preset-react',
    '@babel/preset-typescript',
  ],
  plugins: [
    ['@babel/plugin-transform-class-properties', { loose: true }],
    ['@babel/plugin-transform-private-property-in-object', { loose: true }],
    ['@babel/plugin-transform-private-methods', { loose: true }],
    [
      '@babel/plugin-transform-runtime',
      {
        regenerator: false,
        helpers: true,
        useESModules: true,
      },
    ],
  ],
  env: {
    commonjs: {
      presets: [
        [
          '@babel/preset-env',
          {
            targets: {
              node: '12',
            },
            modules: 'commonjs',
            loose: true,
          },
        ],
      ],
      plugins: [
        ['@babel/plugin-transform-class-properties', { loose: true }],
        ['@babel/plugin-transform-private-property-in-object', { loose: true }],
        ['@babel/plugin-transform-private-methods', { loose: true }],
        [
          '@babel/plugin-transform-runtime',
          {
            regenerator: false,
            helpers: true,
            useESModules: false,
          },
        ],
      ],
    },
  },
  ignore: ['**/__tests__', '**/__mocks__', '**/__fixtures__'],
  comments: false,
  minified: false,
  compact: true,
};