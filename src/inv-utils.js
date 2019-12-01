const types_ = require('./types');
const misc_ = require('./misc');

module.exports = function(_){
  _.extend(_, types_);
  return _.extend(_, misc_(_));
};
