module.exports =
  type: (obj, type)->
    trueType = @typeOf obj
    if trueType in type.split('|') then return obj
    else
      err = new Error "TypeError: expected #{type}, got #{obj} (#{trueType})"
      err.context = arguments
      throw err

  types: (args, types, minArgsLength)->

    # in case it's an 'arguments' object
    args = @toArray(args)

    # accepts a common type for all the args as a string
    # ex: types = 'numbers...'
    # or even 'numbers...|strings...' to be translated as several 'number|string'
    # => types = ['number', 'number', ... (args.length times)]
    if typeof types is 'string' and types.split('s...').length > 1
      uniqueType = types.split('s...').join ''
      types = @duplicatesArray uniqueType, args.length

    # testing arguments types once polymorphic interfaces are normalized
    @type args, 'array'
    @type types, 'array'
    @type minArgsLength, 'number'  if minArgsLength?

    if minArgsLength?
      test = types.length >= args.length >= minArgsLength
    else test = args.length is types.length

    unless test
      if minArgsLength? then err = "expected between #{minArgsLength} and #{types.length} arguments, got #{args.length}: #{args}"
      else err = "expected #{types.length} arguments, got #{args.length}: #{args}"
      console.log args
      err = new Error err
      err.context = arguments
      throw err

    i = 0
    try
      while i < args.length
        @type args[i], types[i]
        i += 1
    catch err
      @error arguments, 'types err arguments'
      throw err

  typeOf: (obj)->
    # just handling what differes from typeof
    type = typeof obj
    if type is 'object'
      if @isNull(obj) then return 'null'
      if @isArray(obj) then return 'array'
    if type is 'number'
      if @isNaN(obj) then return 'NaN'
    return type

  # soft testing: doesn't throw
  areStrings: (array)-> @all array, @isString

  typeString: (str)-> @type str, 'string'
  typeArray: (array)-> @type array, 'array'

  # helpers to simplify polymorphisms
  forceArray: (keys)->
    unless keys? then return []
    unless @isArray(keys) then [keys]
    else keys

  forceObject: (key, value)->
    unless @isObject key
      obj = {}
      obj[key] = value
      return obj
    else key
