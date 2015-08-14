types_ = require './types'
misc_ = require('./misc')

module.exports = (_)->
  _.extend _, types_
  return _.extend _, misc_(_)
