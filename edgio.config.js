module.exports = {
  connector: '@edgio/nodejs-connector',

  nodejsConnector: {
    buildFolder: '.',
    entryFile: 'index.js',
    envPort: 'PORT',
  },

  backends: {
    origin: {
      domainOrIp: 'localhost',
      hostHeader: 'localhost',
    },
  },
};
