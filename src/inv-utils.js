// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
const types_ = require('./types');
const misc_ = require('./misc');

module.exports = function(_){
  _.extend(_, types_);
  return _.extend(_, misc_(_));
};
