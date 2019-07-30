// 'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')
module.exports = merge(prodEnv, {
  NODE_ENV: '"pre"',
  BASE_API: '"https://quan-api.jinxianghui.net"',

})
