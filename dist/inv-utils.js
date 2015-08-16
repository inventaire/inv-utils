(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.invUtils = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// Generated by CoffeeScript 1.9.3
(function() {
  var misc_, types_;

  types_ = require('./types');

  misc_ = require('./misc');

  module.exports = function(_) {
    _.extend(_, types_);
    return _.extend(_, misc_(_));
  };

}).call(this);

},{"./misc":2,"./types":3}],2:[function(require,module,exports){
// Generated by CoffeeScript 1.9.3
(function() {
  var slice = [].slice;

  module.exports = function(_) {
    return {
      idGenerator: function(length, lettersOnly) {
        var i, possible, text;
        text = '';
        possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        if (!lettersOnly) {
          possible += '0123456789';
        }
        i = 0;
        while (i < length) {
          text += possible.charAt(_.random(possible.length - 1));
          i++;
        }
        return text;
      },
      hashCode: function(string) {
        var chr, hash, i, len, ref;
        ref = [0, 0, string.length], hash = ref[0], i = ref[1], len = ref[2];
        if (len === 0) {
          return hash;
        }
        while (i < len) {
          chr = string.charCodeAt(i);
          hash = ((hash << 5) - hash) + chr;
          hash |= 0;
          i++;
        }
        return Math.abs(hash);
      },
      niceDate: function() {
        return new Date().toISOString().split('T')[0];
      },
      timeSinceMidnight: function() {
        var midnight, today;
        today = this.niceDate();
        midnight = new Date(today).getTime();
        return _.now() - midnight;
      },
      buildPath: function(pathname, queryObj, escape) {
        var k, queryString, v;
        queryObj = this.removeUndefined(queryObj);
        if ((queryObj != null) && !_.isEmpty(queryObj)) {
          queryString = '';
          for (k in queryObj) {
            v = queryObj[k];
            if (escape) {
              v = this.dropSpecialCharacters(v);
            }
            queryString += "&" + k + "=" + v;
          }
          return pathname + '?' + queryString.slice(1);
        } else {
          return pathname;
        }
      },
      parseQuery: function(queryString) {
        var query;
        query = {};
        if (queryString != null) {
          queryString.replace(/^\?/, '').split('&').forEach(function(param) {
            var pairs, ref;
            pairs = param.split('=');
            if (((ref = pairs[0]) != null ? ref.length : void 0) > 0 && (pairs[1] != null)) {
              return query[pairs[0]] = _.softDecodeURI(pairs[1]);
            }
          });
        }
        return query;
      },
      softEncodeURI: function(str) {
        return _.typeString(str).replace(/(\s|')/g, '_').replace(/\?/g, '');
      },
      softDecodeURI: function(str) {
        return _.typeString(str).replace(/_/g, ' ');
      },
      removeUndefined: function(obj) {
        var k, newObj, v;
        newObj = {};
        for (k in obj) {
          v = obj[k];
          if (v != null) {
            newObj[k] = v;
          }
        }
        return newObj;
      },
      dropSpecialCharacters: function(str) {
        return str.replace(/\s+/g, ' ').replace(/(\?|\:)/g, '');
      },
      isUrl: function(str) {
        var pattern, regexp;
        pattern = '^(https?:\\/\\/)?' + '(\\w+:\\w+@)?' + '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + '((\\d{1,3}\\.){3}\\d{1,3}))|' + '(localhost)' + '(\\:\\d+)?' + '(\\/[-a-z\\d%_.~+]*)*' + '(\\?[;&a-z\\d%_.~+=-]*)?' + '(\\#[-a-z\\d_]*)?$';
        regexp = new RegExp(pattern, "i");
        return regexp.test(str);
      },
      isDataUrl: function(str) {
        return /^data:image/.test(str);
      },
      isHostedPicture: function(str) {
        return /img(loc)?.inventaire.io\/\w{22}.jpg$/.test(str);
      },
      pickToArray: function() {
        var obj, pickObj, props;
        obj = arguments[0], props = 2 <= arguments.length ? slice.call(arguments, 1) : [];
        if (_.isArray(props[0])) {
          props = props[0];
        }
        _.typeArray(props);
        pickObj = _.pick(obj, props);
        return props.map(function(prop) {
          return pickObj[prop];
        });
      },
      mergeArrays: _.union,
      matchesCount: function() {
        var arrays;
        arrays = 1 <= arguments.length ? slice.call(arguments, 0) : [];
        return _.intersection.apply(_, arrays).length;
      },
      haveAMatch: function() {
        var arrays;
        arrays = 1 <= arguments.length ? slice.call(arguments, 0) : [];
        return _.matchesCount.apply(null, arrays) > 0;
      },
      duplicatesArray: function(str, num) {
        var j, results;
        return (function() {
          results = [];
          for (var j = 1; 1 <= num ? j <= num : j >= num; 1 <= num ? j++ : j--){ results.push(j); }
          return results;
        }).apply(this).map(function() {
          return str;
        });
      },
      objLength: function(obj) {
        var ref;
        return (ref = Object.keys(obj)) != null ? ref.length : void 0;
      },
      qrcode: function(url, size) {
        if (size == null) {
          size = 250;
        }
        return "http://chart.apis.google.com/chart?cht=qr&chs=" + size + "x" + size + "&chl=" + url;
      },
      piped: function(data) {
        return _.forceArray(data).join('|');
      },
      expired: function(timestamp, ttl) {
        return this.now() - timestamp > ttl;
      },
      isNonEmptyString: function(str) {
        return _.isString(str) && str.length > 0;
      },
      dropProtocol: function(path) {
        return path.replace(/^(https?:)?\/\//, '');
      },
      cdn: function(path, width, height, extend) {
        var size;
        if (!/^https/.test(path)) {
          if (!_.isNumber(height)) {
            height = width;
          }
          size = width + "x" + height;
          if (!extend) {
            size += 'g';
          }
          path = this.dropProtocol(path);
          return "http://cdn.filter.to/" + size + "/" + path;
        } else {
          return path;
        }
      },
      bestImageWidth: function(width) {
        if (width < 500) {
          return width;
        }
        if (typeof screen !== "undefined" && screen !== null ? screen.width : void 0) {
          width = Math.min(width, screen.width);
        }
        return Math.ceil(width / 100) * 100;
      },
      shortLang: function(lang) {
        return lang != null ? lang.slice(0, 2) : void 0;
      }
    };
  };

}).call(this);

},{}],3:[function(require,module,exports){
// Generated by CoffeeScript 1.9.3
(function() {
  var indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  module.exports = {
    type: function(obj, type) {
      var trueType;
      trueType = this.typeOf(obj);
      if (indexOf.call(type.split('|'), trueType) >= 0) {
        return obj;
      } else {
        throw new Error("TypeError: expected " + type + ", got " + obj + " (" + trueType + ")");
      }
    },
    types: function(args, types, minArgsLength) {
      var err, i, ref, results, test, uniqueType;
      args = this.toArray(args);
      if (typeof types === 'string' && types.split('s...').length > 1) {
        uniqueType = types.split('s...').join('');
        types = this.duplicatesArray(uniqueType, args.length);
      }
      this.type(args, 'array');
      this.type(types, 'array');
      if (minArgsLength != null) {
        this.type(minArgsLength, 'number');
      }
      if (minArgsLength != null) {
        test = (types.length >= (ref = args.length) && ref >= minArgsLength);
      } else {
        test = args.length === types.length;
      }
      if (!test) {
        if (minArgsLength != null) {
          err = "expected between " + minArgsLength + " and " + types.length + " arguments, got " + args.length + ": " + args;
        } else {
          err = "expected " + types.length + " arguments, got " + args.length + ": " + args;
        }
        console.log(args);
        throw new Error(err);
      }
      i = 0;
      try {
        results = [];
        while (i < args.length) {
          this.type(args[i], types[i]);
          results.push(i += 1);
        }
        return results;
      } catch (_error) {
        err = _error;
        this.error(arguments, 'types err arguments');
        throw err;
      }
    },
    typeOf: function(obj) {
      var type;
      type = typeof obj;
      if (type === 'object') {
        if (this.isNull(obj)) {
          return 'null';
        }
        if (this.isArray(obj)) {
          return 'array';
        }
      }
      if (type === 'number') {
        if (this.isNaN(obj)) {
          return 'NaN';
        }
      }
      return type;
    },
    areStrings: function(array) {
      return this.all(array, this.isString);
    },
    typeString: function(str) {
      return this.type(str, 'string');
    },
    typeArray: function(array) {
      return this.type(array, 'array');
    },
    forceArray: function(keys) {
      if (keys == null) {
        return [];
      }
      if (!this.isArray(keys)) {
        return [keys];
      } else {
        return keys;
      }
    },
    forceObject: function(key, value) {
      var obj;
      if (!this.isObject(key)) {
        obj = {};
        obj[key] = value;
        return obj;
      } else {
        return key;
      }
    }
  };

}).call(this);

},{}]},{},[1])(1)
});