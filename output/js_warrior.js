
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
}).call(this)({"events": function(exports, require, module) {// https://github.com/tmpvar/node-eventemitter
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
    View: require('./js_warrior/view').View,
    ConsoleView: require('./js_warrior/console_view').ConsoleView
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
    Walk: require('./abilities/walk').Walk
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
      receiver = this.unit(direction);
      if (receiver) {
        this.unit.say("attacks " + direction + " and hits " + receiver);
        if (direction === 'backward') {
          return power = Math.ceil(this.unit.attackPower / 2.0);
        } else {
          return power = this.unit.attackPower;
        }
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
    BaseAbilities.prototype.unit = function(direction, forward, right) {
      if (forward == null) {
        forward = 1;
      }
      if (right == null) {
        right = 0;
      }
      return this.space(direction, forward, right).unit();
    };
    BaseAbilities.prototype.damage = function(receiver, amount) {
      receiver.takeDamage(amount);
      if (!receiver.isAlive()) {
        return this.unit.earnPoints(receiver.max_health);
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
        throw "Unknown direction " + direction + ". Should be forward, backward, left or right.";
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
}, "js_warrior/abilities/explode": function(exports, require, module) {(function() {
  var Action, Explode, root;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  Action = require('./action').Action;
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
        return _.map(this.unit.position.floor.units, function(unit) {
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
    return Walk;
  })();
  root = typeof exports !== "undefined" && exports !== null ? exports : window;
  root.Walk = Walk;
}).call(this);
}, "js_warrior/console_view": function(exports, require, module) {(function() {
  var ConsoleView, View, root;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  View = require('./view').View;
  ConsoleView = (function() {
    __extends(ConsoleView, View);
    function ConsoleView() {
      ConsoleView.__super__.constructor.apply(this, arguments);
    }
    ConsoleView.prototype.puts = function(text) {
      return console.log(text);
    };
    return ConsoleView;
  })();
  root = typeof exports !== "undefined" && exports !== null ? exports : window;
  root.ConsoleView = ConsoleView;
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
      _ref = this.__units;
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
        return unit.position.at(x, y);
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
  var Game, Profile, root;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  Profile = require('./profile').Profile;
  Game = (function() {
    function Game(emitter) {
      this.emitter = emitter;
      this.currentLevel = null;
    }
    Game.prototype.start = function() {
      this.emitter.emit('game.start');
      this.profile = new Profile(this.emitter);
      return this.playNormalMode();
    };
    Game.prototype.playNormalMode = function() {
      return this.playCurrentLevel();
    };
    Game.prototype.playCurrentLevel = function() {
      var haveFurtherStep;
      haveFurtherStep = true;
      this.getCurrentLevel().loadLevel();
      this.getCurrentLevel().loadPlayer();
      this.emitter.emit('game.level.start', this.currentLevel);
      return this.playGame();
    };
    Game.prototype.playGame = function(step) {
      var haveFurtherStep;
      if (step == null) {
        step = 1;
      }
      this.currentLevel.play(step);
      if (this.currentLevel.isPassed()) {
        if (this.getNextLevel().isExists()) {
          this.emitter.emit("game.level.complete", this.currentLevel);
        } else {
          this.emitter.emit("game.end");
          haveFurtherStep = false;
        }
        if (this.profile.isEpic()) {
          if (!this["continue"]) {
            this.emitter.emit("game.report", this);
          }
        } else {
          this.requestNextLevel();
        }
      } else {
        haveFurtherStep = false;
        this.emitter.emit("game.level.failed", this.getCurrentLevel());
      }
      return setTimeout((__bind(function() {
        return this.playGame();
      }, this)), 600);
    };
    Game.prototype.getCurrentLevel = function() {
      return this.currentLevel || (this.currentLevel = this.profile.currentLevel());
    };
    Game.prototype.getNextLevel = function() {
      return this.nextLevel || (this.nextLevel = this.profile.nextLevel());
    };
    return Game;
  })();
  root = typeof exports !== "undefined" && exports !== null ? exports : window;
  root.Game = Game;
}).call(this);
}, "js_warrior/level": function(exports, require, module) {(function() {
  var EventEmitter, Level, LevelLoader, Utils, root;
  EventEmitter = require('events').EventEmitter;
  Utils = require('./utils').Utils;
  LevelLoader = require('./level_loader').LevelLoader;
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
      var level, loader;
      loader = new LevelLoader(this);
      level = require(this.loadPath()).level;
      level.apply(loader);
      return this;
    };
    Level.prototype.loadPlayer = function(jsString) {
      var Player;
      if (jsString == null) {
        jsString = null;
      }
      Player = Player = (function() {
        function Player() {}
        Player.prototype.playTurn = function(turn) {};
        return Player;
      })();
      if (jsString) {
        Player = eval(jsString);
      }
      return this.player = new Player();
    };
    Level.prototype.play = function(turns) {
      var turn, _ref, _ref2, _results;
      if (turns == null) {
        turns = 1000;
      }
      _results = [];
      for (turn = 1; 1 <= turns ? turn <= turns : turn >= turns; 1 <= turns ? turn++ : turn--) {
        if (this.isPassed() || this.isFailed()) {
          return;
        }
        this.currentTurn += 1;
        if ((_ref = this.emitter) != null) {
          _ref.emit('level.turn', this.currentTurn);
        }
        if ((_ref2 = this.emitter) != null) {
          _ref2.emit('level.floor', this.floor.character());
        }
        _results.push(this.time_bonus > 0 ? this.time_bonus = this.time_bonus - 1 : void 0);
      }
      return _results;
    };
    Level.prototype.isPassed = function() {
      var _ref, _ref2;
      return !!((_ref = this.floor) != null ? (_ref2 = _ref.stairsSpace()) != null ? _ref2.isWarrior() : void 0 : void 0);
    };
    Level.prototype.isFailed = function() {
      var _ref;
      return ((_ref = this.floor) != null ? _ref.units().indexOf(this.warrior) : void 0) === -1;
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
    Level.prototype.setupWarrior = function(warrior) {
      var _ref;
      this.warrior = warrior;
      (_ref = this.warrior).addAbilities.apply(_ref, this.profile.abilities);
      this.warrior.name = this.profile.warrior_name;
      this.warrior.player = this.player;
      return this.warrior;
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
    LevelLoader.prototype.timeBonus = function(bonus) {
      return this.level.timeBonus = bonus;
    };
    LevelLoader.prototype.aceScore = function(score) {
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
        throw "failed initialized unit: " + unit;
      }
      this.floor.add(unit, x, y, facing);
      if (block) {
        block.call(unit, unit);
      }
      return unit;
    };
    LevelLoader.prototype.warrior = function(x, y, facing, block) {
      if (facing == null) {
        facing = 'north';
      }
      return this.level.setupWarrior(this.unit('warrior', x, y, facing, block));
    };
    return LevelLoader;
  })();
  root = typeof exports !== "undefined" && exports !== null ? exports : window;
  root.LevelLoader = LevelLoader;
}).call(this);
}, "js_warrior/position": function(exports, require, module) {(function() {
  var Position, root;
  Position = (function() {
    var DIRECTIONS, RELATIVE_DIRECTIONS;
    DIRECTIONS = ['north', 'east', 'south', 'west'];
    RELATIVE_DIRECTIONS = ['forward', 'right', 'backward', 'left'];
    function Position(floor, x, y, direction) {
      this.floor = floor;
      this.x = x;
      this.y = y;
      if (direction == null) {
        direction = null;
      }
      this.direction_index = DIRECTIONS.indexOf(direction || 'north');
    }
    Position.prototype.at = function(x, y) {
      return this.x === x && this.y === y;
    };
    Position.prototype.direction = function() {
      return DIRECTIONS[this.direction_index];
    };
    Position.prototype.rotate = function(amount) {
      this.direction_index += amount;
      if (this.direction_index > 3) {
        this.direction_index -= 4;
      }
      if (this.direction_index < 0) {
        return this.direction_index += 4;
      }
    };
    Position.prototype.relativeSpace = function(forward, right) {
      if (right == null) {
        right = 0;
      }
      return this.floor.space(this.translateOffset(forward, right));
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
      var space_x, space_y, _ref, _ref2, _ref3;
      _ref = space.location, space_x = _ref[0], space_y = _ref[1];
      if (Math.abs(this.x - space_x) > Math.abs(this.y - space_y)) {
        return (_ref2 = space_x > this.x) != null ? _ref2 : {
          'east': 'west'
        };
      } else {
        return (_ref3 = space_y > this.y) != null ? _ref3 : {
          'south': 'north'
        };
      }
    };
    Position.prototype.relativeDirection = function(direction) {
      var offset;
      offset = DIRECTIONS.indexOf(direction) - this.direction_index;
      if (offset > 3) {
        offset -= 4;
      }
      if (offset < 0) {
        offset += 4;
      }
      return RELATIVE_DIRECTIONS[offset];
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
  var Level, Profile, Tower, root;
  var __slice = Array.prototype.slice;
  Tower = require('./tower').Tower;
  Level = require('./level').Level;
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
        this.abilities.push(ability);
      }
      return this.ability = _.uniq(this.abilities);
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
      return ((_ref = this.unit()) != null ? _ref.constructor.name : void 0) === "Warrior";
    };
    Space.prototype.isGolem = function() {
      var _ref;
      return ((_ref = this.unit()) != null ? _ref.constructor.name : void 0) === "Golem";
    };
    Space.prototype.isPlayer = function() {
      return this.isWarrior() || this.isGolem();
    };
    Space.prototype.isEnemy = function() {
      return this.unit() !== null && !this.isPlayer() && !this.isCaptive();
    };
    Space.prototype.isCaptive = function() {
      return this.unit() !== null && this.unit().isBound();
    };
    Space.prototype.isEmpty = function() {
      return !this.unit() && !this.isWall();
    };
    Space.prototype.isStairs = function() {
      return _.isEqual(this.floor.stairs_location, this.location());
    };
    Space.prototype.isTicking = function() {
      return this.unit() !== null && this.unit().getAbilities()['explode'] !== null;
    };
    Space.prototype.unit = function() {
      return this.floor.get(this.x, this.y) || null;
    };
    Space.prototype.location = function() {
      return [this.x, this.y];
    };
    Space.prototype.character = function() {
      if (this.unit()) {
        return this.unit().character();
      } else if (this.isStairs()) {
        return ">";
      } else {
        return " ";
      }
    };
    Space.prototype.toString = function() {
      if (this.unit()) {
        return this.unit().toString();
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
}, "js_warrior/units": function(exports, require, module) {(function() {
  exports.Units = {
    BaseUnit: require('./units/base_unit').BaseUnit,
    Golem: require('./units/golem').Golem,
    Warrior: require('./units/warrior').Warrior,
    Sludge: require('./units/sludge').Sludge,
    ThickSludge: require('./units/thick_sludge').ThickSludge,
    Captive: require('./units/captive').Captive
  };
}).call(this);
}, "js_warrior/units/base_unit": function(exports, require, module) {(function() {
  var Abilities, BaseUnit, EventEmitter, root, _;
  var __slice = Array.prototype.slice;
  EventEmitter = require('events').EventEmitter;
  Abilities = require('../abilities').Abilities;
  _ = require('underscore')._;
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
        this.say("take " + this.amount + " damage, " + this.health + " health power left");
        if (this.health <= 0) {
          this.position = null;
          return this.say("dies");
        }
      }
    };
    BaseUnit.prototype.isAlive = function() {
      return this.position !== void 0;
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
      var _ref;
      return (_ref = this.emitter) != null ? _ref.emit('unit.say', [this.name, this.message]) : void 0;
    };
    BaseUnit.prototype.name = function() {
      return this.constructor.name;
    };
    BaseUnit.prototype.toString = function() {
      return this.name();
    };
    BaseUnit.prototype.addAbilities = function() {
      var abilities, ability, camelAbility, new_abilities, _i, _len, _results;
      new_abilities = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      abilities = this.getAbilities();
      _results = [];
      for (_i = 0, _len = new_abilities.length; _i < _len; _i++) {
        ability = new_abilities[_i];
        camelAbility = ability.replace(/([a-z])/, function($1) {
          return $1.toUpperCase();
        });
        _results.push((function() {
          try {
            return abilities[ability] = eval("new Abilities." + camelAbility + "()");
          } catch (e) {
            console.trace(e);
            throw "BaseUnit.addAbilities: Unexpected ability: " + ability + " " + e;
          }
        })());
      }
      return _results;
    };
    BaseUnit.prototype.nextTurn = function() {
      return new Turn(abilities);
    };
    BaseUnit.prototype.prepareTurn = function() {
      this.currentTurn = this.nextTurn();
      return this.playTurn(this.currentTurn);
    };
    BaseUnit.prototype.performTurn = function() {
      var ability, args, name, _i, _len, _ref, _ref2;
      if (this.position) {
        _ref = _.values(this.getAbilities());
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          ability = _ref[_i];
          ability.passTurn();
        }
        if (this.currentTurn.action && !this.isBound()) {
          _ref2 = this.action(), name = _ref2[0], args = 2 <= _ref2.length ? __slice.call(_ref2, 1) : [];
          return this.abilities[name].perform(args);
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
    function Captive() {
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
    function Golem() {
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
  var BaseUnit, Sludge, root;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  BaseUnit = require('./base_unit').BaseUnit;
  Sludge = (function() {
    __extends(Sludge, BaseUnit);
    function Sludge() {
      this.addAbilities('attack', 'feel');
    }
    Sludge.prototype.playTurn = function(turn) {
      return this.player().playTurn(turn);
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
    function Warrior() {
      this.score = 0;
      this.golem_abilities = [];
    }
    Warrior.prototype.playTurn = function(turn) {
      console.log("warrior play", this.player);
      return this.player.playTurn(turn);
    };
    Warrior.prototype.earnPoints = function(points) {
      this.score += points;
      return this.say("earns " + points + " points");
    };
    Warrior.prototype.attackPower = function() {
      return 5;
    };
    Warrior.prototype.shoot_power = function() {
      return 3;
    };
    Warrior.prototype.maxHealth = function() {
      return 20;
    };
    Warrior.prototype.name = function() {
      if (this.__name !== null && this.__name !== "") {
        return this.__name;
      } else {
        return "Warrior";
      }
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
}, "js_warrior/utils": function(exports, require, module) {(function() {
  var Utils, root;
  Utils = (function() {
    function Utils() {}
    Utils.toCamelCase = function(string) {
      var camelParts, name;
      camelParts = (function() {
        var _i, _len, _ref, _results;
        _ref = string.split("_");
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          name = _ref[_i];
          _results.push(name.replace(/^[a-z]/, function($1) {
            return $1.toUpperCase();
          }));
        }
        return _results;
      })();
      return camelParts.join("");
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
}, "js_warrior/view": function(exports, require, module) {(function() {
  var View, root;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  View = (function() {
    function View(emitter) {
      this.emitter = emitter;
    }
    View.prototype.listen = function() {
      this.emitter.on('game.start', __bind(function() {
        return this.puts("Welcome to Ruby Warrior");
      }, this));
      this.emitter.on('game.level.start', __bind(function(level) {
        return this.puts("Starting Level " + level.number);
      }, this));
      this.emitter.on('level.floor', __bind(function(character) {
        return this.puts(character);
      }, this));
      return this.emitter.on('level.turn', __bind(function(turn) {
        return this.puts("turn " + turn);
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
    return View;
  })();
  root = typeof exports !== "undefined" && exports !== null ? exports : window;
  root.View = View;
}).call(this);
}, "beginner/level_001": function(exports, require, module) {(function() {
  exports.level = function() {
    this.description("You see before yourself a long hallway with stairs at the end. There is nothing in the way.");
    this.tip("Call warrior.walk to walk forward in the Player 'play_turn' method.");
    this.timeBonus(15);
    this.aceScore(10);
    this.size(8, 1);
    this.stairs(7, 0);
    return this.warrior(0, 0, 'east', function() {
      return this.addAbilities('walk');
    });
  };
}).call(this);
}});
