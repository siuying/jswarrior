
(function(/*! Stitch !*/) {
  if (!this.require) {
    var modules = {}, cache = {}, require = function(name, root) {
      var module = cache[name], path = expand(root, name), fn;
      if (module) {
        return module;
      } else if (fn = modules[path] || modules[path = expand(path, './index')]) {
        module = {id: name, exports: {}};
        try {
          cache[name] = module.exports;
          fn(module.exports, function(name) {
            return require(name, dirname(path));
          }, module);
          return cache[name] = module.exports;
        } catch (err) {
          delete cache[name];
          throw err;
        }
      } else {
        throw 'module \'' + name + '\' not found';
      }
    }, expand = function(root, name) {
      var results = [], parts, part;
      if (/^\.\.?(\/|$)/.test(name)) {
        parts = [root, name].join('/').split('/');
      } else {
        parts = name.split('/');
      }
      for (var i = 0, length = parts.length; i < length; i++) {
        part = parts[i];
        if (part == '..') {
          results.pop();
        } else if (part != '.' && part != '') {
          results.push(part);
        }
      }
      return results.join('/');
    }, dirname = function(path) {
      return path.split('/').slice(0, -1).join('/');
    };
    this.require = function(name) {
      return require(name, '');
    }
    this.require.define = function(bundle) {
      for (var key in bundle)
        modules[key] = bundle[key];
    };
  }
  return this.require.define;
}).call(this)({"base64": function(exports, require, module) {/*
Copyright (c) 2008 Fred Palmer fred.palmer_at_gmail.com

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
*/
(function(exports) {

  function StringBuffer()
  { 
      this.buffer = []; 
  } 

  StringBuffer.prototype.append = function append(string)
  { 
      this.buffer.push(string); 
      return this; 
  }; 

  StringBuffer.prototype.toString = function toString()
  { 
      return this.buffer.join(""); 
  }; 
  
  exports.StringBuffer = StringBuffer;
  
  var Base64 =
  {
      codex : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

      encode : function (input)
      {
          var output = new StringBuffer();

          var enumerator = new Utf8EncodeEnumerator(input);
          while (enumerator.moveNext())
          {
              var chr1 = enumerator.current;

              enumerator.moveNext();
              var chr2 = enumerator.current;

              enumerator.moveNext();
              var chr3 = enumerator.current;

              var enc1 = chr1 >> 2;
              var enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
              var enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
              var enc4 = chr3 & 63;

              if (isNaN(chr2))
              {
                  enc3 = enc4 = 64;
              }
              else if (isNaN(chr3))
              {
                  enc4 = 64;
              }

              output.append(this.codex.charAt(enc1) + this.codex.charAt(enc2) + this.codex.charAt(enc3) + this.codex.charAt(enc4));
          }

          return output.toString();
      },

      decode : function (input)
      {
          var output = new StringBuffer();

          var enumerator = new Base64DecodeEnumerator(input);
          while (enumerator.moveNext())
          {
              var charCode = enumerator.current;

              if (charCode < 128)
                  output.append(String.fromCharCode(charCode));
              else if ((charCode > 191) && (charCode < 224))
              {
                  enumerator.moveNext();
                  var charCode2 = enumerator.current;

                  output.append(String.fromCharCode(((charCode & 31) << 6) | (charCode2 & 63)));
              }
              else
              {
                  enumerator.moveNext();
                  var charCode2 = enumerator.current;

                  enumerator.moveNext();
                  var charCode3 = enumerator.current;

                  output.append(String.fromCharCode(((charCode & 15) << 12) | ((charCode2 & 63) << 6) | (charCode3 & 63)));
              }
          }

          return output.toString();
      }
  }
  
  exports.Base64 = Base64;

  function Utf8EncodeEnumerator(input)
  {
      this._input = input;
      this._index = -1;
      this._buffer = [];
  }

  Utf8EncodeEnumerator.prototype =
  {
      current: Number.NaN,

      moveNext: function()
      {
          if (this._buffer.length > 0)
          {
              this.current = this._buffer.shift();
              return true;
          }
          else if (this._index >= (this._input.length - 1))
          {
              this.current = Number.NaN;
              return false;
          }
          else
          {
              var charCode = this._input.charCodeAt(++this._index);

              // "\r\n" -> "\n"
              //
              if ((charCode == 13) && (this._input.charCodeAt(this._index + 1) == 10))
              {
                  charCode = 10;
                  this._index += 2;
              }

              if (charCode < 128)
              {
                  this.current = charCode;
              }
              else if ((charCode > 127) && (charCode < 2048))
              {
                  this.current = (charCode >> 6) | 192;
                  this._buffer.push((charCode & 63) | 128);
              }
              else
              {
                  this.current = (charCode >> 12) | 224;
                  this._buffer.push(((charCode >> 6) & 63) | 128);
                  this._buffer.push((charCode & 63) | 128);
              }

              return true;
          }
      }
  }

  function Base64DecodeEnumerator(input)
  {
      this._input = input;
      this._index = -1;
      this._buffer = [];
  }
  
  exports.Utf8EncodeEnumerator = Utf8EncodeEnumerator;
  
  Base64DecodeEnumerator.prototype =
  {
      current: 64,

      moveNext: function()
      {
          if (this._buffer.length > 0)
          {
              this.current = this._buffer.shift();
              return true;
          }
          else if (this._index >= (this._input.length - 1))
          {
              this.current = 64;
              return false;
          }
          else
          {
              var enc1 = Base64.codex.indexOf(this._input.charAt(++this._index));
              var enc2 = Base64.codex.indexOf(this._input.charAt(++this._index));
              var enc3 = Base64.codex.indexOf(this._input.charAt(++this._index));
              var enc4 = Base64.codex.indexOf(this._input.charAt(++this._index));

              var chr1 = (enc1 << 2) | (enc2 >> 4);
              var chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
              var chr3 = ((enc3 & 3) << 6) | enc4;

              this.current = chr1;

              if (enc3 != 64)
                  this._buffer.push(chr2);

              if (enc4 != 64)
                  this._buffer.push(chr3);

              return true;
          }
      }
  };
  
  exports.Base64DecodeEnumerator = Base64DecodeEnumerator;
  
}((typeof exports === 'undefined') ? window : exports));}, "events": function(exports, require, module) {// https://github.com/tmpvar/node-eventemitter
(function(exports) {
  var process = { EventEmitter: function() {} };
  
  if (typeof Array.isArray !== "function"){
    Array.isArray = function(obj){ return Object.prototype.toString.call(obj) === "[object Array]" };
  }
  
  if (!Array.prototype.indexOf){
    Array.prototype.indexOf = function(item){
        for ( var i = 0, length = this.length; i < length; i++ ) {
            if ( this[ i ] === item ) {
                return i;
            }
        }

        return -1;
    };
  }
  
  // Begin wrap of nodejs implementation of EventEmitter

  var EventEmitter = exports.EventEmitter = process.EventEmitter;

  var isArray = Array.isArray;

  EventEmitter.prototype.emit = function(type) {
    // If there is no 'error' event listener then throw.
    if (type === 'error') {
      if (!this._events || !this._events.error ||
          (isArray(this._events.error) && !this._events.error.length))
      {
        if (arguments[1] instanceof Error) {
          throw arguments[1]; // Unhandled 'error' event
        } else {
          throw new Error("Uncaught, unspecified 'error' event.");
        }
        return false;
      }
    }

    if (!this._events) return false;
    var handler = this._events[type];
    if (!handler) return false;

    if (typeof handler == 'function') {
      switch (arguments.length) {
        // fast cases
        case 1:
          handler.call(this);
          break;
        case 2:
          handler.call(this, arguments[1]);
          break;
        case 3:
          handler.call(this, arguments[1], arguments[2]);
          break;
        // slower
        default:
          var args = Array.prototype.slice.call(arguments, 1);
          handler.apply(this, args);
      }
      return true;

    } else if (isArray(handler)) {
      var args = Array.prototype.slice.call(arguments, 1);

      var listeners = handler.slice();
      for (var i = 0, l = listeners.length; i < l; i++) {
        listeners[i].apply(this, args);
      }
      return true;

    } else {
      return false;
    }
  };

  // EventEmitter is defined in src/node_events.cc
  // EventEmitter.prototype.emit() is also defined there.
  EventEmitter.prototype.addListener = function(type, listener) {
    if ('function' !== typeof listener) {
      throw new Error('addListener only takes instances of Function');
    }

    if (!this._events) this._events = {};

    // To avoid recursion in the case that type == "newListeners"! Before
    // adding it to the listeners, first emit "newListeners".
    this.emit('newListener', type, listener);

    if (!this._events[type]) {
      // Optimize the case of one listener. Don't need the extra array object.
      this._events[type] = listener;
    } else if (isArray(this._events[type])) {
      // If we've already got an array, just append.
      this._events[type].push(listener);
    } else {
      // Adding the second element, need to change to array.
      this._events[type] = [this._events[type], listener];
    }

    return this;
  };

  EventEmitter.prototype.on = EventEmitter.prototype.addListener;

  EventEmitter.prototype.once = function(type, listener) {
    var self = this;
    self.on(type, function g() {
      self.removeListener(type, g);
      listener.apply(this, arguments);
    });
  };

  EventEmitter.prototype.removeListener = function(type, listener) {
    if ('function' !== typeof listener) {
      throw new Error('removeListener only takes instances of Function');
    }

    // does not use listeners(), so no side effect of creating _events[type]
    if (!this._events || !this._events[type]) return this;

    var list = this._events[type];

    if (isArray(list)) {
      var i = list.indexOf(listener);
      if (i < 0) return this;
      list.splice(i, 1);
      if (list.length == 0)
        delete this._events[type];
    } else if (this._events[type] === listener) {
      delete this._events[type];
    }

    return this;
  };

  EventEmitter.prototype.removeAllListeners = function(type) {
    // does not use listeners(), so no side effect of creating _events[type]
    if (type && this._events && this._events[type]) this._events[type] = null;
    return this;
  };

  EventEmitter.prototype.listeners = function(type) {
    if (!this._events) this._events = {};
    if (!this._events[type]) this._events[type] = [];
    if (!isArray(this._events[type])) {
      this._events[type] = [this._events[type]];
    }
    return this._events[type];
  };

  // End nodejs implementation
}((typeof exports === 'undefined') ? window : exports));}, "underscore": function(exports, require, module) {// Underscore.js 1.1.7
// (c) 2011 Jeremy Ashkenas, DocumentCloud Inc.
// Underscore is freely distributable under the MIT license.
// Portions of Underscore are inspired or borrowed from Prototype,
// Oliver Steele's Functional, and John Resig's Micro-Templating.
// For all details and documentation:
// http://documentcloud.github.com/underscore
(function(){var p=this,C=p._,m={},i=Array.prototype,n=Object.prototype,f=i.slice,D=i.unshift,E=n.toString,l=n.hasOwnProperty,s=i.forEach,t=i.map,u=i.reduce,v=i.reduceRight,w=i.filter,x=i.every,y=i.some,o=i.indexOf,z=i.lastIndexOf;n=Array.isArray;var F=Object.keys,q=Function.prototype.bind,b=function(a){return new j(a)};typeof module!=="undefined"&&module.exports?(module.exports=b,b._=b):p._=b;b.VERSION="1.1.7";var h=b.each=b.forEach=function(a,c,b){if(a!=null)if(s&&a.forEach===s)a.forEach(c,b);else if(a.length===
+a.length)for(var e=0,k=a.length;e<k;e++){if(e in a&&c.call(b,a[e],e,a)===m)break}else for(e in a)if(l.call(a,e)&&c.call(b,a[e],e,a)===m)break};b.map=function(a,c,b){var e=[];if(a==null)return e;if(t&&a.map===t)return a.map(c,b);h(a,function(a,g,G){e[e.length]=c.call(b,a,g,G)});return e};b.reduce=b.foldl=b.inject=function(a,c,d,e){var k=d!==void 0;a==null&&(a=[]);if(u&&a.reduce===u)return e&&(c=b.bind(c,e)),k?a.reduce(c,d):a.reduce(c);h(a,function(a,b,f){k?d=c.call(e,d,a,b,f):(d=a,k=!0)});if(!k)throw new TypeError("Reduce of empty array with no initial value");
return d};b.reduceRight=b.foldr=function(a,c,d,e){a==null&&(a=[]);if(v&&a.reduceRight===v)return e&&(c=b.bind(c,e)),d!==void 0?a.reduceRight(c,d):a.reduceRight(c);a=(b.isArray(a)?a.slice():b.toArray(a)).reverse();return b.reduce(a,c,d,e)};b.find=b.detect=function(a,c,b){var e;A(a,function(a,g,f){if(c.call(b,a,g,f))return e=a,!0});return e};b.filter=b.select=function(a,c,b){var e=[];if(a==null)return e;if(w&&a.filter===w)return a.filter(c,b);h(a,function(a,g,f){c.call(b,a,g,f)&&(e[e.length]=a)});return e};
b.reject=function(a,c,b){var e=[];if(a==null)return e;h(a,function(a,g,f){c.call(b,a,g,f)||(e[e.length]=a)});return e};b.every=b.all=function(a,c,b){var e=!0;if(a==null)return e;if(x&&a.every===x)return a.every(c,b);h(a,function(a,g,f){if(!(e=e&&c.call(b,a,g,f)))return m});return e};var A=b.some=b.any=function(a,c,d){c=c||b.identity;var e=!1;if(a==null)return e;if(y&&a.some===y)return a.some(c,d);h(a,function(a,b,f){if(e|=c.call(d,a,b,f))return m});return!!e};b.include=b.contains=function(a,c){var b=
!1;if(a==null)return b;if(o&&a.indexOf===o)return a.indexOf(c)!=-1;A(a,function(a){if(b=a===c)return!0});return b};b.invoke=function(a,c){var d=f.call(arguments,2);return b.map(a,function(a){return(c.call?c||a:a[c]).apply(a,d)})};b.pluck=function(a,c){return b.map(a,function(a){return a[c]})};b.max=function(a,c,d){if(!c&&b.isArray(a))return Math.max.apply(Math,a);var e={computed:-Infinity};h(a,function(a,b,f){b=c?c.call(d,a,b,f):a;b>=e.computed&&(e={value:a,computed:b})});return e.value};b.min=function(a,
c,d){if(!c&&b.isArray(a))return Math.min.apply(Math,a);var e={computed:Infinity};h(a,function(a,b,f){b=c?c.call(d,a,b,f):a;b<e.computed&&(e={value:a,computed:b})});return e.value};b.sortBy=function(a,c,d){return b.pluck(b.map(a,function(a,b,f){return{value:a,criteria:c.call(d,a,b,f)}}).sort(function(a,b){var c=a.criteria,d=b.criteria;return c<d?-1:c>d?1:0}),"value")};b.groupBy=function(a,b){var d={};h(a,function(a,f){var g=b(a,f);(d[g]||(d[g]=[])).push(a)});return d};b.sortedIndex=function(a,c,d){d||
(d=b.identity);for(var e=0,f=a.length;e<f;){var g=e+f>>1;d(a[g])<d(c)?e=g+1:f=g}return e};b.toArray=function(a){if(!a)return[];if(a.toArray)return a.toArray();if(b.isArray(a))return f.call(a);if(b.isArguments(a))return f.call(a);return b.values(a)};b.size=function(a){return b.toArray(a).length};b.first=b.head=function(a,b,d){return b!=null&&!d?f.call(a,0,b):a[0]};b.rest=b.tail=function(a,b,d){return f.call(a,b==null||d?1:b)};b.last=function(a){return a[a.length-1]};b.compact=function(a){return b.filter(a,
function(a){return!!a})};b.flatten=function(a){return b.reduce(a,function(a,d){if(b.isArray(d))return a.concat(b.flatten(d));a[a.length]=d;return a},[])};b.without=function(a){return b.difference(a,f.call(arguments,1))};b.uniq=b.unique=function(a,c){return b.reduce(a,function(a,e,f){if(0==f||(c===!0?b.last(a)!=e:!b.include(a,e)))a[a.length]=e;return a},[])};b.union=function(){return b.uniq(b.flatten(arguments))};b.intersection=b.intersect=function(a){var c=f.call(arguments,1);return b.filter(b.uniq(a),
function(a){return b.every(c,function(c){return b.indexOf(c,a)>=0})})};b.difference=function(a,c){return b.filter(a,function(a){return!b.include(c,a)})};b.zip=function(){for(var a=f.call(arguments),c=b.max(b.pluck(a,"length")),d=Array(c),e=0;e<c;e++)d[e]=b.pluck(a,""+e);return d};b.indexOf=function(a,c,d){if(a==null)return-1;var e;if(d)return d=b.sortedIndex(a,c),a[d]===c?d:-1;if(o&&a.indexOf===o)return a.indexOf(c);d=0;for(e=a.length;d<e;d++)if(a[d]===c)return d;return-1};b.lastIndexOf=function(a,
b){if(a==null)return-1;if(z&&a.lastIndexOf===z)return a.lastIndexOf(b);for(var d=a.length;d--;)if(a[d]===b)return d;return-1};b.range=function(a,b,d){arguments.length<=1&&(b=a||0,a=0);d=arguments[2]||1;for(var e=Math.max(Math.ceil((b-a)/d),0),f=0,g=Array(e);f<e;)g[f++]=a,a+=d;return g};b.bind=function(a,b){if(a.bind===q&&q)return q.apply(a,f.call(arguments,1));var d=f.call(arguments,2);return function(){return a.apply(b,d.concat(f.call(arguments)))}};b.bindAll=function(a){var c=f.call(arguments,1);
c.length==0&&(c=b.functions(a));h(c,function(c){a[c]=b.bind(a[c],a)});return a};b.memoize=function(a,c){var d={};c||(c=b.identity);return function(){var b=c.apply(this,arguments);return l.call(d,b)?d[b]:d[b]=a.apply(this,arguments)}};b.delay=function(a,b){var d=f.call(arguments,2);return setTimeout(function(){return a.apply(a,d)},b)};b.defer=function(a){return b.delay.apply(b,[a,1].concat(f.call(arguments,1)))};var B=function(a,b,d){var e;return function(){var f=this,g=arguments,h=function(){e=null;
a.apply(f,g)};d&&clearTimeout(e);if(d||!e)e=setTimeout(h,b)}};b.throttle=function(a,b){return B(a,b,!1)};b.debounce=function(a,b){return B(a,b,!0)};b.once=function(a){var b=!1,d;return function(){if(b)return d;b=!0;return d=a.apply(this,arguments)}};b.wrap=function(a,b){return function(){var d=[a].concat(f.call(arguments));return b.apply(this,d)}};b.compose=function(){var a=f.call(arguments);return function(){for(var b=f.call(arguments),d=a.length-1;d>=0;d--)b=[a[d].apply(this,b)];return b[0]}};b.after=
function(a,b){return function(){if(--a<1)return b.apply(this,arguments)}};b.keys=F||function(a){if(a!==Object(a))throw new TypeError("Invalid object");var b=[],d;for(d in a)l.call(a,d)&&(b[b.length]=d);return b};b.values=function(a){return b.map(a,b.identity)};b.functions=b.methods=function(a){var c=[],d;for(d in a)b.isFunction(a[d])&&c.push(d);return c.sort()};b.extend=function(a){h(f.call(arguments,1),function(b){for(var d in b)b[d]!==void 0&&(a[d]=b[d])});return a};b.defaults=function(a){h(f.call(arguments,
1),function(b){for(var d in b)a[d]==null&&(a[d]=b[d])});return a};b.clone=function(a){return b.isArray(a)?a.slice():b.extend({},a)};b.tap=function(a,b){b(a);return a};b.isEqual=function(a,c){if(a===c)return!0;var d=typeof a;if(d!=typeof c)return!1;if(a==c)return!0;if(!a&&c||a&&!c)return!1;if(a._chain)a=a._wrapped;if(c._chain)c=c._wrapped;if(a.isEqual)return a.isEqual(c);if(c.isEqual)return c.isEqual(a);if(b.isDate(a)&&b.isDate(c))return a.getTime()===c.getTime();if(b.isNaN(a)&&b.isNaN(c))return!1;
if(b.isRegExp(a)&&b.isRegExp(c))return a.source===c.source&&a.global===c.global&&a.ignoreCase===c.ignoreCase&&a.multiline===c.multiline;if(d!=="object")return!1;if(a.length&&a.length!==c.length)return!1;d=b.keys(a);var e=b.keys(c);if(d.length!=e.length)return!1;for(var f in a)if(!(f in c)||!b.isEqual(a[f],c[f]))return!1;return!0};b.isEmpty=function(a){if(b.isArray(a)||b.isString(a))return a.length===0;for(var c in a)if(l.call(a,c))return!1;return!0};b.isElement=function(a){return!!(a&&a.nodeType==
1)};b.isArray=n||function(a){return E.call(a)==="[object Array]"};b.isObject=function(a){return a===Object(a)};b.isArguments=function(a){return!(!a||!l.call(a,"callee"))};b.isFunction=function(a){return!(!a||!a.constructor||!a.call||!a.apply)};b.isString=function(a){return!!(a===""||a&&a.charCodeAt&&a.substr)};b.isNumber=function(a){return!!(a===0||a&&a.toExponential&&a.toFixed)};b.isNaN=function(a){return a!==a};b.isBoolean=function(a){return a===!0||a===!1};b.isDate=function(a){return!(!a||!a.getTimezoneOffset||
!a.setUTCFullYear)};b.isRegExp=function(a){return!(!a||!a.test||!a.exec||!(a.ignoreCase||a.ignoreCase===!1))};b.isNull=function(a){return a===null};b.isUndefined=function(a){return a===void 0};b.noConflict=function(){p._=C;return this};b.identity=function(a){return a};b.times=function(a,b,d){for(var e=0;e<a;e++)b.call(d,e)};b.mixin=function(a){h(b.functions(a),function(c){H(c,b[c]=a[c])})};var I=0;b.uniqueId=function(a){var b=I++;return a?a+b:b};b.templateSettings={evaluate:/<%([\s\S]+?)%>/g,interpolate:/<%=([\s\S]+?)%>/g};
b.template=function(a,c){var d=b.templateSettings;d="var __p=[],print=function(){__p.push.apply(__p,arguments);};with(obj||{}){__p.push('"+a.replace(/\\/g,"\\\\").replace(/'/g,"\\'").replace(d.interpolate,function(a,b){return"',"+b.replace(/\\'/g,"'")+",'"}).replace(d.evaluate||null,function(a,b){return"');"+b.replace(/\\'/g,"'").replace(/[\r\n\t]/g," ")+"__p.push('"}).replace(/\r/g,"\\r").replace(/\n/g,"\\n").replace(/\t/g,"\\t")+"');}return __p.join('');";d=new Function("obj",d);return c?d(c):d};
var j=function(a){this._wrapped=a};b.prototype=j.prototype;var r=function(a,c){return c?b(a).chain():a},H=function(a,c){j.prototype[a]=function(){var a=f.call(arguments);D.call(a,this._wrapped);return r(c.apply(b,a),this._chain)}};b.mixin(b);h(["pop","push","reverse","shift","sort","splice","unshift"],function(a){var b=i[a];j.prototype[a]=function(){b.apply(this._wrapped,arguments);return r(this._wrapped,this._chain)}});h(["concat","join","slice"],function(a){var b=i[a];j.prototype[a]=function(){return r(b.apply(this._wrapped,
arguments),this._chain)}});j.prototype.chain=function(){this._chain=!0;return this};j.prototype.value=function(){return this._wrapped}})();}, "js_warrior": function(exports, require, module) {(function() {
  exports.JsWarrior = {
    version: '0.0.1',
    Controller: require('./js_warrior/controller').Controller,
    Floor: require('./js_warrior/floor').Floor,
    Game: require('./js_warrior/game').Game,
    Level: require('./js_warrior/level').Level,
    LevelLoader: require('./js_warrior/level_loader').LevelLoader,
    Position: require('./js_warrior/position').Position,
    Profile: require('./js_warrior/profile').Profile,
    Space: require('./js_warrior/space').Space,
    Tower: require('./js_warrior/tower').Tower,
    Abilities: require('./js_warrior/abilities').Abilities,
    Units: require('./js_warrior/units').Units,
    Utils: require('./js_warrior/utils').Utils,
    Turn: require('./js_warrior/turn').Turn,
    Views: require('./js_warrior/views').Views
  };
}).call(this);
}, "js_warrior/abilities": function(exports, require, module) {(function() {
  exports.Abilities = {
    BaseAbilities: require('./abilities/base_abilities').BaseAbilities,
    Sense: require('./abilities/sense').Sense,
    Action: require('./abilities/action').Action,
    Attack: require('./abilities/attack').Attack,
    Feel: require('./abilities/feel').Feel,
    Explode: require('./abilities/explode').Explode,
    Walk: require('./abilities/walk').Walk,
    Health: require('./abilities/health').Health,
    Rest: require('./abilities/rest').Rest,
    Shoot: require('./abilities/shoot').Shoot,
    Look: require('./abilities/look').Look,
    Rescue: require('./abilities/rescue').Rescue,
    Pivot: require('./abilities/pivot').Pivot,
    DirectionOfStairs: require('./abilities/direction_of_stairs').DirectionOfStairs,
    Bind: require('./abilities/bind').Bind,
    Listen: require('./abilities/listen').Listen,
    DirectionOf: require('./abilities/direction_of').DirectionOf,
    Detonate: require('./abilities/detonate').Detonate,
    DistanceOf: require('./abilities/distance_of').DistanceOf
  };
}).call(this);
}, "js_warrior/abilities/action": function(exports, require, module) {(function() {
  var Action, BaseAbilities, root;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  BaseAbilities = require('./base_abilities').BaseAbilities;
  Action = (function() {
    __extends(Action, BaseAbilities);
    function Action(unit) {
      this.unit = unit;
    }
    Action.prototype.isAction = function() {
      return true;
    };
    return Action;
  })();
  root = typeof exports !== "undefined" && exports !== null ? exports : window;
  root.Action = Action;
}).call(this);
}, "js_warrior/abilities/attack": function(exports, require, module) {(function() {
  var Action, Attack, root;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  Action = require('./action').Action;
  Attack = (function() {
    __extends(Attack, Action);
    function Attack() {
      Attack.__super__.constructor.apply(this, arguments);
    }
    Attack.prototype.description = function() {
      return "Attacks a unit in given direction (forward by default).";
    };
    Attack.prototype.perform = function(direction) {
      var power, receiver;
      if (direction == null) {
        direction = 'forward';
      }
      this.verifyDirection(direction);
      receiver = this.getUnit(direction);
      if (receiver) {
        this.unit.say("attacks " + direction + " and hits " + receiver);
        if (direction === 'backward') {
          power = Math.ceil(this.unit.attackPower() / 2.0);
        } else {
          power = this.unit.attackPower();
        }
        return this.damage(receiver, power);
      } else {
        return this.unit.say("attacks " + direction + " and hits nothing");
      }
    };
    return Attack;
  })();
  root = typeof exports !== "undefined" && exports !== null ? exports : window;
  root.Attack = Attack;
}).call(this);
}, "js_warrior/abilities/base_abilities": function(exports, require, module) {(function() {
  var BaseAbilities, Position, root;
  Position = require('../position').Position;
  BaseAbilities = (function() {
    function BaseAbilities(unit) {
      this.unit = unit;
    }
    BaseAbilities.prototype.offset = function(direction, forward, right) {
      if (forward == null) {
        forward = 1;
      }
      if (right == null) {
        right = 0;
      }
      switch (direction) {
        case 'forward':
          return [forward, -right];
        case 'backward':
          return [-forward, right];
        case 'right':
          return [right, forward];
        case 'left':
          return [-right, -forward];
      }
    };
    BaseAbilities.prototype.space = function(direction, forward, right) {
      var _ref;
      if (forward == null) {
        forward = 1;
      }
      if (right == null) {
        right = 0;
      }
      return (_ref = this.unit.position).relativeSpace.apply(_ref, this.offset(direction, forward, right));
    };
    BaseAbilities.prototype.getUnit = function(direction, forward, right) {
      if (forward == null) {
        forward = 1;
      }
      if (right == null) {
        right = 0;
      }
      return this.space(direction, forward, right).getUnit();
    };
    BaseAbilities.prototype.damage = function(receiver, amount) {
      receiver.takeDamage(amount);
      if (!receiver.isAlive()) {
        return this.unit.earnPoints(receiver.maxHealth());
      }
    };
    BaseAbilities.prototype.description = function() {
      return;
    };
    BaseAbilities.prototype.passTurn = function() {
      return;
    };
    BaseAbilities.prototype.verifyDirection = function(direction) {
      if (Position.RELATIVE_DIRECTIONS.indexOf(direction) === -1) {
        throw "Unknown direction \'" + direction + "\'. Should be forward, backward, left or right.";
      }
    };
    BaseAbilities.prototype.isSense = function() {
      return false;
    };
    BaseAbilities.prototype.isAction = function() {
      return false;
    };
    return BaseAbilities;
  })();
  root = typeof exports !== "undefined" && exports !== null ? exports : window;
  root.BaseAbilities = BaseAbilities;
}).call(this);
}, "js_warrior/abilities/bind": function(exports, require, module) {(function() {
  var Action, Bind, root;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  Action = require('./action').Action;
  Bind = (function() {
    __extends(Bind, Action);
    function Bind() {
      Bind.__super__.constructor.apply(this, arguments);
    }
    Bind.prototype.description = function() {
      return "Binds a unit in given direction to keep him from moving (forward by default).";
    };
    Bind.prototype.perform = function(direction) {
      var receiver;
      if (direction == null) {
        direction = 'forward';
      }
      this.verifyDirection(direction);
      receiver = this.getUnit(direction);
      if (receiver) {
        this.unit.say("binds " + direction + " and restricts " + receiver);
        return receiver.bind();
      } else {
        return this.unit.say("binds " + direction + " and restricts nothing");
      }
    };
    return Bind;
  })();
  root = typeof exports !== "undefined" && exports !== null ? exports : window;
  root.Bind = Bind;
}).call(this);
}, "js_warrior/abilities/detonate": function(exports, require, module) {(function() {
  var Action, Detonate, root;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  Action = require('./action').Action;
  Detonate = (function() {
    __extends(Detonate, Action);
    function Detonate() {
      Detonate.__super__.constructor.apply(this, arguments);
    }
    Detonate.prototype.description = function() {
      return "Detonate a bomb in a given direction (forward by default) which damages that space and surrounding 4 spaces (including yourself).";
    };
    Detonate.prototype.perform = function(direction) {
      var space, x, y, _i, _len, _ref, _results;
      if (direction == null) {
        direction = 'forward';
      }
      this.verifyDirection(direction);
      if (this.unit.position) {
        this.unit.say("detonates a bom " + direction + " launching a deadly explosion.");
        this.bomb(direction, 1, 0, 8);
        _ref = [[1, 1], [1, -1], [2, 0], [0, 0]];
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          space = _ref[_i];
          x = space[0], y = space[1];
          _results.push(this.bomb(direction, x, y, 4));
        }
        return _results;
      }
    };
    Detonate.prototype.bomb = function(direction, x, y, damage_amount) {
      var receiver;
      if (this.unit.position) {
        receiver = this.space(direction, x, y).getUnit();
        if (receiver) {
          if (receiver.abilities['explode']) {
            receiver.say("caught in bomb's flames which detonates ticking explosive");
            return receiver.abilities['explode'].perform();
          } else {
            return this.damage(receiver, damage_amount);
          }
        }
      }
    };
    return Detonate;
  })();
  root = typeof exports !== "undefined" && exports !== null ? exports : window;
  root.Detonate = Detonate;
}).call(this);
}, "js_warrior/abilities/direction_of": function(exports, require, module) {(function() {
  var DirectionOf, Sense, root, _;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  Sense = require('./sense').Sense;
  _ = require('underscore')._;
  DirectionOf = (function() {
    __extends(DirectionOf, Sense);
    function DirectionOf() {
      DirectionOf.__super__.constructor.apply(this, arguments);
    }
    DirectionOf.prototype.description = function() {
      return "Pass a Space as an argument, and the direction ('left', 'right', 'forward', 'backward') to that space will be returned.";
    };
    DirectionOf.prototype.perform = function(space) {
      return this.unit.position.relativeDirectionOf(space);
    };
    return DirectionOf;
  })();
  root = typeof exports !== "undefined" && exports !== null ? exports : window;
  root.DirectionOf = DirectionOf;
}).call(this);
}, "js_warrior/abilities/direction_of_stairs": function(exports, require, module) {(function() {
  var DirectionOfStairs, Sense, root, _;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  Sense = require('./sense').Sense;
  _ = require('underscore')._;
  DirectionOfStairs = (function() {
    __extends(DirectionOfStairs, Sense);
    function DirectionOfStairs() {
      DirectionOfStairs.__super__.constructor.apply(this, arguments);
    }
    DirectionOfStairs.prototype.description = function() {
      return "Returns the direction ('left', 'right', 'forward', 'backward') the stairs are from your location.";
    };
    DirectionOfStairs.prototype.perform = function() {
      return this.unit.position.relativeDirectionOfStairs();
    };
    return DirectionOfStairs;
  })();
  root = typeof exports !== "undefined" && exports !== null ? exports : window;
  root.DirectionOfStairs = DirectionOfStairs;
}).call(this);
}, "js_warrior/abilities/distance_of": function(exports, require, module) {(function() {
  var DistanceOf, Sense, root;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  Sense = require('./sense').Sense;
  DistanceOf = (function() {
    __extends(DistanceOf, Sense);
    function DistanceOf() {
      DistanceOf.__super__.constructor.apply(this, arguments);
    }
    DistanceOf.prototype.description = function() {
      return "Pass a Space as an argument, and it will return an integer representing the distance to that space.";
    };
    DistanceOf.prototype.perform = function(space) {
      return this.unit.position.distanceOf(space);
    };
    return DistanceOf;
  })();
  root = typeof exports !== "undefined" && exports !== null ? exports : window;
  root.DistanceOf = DistanceOf;
}).call(this);
}, "js_warrior/abilities/explode": function(exports, require, module) {(function() {
  var Action, Explode, root, _;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  Action = require('./action').Action;
  _ = require('underscore')._;
  Explode = (function() {
    __extends(Explode, Action);
    Explode.prototype.description = function() {
      return "Kills you and all surrounding units. You probably don't want to do this intentionally.";
    };
    function Explode() {
      Explode.__super__.constructor.apply(this, arguments);
      this.time = 0;
    }
    Explode.prototype.perform = function() {
      if (this.unit.position) {
        this.unit.say("explodes, collapsing the ceiling and damanging every unit.");
        return _.map(this.unit.position.floor.units(), function(unit) {
          return unit.takeDamage(100);
        });
      }
    };
    Explode.prototype.passTurn = function() {
      if (this.time > 0 && this.unit.position) {
        this.unit.say("is ticking");
        this.time -= 1;
        if (this.time === 0) {
          return this.perform();
        }
      }
    };
    return Explode;
  })();
  root = typeof exports !== "undefined" && exports !== null ? exports : window;
  root.Explode = Explode;
}).call(this);
}, "js_warrior/abilities/feel": function(exports, require, module) {(function() {
  var Feel, Sense, root;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  Sense = require('./sense').Sense;
  Feel = (function() {
    __extends(Feel, Sense);
    function Feel() {
      Feel.__super__.constructor.apply(this, arguments);
    }
    Feel.prototype.description = function() {
      return "Returns a Space for the given direction (forward by default).";
    };
    Feel.prototype.perform = function(direction) {
      if (direction == null) {
        direction = 'forward';
      }
      this.verifyDirection(direction);
      return this.space(direction);
    };
    return Feel;
  })();
  root = typeof exports !== "undefined" && exports !== null ? exports : window;
  root.Feel = Feel;
}).call(this);
}, "js_warrior/abilities/health": function(exports, require, module) {(function() {
  var Health, Sense, root;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  Sense = require('./sense').Sense;
  Health = (function() {
    __extends(Health, Sense);
    function Health() {
      Health.__super__.constructor.apply(this, arguments);
    }
    Health.prototype.description = function() {
      return "Returns an integer representing your health.";
    };
    Health.prototype.perform = function(direction) {
      if (direction == null) {
        direction = 'forward';
      }
      return this.unit.health;
    };
    return Health;
  })();
  root = typeof exports !== "undefined" && exports !== null ? exports : window;
  root.Health = Health;
}).call(this);
}, "js_warrior/abilities/listen": function(exports, require, module) {(function() {
  var Listen, Sense, root, _;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  Sense = require('./sense').Sense;
  _ = require('underscore')._;
  Listen = (function() {
    __extends(Listen, Sense);
    function Listen() {
      Listen.__super__.constructor.apply(this, arguments);
    }
    Listen.prototype.description = function() {
      return "Returns an array of all spaces which have units in them.";
    };
    Listen.prototype.perform = function() {
      var unit, units;
      units = (function() {
        var _i, _len, _ref, _results;
        _ref = this.unit.position.floor.units();
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          unit = _ref[_i];
          if (unit !== this.unit) {
            _results.push(unit);
          }
        }
        return _results;
      }).call(this);
      return _.compact(units);
    };
    return Listen;
  })();
  root = typeof exports !== "undefined" && exports !== null ? exports : window;
  root.Listen = Listen;
}).call(this);
}, "js_warrior/abilities/look": function(exports, require, module) {(function() {
  var Look, Sense, root, _;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  Sense = require('./sense').Sense;
  _ = require('underscore')._;
  Look = (function() {
    __extends(Look, Sense);
    function Look() {
      Look.__super__.constructor.apply(this, arguments);
    }
    Look.prototype.description = function() {
      return "Returns an array of up to three Spaces in the given direction (forward by default).";
    };
    Look.prototype.perform = function(direction) {
      var offset, _results;
      if (direction == null) {
        direction = 'forward';
      }
      this.verifyDirection(direction);
      _results = [];
      for (offset = 1; offset <= 3; offset++) {
        _results.push(this.space(direction, offset));
      }
      return _results;
    };
    return Look;
  })();
  root = typeof exports !== "undefined" && exports !== null ? exports : window;
  root.Look = Look;
}).call(this);
}, "js_warrior/abilities/pivot": function(exports, require, module) {(function() {
  var Action, Pivot, root;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  Action = require('./action').Action;
  Pivot = (function() {
    __extends(Pivot, Action);
    function Pivot() {
      Pivot.__super__.constructor.apply(this, arguments);
    }
    Pivot.ROTATION_DIRECTIONS = ['forward', 'right', 'backward', 'left'];
    Pivot.prototype.description = function() {
      return "Rotate 'left', 'right' or 'backward' (default)";
    };
    Pivot.prototype.perform = function(direction) {
      if (direction == null) {
        direction = 'backward';
      }
      this.verifyDirection(direction);
      this.unit.position.rotate(Pivot.ROTATION_DIRECTIONS.indexOf(direction));
      return this.unit.say("pivots " + direction);
    };
    return Pivot;
  })();
  root = typeof exports !== "undefined" && exports !== null ? exports : window;
  root.Pivot = Pivot;
}).call(this);
}, "js_warrior/abilities/rescue": function(exports, require, module) {(function() {
  var Action, Rescue, root;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  Action = require('./action').Action;
  Rescue = (function() {
    __extends(Rescue, Action);
    function Rescue() {
      Rescue.__super__.constructor.apply(this, arguments);
    }
    Rescue.prototype.description = function() {
      return "Rescue a captive from his chains (earning 20 points) in given direction (forward by default).";
    };
    Rescue.prototype.perform = function(direction) {
      var receiver;
      if (direction == null) {
        direction = 'forward';
      }
      this.verifyDirection(direction);
      if (this.space(direction).isCaptive()) {
        receiver = this.getUnit(direction);
        this.unit.say("unbinds " + direction + " and rescues " + receiver);
        receiver.unbind();
        if (receiver.constructor.name === "Captive") {
          receiver.position = null;
          return this.unit.earnPoints(20);
        }
      } else {
        return this.unit.say("unbinds " + direction + " and rescues nothing");
      }
    };
    return Rescue;
  })();
  root = typeof exports !== "undefined" && exports !== null ? exports : window;
  root.Rescue = Rescue;
}).call(this);
}, "js_warrior/abilities/rest": function(exports, require, module) {(function() {
  var Action, Rest, root;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  Action = require('./action').Action;
  Rest = (function() {
    __extends(Rest, Action);
    function Rest() {
      Rest.__super__.constructor.apply(this, arguments);
    }
    Rest.prototype.description = function() {
      return "Gain 10% of max health back, but do nothing more.";
    };
    Rest.prototype.perform = function(direction) {
      var amount;
      if (direction == null) {
        direction = 'forward';
      }
      if (this.unit.health < this.unit.maxHealth()) {
        amount = Math.round(this.unit.maxHealth() * 0.1);
        if ((this.unit.health + amount) > this.unit.maxHealth()) {
          amount = this.unit.maxHealth() - this.unit.health;
        }
        this.unit.health += amount;
        return this.unit.say("receives " + amount + " health from resting, up to " + this.unit.health + " health");
      } else {
        return this.unit.say("is already fit as a fiddle");
      }
    };
    return Rest;
  })();
  root = typeof exports !== "undefined" && exports !== null ? exports : window;
  root.Rest = Rest;
}).call(this);
}, "js_warrior/abilities/sense": function(exports, require, module) {(function() {
  var BaseAbilities, Sense, root;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  BaseAbilities = require('./base_abilities').BaseAbilities;
  Sense = (function() {
    __extends(Sense, BaseAbilities);
    function Sense(unit) {
      this.unit = unit;
    }
    Sense.prototype.isSense = function() {
      return true;
    };
    return Sense;
  })();
  root = typeof exports !== "undefined" && exports !== null ? exports : window;
  root.Sense = Sense;
}).call(this);
}, "js_warrior/abilities/shoot": function(exports, require, module) {(function() {
  var Action, Shoot, root, _;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  }, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  Action = require('./action').Action;
  _ = require('underscore')._;
  Shoot = (function() {
    __extends(Shoot, Action);
    function Shoot() {
      Shoot.__super__.constructor.apply(this, arguments);
    }
    Shoot.prototype.description = function() {
      return "Shoot your bow & arrow in given direction (forward by default).";
    };
    Shoot.prototype.perform = function(direction) {
      var receiver;
      if (direction == null) {
        direction = 'forward';
      }
      this.verifyDirection(direction);
      receiver = _.first(_.compact(this.multiUnits(direction, [1, 2, 3])));
      if (receiver) {
        this.unit.say("shoots " + direction + " and hits " + receiver);
        return this.damage(receiver, this.unit.shootPower());
      } else {
        return this.unit.say("shoots and hits nothing");
      }
    };
    Shoot.prototype.multiUnits = function(direction, range) {
      return _.map(range, __bind(function(r) {
        return this.getUnit(direction, r);
      }, this));
    };
    return Shoot;
  })();
  root = typeof exports !== "undefined" && exports !== null ? exports : window;
  root.Shoot = Shoot;
}).call(this);
}, "js_warrior/abilities/walk": function(exports, require, module) {(function() {
  var Action, Walk, root;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  Action = require('./action').Action;
  Walk = (function() {
    __extends(Walk, Action);
    function Walk(unit) {
      this.unit = unit;
    }
    Walk.prototype.description = function() {
      return "Move in the given direction (forward by default).";
    };
    Walk.prototype.perform = function(direction) {
      var _ref;
      if (direction == null) {
        direction = 'forward';
      }
      this.verifyDirection(direction);
      if (this.unit.position) {
        this.unit.say("walks " + direction);
        if (this.space(direction).isEmpty()) {
          return (_ref = this.unit.position).move.apply(_ref, this.offset(direction));
        } else {
          return this.unit.say("bumps into " + (this.space(direction)));
        }
      }
    };
    return Walk;
  })();
  root = typeof exports !== "undefined" && exports !== null ? exports : window;
  root.Walk = Walk;
}).call(this);
}, "js_warrior/controller": function(exports, require, module) {(function() {
  var Controller, EventEmitter, Game, Profile, Views, root;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  Profile = require("./profile").Profile;
  Game = require("./game").Game;
  Views = require("./views").Views;
  EventEmitter = require("events").EventEmitter;
  Controller = (function() {
    function Controller($, editor, coffee, modernizr) {
      this.$ = $;
      this.editor = editor;
      this.coffee = coffee;
      this.modernizr = modernizr != null ? modernizr : nil;
      this.emitter = new EventEmitter();
      this.emitter.on("game.level.failed", __bind(function() {
        return this.onLevelFailed();
      }, this));
      this.emitter.on("game.level.complete", __bind(function() {
        return this.onLevelCompleted();
      }, this));
      this.emitter.on("game.play.error", __bind(function() {
        return this.onLevelFailed();
      }, this));
      this.emitter.on("game.epic.end", __bind(function() {
        return this.onGameCompleted();
      }, this));
      if (this.modernizr.history) {
        this.emitter.on("game.level.loaded", __bind(function(lvl) {
          return this.onLevelLoaded(lvl);
        }, this));
      }
    }
    Controller.prototype.setup = function() {
      this.setupViews();
      return this.setupModels();
    };
    Controller.prototype.setupModels = function() {
      this.profile = new Profile(this.emitter);
      return this.game = new Game(this.emitter, this.profile);
    };
    Controller.prototype.setupViews = function() {
      this.view = new Views.HtmlView(this.emitter, $);
      this.view.listen();
      this.$("#run").click(__bind(function() {
        var compiled, source;
        source = this.editor.getSession().getValue();
        this.profile.sourceCode = source;
        if (this.coffee) {
          compiled = this.coffee.compile(source, {
            bare: true
          });
        } else {
          compiled = source;
        }
        if (this.isEpic()) {
          this.profile.levelNumber = 1;
          this.profile.currentEpicScore = 0;
          this.profile.currentEpicGrades = {};
          this.view.clear();
          this.game = new Game(this.emitter, this.profile);
          this.game.load();
        } else if (this.started) {
          this.game.load();
        }
        this.game.start(compiled);
        this.$("#run").hide();
        this.$("#stop").show();
        return this.started = true;
      }, this));
      this.$("#stop").click(__bind(function() {
        this.game.stop();
        this.$("#run").show();
        return this.$("#stop").hide();
      }, this));
      this.$("#hint").click(__bind(function() {
        return this.$("#more_hint_message").toggle();
      }, this));
      this.$("#begin").click(__bind(function() {
        var name, tower;
        name = this.$("#name").val();
        tower = this.$("#tower_button").val();
        console.log("begin " + name + " " + tower);
        this.profile.warriorName = name;
        this.setGameLevel(tower, 1, false);
        return false;
      }, this));
      return this.$("#welcome").show();
    };
    Controller.prototype.setGameLevel = function(towerPath, level, epic) {
      if (towerPath == null) {
        towerPath = 'beginner';
      }
      if (level == null) {
        level = 1;
      }
      if (epic == null) {
        epic = false;
      }
      if (epic) {
        this.profile.epic = true;
        this.profile.levelNumber = 1;
        this.profile.currentEpicScore = 0;
        this.profile.currentEpicGrades = {};
        if (towerPath === 'beginner') {
          this.profile.addAbilities('walk', 'feel', 'attack', 'health', 'rest', 'rescue', 'pivot', 'look', 'shoot');
        } else {
          this.profile.addAbilities('walk', 'feel', 'directionOfStairs', 'attack', 'health', 'rest', 'rescue', 'bind', 'listen', 'directionOf', 'look', 'detonate', 'distanceOf');
        }
      } else {
        this.profile.levelNumber = level;
      }
      this.profile.towerPath = towerPath;
      this.game.load();
      this.$("#control").show();
      this.$("#display").show();
      this.$("#header").show();
      this.$("#welcome").hide();
      this.$("#editor").show();
      this.$("#hint").show();
      this.$("#run").show();
      return this.editor.setTheme("ace/theme/cobalt");
    };
    Controller.prototype.setProfile = function(encodedProfile) {
      this.profile.decode(encodedProfile);
      if (this.profile.sourceCode) {
        this.editor.getSession().setValue(this.profile.sourceCode);
      }
      this.game.load();
      this.$("#control").show();
      this.$("#display").show();
      this.$("#header").show();
      this.$("#welcome").hide();
      this.$("#editor").show();
      this.$("#hint").show();
      this.$("#run").show();
      return this.editor.setTheme("ace/theme/cobalt");
    };
    Controller.prototype.onLevelFailed = function() {
      this.$("#run").show();
      this.$("#stop").hide();
      return this.$("#hint").show();
    };
    Controller.prototype.onLevelCompleted = function() {
      if (!this.isEpic()) {
        this.$("#run").show();
        this.$("#stop").hide();
        this.$("#hint").show();
        return this.started = false;
      }
    };
    Controller.prototype.onGameCompleted = function() {
      this.$("#run").show();
      this.$("#stop").hide();
      this.$("#hint").show();
      return this.started = false;
    };
    Controller.prototype.onLevelLoaded = function(level) {};
    Controller.prototype.isEpic = function() {
      return this.profile.isEpic();
    };
    return Controller;
  })();
  root = typeof exports !== "undefined" && exports !== null ? exports : window;
  root.Controller = Controller;
}).call(this);
}, "js_warrior/floor": function(exports, require, module) {(function() {
  var Floor, Position, Space, root, _;
  Space = require('./space').Space;
  Position = require('./position').Position;
  _ = require('underscore')._;
  Floor = (function() {
    function Floor() {
      this.width = 0;
      this.height = 0;
      this.__units = [];
      this.stairs_location = [-1, -1];
    }
    Floor.prototype.add = function(unit, x, y, direction) {
      if (direction == null) {
        direction = null;
      }
      this.__units.push(unit);
      return unit.position = new Position(this, x, y, direction);
    };
    Floor.prototype.placeStairs = function(x, y) {
      return this.stairs_location = [x, y];
    };
    Floor.prototype.stairsSpace = function() {
      return this.space.apply(this, this.stairs_location);
    };
    Floor.prototype.units = function() {
      var unit, units, _i, _len, _ref;
      units = [];
      _ref = this.__units;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        unit = _ref[_i];
        if (unit.position) {
          units.push(unit);
        }
      }
      return units;
    };
    Floor.prototype.otherUnits = function() {
      var unit, units, _i, _len, _ref;
      units = [];
      _ref = this.units();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        unit = _ref[_i];
        if (unit.constructor.name !== 'Warrior') {
          units.push(unit);
        }
      }
      return units;
    };
    Floor.prototype.get = function(x, y) {
      return _.detect(this.__units, function(unit) {
        if (unit && unit.position) {
          return unit.position.at(x, y);
        }
      });
    };
    Floor.prototype.space = function(x, y) {
      return new Space(this, x, y);
    };
    Floor.prototype.isOutOfBounds = function(x, y) {
      return x < 0 || y < 0 || x > this.width - 1 || y > this.height - 1;
    };
    Floor.prototype.character = function() {
      var line, row, rows, x, y, _ref, _ref2;
      line = " " + ((function() {
        var _ref, _results;
        _results = [];
        for (x = 0, _ref = this.width - 1; 0 <= _ref ? x <= _ref : x >= _ref; 0 <= _ref ? x++ : x--) {
          _results.push("-");
        }
        return _results;
      }).call(this)).join('');
      rows = [];
      rows.push(line);
      for (y = 0, _ref = this.height - 1; 0 <= _ref ? y <= _ref : y >= _ref; 0 <= _ref ? y++ : y--) {
        row = "|";
        for (x = 0, _ref2 = this.width - 1; 0 <= _ref2 ? x <= _ref2 : x >= _ref2; 0 <= _ref2 ? x++ : x--) {
          row += this.space(x, y).character();
        }
        row += "|";
        rows.push(row);
      }
      rows.push(line);
      return rows.join('\n');
    };
    Floor.prototype.uniqueUnits = function() {
      var unique_unit_names, unique_units, unit, _i, _len, _ref;
      unique_units = [];
      _ref = this.__units;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        unit = _ref[_i];
        unique_unit_names = (function() {
          var _j, _len2, _results;
          _results = [];
          for (_j = 0, _len2 = unique_units.length; _j < _len2; _j++) {
            unit = unique_units[_j];
            _results.push(unit.constructor.name);
          }
          return _results;
        })();
        if (unique_unit_names.indexOf(unit.constructor.name) === -1) {
          unique_units.push(unit);
        }
      }
      return unique_units;
    };
    return Floor;
  })();
  root = typeof exports !== "undefined" && exports !== null ? exports : window;
  root.Floor = Floor;
}).call(this);
}, "js_warrior/game": function(exports, require, module) {(function() {
  var Game, Level, Profile, root, _;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  Profile = require('./profile').Profile;
  Level = require('./level').Level;
  _ = require('underscore')._;
  Game = (function() {
    var EPIC_TIME, NORMAL_TIME;
    NORMAL_TIME = 600;
    EPIC_TIME = 100;
    function Game(emitter, profile) {
      var _ref;
      this.emitter = emitter;
      this.profile = profile != null ? profile : null;
      if ((_ref = this.profile) == null) {
        this.profile = new Profile(this.emitter);
      }
      this.currentLevel = null;
      this.running = false;
    }
    Game.prototype.load = function(playerSource) {
      if (playerSource == null) {
        playerSource = null;
      }
      return this.getCurrentLevel().loadLevel();
    };
    Game.prototype.start = function(playerSource) {
      if (playerSource == null) {
        playerSource = null;
      }
      if (this.getCurrentLevel().loadPlayer(playerSource)) {
        this.stop();
        this.emitter.emit('game.start');
        return this.playNormalMode();
      }
    };
    Game.prototype.stop = function() {
      if (this.intervalId) {
        clearInterval(this.intervalId);
      }
      return this.running = false;
    };
    Game.prototype.playNormalMode = function() {
      return this.playCurrentLevel();
    };
    Game.prototype.playCurrentLevel = function() {
      this.emitter.emit('game.level.start', this.currentLevel);
      if (this.profile.epic) {
        return this.intervalId = setInterval((__bind(function() {
          return this.playGame();
        }, this)), EPIC_TIME);
      } else {
        return this.intervalId = setInterval((__bind(function() {
          return this.playGame();
        }, this)), NORMAL_TIME);
      }
    };
    Game.prototype.playGame = function(step) {
      var haveFurtherStep;
      if (step == null) {
        step = 1;
      }
      this.running = true;
      haveFurtherStep = true;
      try {
        this.currentLevel.play(step);
      } catch (e) {
        this.emitter.emit("game.play.error", e);
        this.stop();
      }
      if (this.currentLevel.isPassed()) {
        if (!this.profile.isEpic()) {
          this.stop();
        }
        this.currentLevel.completed();
        return this.requestNextLevel();
      } else if (this.currentLevel.isFailed()) {
        this.stop();
        return this.emitter.emit("game.level.failed", this.getCurrentLevel());
      }
    };
    Game.prototype.prepareEpicMode = function() {
      this.profile.score = 0;
      this.profile.epic = true;
      this.profile.levelNumber = 1;
      this.profile.currentEpicScore = 0;
      this.profile.currentEpicGrades = {};
      this.currentLevel = this.profile.currentLevel();
      this.nextLevel = this.profile.nextLevel();
      return this.getCurrentLevel().loadLevel();
    };
    Game.prototype.finalReport = function() {
      var level, levels, report;
      levels = (function() {
        var _i, _len, _ref, _results;
        _ref = _.keys(this.profile.currentEpicGrades);
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          level = _ref[_i];
          _results.push("  Level " + level + ": " + (Level.gradeLetter(this.profile.currentEpicGrades[level])));
        }
        return _results;
      }).call(this);
      report = "Your average grade for this tower is: " + (Level.gradeLetter(this.profile.calculateAverageGrade())) + "<br/>    " + (levels.join('<br/>\n')) + "<br/>";
      console.log(levels.join('\n'));
      return report;
    };
    Game.prototype.requestNextLevel = function() {
      var player, _ref;
      if (this.getNextLevel().isExists()) {
        if (this.profile.isEpic()) {
          player = this.getCurrentLevel().player;
        }
        this.currentLevel = this.getNextLevel();
        this.profile.levelNumber += 1;
        this.nextLevel = this.profile.nextLevel();
        if (this.profile.isEpic()) {
          this.getCurrentLevel().player = player;
        }
        return this.getCurrentLevel().loadLevel();
      } else {
        this.emitter.emit("game.end");
        if (this.profile.isEpic()) {
          if ((_ref = this.emitter) != null) {
            _ref.emit('game.level.changed', this.getCurrentLevel());
          }
          this.stop();
          return this.emitter.emit("game.epic.end", this);
        } else {
          this.emitter.emit('game.epic.start', this);
          return this.prepareEpicMode();
        }
      }
    };
    Game.prototype.getCurrentLevel = function() {
      return this.currentLevel || (this.currentLevel = this.profile.currentLevel());
    };
    Game.prototype.getNextLevel = function() {
      return this.nextLevel || (this.nextLevel = this.profile.nextLevel());
    };
    Game.prototype.isRunning = function() {
      return this.running;
    };
    return Game;
  })();
  root = typeof exports !== "undefined" && exports !== null ? exports : window;
  root.Game = Game;
}).call(this);
}, "js_warrior/level": function(exports, require, module) {(function() {
  var EventEmitter, Level, LevelLoader, Players, Utils, root, _;
  _ = require('underscore')._;
  EventEmitter = require('events').EventEmitter;
  Utils = require('./utils').Utils;
  LevelLoader = require('./level_loader').LevelLoader;
  Players = require('./players').Players;
  Level = (function() {
    function Level(profile, number, emitter) {
      this.profile = profile;
      this.number = number;
      this.emitter = emitter != null ? emitter : null;
      this.timeBonus = 0;
      this.description = "";
      this.tip = "";
      this.clue = "";
      this.warrior = null;
      this.floor = null;
      this.player = null;
      this.aceScore = 0;
      this.currentTurn = 0;
    }
    Level.prototype.loadPath = function() {
      var level_path, project_root;
      if (typeof __dirname !== "undefined") {
        project_root = __dirname + "/../../towers/";
      } else {
        project_root = "";
      }
      level_path = this.profile.towerPath + "/level_" + Utils.lpad(this.number.toString(), '0', 3);
      return project_root + level_path;
    };
    Level.prototype.loadLevel = function() {
      var level, loader, _ref;
      loader = new LevelLoader(this);
      level = require(this.loadPath()).level;
      level.apply(loader);
      this.currentTurn = 0;
      if ((_ref = this.emitter) != null) {
        _ref.emit('game.level.loaded', this);
      }
      return this;
    };
    Level.prototype.loadPlayer = function(jsString) {
      var Player, _ref;
      if (jsString == null) {
        jsString = null;
      }
      Player = Players.LazyPlayer;
      try {
        if (jsString) {
          Player = eval(jsString);
        }
        this.player = new Player();
        return this.warrior.player = this.player;
      } catch (e) {
        if ((_ref = this.emitter) != null) {
          _ref.emit("game.play.error", e);
        }
        return;
      }
    };
    Level.prototype.play = function() {
      var unit, _i, _j, _len, _len2, _ref, _ref2, _ref3;
      if (this.isPassed() || this.isFailed()) {
        return;
      }
      this.currentTurn += 1;
      if ((_ref = this.emitter) != null) {
        _ref.emit('game.level.changed', this);
      }
      _ref2 = this.floor.units();
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        unit = _ref2[_i];
        unit.prepareTurn();
      }
      _ref3 = this.floor.units();
      for (_j = 0, _len2 = _ref3.length; _j < _len2; _j++) {
        unit = _ref3[_j];
        unit.performTurn();
      }
      if (this.timeBonus > 0) {
        return this.timeBonus = this.timeBonus - 1;
      }
    };
    Level.prototype.completed = function() {
      var rate, score, scoreCalculation, _ref;
      score = 0;
      console.log('level score', this.warrior.score);
      score += this.warrior.score;
      console.log('time bonus', this.timeBonus);
      score += this.timeBonus;
      if (this.floor.otherUnits().length === 0) {
        console.log('clear bonus', this.clearBonus());
        score += this.clearBonus();
      } else {
        console.log('other units', this.floor.otherUnits());
      }
      if (this.profile.isEpic()) {
        scoreCalculation = this.scoreCalculation(this.profile.currentEpicScore, score);
        if (this.aceScore) {
          rate = this.profile.currentEpicGrades[this.number] = score / this.aceScore;
        }
        console.log("lvl " + this.number + ": (score / @aceScore) == (" + score + " / " + this.aceScore + ")");
        this.profile.currentEpicScore += score;
      } else {
        scoreCalculation = this.scoreCalculation(this.profile.score, score);
        if (this.aceScore) {
          rate = score / this.aceScore;
        }
        this.profile.score += score;
        (_ref = this.profile).addAbilities.apply(_ref, _.keys(this.warrior.abilities));
      }
      this.emitter.emit("game.level.complete", this);
      return this.emitter.emit("game.level.report", {
        grade: Level.gradeLetter(rate),
        levelScore: this.warrior.score,
        timeBonus: this.timeBonus,
        clearBonus: this.clearBonus(),
        scoreCalculation: scoreCalculation
      });
    };
    Level.prototype.isPassed = function() {
      var _ref, _ref2;
      return !!((_ref = this.floor) != null ? (_ref2 = _ref.stairsSpace()) != null ? _ref2.isWarrior() : void 0 : void 0);
    };
    Level.prototype.isFailed = function() {
      var _ref;
      return ((_ref = this.floor) != null ? _ref.units().indexOf(this.warrior) : void 0) === -1;
    };
    Level.prototype.scoreCalculation = function(currentScore, addScore) {
      if (currentScore === 0) {
        return "" + addScore;
      } else {
        return "" + currentScore + " + " + addScore + " = " + (currentScore + addScore);
      }
    };
    Level.prototype.isExists = function() {
      var level;
      try {
        level = require(this.loadPath()).level;
        return true;
      } catch (e) {
        return false;
      }
    };
    Level.prototype.clearBonus = function() {
      return Math.round((this.warrior.score + this.timeBonus) * 0.2);
    };
    Level.prototype.setupWarrior = function(warrior) {
      var _ref;
      this.warrior = warrior;
      (_ref = this.warrior).addAbilities.apply(_ref, this.profile.abilities);
      this.warrior.setName(this.profile.warriorName);
      this.warrior.player = this.player;
      return this.warrior;
    };
    Level.gradeLetter = function(percent) {
      if (percent >= 1.0) {
        return "S";
      } else if (percent >= 0.9) {
        return "A";
      } else if (percent >= 0.8) {
        return "B";
      } else if (percent >= 0.7) {
        return "C";
      } else if (percent >= 0.6) {
        return "D";
      } else {
        return "F";
      }
    };
    return Level;
  })();
  root = typeof exports !== "undefined" && exports !== null ? exports : window;
  root.Level = Level;
}).call(this);
}, "js_warrior/level_loader": function(exports, require, module) {(function() {
  var Floor, LevelLoader, Units, Utils, root;
  Floor = require('./floor').Floor;
  Units = require('./units').Units;
  Utils = require('./utils').Utils;
  LevelLoader = (function() {
    function LevelLoader(level) {
      this.floor = new Floor();
      this.level = level;
      if (level) {
        this.level.floor = this.floor;
      }
    }
    LevelLoader.prototype.description = function(desc) {
      return this.level.description = desc;
    };
    LevelLoader.prototype.tip = function(tip) {
      return this.level.tip = tip;
    };
    LevelLoader.prototype.clue = function(clue) {
      return this.level.clue = clue;
    };
    LevelLoader.prototype.time_bonus = function(bonus) {
      return this.level.timeBonus = bonus;
    };
    LevelLoader.prototype.ace_score = function(score) {
      return this.level.aceScore = score;
    };
    LevelLoader.prototype.size = function(width, height) {
      this.floor.width = width;
      return this.floor.height = height;
    };
    LevelLoader.prototype.stairs = function(x, y) {
      return this.floor.placeStairs(x, y);
    };
    LevelLoader.prototype.unit = function(unit, x, y, facing, block) {
      var camelName;
      if (facing == null) {
        facing = 'north';
      }
      if (block == null) {
        block = null;
      }
      try {
        camelName = "new Units." + (Utils.toCamelCase(unit)) + "()";
        unit = eval(camelName);
      } catch (e) {
        console.trace(e);
        throw "LevelLoader: failed initialized unit: " + unit;
      }
      this.floor.add(unit, x, y, facing);
      if (block) {
        block.call(unit, unit);
      }
      unit.emitter = this.level.emitter;
      return unit;
    };
    LevelLoader.prototype.warrior = function(x, y, facing, block) {
      var unit;
      if (facing == null) {
        facing = 'north';
      }
      unit = this.level.setupWarrior(this.unit('warrior', x, y, facing, block));
      unit.emitter = this.level.emitter;
      return unit;
    };
    return LevelLoader;
  })();
  root = typeof exports !== "undefined" && exports !== null ? exports : window;
  root.LevelLoader = LevelLoader;
}).call(this);
}, "js_warrior/players": function(exports, require, module) {(function() {
  exports.Players = {
    LazyPlayer: require('./players/lazy_player').LazyPlayer,
    ProcPlayer: require('./players/proc_player').ProcPlayer
  };
}).call(this);
}, "js_warrior/players/lazy_player": function(exports, require, module) {(function() {
  var LazyPlayer, root;
  LazyPlayer = (function() {
    function LazyPlayer() {}
    LazyPlayer.prototype.playTurn = function(warrior) {};
    return LazyPlayer;
  })();
  root = typeof exports !== "undefined" && exports !== null ? exports : window;
  root.LazyPlayer = LazyPlayer;
}).call(this);
}, "js_warrior/players/proc_player": function(exports, require, module) {(function() {
  var ProcPlayer, root;
  ProcPlayer = (function() {
    var DIRECTIONS, RELATIVE_DIRECTIONS;
    function ProcPlayer() {}
    DIRECTIONS = ['north', 'east', 'south', 'west'];
    RELATIVE_DIRECTIONS = ['forward', 'right', 'backward', 'left'];
    ProcPlayer.prototype.playTurn = function(warrior) {
      var dir, losingHealth, space, _i, _len;
      losingHealth = this.lastHealth > warrior.health();
      this.lastHealth = warrior.health();
      for (_i = 0, _len = RELATIVE_DIRECTIONS.length; _i < _len; _i++) {
        dir = RELATIVE_DIRECTIONS[_i];
        space = warrior.feel(dir);
        if (space.isEnemy()) {
          warrior.attack();
          return;
        }
      }
      if (warrior.health() < 20 && !losingHealth) {
        warrior.rest();
        return;
      }
      return warrior.walk('forward');
    };
    return ProcPlayer;
  })();
  root = typeof exports !== "undefined" && exports !== null ? exports : window;
  root.ProcPlayer = ProcPlayer;
}).call(this);
}, "js_warrior/position": function(exports, require, module) {(function() {
  var Position, root;
  Position = (function() {
    Position.DIRECTIONS = ['north', 'east', 'south', 'west'];
    Position.RELATIVE_DIRECTIONS = ['forward', 'right', 'backward', 'left'];
    function Position(floor, x, y, direction) {
      this.floor = floor;
      this.x = x;
      this.y = y;
      if (direction == null) {
        direction = null;
      }
      this.directionIndex = Position.DIRECTIONS.indexOf(direction || 'north');
    }
    Position.prototype.at = function(x, y) {
      return this.x === x && this.y === y;
    };
    Position.prototype.direction = function() {
      return Position.DIRECTIONS[this.directionIndex];
    };
    Position.prototype.rotate = function(amount) {
      var _results;
      this.directionIndex += amount;
      while (this.directionIndex > 3) {
        this.directionIndex -= 4;
      }
      _results = [];
      while (this.directionIndex < 0) {
        _results.push(this.directionIndex += 4);
      }
      return _results;
    };
    Position.prototype.relativeSpace = function(forward, right) {
      var x, y, _ref;
      if (right == null) {
        right = 0;
      }
      _ref = this.translateOffset(forward, right), x = _ref[0], y = _ref[1];
      return this.floor.space(x, y);
    };
    Position.prototype.space = function() {
      return this.floor.space(this.x, this.y);
    };
    Position.prototype.move = function(forward, right) {
      var _ref;
      if (right == null) {
        right = 0;
      }
      return _ref = this.translateOffset(forward, right), this.x = _ref[0], this.y = _ref[1], _ref;
    };
    Position.prototype.distanceFromStairs = function() {
      return distanceOf(this.floor.stairsSpace());
    };
    Position.prototype.distanceOf = function(space) {
      var x, y, _ref;
      _ref = space.location(), x = _ref[0], y = _ref[1];
      return Math.abs(this.x - x) + Math.abs(this.y - y);
    };
    Position.prototype.relativeDirectionOfStairs = function() {
      return this.relativeDirectionOf(this.floor.stairsSpace());
    };
    Position.prototype.relativeDirectionOf = function(space) {
      return this.relativeDirection(this.directionOf(space));
    };
    Position.prototype.directionOf = function(space) {
      var space_x, space_y, _ref;
      _ref = space.location(), space_x = _ref[0], space_y = _ref[1];
      if (Math.abs(this.x - space_x) > Math.abs(this.y - space_y)) {
        if (space_x > this.x) {
          return 'east';
        } else {
          return 'west';
        }
      } else {
        if (space_y > this.y) {
          return 'south';
        } else {
          return 'north';
        }
      }
    };
    Position.prototype.relativeDirection = function(direction) {
      var offset;
      offset = Position.DIRECTIONS.indexOf(direction) - this.directionIndex;
      while (offset > 3) {
        offset -= 4;
      }
      while (offset < 0) {
        offset += 4;
      }
      return Position.RELATIVE_DIRECTIONS[offset];
    };
    Position.prototype.translateOffset = function(forward, right) {
      switch (this.direction()) {
        case 'north':
          return [this.x + right, this.y - forward];
        case 'east':
          return [this.x + forward, this.y + right];
        case 'south':
          return [this.x - right, this.y + forward];
        case 'west':
          return [this.x - forward, this.y - right];
      }
    };
    return Position;
  })();
  root = typeof exports !== "undefined" && exports !== null ? exports : window;
  root.Position = Position;
}).call(this);
}, "js_warrior/profile": function(exports, require, module) {(function() {
  var Base64, Level, Profile, Tower, root, _;
  var __slice = Array.prototype.slice;
  Tower = require('./tower').Tower;
  Level = require('./level').Level;
  Base64 = require('base64').Base64;
  _ = require('underscore')._;
  Profile = (function() {
    function Profile(emitter) {
      this.emitter = emitter != null ? emitter : null;
      this.towerPath = "beginner";
      this.warriorName = null;
      this.score = 0;
      this.abilities = [];
      this.levelNumber = 1;
      this.epic = false;
      this.lastLevelNumber = void 0;
      this.currentEpicScore = 0;
      this.currentEpicGrades = {};
      this.epicScore = 0;
      this.sourceCode = null;
    }
    Profile.prototype.toString = function() {
      return [this.warriorName, "level " + this.levelNumber, "score " + this.score].join('-');
    };
    Profile.prototype.tower = function() {
      return new Tower(this.towerPath);
    };
    Profile.prototype.currentLevel = function() {
      return new Level(this, this.levelNumber, this.emitter);
    };
    Profile.prototype.nextLevel = function() {
      return new Level(this, this.levelNumber + 1, this.emitter);
    };
    Profile.prototype.isEpic = function() {
      return this.epic;
    };
    Profile.prototype.addAbilities = function() {
      var ability, newAbilities, _i, _len;
      newAbilities = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      for (_i = 0, _len = newAbilities.length; _i < _len; _i++) {
        ability = newAbilities[_i];
        if (ability) {
          this.abilities.push(ability);
        }
      }
      return this.abilities = _.uniq(this.abilities);
    };
    Profile.prototype.calculateAverageGrade = function() {
      var noOfGrades, score, sum, _i, _len, _ref;
      noOfGrades = _.values(this.currentEpicGrades).length;
      if (noOfGrades > 0) {
        sum = 0.0;
        _ref = _.values(this.currentEpicGrades);
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          score = _ref[_i];
          sum += score;
        }
        return sum / noOfGrades;
      } else {
        return 0.0;
      }
    };
    Profile.prototype.encode = function() {
      return Base64.encode(JSON.stringify(this));
    };
    Profile.prototype.decode = function(text) {
      var data;
      data = JSON.parse(Base64.decode(text));
      this.towerPath = data.towerPath;
      this.warriorName = data.warriorName;
      this.score = data.score;
      this.abilities = data.abilities;
      this.levelNumber = data.levelNumber;
      this.epic = data.epic;
      this.lastLevelNumber = data.lastLevelNumber;
      this.currentEpicScore = data.currentEpicScore;
      this.currentEpicGrades = data.currentEpicGrades;
      this.epicScore = data.epicScore;
      this.sourceCode = data.sourceCode;
      return this;
    };
    return Profile;
  })();
  root = typeof exports !== "undefined" && exports !== null ? exports : window;
  root.Profile = Profile;
}).call(this);
}, "js_warrior/space": function(exports, require, module) {(function() {
  var Space, root, _;
  _ = require('underscore')._;
  Space = (function() {
    function Space(floor, x, y) {
      this.floor = floor;
      this.x = x;
      this.y = y;
    }
    Space.prototype.isWall = function() {
      return this.floor.isOutOfBounds(this.x, this.y);
    };
    Space.prototype.isWarrior = function() {
      var _ref;
      return ((_ref = this.getUnit()) != null ? _ref.constructor.name : void 0) === "Warrior";
    };
    Space.prototype.isGolem = function() {
      var _ref;
      return ((_ref = this.getUnit()) != null ? _ref.constructor.name : void 0) === "Golem";
    };
    Space.prototype.isPlayer = function() {
      return this.isWarrior() || this.isGolem();
    };
    Space.prototype.isEnemy = function() {
      return this.getUnit() !== null && !this.isPlayer() && !this.isCaptive();
    };
    Space.prototype.isCaptive = function() {
      return this.getUnit() !== null && this.getUnit().isBound();
    };
    Space.prototype.isEmpty = function() {
      return !this.getUnit() && !this.isWall();
    };
    Space.prototype.isStairs = function() {
      return _.isEqual(this.floor.stairs_location, this.location());
    };
    Space.prototype.isTicking = function() {
      return this.getUnit() !== null && this.getUnit().getAbilities()['explode'] !== null;
    };
    Space.prototype.getUnit = function() {
      return this.floor.get(this.x, this.y) || null;
    };
    Space.prototype.location = function() {
      return [this.x, this.y];
    };
    Space.prototype.character = function() {
      if (this.getUnit()) {
        return this.getUnit().character();
      } else if (this.isStairs()) {
        return ">";
      } else {
        return " ";
      }
    };
    Space.prototype.toString = function() {
      if (this.getUnit()) {
        return this.getUnit().toString();
      } else if (this.isWall()) {
        return "wall";
      } else {
        return "nothing";
      }
    };
    return Space;
  })();
  root = typeof exports !== "undefined" && exports !== null ? exports : window;
  root.Space = Space;
}).call(this);
}, "js_warrior/tower": function(exports, require, module) {(function() {
  var Tower, Utils, root;
  Utils = require('./utils').Utils;
  Tower = (function() {
    function Tower(path) {
      this.path = path;
    }
    Tower.prototype.name = function() {
      return Utils.basename(this.path);
    };
    Tower.prototype.toString = function() {
      return this.name();
    };
    return Tower;
  })();
  root = typeof exports !== "undefined" && exports !== null ? exports : window;
  root.Tower = Tower;
}).call(this);
}, "js_warrior/turn": function(exports, require, module) {(function() {
  var Abilities, Turn, Utils, root, _;
  Abilities = require('./abilities').Abilities;
  Utils = require('./utils').Utils;
  _ = require('underscore')._;
  Turn = (function() {
    function Turn(abilities) {
      var ability, camelAbilityName, name, params;
      if (abilities == null) {
        abilities = {};
      }
      this.action = null;
      this.senses = {};
      for (name in abilities) {
        params = abilities[name];
        camelAbilityName = Utils.toCamelCase(name);
        ability = eval("new Abilities." + camelAbilityName + "()");
        if (ability.isAction()) {
          this.addAction(name);
        } else {
          this.addSense(name, params);
        }
      }
    }
    Turn.prototype.addAction = function(action) {
      return eval("this." + action + " = function() { var __slice = Array.prototype.slice; var param; param = 1 <= arguments.length ? __slice.call(arguments, 0) : []; if (this.action) {throw 'You can only run one action per turn!'; } return this.action = ['" + action + "', param]; };");
    };
    Turn.prototype.addSense = function(name, params) {
      eval("this." + name + " = function(args) { return this.senses['" + name + "'].perform(args); };");
      return this.senses[name] = params;
    };
    return Turn;
  })();
  root = typeof exports !== "undefined" && exports !== null ? exports : window;
  root.Turn = Turn;
}).call(this);
}, "js_warrior/units": function(exports, require, module) {(function() {
  exports.Units = {
    BaseUnit: require('./units/base_unit').BaseUnit,
    Golem: require('./units/golem').Golem,
    Warrior: require('./units/warrior').Warrior,
    Sludge: require('./units/sludge').Sludge,
    ThickSludge: require('./units/thick_sludge').ThickSludge,
    Captive: require('./units/captive').Captive,
    Archer: require('./units/archer').Archer,
    Wizard: require('./units/wizard').Wizard
  };
}).call(this);
}, "js_warrior/units/archer": function(exports, require, module) {(function() {
  var Archer, BaseUnit, root;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  BaseUnit = require('./base_unit').BaseUnit;
  Archer = (function() {
    __extends(Archer, BaseUnit);
    function Archer(health, position) {
      this.health = health;
      this.position = position;
      Archer.__super__.constructor.apply(this, arguments);
      this.addAbilities('shoot', 'look');
    }
    Archer.prototype.playTurn = function(turn) {
      var direction, space, _i, _j, _len, _len2, _ref, _ref2, _results;
      _ref = ['forward', 'left', 'right'];
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        direction = _ref[_i];
        _ref2 = turn.look(direction);
        for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
          space = _ref2[_j];
          if (space.isPlayer()) {
            turn.shoot(direction);
            return;
          } else if (!space.isEmpty()) {
            break;
          }
        }
      }
      return _results;
    };
    Archer.prototype.shootPower = function() {
      return 3;
    };
    Archer.prototype.maxHealth = function() {
      return 7;
    };
    Archer.prototype.character = function() {
      return "a";
    };
    return Archer;
  })();
  root = typeof exports !== "undefined" && exports !== null ? exports : window;
  root.Archer = Archer;
}).call(this);
}, "js_warrior/units/base_unit": function(exports, require, module) {(function() {
  var Abilities, BaseUnit, Turn, Utils, root, _;
  var __slice = Array.prototype.slice;
  Utils = require('../utils').Utils;
  _ = require('underscore')._;
  Abilities = require('../abilities').Abilities;
  Turn = require('../turn').Turn;
  BaseUnit = (function() {
    function BaseUnit(health, position) {
      this.health = health;
      this.position = position;
      this.health || (this.health = this.maxHealth());
      this.bound = false;
    }
    BaseUnit.prototype.attackPower = function() {
      return 0;
    };
    BaseUnit.prototype.maxHealth = function() {
      return 0;
    };
    BaseUnit.prototype.earnPoints = function(point) {
      return;
    };
    BaseUnit.prototype.takeDamage = function(amount) {
      if (this.isBound()) {
        this.unbind();
      }
      if (this.health) {
        this.health -= amount;
        this.say("take " + amount + " damage, " + this.health + " health power left");
        if (this.health <= 0) {
          this.position = null;
          return this.say("dies");
        }
      }
    };
    BaseUnit.prototype.isAlive = function() {
      return this.position !== void 0 && this.position !== null;
    };
    BaseUnit.prototype.isBound = function() {
      return this.bound;
    };
    BaseUnit.prototype.unbind = function() {
      this.say("release from bonds");
      return this.bound = false;
    };
    BaseUnit.prototype.bind = function() {
      return this.bound = true;
    };
    BaseUnit.prototype.say = function(msg) {
      if (this.emitter) {
        return this.emitter.emit('unit.say', this.name(), msg);
      }
    };
    BaseUnit.prototype.name = function() {
      return this.constructor.name.replace("_", " ").replace(/^(.[a-z_ ]+)([A-Z])(.+)/, "$1 $2$3");
    };
    BaseUnit.prototype.toString = function() {
      return this.name();
    };
    BaseUnit.prototype.addAbilities = function() {
      var ability, camelAbility, new_abilities, _i, _len, _results;
      new_abilities = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      this.abilities = this.getAbilities();
      _results = [];
      for (_i = 0, _len = new_abilities.length; _i < _len; _i++) {
        ability = new_abilities[_i];
        camelAbility = Utils.toCamelCase(ability);
        _results.push((function() {
          try {
            this.abilities[ability] = eval("new Abilities." + camelAbility + "()");
            return this.abilities[ability].unit = this;
          } catch (e) {
            throw "BaseUnit.addAbilities: Unexpected ability: " + ability + " " + e;
          }
        }).call(this));
      }
      return _results;
    };
    BaseUnit.prototype.add_abilities = function() {
      var new_abilities;
      new_abilities = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return this.addAbilities.apply(this, new_abilities);
    };
    BaseUnit.prototype.nextTurn = function() {
      return new Turn(this.abilities);
    };
    BaseUnit.prototype.prepareTurn = function() {
      this.currentTurn = this.nextTurn();
      return this.playTurn(this.currentTurn);
    };
    BaseUnit.prototype.performTurn = function() {
      var ability, args, name, _i, _len, _ref, _ref2, _ref3;
      if (this.position) {
        _ref = _.values(this.getAbilities());
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          ability = _ref[_i];
          ability.passTurn();
        }
        if (this.currentTurn.action && !this.isBound()) {
          _ref2 = this.currentTurn.action, name = _ref2[0], args = _ref2[1];
          if (args && args.length === 0) {
            args = null;
          }
          return (_ref3 = this.abilities[name]).perform.apply(_ref3, args);
        }
      }
    };
    BaseUnit.prototype.playTurn = function(turn) {};
    BaseUnit.prototype.getAbilities = function() {
      return this.abilities || (this.abilities = {});
    };
    BaseUnit.prototype.character = function() {
      return "?";
    };
    return BaseUnit;
  })();
  root = typeof exports !== "undefined" && exports !== null ? exports : window;
  root.BaseUnit = BaseUnit;
}).call(this);
}, "js_warrior/units/captive": function(exports, require, module) {(function() {
  var BaseUnit, Captive, root;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  BaseUnit = require('./base_unit').BaseUnit;
  Captive = (function() {
    __extends(Captive, BaseUnit);
    function Captive(health, position) {
      this.health = health;
      this.position = position;
      Captive.__super__.constructor.apply(this, arguments);
      this.bind();
    }
    Captive.prototype.maxHealth = function() {
      return 1;
    };
    Captive.prototype.character = function() {
      return "C";
    };
    return Captive;
  })();
  root = typeof exports !== "undefined" && exports !== null ? exports : window;
  root.Captive = Captive;
}).call(this);
}, "js_warrior/units/golem": function(exports, require, module) {(function() {
  var BaseUnit, Golem, root;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  BaseUnit = require('./base_unit').BaseUnit;
  Golem = (function() {
    __extends(Golem, BaseUnit);
    function Golem(health, position) {
      this.health = health;
      this.position = position;
      Golem.__super__.constructor.apply(this, arguments);
      this.turn = null;
      this.maxHealth = 0;
    }
    Golem.prototype.playTurn = function(turn) {};
    Golem.prototype.attackPower = function() {
      return 3;
    };
    Golem.prototype.character = function() {
      return "G";
    };
    return Golem;
  })();
  root = typeof exports !== "undefined" && exports !== null ? exports : window;
  root.Golem = Golem;
}).call(this);
}, "js_warrior/units/sludge": function(exports, require, module) {(function() {
  var BaseUnit, Position, Sludge, root;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  BaseUnit = require('./base_unit').BaseUnit;
  Position = require('../position').Position;
  Sludge = (function() {
    __extends(Sludge, BaseUnit);
    function Sludge(health, position) {
      this.health = health;
      this.position = position;
      Sludge.__super__.constructor.apply(this, arguments);
      this.addAbilities('attack', 'feel');
    }
    Sludge.prototype.playTurn = function(turn) {
      var direction, _i, _len, _ref;
      _ref = Position.RELATIVE_DIRECTIONS;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        direction = _ref[_i];
        if (turn.feel(direction).isPlayer()) {
          turn.attack(direction);
          return;
        }
      }
    };
    Sludge.prototype.attackPower = function() {
      return 3;
    };
    Sludge.prototype.maxHealth = function() {
      return 12;
    };
    Sludge.prototype.character = function() {
      return "s";
    };
    return Sludge;
  })();
  root = typeof exports !== "undefined" && exports !== null ? exports : window;
  root.Sludge = Sludge;
}).call(this);
}, "js_warrior/units/thick_sludge": function(exports, require, module) {(function() {
  var Sludge, ThickSludge, root;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  Sludge = require('./sludge').Sludge;
  ThickSludge = (function() {
    __extends(ThickSludge, Sludge);
    function ThickSludge() {
      ThickSludge.__super__.constructor.apply(this, arguments);
    }
    ThickSludge.prototype.character = function() {
      return "S";
    };
    ThickSludge.prototype.maxHealth = function() {
      return 24;
    };
    return ThickSludge;
  })();
  root = typeof exports !== "undefined" && exports !== null ? exports : window;
  root.ThickSludge = ThickSludge;
}).call(this);
}, "js_warrior/units/warrior": function(exports, require, module) {(function() {
  var BaseUnit, Golem, Warrior, root;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  }, __slice = Array.prototype.slice;
  BaseUnit = require('./base_unit').BaseUnit;
  Golem = require('./golem').Golem;
  Warrior = (function() {
    __extends(Warrior, BaseUnit);
    function Warrior(health, position) {
      this.health = health;
      this.position = position;
      Warrior.__super__.constructor.apply(this, arguments);
      this.score = 0;
      this.golem_abilities = [];
    }
    Warrior.prototype.playTurn = function(turn) {
      var _ref;
      return (_ref = this.player) != null ? _ref.playTurn(turn) : void 0;
    };
    Warrior.prototype.earnPoints = function(points) {
      this.score += points;
      return this.say("earns " + points + " points");
    };
    Warrior.prototype.attackPower = function() {
      return 5;
    };
    Warrior.prototype.shootPower = function() {
      return 3;
    };
    Warrior.prototype.maxHealth = function() {
      return 20;
    };
    Warrior.prototype.name = function() {
      if (this.__name && this.__name !== "") {
        return this.__name;
      } else {
        return "Warrior";
      }
    };
    Warrior.prototype.setName = function(name) {
      return this.__name = name;
    };
    Warrior.prototype.toString = function() {
      return this.name();
    };
    Warrior.prototype.character = function() {
      return "@";
    };
    Warrior.prototype.performTurn = function() {
      if (this.currentTurn.action === null) {
        this.say("does nothing");
      }
      return Warrior.__super__.performTurn.apply(this, arguments);
    };
    Warrior.prototype.addGolemAbilities = function() {
      var abilities;
      abilities = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return this.golemAbilities = abilities;
    };
    Warrior.prototype.hasGolem = function() {
      return this.golemAbilities !== null && this.golemAbilities.length > 0;
    };
    Warrior.prototype.baseGolem = function() {
      var golem;
      golem = Golem["new"];
      golem.addAbilities(this.golemAbilities);
      return golem;
    };
    return Warrior;
  })();
  root = typeof exports !== "undefined" && exports !== null ? exports : window;
  root.Warrior = Warrior;
}).call(this);
}, "js_warrior/units/wizard": function(exports, require, module) {(function() {
  var Archer, Wizard, root;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  Archer = require('./archer').Archer;
  Wizard = (function() {
    __extends(Wizard, Archer);
    function Wizard() {
      Wizard.__super__.constructor.apply(this, arguments);
    }
    Wizard.prototype.shootPower = function() {
      return 11;
    };
    Wizard.prototype.maxHealth = function() {
      return 3;
    };
    Wizard.prototype.character = function() {
      return "w";
    };
    return Wizard;
  })();
  root = typeof exports !== "undefined" && exports !== null ? exports : window;
  root.Wizard = Wizard;
}).call(this);
}, "js_warrior/utils": function(exports, require, module) {(function() {
  var Utils, root;
  Utils = (function() {
    function Utils() {}
    Utils.toCamelCase = function(string) {
      var camelParts, idx, name;
      camelParts = (function() {
        var _ref, _results;
        _ref = string.split("_");
        _results = [];
        for (idx in _ref) {
          name = _ref[idx];
          _results.push(name.replace(/^[a-z]/, function($1) {
            return $1.toUpperCase();
          }));
        }
        return _results;
      })();
      return camelParts.join("");
    };
    Utils.toUnderscoreCase = function(string) {
      var under;
      under = string.replace(/[A-Z]/, function($1) {
        return "_" + ($1.toLowerCase());
      });
      return under.replace(/^_/, "");
    };
    Utils.toMethodCase = function(string) {
      var camelParts;
      camelParts = Utils.toCamelCase(string);
      return camelParts.replace(/^[A-Z]/, function($1) {
        return $1.toLowerCase();
      });
    };
    Utils.basename = function(path) {
      return path.replace(/^.*[\/\\]/g, '');
    };
    Utils.lpad = function(str, padString, length) {
      while (str.length < length) {
        str = padString + str;
      }
      return str;
    };
    Utils.rpad = function(str, padString, length) {
      while (str.length < length) {
        str = str + padString;
      }
      return str;
    };
    return Utils;
  })();
  root = typeof exports !== "undefined" && exports !== null ? exports : window;
  root.Utils = Utils;
}).call(this);
}, "js_warrior/views": function(exports, require, module) {(function() {
  exports.Views = {
    View: require('./views/view').View,
    HtmlView: require('./views/html_view').HtmlView,
    ConsoleView: require('./views/console_view').ConsoleView
  };
}).call(this);
}, "js_warrior/views/console_view": function(exports, require, module) {(function() {
  var ConsoleView, View, root, _;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  View = require('./view').View;
  _ = require('underscore')._;
  ConsoleView = (function() {
    __extends(ConsoleView, View);
    function ConsoleView() {
      ConsoleView.__super__.constructor.apply(this, arguments);
    }
    ConsoleView.prototype.puts = function(text) {
      return console.log(text);
    };
    ConsoleView.prototype.levelChanged = function(level) {
      console.log(" - Turn " + level.currentTurn + " - ");
      return console.log(level.floor.character());
    };
    ConsoleView.prototype.setWarriorAbilities = function(abilities) {
      var ability, abilityName, _i, _len, _ref, _results;
      this.puts("Warrior Abilities:");
      _ref = _.keys(abilities);
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        abilityName = _ref[_i];
        ability = level.warrior.abilities[abilityName];
        this.puts("  warrior." + abilityName + "()");
        _results.push(this.puts("    " + (ability.description())));
      }
      return _results;
    };
    return ConsoleView;
  })();
  root = typeof exports !== "undefined" && exports !== null ? exports : window;
  root.ConsoleView = ConsoleView;
}).call(this);
}, "js_warrior/views/html_view": function(exports, require, module) {(function() {
  var HtmlView, Utils, View, root, _;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  View = require('./view').View;
  Utils = require('../utils').Utils;
  _ = require('underscore')._;
  HtmlView = (function() {
    __extends(HtmlView, View);
    function HtmlView(emitter, $) {
      this.emitter = emitter;
      this.$ = $;
      this.puts("Welcome to Coffee Warrior");
    }
    HtmlView.prototype.puts = function(text) {
      this.$("#message").append("<p>" + text + "</p>");
      return this.$("#message")[0].scrollTop = this.$("#message")[0].scrollHeight;
    };
    HtmlView.prototype.levelLoaded = function(level) {
      this.levelChanged(level);
      this.$("#hint_message").html("<p>" + level.tip + "</p>");
      this.setWarriorAbilities(level.warrior.abilities);
      if (level.clue) {
        this.$("#more_hint_message").html("<p>" + level.clue + "</p>");
      }
      this.puts("===== Level " + level.number + " =====");
      return this.puts(level.description);
    };
    HtmlView.prototype.levelChanged = function(level) {
      var epic, score, tower, unit, units;
      this.$("#tower").html("");
      this.$("#tower").append("<p--------------------------------------------</p>");
      tower = level.profile.towerPath.toUpperCase();
      if (level.profile.isEpic()) {
        score = level.profile.currentEpicScore;
        epic = "(EPIC)";
      } else {
        score = level.profile.score;
        epic = "";
      }
      this.$("#tower").append("<p>Tower&nbsp;&nbsp;" + tower + " " + epic + "<br/>    Lvl&nbsp;&nbsp;&nbsp;&nbsp;" + level.number + "<br/>    HP&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + level.warrior.health + "/" + (level.warrior.maxHealth()) + "<br/>    Score&nbsp;&nbsp;" + score + "</p>");
      this.$("#tower").append("<p--------------------------------------------</p>");
      this.$("#tower").append("<pre>" + (level.floor.character()) + " </pre>");
      this.$("#tower").append("<p--------------------------------------------</p>");
      units = (function() {
        var _i, _len, _ref, _results;
        _ref = level.floor.units();
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          unit = _ref[_i];
          _results.push("" + (unit.character()) + " - " + (unit.name()) + " (HP: " + unit.health + ")");
        }
        return _results;
      })();
      units.push("> - Stair");
      this.$("#tower").append("<p class='unit'>" + (units.join("\n<br/>")) + "</p>");
      this.$("#tower").append("<p--------------------------------------------</p>");
      if (level.currentTurn > 0) {
        this.puts("- Turn " + level.currentTurn + " -");
      }
      return window.history.pushState({}, "Level " + level.number, "#" + (level.profile.encode()));
    };
    HtmlView.prototype.setWarriorAbilities = function(abilities) {
      var ability, abilityName, _i, _len, _ref, _results;
      this.$("#hint_message").append("<p>Warrior Abilities:</p>");
      _ref = _.keys(abilities);
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        abilityName = _ref[_i];
        ability = abilities[abilityName];
        _results.push(this.$("#hint_message").append("<div class='ability'><p class='ability-label'>warrior." + (Utils.toMethodCase(abilityName)) + "()</p><p class='ability-details'>" + (ability.description()) + "</p></div>"));
      }
      return _results;
    };
    HtmlView.prototype.levelCompleted = function(level) {
      return this.puts("Success! You have found the stairs.");
    };
    HtmlView.prototype.levelStarted = function(level) {
      return this.puts("Starting Level " + level.number);
    };
    HtmlView.prototype.epicModeStarted = function(game) {
      return this.puts("Click Run again to play epic mode.");
    };
    HtmlView.prototype.epicModeCompleted = function(game) {
      return this.puts(game.finalReport());
    };
    HtmlView.prototype.clear = function() {
      return this.$("#message").html("");
    };
    HtmlView.prototype.title = function() {
      return "  _____     ______          _      __             _              / ___/__  / _/ _/__ ___   | | /| / /__ _________(_)__  ____    / /__/ _ \/ _/ _/ -_) -_)  | |/ |/ / _ `/ __/ __/ / _ \/ __/    \___/\___/_//_/ \__/\__/   |__/|__/\_,_/_/ /_/ /_/\___/_/       ";
    };
    return HtmlView;
  })();
  root = typeof exports !== "undefined" && exports !== null ? exports : window;
  root.HtmlView = HtmlView;
}).call(this);
}, "js_warrior/views/view": function(exports, require, module) {(function() {
  var View, root;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  View = (function() {
    function View(emitter) {
      this.emitter = emitter;
      this.puts("Welcome to JS Warrior");
    }
    View.prototype.listen = function() {
      this.emitter.on('game.start', __bind(function() {
        return this.puts("Game started!");
      }, this));
      this.emitter.on('game.stop', __bind(function() {
        return this.puts("You quit the Tower! Try again when you are ready.");
      }, this));
      this.emitter.on('game.end', __bind(function() {
        return this.puts("CONGRATULATIONS! You have climbed to the top of the tower and rescued the fair maiden Coffee.");
      }, this));
      this.emitter.on('game.level.start', __bind(function(level) {
        return this.levelStarted(level);
      }, this));
      this.emitter.on("game.level.complete", __bind(function(level) {
        return this.levelCompleted(level);
      }, this));
      this.emitter.on('game.level.loaded', __bind(function(level) {
        return this.levelLoaded(level);
      }, this));
      this.emitter.on('game.level.changed', __bind(function(level) {
        return this.levelChanged(level);
      }, this));
      this.emitter.on("game.level.failed", __bind(function(level) {
        this.puts("You failed! Improve your warrior and try again!");
        return this.levelChanged(level);
      }, this));
      this.emitter.on('unit.say', __bind(function(name, params) {
        return this.puts("" + name + " " + params);
      }, this));
      this.emitter.on("game.score.message", __bind(function(message) {
        return this.puts(message);
      }, this));
      this.emitter.on("game.play.error", __bind(function(e) {
        return this.onError(e);
      }, this));
      this.emitter.on("game.epic.start", __bind(function(game) {
        return this.epicModeStarted(game);
      }, this));
      this.emitter.on("game.epic.end", __bind(function(game) {
        return this.epicModeCompleted(game);
      }, this));
      return this.emitter.on("game.level.report", __bind(function(_arg) {
        var clearBonus, grade, levelScore, messages, scoreCalculation, timeBonus;
        grade = _arg.grade, levelScore = _arg.levelScore, timeBonus = _arg.timeBonus, clearBonus = _arg.clearBonus, scoreCalculation = _arg.scoreCalculation;
        messages = [];
        messages.push("Level Score: " + levelScore);
        messages.push("Time Bonus:  " + timeBonus);
        if (clearBonus) {
          messages.push("Clear Bonus: " + clearBonus);
        }
        messages.push("Total Score: " + scoreCalculation + " (" + grade + ")");
        return this.puts(messages.join("<br/>"));
      }, this));
    };
    View.prototype.close = function() {
      var l, listeners, _i, _len, _results;
      listeners = ['game.start', 'game.level.start', 'level.floor', 'level.turn'];
      _results = [];
      for (_i = 0, _len = listeners.length; _i < _len; _i++) {
        l = listeners[_i];
        _results.push(this.emitter.removeAllListeners(l));
      }
      return _results;
    };
    View.prototype.puts = function(text) {};
    View.prototype.levelChanged = function(level) {};
    View.prototype.levelLoaded = function(level) {
      return this.levelChanged(level);
    };
    View.prototype.levelStarted = function(level) {
      return this.puts("Starting Level " + level.number);
    };
    View.prototype.levelCompleted = function(level) {
      return this.puts("Success! You have found the stairs.");
    };
    View.prototype.epicModeStarted = function(game) {};
    View.prototype.epicModeCompleted = function(game) {};
    View.prototype.setWarriorAbilities = function(abilities) {};
    View.prototype.clear = function() {};
    View.prototype.onError = function(e) {
      console.trace(e);
      return this.puts("Error: " + e);
    };
    return View;
  })();
  root = typeof exports !== "undefined" && exports !== null ? exports : window;
  root.View = View;
}).call(this);
}, "beginner/level_001": function(exports, require, module) {(function() {
  exports.level = function() {
    this.description("You see before yourself a long hallway with stairs at the end. There is nothing in the way.");
    this.tip("Call warrior.walk() to walk forward in the Player 'playTurn()' method.");
    this.time_bonus(15);
    this.ace_score(10);
    this.size(8, 1);
    this.stairs(7, 0);
    return this.warrior(0, 0, 'east', function() {
      return this.add_abilities('walk');
    });
  };
}).call(this);
}, "beginner/level_002": function(exports, require, module) {(function() {
  exports.level = function() {
    this.description("It is too dark to see anything, but you smell sludge nearby.");
    this.tip("Use warrior.feel().isEmpty() to see if there's anything in front of you, and warrior.attack() to fight it. Remember, you can only do one action per turn.");
    this.clue("Add an if/else condition using warrior.feel().isEmpty() to decide whether to warrior.attack() or warrior.walk!.");
    this.time_bonus(20);
    this.ace_score(26);
    this.size(8, 1);
    this.stairs(7, 0);
    this.warrior(0, 0, 'east', function() {
      this.add_abilities('walk');
      return this.add_abilities('feel', 'attack');
    });
    return this.unit('sludge', 4, 0, 'west');
  };
}).call(this);
}, "beginner/level_003": function(exports, require, module) {(function() {
  exports.level = function() {
    this.description("The air feels thicker than before. There must be a horde of sludge.");
    this.tip("Be careful not to die! Use warrior.health() to keep an eye on your health, and warrior.rest() to earn 10% of max health back.");
    this.clue("When there's no enemy ahead of you, call warrior.rest() until health is full before walking forward.");
    this.time_bonus(35);
    this.ace_score(71);
    this.size(9, 1);
    this.stairs(8, 0);
    this.warrior(0, 0, 'east', function() {
      this.add_abilities('walk', 'feel', 'attack');
      return this.add_abilities('health', 'rest');
    });
    this.unit('sludge', 2, 0, 'west');
    this.unit('sludge', 4, 0, 'west');
    this.unit('sludge', 5, 0, 'west');
    return this.unit('sludge', 7, 0, 'west');
  };
}).call(this);
}, "beginner/level_004": function(exports, require, module) {(function() {
  exports.level = function() {
    this.description("You can hear bow strings being stretched.");
    this.tip("No new abilities this time, but you must be careful not to rest while taking damage. Save a @health instance variable and compare it on each turn to see if you're taking damage.");
    this.clue("Set @health to your current health at the end of the turn. If this is greater than your current health next turn then you know you're taking damage and shouldn't rest.");
    this.time_bonus(45);
    this.ace_score(90);
    this.size(7, 1);
    this.stairs(6, 0);
    this.warrior(0, 0, 'east', function() {
      return this.add_abilities('walk', 'feel', 'attack', 'health', 'rest');
    });
    this.unit('thick_sludge', 2, 0, 'west');
    this.unit('archer', 3, 0, 'west');
    return this.unit('thick_sludge', 5, 0, 'west');
  };
}).call(this);
}, "beginner/level_005": function(exports, require, module) {(function() {
  exports.level = function() {
    this.description("You hear cries for help. Captives must need rescuing.");
    this.tip("Use warrior.feel().isCaptive() to see if there's a captive, and warrior.rescue() to rescue him. Don't attack captives.");
    this.clue("Don't forget to constantly check if you're taking damage and rest until your health is full if you aren't taking damage.");
    this.time_bonus(45);
    this.ace_score(123);
    this.size(7, 1);
    this.stairs(6, 0);
    this.warrior(0, 0, 'east', function() {
      this.add_abilities('walk', 'feel', 'attack', 'health', 'rest');
      return this.add_abilities('rescue');
    });
    this.unit('captive', 2, 0, 'west');
    this.unit('archer', 3, 0, 'west');
    this.unit('archer', 4, 0, 'west');
    this.unit('thick_sludge', 5, 0, 'west');
    return this.unit('captive', 6, 0, 'west');
  };
}).call(this);
}, "beginner/level_006": function(exports, require, module) {(function() {
  exports.level = function() {
    this.description("The wall behind you feels a bit further away in this room. And you hear more cries for help.");
    this.tip("You can walk backward by passing 'backward' as an argument to walk(). Same goes for feel(), rescue() and attack().");
    this.clue("Walk backward if you are taking damage from afar and do not have enough health to attack. You may also want to consider walking backward until warrior.feel('backward').isWall().");
    this.time_bonus(55);
    this.ace_score(110);
    this.size(8, 1);
    this.stairs(7, 0);
    this.warrior(2, 0, 'east', function() {
      return this.add_abilities('walk', 'feel', 'attack', 'health', 'rest', 'rescue');
    });
    this.unit('captive', 0, 0, 'east');
    this.unit('thick_sludge', 4, 0, 'west');
    this.unit('archer', 6, 0, 'west');
    return this.unit('archer', 7, 0, 'west');
  };
}).call(this);
}, "beginner/level_007": function(exports, require, module) {(function() {
  exports.level = function() {
    this.description("You feel a wall right in front of you and an opening behind you.");
    this.tip("You are not as effective at attacking backward. Use warrior.feel().isWall() and warrior.pivot() to turn around.");
    this.time_bonus(30);
    this.ace_score(50);
    this.size(6, 1);
    this.stairs(0, 0);
    this.warrior(5, 0, 'east', function() {
      this.add_abilities('walk', 'feel', 'attack', 'health', 'rest', 'rescue');
      return this.add_abilities('pivot');
    });
    this.unit('archer', 1, 0, 'east');
    return this.unit('thick_sludge', 3, 0, 'east');
  };
}).call(this);
}, "beginner/level_008": function(exports, require, module) {(function() {
  exports.level = function() {
    this.description("You hear the mumbling of wizards. Beware of their deadly wands! Good thing you found a bow.");
    this.tip("Use warrior.look() to determine your surroundings, and warrior.shoot() to fire an arrow.");
    this.clue("Wizards are deadly but low in health. Kill them before they have time to attack.");
    this.time_bonus(20);
    this.ace_score(46);
    this.size(6, 1);
    this.stairs(5, 0);
    this.warrior(0, 0, 'east', function() {
      this.add_abilities('walk', 'feel', 'attack', 'health', 'rest', 'rescue', 'pivot');
      return this.add_abilities('look', 'shoot');
    });
    this.unit('captive', 2, 0, 'west');
    this.unit('wizard', 3, 0, 'west');
    return this.unit('wizard', 4, 0, 'west');
  };
}).call(this);
}, "beginner/level_009": function(exports, require, module) {(function() {
  exports.level = function() {
    this.description("Time to hone your skills and apply all of the abilities that you have learned.");
    this.tip("Watch your back.");
    this.clue("Don't just keep shooting the bow while you are being attacked from behind.");
    this.time_bonus(40);
    this.ace_score(100);
    this.size(11, 1);
    this.stairs(0, 0);
    this.warrior(5, 0, 'east', function() {
      return this.add_abilities('walk', 'feel', 'attack', 'health', 'rest', 'rescue', 'pivot', 'look', 'shoot');
    });
    this.unit('captive', 1, 0, 'east');
    this.unit('archer', 2, 0, 'east');
    this.unit('thick_sludge', 7, 0, 'west');
    this.unit('wizard', 9, 0, 'west');
    return this.unit('captive', 10, 0, 'west');
  };
}).call(this);
}, "intermediate/level_001": function(exports, require, module) {(function() {
  exports.level = function() {
    this.description("Silence. The room feels large, but empty. Luckily you have a map of this tower to help find the stairs.");
    this.tip("Use warrior.directionOfStairs() to determine which direction stairs are located. Pass this to warrior.walk() to walk in that direction.");
    this.time_bonus(20);
    this.ace_score(19);
    this.size(6, 4);
    this.stairs(2, 3);
    return this.warrior(0, 1, 'east', function() {
      return this.add_abilities('walk', 'feel', 'directionOfStairs');
    });
  };
}).call(this);
}, "intermediate/level_002": function(exports, require, module) {(function() {
  exports.level = function() {
    this.description("Another large room, but with several enemies blocking your way to the stairs.");
    this.tip("Just like walking, you can attack() and feel() in multiple directions ('forward', 'left', 'right', 'backward').");
    this.clue("Call warrior.feel(direction).isEnemy() in each direction to make sure there isn't an enemy beside you (attack if there is). Call warrior.rest() if you're low and health when there's no enemies around.");
    this.time_bonus(40);
    this.ace_score(84);
    this.size(4, 2);
    this.stairs(3, 1);
    this.warrior(0, 0, 'east', function() {
      this.add_abilities('walk', 'feel', 'directionOfStairs');
      return this.add_abilities('attack', 'health', 'rest');
    });
    this.unit('sludge', 1, 0, 'west');
    this.unit('thick_sludge', 2, 1, 'west');
    return this.unit('sludge', 1, 1, 'north');
  };
}).call(this);
}, "intermediate/level_003": function(exports, require, module) {(function() {
  exports.level = function() {
    this.description("You feel slime on all sides, you're surrounded!");
    this.tip("Call warrior.bind(direction) to bind an enemy to keep him from attacking. Bound enemies look like capitves.");
    this.clue("Count the number of enemies around you, if there's two or more, bind one.");
    this.time_bonus(50);
    this.ace_score(101);
    this.size(3, 3);
    this.stairs(0, 0);
    this.warrior(1, 1, 'east', function() {
      this.add_abilities('walk', 'feel', 'directionOfStairs', 'attack', 'health', 'rest');
      return this.add_abilities('rescue', 'bind');
    });
    this.unit('sludge', 1, 0, 'west');
    this.unit('captive', 1, 2, 'west');
    this.unit('sludge', 0, 1, 'west');
    return this.unit('sludge', 2, 1, 'west');
  };
}).call(this);
}, "intermediate/level_004": function(exports, require, module) {(function() {
  exports.level = function() {
    this.description("Your ears become more in tune with the surroundings. Listen to find enemies and captives!");
    this.tip("Use warrior.listen() to find spaces with other units, and warrior.directionOf() to determine what direction they're in.");
    this.clue("Walk towards an enemy or captive with warrior.walk(warrior.directionOf(warrior.listen()[0])), once warrior.listen().length == 0 then head for the stairs.");
    this.time_bonus(55);
    this.ace_score(144);
    this.size(4, 3);
    this.stairs(3, 2);
    this.warrior(1, 1, 'east', function() {
      this.add_abilities('walk', 'feel', 'directionOfStairs', 'attack', 'health', 'rest', 'rescue', 'bind');
      return this.add_abilities('listen', 'directionOf');
    });
    this.unit('captive', 0, 0, 'east');
    this.unit('captive', 0, 2, 'east');
    this.unit('sludge', 2, 0, 'south');
    this.unit('thick_sludge', 3, 1, 'west');
    return this.unit('sludge', 2, 2, 'north');
  };
}).call(this);
}, "intermediate/level_005": function(exports, require, module) {(function() {
  exports.level = function() {
    this.description("You can feel the stairs right next to you, but are you sure you want to go up them right away?");
    this.tip("You'll get more points for clearing the level first. Use warrior.feel.isStairs() and warrior.feel.isEmpty() to determine where to go.");
    this.clue("If going towards a unit is the same direction as the stairs, try moving another empty direction until you can safely move toward the enemies.");
    this.time_bonus(45);
    this.ace_score(107);
    this.size(5, 2);
    this.stairs(1, 1);
    this.warrior(0, 1, 'east', function() {
      return this.add_abilities('walk', 'feel', 'directionOfStairs', 'attack', 'health', 'rest', 'rescue', 'bind', 'listen', 'directionOf');
    });
    this.unit('thick_sludge', 4, 0, 'west');
    this.unit('thick_sludge', 3, 1, 'north');
    return this.unit('captive', 4, 1, 'west');
  };
}).call(this);
}, "intermediate/level_006": function(exports, require, module) {(function() {
  exports.level = function() {
    this.description("What's that ticking? Some captives have a timed bomb at their feet!");
    this.tip("Hurry and rescue captives first that have space.isTicking(), they'll soon go!");
    this.clue("Avoid fighting enemies at first. Use warrior.listen() and space.isTicking() and quickly rescue those captives.");
    this.time_bonus(50);
    this.ace_score(108);
    this.size(6, 2);
    this.stairs(5, 0);
    this.warrior(0, 1, 'east', function() {
      return this.add_abilities('walk', 'feel', 'directionOfStairs', 'attack', 'health', 'rest', 'rescue', 'bind', 'listen', 'directionOf');
    });
    this.unit('sludge', 1, 0, 'west');
    this.unit('sludge', 3, 1, 'west');
    this.unit('captive', 0, 0, 'west');
    return this.unit('captive', 4, 1, 'west', function() {
      this.add_abilities('explode');
      return this.abilities['explode'].time = 7;
    });
  };
}).call(this);
}, "intermediate/level_007": function(exports, require, module) {(function() {
  exports.level = function() {
    this.description("Another ticking sound, but some sludge is blocking the way.");
    this.tip("Quickly kill the sludge and rescue the captive before the bomb goes off. You can't simply go around them.");
    this.clue("Determine the direction of the ticking captive and kill any enemies blocking that path. You may need to bind surrounding enemies first.");
    this.time_bonus(70);
    this.ace_score(134);
    this.size(5, 3);
    this.stairs(4, 0);
    this.warrior(0, 1, 'east', function() {
      return this.add_abilities('walk', 'feel', 'directionOfStairs', 'attack', 'health', 'rest', 'rescue', 'bind', 'listen', 'directionOf');
    });
    this.unit('sludge', 1, 0, 'south');
    this.unit('sludge', 1, 2, 'north');
    this.unit('sludge', 2, 1, 'west');
    this.unit('captive', 4, 1, 'west', function() {
      this.add_abilities('explode');
      return this.abilities['explode'].time = 10;
    });
    return this.unit('captive', 2, 0, 'west');
  };
}).call(this);
}, "intermediate/level_008": function(exports, require, module) {(function() {
  exports.level = function() {
    this.description("You discover a satchel of bombs which will help when facing a mob of enemies.");
    this.tip("Detonate a bomb when you see a couple enemies ahead of you (warrior.look()). Watch out for your health too.");
    this.clue("Calling warrior.look will return an array of Spaces. If the first two contain enemies, detonate a bomb with warrior.detonate().");
    this.time_bonus(30);
    this.size(7, 1);
    this.stairs(6, 0);
    this.warrior(0, 0, 'east', function() {
      this.add_abilities('walk', 'feel', 'directionOfStairs', 'attack', 'health', 'rest', 'rescue', 'bind', 'listen', 'directionOf');
      return this.add_abilities('look', 'detonate');
    });
    this.unit('captive', 5, 0, 'west', function() {
      this.add_abilities('explode');
      return this.abilities['explode'].time = 9;
    });
    this.unit('thick_sludge', 2, 0, 'west');
    return this.unit('sludge', 3, 0, 'west');
  };
}).call(this);
}, "intermediate/level_009": function(exports, require, module) {(function() {
  exports.level = function() {
    this.description("Never before have you seen a room so full of sludge. Start the fireworks!");
    this.tip("Be careful not to let the ticking captive get caught in the flames. Use warrior.distanceOf() to avoid the captives.");
    this.clue("Be sure to bind the surrounding enemies before fighting. Check your health before detonating explosives.");
    this.time_bonus(70);
    this.size(4, 3);
    this.stairs(3, 0);
    this.warrior(0, 1, 'east', function() {
      this.add_abilities('walk', 'feel', 'directionOfStairs', 'attack', 'health', 'rest', 'rescue', 'bind', 'listen', 'directionOf', 'look', 'detonate');
      return this.add_abilities('distanceOf');
    });
    this.unit('captive', 2, 0, 'south', function() {
      this.add_abilities('explode');
      return this.abilities['explode'].time = 20;
    });
    this.unit('captive', 2, 2, 'north');
    this.unit('sludge', 0, 0, 'south');
    this.unit('sludge', 1, 0, 'south');
    this.unit('sludge', 1, 1, 'east');
    this.unit('sludge', 2, 1, 'east');
    this.unit('sludge', 3, 1, 'east');
    this.unit('sludge', 0, 2, 'north');
    return this.unit('sludge', 1, 2, 'north');
  };
}).call(this);
}});
