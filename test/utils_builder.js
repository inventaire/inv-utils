const _ = require('underscore')
const loggers_ = require('inv-loggers')
module.exports = Object.assign(_, loggers_, require('../lib/inv-utils')(_))
