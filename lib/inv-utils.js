const types_ = require('./types')
const misc_ = require('./misc')

module.exports = _ =>{
  Object.assign(_, types_)
  return Object.assign(_, misc_(_))
}
