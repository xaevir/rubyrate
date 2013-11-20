/* jshint expr: true */
({
  baseUrl: '.',
  //name: 'libs/almond',
  include: 'main',
  mainConfigFile: 'main.js',
  out: 'main-built.js',
  findNestedDependencies: true,
  paths: {
    stripe: 'empty:'
  }
})

