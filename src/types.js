// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS104: Avoid inline assignments
 * DS204: Change includes calls to have a more natural evaluation order
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
module.exports = {
  type(obj, type){
    let needle;
    const trueType = this.typeOf(obj);
    if ((needle = trueType, type.split('|').includes(needle))) { return obj;
    } else {
      const err = new Error(`TypeError: expected ${type}, got ${obj} (${trueType})`);
      err.context = arguments;
      throw err;
    }
  },

  types(args, types, minArgsLength){

    // in case it's an 'arguments' object
    let err, test;
    args = this.toArray(args);

    // accepts a common type for all the args as a string
    // ex: types = 'numbers...'
    // or even 'numbers...|strings...' to be translated as several 'number|string'
    // => types = ['number', 'number', ... (args.length times)]
    if ((typeof types === 'string') && (types.split('s...').length > 1)) {
      const uniqueType = types.split('s...').join('');
      types = this.duplicatesArray(uniqueType, args.length);
    }

    // testing arguments types once polymorphic interfaces are normalized
    this.type(args, 'array');
    this.type(types, 'array');
    if (minArgsLength != null) { this.type(minArgsLength, 'number'); }

    if (minArgsLength != null) {
      test = types.length >= args.length && args.length >= minArgsLength;
    } else { test = args.length === types.length; }

    if (!test) {
      if (minArgsLength != null) { err = `expected between ${minArgsLength} and ${types.length} arguments, got ${args.length}: ${args}`;
      } else { err = `expected ${types.length} arguments, got ${args.length}: ${args}`; }
      console.log(args);
      err = new Error(err);
      err.context = arguments;
      throw err;
    }

    let i = 0;
    try {
      return (() => {
        const result = [];
        while (i < args.length) {
          this.type(args[i], types[i]);
          result.push(i += 1);
        }
        return result;
      })();
    } catch (error) {
      err = error;
      this.error(arguments, 'types err arguments');
      throw err;
    }
  },

  typeOf(obj){
    // just handling what differes from typeof
    const type = typeof obj;
    if (type === 'object') {
      if (this.isNull(obj)) { return 'null'; }
      if (this.isArray(obj)) { return 'array'; }
    }
    if (type === 'number') {
      if (this.isNaN(obj)) { return 'NaN'; }
    }
    return type;
  },

  // soft testing: doesn't throw
  areStrings(array){ return this.all(array, this.isString); },

  typeString(str){ return this.type(str, 'string'); },
  typeArray(array){ return this.type(array, 'array'); },

  // helpers to simplify polymorphisms
  forceArray(keys){
    if (keys == null) { return []; }
    if (!this.isArray(keys)) { return [keys];
    } else { return keys; }
  },

  forceObject(key, value){
    if (!this.isObject(key)) {
      const obj = {};
      obj[key] = value;
      return obj;
    } else { return key; }
  }
};
