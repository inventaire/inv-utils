// Expects to be passed either lodash or underscore
module.exports = _ => ({
  idGenerator: (length, lettersOnly) => {
    let text = ''
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
    if (!lettersOnly) { possible += '0123456789' }
    let i = 0
    while (i < length) {
      text += possible.charAt(_.random(possible.length - 1))
      i++
    }
    return text
  },

  // adapted from http://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
  hashCode: string => {
    let [hash, i, len] = Array.from([0, 0, string.length])
    if (len === 0) return hash

    while (i < len) {
      const chr = string.charCodeAt(i)
      hash = ((hash << 5) - hash) + chr
      hash |= 0 // Convert to 32bit integer
      i++
    }
    return Math.abs(hash)
  },

  niceDate: () => {
    return new (Date().toISOString().split('T')[0])()
  },

  timeSinceMidnight: () => {
    const today = this.niceDate()
    const midnight = new Date(today).getTime()
    return _.now() - midnight
  },

  buildPath: function (pathname, queryObj, escape) {
    queryObj = this.removeUndefined(queryObj)
    if ((queryObj != null) && !_.isEmpty(queryObj)) {
      let queryString = ''
      for (let k in queryObj) {
        let v = queryObj[k]
        if (escape) { v = this.dropSpecialCharacters(v) }
        queryString += `&${k}=${v}`
      }
      return pathname + '?' + queryString.slice(1)
    } else {
      return pathname
    }
  },

  parseQuery: queryString => {
    const query = {}
    if (queryString != null) {
      queryString
      .replace(/^\?/, '')
      .split('&')
      .forEach(function (param) {
        const pairs = param.split('=')
        if (((pairs[0] != null ? pairs[0].length : undefined) > 0) && (pairs[1] != null)) {
          return query[pairs[0]] = _.softDecodeURI(pairs[1])
        }
      })
    }
    return query
  },

  softEncodeURI: str => {
    return _.typeString(str)
    .replace(/(\s|')/g, '_')
    .replace(/\?/g, '')
  },

  softDecodeURI: str => {
    return _.typeString(str)
    .replace(/_/g, ' ')
  },

  removeUndefined: obj => {
    const newObj = {}
    for (let k in obj) {
      const v = obj[k]
      if (v != null) { newObj[k] = v }
    }
    return newObj
  },

  dropSpecialCharacters: str => {
    return str
    .replace(/\s+/g, ' ')
    .replace(/(\?|\:)/g, '')
  },

  isUrl: str => {
    // adapted from http://stackoverflow.com/a/14582229/3324977
    const pattern = '^(https?:\\/\\/)' + // protocol
      '(\\w+:\\w+@)?' + // auth?
      '((([a-z\\d]([a-z\\d-_]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))|' + // OR ip (v4) address
      '(localhost)' + // OR localhost
      '(\\:\\d+)?' + // port?
      '(\\/[-a-z\\d%_.~+]*)*' + // path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string?
      '(\\#[-a-z\\d_]*)?$' // fragment?

    const regexp = new RegExp(pattern, 'i')
    return regexp.test(str)
  },

  isDataUrl: str => /^data:image/.test(str),

  isHostedPicture: str => /img(loc)?.inventaire.io\/\w{22}.jpg$/.test(str),

  pickToArray: (obj, ...props) => {
    if (_.isArray(props[0])) { props = props[0] }
    _.typeArray(props)
    const pickObj = _.pick(obj, props)
    // returns an undefined array element when prop is undefined
    return props.map(prop => pickObj[prop])
  },

  mergeArrays: _.union,

  matchesCount: (...arrays) => _.intersection.apply(_, arrays).length,
  haveAMatch: (...arrays) => _.matchesCount.apply(null, arrays) > 0,

  duplicatesArray: (str, num) => _.range(0, num).map(() => str),

  objLength: obj => obj && Object.keys(obj).length,

  qrcode: (url, size = 250) => {
    return `http://chart.apis.google.com/chart?cht=qr&chs=${size}x${size}&chl=${url}`
  },

  piped: data => _.forceArray(data).join('|'),

  expired: (timestamp, ttl) => (this.now() - timestamp) > ttl,

  isNonEmptyString: str => _.isString(str) && (str.length > 0),

  dropProtocol: path => path.replace(/^(https?:)?\/\//, ''),

  cdn: (path, width, height, extend) => {
    // cdn.filter.to doesnt support https
    if (!/^https/.test(path)) {
      if (!_.isNumber(height)) { height = width }
      let size = `${width}x${height}`
      if (!extend) { size += 'g' }
      path = this.dropProtocol(path)
      return `http://cdn.filter.to/${size}/${path}`
    } else {
      return path
    }
  },

  bestImageWidth: width => {
    // under 500, it's useful to keep the freedom to get exactly 64 or 128px etc
    // while still grouping on the initially requested width
    if (width < 500) return width

    // if in a browser, use the screen width as a max value
    if (screen && screen.width != null) width = Math.min(width, screen.width)
    // group image width above 500 by levels of 100px to limit cdn versions
    return Math.ceil(width / 100) * 100
  },

  shortLang: lang => lang && lang.slice(0, 2),

  imgSrc: (root = '') => (path, width = 1600, height = 1600) => {
    if (typeof path !== 'string' || path.length === 0) return

    if (/^http/.test(path)) {
      const key = _.hashCode(path)
      const href = _.fixedEncodeURIComponent(path)
      return `${root}/img/${width}x${height}/${key}?href=${href}`
    } else {
      path = path.replace('/img/', '')
      return `${root}/img/${width}x${height}/${path}`
    }
  },

  // encodeURIComponent ignores !, ', (, ), and *
  // cf https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent#Description
  fixedEncodeURIComponent: str => {
    return encodeURIComponent(str).replace(/[!'()*]/g, encodeCharacter)
  }
})

const encodeCharacter = c => '%' + c.charCodeAt(0).toString(16)
