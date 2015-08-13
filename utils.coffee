types_ = require './lib/types'

module.exports = (_)->
  _.extend _, types_
  misc_ = require('./lib/misc') _
  return _.extend _, misc_
