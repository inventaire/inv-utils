// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// expect to be passed either lodash or underscore
module.exports = function(_){
  return {
    idGenerator(length, lettersOnly){
      let text = '';
      let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
      if (!lettersOnly) { possible += '0123456789'; }
      let i = 0;
      while (i < length) {
        text += possible.charAt(_.random(possible.length - 1));
        i++;
      }
      return text;
    },

    // adapted from http://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
    hashCode(string){
      let [hash, i, len] = Array.from([0, 0, string.length]);
      if (len === 0) { return hash; }

      while (i < len) {
        const chr = string.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
        i++;
      }
      return Math.abs(hash);
    },

    niceDate() {
      return new (Date().toISOString().split('T')[0]);
    },

    timeSinceMidnight() {
      const today = this.niceDate();
      const midnight = new Date(today).getTime();
      return _.now() - midnight;
    },

    buildPath(pathname, queryObj, escape){
      queryObj = this.removeUndefined(queryObj);
      if ((queryObj != null) && !_.isEmpty(queryObj)) {
        let queryString = '';
        for (let k in queryObj) {
          let v = queryObj[k];
          if (escape) { v = this.dropSpecialCharacters(v); }
          queryString += `&${k}=${v}`;
        }
        return pathname + '?' + queryString.slice(1);
      } else { return pathname; }
    },

    parseQuery(queryString){
      const query = {};
      if (queryString != null) {
        queryString
        .replace(/^\?/, '')
        .split('&')
        .forEach(function(param){
          const pairs = param.split('=');
          if (((pairs[0] != null ? pairs[0].length : undefined) > 0) && (pairs[1] != null)) {
            return query[pairs[0]] = _.softDecodeURI(pairs[1]);
          }});
      }
      return query;
    },

    softEncodeURI(str){
      return _.typeString(str)
      .replace(/(\s|')/g, '_')
      .replace(/\?/g, '');
    },

    softDecodeURI(str){
      return _.typeString(str)
      .replace(/_/g,' ');
    },

    removeUndefined(obj){
      const newObj = {};
      for (let k in obj) {
        const v = obj[k];
        if (v != null) { newObj[k] = v; }
      }
      return newObj;
    },

    dropSpecialCharacters(str){
      return str
      .replace(/\s+/g, ' ')
      .replace(/(\?|\:)/g, '');
    },

    isUrl(str){
      // adapted from http://stackoverflow.com/a/14582229/3324977
      const pattern = '^(https?:\\/\\/)'+ // protocol
        '(\\w+:\\w+@)?'+ // auth?
        '((([a-z\\d]([a-z\\d-_]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))|'+ // OR ip (v4) address
        '(localhost)'+ // OR localhost
        '(\\:\\d+)?' + // port?
        '(\\/[-a-z\\d%_.~+]*)*'+ // path
        '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string?
        '(\\#[-a-z\\d_]*)?$'; //fragment?

      const regexp = new RegExp(pattern , "i");
      return regexp.test(str);
    },

    isDataUrl(str){ return /^data:image/.test(str); },

    isHostedPicture(str){ return /img(loc)?.inventaire.io\/\w{22}.jpg$/.test(str); },

    pickToArray(obj, ...props){
      if (_.isArray(props[0])) { props = props[0]; }
      _.typeArray(props);
      const pickObj = _.pick(obj, props);
      // returns an undefined array element when prop is undefined
      return props.map(prop => pickObj[prop]);
    },

    mergeArrays: _.union,

    matchesCount(...arrays){ return _.intersection.apply(_, arrays).length; },
    haveAMatch(...arrays){ return _.matchesCount.apply(null, arrays) > 0; },

    duplicatesArray(str, num){ return __range__(0, num, false).map(() => str); },

    objLength(obj){ return __guard__(Object.keys(obj), x => x.length); },

    qrcode(url, size=250){
      return `http://chart.apis.google.com/chart?cht=qr&chs=${size}x${size}&chl=${url}`;
    },

    piped(data){ return _.forceArray(data).join('|'); },

    expired(timestamp, ttl){ return (this.now() - timestamp) > ttl; },

    isNonEmptyString(str){ return _.isString(str) && (str.length > 0); },

    dropProtocol(path){ return path.replace(/^(https?:)?\/\//, ''); },

    cdn(path, width, height, extend){
      // cdn.filter.to doesnt support https
      if (!/^https/.test(path)) {
        if (!_.isNumber(height)) { height = width; }
        let size = `${width}x${height}`;
        if (!extend) { size += 'g'; }
        path = this.dropProtocol(path);
        return `http://cdn.filter.to/${size}/${path}`;
      } else { return path; }
    },

    bestImageWidth(width){
      // under 500, it's useful to keep the freedom to get exactly 64 or 128px etc
      // while still grouping on the initially requested width
      if (width < 500) { return width; }

      // if in a browser, use the screen width as a max value
      if (typeof screen !== 'undefined' && screen !== null ? screen.width : undefined) { width = Math.min(width, screen.width); }
      // group image width above 500 by levels of 100px to limit cdn versions
      return Math.ceil(width / 100) * 100;
    },

    shortLang(lang){ return __guard__(lang, x => x.slice(0, 2)); },

    imgSrc(root=''){
      let img;
      return img = function(path, width=1600, height=1600){
        if ((typeof path !== 'string') || (path.length <= 0)) { return; }

        // Converting IPFS paths to an HTTP(S) gateway url
        // Letting the hash length rough: it seem to always be 46
        // but no spec could be found to confirm it won't change
        if (/^\/ipfs\/\w{30,60}$/.test(path)) {
          path = `https://ipfs.io${path}`;
        }

        if (/^http/.test(path)) {
          const key = _.hashCode(path);
          const href = _.fixedEncodeURIComponent(path);
          return `${root}/img/${width}x${height}/${key}?href=${href}`;
        } else {
          path = path.replace('/img/', '');
          return `${root}/img/${width}x${height}/${path}`;
        }
      };
    },

    // encodeURIComponent ignores !, ', (, ), and *
    // cf https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent#Description
    fixedEncodeURIComponent(str){
      return encodeURIComponent(str).replace(/[!'()*]/g, encodeCharacter);
    }
  };
};

var encodeCharacter = c => '%' + c.charCodeAt(0).toString(16);

function __range__(left, right, inclusive) {
  let range = [];
  let ascending = left < right;
  let end = !inclusive ? right : ascending ? right + 1 : right - 1;
  for (let i = left; ascending ? i < end : i > end; ascending ? i++ : i--) {
    range.push(i);
  }
  return range;
}
function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}