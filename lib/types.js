const { isNull, isArray, isNaN, isObject, isString, every, range } = require('lodash')
const { duplicatesArray } = require('./misc')

const types_ = module.exports = {
  type: (obj, type) => {
    let needle
    const trueType = types_.typeOf(obj)
    if (type.split('|').includes(trueType)) {
      return obj
    } else {
      const err = new Error(`TypeError: expected ${type}, got ${obj} (${trueType})`)
      err.context = { obj, type }
      throw err
    }
  },

  types: function (args, types, minArgsLength) {
    // in case it's an 'arguments' object
    let err, test
    args = Array.from(args)

    // accepts a common type for all the args as a string
    // ex: types = 'numbers...'
    // or even 'numbers...|strings...' to be translated as several 'number|string'
    // => types = ['number', 'number', ... (args.length times)]
    if ((typeof types === 'string') && (types.split('s...').length > 1)) {
      const uniqueType = types.split('s...').join('')
      types = range(0, args.length).map(() => uniqueType)
    }

    // testing arguments types once polymorphic interfaces are normalized
    types_.type(args, 'array')
    types_.type(types, 'array')
    if (minArgsLength != null) { types_.type(minArgsLength, 'number') }

    if (minArgsLength != null) {
      test = types.length >= args.length && args.length >= minArgsLength
    } else {
      test = args.length === types.length
    }

    if (!test) {
      if (minArgsLength != null) {
        err = `expected between ${minArgsLength} and ${types.length} arguments, got ${args.length}: ${args}`
      } else { err = `expected ${types.length} arguments, got ${args.length}: ${args}` }
      console.log(args)
      err = new Error(err)
      err.context = arguments
      throw err
    }

    let i = 0
    try {
      while (i < args.length) {
        types_.type(args[i], types[i])
        i += 1
      }
    } catch (error) {
      err = error
      this.error(arguments, 'types err arguments')
      throw err
    }
  },

  typeOf: obj => {
    // just handling what differes from typeof
    const type = typeof obj
    if (type === 'object') {
      if (isNull(obj)) return 'null'
      if (isArray(obj)) return 'array'
    }
    if (type === 'number') {
      if (isNaN(obj)) return 'NaN'
    }
    return type
  },

  // soft testing: doesn't throw
  areStrings: array => every(array, isString),

  typeString: str => types_.type(str, 'string'),
  typeArray: array => types_.type(array, 'array'),

  // helpers to simplify polymorphisms
  forceArray: keys => {
    if (keys == null) return []
    if (!isArray(keys)) return [ keys ]
    else return keys
  },

  forceObject: (key, value) => {
    if (!isObject(key)) {
      const obj = {}
      obj[key] = value
      return obj
    } else {
      return key
    }
  }
}
