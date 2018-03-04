'use strict';

/**
 * This is a port of the PrototypeJS method toQueryParams. It parses a URI-like
 * query string and returns an object composed of parameter/value pairs.
 * @param {query} The URI-like query string to be parsed
 * @param {separator} A value for splitting the query string; defaults to "&"
 * @return {object} A set of params from parsing the query string
 */

var _toString = Object.prototype.toString,
  STRING_CLASS = '[object String]',
  ARRAY_CLASS = '[object Array]',
  FUNCTION_CLASS = '[object Function]';

function isString(object) {
  return _toString.call(object) === STRING_CLASS;
}

function isArray(object) {
  return _toString.call(object) === ARRAY_CLASS;
}

function isFunction(object) {
  return _toString.call(object) === FUNCTION_CLASS;
}

function strip(str) {
  return str.replace(/^\s+/, '').replace(/\s+$/, '');
}

function regExpEsc(str) {
  return String(str).replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1');
}

function inject(input, memo, iterator, context) {
  input.forEach(function(value, index) {
    memo = iterator.call(context, memo, value, index, input);
  }, input);
  return memo;
}

function Template(template, pattern) {
  this.template = template.toString();
  this.pattern = pattern || /(^|.|\r|\n)(#\{(.*?)\})/;
  this.evaluate = function(object) {
    if (object && isFunction(object.toTemplateReplacements))
      object = object.toTemplateReplacements();

    return gsub(this.template, this.pattern, function(match) {
      if (object == null) return (match[1] + '');

      var before = match[1] || '';
      if (before == '\\') return match[2];

      var ctx = object, expr = match[3],
          pattern = /^([^.[]+|\[((?:.*?[^\\])?)\])(\.|\[|$)/;
          
      match = pattern.exec(expr);
      if (match == null) return before;

      while (match != null) {
        var comp = match[1].startsWith('[') ? match[2].replace(/\\\\]/g, ']') : match[1];
        ctx = ctx[comp];
        if (null == ctx || '' == match[3]) break;
        expr = expr.substring('[' == match[3] ? match[1].length : match[0].length);
        match = pattern.exec(expr);
      }

      return before + interpret(ctx);
    });
  }
}

function prepareReplacement(replacement) {
  if (isFunction(replacement)) return replacement;
  var template = new Template(replacement);
  return function(match) { return template.evaluate(match) };
}

function interpret(value) {
  return value == null ? '' : String(value);
}

function isNonEmptyRegExp(regexp) {
  return regexp.source && regexp.source !== '(?:)';
}

function gsub(input, pattern, replacement) {
    var result = '', source = input, match;
    replacement = prepareReplacement(replacement);

    if (isString(pattern))
      pattern = regExpEsc(pattern);

    if (!(pattern.length || isNonEmptyRegExp(pattern))) {
      replacement = replacement('');
      return replacement + source.split('').join(replacement) + replacement;
    }

    while (source.length > 0) {
      match = source.match(pattern)
      if (match && match[0].length > 0) {
        result += source.slice(0, match.index);
        result += interpret(replacement(match));
        source  = source.slice(match.index + match[0].length);
      } else {
        result += source, source = '';
      }
    }
    return result;
}

function toQueryParams(input, separator) {
  if (!input) return { };
  separator = separator || '&';

  var match = strip(input).match(/([^?#]*)(#.*)?$/);
  if (!match) return { };

  return inject(match[1].split(separator), {}, function(hash, pair) {
    if ((pair = pair.split('='))[0]) {
      var key = decodeURIComponent(pair.shift()),
          value = pair.length > 1 ? pair.join('=') : pair[0];

      if (value != undefined) {
        value = gsub(value, '+', ' ');
        value = decodeURIComponent(value);
      }

      if (key in hash) {
        if (!isArray(hash[key])) hash[key] = [hash[key]];
        hash[key].push(value);
      }
      else hash[key] = value;
    }
    return hash;
  });
}

module.exports = toQueryParams;
