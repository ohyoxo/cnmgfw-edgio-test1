const { Router } = require('@edgio/core/router')

module.exports = new Router()
  .match('/:path*', ({ proxy }) => {
    proxy('origin')
  })
