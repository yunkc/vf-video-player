(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("VFMediaPlayer", [], factory);
	else if(typeof exports === 'object')
		exports["VFMediaPlayer"] = factory();
	else
		root["VFMediaPlayer"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "dist";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/eventemitter3/index.js":
/*!*********************************************!*\
  !*** ./node_modules/eventemitter3/index.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var has = Object.prototype.hasOwnProperty
  , prefix = '~';

/**
 * Constructor to create a storage for our `EE` objects.
 * An `Events` instance is a plain object whose properties are event names.
 *
 * @constructor
 * @private
 */
function Events() {}

//
// We try to not inherit from `Object.prototype`. In some engines creating an
// instance in this way is faster than calling `Object.create(null)` directly.
// If `Object.create(null)` is not supported we prefix the event names with a
// character to make sure that the built-in object properties are not
// overridden or used as an attack vector.
//
if (Object.create) {
  Events.prototype = Object.create(null);

  //
  // This hack is needed because the `__proto__` property is still inherited in
  // some old browsers like Android 4, iPhone 5.1, Opera 11 and Safari 5.
  //
  if (!new Events().__proto__) prefix = false;
}

/**
 * Representation of a single event listener.
 *
 * @param {Function} fn The listener function.
 * @param {*} context The context to invoke the listener with.
 * @param {Boolean} [once=false] Specify if the listener is a one-time listener.
 * @constructor
 * @private
 */
function EE(fn, context, once) {
  this.fn = fn;
  this.context = context;
  this.once = once || false;
}

/**
 * Add a listener for a given event.
 *
 * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} context The context to invoke the listener with.
 * @param {Boolean} once Specify if the listener is a one-time listener.
 * @returns {EventEmitter}
 * @private
 */
function addListener(emitter, event, fn, context, once) {
  if (typeof fn !== 'function') {
    throw new TypeError('The listener must be a function');
  }

  var listener = new EE(fn, context || emitter, once)
    , evt = prefix ? prefix + event : event;

  if (!emitter._events[evt]) emitter._events[evt] = listener, emitter._eventsCount++;
  else if (!emitter._events[evt].fn) emitter._events[evt].push(listener);
  else emitter._events[evt] = [emitter._events[evt], listener];

  return emitter;
}

/**
 * Clear event by name.
 *
 * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
 * @param {(String|Symbol)} evt The Event name.
 * @private
 */
function clearEvent(emitter, evt) {
  if (--emitter._eventsCount === 0) emitter._events = new Events();
  else delete emitter._events[evt];
}

/**
 * Minimal `EventEmitter` interface that is molded against the Node.js
 * `EventEmitter` interface.
 *
 * @constructor
 * @public
 */
function EventEmitter() {
  this._events = new Events();
  this._eventsCount = 0;
}

/**
 * Return an array listing the events for which the emitter has registered
 * listeners.
 *
 * @returns {Array}
 * @public
 */
EventEmitter.prototype.eventNames = function eventNames() {
  var names = []
    , events
    , name;

  if (this._eventsCount === 0) return names;

  for (name in (events = this._events)) {
    if (has.call(events, name)) names.push(prefix ? name.slice(1) : name);
  }

  if (Object.getOwnPropertySymbols) {
    return names.concat(Object.getOwnPropertySymbols(events));
  }

  return names;
};

/**
 * Return the listeners registered for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Array} The registered listeners.
 * @public
 */
EventEmitter.prototype.listeners = function listeners(event) {
  var evt = prefix ? prefix + event : event
    , handlers = this._events[evt];

  if (!handlers) return [];
  if (handlers.fn) return [handlers.fn];

  for (var i = 0, l = handlers.length, ee = new Array(l); i < l; i++) {
    ee[i] = handlers[i].fn;
  }

  return ee;
};

/**
 * Return the number of listeners listening to a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Number} The number of listeners.
 * @public
 */
EventEmitter.prototype.listenerCount = function listenerCount(event) {
  var evt = prefix ? prefix + event : event
    , listeners = this._events[evt];

  if (!listeners) return 0;
  if (listeners.fn) return 1;
  return listeners.length;
};

/**
 * Calls each of the listeners registered for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Boolean} `true` if the event had listeners, else `false`.
 * @public
 */
EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
  var evt = prefix ? prefix + event : event;

  if (!this._events[evt]) return false;

  var listeners = this._events[evt]
    , len = arguments.length
    , args
    , i;

  if (listeners.fn) {
    if (listeners.once) this.removeListener(event, listeners.fn, undefined, true);

    switch (len) {
      case 1: return listeners.fn.call(listeners.context), true;
      case 2: return listeners.fn.call(listeners.context, a1), true;
      case 3: return listeners.fn.call(listeners.context, a1, a2), true;
      case 4: return listeners.fn.call(listeners.context, a1, a2, a3), true;
      case 5: return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
      case 6: return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
    }

    for (i = 1, args = new Array(len -1); i < len; i++) {
      args[i - 1] = arguments[i];
    }

    listeners.fn.apply(listeners.context, args);
  } else {
    var length = listeners.length
      , j;

    for (i = 0; i < length; i++) {
      if (listeners[i].once) this.removeListener(event, listeners[i].fn, undefined, true);

      switch (len) {
        case 1: listeners[i].fn.call(listeners[i].context); break;
        case 2: listeners[i].fn.call(listeners[i].context, a1); break;
        case 3: listeners[i].fn.call(listeners[i].context, a1, a2); break;
        case 4: listeners[i].fn.call(listeners[i].context, a1, a2, a3); break;
        default:
          if (!args) for (j = 1, args = new Array(len -1); j < len; j++) {
            args[j - 1] = arguments[j];
          }

          listeners[i].fn.apply(listeners[i].context, args);
      }
    }
  }

  return true;
};

/**
 * Add a listener for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} [context=this] The context to invoke the listener with.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.on = function on(event, fn, context) {
  return addListener(this, event, fn, context, false);
};

/**
 * Add a one-time listener for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} [context=this] The context to invoke the listener with.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.once = function once(event, fn, context) {
  return addListener(this, event, fn, context, true);
};

/**
 * Remove the listeners of a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn Only remove the listeners that match this function.
 * @param {*} context Only remove the listeners that have this context.
 * @param {Boolean} once Only remove one-time listeners.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.removeListener = function removeListener(event, fn, context, once) {
  var evt = prefix ? prefix + event : event;

  if (!this._events[evt]) return this;
  if (!fn) {
    clearEvent(this, evt);
    return this;
  }

  var listeners = this._events[evt];

  if (listeners.fn) {
    if (
      listeners.fn === fn &&
      (!once || listeners.once) &&
      (!context || listeners.context === context)
    ) {
      clearEvent(this, evt);
    }
  } else {
    for (var i = 0, events = [], length = listeners.length; i < length; i++) {
      if (
        listeners[i].fn !== fn ||
        (once && !listeners[i].once) ||
        (context && listeners[i].context !== context)
      ) {
        events.push(listeners[i]);
      }
    }

    //
    // Reset the array, or remove it completely if we have no more listeners.
    //
    if (events.length) this._events[evt] = events.length === 1 ? events[0] : events;
    else clearEvent(this, evt);
  }

  return this;
};

/**
 * Remove all listeners, or those of the specified event.
 *
 * @param {(String|Symbol)} [event] The event name.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
  var evt;

  if (event) {
    evt = prefix ? prefix + event : event;
    if (this._events[evt]) clearEvent(this, evt);
  } else {
    this._events = new Events();
    this._eventsCount = 0;
  }

  return this;
};

//
// Alias methods names because people roll like that.
//
EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
EventEmitter.prototype.addListener = EventEmitter.prototype.on;

//
// Expose the prefix.
//
EventEmitter.prefixed = prefix;

//
// Allow `EventEmitter` to be imported as module namespace.
//
EventEmitter.EventEmitter = EventEmitter;

//
// Expose the module.
//
if (true) {
  module.exports = EventEmitter;
}


/***/ }),

/***/ "./node_modules/lodash/_DataView.js":
/*!******************************************!*\
  !*** ./node_modules/lodash/_DataView.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var getNative = __webpack_require__(/*! ./_getNative */ "./node_modules/lodash/_getNative.js"),
    root = __webpack_require__(/*! ./_root */ "./node_modules/lodash/_root.js");

/* Built-in method references that are verified to be native. */
var DataView = getNative(root, 'DataView');

module.exports = DataView;


/***/ }),

/***/ "./node_modules/lodash/_Hash.js":
/*!**************************************!*\
  !*** ./node_modules/lodash/_Hash.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var hashClear = __webpack_require__(/*! ./_hashClear */ "./node_modules/lodash/_hashClear.js"),
    hashDelete = __webpack_require__(/*! ./_hashDelete */ "./node_modules/lodash/_hashDelete.js"),
    hashGet = __webpack_require__(/*! ./_hashGet */ "./node_modules/lodash/_hashGet.js"),
    hashHas = __webpack_require__(/*! ./_hashHas */ "./node_modules/lodash/_hashHas.js"),
    hashSet = __webpack_require__(/*! ./_hashSet */ "./node_modules/lodash/_hashSet.js");

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `Hash`.
Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;

module.exports = Hash;


/***/ }),

/***/ "./node_modules/lodash/_ListCache.js":
/*!*******************************************!*\
  !*** ./node_modules/lodash/_ListCache.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var listCacheClear = __webpack_require__(/*! ./_listCacheClear */ "./node_modules/lodash/_listCacheClear.js"),
    listCacheDelete = __webpack_require__(/*! ./_listCacheDelete */ "./node_modules/lodash/_listCacheDelete.js"),
    listCacheGet = __webpack_require__(/*! ./_listCacheGet */ "./node_modules/lodash/_listCacheGet.js"),
    listCacheHas = __webpack_require__(/*! ./_listCacheHas */ "./node_modules/lodash/_listCacheHas.js"),
    listCacheSet = __webpack_require__(/*! ./_listCacheSet */ "./node_modules/lodash/_listCacheSet.js");

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `ListCache`.
ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;

module.exports = ListCache;


/***/ }),

/***/ "./node_modules/lodash/_Map.js":
/*!*************************************!*\
  !*** ./node_modules/lodash/_Map.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var getNative = __webpack_require__(/*! ./_getNative */ "./node_modules/lodash/_getNative.js"),
    root = __webpack_require__(/*! ./_root */ "./node_modules/lodash/_root.js");

/* Built-in method references that are verified to be native. */
var Map = getNative(root, 'Map');

module.exports = Map;


/***/ }),

/***/ "./node_modules/lodash/_MapCache.js":
/*!******************************************!*\
  !*** ./node_modules/lodash/_MapCache.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var mapCacheClear = __webpack_require__(/*! ./_mapCacheClear */ "./node_modules/lodash/_mapCacheClear.js"),
    mapCacheDelete = __webpack_require__(/*! ./_mapCacheDelete */ "./node_modules/lodash/_mapCacheDelete.js"),
    mapCacheGet = __webpack_require__(/*! ./_mapCacheGet */ "./node_modules/lodash/_mapCacheGet.js"),
    mapCacheHas = __webpack_require__(/*! ./_mapCacheHas */ "./node_modules/lodash/_mapCacheHas.js"),
    mapCacheSet = __webpack_require__(/*! ./_mapCacheSet */ "./node_modules/lodash/_mapCacheSet.js");

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `MapCache`.
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;

module.exports = MapCache;


/***/ }),

/***/ "./node_modules/lodash/_Promise.js":
/*!*****************************************!*\
  !*** ./node_modules/lodash/_Promise.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var getNative = __webpack_require__(/*! ./_getNative */ "./node_modules/lodash/_getNative.js"),
    root = __webpack_require__(/*! ./_root */ "./node_modules/lodash/_root.js");

/* Built-in method references that are verified to be native. */
var Promise = getNative(root, 'Promise');

module.exports = Promise;


/***/ }),

/***/ "./node_modules/lodash/_Set.js":
/*!*************************************!*\
  !*** ./node_modules/lodash/_Set.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var getNative = __webpack_require__(/*! ./_getNative */ "./node_modules/lodash/_getNative.js"),
    root = __webpack_require__(/*! ./_root */ "./node_modules/lodash/_root.js");

/* Built-in method references that are verified to be native. */
var Set = getNative(root, 'Set');

module.exports = Set;


/***/ }),

/***/ "./node_modules/lodash/_Stack.js":
/*!***************************************!*\
  !*** ./node_modules/lodash/_Stack.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var ListCache = __webpack_require__(/*! ./_ListCache */ "./node_modules/lodash/_ListCache.js"),
    stackClear = __webpack_require__(/*! ./_stackClear */ "./node_modules/lodash/_stackClear.js"),
    stackDelete = __webpack_require__(/*! ./_stackDelete */ "./node_modules/lodash/_stackDelete.js"),
    stackGet = __webpack_require__(/*! ./_stackGet */ "./node_modules/lodash/_stackGet.js"),
    stackHas = __webpack_require__(/*! ./_stackHas */ "./node_modules/lodash/_stackHas.js"),
    stackSet = __webpack_require__(/*! ./_stackSet */ "./node_modules/lodash/_stackSet.js");

/**
 * Creates a stack cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Stack(entries) {
  var data = this.__data__ = new ListCache(entries);
  this.size = data.size;
}

// Add methods to `Stack`.
Stack.prototype.clear = stackClear;
Stack.prototype['delete'] = stackDelete;
Stack.prototype.get = stackGet;
Stack.prototype.has = stackHas;
Stack.prototype.set = stackSet;

module.exports = Stack;


/***/ }),

/***/ "./node_modules/lodash/_Symbol.js":
/*!****************************************!*\
  !*** ./node_modules/lodash/_Symbol.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var root = __webpack_require__(/*! ./_root */ "./node_modules/lodash/_root.js");

/** Built-in value references. */
var Symbol = root.Symbol;

module.exports = Symbol;


/***/ }),

/***/ "./node_modules/lodash/_Uint8Array.js":
/*!********************************************!*\
  !*** ./node_modules/lodash/_Uint8Array.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var root = __webpack_require__(/*! ./_root */ "./node_modules/lodash/_root.js");

/** Built-in value references. */
var Uint8Array = root.Uint8Array;

module.exports = Uint8Array;


/***/ }),

/***/ "./node_modules/lodash/_WeakMap.js":
/*!*****************************************!*\
  !*** ./node_modules/lodash/_WeakMap.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var getNative = __webpack_require__(/*! ./_getNative */ "./node_modules/lodash/_getNative.js"),
    root = __webpack_require__(/*! ./_root */ "./node_modules/lodash/_root.js");

/* Built-in method references that are verified to be native. */
var WeakMap = getNative(root, 'WeakMap');

module.exports = WeakMap;


/***/ }),

/***/ "./node_modules/lodash/_arrayEach.js":
/*!*******************************************!*\
  !*** ./node_modules/lodash/_arrayEach.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * A specialized version of `_.forEach` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns `array`.
 */
function arrayEach(array, iteratee) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (iteratee(array[index], index, array) === false) {
      break;
    }
  }
  return array;
}

module.exports = arrayEach;


/***/ }),

/***/ "./node_modules/lodash/_arrayFilter.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash/_arrayFilter.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * A specialized version of `_.filter` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {Array} Returns the new filtered array.
 */
function arrayFilter(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length,
      resIndex = 0,
      result = [];

  while (++index < length) {
    var value = array[index];
    if (predicate(value, index, array)) {
      result[resIndex++] = value;
    }
  }
  return result;
}

module.exports = arrayFilter;


/***/ }),

/***/ "./node_modules/lodash/_arrayLikeKeys.js":
/*!***********************************************!*\
  !*** ./node_modules/lodash/_arrayLikeKeys.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var baseTimes = __webpack_require__(/*! ./_baseTimes */ "./node_modules/lodash/_baseTimes.js"),
    isArguments = __webpack_require__(/*! ./isArguments */ "./node_modules/lodash/isArguments.js"),
    isArray = __webpack_require__(/*! ./isArray */ "./node_modules/lodash/isArray.js"),
    isBuffer = __webpack_require__(/*! ./isBuffer */ "./node_modules/lodash/isBuffer.js"),
    isIndex = __webpack_require__(/*! ./_isIndex */ "./node_modules/lodash/_isIndex.js"),
    isTypedArray = __webpack_require__(/*! ./isTypedArray */ "./node_modules/lodash/isTypedArray.js");

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys(value, inherited) {
  var isArr = isArray(value),
      isArg = !isArr && isArguments(value),
      isBuff = !isArr && !isArg && isBuffer(value),
      isType = !isArr && !isArg && !isBuff && isTypedArray(value),
      skipIndexes = isArr || isArg || isBuff || isType,
      result = skipIndexes ? baseTimes(value.length, String) : [],
      length = result.length;

  for (var key in value) {
    if ((inherited || hasOwnProperty.call(value, key)) &&
        !(skipIndexes && (
           // Safari 9 has enumerable `arguments.length` in strict mode.
           key == 'length' ||
           // Node.js 0.10 has enumerable non-index properties on buffers.
           (isBuff && (key == 'offset' || key == 'parent')) ||
           // PhantomJS 2 has enumerable non-index properties on typed arrays.
           (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
           // Skip index properties.
           isIndex(key, length)
        ))) {
      result.push(key);
    }
  }
  return result;
}

module.exports = arrayLikeKeys;


/***/ }),

/***/ "./node_modules/lodash/_arrayPush.js":
/*!*******************************************!*\
  !*** ./node_modules/lodash/_arrayPush.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * Appends the elements of `values` to `array`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to append.
 * @returns {Array} Returns `array`.
 */
function arrayPush(array, values) {
  var index = -1,
      length = values.length,
      offset = array.length;

  while (++index < length) {
    array[offset + index] = values[index];
  }
  return array;
}

module.exports = arrayPush;


/***/ }),

/***/ "./node_modules/lodash/_assignValue.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash/_assignValue.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var baseAssignValue = __webpack_require__(/*! ./_baseAssignValue */ "./node_modules/lodash/_baseAssignValue.js"),
    eq = __webpack_require__(/*! ./eq */ "./node_modules/lodash/eq.js");

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Assigns `value` to `key` of `object` if the existing value is not equivalent
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function assignValue(object, key, value) {
  var objValue = object[key];
  if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) ||
      (value === undefined && !(key in object))) {
    baseAssignValue(object, key, value);
  }
}

module.exports = assignValue;


/***/ }),

/***/ "./node_modules/lodash/_assocIndexOf.js":
/*!**********************************************!*\
  !*** ./node_modules/lodash/_assocIndexOf.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var eq = __webpack_require__(/*! ./eq */ "./node_modules/lodash/eq.js");

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

module.exports = assocIndexOf;


/***/ }),

/***/ "./node_modules/lodash/_baseAssign.js":
/*!********************************************!*\
  !*** ./node_modules/lodash/_baseAssign.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var copyObject = __webpack_require__(/*! ./_copyObject */ "./node_modules/lodash/_copyObject.js"),
    keys = __webpack_require__(/*! ./keys */ "./node_modules/lodash/keys.js");

/**
 * The base implementation of `_.assign` without support for multiple sources
 * or `customizer` functions.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @returns {Object} Returns `object`.
 */
function baseAssign(object, source) {
  return object && copyObject(source, keys(source), object);
}

module.exports = baseAssign;


/***/ }),

/***/ "./node_modules/lodash/_baseAssignIn.js":
/*!**********************************************!*\
  !*** ./node_modules/lodash/_baseAssignIn.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var copyObject = __webpack_require__(/*! ./_copyObject */ "./node_modules/lodash/_copyObject.js"),
    keysIn = __webpack_require__(/*! ./keysIn */ "./node_modules/lodash/keysIn.js");

/**
 * The base implementation of `_.assignIn` without support for multiple sources
 * or `customizer` functions.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @returns {Object} Returns `object`.
 */
function baseAssignIn(object, source) {
  return object && copyObject(source, keysIn(source), object);
}

module.exports = baseAssignIn;


/***/ }),

/***/ "./node_modules/lodash/_baseAssignValue.js":
/*!*************************************************!*\
  !*** ./node_modules/lodash/_baseAssignValue.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var defineProperty = __webpack_require__(/*! ./_defineProperty */ "./node_modules/lodash/_defineProperty.js");

/**
 * The base implementation of `assignValue` and `assignMergeValue` without
 * value checks.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function baseAssignValue(object, key, value) {
  if (key == '__proto__' && defineProperty) {
    defineProperty(object, key, {
      'configurable': true,
      'enumerable': true,
      'value': value,
      'writable': true
    });
  } else {
    object[key] = value;
  }
}

module.exports = baseAssignValue;


/***/ }),

/***/ "./node_modules/lodash/_baseClone.js":
/*!*******************************************!*\
  !*** ./node_modules/lodash/_baseClone.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var Stack = __webpack_require__(/*! ./_Stack */ "./node_modules/lodash/_Stack.js"),
    arrayEach = __webpack_require__(/*! ./_arrayEach */ "./node_modules/lodash/_arrayEach.js"),
    assignValue = __webpack_require__(/*! ./_assignValue */ "./node_modules/lodash/_assignValue.js"),
    baseAssign = __webpack_require__(/*! ./_baseAssign */ "./node_modules/lodash/_baseAssign.js"),
    baseAssignIn = __webpack_require__(/*! ./_baseAssignIn */ "./node_modules/lodash/_baseAssignIn.js"),
    cloneBuffer = __webpack_require__(/*! ./_cloneBuffer */ "./node_modules/lodash/_cloneBuffer.js"),
    copyArray = __webpack_require__(/*! ./_copyArray */ "./node_modules/lodash/_copyArray.js"),
    copySymbols = __webpack_require__(/*! ./_copySymbols */ "./node_modules/lodash/_copySymbols.js"),
    copySymbolsIn = __webpack_require__(/*! ./_copySymbolsIn */ "./node_modules/lodash/_copySymbolsIn.js"),
    getAllKeys = __webpack_require__(/*! ./_getAllKeys */ "./node_modules/lodash/_getAllKeys.js"),
    getAllKeysIn = __webpack_require__(/*! ./_getAllKeysIn */ "./node_modules/lodash/_getAllKeysIn.js"),
    getTag = __webpack_require__(/*! ./_getTag */ "./node_modules/lodash/_getTag.js"),
    initCloneArray = __webpack_require__(/*! ./_initCloneArray */ "./node_modules/lodash/_initCloneArray.js"),
    initCloneByTag = __webpack_require__(/*! ./_initCloneByTag */ "./node_modules/lodash/_initCloneByTag.js"),
    initCloneObject = __webpack_require__(/*! ./_initCloneObject */ "./node_modules/lodash/_initCloneObject.js"),
    isArray = __webpack_require__(/*! ./isArray */ "./node_modules/lodash/isArray.js"),
    isBuffer = __webpack_require__(/*! ./isBuffer */ "./node_modules/lodash/isBuffer.js"),
    isMap = __webpack_require__(/*! ./isMap */ "./node_modules/lodash/isMap.js"),
    isObject = __webpack_require__(/*! ./isObject */ "./node_modules/lodash/isObject.js"),
    isSet = __webpack_require__(/*! ./isSet */ "./node_modules/lodash/isSet.js"),
    keys = __webpack_require__(/*! ./keys */ "./node_modules/lodash/keys.js");

/** Used to compose bitmasks for cloning. */
var CLONE_DEEP_FLAG = 1,
    CLONE_FLAT_FLAG = 2,
    CLONE_SYMBOLS_FLAG = 4;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    objectTag = '[object Object]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    symbolTag = '[object Symbol]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/** Used to identify `toStringTag` values supported by `_.clone`. */
var cloneableTags = {};
cloneableTags[argsTag] = cloneableTags[arrayTag] =
cloneableTags[arrayBufferTag] = cloneableTags[dataViewTag] =
cloneableTags[boolTag] = cloneableTags[dateTag] =
cloneableTags[float32Tag] = cloneableTags[float64Tag] =
cloneableTags[int8Tag] = cloneableTags[int16Tag] =
cloneableTags[int32Tag] = cloneableTags[mapTag] =
cloneableTags[numberTag] = cloneableTags[objectTag] =
cloneableTags[regexpTag] = cloneableTags[setTag] =
cloneableTags[stringTag] = cloneableTags[symbolTag] =
cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] =
cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
cloneableTags[errorTag] = cloneableTags[funcTag] =
cloneableTags[weakMapTag] = false;

/**
 * The base implementation of `_.clone` and `_.cloneDeep` which tracks
 * traversed objects.
 *
 * @private
 * @param {*} value The value to clone.
 * @param {boolean} bitmask The bitmask flags.
 *  1 - Deep clone
 *  2 - Flatten inherited properties
 *  4 - Clone symbols
 * @param {Function} [customizer] The function to customize cloning.
 * @param {string} [key] The key of `value`.
 * @param {Object} [object] The parent object of `value`.
 * @param {Object} [stack] Tracks traversed objects and their clone counterparts.
 * @returns {*} Returns the cloned value.
 */
function baseClone(value, bitmask, customizer, key, object, stack) {
  var result,
      isDeep = bitmask & CLONE_DEEP_FLAG,
      isFlat = bitmask & CLONE_FLAT_FLAG,
      isFull = bitmask & CLONE_SYMBOLS_FLAG;

  if (customizer) {
    result = object ? customizer(value, key, object, stack) : customizer(value);
  }
  if (result !== undefined) {
    return result;
  }
  if (!isObject(value)) {
    return value;
  }
  var isArr = isArray(value);
  if (isArr) {
    result = initCloneArray(value);
    if (!isDeep) {
      return copyArray(value, result);
    }
  } else {
    var tag = getTag(value),
        isFunc = tag == funcTag || tag == genTag;

    if (isBuffer(value)) {
      return cloneBuffer(value, isDeep);
    }
    if (tag == objectTag || tag == argsTag || (isFunc && !object)) {
      result = (isFlat || isFunc) ? {} : initCloneObject(value);
      if (!isDeep) {
        return isFlat
          ? copySymbolsIn(value, baseAssignIn(result, value))
          : copySymbols(value, baseAssign(result, value));
      }
    } else {
      if (!cloneableTags[tag]) {
        return object ? value : {};
      }
      result = initCloneByTag(value, tag, isDeep);
    }
  }
  // Check for circular references and return its corresponding clone.
  stack || (stack = new Stack);
  var stacked = stack.get(value);
  if (stacked) {
    return stacked;
  }
  stack.set(value, result);

  if (isSet(value)) {
    value.forEach(function(subValue) {
      result.add(baseClone(subValue, bitmask, customizer, subValue, value, stack));
    });
  } else if (isMap(value)) {
    value.forEach(function(subValue, key) {
      result.set(key, baseClone(subValue, bitmask, customizer, key, value, stack));
    });
  }

  var keysFunc = isFull
    ? (isFlat ? getAllKeysIn : getAllKeys)
    : (isFlat ? keysIn : keys);

  var props = isArr ? undefined : keysFunc(value);
  arrayEach(props || value, function(subValue, key) {
    if (props) {
      key = subValue;
      subValue = value[key];
    }
    // Recursively populate clone (susceptible to call stack limits).
    assignValue(result, key, baseClone(subValue, bitmask, customizer, key, value, stack));
  });
  return result;
}

module.exports = baseClone;


/***/ }),

/***/ "./node_modules/lodash/_baseCreate.js":
/*!********************************************!*\
  !*** ./node_modules/lodash/_baseCreate.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(/*! ./isObject */ "./node_modules/lodash/isObject.js");

/** Built-in value references. */
var objectCreate = Object.create;

/**
 * The base implementation of `_.create` without support for assigning
 * properties to the created object.
 *
 * @private
 * @param {Object} proto The object to inherit from.
 * @returns {Object} Returns the new object.
 */
var baseCreate = (function() {
  function object() {}
  return function(proto) {
    if (!isObject(proto)) {
      return {};
    }
    if (objectCreate) {
      return objectCreate(proto);
    }
    object.prototype = proto;
    var result = new object;
    object.prototype = undefined;
    return result;
  };
}());

module.exports = baseCreate;


/***/ }),

/***/ "./node_modules/lodash/_baseGetAllKeys.js":
/*!************************************************!*\
  !*** ./node_modules/lodash/_baseGetAllKeys.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var arrayPush = __webpack_require__(/*! ./_arrayPush */ "./node_modules/lodash/_arrayPush.js"),
    isArray = __webpack_require__(/*! ./isArray */ "./node_modules/lodash/isArray.js");

/**
 * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
 * `keysFunc` and `symbolsFunc` to get the enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @param {Function} symbolsFunc The function to get the symbols of `object`.
 * @returns {Array} Returns the array of property names and symbols.
 */
function baseGetAllKeys(object, keysFunc, symbolsFunc) {
  var result = keysFunc(object);
  return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
}

module.exports = baseGetAllKeys;


/***/ }),

/***/ "./node_modules/lodash/_baseGetTag.js":
/*!********************************************!*\
  !*** ./node_modules/lodash/_baseGetTag.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var Symbol = __webpack_require__(/*! ./_Symbol */ "./node_modules/lodash/_Symbol.js"),
    getRawTag = __webpack_require__(/*! ./_getRawTag */ "./node_modules/lodash/_getRawTag.js"),
    objectToString = __webpack_require__(/*! ./_objectToString */ "./node_modules/lodash/_objectToString.js");

/** `Object#toString` result references. */
var nullTag = '[object Null]',
    undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag && symToStringTag in Object(value))
    ? getRawTag(value)
    : objectToString(value);
}

module.exports = baseGetTag;


/***/ }),

/***/ "./node_modules/lodash/_baseIsArguments.js":
/*!*************************************************!*\
  !*** ./node_modules/lodash/_baseIsArguments.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var baseGetTag = __webpack_require__(/*! ./_baseGetTag */ "./node_modules/lodash/_baseGetTag.js"),
    isObjectLike = __webpack_require__(/*! ./isObjectLike */ "./node_modules/lodash/isObjectLike.js");

/** `Object#toString` result references. */
var argsTag = '[object Arguments]';

/**
 * The base implementation of `_.isArguments`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 */
function baseIsArguments(value) {
  return isObjectLike(value) && baseGetTag(value) == argsTag;
}

module.exports = baseIsArguments;


/***/ }),

/***/ "./node_modules/lodash/_baseIsMap.js":
/*!*******************************************!*\
  !*** ./node_modules/lodash/_baseIsMap.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var getTag = __webpack_require__(/*! ./_getTag */ "./node_modules/lodash/_getTag.js"),
    isObjectLike = __webpack_require__(/*! ./isObjectLike */ "./node_modules/lodash/isObjectLike.js");

/** `Object#toString` result references. */
var mapTag = '[object Map]';

/**
 * The base implementation of `_.isMap` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a map, else `false`.
 */
function baseIsMap(value) {
  return isObjectLike(value) && getTag(value) == mapTag;
}

module.exports = baseIsMap;


/***/ }),

/***/ "./node_modules/lodash/_baseIsNative.js":
/*!**********************************************!*\
  !*** ./node_modules/lodash/_baseIsNative.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var isFunction = __webpack_require__(/*! ./isFunction */ "./node_modules/lodash/isFunction.js"),
    isMasked = __webpack_require__(/*! ./_isMasked */ "./node_modules/lodash/_isMasked.js"),
    isObject = __webpack_require__(/*! ./isObject */ "./node_modules/lodash/isObject.js"),
    toSource = __webpack_require__(/*! ./_toSource */ "./node_modules/lodash/_toSource.js");

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used for built-in method references. */
var funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

module.exports = baseIsNative;


/***/ }),

/***/ "./node_modules/lodash/_baseIsSet.js":
/*!*******************************************!*\
  !*** ./node_modules/lodash/_baseIsSet.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var getTag = __webpack_require__(/*! ./_getTag */ "./node_modules/lodash/_getTag.js"),
    isObjectLike = __webpack_require__(/*! ./isObjectLike */ "./node_modules/lodash/isObjectLike.js");

/** `Object#toString` result references. */
var setTag = '[object Set]';

/**
 * The base implementation of `_.isSet` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a set, else `false`.
 */
function baseIsSet(value) {
  return isObjectLike(value) && getTag(value) == setTag;
}

module.exports = baseIsSet;


/***/ }),

/***/ "./node_modules/lodash/_baseIsTypedArray.js":
/*!**************************************************!*\
  !*** ./node_modules/lodash/_baseIsTypedArray.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var baseGetTag = __webpack_require__(/*! ./_baseGetTag */ "./node_modules/lodash/_baseGetTag.js"),
    isLength = __webpack_require__(/*! ./isLength */ "./node_modules/lodash/isLength.js"),
    isObjectLike = __webpack_require__(/*! ./isObjectLike */ "./node_modules/lodash/isObjectLike.js");

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    objectTag = '[object Object]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/** Used to identify `toStringTag` values of typed arrays. */
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
typedArrayTags[dataViewTag] = typedArrayTags[dateTag] =
typedArrayTags[errorTag] = typedArrayTags[funcTag] =
typedArrayTags[mapTag] = typedArrayTags[numberTag] =
typedArrayTags[objectTag] = typedArrayTags[regexpTag] =
typedArrayTags[setTag] = typedArrayTags[stringTag] =
typedArrayTags[weakMapTag] = false;

/**
 * The base implementation of `_.isTypedArray` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 */
function baseIsTypedArray(value) {
  return isObjectLike(value) &&
    isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
}

module.exports = baseIsTypedArray;


/***/ }),

/***/ "./node_modules/lodash/_baseKeys.js":
/*!******************************************!*\
  !*** ./node_modules/lodash/_baseKeys.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var isPrototype = __webpack_require__(/*! ./_isPrototype */ "./node_modules/lodash/_isPrototype.js"),
    nativeKeys = __webpack_require__(/*! ./_nativeKeys */ "./node_modules/lodash/_nativeKeys.js");

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeys(object) {
  if (!isPrototype(object)) {
    return nativeKeys(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }
  return result;
}

module.exports = baseKeys;


/***/ }),

/***/ "./node_modules/lodash/_baseKeysIn.js":
/*!********************************************!*\
  !*** ./node_modules/lodash/_baseKeysIn.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(/*! ./isObject */ "./node_modules/lodash/isObject.js"),
    isPrototype = __webpack_require__(/*! ./_isPrototype */ "./node_modules/lodash/_isPrototype.js"),
    nativeKeysIn = __webpack_require__(/*! ./_nativeKeysIn */ "./node_modules/lodash/_nativeKeysIn.js");

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * The base implementation of `_.keysIn` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeysIn(object) {
  if (!isObject(object)) {
    return nativeKeysIn(object);
  }
  var isProto = isPrototype(object),
      result = [];

  for (var key in object) {
    if (!(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
      result.push(key);
    }
  }
  return result;
}

module.exports = baseKeysIn;


/***/ }),

/***/ "./node_modules/lodash/_baseTimes.js":
/*!*******************************************!*\
  !*** ./node_modules/lodash/_baseTimes.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

module.exports = baseTimes;


/***/ }),

/***/ "./node_modules/lodash/_baseUnary.js":
/*!*******************************************!*\
  !*** ./node_modules/lodash/_baseUnary.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * The base implementation of `_.unary` without support for storing metadata.
 *
 * @private
 * @param {Function} func The function to cap arguments for.
 * @returns {Function} Returns the new capped function.
 */
function baseUnary(func) {
  return function(value) {
    return func(value);
  };
}

module.exports = baseUnary;


/***/ }),

/***/ "./node_modules/lodash/_cloneArrayBuffer.js":
/*!**************************************************!*\
  !*** ./node_modules/lodash/_cloneArrayBuffer.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var Uint8Array = __webpack_require__(/*! ./_Uint8Array */ "./node_modules/lodash/_Uint8Array.js");

/**
 * Creates a clone of `arrayBuffer`.
 *
 * @private
 * @param {ArrayBuffer} arrayBuffer The array buffer to clone.
 * @returns {ArrayBuffer} Returns the cloned array buffer.
 */
function cloneArrayBuffer(arrayBuffer) {
  var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
  new Uint8Array(result).set(new Uint8Array(arrayBuffer));
  return result;
}

module.exports = cloneArrayBuffer;


/***/ }),

/***/ "./node_modules/lodash/_cloneBuffer.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash/_cloneBuffer.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var root = __webpack_require__(/*! ./_root */ "./node_modules/lodash/_root.js");

/** Detect free variable `exports`. */
var freeExports =  true && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Built-in value references. */
var Buffer = moduleExports ? root.Buffer : undefined,
    allocUnsafe = Buffer ? Buffer.allocUnsafe : undefined;

/**
 * Creates a clone of  `buffer`.
 *
 * @private
 * @param {Buffer} buffer The buffer to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Buffer} Returns the cloned buffer.
 */
function cloneBuffer(buffer, isDeep) {
  if (isDeep) {
    return buffer.slice();
  }
  var length = buffer.length,
      result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);

  buffer.copy(result);
  return result;
}

module.exports = cloneBuffer;

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../webpack/buildin/module.js */ "./node_modules/webpack/buildin/module.js")(module)))

/***/ }),

/***/ "./node_modules/lodash/_cloneDataView.js":
/*!***********************************************!*\
  !*** ./node_modules/lodash/_cloneDataView.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var cloneArrayBuffer = __webpack_require__(/*! ./_cloneArrayBuffer */ "./node_modules/lodash/_cloneArrayBuffer.js");

/**
 * Creates a clone of `dataView`.
 *
 * @private
 * @param {Object} dataView The data view to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned data view.
 */
function cloneDataView(dataView, isDeep) {
  var buffer = isDeep ? cloneArrayBuffer(dataView.buffer) : dataView.buffer;
  return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
}

module.exports = cloneDataView;


/***/ }),

/***/ "./node_modules/lodash/_cloneRegExp.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash/_cloneRegExp.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/** Used to match `RegExp` flags from their coerced string values. */
var reFlags = /\w*$/;

/**
 * Creates a clone of `regexp`.
 *
 * @private
 * @param {Object} regexp The regexp to clone.
 * @returns {Object} Returns the cloned regexp.
 */
function cloneRegExp(regexp) {
  var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
  result.lastIndex = regexp.lastIndex;
  return result;
}

module.exports = cloneRegExp;


/***/ }),

/***/ "./node_modules/lodash/_cloneSymbol.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash/_cloneSymbol.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var Symbol = __webpack_require__(/*! ./_Symbol */ "./node_modules/lodash/_Symbol.js");

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

/**
 * Creates a clone of the `symbol` object.
 *
 * @private
 * @param {Object} symbol The symbol object to clone.
 * @returns {Object} Returns the cloned symbol object.
 */
function cloneSymbol(symbol) {
  return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
}

module.exports = cloneSymbol;


/***/ }),

/***/ "./node_modules/lodash/_cloneTypedArray.js":
/*!*************************************************!*\
  !*** ./node_modules/lodash/_cloneTypedArray.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var cloneArrayBuffer = __webpack_require__(/*! ./_cloneArrayBuffer */ "./node_modules/lodash/_cloneArrayBuffer.js");

/**
 * Creates a clone of `typedArray`.
 *
 * @private
 * @param {Object} typedArray The typed array to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned typed array.
 */
function cloneTypedArray(typedArray, isDeep) {
  var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
  return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
}

module.exports = cloneTypedArray;


/***/ }),

/***/ "./node_modules/lodash/_copyArray.js":
/*!*******************************************!*\
  !*** ./node_modules/lodash/_copyArray.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * Copies the values of `source` to `array`.
 *
 * @private
 * @param {Array} source The array to copy values from.
 * @param {Array} [array=[]] The array to copy values to.
 * @returns {Array} Returns `array`.
 */
function copyArray(source, array) {
  var index = -1,
      length = source.length;

  array || (array = Array(length));
  while (++index < length) {
    array[index] = source[index];
  }
  return array;
}

module.exports = copyArray;


/***/ }),

/***/ "./node_modules/lodash/_copyObject.js":
/*!********************************************!*\
  !*** ./node_modules/lodash/_copyObject.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var assignValue = __webpack_require__(/*! ./_assignValue */ "./node_modules/lodash/_assignValue.js"),
    baseAssignValue = __webpack_require__(/*! ./_baseAssignValue */ "./node_modules/lodash/_baseAssignValue.js");

/**
 * Copies properties of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy properties from.
 * @param {Array} props The property identifiers to copy.
 * @param {Object} [object={}] The object to copy properties to.
 * @param {Function} [customizer] The function to customize copied values.
 * @returns {Object} Returns `object`.
 */
function copyObject(source, props, object, customizer) {
  var isNew = !object;
  object || (object = {});

  var index = -1,
      length = props.length;

  while (++index < length) {
    var key = props[index];

    var newValue = customizer
      ? customizer(object[key], source[key], key, object, source)
      : undefined;

    if (newValue === undefined) {
      newValue = source[key];
    }
    if (isNew) {
      baseAssignValue(object, key, newValue);
    } else {
      assignValue(object, key, newValue);
    }
  }
  return object;
}

module.exports = copyObject;


/***/ }),

/***/ "./node_modules/lodash/_copySymbols.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash/_copySymbols.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var copyObject = __webpack_require__(/*! ./_copyObject */ "./node_modules/lodash/_copyObject.js"),
    getSymbols = __webpack_require__(/*! ./_getSymbols */ "./node_modules/lodash/_getSymbols.js");

/**
 * Copies own symbols of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy symbols from.
 * @param {Object} [object={}] The object to copy symbols to.
 * @returns {Object} Returns `object`.
 */
function copySymbols(source, object) {
  return copyObject(source, getSymbols(source), object);
}

module.exports = copySymbols;


/***/ }),

/***/ "./node_modules/lodash/_copySymbolsIn.js":
/*!***********************************************!*\
  !*** ./node_modules/lodash/_copySymbolsIn.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var copyObject = __webpack_require__(/*! ./_copyObject */ "./node_modules/lodash/_copyObject.js"),
    getSymbolsIn = __webpack_require__(/*! ./_getSymbolsIn */ "./node_modules/lodash/_getSymbolsIn.js");

/**
 * Copies own and inherited symbols of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy symbols from.
 * @param {Object} [object={}] The object to copy symbols to.
 * @returns {Object} Returns `object`.
 */
function copySymbolsIn(source, object) {
  return copyObject(source, getSymbolsIn(source), object);
}

module.exports = copySymbolsIn;


/***/ }),

/***/ "./node_modules/lodash/_coreJsData.js":
/*!********************************************!*\
  !*** ./node_modules/lodash/_coreJsData.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var root = __webpack_require__(/*! ./_root */ "./node_modules/lodash/_root.js");

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

module.exports = coreJsData;


/***/ }),

/***/ "./node_modules/lodash/_defineProperty.js":
/*!************************************************!*\
  !*** ./node_modules/lodash/_defineProperty.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var getNative = __webpack_require__(/*! ./_getNative */ "./node_modules/lodash/_getNative.js");

var defineProperty = (function() {
  try {
    var func = getNative(Object, 'defineProperty');
    func({}, '', {});
    return func;
  } catch (e) {}
}());

module.exports = defineProperty;


/***/ }),

/***/ "./node_modules/lodash/_freeGlobal.js":
/*!********************************************!*\
  !*** ./node_modules/lodash/_freeGlobal.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

module.exports = freeGlobal;

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../webpack/buildin/global.js */ "./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/lodash/_getAllKeys.js":
/*!********************************************!*\
  !*** ./node_modules/lodash/_getAllKeys.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var baseGetAllKeys = __webpack_require__(/*! ./_baseGetAllKeys */ "./node_modules/lodash/_baseGetAllKeys.js"),
    getSymbols = __webpack_require__(/*! ./_getSymbols */ "./node_modules/lodash/_getSymbols.js"),
    keys = __webpack_require__(/*! ./keys */ "./node_modules/lodash/keys.js");

/**
 * Creates an array of own enumerable property names and symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */
function getAllKeys(object) {
  return baseGetAllKeys(object, keys, getSymbols);
}

module.exports = getAllKeys;


/***/ }),

/***/ "./node_modules/lodash/_getAllKeysIn.js":
/*!**********************************************!*\
  !*** ./node_modules/lodash/_getAllKeysIn.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var baseGetAllKeys = __webpack_require__(/*! ./_baseGetAllKeys */ "./node_modules/lodash/_baseGetAllKeys.js"),
    getSymbolsIn = __webpack_require__(/*! ./_getSymbolsIn */ "./node_modules/lodash/_getSymbolsIn.js"),
    keysIn = __webpack_require__(/*! ./keysIn */ "./node_modules/lodash/keysIn.js");

/**
 * Creates an array of own and inherited enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */
function getAllKeysIn(object) {
  return baseGetAllKeys(object, keysIn, getSymbolsIn);
}

module.exports = getAllKeysIn;


/***/ }),

/***/ "./node_modules/lodash/_getMapData.js":
/*!********************************************!*\
  !*** ./node_modules/lodash/_getMapData.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var isKeyable = __webpack_require__(/*! ./_isKeyable */ "./node_modules/lodash/_isKeyable.js");

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

module.exports = getMapData;


/***/ }),

/***/ "./node_modules/lodash/_getNative.js":
/*!*******************************************!*\
  !*** ./node_modules/lodash/_getNative.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var baseIsNative = __webpack_require__(/*! ./_baseIsNative */ "./node_modules/lodash/_baseIsNative.js"),
    getValue = __webpack_require__(/*! ./_getValue */ "./node_modules/lodash/_getValue.js");

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

module.exports = getNative;


/***/ }),

/***/ "./node_modules/lodash/_getPrototype.js":
/*!**********************************************!*\
  !*** ./node_modules/lodash/_getPrototype.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var overArg = __webpack_require__(/*! ./_overArg */ "./node_modules/lodash/_overArg.js");

/** Built-in value references. */
var getPrototype = overArg(Object.getPrototypeOf, Object);

module.exports = getPrototype;


/***/ }),

/***/ "./node_modules/lodash/_getRawTag.js":
/*!*******************************************!*\
  !*** ./node_modules/lodash/_getRawTag.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var Symbol = __webpack_require__(/*! ./_Symbol */ "./node_modules/lodash/_Symbol.js");

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag),
      tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}

module.exports = getRawTag;


/***/ }),

/***/ "./node_modules/lodash/_getSymbols.js":
/*!********************************************!*\
  !*** ./node_modules/lodash/_getSymbols.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var arrayFilter = __webpack_require__(/*! ./_arrayFilter */ "./node_modules/lodash/_arrayFilter.js"),
    stubArray = __webpack_require__(/*! ./stubArray */ "./node_modules/lodash/stubArray.js");

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Built-in value references. */
var propertyIsEnumerable = objectProto.propertyIsEnumerable;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetSymbols = Object.getOwnPropertySymbols;

/**
 * Creates an array of the own enumerable symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbols = !nativeGetSymbols ? stubArray : function(object) {
  if (object == null) {
    return [];
  }
  object = Object(object);
  return arrayFilter(nativeGetSymbols(object), function(symbol) {
    return propertyIsEnumerable.call(object, symbol);
  });
};

module.exports = getSymbols;


/***/ }),

/***/ "./node_modules/lodash/_getSymbolsIn.js":
/*!**********************************************!*\
  !*** ./node_modules/lodash/_getSymbolsIn.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var arrayPush = __webpack_require__(/*! ./_arrayPush */ "./node_modules/lodash/_arrayPush.js"),
    getPrototype = __webpack_require__(/*! ./_getPrototype */ "./node_modules/lodash/_getPrototype.js"),
    getSymbols = __webpack_require__(/*! ./_getSymbols */ "./node_modules/lodash/_getSymbols.js"),
    stubArray = __webpack_require__(/*! ./stubArray */ "./node_modules/lodash/stubArray.js");

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetSymbols = Object.getOwnPropertySymbols;

/**
 * Creates an array of the own and inherited enumerable symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbolsIn = !nativeGetSymbols ? stubArray : function(object) {
  var result = [];
  while (object) {
    arrayPush(result, getSymbols(object));
    object = getPrototype(object);
  }
  return result;
};

module.exports = getSymbolsIn;


/***/ }),

/***/ "./node_modules/lodash/_getTag.js":
/*!****************************************!*\
  !*** ./node_modules/lodash/_getTag.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var DataView = __webpack_require__(/*! ./_DataView */ "./node_modules/lodash/_DataView.js"),
    Map = __webpack_require__(/*! ./_Map */ "./node_modules/lodash/_Map.js"),
    Promise = __webpack_require__(/*! ./_Promise */ "./node_modules/lodash/_Promise.js"),
    Set = __webpack_require__(/*! ./_Set */ "./node_modules/lodash/_Set.js"),
    WeakMap = __webpack_require__(/*! ./_WeakMap */ "./node_modules/lodash/_WeakMap.js"),
    baseGetTag = __webpack_require__(/*! ./_baseGetTag */ "./node_modules/lodash/_baseGetTag.js"),
    toSource = __webpack_require__(/*! ./_toSource */ "./node_modules/lodash/_toSource.js");

/** `Object#toString` result references. */
var mapTag = '[object Map]',
    objectTag = '[object Object]',
    promiseTag = '[object Promise]',
    setTag = '[object Set]',
    weakMapTag = '[object WeakMap]';

var dataViewTag = '[object DataView]';

/** Used to detect maps, sets, and weakmaps. */
var dataViewCtorString = toSource(DataView),
    mapCtorString = toSource(Map),
    promiseCtorString = toSource(Promise),
    setCtorString = toSource(Set),
    weakMapCtorString = toSource(WeakMap);

/**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
var getTag = baseGetTag;

// Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.
if ((DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag) ||
    (Map && getTag(new Map) != mapTag) ||
    (Promise && getTag(Promise.resolve()) != promiseTag) ||
    (Set && getTag(new Set) != setTag) ||
    (WeakMap && getTag(new WeakMap) != weakMapTag)) {
  getTag = function(value) {
    var result = baseGetTag(value),
        Ctor = result == objectTag ? value.constructor : undefined,
        ctorString = Ctor ? toSource(Ctor) : '';

    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString: return dataViewTag;
        case mapCtorString: return mapTag;
        case promiseCtorString: return promiseTag;
        case setCtorString: return setTag;
        case weakMapCtorString: return weakMapTag;
      }
    }
    return result;
  };
}

module.exports = getTag;


/***/ }),

/***/ "./node_modules/lodash/_getValue.js":
/*!******************************************!*\
  !*** ./node_modules/lodash/_getValue.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

module.exports = getValue;


/***/ }),

/***/ "./node_modules/lodash/_hashClear.js":
/*!*******************************************!*\
  !*** ./node_modules/lodash/_hashClear.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var nativeCreate = __webpack_require__(/*! ./_nativeCreate */ "./node_modules/lodash/_nativeCreate.js");

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
  this.size = 0;
}

module.exports = hashClear;


/***/ }),

/***/ "./node_modules/lodash/_hashDelete.js":
/*!********************************************!*\
  !*** ./node_modules/lodash/_hashDelete.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  var result = this.has(key) && delete this.__data__[key];
  this.size -= result ? 1 : 0;
  return result;
}

module.exports = hashDelete;


/***/ }),

/***/ "./node_modules/lodash/_hashGet.js":
/*!*****************************************!*\
  !*** ./node_modules/lodash/_hashGet.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var nativeCreate = __webpack_require__(/*! ./_nativeCreate */ "./node_modules/lodash/_nativeCreate.js");

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty.call(data, key) ? data[key] : undefined;
}

module.exports = hashGet;


/***/ }),

/***/ "./node_modules/lodash/_hashHas.js":
/*!*****************************************!*\
  !*** ./node_modules/lodash/_hashHas.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var nativeCreate = __webpack_require__(/*! ./_nativeCreate */ "./node_modules/lodash/_nativeCreate.js");

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? (data[key] !== undefined) : hasOwnProperty.call(data, key);
}

module.exports = hashHas;


/***/ }),

/***/ "./node_modules/lodash/_hashSet.js":
/*!*****************************************!*\
  !*** ./node_modules/lodash/_hashSet.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var nativeCreate = __webpack_require__(/*! ./_nativeCreate */ "./node_modules/lodash/_nativeCreate.js");

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  this.size += this.has(key) ? 0 : 1;
  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
  return this;
}

module.exports = hashSet;


/***/ }),

/***/ "./node_modules/lodash/_initCloneArray.js":
/*!************************************************!*\
  !*** ./node_modules/lodash/_initCloneArray.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Initializes an array clone.
 *
 * @private
 * @param {Array} array The array to clone.
 * @returns {Array} Returns the initialized clone.
 */
function initCloneArray(array) {
  var length = array.length,
      result = new array.constructor(length);

  // Add properties assigned by `RegExp#exec`.
  if (length && typeof array[0] == 'string' && hasOwnProperty.call(array, 'index')) {
    result.index = array.index;
    result.input = array.input;
  }
  return result;
}

module.exports = initCloneArray;


/***/ }),

/***/ "./node_modules/lodash/_initCloneByTag.js":
/*!************************************************!*\
  !*** ./node_modules/lodash/_initCloneByTag.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var cloneArrayBuffer = __webpack_require__(/*! ./_cloneArrayBuffer */ "./node_modules/lodash/_cloneArrayBuffer.js"),
    cloneDataView = __webpack_require__(/*! ./_cloneDataView */ "./node_modules/lodash/_cloneDataView.js"),
    cloneRegExp = __webpack_require__(/*! ./_cloneRegExp */ "./node_modules/lodash/_cloneRegExp.js"),
    cloneSymbol = __webpack_require__(/*! ./_cloneSymbol */ "./node_modules/lodash/_cloneSymbol.js"),
    cloneTypedArray = __webpack_require__(/*! ./_cloneTypedArray */ "./node_modules/lodash/_cloneTypedArray.js");

/** `Object#toString` result references. */
var boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    symbolTag = '[object Symbol]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/**
 * Initializes an object clone based on its `toStringTag`.
 *
 * **Note:** This function only supports cloning values with tags of
 * `Boolean`, `Date`, `Error`, `Map`, `Number`, `RegExp`, `Set`, or `String`.
 *
 * @private
 * @param {Object} object The object to clone.
 * @param {string} tag The `toStringTag` of the object to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneByTag(object, tag, isDeep) {
  var Ctor = object.constructor;
  switch (tag) {
    case arrayBufferTag:
      return cloneArrayBuffer(object);

    case boolTag:
    case dateTag:
      return new Ctor(+object);

    case dataViewTag:
      return cloneDataView(object, isDeep);

    case float32Tag: case float64Tag:
    case int8Tag: case int16Tag: case int32Tag:
    case uint8Tag: case uint8ClampedTag: case uint16Tag: case uint32Tag:
      return cloneTypedArray(object, isDeep);

    case mapTag:
      return new Ctor;

    case numberTag:
    case stringTag:
      return new Ctor(object);

    case regexpTag:
      return cloneRegExp(object);

    case setTag:
      return new Ctor;

    case symbolTag:
      return cloneSymbol(object);
  }
}

module.exports = initCloneByTag;


/***/ }),

/***/ "./node_modules/lodash/_initCloneObject.js":
/*!*************************************************!*\
  !*** ./node_modules/lodash/_initCloneObject.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var baseCreate = __webpack_require__(/*! ./_baseCreate */ "./node_modules/lodash/_baseCreate.js"),
    getPrototype = __webpack_require__(/*! ./_getPrototype */ "./node_modules/lodash/_getPrototype.js"),
    isPrototype = __webpack_require__(/*! ./_isPrototype */ "./node_modules/lodash/_isPrototype.js");

/**
 * Initializes an object clone.
 *
 * @private
 * @param {Object} object The object to clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneObject(object) {
  return (typeof object.constructor == 'function' && !isPrototype(object))
    ? baseCreate(getPrototype(object))
    : {};
}

module.exports = initCloneObject;


/***/ }),

/***/ "./node_modules/lodash/_isIndex.js":
/*!*****************************************!*\
  !*** ./node_modules/lodash/_isIndex.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  var type = typeof value;
  length = length == null ? MAX_SAFE_INTEGER : length;

  return !!length &&
    (type == 'number' ||
      (type != 'symbol' && reIsUint.test(value))) &&
        (value > -1 && value % 1 == 0 && value < length);
}

module.exports = isIndex;


/***/ }),

/***/ "./node_modules/lodash/_isKeyable.js":
/*!*******************************************!*\
  !*** ./node_modules/lodash/_isKeyable.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

module.exports = isKeyable;


/***/ }),

/***/ "./node_modules/lodash/_isMasked.js":
/*!******************************************!*\
  !*** ./node_modules/lodash/_isMasked.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var coreJsData = __webpack_require__(/*! ./_coreJsData */ "./node_modules/lodash/_coreJsData.js");

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

module.exports = isMasked;


/***/ }),

/***/ "./node_modules/lodash/_isPrototype.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash/_isPrototype.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

  return value === proto;
}

module.exports = isPrototype;


/***/ }),

/***/ "./node_modules/lodash/_listCacheClear.js":
/*!************************************************!*\
  !*** ./node_modules/lodash/_listCacheClear.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
  this.size = 0;
}

module.exports = listCacheClear;


/***/ }),

/***/ "./node_modules/lodash/_listCacheDelete.js":
/*!*************************************************!*\
  !*** ./node_modules/lodash/_listCacheDelete.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var assocIndexOf = __webpack_require__(/*! ./_assocIndexOf */ "./node_modules/lodash/_assocIndexOf.js");

/** Used for built-in method references. */
var arrayProto = Array.prototype;

/** Built-in value references. */
var splice = arrayProto.splice;

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  --this.size;
  return true;
}

module.exports = listCacheDelete;


/***/ }),

/***/ "./node_modules/lodash/_listCacheGet.js":
/*!**********************************************!*\
  !*** ./node_modules/lodash/_listCacheGet.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var assocIndexOf = __webpack_require__(/*! ./_assocIndexOf */ "./node_modules/lodash/_assocIndexOf.js");

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

module.exports = listCacheGet;


/***/ }),

/***/ "./node_modules/lodash/_listCacheHas.js":
/*!**********************************************!*\
  !*** ./node_modules/lodash/_listCacheHas.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var assocIndexOf = __webpack_require__(/*! ./_assocIndexOf */ "./node_modules/lodash/_assocIndexOf.js");

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}

module.exports = listCacheHas;


/***/ }),

/***/ "./node_modules/lodash/_listCacheSet.js":
/*!**********************************************!*\
  !*** ./node_modules/lodash/_listCacheSet.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var assocIndexOf = __webpack_require__(/*! ./_assocIndexOf */ "./node_modules/lodash/_assocIndexOf.js");

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    ++this.size;
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

module.exports = listCacheSet;


/***/ }),

/***/ "./node_modules/lodash/_mapCacheClear.js":
/*!***********************************************!*\
  !*** ./node_modules/lodash/_mapCacheClear.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var Hash = __webpack_require__(/*! ./_Hash */ "./node_modules/lodash/_Hash.js"),
    ListCache = __webpack_require__(/*! ./_ListCache */ "./node_modules/lodash/_ListCache.js"),
    Map = __webpack_require__(/*! ./_Map */ "./node_modules/lodash/_Map.js");

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.size = 0;
  this.__data__ = {
    'hash': new Hash,
    'map': new (Map || ListCache),
    'string': new Hash
  };
}

module.exports = mapCacheClear;


/***/ }),

/***/ "./node_modules/lodash/_mapCacheDelete.js":
/*!************************************************!*\
  !*** ./node_modules/lodash/_mapCacheDelete.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var getMapData = __webpack_require__(/*! ./_getMapData */ "./node_modules/lodash/_getMapData.js");

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  var result = getMapData(this, key)['delete'](key);
  this.size -= result ? 1 : 0;
  return result;
}

module.exports = mapCacheDelete;


/***/ }),

/***/ "./node_modules/lodash/_mapCacheGet.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash/_mapCacheGet.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var getMapData = __webpack_require__(/*! ./_getMapData */ "./node_modules/lodash/_getMapData.js");

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}

module.exports = mapCacheGet;


/***/ }),

/***/ "./node_modules/lodash/_mapCacheHas.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash/_mapCacheHas.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var getMapData = __webpack_require__(/*! ./_getMapData */ "./node_modules/lodash/_getMapData.js");

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}

module.exports = mapCacheHas;


/***/ }),

/***/ "./node_modules/lodash/_mapCacheSet.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash/_mapCacheSet.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var getMapData = __webpack_require__(/*! ./_getMapData */ "./node_modules/lodash/_getMapData.js");

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  var data = getMapData(this, key),
      size = data.size;

  data.set(key, value);
  this.size += data.size == size ? 0 : 1;
  return this;
}

module.exports = mapCacheSet;


/***/ }),

/***/ "./node_modules/lodash/_nativeCreate.js":
/*!**********************************************!*\
  !*** ./node_modules/lodash/_nativeCreate.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var getNative = __webpack_require__(/*! ./_getNative */ "./node_modules/lodash/_getNative.js");

/* Built-in method references that are verified to be native. */
var nativeCreate = getNative(Object, 'create');

module.exports = nativeCreate;


/***/ }),

/***/ "./node_modules/lodash/_nativeKeys.js":
/*!********************************************!*\
  !*** ./node_modules/lodash/_nativeKeys.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var overArg = __webpack_require__(/*! ./_overArg */ "./node_modules/lodash/_overArg.js");

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeKeys = overArg(Object.keys, Object);

module.exports = nativeKeys;


/***/ }),

/***/ "./node_modules/lodash/_nativeKeysIn.js":
/*!**********************************************!*\
  !*** ./node_modules/lodash/_nativeKeysIn.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * This function is like
 * [`Object.keys`](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * except that it includes inherited enumerable properties.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function nativeKeysIn(object) {
  var result = [];
  if (object != null) {
    for (var key in Object(object)) {
      result.push(key);
    }
  }
  return result;
}

module.exports = nativeKeysIn;


/***/ }),

/***/ "./node_modules/lodash/_nodeUtil.js":
/*!******************************************!*\
  !*** ./node_modules/lodash/_nodeUtil.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var freeGlobal = __webpack_require__(/*! ./_freeGlobal */ "./node_modules/lodash/_freeGlobal.js");

/** Detect free variable `exports`. */
var freeExports =  true && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Detect free variable `process` from Node.js. */
var freeProcess = moduleExports && freeGlobal.process;

/** Used to access faster Node.js helpers. */
var nodeUtil = (function() {
  try {
    // Use `util.types` for Node.js 10+.
    var types = freeModule && freeModule.require && freeModule.require('util').types;

    if (types) {
      return types;
    }

    // Legacy `process.binding('util')` for Node.js < 10.
    return freeProcess && freeProcess.binding && freeProcess.binding('util');
  } catch (e) {}
}());

module.exports = nodeUtil;

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../webpack/buildin/module.js */ "./node_modules/webpack/buildin/module.js")(module)))

/***/ }),

/***/ "./node_modules/lodash/_objectToString.js":
/*!************************************************!*\
  !*** ./node_modules/lodash/_objectToString.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString.call(value);
}

module.exports = objectToString;


/***/ }),

/***/ "./node_modules/lodash/_overArg.js":
/*!*****************************************!*\
  !*** ./node_modules/lodash/_overArg.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

module.exports = overArg;


/***/ }),

/***/ "./node_modules/lodash/_root.js":
/*!**************************************!*\
  !*** ./node_modules/lodash/_root.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var freeGlobal = __webpack_require__(/*! ./_freeGlobal */ "./node_modules/lodash/_freeGlobal.js");

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

module.exports = root;


/***/ }),

/***/ "./node_modules/lodash/_stackClear.js":
/*!********************************************!*\
  !*** ./node_modules/lodash/_stackClear.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var ListCache = __webpack_require__(/*! ./_ListCache */ "./node_modules/lodash/_ListCache.js");

/**
 * Removes all key-value entries from the stack.
 *
 * @private
 * @name clear
 * @memberOf Stack
 */
function stackClear() {
  this.__data__ = new ListCache;
  this.size = 0;
}

module.exports = stackClear;


/***/ }),

/***/ "./node_modules/lodash/_stackDelete.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash/_stackDelete.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * Removes `key` and its value from the stack.
 *
 * @private
 * @name delete
 * @memberOf Stack
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function stackDelete(key) {
  var data = this.__data__,
      result = data['delete'](key);

  this.size = data.size;
  return result;
}

module.exports = stackDelete;


/***/ }),

/***/ "./node_modules/lodash/_stackGet.js":
/*!******************************************!*\
  !*** ./node_modules/lodash/_stackGet.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * Gets the stack value for `key`.
 *
 * @private
 * @name get
 * @memberOf Stack
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function stackGet(key) {
  return this.__data__.get(key);
}

module.exports = stackGet;


/***/ }),

/***/ "./node_modules/lodash/_stackHas.js":
/*!******************************************!*\
  !*** ./node_modules/lodash/_stackHas.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * Checks if a stack value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Stack
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function stackHas(key) {
  return this.__data__.has(key);
}

module.exports = stackHas;


/***/ }),

/***/ "./node_modules/lodash/_stackSet.js":
/*!******************************************!*\
  !*** ./node_modules/lodash/_stackSet.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var ListCache = __webpack_require__(/*! ./_ListCache */ "./node_modules/lodash/_ListCache.js"),
    Map = __webpack_require__(/*! ./_Map */ "./node_modules/lodash/_Map.js"),
    MapCache = __webpack_require__(/*! ./_MapCache */ "./node_modules/lodash/_MapCache.js");

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/**
 * Sets the stack `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Stack
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the stack cache instance.
 */
function stackSet(key, value) {
  var data = this.__data__;
  if (data instanceof ListCache) {
    var pairs = data.__data__;
    if (!Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
      pairs.push([key, value]);
      this.size = ++data.size;
      return this;
    }
    data = this.__data__ = new MapCache(pairs);
  }
  data.set(key, value);
  this.size = data.size;
  return this;
}

module.exports = stackSet;


/***/ }),

/***/ "./node_modules/lodash/_toSource.js":
/*!******************************************!*\
  !*** ./node_modules/lodash/_toSource.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/** Used for built-in method references. */
var funcProto = Function.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to convert.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

module.exports = toSource;


/***/ }),

/***/ "./node_modules/lodash/cloneDeep.js":
/*!******************************************!*\
  !*** ./node_modules/lodash/cloneDeep.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var baseClone = __webpack_require__(/*! ./_baseClone */ "./node_modules/lodash/_baseClone.js");

/** Used to compose bitmasks for cloning. */
var CLONE_DEEP_FLAG = 1,
    CLONE_SYMBOLS_FLAG = 4;

/**
 * This method is like `_.clone` except that it recursively clones `value`.
 *
 * @static
 * @memberOf _
 * @since 1.0.0
 * @category Lang
 * @param {*} value The value to recursively clone.
 * @returns {*} Returns the deep cloned value.
 * @see _.clone
 * @example
 *
 * var objects = [{ 'a': 1 }, { 'b': 2 }];
 *
 * var deep = _.cloneDeep(objects);
 * console.log(deep[0] === objects[0]);
 * // => false
 */
function cloneDeep(value) {
  return baseClone(value, CLONE_DEEP_FLAG | CLONE_SYMBOLS_FLAG);
}

module.exports = cloneDeep;


/***/ }),

/***/ "./node_modules/lodash/eq.js":
/*!***********************************!*\
  !*** ./node_modules/lodash/eq.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

module.exports = eq;


/***/ }),

/***/ "./node_modules/lodash/isArguments.js":
/*!********************************************!*\
  !*** ./node_modules/lodash/isArguments.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var baseIsArguments = __webpack_require__(/*! ./_baseIsArguments */ "./node_modules/lodash/_baseIsArguments.js"),
    isObjectLike = __webpack_require__(/*! ./isObjectLike */ "./node_modules/lodash/isObjectLike.js");

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Built-in value references. */
var propertyIsEnumerable = objectProto.propertyIsEnumerable;

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
var isArguments = baseIsArguments(function() { return arguments; }()) ? baseIsArguments : function(value) {
  return isObjectLike(value) && hasOwnProperty.call(value, 'callee') &&
    !propertyIsEnumerable.call(value, 'callee');
};

module.exports = isArguments;


/***/ }),

/***/ "./node_modules/lodash/isArray.js":
/*!****************************************!*\
  !*** ./node_modules/lodash/isArray.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

module.exports = isArray;


/***/ }),

/***/ "./node_modules/lodash/isArrayLike.js":
/*!********************************************!*\
  !*** ./node_modules/lodash/isArrayLike.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var isFunction = __webpack_require__(/*! ./isFunction */ "./node_modules/lodash/isFunction.js"),
    isLength = __webpack_require__(/*! ./isLength */ "./node_modules/lodash/isLength.js");

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}

module.exports = isArrayLike;


/***/ }),

/***/ "./node_modules/lodash/isBuffer.js":
/*!*****************************************!*\
  !*** ./node_modules/lodash/isBuffer.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var root = __webpack_require__(/*! ./_root */ "./node_modules/lodash/_root.js"),
    stubFalse = __webpack_require__(/*! ./stubFalse */ "./node_modules/lodash/stubFalse.js");

/** Detect free variable `exports`. */
var freeExports =  true && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Built-in value references. */
var Buffer = moduleExports ? root.Buffer : undefined;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;

/**
 * Checks if `value` is a buffer.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
 * @example
 *
 * _.isBuffer(new Buffer(2));
 * // => true
 *
 * _.isBuffer(new Uint8Array(2));
 * // => false
 */
var isBuffer = nativeIsBuffer || stubFalse;

module.exports = isBuffer;

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../webpack/buildin/module.js */ "./node_modules/webpack/buildin/module.js")(module)))

/***/ }),

/***/ "./node_modules/lodash/isFunction.js":
/*!*******************************************!*\
  !*** ./node_modules/lodash/isFunction.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var baseGetTag = __webpack_require__(/*! ./_baseGetTag */ "./node_modules/lodash/_baseGetTag.js"),
    isObject = __webpack_require__(/*! ./isObject */ "./node_modules/lodash/isObject.js");

/** `Object#toString` result references. */
var asyncTag = '[object AsyncFunction]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    proxyTag = '[object Proxy]';

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  if (!isObject(value)) {
    return false;
  }
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 9 which returns 'object' for typed arrays and other constructors.
  var tag = baseGetTag(value);
  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
}

module.exports = isFunction;


/***/ }),

/***/ "./node_modules/lodash/isLength.js":
/*!*****************************************!*\
  !*** ./node_modules/lodash/isLength.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

module.exports = isLength;


/***/ }),

/***/ "./node_modules/lodash/isMap.js":
/*!**************************************!*\
  !*** ./node_modules/lodash/isMap.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var baseIsMap = __webpack_require__(/*! ./_baseIsMap */ "./node_modules/lodash/_baseIsMap.js"),
    baseUnary = __webpack_require__(/*! ./_baseUnary */ "./node_modules/lodash/_baseUnary.js"),
    nodeUtil = __webpack_require__(/*! ./_nodeUtil */ "./node_modules/lodash/_nodeUtil.js");

/* Node.js helper references. */
var nodeIsMap = nodeUtil && nodeUtil.isMap;

/**
 * Checks if `value` is classified as a `Map` object.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a map, else `false`.
 * @example
 *
 * _.isMap(new Map);
 * // => true
 *
 * _.isMap(new WeakMap);
 * // => false
 */
var isMap = nodeIsMap ? baseUnary(nodeIsMap) : baseIsMap;

module.exports = isMap;


/***/ }),

/***/ "./node_modules/lodash/isObject.js":
/*!*****************************************!*\
  !*** ./node_modules/lodash/isObject.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

module.exports = isObject;


/***/ }),

/***/ "./node_modules/lodash/isObjectLike.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash/isObjectLike.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

module.exports = isObjectLike;


/***/ }),

/***/ "./node_modules/lodash/isSet.js":
/*!**************************************!*\
  !*** ./node_modules/lodash/isSet.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var baseIsSet = __webpack_require__(/*! ./_baseIsSet */ "./node_modules/lodash/_baseIsSet.js"),
    baseUnary = __webpack_require__(/*! ./_baseUnary */ "./node_modules/lodash/_baseUnary.js"),
    nodeUtil = __webpack_require__(/*! ./_nodeUtil */ "./node_modules/lodash/_nodeUtil.js");

/* Node.js helper references. */
var nodeIsSet = nodeUtil && nodeUtil.isSet;

/**
 * Checks if `value` is classified as a `Set` object.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a set, else `false`.
 * @example
 *
 * _.isSet(new Set);
 * // => true
 *
 * _.isSet(new WeakSet);
 * // => false
 */
var isSet = nodeIsSet ? baseUnary(nodeIsSet) : baseIsSet;

module.exports = isSet;


/***/ }),

/***/ "./node_modules/lodash/isTypedArray.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash/isTypedArray.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var baseIsTypedArray = __webpack_require__(/*! ./_baseIsTypedArray */ "./node_modules/lodash/_baseIsTypedArray.js"),
    baseUnary = __webpack_require__(/*! ./_baseUnary */ "./node_modules/lodash/_baseUnary.js"),
    nodeUtil = __webpack_require__(/*! ./_nodeUtil */ "./node_modules/lodash/_nodeUtil.js");

/* Node.js helper references. */
var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;

/**
 * Checks if `value` is classified as a typed array.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 * @example
 *
 * _.isTypedArray(new Uint8Array);
 * // => true
 *
 * _.isTypedArray([]);
 * // => false
 */
var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;

module.exports = isTypedArray;


/***/ }),

/***/ "./node_modules/lodash/keys.js":
/*!*************************************!*\
  !*** ./node_modules/lodash/keys.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var arrayLikeKeys = __webpack_require__(/*! ./_arrayLikeKeys */ "./node_modules/lodash/_arrayLikeKeys.js"),
    baseKeys = __webpack_require__(/*! ./_baseKeys */ "./node_modules/lodash/_baseKeys.js"),
    isArrayLike = __webpack_require__(/*! ./isArrayLike */ "./node_modules/lodash/isArrayLike.js");

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
function keys(object) {
  return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
}

module.exports = keys;


/***/ }),

/***/ "./node_modules/lodash/keysIn.js":
/*!***************************************!*\
  !*** ./node_modules/lodash/keysIn.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var arrayLikeKeys = __webpack_require__(/*! ./_arrayLikeKeys */ "./node_modules/lodash/_arrayLikeKeys.js"),
    baseKeysIn = __webpack_require__(/*! ./_baseKeysIn */ "./node_modules/lodash/_baseKeysIn.js"),
    isArrayLike = __webpack_require__(/*! ./isArrayLike */ "./node_modules/lodash/isArrayLike.js");

/**
 * Creates an array of the own and inherited enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keysIn(new Foo);
 * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
 */
function keysIn(object) {
  return isArrayLike(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);
}

module.exports = keysIn;


/***/ }),

/***/ "./node_modules/lodash/stubArray.js":
/*!******************************************!*\
  !*** ./node_modules/lodash/stubArray.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * This method returns a new empty array.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {Array} Returns the new empty array.
 * @example
 *
 * var arrays = _.times(2, _.stubArray);
 *
 * console.log(arrays);
 * // => [[], []]
 *
 * console.log(arrays[0] === arrays[1]);
 * // => false
 */
function stubArray() {
  return [];
}

module.exports = stubArray;


/***/ }),

/***/ "./node_modules/lodash/stubFalse.js":
/*!******************************************!*\
  !*** ./node_modules/lodash/stubFalse.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * This method returns `false`.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {boolean} Returns `false`.
 * @example
 *
 * _.times(2, _.stubFalse);
 * // => [false, false]
 */
function stubFalse() {
  return false;
}

module.exports = stubFalse;


/***/ }),

/***/ "./node_modules/webpack/buildin/global.js":
/*!***********************************!*\
  !*** (webpack)/buildin/global.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || new Function("return this")();
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),

/***/ "./node_modules/webpack/buildin/module.js":
/*!***********************************!*\
  !*** (webpack)/buildin/module.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = function(module) {
	if (!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if (!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),

/***/ "./src/api/AbstractAPIReqHandler.ts":
/*!******************************************!*\
  !*** ./src/api/AbstractAPIReqHandler.ts ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var RuntimeLog_1 = __webpack_require__(/*! ../log/RuntimeLog */ "./src/log/RuntimeLog.ts");
var AbstractAPIReqHandler = /** @class */ (function () {
    function AbstractAPIReqHandler() {
        this.nextHandler = null;
    }
    ;
    AbstractAPIReqHandler.prototype.handleRequest = function (req) {
        if (this.getHandleType() === req.getRequestType()) {
            return this.handle(req) || null;
        }
        else {
            if (this.nextHandler !== null) {
                this.nextHandler.handleRequest(req);
            }
            else {
                RuntimeLog_1.default.getInstance().error('this API req does not have any handler: ', req);
            }
        }
    };
    return AbstractAPIReqHandler;
}());
exports.default = AbstractAPIReqHandler;


/***/ }),

/***/ "./src/api/AbstractAPIRequest.ts":
/*!***************************************!*\
  !*** ./src/api/AbstractAPIRequest.ts ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * API层请求抽象类
 */
Object.defineProperty(exports, "__esModule", { value: true });
var AbstractAPIRequest = /** @class */ (function () {
    function AbstractAPIRequest(dataObj) {
        this._dataObj = dataObj;
    }
    ;
    AbstractAPIRequest.prototype.getContent = function () {
        return this._dataObj;
    };
    ;
    return AbstractAPIRequest;
}());
exports.default = AbstractAPIRequest;


/***/ }),

/***/ "./src/api/AsyncAPIReqHandler.ts":
/*!***************************************!*\
  !*** ./src/api/AsyncAPIReqHandler.ts ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * 异步Request处理器
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var AbstractAPIReqHandler_1 = __webpack_require__(/*! ./AbstractAPIReqHandler */ "./src/api/AbstractAPIReqHandler.ts");
var APIRequestTypeList_1 = __webpack_require__(/*! ../config/APIRequestTypeList */ "./src/config/APIRequestTypeList.ts");
var EventCenter_1 = __webpack_require__(/*! ../events/EventCenter */ "./src/events/EventCenter.ts");
var AsyncAPIReqHandler = /** @class */ (function (_super) {
    __extends(AsyncAPIReqHandler, _super);
    function AsyncAPIReqHandler() {
        return _super.call(this) || this;
    }
    AsyncAPIReqHandler.prototype.handle = function (req) {
        var _tempObj = req.getContent();
        EventCenter_1.default.getInstance().dispatchInnerEvent(_tempObj.code, _tempObj);
    };
    AsyncAPIReqHandler.prototype.getHandleType = function () {
        return APIRequestTypeList_1.APIRequestTypeList.ASYNC_REQ;
    };
    return AsyncAPIReqHandler;
}(AbstractAPIReqHandler_1.default));
exports.default = AsyncAPIReqHandler;


/***/ }),

/***/ "./src/api/AsyncAPIRequest.ts":
/*!************************************!*\
  !*** ./src/api/AsyncAPIRequest.ts ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 异步API request请求
 */
var AbstractAPIRequest_1 = __webpack_require__(/*! ./AbstractAPIRequest */ "./src/api/AbstractAPIRequest.ts");
var APIRequestTypeList_1 = __webpack_require__(/*! ../config/APIRequestTypeList */ "./src/config/APIRequestTypeList.ts");
var AsyncAPIRequest = /** @class */ (function (_super) {
    __extends(AsyncAPIRequest, _super);
    function AsyncAPIRequest(data) {
        return _super.call(this, data) || this;
    }
    AsyncAPIRequest.prototype.getRequestType = function () {
        return APIRequestTypeList_1.APIRequestTypeList.ASYNC_REQ;
    };
    return AsyncAPIRequest;
}(AbstractAPIRequest_1.default));
exports.default = AsyncAPIRequest;


/***/ }),

/***/ "./src/api/GlobalAPI.ts":
/*!******************************!*\
  !*** ./src/api/GlobalAPI.ts ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * API模块
 */
Object.defineProperty(exports, "__esModule", { value: true });
//todo: get/set未定义的属性，调用未定义的方法，需要给使用者反馈信息
var EventLevel_1 = __webpack_require__(/*! ../events/EventLevel */ "./src/events/EventLevel.ts");
var RuntimeLog_1 = __webpack_require__(/*! ../log/RuntimeLog */ "./src/log/RuntimeLog.ts");
var CorePlayerManager_1 = __webpack_require__(/*! ../core/CorePlayerManager */ "./src/core/CorePlayerManager.ts");
var SyncAPIReqHandler_1 = __webpack_require__(/*! ./SyncAPIReqHandler */ "./src/api/SyncAPIReqHandler.ts");
var AsyncAPIReqHandler_1 = __webpack_require__(/*! ./AsyncAPIReqHandler */ "./src/api/AsyncAPIReqHandler.ts");
var AsyncAPIRequest_1 = __webpack_require__(/*! ./AsyncAPIRequest */ "./src/api/AsyncAPIRequest.ts");
var SyncAPIRequest_1 = __webpack_require__(/*! ./SyncAPIRequest */ "./src/api/SyncAPIRequest.ts");
var _instance;
var GlobalAPI = /** @class */ (function () {
    function GlobalAPI(dataObj, sign) {
        if (sign !== PrivateClass) {
            RuntimeLog_1.default.getInstance().error('class CorePlayerManager is singleton, do not use new operator!');
            return;
        }
        this._core = new CorePlayerManager_1.default(dataObj);
        this._apiReqHandlerChain = GlobalAPI.initAPIReqHandlerChains();
    }
    GlobalAPI.getInstance = function (dataObj) {
        if (!_instance) {
            if (!dataObj) {
                RuntimeLog_1.default.getInstance().error('GlobalAPI must have params when getInstance in first time!');
                return;
            }
            _instance = new GlobalAPI(dataObj, PrivateClass);
        }
        return _instance;
    };
    /**
     * 创建操作处理责任链
     */
    GlobalAPI.initAPIReqHandlerChains = function () {
        var _syncHandler = new SyncAPIReqHandler_1.default();
        _syncHandler.nextHandler = new AsyncAPIReqHandler_1.default();
        return _syncHandler;
    };
    /**
     * 发送异步请求
     * @param {string} name
     * @param {[]} argsArr
     */
    GlobalAPI.prototype.handleAsyncRequest = function (name, argsArr) {
        var _tempEventObj = {
            code: name,
            level: EventLevel_1.EventLevel.COMMAND,
            target: this,
            message: "player async request " + name + " => " + argsArr,
            data: argsArr,
        };
        var _asyncReq = new AsyncAPIRequest_1.default(_tempEventObj);
        this._apiReqHandlerChain.handleRequest(_asyncReq);
    };
    /**
     * 发送同步请求
     * @param {string} name
     * @param {[]} argsArr
     */
    GlobalAPI.prototype.handleSyncRequest = function (name, argsArr) {
        if (argsArr === void 0) { argsArr = null; }
        var _tempEventObj = {
            code: name,
            level: EventLevel_1.EventLevel.COMMAND,
            target: this,
            message: "player sync request " + name + " => ",
            data: argsArr,
        };
        var _syncReq = new SyncAPIRequest_1.default(_tempEventObj);
        return this._apiReqHandlerChain.handleRequest(_syncReq);
    };
    /**
     * 通过名字获取core属性
     * @param {string} propName
     */
    GlobalAPI.prototype.getCorePropertyByName = function (propName) {
        if (!propName) {
            RuntimeLog_1.default.getInstance().error('propName is must-pass parameters when get it (globalAPI)');
            return;
        }
        return this.handleSyncRequest(propName);
    };
    /**
     * 通过名字设置core属性
     * @param {string} propName
     * @param params
     * @returns
     */
    GlobalAPI.prototype.setCorePropertyByName = function (propName, params) {
        if (!propName) {
            RuntimeLog_1.default.getInstance().error('propName is must-pass parameters when set it (globalAPI)');
            return;
        }
        this.handleAsyncRequest('set-' + propName, params);
    };
    /**
     * 通过名字调用函数
     * @param {string} funcName
     * @param args
     */
    GlobalAPI.prototype.callFuncByName = function (funcName) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (!funcName) {
            RuntimeLog_1.default.getInstance().error('funcName is must-pass parameters when call it (globalAPI)');
            return;
        }
        this.handleAsyncRequest(funcName, args);
    };
    /**
     * 销毁GlobalAPI
     */
    GlobalAPI.prototype.dispose = function () {
        this._core.dispose();
        this._apiReqHandlerChain = null;
        _instance = null;
    };
    return GlobalAPI;
}());
exports.default = GlobalAPI;
var PrivateClass = /** @class */ (function () {
    function PrivateClass() {
    }
    return PrivateClass;
}());


/***/ }),

/***/ "./src/api/SyncAPIReqHandler.ts":
/*!**************************************!*\
  !*** ./src/api/SyncAPIReqHandler.ts ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * 同步Request请求处理器
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var AbstractAPIReqHandler_1 = __webpack_require__(/*! ./AbstractAPIReqHandler */ "./src/api/AbstractAPIReqHandler.ts");
var APIRequestTypeList_1 = __webpack_require__(/*! ../config/APIRequestTypeList */ "./src/config/APIRequestTypeList.ts");
var GlobalAPI_1 = __webpack_require__(/*! ./GlobalAPI */ "./src/api/GlobalAPI.ts");
var RuntimeLog_1 = __webpack_require__(/*! ../log/RuntimeLog */ "./src/log/RuntimeLog.ts");
var SyncAPIReqHandler = /** @class */ (function (_super) {
    __extends(SyncAPIReqHandler, _super);
    function SyncAPIReqHandler() {
        return _super.call(this) || this;
    }
    SyncAPIReqHandler.prototype.handle = function (req) {
        var _tempObj = req.getContent();
        var _core = GlobalAPI_1.default.getInstance()._core;
        RuntimeLog_1.default.getInstance().log(_tempObj.message + _core[_tempObj.code]);
        return _core[_tempObj.code];
    };
    SyncAPIReqHandler.prototype.getHandleType = function () {
        return APIRequestTypeList_1.APIRequestTypeList.SYNC_REQ;
    };
    return SyncAPIReqHandler;
}(AbstractAPIReqHandler_1.default));
exports.default = SyncAPIReqHandler;


/***/ }),

/***/ "./src/api/SyncAPIRequest.ts":
/*!***********************************!*\
  !*** ./src/api/SyncAPIRequest.ts ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 同步API request请求
 */
var AbstractAPIRequest_1 = __webpack_require__(/*! ./AbstractAPIRequest */ "./src/api/AbstractAPIRequest.ts");
var APIRequestTypeList_1 = __webpack_require__(/*! ../config/APIRequestTypeList */ "./src/config/APIRequestTypeList.ts");
var SyncAPIRequest = /** @class */ (function (_super) {
    __extends(SyncAPIRequest, _super);
    function SyncAPIRequest(data) {
        return _super.call(this, data) || this;
    }
    SyncAPIRequest.prototype.getRequestType = function () {
        return APIRequestTypeList_1.APIRequestTypeList.SYNC_REQ;
    };
    return SyncAPIRequest;
}(AbstractAPIRequest_1.default));
exports.default = SyncAPIRequest;


/***/ }),

/***/ "./src/config/APIRequestTypeList.ts":
/*!******************************************!*\
  !*** ./src/config/APIRequestTypeList.ts ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * API request 请求类型列表
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.APIRequestTypeList = {
    SYNC_REQ: 'syncRequest',
    ASYNC_REQ: 'asyncRequest'
};


/***/ }),

/***/ "./src/config/ErrorTypeList.ts":
/*!*************************************!*\
  !*** ./src/config/ErrorTypeList.ts ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * 错误类型列表
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 1xxxx 模块运行异常
 * 2xxxx 参数异常
 * 3xxxx 保留异常
 * 4xxxx 保留异常
 * 5xxxx 保留异常
 * .
 * .
 *
 * 00000 为未知异常
 */
exports.ErrorTypeList = {
    PLAYER_CORE_INIT_ERROR: '10001',
    PLAYER_CORE_RUN_ERROR: '10002',
    PLAYER_CORE_MP4_ERROR: '10003',
    PLAYER_CORE_HLS_ERROR: '10004',
    PLAYER_CORE_M3U8_ERROR: '10005',
    PLAYER_CORE_MSE_ERROR: '10006',
    PLAYER_CORE_TASK_ERROR: '10007',
    PLAYER_CORE_STREAM_PARSE_ERROR: '10008',
    PRODUCT_ID_ERROR: '20001',
    VIDEO_URL_ERROR: '20002',
    TASK_PARAMS_ERROR: '20003',
    UNKNOWN_ERROR: '00000',
};


/***/ }),

/***/ "./src/config/MediaPlayerConfig.ts":
/*!*****************************************!*\
  !*** ./src/config/MediaPlayerConfig.ts ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * Player配置列表
 */
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var ErrorTypeList_1 = __webpack_require__(/*! ./ErrorTypeList */ "./src/config/ErrorTypeList.ts");
/**
 * Player SDK 信息
 * @type {{version: string; author: string}}
 */
exports.MediaPlayerSdkInfo = {
    version: '1.0.0',
    author: 'Jia zi ling'
};
/**
 * 神策服务器url列表
 * @type {{sa_test_server_url: string; sa_online_server_url: string}}
 */
exports.SensorServerUrl = {
    sa_test_server_url: "",
    sa_online_server_url: ""
};
/**
 * 神策上报数据内容
 * @type
 * {
 *  $url: string;
 *  business: string;
 *  product: string;
 *  version: string;
 *  message: string;
 *  type: ErrorTypeList.UNKNOWN_ERROR;
 *  class_id: string
 * }
 */
exports.SensorDataObj = {
    $url: document.location.href || "unknown",
    business: "H5-VIDEO-SDK",
    product: "VK-VIDEO-SDK",
    version: exports.MediaPlayerSdkInfo.version,
    message: 'unknown error',
    type: ErrorTypeList_1.ErrorTypeList.UNKNOWN_ERROR,
    class_id: 'unknown ID',
};
/**
 * 神策打点事件类型选择
 */
exports.SensorEventType = {
    test: "",
    prod: ""
};
/**
 * 播放器默认配置
 */
exports.playerConfig = {
    definition: 'Auto',
    autoplay: false,
    muted: false,
    loop: false,
    preload: false,
    poster: '',
    controls: false,
    volume: 1,
    src: '',
    playbackRate: 1,
    preLoadTime: 3 * 60,
    triggerNextLoadRangeTime: 2 * 60,
    autoCleanupMaxDuration: 3 * 60,
    autoCleanupMinDuration: 2 * 60,
    playerAppendMinBufferLengthMap: {
        '240P': 1048576 * 0.25,
        '360P': 1048576 * 0.5,
        '480P': 1048576 * 0.75,
        '720P': 1048576,
        '1080P': 1048576 * 1.5,
        '4K': 1048576 * 3,
    },
    playerPreSwitchTime: 3,
    playerWaitingHandlerTime: 3000,
    playerEndGapTime: 0.5,
    networkSpeedChangeReflectTime: 5000,
};
var playerConfigManager = /** @class */ (function () {
    function playerConfigManager() {
    }
    playerConfigManager.setPlayerConfig = function (opts) {
        exports.playerConfig = __assign(__assign({}, exports.playerConfig), opts);
    };
    return playerConfigManager;
}());
exports.playerConfigManager = playerConfigManager;


/***/ }),

/***/ "./src/config/StateTypeList.ts":
/*!*************************************!*\
  !*** ./src/config/StateTypeList.ts ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 状态类型列表
 */
exports.StateTypeList = {
    NOT_READY: 'notready',
    LOAD_START: 'loadstart',
    READY: 'ready',
    CAN_PLAY: 'canplay',
    CAN_PLAY_THROUGH: 'canplaythrough',
    PLAYING: 'playing',
    PROGRESS: 'progress',
    LOADED_METADATA: 'loadedmetadata',
    LOADED_DATA: 'loadeddata',
    SEEKING: 'seeking',
    TIME_UPDATE: 'timeupdate',
    WATTING: 'waiting',
    ENDED: 'ended',
    PLAY: 'play',
    PAUSE: 'pause',
    SEEKED: 'seeked',
    REAT_CHANGE: 'ratechange',
    VOLUME_CHANGE: 'volumechange',
    DURATION_CHANGE: 'durationchange'
};


/***/ }),

/***/ "./src/core/CorePlayerManager.ts":
/*!***************************************!*\
  !*** ./src/core/CorePlayerManager.ts ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var RuntimeLog_1 = __webpack_require__(/*! ../log/RuntimeLog */ "./src/log/RuntimeLog.ts");
var EventBus_1 = __webpack_require__(/*! ../events/EventBus */ "./src/events/EventBus.ts");
var EventNames_1 = __webpack_require__(/*! ../events/EventNames */ "./src/events/EventNames.ts");
var ErrorTypeList_1 = __webpack_require__(/*! ../config/ErrorTypeList */ "./src/config/ErrorTypeList.ts");
var EventCenter_1 = __webpack_require__(/*! ../events/EventCenter */ "./src/events/EventCenter.ts");
var EventLevel_1 = __webpack_require__(/*! ../events/EventLevel */ "./src/events/EventLevel.ts");
var NormalUtils_1 = __webpack_require__(/*! ../utils/NormalUtils */ "./src/utils/NormalUtils.ts");
var VkdMP4Player_1 = __webpack_require__(/*! ./vkd/mp4/VkdMP4Player */ "./src/core/vkd/mp4/VkdMP4Player.ts");
var VkdHLSPlayer_1 = __webpack_require__(/*! ./vkd/hls/VkdHLSPlayer */ "./src/core/vkd/hls/VkdHLSPlayer.ts");
var FMP4Worker_1 = __webpack_require__(/*! ./vkd/FMP4Worker */ "./src/core/vkd/FMP4Worker.ts");
var MediaPlayerConfig_1 = __webpack_require__(/*! ../config/MediaPlayerConfig */ "./src/config/MediaPlayerConfig.ts");
/**
 * Manager配置项接口
 */
var CorePlayerManager = /** @class */ (function () {
    function CorePlayerManager(options) {
        var _this = this;
        /**
         * command事件处理handler
         * @param {IObject} e
         */
        this.commandEventsHandler = function (e) {
            if (!_this[e.code] && _this[e.code] === undefined) {
                RuntimeLog_1.default.getInstance().warning('Player doesn\'t have this function name: ' + e.code);
                return;
            }
            _this.callCoreFuncByName(e.code, e.data);
        };
        /**
         * prop事件处理handler
         * @param {IObject} e
         */
        this.propEventsHandler = function (e) {
            e.code = e.code.slice(4); //去除set标记
            if (!_this[e.code] && _this[e.code] === undefined) {
                RuntimeLog_1.default.getInstance().warning('Player doesn\'t have this prop name: ' + e.code);
                return;
            }
            _this[e.code] = e.data;
        };
        RuntimeLog_1.default.getInstance().log('player core manager is loading...');
        this.initManager(options);
        RuntimeLog_1.default.getInstance().log('player core manager is loaded');
    }
    /**
     * 创建视频渲染载体
     * @param {string} id
     * @param {string[]} classList
     * @returns {HTMLVideoElement}
     */
    CorePlayerManager.prototype.createVideoElement = function (id, classList) {
        var _tempElement = document.createElement('video');
        //attributes
        _tempElement.setAttribute('id', id);
        _tempElement.setAttribute('airplay', 'allow');
        _tempElement.setAttribute('x-webkit-airplay', 'allow');
        _tempElement.setAttribute('playsinline', 'true');
        _tempElement.setAttribute('webkit-playsinline', 'true');
        _tempElement.setAttribute('x5-playsinline', 'true');
        _tempElement.setAttribute('x5-video-player-type', 'h5');
        _tempElement.setAttribute('x5-video-player-fullscreen', 'true');
        //classes
        _tempElement.classList.add('vkd-player');
        _tempElement.classList.add('vkd-fill');
        if (classList && classList.length) {
            classList.forEach(function (item) {
                _tempElement.classList.add(item);
            });
        }
        return _tempElement;
    };
    /**
     * 创建播放核心管理者
     * @param {object} config
     */
    CorePlayerManager.prototype.initManager = function (config) {
        if (!config.container) {
            RuntimeLog_1.default.getInstance().error('container element is must-pass param!');
            return;
        }
        var _videoElement = this.createVideoElement(config.id, config.classList);
        config.container.appendChild(_videoElement);
        RuntimeLog_1.default.getInstance().log('video element appended');
        try {
            this.initVkdPlayerCore(_videoElement, config);
            this.initEventsHandler();
        }
        catch (e) {
            var errorObj = {
                code: ErrorTypeList_1.ErrorTypeList.PLAYER_CORE_MSE_ERROR,
                level: EventLevel_1.EventLevel.ERROR,
                target: this,
                message: "media player init error (Core manager): " + e.message,
                data: e
            };
            EventCenter_1.default.getInstance().dispatchOutwardEvent('PlayerError', errorObj);
        }
    };
    /**
     * 初始化自定义播放核心
     */
    CorePlayerManager.prototype.initVkdPlayerCore = function (element, options) {
        if (!options.src) {
            EventCenter_1.default.getInstance().dispatchOutwardEvent('PlayerError', {
                code: ErrorTypeList_1.ErrorTypeList.VIDEO_URL_ERROR,
                message: "media player error " + ErrorTypeList_1.ErrorTypeList.VIDEO_URL_ERROR + ", src is must-pass param.",
                data: null,
            });
        }
        //初始化碎片MP4 worker
        FMP4Worker_1.default.getInstance();
        //设置player配置项
        MediaPlayerConfig_1.playerConfigManager.setPlayerConfig(options);
        var fileType = null;
        //通过获取src中的文件格式来确定加载器和解析器
        if (NormalUtils_1.default.typeOf(options.src) === 'String') {
            fileType = NormalUtils_1.default.parseExtended(options.src);
        }
        else if (NormalUtils_1.default.typeOf(options.src) === 'Object') {
            var _keys = Object.keys(options.src);
            fileType = NormalUtils_1.default.parseExtended(options.src[_keys[0]]); //通过第一个文件检测核心格式
        }
        RuntimeLog_1.default.getInstance().log("file type is " + fileType);
        switch (fileType) {
            case '.mp4':
                this._playerCore = new VkdMP4Player_1.default(element, options);
                break;
            case '.m3u8':
                this._playerCore = new VkdHLSPlayer_1.default(element, options);
                break;
        }
    };
    /**
     * 初始化事件监听器
     */
    CorePlayerManager.prototype.initEventsHandler = function () {
        for (var key in EventNames_1.CommandEvents) {
            EventBus_1.default.getInstance().on(EventNames_1.CommandEvents[key], this.commandEventsHandler);
        }
        for (var key in EventNames_1.PropEvents) {
            EventBus_1.default.getInstance().on('set-' + EventNames_1.PropEvents[key], this.propEventsHandler);
        }
    };
    /**
     * 通过名字调用播放核心方法
     * @param {string} funcName
     * @param {object} params
     */
    CorePlayerManager.prototype.callCoreFuncByName = function (funcName, params) {
        if (!params) {
            return this[funcName]().bind(this);
        }
        return this[funcName].apply(this, params);
    };
    Object.defineProperty(CorePlayerManager.prototype, "aspectRatio", {
        get: function () {
            return this._playerCore.aspectRatio;
        },
        set: function (value) {
            this._playerCore.aspectRatio = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CorePlayerManager.prototype, "buffered", {
        get: function () {
            return this._playerCore.buffered;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CorePlayerManager.prototype, "bufferedEnd", {
        get: function () {
            return this._playerCore.bufferedEnd;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CorePlayerManager.prototype, "bufferedPercent", {
        get: function () {
            return this._playerCore.bufferedPercent;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CorePlayerManager.prototype, "currentWidth", {
        get: function () {
            return this._playerCore.currentWidth;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CorePlayerManager.prototype, "currentHeight", {
        get: function () {
            return this._playerCore.currentHeight;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CorePlayerManager.prototype, "currentTime", {
        get: function () {
            return this._playerCore.currentTime;
        },
        set: function (value) {
            this._playerCore.currentTime = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CorePlayerManager.prototype, "duration", {
        get: function () {
            return this._playerCore.duration;
        },
        set: function (value) {
            this._playerCore.duration = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CorePlayerManager.prototype, "height", {
        get: function () {
            return this._playerCore.height;
        },
        set: function (value) {
            this._playerCore.height = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CorePlayerManager.prototype, "muted", {
        get: function () {
            return this._playerCore.muted;
        },
        set: function (value) {
            this._playerCore.muted = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CorePlayerManager.prototype, "poster", {
        get: function () {
            return this._playerCore.poster;
        },
        set: function (value) {
            this._playerCore.poster = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CorePlayerManager.prototype, "videoPlaybackQuality", {
        get: function () {
            return this._playerCore.videoPlaybackQuality;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CorePlayerManager.prototype, "volume", {
        get: function () {
            return this._playerCore.volume;
        },
        set: function (value) {
            this._playerCore.volume = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CorePlayerManager.prototype, "width", {
        get: function () {
            return this._playerCore.width;
        },
        set: function (value) {
            this._playerCore.width = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CorePlayerManager.prototype, "src", {
        get: function () {
            return this._playerCore.src;
        },
        set: function (value) {
            this._playerCore.src = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CorePlayerManager.prototype, "playbackRate", {
        get: function () {
            return this._playerCore.playbackRate;
        },
        set: function (value) {
            this._playerCore.playbackRate = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CorePlayerManager.prototype, "loop", {
        get: function () {
            return this._playerCore.loop;
        },
        set: function (value) {
            this._playerCore.loop = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CorePlayerManager.prototype, "preload", {
        get: function () {
            return this._playerCore.preload;
        },
        set: function (value) {
            this._playerCore.preload = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CorePlayerManager.prototype, "autoplay", {
        get: function () {
            return this._playerCore.autoplay;
        },
        set: function (value) {
            this._playerCore.autoplay = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CorePlayerManager.prototype, "controls", {
        get: function () {
            return this._playerCore.controls;
        },
        set: function (value) {
            this._playerCore.controls = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CorePlayerManager.prototype, "supportFullScreen", {
        get: function () {
            if (this._playerCore['supportFullScreen'] === undefined) {
                return null;
            }
            return this._playerCore.supportFullScreen;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CorePlayerManager.prototype, "fullScreenState", {
        get: function () {
            return this._playerCore.fullScreenState;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CorePlayerManager.prototype, "srcList", {
        get: function () {
            return this._playerCore.usefulUrlList;
        },
        enumerable: true,
        configurable: true
    });
    CorePlayerManager.prototype.changeResolution = function (resolution) {
        this._playerCore.changeResolution(resolution);
    };
    CorePlayerManager.prototype.changeSrc = function (source) {
        this._playerCore.changeSrc(source);
    };
    CorePlayerManager.prototype.enterFullScreen = function () {
        this._playerCore.enterFullScreen();
    };
    CorePlayerManager.prototype.exitFullScreen = function () {
        this._playerCore.exitFullScreen();
    };
    CorePlayerManager.prototype.pause = function () {
        this._playerCore.pause();
    };
    CorePlayerManager.prototype.play = function () {
        this._playerCore.play();
    };
    CorePlayerManager.prototype.replay = function () {
        this._playerCore.replay();
    };
    CorePlayerManager.prototype.reset = function () {
        this._playerCore.reset();
    };
    CorePlayerManager.prototype.setCurrentTimeByPercent = function (percent) {
        this._playerCore.setCurrentTimeByPercent(percent);
    };
    CorePlayerManager.prototype.dispose = function () {
        //移除所有事件, 注销worker
        FMP4Worker_1.default.getInstance().worker.terminate();
        this._playerCore.dispose();
    };
    return CorePlayerManager;
}());
exports.default = CorePlayerManager;


/***/ }),

/***/ "./src/core/PlayerStateManager.ts":
/*!****************************************!*\
  !*** ./src/core/PlayerStateManager.ts ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * player 状态管理单例
 */
var RuntimeLog_1 = __webpack_require__(/*! ../log/RuntimeLog */ "./src/log/RuntimeLog.ts");
var _instance;
var PlayerStateManager = /** @class */ (function () {
    function PlayerStateManager(sign) {
        this.stateNow = null;
        if (sign !== PrivateClass) {
            RuntimeLog_1.default.getInstance().error('class PlayerStateManager is singleton, do not use new operator!');
            return;
        }
    }
    PlayerStateManager.getInstance = function () {
        if (!_instance) {
            _instance = new PlayerStateManager(PrivateClass);
        }
        return _instance;
    };
    /**
     * 更新Player当前状态
     */
    PlayerStateManager.prototype.updatePlayerState = function (state) {
        if (state === this.stateNow)
            return;
        this.stateNow = state;
    };
    /**
     * 获取Player当前状态
     */
    PlayerStateManager.prototype.getPlayerState = function () {
        return this.stateNow;
    };
    PlayerStateManager.prototype.dispose = function () {
        _instance = null;
    };
    return PlayerStateManager;
}());
exports.default = PlayerStateManager;
var PrivateClass = /** @class */ (function () {
    function PrivateClass() {
    }
    return PrivateClass;
}());


/***/ }),

/***/ "./src/core/vkd/Buffer.ts":
/*!********************************!*\
  !*** ./src/core/vkd/Buffer.ts ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var NormalUtils_1 = __webpack_require__(/*! ../../utils/NormalUtils */ "./src/utils/NormalUtils.ts");
var RuntimeLog_1 = __webpack_require__(/*! ../../log/RuntimeLog */ "./src/log/RuntimeLog.ts");
var Buffer = /** @class */ (function () {
    function Buffer() {
        this._buffer = new Uint8Array(0);
    }
    Object.defineProperty(Buffer.prototype, "buffer", {
        get: function () {
            return this._buffer;
        },
        enumerable: true,
        configurable: true
    });
    Buffer.prototype.write = function () {
        var _this = this;
        var buffer = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            buffer[_i] = arguments[_i];
        }
        buffer.forEach(function (item) {
            if (item) {
                // this._buffer = NormalUtils.concatTypedArray(Uint8Array, this._buffer, item);
                _this._buffer = NormalUtils_1.default.concatUint8Array(_this._buffer, item);
            }
            else {
                RuntimeLog_1.default.getInstance().error('undefined buffer: ', item);
            }
        });
    };
    Buffer.writeUint32 = function (value) {
        return new Uint8Array([
            value >> 24,
            (value >> 16) & 0xff,
            (value >> 8) & 0xff,
            value & 0xff
        ]);
    };
    return Buffer;
}());
exports.default = Buffer;


/***/ }),

/***/ "./src/core/vkd/FMP4.ts":
/*!******************************!*\
  !*** ./src/core/vkd/FMP4.ts ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * mp4组装类 提供组装mp4数据的静态方法
 */
var Buffer_1 = __webpack_require__(/*! ./Buffer */ "./src/core/vkd/Buffer.ts");
var sequence = 1;
var UINT32_MAX = Math.pow(2, 32) - 1;
var FMP4 = /** @class */ (function () {
    function FMP4() {
        //nothing
    }
    /**
     * 写入类型参数
     * @param {string} name
     * @returns {Uint8Array}
     */
    FMP4.type = function (name) {
        return new Uint8Array([name.charCodeAt(0), name.charCodeAt(1), name.charCodeAt(2), name.charCodeAt(3)]);
    };
    /**
     * 写入大小参数
     * @param {number} value
     * @returns {Uint8Array}
     */
    FMP4.size = function (value) {
        return Buffer_1.default.writeUint32(value);
    };
    /**
     * 写入扩展参数
     * @param version
     * @param flag
     * @returns {Uint8Array}
     */
    FMP4.extension = function (version, flag) {
        return new Uint8Array([
            version,
            (flag >> 16) & 0xff,
            (flag >> 8) & 0xff,
            flag & 0xff
        ]);
    };
    FMP4.mfhd = function () {
        var buffer = new Buffer_1.default();
        var content = Buffer_1.default.writeUint32(sequence);
        sequence += 1;
        buffer.write(FMP4.size(16), FMP4.type('mfhd'), FMP4.extension(0, 0), content);
        return buffer.buffer;
    };
    FMP4.tfhd = function (id) {
        var buffer = new Buffer_1.default();
        var content = Buffer_1.default.writeUint32(id);
        buffer.write(FMP4.size(16), FMP4.type('tfhd'), FMP4.extension(0, 0), content);
        return buffer.buffer;
    };
    FMP4.tfdt = function (time) {
        var buffer = new Buffer_1.default();
        var upper = Math.floor(time / (UINT32_MAX + 1));
        var lower = Math.floor(time % (UINT32_MAX + 1));
        buffer.write(FMP4.size(20), FMP4.type('tfdt'), FMP4.extension(1, 0), Buffer_1.default.writeUint32(upper), Buffer_1.default.writeUint32(lower));
        return buffer.buffer;
    };
    FMP4.sdtp = function (data) {
        var buffer = new Buffer_1.default();
        buffer.write(FMP4.size(12 + data.samples.length), FMP4.type('sdtp'), FMP4.extension(0, 0));
        data.samples.forEach(function (item) {
            buffer.write(new Uint8Array(data.id === 1 ? [item.key ? 32 : 16] : [16]));
        });
        return buffer.buffer;
    };
    FMP4.trun = function (data, sdtpLength) {
        var id = data.id;
        var ceil = id === 1 ? 16 : 12;
        var buffer = new Buffer_1.default();
        var sampleCount = Buffer_1.default.writeUint32(data.samples.length);
        // mdat-header 8
        // moof-header 8
        // mfhd 16
        // traf-header 8
        // thhd 16
        // tfdt 20
        // trun-header 12
        // sampleCount 4
        // data-offset 4
        // samples.length
        var offset = Buffer_1.default.writeUint32(8 + 8 + 16 + 8 + 16 + 20 + 12 + 4 + 4 + ceil * data.samples.length + sdtpLength);
        buffer.write(FMP4.size(20 + ceil * data.samples.length), FMP4.type('trun'), FMP4.extension(0, data.flags), sampleCount, offset);
        data.samples.forEach(function (item) {
            buffer.write(Buffer_1.default.writeUint32(item.duration));
            buffer.write(Buffer_1.default.writeUint32(item.size));
            if (id === 1) {
                buffer.write(Buffer_1.default.writeUint32(item.key ? 0x02000000 : 0x01010000));
                buffer.write(Buffer_1.default.writeUint32(item.offset));
            }
            else {
                buffer.write(Buffer_1.default.writeUint32(0x1000000));
            }
        });
        return buffer.buffer;
    };
    FMP4.traf = function (data) {
        var buffer = new Buffer_1.default();
        var size = 8;
        var tfhd = FMP4.tfhd(data.id);
        var tfdt = FMP4.tfdt(data.time);
        var sdtp = FMP4.sdtp(data);
        var trun = FMP4.trun(data, sdtp.byteLength);
        [tfhd, tfdt, sdtp, trun].forEach(function (item) {
            size += item.byteLength;
        });
        buffer.write(FMP4.size(size), FMP4.type('traf'), tfhd, tfdt, sdtp, trun);
        return buffer.buffer;
    };
    FMP4.moof = function (data) {
        var buffer = new Buffer_1.default();
        var size = 8;
        var mfhd = FMP4.mfhd();
        var traf = FMP4.traf(data);
        [mfhd, traf].forEach(function (item) {
            size += item.byteLength;
        });
        buffer.write(FMP4.size(size), FMP4.type('moof'), mfhd, traf);
        return buffer.buffer;
    };
    FMP4.mdat = function (data) {
        var buffer = new Buffer_1.default();
        var size = 8;
        data.samples.forEach(function (item) {
            size += item.size;
        });
        buffer.write(FMP4.size(size), FMP4.type('mdat'));
        data.samples.forEach(function (item) {
            buffer.write(item.buffer);
        });
        return buffer.buffer;
    };
    FMP4.ftyp = function () {
        var buffer = new Buffer_1.default();
        buffer.write(FMP4.size(24), FMP4.type('ftyp'), new Uint8Array([
            0x69, 0x73, 0x6F, 0x6D,
            0x0, 0x0, 0x00, 0x01,
            0x69, 0x73, 0x6F, 0x6D,
            0x61, 0x76, 0x63, 0x31 // avc1
        ]));
        return buffer.buffer;
    };
    FMP4.mvhd = function (duration, timescale) {
        var buffer = new Buffer_1.default();
        duration *= timescale;
        var upperWordDuration = Math.floor(duration / (UINT32_MAX + 1));
        var lowerWordDuration = Math.floor(duration % (UINT32_MAX + 1));
        var bytes = new Uint8Array([
            0x01,
            0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02,
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x03,
            (timescale >> 24) & 0xff,
            (timescale >> 16) & 0xff,
            (timescale >> 8) & 0xff,
            timescale & 0xff,
            (upperWordDuration >> 24),
            (upperWordDuration >> 16) & 0xff,
            (upperWordDuration >> 8) & 0xff,
            upperWordDuration & 0xff,
            (lowerWordDuration >> 24),
            (lowerWordDuration >> 16) & 0xff,
            (lowerWordDuration >> 8) & 0xff,
            lowerWordDuration & 0xff,
            0x00, 0x01, 0x00, 0x00,
            0x01, 0x00,
            0x00, 0x00,
            0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00,
            0x00, 0x01, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00,
            0x00, 0x01, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00,
            0x40, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00,
            0xff, 0xff, 0xff, 0xff // next_track_ID
        ]);
        buffer.write(FMP4.size(8 + bytes.length), FMP4.type('mvhd'), new Uint8Array(bytes));
        return buffer.buffer;
    };
    FMP4.tkhd = function (data) {
        var buffer = new Buffer_1.default();
        var id = data.id;
        var duration = data.duration * data.timeScale;
        var width = data.width;
        var height = data.height;
        var type = data.type;
        var upperWordDuration = Math.floor(duration / (UINT32_MAX + 1));
        var lowerWordDuration = Math.floor(duration % (UINT32_MAX + 1));
        var content = new Uint8Array([
            0x01,
            0x00, 0x00, 0x07,
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02,
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x03,
            (id >> 24) & 0xff,
            (id >> 16) & 0xff,
            (id >> 8) & 0xff,
            id & 0xff,
            0x00, 0x00, 0x00, 0x00,
            (upperWordDuration >> 24),
            (upperWordDuration >> 16) & 0xff,
            (upperWordDuration >> 8) & 0xff,
            upperWordDuration & 0xff,
            (lowerWordDuration >> 24),
            (lowerWordDuration >> 16) & 0xff,
            (lowerWordDuration >> 8) & 0xff,
            lowerWordDuration & 0xff,
            0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00,
            0x00, 0x00,
            0x00, type === 'video' ? 0x01 : 0x00,
            type === 'audio' ? 0x01 : 0x00, 0x00,
            0x00, 0x00,
            0x00, 0x01, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00,
            0x00, 0x01, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00,
            0x40, 0x00, 0x00, 0x00,
            (width >> 8) & 0xff,
            width & 0xff,
            0x00, 0x00,
            (height >> 8) & 0xff,
            height & 0xff,
            0x00, 0x00 // height
        ]);
        buffer.write(FMP4.size(8 + content.byteLength), FMP4.type('tkhd'), content);
        return buffer.buffer;
    };
    FMP4.mdhd = function (timescale, duration) {
        if (duration === void 0) { duration = 0; }
        var buffer = new Buffer_1.default();
        duration *= timescale;
        var upperWordDuration = Math.floor(duration / (UINT32_MAX + 1));
        var lowerWordDuration = Math.floor(duration % (UINT32_MAX + 1));
        var content = new Uint8Array([
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02,
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x03,
            (timescale >> 24) & 0xff,
            (timescale >> 16) & 0xff,
            (timescale >> 8) & 0xff,
            timescale & 0xff,
            (upperWordDuration >> 24),
            (upperWordDuration >> 16) & 0xff,
            (upperWordDuration >> 8) & 0xff,
            upperWordDuration & 0xff,
            (lowerWordDuration >> 24),
            (lowerWordDuration >> 16) & 0xff,
            (lowerWordDuration >> 8) & 0xff,
            lowerWordDuration & 0xff,
            0x55, 0xc4,
            0x00, 0x00
        ]);
        buffer.write(FMP4.size(12 + content.byteLength), FMP4.type('mdhd'), FMP4.extension(1, 0), content);
        return buffer.buffer;
    };
    FMP4.hdlr = function (type) {
        var buffer = new Buffer_1.default();
        var value = [
            0x00,
            0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00,
            0x76, 0x69, 0x64, 0x65,
            0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00,
            0x56, 0x69, 0x64, 0x65,
            0x6f, 0x48, 0x61, 0x6e,
            0x64, 0x6c, 0x65, 0x72, 0x00 // name: 'VideoHandler'
        ];
        if (type === 'audio') {
            value.splice.apply(value, __spreadArrays([8, 4], [0x73, 0x6f, 0x75, 0x6e]));
            value.splice.apply(value, __spreadArrays([24, 13], [0x53, 0x6f, 0x75, 0x6e,
                0x64, 0x48, 0x61, 0x6e,
                0x64, 0x6c, 0x65, 0x72, 0x00]));
        }
        buffer.write(FMP4.size(8 + value.length), FMP4.type('hdlr'), new Uint8Array(value));
        return buffer.buffer;
    };
    FMP4.vmhd = function () {
        var buffer = new Buffer_1.default();
        buffer.write(FMP4.size(20), FMP4.type('vmhd'), new Uint8Array([
            0x00,
            0x00, 0x00, 0x01,
            0x00, 0x00,
            0x00, 0x00,
            0x00, 0x00,
            0x00, 0x00 // opcolor
        ]));
        return buffer.buffer;
    };
    FMP4.smhd = function () {
        var buffer = new Buffer_1.default();
        buffer.write(FMP4.size(16), FMP4.type('smhd'), new Uint8Array([
            0x00,
            0x00, 0x00, 0x00,
            0x00, 0x00,
            0x00, 0x00 // reserved
        ]));
        return buffer.buffer;
    };
    FMP4.dinf = function () {
        var buffer = new Buffer_1.default();
        var dref = [0x00,
            0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x01,
            0x00, 0x00, 0x00, 0x0c,
            0x75, 0x72, 0x6c, 0x20,
            0x00,
            0x00, 0x00, 0x01 // entry_flags
        ];
        buffer.write(FMP4.size(36), FMP4.type('dinf'), FMP4.size(28), FMP4.type('dref'), new Uint8Array(dref));
        return buffer.buffer;
    };
    FMP4.esds = function (config) {
        if (config === void 0) { config = [43, 146, 8, 0]; }
        var configlen = config.length;
        var buffer = new Buffer_1.default();
        var content = new Uint8Array([
            0x00,
            0x00, 0x00, 0x00,
            0x03,
            0x17 + configlen,
            0x00, 0x01,
            0x00,
            0x04,
            0x0f + configlen,
            0x40,
            0x15,
            0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00,
            0x05 // descriptor_type
        ].concat([configlen]).concat(config).concat([0x06, 0x01, 0x02]));
        buffer.write(FMP4.size(8 + content.byteLength), FMP4.type('esds'), content);
        return buffer.buffer;
    };
    FMP4.mp4a = function (data) {
        var buffer = new Buffer_1.default();
        var content = new Uint8Array([
            0x00, 0x00, 0x00,
            0x00, 0x00, 0x00,
            0x00, 0x01,
            0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00,
            0x00, data.channelCount,
            0x00, 0x10,
            0x00, 0x00, 0x00, 0x00,
            (data.samplerate >> 8) & 0xff,
            data.samplerate & 0xff,
            0x00, 0x00
        ]);
        var esds = FMP4.esds(data.audioConfig);
        buffer.write(FMP4.size(8 + content.byteLength + esds.byteLength), FMP4.type('mp4a'), content, esds);
        return buffer.buffer;
    };
    FMP4.avc1 = function (data) {
        var buffer = new Buffer_1.default();
        var size = 40; // 8(avc1)+8(avcc)+8(btrt)+16(pasp)
        var sps = data.sps;
        var pps = data.pps;
        var width = data.width;
        var height = data.height;
        var hSpacing = data.pixelRatio[0];
        var vSpacing = data.pixelRatio[1];
        var avcc = new Uint8Array([
            0x01,
            sps[1],
            sps[2],
            sps[3],
            0xfc | 3,
            0xE0 | 1 // 目前只处理一个sps
        ].concat([sps.length >>> 8 & 0xff, sps.length & 0xff]).concat(sps).concat(1).concat([pps.length >>> 8 & 0xff, pps.length & 0xff]).concat(pps));
        var avc1 = new Uint8Array([
            0x00, 0x00, 0x00,
            0x00, 0x00, 0x00,
            0x00, 0x01,
            0x00, 0x00,
            0x00, 0x00,
            0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00,
            (width >> 8) & 0xff,
            width & 0xff,
            (height >> 8) & 0xff,
            height & 0xff,
            0x00, 0x48, 0x00, 0x00,
            0x00, 0x48, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00,
            0x00, 0x01,
            0x12,
            0x64, 0x61, 0x69, 0x6C,
            0x79, 0x6D, 0x6F, 0x74,
            0x69, 0x6F, 0x6E, 0x2F,
            0x68, 0x6C, 0x73, 0x2E,
            0x6A, 0x73, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00,
            0x00, 0x18,
            0x11, 0x11
        ]); // pre_defined = -1
        var btrt = new Uint8Array([
            0x00, 0x1c, 0x9c, 0x80,
            0x00, 0x2d, 0xc6, 0xc0,
            0x00, 0x2d, 0xc6, 0xc0 // avgBitrate
        ]);
        var pasp = new Uint8Array([
            (hSpacing >> 24),
            (hSpacing >> 16) & 0xff,
            (hSpacing >> 8) & 0xff,
            hSpacing & 0xff,
            (vSpacing >> 24),
            (vSpacing >> 16) & 0xff,
            (vSpacing >> 8) & 0xff,
            vSpacing & 0xff
        ]);
        buffer.write(FMP4.size(size + avc1.byteLength + avcc.byteLength + btrt.byteLength), FMP4.type('avc1'), avc1, FMP4.size(8 + avcc.byteLength), FMP4.type('avcC'), avcc, FMP4.size(20), FMP4.type('btrt'), btrt, FMP4.size(16), FMP4.type('pasp'), pasp);
        return buffer.buffer;
    };
    FMP4.stsd = function (data) {
        var buffer = new Buffer_1.default();
        var content;
        if (data.type === 'audio') {
            // if (!data.isAAC && data.codec === 'mp4') {
            //     content = FMP4.mp3(data);
            // } else {
            //
            // }
            // 支持mp4a
            content = FMP4.mp4a(data);
        }
        else {
            content = FMP4.avc1(data);
        }
        buffer.write(FMP4.size(16 + content.byteLength), FMP4.type('stsd'), FMP4.extension(0, 0), new Uint8Array([0x00, 0x00, 0x00, 0x01]), content);
        return buffer.buffer;
    };
    FMP4.stts = function () {
        var buffer = new Buffer_1.default();
        var content = new Uint8Array([
            0x00,
            0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00 // entry_count
        ]);
        buffer.write(FMP4.size(16), FMP4.type('stts'), content);
        return buffer.buffer;
    };
    ;
    FMP4.stsc = function () {
        var buffer = new Buffer_1.default();
        var content = new Uint8Array([
            0x00,
            0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00 // entry_count
        ]);
        buffer.write(FMP4.size(16), FMP4.type('stsc'), content);
        return buffer.buffer;
    };
    ;
    FMP4.stsz = function () {
        var buffer = new Buffer_1.default();
        var content = new Uint8Array([
            0x00,
            0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00 // sample_count
        ]);
        buffer.write(FMP4.size(20), FMP4.type('stsz'), content);
        return buffer.buffer;
    };
    ;
    FMP4.stco = function () {
        var buffer = new Buffer_1.default();
        var content = new Uint8Array([
            0x00,
            0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00 // entry_count
        ]);
        buffer.write(FMP4.size(16), FMP4.type('stco'), content);
        return buffer.buffer;
    };
    ;
    FMP4.stbl = function (data) {
        var buffer = new Buffer_1.default();
        var size = 8;
        var stsd = FMP4.stsd(data);
        var stts = FMP4.stts();
        var stsc = FMP4.stsc();
        var stsz = FMP4.stsz();
        var stco = FMP4.stco();
        [stsd, stts, stsc, stsz, stco].forEach(function (item) {
            size += item.byteLength;
        });
        buffer.write(FMP4.size(size), FMP4.type('stbl'), stsd, stts, stsc, stsz, stco);
        return buffer.buffer;
    };
    FMP4.minf = function (data) {
        var buffer = new Buffer_1.default();
        var size = 8;
        var vmhd = data.type === 'video' ? FMP4.vmhd() : FMP4.smhd();
        var dinf = FMP4.dinf();
        var stbl = FMP4.stbl(data);
        [vmhd, dinf, stbl].forEach(function (item) {
            size += item.byteLength;
        });
        buffer.write(FMP4.size(size), FMP4.type('minf'), vmhd, dinf, stbl);
        return buffer.buffer;
    };
    FMP4.mdia = function (data) {
        var buffer = new Buffer_1.default();
        var size = 8;
        var mdhd = FMP4.mdhd(data.timescale);
        var hdlr = FMP4.hdlr(data.type);
        var minf = FMP4.minf(data);
        [mdhd, hdlr, minf].forEach(function (item) {
            size += item.byteLength;
        });
        buffer.write(FMP4.size(size), FMP4.type('mdia'), mdhd, hdlr, minf);
        return buffer.buffer;
    };
    FMP4.videoTrak = function (data) {
        var buffer = new Buffer_1.default();
        var size = 8;
        var tkhd = FMP4.tkhd({
            id: 1,
            duration: data.videoDuration || 0xffffffff,
            timescale: data.videoTimeScale || 90000,
            width: data.width,
            height: data.height,
            type: 'video'
        });
        var mdia = FMP4.mdia({
            type: 'video',
            timescale: data.videoTimeScale || 90000,
            duration: data.videoDuration || 0xffffffff,
            sps: data.sps,
            pps: data.pps,
            pixelRatio: data.pixelRatio,
            width: data.width,
            height: data.height
        });
        [tkhd, mdia].forEach(function (item) {
            size += item.byteLength;
        });
        buffer.write(FMP4.size(size), FMP4.type('trak'), tkhd, mdia);
        return buffer.buffer;
    };
    FMP4.audioTrak = function (data) {
        var buffer = new Buffer_1.default();
        var size = 8;
        var tkhd = FMP4.tkhd({
            id: 2,
            duration: data.audioDuration || 0,
            timescale: data.audioTimeScale || 90000,
            width: 0,
            height: 0,
            type: 'audio'
        });
        var mdia = FMP4.mdia({
            type: 'audio',
            timescale: data.audioTimeScale || 90000,
            duration: data.audioDuration || 0,
            channelCount: data.channelCount,
            samplerate: data.sampleRate || 90000,
            audioConfig: data.audioConfig
        });
        [tkhd, mdia].forEach(function (item) {
            size += item.byteLength;
        });
        buffer.write(FMP4.size(size), FMP4.type('trak'), tkhd, mdia);
        return buffer.buffer;
    };
    FMP4.trex = function (id) {
        var buffer = new Buffer_1.default();
        var content = new Uint8Array([
            0x00,
            0x00, 0x00, 0x00,
            (id >> 24),
            (id >> 16) & 0xff,
            (id >> 8) & 0xff,
            (id & 0xff),
            0x00, 0x00, 0x00, 0x01,
            0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00,
            0x00, 0x01, 0x00, 0x01 // default_sample_flags
        ]);
        buffer.write(FMP4.size(8 + content.byteLength), FMP4.type('trex'), content);
        return buffer.buffer;
    };
    FMP4.mvex = function (duration, timeScale) {
        var buffer = new Buffer_1.default();
        var mehd = Buffer_1.default.writeUint32(duration * timeScale);
        buffer.write(FMP4.size(88), FMP4.type('mvex'), FMP4.size(16), FMP4.type('mehd'), FMP4.extension(0, 0), mehd, FMP4.trex(1), FMP4.trex(2));
        return buffer.buffer;
    };
    FMP4.moov = function (data) {
        var buffer = new Buffer_1.default;
        var size = 8;
        var videoOnly = data.videoOnly;
        var _timeScale = data.timeScale || 90000;
        var mvhd = FMP4.mvhd(data.duration, _timeScale);
        var trak1 = FMP4.videoTrak(data);
        var trak2 = FMP4.audioTrak(data);
        var mvex = FMP4.mvex(data.duration, _timeScale);
        var tempBoxList = videoOnly ? [mvhd, trak1, mvex] : [mvhd, trak1, trak2, mvex];
        tempBoxList.forEach(function (item) {
            size += item.byteLength;
        });
        buffer.write(FMP4.size(size), FMP4.type('moov'), mvhd, trak1);
        if (!videoOnly)
            buffer.write(trak2);
        buffer.write(mvex);
        return buffer.buffer;
    };
    return FMP4;
}());
exports.default = FMP4;


/***/ }),

/***/ "./src/core/vkd/FMP4Worker.ts":
/*!************************************!*\
  !*** ./src/core/vkd/FMP4Worker.ts ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 碎片化MP4组装worker
 */
var InlineWorker_1 = __webpack_require__(/*! ./InlineWorker */ "./src/core/vkd/InlineWorker.ts");
var RuntimeLog_1 = __webpack_require__(/*! ../../log/RuntimeLog */ "./src/log/RuntimeLog.ts");
var _instance;
var FMP4Worker = /** @class */ (function () {
    function FMP4Worker(sign) {
        this._worker = null;
        if (sign !== PrivateClass)
            throw new Error('class FMP4Worker is singleton, do not use new operator!');
        RuntimeLog_1.default.getInstance().log("FMP4 worker is loading...");
        this.createWorker();
        RuntimeLog_1.default.getInstance().log("FMP4 worker is loaded");
    }
    Object.defineProperty(FMP4Worker.prototype, "worker", {
        get: function () {
            return this._worker;
        },
        enumerable: true,
        configurable: true
    });
    FMP4Worker.getInstance = function () {
        if (!_instance) {
            _instance = new FMP4Worker(PrivateClass);
        }
        return _instance;
    };
    /**
     * 创建worker
     */
    FMP4Worker.prototype.createWorker = function () {
        this._worker = new InlineWorker_1.default(function () {
            var UINT32_MAX = Math.pow(2, 32) - 1;
            var _self = this;
            var sequence = 1;
            var handleQueue = [];
            var handling = false;
            var methodMap = {
                'initSegment': function (params) {
                    var moovMetaData = params.meta;
                    var _buffer = new Buffer();
                    _buffer.write(ftyp());
                    _buffer.write(moov(moovMetaData));
                    _self.postMessage({
                        method: 'initSegment',
                        params: _buffer.buffer
                    });
                    handling = false;
                    checkNextHandle();
                },
                'mediaSegment': function (params) {
                    var resBuffers = [];
                    var _video_samples = params.samples[0];
                    var _audio_samples = params.samples[1];
                    var start = params.start;
                    var mdatData = params.mdatData;
                    var video_samples = _video_samples.map(function (item, idx) {
                        return {
                            size: item.size,
                            duration: item.time.duration,
                            offset: item.time.offset,
                            buffer: new Uint8Array(mdatData.slice(item.offset - start, item.offset - start + item.size)),
                            key: idx === 0
                        };
                    });
                    var audio_samples = _audio_samples.map(function (item, idx) {
                        return {
                            size: item.size,
                            duration: item.time.duration,
                            offset: item.time.offset,
                            buffer: new Uint8Array(mdatData.slice(item.offset - start, item.offset - start + item.size)),
                            key: idx === 0
                        };
                    });
                    resBuffers.push(addFragment({
                        id: 1,
                        time: _video_samples[0].time.time,
                        firstFlags: 0x2000000,
                        flags: 0xf01,
                        samples: video_samples
                    }));
                    audio_samples.length && resBuffers.push(addFragment({
                        id: 2,
                        time: (_audio_samples[0] && _audio_samples[0].time && _audio_samples[0].time.time) || 0,
                        firstFlags: 0x00,
                        flags: 0x701,
                        samples: audio_samples
                    }));
                    var bufferSize = 0;
                    resBuffers.every(function (item) {
                        bufferSize += item.byteLength;
                        return true;
                    });
                    var buffer = new Uint8Array(bufferSize);
                    var offset = 0;
                    resBuffers.every(function (item) {
                        buffer.set(item, offset);
                        offset += item.byteLength;
                        return true;
                    });
                    _self.postMessage({
                        method: 'mediaSegment',
                        params: buffer
                    });
                    handling = false;
                    checkNextHandle();
                },
            };
            _self.onmessage = function (e) {
                handleQueue.push(e.data);
                checkNextHandle();
            };
            function checkNextHandle() {
                if (!handleQueue.length || handling)
                    return;
                handling = true;
                var _dataObj = handleQueue.shift();
                var _method = _dataObj.method;
                var _params = _dataObj.params;
                methodMap[_method](_params);
            }
            function addFragment(data) {
                var buffer = new Buffer();
                buffer.write(moof(data));
                buffer.write(mdat(data));
                return buffer.buffer;
            }
            /**
             * FMP4
             */
            function size(value) {
                return Buffer.writeUint32(value);
            }
            function type(name) {
                return new Uint8Array([name.charCodeAt(0), name.charCodeAt(1), name.charCodeAt(2), name.charCodeAt(3)]);
            }
            function extension(version, flag) {
                return new Uint8Array([
                    version,
                    (flag >> 16) & 0xff,
                    (flag >> 8) & 0xff,
                    flag & 0xff
                ]);
            }
            function ftyp() {
                var buffer = new Buffer();
                buffer.write(size(24), type('ftyp'), new Uint8Array([
                    0x69, 0x73, 0x6F, 0x6D,
                    0x0, 0x0, 0x00, 0x01,
                    0x69, 0x73, 0x6F, 0x6D,
                    0x61, 0x76, 0x63, 0x31 // avc1
                ]));
                return buffer.buffer;
            }
            function mvhd(duration, timescale) {
                var buffer = new Buffer();
                duration *= timescale;
                var upperWordDuration = Math.floor(duration / (UINT32_MAX + 1));
                var lowerWordDuration = Math.floor(duration % (UINT32_MAX + 1));
                var bytes = new Uint8Array([
                    0x01,
                    0x00, 0x00, 0x00,
                    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02,
                    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x03,
                    (timescale >> 24) & 0xff,
                    (timescale >> 16) & 0xff,
                    (timescale >> 8) & 0xff,
                    timescale & 0xff,
                    (upperWordDuration >> 24),
                    (upperWordDuration >> 16) & 0xff,
                    (upperWordDuration >> 8) & 0xff,
                    upperWordDuration & 0xff,
                    (lowerWordDuration >> 24),
                    (lowerWordDuration >> 16) & 0xff,
                    (lowerWordDuration >> 8) & 0xff,
                    lowerWordDuration & 0xff,
                    0x00, 0x01, 0x00, 0x00,
                    0x01, 0x00,
                    0x00, 0x00,
                    0x00, 0x00, 0x00, 0x00,
                    0x00, 0x00, 0x00, 0x00,
                    0x00, 0x01, 0x00, 0x00,
                    0x00, 0x00, 0x00, 0x00,
                    0x00, 0x00, 0x00, 0x00,
                    0x00, 0x00, 0x00, 0x00,
                    0x00, 0x01, 0x00, 0x00,
                    0x00, 0x00, 0x00, 0x00,
                    0x00, 0x00, 0x00, 0x00,
                    0x00, 0x00, 0x00, 0x00,
                    0x40, 0x00, 0x00, 0x00,
                    0x00, 0x00, 0x00, 0x00,
                    0x00, 0x00, 0x00, 0x00,
                    0x00, 0x00, 0x00, 0x00,
                    0x00, 0x00, 0x00, 0x00,
                    0x00, 0x00, 0x00, 0x00,
                    0x00, 0x00, 0x00, 0x00,
                    0xff, 0xff, 0xff, 0xff // next_track_ID
                ]);
                buffer.write(size(8 + bytes.length), type('mvhd'), new Uint8Array(bytes));
                return buffer.buffer;
            }
            function tkhd(data) {
                var buffer = new Buffer();
                var id = data.id;
                var duration = data.duration * data.timeScale;
                var width = data.width;
                var height = data.height;
                var _type = data.type;
                var upperWordDuration = Math.floor(duration / (UINT32_MAX + 1));
                var lowerWordDuration = Math.floor(duration % (UINT32_MAX + 1));
                var content = new Uint8Array([
                    0x01,
                    0x00, 0x00, 0x07,
                    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02,
                    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x03,
                    (id >> 24) & 0xff,
                    (id >> 16) & 0xff,
                    (id >> 8) & 0xff,
                    id & 0xff,
                    0x00, 0x00, 0x00, 0x00,
                    (upperWordDuration >> 24),
                    (upperWordDuration >> 16) & 0xff,
                    (upperWordDuration >> 8) & 0xff,
                    upperWordDuration & 0xff,
                    (lowerWordDuration >> 24),
                    (lowerWordDuration >> 16) & 0xff,
                    (lowerWordDuration >> 8) & 0xff,
                    lowerWordDuration & 0xff,
                    0x00, 0x00, 0x00, 0x00,
                    0x00, 0x00, 0x00, 0x00,
                    0x00, 0x00,
                    0x00, _type === 'video' ? 0x01 : 0x00,
                    _type === 'audio' ? 0x01 : 0x00, 0x00,
                    0x00, 0x00,
                    0x00, 0x01, 0x00, 0x00,
                    0x00, 0x00, 0x00, 0x00,
                    0x00, 0x00, 0x00, 0x00,
                    0x00, 0x00, 0x00, 0x00,
                    0x00, 0x01, 0x00, 0x00,
                    0x00, 0x00, 0x00, 0x00,
                    0x00, 0x00, 0x00, 0x00,
                    0x00, 0x00, 0x00, 0x00,
                    0x40, 0x00, 0x00, 0x00,
                    (width >> 8) & 0xff,
                    width & 0xff,
                    0x00, 0x00,
                    (height >> 8) & 0xff,
                    height & 0xff,
                    0x00, 0x00 // height
                ]);
                buffer.write(size(8 + content.byteLength), type('tkhd'), content);
                return buffer.buffer;
            }
            function mdhd(timescale, duration) {
                if (duration === void 0) { duration = 0; }
                var buffer = new Buffer();
                duration *= timescale;
                var upperWordDuration = Math.floor(duration / (UINT32_MAX + 1));
                var lowerWordDuration = Math.floor(duration % (UINT32_MAX + 1));
                var content = new Uint8Array([
                    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02,
                    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x03,
                    (timescale >> 24) & 0xff,
                    (timescale >> 16) & 0xff,
                    (timescale >> 8) & 0xff,
                    timescale & 0xff,
                    (upperWordDuration >> 24),
                    (upperWordDuration >> 16) & 0xff,
                    (upperWordDuration >> 8) & 0xff,
                    upperWordDuration & 0xff,
                    (lowerWordDuration >> 24),
                    (lowerWordDuration >> 16) & 0xff,
                    (lowerWordDuration >> 8) & 0xff,
                    lowerWordDuration & 0xff,
                    0x55, 0xc4,
                    0x00, 0x00
                ]);
                buffer.write(size(12 + content.byteLength), type('mdhd'), extension(1, 0), content);
                return buffer.buffer;
            }
            function hdlr(_type) {
                var buffer = new Buffer();
                var value = [
                    0x00,
                    0x00, 0x00, 0x00,
                    0x00, 0x00, 0x00, 0x00,
                    0x76, 0x69, 0x64, 0x65,
                    0x00, 0x00, 0x00, 0x00,
                    0x00, 0x00, 0x00, 0x00,
                    0x00, 0x00, 0x00, 0x00,
                    0x56, 0x69, 0x64, 0x65,
                    0x6f, 0x48, 0x61, 0x6e,
                    0x64, 0x6c, 0x65, 0x72, 0x00 // name: 'VideoHandler'
                ];
                if (_type === 'audio') {
                    value.splice(8, 4, 0x73, 0x6f, 0x75, 0x6e);
                    value.splice(24, 13, 0x53, 0x6f, 0x75, 0x6e, 0x64, 0x48, 0x61, 0x6e, 0x64, 0x6c, 0x65, 0x72, 0x00);
                }
                buffer.write(size(8 + value.length), type('hdlr'), new Uint8Array(value));
                return buffer.buffer;
            }
            function vmhd() {
                var buffer = new Buffer();
                buffer.write(size(20), type('vmhd'), new Uint8Array([
                    0x00,
                    0x00, 0x00, 0x01,
                    0x00, 0x00,
                    0x00, 0x00,
                    0x00, 0x00,
                    0x00, 0x00 // opcolor
                ]));
                return buffer.buffer;
            }
            function smhd() {
                var buffer = new Buffer();
                buffer.write(size(16), type('smhd'), new Uint8Array([
                    0x00,
                    0x00, 0x00, 0x00,
                    0x00, 0x00,
                    0x00, 0x00 // reserved
                ]));
                return buffer.buffer;
            }
            function dinf() {
                var buffer = new Buffer();
                var dref = [0x00,
                    0x00, 0x00, 0x00,
                    0x00, 0x00, 0x00, 0x01,
                    0x00, 0x00, 0x00, 0x0c,
                    0x75, 0x72, 0x6c, 0x20,
                    0x00,
                    0x00, 0x00, 0x01 // entry_flags
                ];
                buffer.write(size(36), type('dinf'), size(28), type('dref'), new Uint8Array(dref));
                return buffer.buffer;
            }
            function esds(config) {
                if (config === void 0) { config = [43, 146, 8, 0]; }
                var configlen = config.length;
                var buffer = new Buffer();
                var content = new Uint8Array([
                    0x00,
                    0x00, 0x00, 0x00,
                    0x03,
                    0x17 + configlen,
                    0x00, 0x01,
                    0x00,
                    0x04,
                    0x0f + configlen,
                    0x40,
                    0x15,
                    0x00, 0x00, 0x00,
                    0x00, 0x00, 0x00, 0x00,
                    0x00, 0x00, 0x00, 0x00,
                    0x05 // descriptor_type
                ].concat([configlen]).concat(config).concat([0x06, 0x01, 0x02]));
                buffer.write(size(8 + content.byteLength), type('esds'), content);
                return buffer.buffer;
            }
            function mp4a(data) {
                var buffer = new Buffer();
                var content = new Uint8Array([
                    0x00, 0x00, 0x00,
                    0x00, 0x00, 0x00,
                    0x00, 0x01,
                    0x00, 0x00, 0x00, 0x00,
                    0x00, 0x00, 0x00, 0x00,
                    0x00, data.channelCount,
                    0x00, 0x10,
                    0x00, 0x00, 0x00, 0x00,
                    (data.samplerate >> 8) & 0xff,
                    data.samplerate & 0xff,
                    0x00, 0x00
                ]);
                var _esds = esds(data.audioConfig);
                buffer.write(size(8 + content.byteLength + _esds.byteLength), type('mp4a'), content, _esds);
                return buffer.buffer;
            }
            function avc1(data) {
                var buffer = new Buffer();
                var _size = 40; // 8(avc1)+8(avcc)+8(btrt)+16(pasp)
                var sps = data.sps;
                var pps = data.pps;
                var width = data.width;
                var height = data.height;
                var hSpacing = data.pixelRatio[0];
                var vSpacing = data.pixelRatio[1];
                var avcc = new Uint8Array([
                    0x01,
                    sps[1],
                    sps[2],
                    sps[3],
                    0xfc | 3,
                    0xE0 | 1 // 目前只处理一个sps
                ].concat([sps.length >>> 8 & 0xff, sps.length & 0xff]).concat(sps).concat(1).concat([pps.length >>> 8 & 0xff, pps.length & 0xff]).concat(pps));
                var avc1 = new Uint8Array([
                    0x00, 0x00, 0x00,
                    0x00, 0x00, 0x00,
                    0x00, 0x01,
                    0x00, 0x00,
                    0x00, 0x00,
                    0x00, 0x00, 0x00, 0x00,
                    0x00, 0x00, 0x00, 0x00,
                    0x00, 0x00, 0x00, 0x00,
                    (width >> 8) & 0xff,
                    width & 0xff,
                    (height >> 8) & 0xff,
                    height & 0xff,
                    0x00, 0x48, 0x00, 0x00,
                    0x00, 0x48, 0x00, 0x00,
                    0x00, 0x00, 0x00, 0x00,
                    0x00, 0x01,
                    0x12,
                    0x64, 0x61, 0x69, 0x6C,
                    0x79, 0x6D, 0x6F, 0x74,
                    0x69, 0x6F, 0x6E, 0x2F,
                    0x68, 0x6C, 0x73, 0x2E,
                    0x6A, 0x73, 0x00, 0x00,
                    0x00, 0x00, 0x00, 0x00,
                    0x00, 0x00, 0x00, 0x00,
                    0x00, 0x00, 0x00,
                    0x00, 0x18,
                    0x11, 0x11
                ]); // pre_defined = -1
                var btrt = new Uint8Array([
                    0x00, 0x1c, 0x9c, 0x80,
                    0x00, 0x2d, 0xc6, 0xc0,
                    0x00, 0x2d, 0xc6, 0xc0 // avgBitrate
                ]);
                var pasp = new Uint8Array([
                    (hSpacing >> 24),
                    (hSpacing >> 16) & 0xff,
                    (hSpacing >> 8) & 0xff,
                    hSpacing & 0xff,
                    (vSpacing >> 24),
                    (vSpacing >> 16) & 0xff,
                    (vSpacing >> 8) & 0xff,
                    vSpacing & 0xff
                ]);
                buffer.write(size(_size + avc1.byteLength + avcc.byteLength + btrt.byteLength), type('avc1'), avc1, size(8 + avcc.byteLength), type('avcC'), avcc, size(20), type('btrt'), btrt, size(16), type('pasp'), pasp);
                return buffer.buffer;
            }
            function stsd(data) {
                var buffer = new Buffer();
                var content;
                if (data.type === 'audio') {
                    // if (!data.isAAC && data.codec === 'mp4') {
                    //     content = FMP4.mp3(data);
                    // } else {
                    //
                    // }
                    // 支持mp4a
                    content = mp4a(data);
                }
                else {
                    content = avc1(data);
                }
                buffer.write(size(16 + content.byteLength), type('stsd'), extension(0, 0), new Uint8Array([0x00, 0x00, 0x00, 0x01]), content);
                return buffer.buffer;
            }
            function stts() {
                var buffer = new Buffer();
                var content = new Uint8Array([
                    0x00,
                    0x00, 0x00, 0x00,
                    0x00, 0x00, 0x00, 0x00 // entry_count
                ]);
                buffer.write(size(16), type('stts'), content);
                return buffer.buffer;
            }
            ;
            function stsc() {
                var buffer = new Buffer();
                var content = new Uint8Array([
                    0x00,
                    0x00, 0x00, 0x00,
                    0x00, 0x00, 0x00, 0x00 // entry_count
                ]);
                buffer.write(size(16), type('stsc'), content);
                return buffer.buffer;
            }
            ;
            function stsz() {
                var buffer = new Buffer();
                var content = new Uint8Array([
                    0x00,
                    0x00, 0x00, 0x00,
                    0x00, 0x00, 0x00, 0x00,
                    0x00, 0x00, 0x00, 0x00 // sample_count
                ]);
                buffer.write(size(20), type('stsz'), content);
                return buffer.buffer;
            }
            ;
            function stco() {
                var buffer = new Buffer();
                var content = new Uint8Array([
                    0x00,
                    0x00, 0x00, 0x00,
                    0x00, 0x00, 0x00, 0x00 // entry_count
                ]);
                buffer.write(size(16), type('stco'), content);
                return buffer.buffer;
            }
            ;
            function stbl(data) {
                var buffer = new Buffer();
                var _size = 8;
                var _stsd = stsd(data);
                var _stts = stts();
                var _stsc = stsc();
                var _stsz = stsz();
                var _stco = stco();
                [_stsd, _stts, _stsc, _stsz, _stco].forEach(function (item) {
                    _size += item.byteLength;
                });
                buffer.write(size(_size), type('stbl'), _stsd, _stts, _stsc, _stsz, _stco);
                return buffer.buffer;
            }
            function minf(data) {
                var buffer = new Buffer();
                var _size = 8;
                var _vmhd = data.type === 'video' ? vmhd() : smhd();
                var _dinf = dinf();
                var _stbl = stbl(data);
                [_vmhd, _dinf, _stbl].forEach(function (item) {
                    _size += item.byteLength;
                });
                buffer.write(size(_size), type('minf'), _vmhd, _dinf, _stbl);
                return buffer.buffer;
            }
            function mdia(data) {
                var buffer = new Buffer();
                var _size = 8;
                var _mdhd = mdhd(data.timeScale);
                var _hdlr = hdlr(data.type);
                var _minf = minf(data);
                [_mdhd, _hdlr, _minf].forEach(function (item) {
                    _size += item.byteLength;
                });
                buffer.write(size(_size), type('mdia'), _mdhd, _hdlr, _minf);
                return buffer.buffer;
            }
            function videoTrak(data) {
                var buffer = new Buffer();
                var _size = 8;
                var _tkhd = tkhd({
                    id: 1,
                    duration: data.videoDuration || 0xffffffff,
                    timesScale: data.videoTimeScale || 90000,
                    width: data.width,
                    height: data.height,
                    type: 'video'
                });
                var _mdia = mdia({
                    type: 'video',
                    timeScale: data.videoTimeScale || 90000,
                    duration: data.videoDuration || 0xffffffff,
                    sps: data.sps,
                    pps: data.pps,
                    pixelRatio: data.pixelRatio,
                    width: data.width,
                    height: data.height
                });
                [_tkhd, _mdia].forEach(function (item) {
                    _size += item.byteLength;
                });
                buffer.write(size(_size), type('trak'), _tkhd, _mdia);
                return buffer.buffer;
            }
            function audioTrak(data) {
                var buffer = new Buffer();
                var _size = 8;
                var _tkhd = tkhd({
                    id: 2,
                    duration: data.audioDuration || 0,
                    timesScale: data.audioTimeScale || 90000,
                    width: 0,
                    height: 0,
                    type: 'audio'
                });
                var _mdia = mdia({
                    type: 'audio',
                    timeScale: data.audioTimeScale || 90000,
                    duration: data.audioDuration || 0,
                    channelCount: data.channelCount,
                    samplerate: data.sampleRate || 90000,
                    audioConfig: data.audioConfig
                });
                [_tkhd, _mdia].forEach(function (item) {
                    _size += item.byteLength;
                });
                buffer.write(size(_size), type('trak'), _tkhd, _mdia);
                return buffer.buffer;
            }
            function trex(id) {
                var buffer = new Buffer();
                var content = new Uint8Array([
                    0x00,
                    0x00, 0x00, 0x00,
                    (id >> 24),
                    (id >> 16) & 0xff,
                    (id >> 8) & 0xff,
                    (id & 0xff),
                    0x00, 0x00, 0x00, 0x01,
                    0x00, 0x00, 0x00, 0x00,
                    0x00, 0x00, 0x00, 0x00,
                    0x00, 0x01, 0x00, 0x01 // default_sample_flags
                ]);
                buffer.write(size(8 + content.byteLength), type('trex'), content);
                return buffer.buffer;
            }
            function mvex(duration, timeScale) {
                var buffer = new Buffer();
                var mehd = Buffer.writeUint32(duration * timeScale);
                buffer.write(size(88), type('mvex'), size(16), type('mehd'), extension(0, 0), mehd, trex(1), trex(2));
                return buffer.buffer;
            }
            function moov(params) {
                var buffer = new Buffer;
                var _size = 8;
                var videoOnly = params.videoOnly;
                var _timeScale = params.timeScale || 90000;
                var _mvhd = mvhd(params.duration, _timeScale);
                var trak1 = videoTrak(params);
                var trak2 = audioTrak(params);
                var _mvex = mvex(params.duration, _timeScale);
                var tempBoxList = videoOnly ? [_mvhd, trak1, _mvex] : [_mvhd, trak1, trak2, _mvex];
                tempBoxList.forEach(function (item) {
                    _size += item.byteLength;
                });
                buffer.write(size(_size), type('moov'), _mvhd, trak1);
                if (!videoOnly)
                    buffer.write(trak2);
                buffer.write(_mvex);
                return buffer.buffer;
            }
            function mfhd() {
                var buffer = new Buffer();
                var content = Buffer.writeUint32(sequence);
                sequence += 1;
                buffer.write(size(16), type('mfhd'), extension(0, 0), content);
                return buffer.buffer;
            }
            function tfhd(id) {
                var buffer = new Buffer();
                var content = Buffer.writeUint32(id);
                buffer.write(size(16), type('tfhd'), extension(0, 0), content);
                return buffer.buffer;
            }
            function tfdt(time) {
                var buffer = new Buffer();
                var upper = Math.floor(time / (UINT32_MAX + 1));
                var lower = Math.floor(time % (UINT32_MAX + 1));
                buffer.write(size(20), type('tfdt'), extension(1, 0), Buffer.writeUint32(upper), Buffer.writeUint32(lower));
                return buffer.buffer;
            }
            function sdtp(data) {
                var buffer = new Buffer();
                buffer.write(size(12 + data.samples.length), type('sdtp'), extension(0, 0));
                data.samples.forEach(function (item) {
                    buffer.write(new Uint8Array(data.id === 1 ? [item.key ? 32 : 16] : [16]));
                });
                return buffer.buffer;
            }
            function trun(data, sdtpLength) {
                var id = data.id;
                var ceil = id === 1 ? 16 : 12;
                var buffer = new Buffer();
                var sampleCount = Buffer.writeUint32(data.samples.length);
                // mdat-header 8
                // moof-header 8
                // mfhd 16
                // traf-header 8
                // thhd 16
                // tfdt 20
                // trun-header 12
                // sampleCount 4
                // data-offset 4
                // samples.length
                var offset = Buffer.writeUint32(8 + 8 + 16 + 8 + 16 + 20 + 12 + 4 + 4 + ceil * data.samples.length + sdtpLength);
                buffer.write(size(20 + ceil * data.samples.length), type('trun'), extension(0, data.flags), sampleCount, offset);
                data.samples.forEach(function (item) {
                    buffer.write(Buffer.writeUint32(item.duration));
                    buffer.write(Buffer.writeUint32(item.size));
                    if (id === 1) {
                        buffer.write(Buffer.writeUint32(item.key ? 0x02000000 : 0x01010000));
                        buffer.write(Buffer.writeUint32(item.offset));
                    }
                    else {
                        buffer.write(Buffer.writeUint32(0x1000000));
                    }
                });
                return buffer.buffer;
            }
            function traf(data) {
                var buffer = new Buffer();
                var _size = 8;
                var _tfhd = tfhd(data.id);
                var _tfdt = tfdt(data.time);
                var _sdtp = sdtp(data);
                var _trun = trun(data, _sdtp.byteLength);
                [_tfhd, _tfdt, _sdtp, _trun].forEach(function (item) {
                    _size += item.byteLength;
                });
                buffer.write(size(_size), type('traf'), _tfhd, _tfdt, _sdtp, _trun);
                return buffer.buffer;
            }
            function moof(data) {
                var buffer = new Buffer();
                var _size = 8;
                var _mfhd = mfhd();
                var _traf = traf(data);
                [_mfhd, _traf].forEach(function (item) {
                    _size += item.byteLength;
                });
                buffer.write(size(_size), type('moof'), _mfhd, _traf);
                return buffer.buffer;
            }
            function mdat(data) {
                var buffer = new Buffer();
                var _size = 8;
                data.samples.forEach(function (item) {
                    _size += item.size;
                });
                buffer.write(size(_size), type('mdat'));
                data.samples.forEach(function (item) {
                    buffer.write(item.buffer);
                });
                return buffer.buffer;
            }
            /**
             * Utils
             * @param arrays
             */
            function concatUint8Array() {
                var arrays = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    arrays[_i] = arguments[_i];
                }
                var totalLength = 0;
                for (var _a = 0, arrays_1 = arrays; _a < arrays_1.length; _a++) {
                    var arr = arrays_1[_a];
                    totalLength += arr.length;
                }
                var result = new Uint8Array(totalLength);
                var offset = 0;
                for (var _b = 0, arrays_2 = arrays; _b < arrays_2.length; _b++) {
                    var arr = arrays_2[_b];
                    result.set(arr, offset);
                    offset += arr.length;
                }
                return result;
            }
            /**
             * buffer
             */
            var Buffer = /** @class */ (function () {
                function Buffer() {
                    this._buffer = new Uint8Array(0);
                }
                Object.defineProperty(Buffer.prototype, "buffer", {
                    get: function () {
                        return this._buffer;
                    },
                    enumerable: true,
                    configurable: true
                });
                Buffer.prototype.write = function () {
                    var _this = this;
                    var buffer = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        buffer[_i] = arguments[_i];
                    }
                    buffer.forEach(function (item) {
                        if (item) {
                            // this._buffer = NormalUtils.concatTypedArray(Uint8Array, this._buffer, item);
                            _this._buffer = concatUint8Array(_this._buffer, item);
                        }
                        else {
                            RuntimeLog_1.default.getInstance().error('undefined buffer: ', item);
                        }
                    });
                };
                Buffer.writeUint32 = function (value) {
                    return new Uint8Array([
                        value >> 24,
                        (value >> 16) & 0xff,
                        (value >> 8) & 0xff,
                        value & 0xff
                    ]);
                };
                return Buffer;
            }());
        });
    };
    return FMP4Worker;
}());
var PrivateClass = /** @class */ (function () {
    function PrivateClass() {
    }
    return PrivateClass;
}());
exports.default = FMP4Worker;


/***/ }),

/***/ "./src/core/vkd/HTTPLoader.ts":
/*!************************************!*\
  !*** ./src/core/vkd/HTTPLoader.ts ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var NormalUtils_1 = __webpack_require__(/*! ../../utils/NormalUtils */ "./src/utils/NormalUtils.ts");
var EventCenter_1 = __webpack_require__(/*! ../../events/EventCenter */ "./src/events/EventCenter.ts");
var EventLevel_1 = __webpack_require__(/*! ../../events/EventLevel */ "./src/events/EventLevel.ts");
var ErrorTypeList_1 = __webpack_require__(/*! ../../config/ErrorTypeList */ "./src/config/ErrorTypeList.ts");
/**
 * m3u8下载器
 */
var HTTPLoader = /** @class */ (function () {
    function HTTPLoader(opts) {
        this._loader = null;
        this._opts = {
            url: '',
            method: 'GET',
            type: 'arraybuffer',
            data: {},
            fileType: 'm3u8'
        };
        this._opts = NormalUtils_1.default.mergeObj(this._opts, opts);
    }
    /**
     * 开始下载 下载数据单位为字节
     */
    HTTPLoader.prototype.start = function (start, end) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var _loader = new XMLHttpRequest();
            var _method = _this._opts.method.toUpperCase();
            var _data = [];
            var _isMP4 = _this._opts.fileType === 'mp4' ? true : false;
            if (_this._opts.type !== null) {
                _loader.responseType = _this._opts.type;
            }
            for (var key in _this._opts.data) {
                _data.push(key + "=" + _this._opts.data[key]);
            }
            if (_method === 'GET') {
                if (_isMP4) {
                    _loader.open(_method, _this._opts.url);
                    var _range = "bytes=" + start + "-" + (end ? end : '');
                    _loader.setRequestHeader('Range', _range);
                }
                else {
                    _loader.open(_method, _this._opts.url + "?" + _data.join('&'));
                }
                _loader.send();
            }
            else if (_method === 'POST') {
                _loader.open(_method, _this._opts.url);
                _loader.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
                if (_isMP4) {
                    var _range = "bytes=" + start + "-" + (end ? end : '');
                    _loader.setRequestHeader('Range', _range);
                }
                _loader.send(_data.join('&'));
            }
            else {
                EventCenter_1.default.getInstance().dispatchOutwardEvent('PlayerError', {
                    code: ErrorTypeList_1.ErrorTypeList.TASK_PARAMS_ERROR,
                    level: EventLevel_1.EventLevel.ERROR,
                    target: _this,
                    message: "loader method error, current type is " + _method,
                    data: null
                });
            }
            _loader.onload = function () {
                if (_loader.status === 200 || _loader.status === 206) {
                    resolve(_loader);
                }
                else {
                    reject(new Error('onload status error.'));
                }
            };
            _loader.onerror = function (e) {
                reject(new Error("onerror trigger, e: " + e));
            };
            _this._loader = _loader;
        });
    };
    /**
     * 取消下载
     */
    HTTPLoader.prototype.abort = function () {
        this._loader.abort();
    };
    return HTTPLoader;
}());
exports.default = HTTPLoader;


/***/ }),

/***/ "./src/core/vkd/InlineWorker.ts":
/*!**************************************!*\
  !*** ./src/core/vkd/InlineWorker.ts ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var EventNames_1 = __webpack_require__(/*! ../../events/EventNames */ "./src/events/EventNames.ts");
var EventBus_1 = __webpack_require__(/*! ../../events/EventBus */ "./src/events/EventBus.ts");
/**
 * 内联方式引入worker
 */
var InlineWorker = /** @class */ (function () {
    function InlineWorker(func) {
        if (func) {
            var funcStr = func.toString().trim().match(/^function\s*\w*\s*\([\w\s,]*\)\s*{([\w\W]*?)}$/);
            if (funcStr && funcStr.length >= 2) {
                this.worker = new Worker(URL.createObjectURL(new Blob([funcStr[1]], { type: "text/javascript" })));
                this.worker.onmessage = function (res) {
                    var _data = res.data;
                    var _eventName = '';
                    switch (_data.method) {
                        case 'initSegment':
                            _eventName = EventNames_1.WorkerEvents.WORKER_INIT_SEGMENT_FINISHED;
                            break;
                        case 'mediaSegment':
                            _eventName = EventNames_1.WorkerEvents.WORKER_MEDIA_SEGMENT_FINISHED;
                    }
                    EventBus_1.default.getInstance().emit(_eventName, _data);
                };
                return;
            }
        }
        throw new Error("must has a function agument");
    }
    Object.defineProperty(InlineWorker.prototype, "onerror", {
        get: function () {
            return this.worker.onerror;
        },
        set: function (errorhandler) {
            this.worker.onerror = errorhandler;
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(InlineWorker.prototype, "onmessage", {
        get: function () {
            return this.worker.onmessage;
        },
        set: function (messagehandler) {
            this.worker.onmessage = messagehandler;
        },
        enumerable: true,
        configurable: true
    });
    ;
    /**
     * 发送消息
     * @param message
     * @param options
     */
    InlineWorker.prototype.postMessage = function (message, options) {
        this.worker.postMessage(message, options);
    };
    /**
     * 销毁worker
     */
    InlineWorker.prototype.terminate = function () {
        this.worker.terminate();
    };
    InlineWorker.prototype.addEventListener = function (type, listener, options) {
        this.worker.addEventListener(type, listener, options);
    };
    InlineWorker.prototype.removeEventListener = function (type, listener, options) {
        this.worker.removeEventListener(type, listener, options);
    };
    /**
     * 自定义消息
     */
    InlineWorker.prototype.dispatchEvent = function (evt) {
        return this.worker.dispatchEvent(evt);
    };
    return InlineWorker;
}());
exports.default = InlineWorker;


/***/ }),

/***/ "./src/core/vkd/MSE.ts":
/*!*****************************!*\
  !*** ./src/core/vkd/MSE.ts ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * MSE 媒体流生成类
 */
var EventEmitter = __webpack_require__(/*! eventemitter3 */ "./node_modules/eventemitter3/index.js");
var EventLevel_1 = __webpack_require__(/*! ../../events/EventLevel */ "./src/events/EventLevel.ts");
var ErrorTypeList_1 = __webpack_require__(/*! ../../config/ErrorTypeList */ "./src/config/ErrorTypeList.ts");
var NormalUtils_1 = __webpack_require__(/*! ../../utils/NormalUtils */ "./src/utils/NormalUtils.ts");
var RuntimeLog_1 = __webpack_require__(/*! ../../log/RuntimeLog */ "./src/log/RuntimeLog.ts");
var EventCenter_1 = __webpack_require__(/*! ../../events/EventCenter */ "./src/events/EventCenter.ts");
var MediaPlayerConfig_1 = __webpack_require__(/*! ../../config/MediaPlayerConfig */ "./src/config/MediaPlayerConfig.ts");
var MSE = /** @class */ (function (_super) {
    __extends(MSE, _super);
    function MSE(videoElement, _a) {
        var _b = _a.audio_codecs, audio_codecs = _b === void 0 ? '' : _b;
        var _this = _super.call(this) || this;
        // private _codecs: string = 'video/mp4; codecs="avc1.64001E, mp4a.40.5"';
        _this._codecs = 'video/mp4; codecs=';
        _this._video_codecs = 'avc1.64001E';
        _this._updating = false;
        _this._penddingQueue = [];
        _this._sourceBuffer = null;
        _this._removeQueue = [];
        _this._videoElement = null;
        /**
         * 处理 MediaSource open 事件
         */
        _this.sourceOpenHandler = function () {
            _this._sourceBuffer = _this._mediaSource.addSourceBuffer(_this._codecs);
            _this._sourceBuffer.addEventListener('error', function (e) {
                _this.dispatchErrorEvent(ErrorTypeList_1.ErrorTypeList.PLAYER_CORE_MSE_ERROR, "mse source open error", e);
            });
            _this._sourceBuffer.addEventListener('updateend', function () {
                _this.onSourceBufferUpdateEndHandler();
            });
            _this.emit('sourceopen');
            RuntimeLog_1.default.getInstance().log('(MSE) source open');
        };
        /**
         * 处理sourcebuffer更新完毕事件
         */
        _this.onSourceBufferUpdateEndHandler = function () {
            _this.emit('updateend');
            _this.handlePendingRemoveBuffer();
            if (!_this._penddingQueue.length)
                return;
            var buffer = _this._penddingQueue.shift();
            RuntimeLog_1.default.getInstance().log("%c(MSE) queue shift buffer length : " + buffer.byteLength, 'color: #0f0;');
            if (buffer && _this._sourceBuffer && !_this._sourceBuffer.updating && _this.state === 'open') {
                _this._sourceBuffer.appendBuffer(buffer);
            }
        };
        /**
         * 处理 MediaSource close 事件
         */
        _this.sourceCloseHandler = function () {
            _this.emit('sourceclose');
        };
        /**
         * 抛出异常事件
         * @param {IObject} code
         * @param {string} message
         * @param {IObject} data
         */
        _this.dispatchErrorEvent = function (code, message, data) {
            if (data === void 0) { data = null; }
            var errorObj = {
                code: ErrorTypeList_1.ErrorTypeList.PLAYER_CORE_MSE_ERROR,
                level: EventLevel_1.EventLevel.ERROR,
                target: _this,
                message: message,
                data: data
            };
            EventCenter_1.default.getInstance().dispatchOutwardEvent('PlayerError', errorObj);
        };
        _this._videoElement = videoElement;
        _this._audio_codecs = NormalUtils_1.default.strSpaceFilter(audio_codecs);
        _this._codecs += "\"" + _this._video_codecs + (_this._audio_codecs ? ", " + _this._audio_codecs : "") + "\"";
        RuntimeLog_1.default.getInstance().log("(MSE) codecs => '" + _this._codecs + "'");
        _this._mediaSource = new MediaSource;
        _this._mediaSource.addEventListener('sourceopen', _this.sourceOpenHandler);
        _this._mediaSource.addEventListener('sourceclose', _this.sourceCloseHandler);
        _this._url = window.URL.createObjectURL(_this._mediaSource);
        return _this;
    }
    Object.defineProperty(MSE.prototype, "updating", {
        /**
         * mse更新状态
         * @returns {boolean}
         */
        get: function () {
            return this._updating;
        },
        set: function (value) {
            this._updating = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MSE.prototype, "state", {
        /**
         * ready状态
         * @returns {any}
         */
        get: function () {
            return this._mediaSource.readyState;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MSE.prototype, "duration", {
        /**
         * 总长度
         * @returns {number}
         */
        get: function () {
            return this._mediaSource.duration;
        },
        set: function (value) {
            this._mediaSource.duration = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MSE.prototype, "url", {
        /**
         * 生成的 blob url；
         * @returns {string}
         */
        get: function () {
            return this._url;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * 自动清理sourceBuffer
     */
    MSE.prototype.autoCleanBuffer = function () {
        if (!this._sourceBuffer || !this._sourceBuffer.buffered || !this._sourceBuffer.buffered.length)
            return;
        var _buffered = this._sourceBuffer.buffered;
        var currentTime = this._videoElement.currentTime;
        if (currentTime - _buffered.start(0) <= MediaPlayerConfig_1.playerConfig.autoCleanupMaxDuration)
            return;
        var _needRemove = false;
        for (var i = 0, l = _buffered.length; i < l; i++) {
            var _start = _buffered.start(i);
            var _end = _buffered.end(i);
            if (_start <= currentTime && currentTime < _end + 3) {
                if (currentTime - _start >= MediaPlayerConfig_1.playerConfig.autoCleanupMaxDuration) {
                    _needRemove = true;
                    var _removeEnd = currentTime - MediaPlayerConfig_1.playerConfig.autoCleanupMinDuration;
                    this._removeQueue.push({
                        start: _start,
                        end: _removeEnd
                    });
                }
            }
            else if (_end < currentTime) {
                _needRemove = true;
                this._removeQueue.push({
                    start: _start,
                    end: _end
                });
            }
            if (_needRemove)
                break;
        }
        if (_needRemove) {
            this.handlePendingRemoveBuffer();
        }
    };
    /**
     * 删除等待队列处理
     */
    MSE.prototype.handlePendingRemoveBuffer = function () {
        if (this._removeQueue.length && !this._sourceBuffer.updating) {
            while (this._removeQueue.length && !this._sourceBuffer.updating) {
                var _range = this._removeQueue.shift();
                this._sourceBuffer.remove(_range.start, _range.end);
                RuntimeLog_1.default.getInstance().log("%c(MSE) clean range:" + _range.start + "-" + _range.end, 'color: #a42204;');
            }
        }
    };
    /**
     * 添加初始化initSegment
     * @param buffer
     */
    MSE.prototype.appendInitBuffer = function (buffer) {
        RuntimeLog_1.default.getInstance().log("%c(MSE) push initSegement, buffer length : " + buffer.byteLength, 'color: #ff0;');
        var sourceBuffer = this._sourceBuffer;
        this._penddingQueue.length = 0;
        this.autoCleanBuffer();
        if (sourceBuffer && !sourceBuffer.updating && this.state === 'open') {
            RuntimeLog_1.default.getInstance().log("%c(MSE) sourceBuffer append init buffer length : " + buffer.byteLength, 'color: #0f0;');
            sourceBuffer.appendBuffer(buffer);
            return true;
        }
        else {
            RuntimeLog_1.default.getInstance().log("%c(MSE) queue push init buffer length : " + buffer.byteLength, 'color: #f00;');
            this._penddingQueue.push(buffer);
            return false;
        }
    };
    /**
     * 添加media buffer
     * @param {ArrayBuffer} buffer
     * @returns {boolean}
     */
    MSE.prototype.appendBuffer = function (buffer) {
        var sourceBuffer = this._sourceBuffer;
        this.autoCleanBuffer();
        if (sourceBuffer && !sourceBuffer.updating && this.state === 'open') {
            RuntimeLog_1.default.getInstance().log("%c(MSE) sourceBuffer append media buffer length : " + buffer.byteLength, 'color: #0f0;');
            sourceBuffer.appendBuffer(buffer);
            return true;
        }
        else {
            RuntimeLog_1.default.getInstance().log("%c(MSE) queue push media buffer length : " + buffer.byteLength, 'color: #f00;');
            this._penddingQueue.push(buffer);
            return false;
        }
    };
    /**
     * 按照时间段(seconds)删除 buffer
     * @param {number} start
     * @param {number} end
     */
    MSE.prototype.removeBuffer = function (start, end) {
        this._removeQueue.push({
            start: start,
            end: end
        });
        this.handlePendingRemoveBuffer();
    };
    /**
     * 结束 MediaSource
     */
    MSE.prototype.endOfStream = function () {
        if (this.state === 'open') {
            this._mediaSource.endOfStream();
        }
    };
    /**
     * 销毁
     */
    MSE.prototype.dispose = function () {
        this._penddingQueue.length = 0;
        this._removeQueue.length = 0;
        this._sourceBuffer.removeEventListener('updateend', this.onSourceBufferUpdateEndHandler);
        this.removeAllListeners();
    };
    /**
     * 判断播放格式是否支持
     * @param codecs
     */
    MSE.isSupported = function (codecs) {
        return window.MediaSource && window.MediaSource.isTypeSupported(codecs);
    };
    return MSE;
}(EventEmitter));
exports.default = MSE;


/***/ }),

/***/ "./src/core/vkd/Stream.ts":
/*!********************************!*\
  !*** ./src/core/vkd/Stream.ts ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 流读取类
 */
var VkdDataView_1 = __webpack_require__(/*! ./mp4/VkdDataView */ "./src/core/vkd/mp4/VkdDataView.ts");
var EventCenter_1 = __webpack_require__(/*! ../../events/EventCenter */ "./src/events/EventCenter.ts");
var ErrorTypeList_1 = __webpack_require__(/*! ../../config/ErrorTypeList */ "./src/config/ErrorTypeList.ts");
var Stream = /** @class */ (function () {
    function Stream(buffer) {
        this._buffer = buffer;
        this._dataView = new VkdDataView_1.default(this._buffer);
        this._dataView.position = 0;
        this.initReadFunc();
    }
    Object.defineProperty(Stream.prototype, "position", {
        get: function () {
            return this._dataView.position;
        },
        set: function (value) {
            this._dataView.position = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Stream.prototype, "buffer", {
        get: function () {
            return this._buffer;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Stream.prototype, "dataView", {
        get: function () {
            return this._dataView;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Stream.prototype, "length", {
        get: function () {
            return this._dataView.byteLength;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * 初始化读取函数
     */
    Stream.prototype.initReadFunc = function () {
        var _this = this;
        this._readTypeList = {
            1: function (symbol) {
                return symbol ? _this._dataView.getInt8(_this._dataView.position) : _this._dataView.getUint8(_this._dataView.position);
            },
            2: function (symbol) {
                return symbol ? _this._dataView.getInt16(_this._dataView.position) : _this._dataView.getUint16(_this._dataView.position);
            },
            3: function (symbol) {
                if (symbol)
                    throw new Error('can not read symbol int 3');
                var _tempRes;
                _tempRes = _this._dataView.getUint8(_this._dataView.position) << 16;
                _tempRes |= _this._dataView.getUint8(_this._dataView.position + 1) << 8;
                _tempRes |= _this._dataView.getUint8(_this._dataView.position + 2);
                return _tempRes;
            },
            4: function (symbol) {
                return symbol ? _this._dataView.getInt32(_this._dataView.position) : _this._dataView.getUint32(_this._dataView.position);
            },
            8: function (symbol) {
                if (symbol)
                    throw new Error('can not read symbol int 8');
                var _tempRes;
                _tempRes = _this._dataView.getUint32(_this._dataView.position) << 32;
                _tempRes |= _this._dataView.getUint32(_this._dataView.position + 4);
                return _tempRes;
            }
        };
    };
    /**
     * 根据参数从dateView中读取数据
     * @param size
     * @param symbol
     */
    Stream.prototype.readByte = function (size, symbol) {
        if (symbol === void 0) { symbol = false; }
        var result = null;
        var _readFunc = this._readTypeList[size];
        if (!_readFunc) {
            result = '';
        }
        else {
            try {
                result = _readFunc(symbol);
            }
            catch (e) {
                EventCenter_1.default.getInstance().dispatchOutwardEvent('PlayerError', {
                    code: ErrorTypeList_1.ErrorTypeList.PLAYER_CORE_STREAM_PARSE_ERROR,
                    message: "stream parse error\uFF1A " + e.message,
                    data: null,
                }, e);
            }
        }
        this.position += size;
        return result;
    };
    /**
     * 跳过 count 数量的字节
     * @param {number} count
     */
    Stream.prototype.skip = function (count) {
        var loop = Math.floor(count / 4);
        var last = count % 4;
        for (var i = 0; i < loop; i++) {
            this.readByte(4);
        }
        if (last > 0) {
            this.readByte(last);
        }
    };
    /**
     * position回退
     * @param count
     */
    Stream.prototype.back = function (count) {
        this._dataView.position -= count;
    };
    /**
     * 从8位中读取一个无符号整数
     * @returns {any}
     */
    Stream.prototype.readUint8 = function () {
        return this.readByte(1);
    };
    /**
     * 从16位中读取一个无符号整数
     * @returns {any}
     */
    Stream.prototype.readUint16 = function () {
        return this.readByte(2);
    };
    /**
     * 从24位中读取一个无符号整数
     * @returns {any}
     */
    Stream.prototype.readUint24 = function () {
        return this.readByte(3);
    };
    /**
     * 从32位中读取一个无符号整数
     * @returns {any}
     */
    Stream.prototype.readUint32 = function () {
        return this.readByte(4);
    };
    /**
     * 从64位中读取一个无符号整数
     * @returns {any}
     */
    Stream.prototype.readUint64 = function () {
        return this.readByte(8);
    };
    /**
     * 从8位中读取一个有符号整数
     * @returns {any}
     */
    Stream.prototype.readInt8 = function () {
        return this.readByte(1, true);
    };
    /**
     * 从16位中读取一个有符号整数
     * @returns {any}
     */
    Stream.prototype.readInt16 = function () {
        return this.readByte(2, true);
    };
    /**
     * 从32位中读取一个有符号整数
     * @returns {any}
     */
    Stream.prototype.readInt32 = function () {
        return this.readByte(4, true);
    };
    /**
     * 创建一个32位Uint8Array对象并写入value
     * @param value
     */
    Stream.prototype.writeUint32 = function (value) {
        return new Uint8Array([
            value >>> 24 & 0xff,
            value >>> 16 & 0xff,
            value >>> 8 & 0xff,
            value & 0xff,
        ]);
    };
    return Stream;
}());
exports.default = Stream;


/***/ }),

/***/ "./src/core/vkd/UTC.ts":
/*!*****************************!*\
  !*** ./src/core/vkd/UTC.ts ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var UTC = /** @class */ (function () {
    function UTC() {
        var time = new Date();
        time.setFullYear(1904);
        time.setMonth(0);
        time.setDate(1);
        time.setHours(0);
        time.setMinutes(0);
        time.setSeconds(0);
        this.time = time;
    }
    UTC.prototype.setTime = function (value) {
        this.time.setTime(this.time.getTime() + value * 1);
        return this.time.toLocaleString();
    };
    return UTC;
}());
exports.default = UTC;


/***/ }),

/***/ "./src/core/vkd/VkdBasePlayer.ts":
/*!***************************************!*\
  !*** ./src/core/vkd/VkdBasePlayer.ts ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 自定义核心 基础播放器类
 */
var StateTypeList_1 = __webpack_require__(/*! ../../config/StateTypeList */ "./src/config/StateTypeList.ts");
var EventEmitter = __webpack_require__(/*! eventemitter3 */ "./node_modules/eventemitter3/index.js");
var NormalUtils_1 = __webpack_require__(/*! ../../utils/NormalUtils */ "./src/utils/NormalUtils.ts");
var EventLevel_1 = __webpack_require__(/*! ../../events/EventLevel */ "./src/events/EventLevel.ts");
var ErrorTypeList_1 = __webpack_require__(/*! ../../config/ErrorTypeList */ "./src/config/ErrorTypeList.ts");
var EventCenter_1 = __webpack_require__(/*! ../../events/EventCenter */ "./src/events/EventCenter.ts");
var MediaPlayerConfig_1 = __webpack_require__(/*! ../../config/MediaPlayerConfig */ "./src/config/MediaPlayerConfig.ts");
var PlayerStateManager_1 = __webpack_require__(/*! ../PlayerStateManager */ "./src/core/PlayerStateManager.ts");
var RuntimeLog_1 = __webpack_require__(/*! ../../log/RuntimeLog */ "./src/log/RuntimeLog.ts");
var Buffer_1 = __webpack_require__(/*! ./Buffer */ "./src/core/vkd/Buffer.ts");
var VkdBasePlayer = /** @class */ (function (_super) {
    __extends(VkdBasePlayer, _super);
    function VkdBasePlayer(videoElement, options) {
        var _this = _super.call(this) || this;
        _this._mainUrlMap = {
            '240P': null,
            '360P': null,
            '480P': null,
            '720P': null,
            '1080P': null,
            '4K': null,
        };
        _this._canSwitchDefinition = false;
        _this._currentDefinition = null;
        _this._usefulUrlList = [];
        _this._switchDefinitionTimer = null;
        _this._switchingDefinition = false;
        _this._mediaSegmentsQueue = [];
        _this._taskQueue = [];
        _this._taskHandling = false;
        _this._mediaBufferCache = new Buffer_1.default();
        /**
         * url初始化
         */
        _this._urlStrategies = {
            'String': function () {
                _this._canSwitchDefinition = false;
                _this._mainUrl = _this._options.src;
            },
            'Object': function () {
                _this._canSwitchDefinition = true;
                _this._mainUrlMap = __assign({}, _this._options.src);
            }
        };
        /**
         * mediaEvent抽象方法
         */
        _this.timeupdateHandler = function () { };
        _this.onPauseHandler = function () { };
        _this.waitingHandler = function () { };
        _this.seekingHandler = function () { };
        /**
         * 抛出异常事件
         * @param {IObject} code
         * @param {string} message
         * @param {IObject} data
         */
        _this.dispatchErrorEvent = function (code, message, data) {
            if (data === void 0) { data = null; }
            var errorObj = {
                code: code,
                level: EventLevel_1.EventLevel.ERROR,
                target: _this,
                message: message,
                data: data
            };
            // this.emit('error', errorObj);
            EventCenter_1.default.getInstance().dispatchOutwardEvent('PlayerError', errorObj);
        };
        /**
         * 响应网络环境变化事件
         */
        _this.onNetworkSpeedChange = function (e) {
            if (!_this._canSwitchDefinition)
                return;
            var targetDefinition = e.networkState;
            if (_this.currentDefinition === targetDefinition)
                return;
            if (_this._switchDefinitionTimer) {
                clearTimeout(_this._switchDefinitionTimer);
                _this._switchDefinitionTimer = undefined;
            }
            /*  let urlNotExist = this.usefulUrlList.every((item: IObject) => {
                 if (item.key === targetDefinition) {
                     return false;
                 } else {
                     return true;
                 }
             });
     
             //如果target指定分辨率不存在, 则进一步判断
             if (urlNotExist) {
                 let _mainUrlMapKeys = Object.keys(this._mainUrlMap);
                 let _start = _mainUrlMapKeys.indexOf(this._usefulUrlList[0].key);
                 let _end = _mainUrlMapKeys.indexOf(this._usefulUrlList[this._usefulUrlList.length - 1].key);
                 let _current = _mainUrlMapKeys.indexOf(targetDefinition);
                 if (_current < _start) {
                     targetDefinition = this._usefulUrlList[0].key;
                 } else if (_current > _end) {
                     targetDefinition = this._usefulUrlList[this._usefulUrlList.length - 1].key;
                 } else {
                     //TODO: 目前直接取消切流, 后期需要修改为根据当前分辨率和可用分辨率之间的关系来进行抉择
                     targetDefinition = null
                 }
             } */
            _this._switchDefinitionTimer = window.setTimeout(function () {
                _this.currentDefinition = targetDefinition;
                _this.switchDefinition(_this.currentDefinition);
            }, MediaPlayerConfig_1.playerConfig.networkSpeedChangeReflectTime);
            RuntimeLog_1.default.getInstance().log("(mp4) netwrok speed change event fired, config definition: " + MediaPlayerConfig_1.playerConfig.definition + ", current defunition: " + _this.currentDefinition + ", changed definition: " + e.networkState);
        };
        _this._video = videoElement;
        _this._options = options;
        return _this;
    }
    Object.defineProperty(VkdBasePlayer.prototype, "video", {
        get: function () {
            return this._video;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VkdBasePlayer.prototype, "currentTime", {
        get: function () {
            return this._video.currentTime;
        },
        set: function (value) {
            this._video.currentTime = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VkdBasePlayer.prototype, "buffered", {
        get: function () {
            return this._video.buffered;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VkdBasePlayer.prototype, "duration", {
        get: function () {
            return this._video.duration;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VkdBasePlayer.prototype, "src", {
        get: function () {
            return this._video.src;
        },
        set: function (value) {
            this._video.src = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VkdBasePlayer.prototype, "currentWidth", {
        get: function () {
            return this._video.videoWidth;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VkdBasePlayer.prototype, "currentHeight", {
        get: function () {
            return this._video.videoHeight;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VkdBasePlayer.prototype, "muted", {
        get: function () {
            return this._video.muted;
        },
        set: function (value) {
            MediaPlayerConfig_1.playerConfig.muted = value;
            this._video.muted = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VkdBasePlayer.prototype, "poster", {
        get: function () {
            return this._video.poster;
        },
        set: function (value) {
            MediaPlayerConfig_1.playerConfig.poster = value;
            this._video.poster = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VkdBasePlayer.prototype, "videoPlaybackQuality", {
        get: function () {
            return this._video.getVideoPlaybackQuality();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VkdBasePlayer.prototype, "volume", {
        get: function () {
            return this._video.volume;
        },
        set: function (value) {
            MediaPlayerConfig_1.playerConfig.volume = value;
            this._video.volume = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VkdBasePlayer.prototype, "playbackRate", {
        get: function () {
            return this._video.playbackRate;
        },
        set: function (value) {
            MediaPlayerConfig_1.playerConfig.playbackRate = value;
            this._video.playbackRate = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VkdBasePlayer.prototype, "loop", {
        get: function () {
            return MediaPlayerConfig_1.playerConfig.loop;
        },
        set: function (value) {
            MediaPlayerConfig_1.playerConfig.loop = value;
            this._video.loop = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VkdBasePlayer.prototype, "preload", {
        get: function () {
            return this._video.preload;
        },
        set: function (value) {
            MediaPlayerConfig_1.playerConfig.preload = value;
            this._video.preload = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VkdBasePlayer.prototype, "autoplay", {
        get: function () {
            return this._video.autoplay;
        },
        set: function (value) {
            MediaPlayerConfig_1.playerConfig.autoplay = value;
            this._video.autoplay = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VkdBasePlayer.prototype, "controls", {
        get: function () {
            return this._video.controls;
        },
        set: function (value) {
            MediaPlayerConfig_1.playerConfig.controls = value;
            this._video.controls = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VkdBasePlayer.prototype, "supportFullScreen", {
        get: function () {
            return this._video.webkitSupportsFullscreen;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VkdBasePlayer.prototype, "mainUrl", {
        get: function () {
            return this._mainUrl;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VkdBasePlayer.prototype, "mainUrlMap", {
        get: function () {
            return this._mainUrlMap;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VkdBasePlayer.prototype, "currentDefinition", {
        get: function () {
            return this._currentDefinition;
        },
        set: function (value) {
            this._currentDefinition = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VkdBasePlayer.prototype, "usefulUrlList", {
        get: function () {
            return this._usefulUrlList.concat();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * 初始化
     */
    VkdBasePlayer.prototype.init = function () {
        if (!MediaPlayerConfig_1.playerConfig.definition) {
            MediaPlayerConfig_1.playerConfig.definition = 'Auto';
        }
        try {
            this._urlStrategies[NormalUtils_1.default.typeOf(this._options.src)]();
            this._mainUrl = this.createMainUrl();
            this.initMediaEventsListener();
        }
        catch (e) {
            this.dispatchErrorEvent(ErrorTypeList_1.ErrorTypeList.PLAYER_CORE_INIT_ERROR, "in VkdBasePlayer init: " + e.message, null);
        }
    };
    /**
     * 创建初始化url
     */
    VkdBasePlayer.prototype.createMainUrl = function () {
        var _this = this;
        var baseUrl = null;
        if (this._canSwitchDefinition) {
            var _keys = Object.keys(this.mainUrlMap);
            var _usefulUrl_1 = [];
            _keys.forEach(function (item) {
                if (_this.mainUrlMap[item]) {
                    _usefulUrl_1.push({
                        url: _this.mainUrlMap[item],
                        key: item
                    });
                }
            });
            if (!_usefulUrl_1.length) {
                this.errorHandler({
                    message: "no userful url, core init failed!"
                });
                return;
            }
            this._usefulUrlList = _usefulUrl_1;
            if (MediaPlayerConfig_1.playerConfig.definition === 'Auto') {
                // Auto分辨率下优先480P, 否则选择第一个可用src作为baseUrl
                if (this.mainUrlMap['480P']) {
                    baseUrl = this.mainUrlMap['480P'];
                    this.currentDefinition = '480P';
                }
                else {
                    var _lastUrlObj = this._usefulUrlList[0];
                    this.currentDefinition = _lastUrlObj.key;
                    baseUrl = _lastUrlObj.url;
                }
            }
            else {
                this.currentDefinition = MediaPlayerConfig_1.playerConfig.definition;
                baseUrl = this.mainUrlMap[MediaPlayerConfig_1.playerConfig.definition];
            }
        }
        else {
            baseUrl = this.mainUrl;
        }
        RuntimeLog_1.default.getInstance().log("(player) init definition: " + this.currentDefinition + ", mainUrl: " + baseUrl);
        return baseUrl;
    };
    /**
     * 初始化媒体事件监听器
     */
    VkdBasePlayer.prototype.initMediaEventsListener = function () {
        var _this = this;
        var MediaEventsList = __assign(__assign({}, StateTypeList_1.StateTypeList), { onError: 'error' });
        Object.keys(MediaEventsList).forEach(function (key) {
            if (MediaEventsList[key] === 'seeking') {
                _this._video.onseeking = NormalUtils_1.default.throttle(_this.seekingHandler);
            }
            else {
                _this._video.addEventListener("" + MediaEventsList[key], function (e) {
                    var eventHandlerName = MediaEventsList[key] + "Handler";
                    if (_this[eventHandlerName] && typeof _this[eventHandlerName] === 'function') {
                        _this[eventHandlerName]();
                    }
                    _this.handleMediaEvent(MediaEventsList[key], e);
                });
            }
        });
    };
    /**
     * Media事件处理
     */
    VkdBasePlayer.prototype.handleMediaEvent = function (name, originEvent) {
        var _this = this;
        var _data = null;
        if (name === "timeupdate") {
            _data = {
                currentTime: this._video.currentTime,
                duration: this._video.duration
            };
        }
        PlayerStateManager_1.default.getInstance().updatePlayerState(name);
        if (name === "ended") {
            if (NormalUtils_1.default.is_weixin() && !NormalUtils_1.default.is_iOS()) {
                this.play();
                setTimeout(function () {
                    _this.pause();
                }, 100);
                RuntimeLog_1.default.getInstance().log('special handle ended event in WX browser (not iOS).');
            }
        }
        // if (name !== 'timeupdate') {
        EventCenter_1.default.getInstance().dispatchOutwardEvent('PlayerMediaEvent', {
            code: name,
            message: "H5 media event " + name + " fired.",
            data: _data
        }, originEvent);
        // }
        this.emit(name, originEvent);
    };
    /**
     * 移除媒体事件监听器
     */
    VkdBasePlayer.prototype.removeMediaEventsListener = function () {
        var _this = this;
        var MediaEventsList = __assign(__assign({}, StateTypeList_1.StateTypeList), { onError: 'error' });
        Object.keys(MediaEventsList).forEach(function (key) {
            _this._video.removeEventListener("on" + MediaEventsList[key].charAt(0).toUpperCase() + MediaEventsList[key].slice(1), function (e) {
                _this.handleMediaEvent(MediaEventsList[key], e);
            });
        });
    };
    /**
     * start方法 指定video的MSE链接
     * @param {string} url
     */
    VkdBasePlayer.prototype.start = function (url) {
        var _this = this;
        this._video.src = url;
        //配置播放器行为
        ['autoplay', 'muted', 'poster', 'controls', 'volume', 'playbackRate'].forEach(function (item) {
            _this._video[item] = MediaPlayerConfig_1.playerConfig[item];
        });
    };
    /**
     * 获取video已缓冲范围
     */
    VkdBasePlayer.prototype.getBufferedRange = function () {
        var range = [0, 0];
        var video = this._video;
        var buffered = video.buffered;
        var currentTime = video.currentTime;
        if (buffered) {
            for (var i = 0, len = buffered.length; i < len; i++) {
                range[0] = buffered.start(i);
                range[1] = buffered.end(i);
                if (range[0] <= currentTime && currentTime <= range[1]) {
                    break;
                }
            }
        }
        if (range[0] - currentTime <= 0 && currentTime - range[1] <= 0) {
            return range;
        }
        else {
            return [0, 0];
        }
    };
    /**
     * 清空队列和缓存buffer
     */
    VkdBasePlayer.prototype.clearCache = function () {
        this._taskQueue = [];
        this._mediaSegmentsQueue = [];
        this._mediaBufferCache = new Buffer_1.default();
    };
    VkdBasePlayer.prototype.play = function () {
        this._video.play();
    };
    VkdBasePlayer.prototype.pause = function () {
        this._video.pause();
    };
    ;
    VkdBasePlayer.prototype.seek = function (time) {
        var _time = Math.min(this.duration, Math.max(0, time));
        this._video.currentTime = _time;
    };
    VkdBasePlayer.prototype.replay = function () {
        this.currentTime = 0;
        this.play();
    };
    VkdBasePlayer.prototype.enterFullScreen = function () {
        this._video.webkitEnterFullScreen();
    };
    VkdBasePlayer.prototype.exitFullScreen = function () {
        this._video.webkitExitFullScreen();
    };
    VkdBasePlayer.prototype.reset = function () {
        throw new Error("Method not implemented.");
    };
    VkdBasePlayer.prototype.setCurrentTimeByPercent = function (percent) {
        throw new Error("Method not implemented.");
    };
    /**
     * 改变分辨率
     * @param definition
     */
    VkdBasePlayer.prototype.changeResolution = function (definition) {
        if (!this._canSwitchDefinition) {
            RuntimeLog_1.default.getInstance().warning("(player) cannot switch definition when only have one src!");
            return;
        }
        if (this._switchDefinitionTimer) {
            clearTimeout(this._switchDefinitionTimer);
            this._switchDefinitionTimer = undefined;
        }
        if (MediaPlayerConfig_1.playerConfig.definition !== definition) {
            MediaPlayerConfig_1.playerConfig.definition = definition;
            /**
             * 如果 其他分辨率 => Auto 则不立即切换, 后续切换逻辑网速监控来完成
             * 否则 Auto => 其他分辨率 则立刻切换
             */
            if (definition !== 'Auto') {
                this.currentDefinition = definition;
                this.switchDefinition(definition);
            }
        }
    };
    /**
     * 销毁BasePlayer
     */
    VkdBasePlayer.prototype.dispose = function () {
        this.clearCache();
        this.removeMediaEventsListener();
        this._video = null;
        this._options = null;
    };
    return VkdBasePlayer;
}(EventEmitter));
exports.default = VkdBasePlayer;


/***/ }),

/***/ "./src/core/vkd/hls/HLS.ts":
/*!*********************************!*\
  !*** ./src/core/vkd/hls/HLS.ts ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var EventEmitter = __webpack_require__(/*! eventemitter3 */ "./node_modules/eventemitter3/index.js");
var M3U8_1 = __webpack_require__(/*! ./M3U8 */ "./src/core/vkd/hls/M3U8.ts");
var TSTask_1 = __webpack_require__(/*! ./TSTask */ "./src/core/vkd/hls/TSTask.ts");
var RuntimeLog_1 = __webpack_require__(/*! ../../../log/RuntimeLog */ "./src/log/RuntimeLog.ts");
var TSStreamParser_1 = __webpack_require__(/*! ./TSStreamParser */ "./src/core/vkd/hls/TSStreamParser.ts");
var TSPackagePES_1 = __webpack_require__(/*! ./ts/TSPackagePES */ "./src/core/vkd/hls/ts/TSPackagePES.ts");
var Buffer_1 = __webpack_require__(/*! ../Buffer */ "./src/core/vkd/Buffer.ts");
var FMP4_1 = __webpack_require__(/*! ../FMP4 */ "./src/core/vkd/FMP4.ts");
var MSE_1 = __webpack_require__(/*! ../MSE */ "./src/core/vkd/MSE.ts");
var EventCenter_1 = __webpack_require__(/*! ../../../events/EventCenter */ "./src/events/EventCenter.ts");
var EventLevel_1 = __webpack_require__(/*! ../../../events/EventLevel */ "./src/events/EventLevel.ts");
var ErrorTypeList_1 = __webpack_require__(/*! ../../../config/ErrorTypeList */ "./src/config/ErrorTypeList.ts");
var NormalUtils_1 = __webpack_require__(/*! ../../../utils/NormalUtils */ "./src/utils/NormalUtils.ts");
/**
 * HLS组装器
 */
var HLS = /** @class */ (function (_super) {
    __extends(HLS, _super);
    function HLS(player, url) {
        var _this = _super.call(this) || this;
        _this._url = '';
        _this._segments = [];
        _this._taskIdCache = new Set();
        _this._m3u8 = null;
        _this._mse = null;
        _this._cache = new Buffer_1.default();
        _this._inited = false;
        _this._startDTS = undefined;
        /**
         * MSE open事件处理
         */
        _this.onMSEOpenHandler = function () {
            var tsTask = null;
            tsTask = new TSTask_1.default(_this._segments);
            tsTask.on('load', _this.onTSLoadHandler);
            tsTask.on('error', _this.onTSErrorHandler);
        };
        /**
         * MSE 异常事件处理
         */
        _this.onMSEErrorHandler = function (err) {
            _this.dispatchErrorEvent('MSE ERROR', err);
        };
        /**
         * ts文件下载完成事件处理
         */
        _this.onTSLoadHandler = function (e) {
            var _task = e.task;
            RuntimeLog_1.default.getInstance().log("received media data => id: " + _task.idx);
            if (_this._taskIdCache.has(_task.idx))
                return;
            _this._taskIdCache.add(_task.idx);
            // RuntimeLog.getInstance().log('ts media data start parsing...');
            try {
                var _ts = new TSStreamParser_1.default(_task.cacheBuffer);
                _this.parsePES(_ts);
            }
            catch (e) {
                _this.dispatchErrorEvent("ts stream parse error: " + e.message);
            }
        };
        /**
         * ts文件下载异常事件处理
         */
        _this.onTSErrorHandler = function (e) {
            EventCenter_1.default.getInstance().dispatchOutwardEvent('PlayerError', e);
        };
        /**
         * 抛出异常
         */
        _this.dispatchErrorEvent = function (message, data) {
            if (data === void 0) { data = null; }
            var errorObj = {
                code: ErrorTypeList_1.ErrorTypeList.PLAYER_CORE_HLS_ERROR,
                level: EventLevel_1.EventLevel.ERROR,
                target: _this,
                message: message,
                data: data
            };
            EventCenter_1.default.getInstance().dispatchOutwardEvent('PlayerError', errorObj);
        };
        _this._player = player;
        _this._url = url;
        _this.init(url);
        return _this;
    }
    /**
     * 初始化
     * @param url
     */
    HLS.prototype.init = function (url) {
        var _this = this;
        RuntimeLog_1.default.getInstance().log('m3u8 header file start parsing...');
        var m3u8 = new M3U8_1.default(this._url);
        m3u8.once('ready', function () {
            RuntimeLog_1.default.getInstance().log('m3u8 header file parsed');
            _this._segments = m3u8.segments;
            _this._mse = new MSE_1.default(_this._player.video, {
                audio_codecs: 'mp4a.40.5'
            });
            _this._mse.on('sourceopen', _this.onMSEOpenHandler);
            _this._mse.on('error', _this.onMSEErrorHandler);
            _this._player.start(_this._mse.url);
        });
        this._m3u8 = m3u8;
    };
    /**
     * pes解析
     * @param ts
     */
    HLS.prototype.parsePES = function (ts) {
        var _this = this;
        var _pesArr = [];
        var _video = [];
        var _audio = [];
        var _meta = null;
        ts.pes.forEach(function (item, idx) {
            var _pes = new TSPackagePES_1.default(item);
            _pesArr.push(_pes);
            if (_pes.type === 'video') {
                _video.push(_pes);
            }
            else if (_pes.type === 'audio') {
                _audio.push(_pes);
            }
        });
        _video.some(function (item) {
            if (item.ES.sps.length) {
                var es = item.ES;
                var as = _audio[0].ES; //audio
                var duration_1 = 0;
                _this._m3u8.segments.forEach(function (item) {
                    duration_1 += item.duration * 1; //为live模式作准备, duration需要不断计算
                });
                //媒体信息
                _meta = {
                    sps: es.sps,
                    pps: es.pps,
                    width: es.info.width,
                    height: es.info.height,
                    pixelRatio: es.info.pixelRatio,
                    channelCount: as.channel,
                    timeScale: as.frequence,
                    sampleRate: as.frequence,
                    profile: as.profile,
                    duration: duration_1,
                    audioConfig: _audio[0].ES.audioConfig
                };
                return false;
            }
        });
        if (_meta) {
            if (this._startDTS === undefined) {
                this._startDTS = Math.min(_video[0].dts, _audio[0].pts);
            }
            var _onlyVideo = !!_audio.length;
            _meta.startDTS = this._startDTS;
            _meta.videoSamples = _video;
            if (_onlyVideo) {
                _meta.audioSamples = _audio;
            }
            //解析完ts后初始化mse
            if (!this._inited) {
                RuntimeLog_1.default.getInstance().log('mse start init...');
                this._inited = true;
                this._mse.appendInitBuffer(this.initSegment(_meta));
            }
            // this._mse.appendBuffer()
            var _videoBuffer = this.createVideoSegment(_meta);
            var _audioBuffer = this.createAudioFragment(_meta);
            // let _tempBuffer = NormalUtils.concatTypedArray(Uint8Array, _videoBuffer, _audioBuffer);
            var _tempBuffer = NormalUtils_1.default.concatUint8Array(_videoBuffer, _audioBuffer);
            this._mse.appendBuffer(_tempBuffer);
            this._mse.once('updateend', function () {
                // this.update()
            });
        }
    };
    /**
     * 创建初始化片段
     * @param data
     */
    HLS.prototype.initSegment = function (meta) {
        var buffer = new Buffer_1.default();
        buffer.write(FMP4_1.default.ftyp());
        buffer.write(FMP4_1.default.moov(meta));
        this._cache.write(buffer.buffer);
        return buffer.buffer;
    };
    /**
     * 添加video片段
     */
    HLS.prototype.createVideoSegment = function (meta) {
        var video = meta.videoSamples;
        var samplesLength = video.length;
        var sampleDuration = (video[samplesLength - 1].dts - video[0].dts) / samplesLength;
        var samples, startDTS;
        startDTS = meta.startDTS;
        samples = video.map(function (item, idx) {
            var duration;
            if (idx + 1 === samplesLength) {
                duration = sampleDuration;
            }
            else {
                duration = video[idx + 1].dts - item.dts;
            }
            return {
                size: item.ES.buffer.byteLength,
                duration: duration,
                offset: item.pts - item.dts,
                buffer: item.ES.buffer,
                key: !!item.ES.pps.length
            };
        });
        return this.addFragment({
            id: 1,
            time: video[0].dts - startDTS,
            firstFlags: 0x2000000,
            flags: 0xf01,
            samples: samples
        });
    };
    /**
     * 添加audio片段
     */
    HLS.prototype.createAudioFragment = function (meta) {
        var audio = meta.audioSamples;
        var samplesLength = audio.length;
        var startPTS = meta.startDTS || 0;
        var samples, duration;
        samples = audio.map(function (item, idx) {
            if (idx + 1 === samplesLength) {
                duration = (audio[samplesLength - 1].pts - audio[0].pts) / samplesLength;
            }
            else {
                duration = audio[idx + 1].pts - item.pts;
            }
            return {
                size: item.ES.buffer.byteLength,
                duration: duration,
                offset: 0,
                buffer: item.ES.buffer,
                key: true
            };
        });
        return this.addFragment({
            id: 2,
            time: audio[0].pts - startPTS,
            firstFlags: 0x00,
            flags: 0x701,
            samples: samples
        });
    };
    /**
     * 添加片段
     * @param data
     */
    HLS.prototype.addFragment = function (data) {
        var buffer = new Buffer_1.default();
        buffer.write(FMP4_1.default.moof(data));
        buffer.write(FMP4_1.default.mdat(data));
        this._cache.write(buffer.buffer);
        return buffer.buffer;
    };
    return HLS;
}(EventEmitter));
exports.default = HLS;


/***/ }),

/***/ "./src/core/vkd/hls/M3U8.ts":
/*!**********************************!*\
  !*** ./src/core/vkd/hls/M3U8.ts ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * m3u8解析类
 */
var EventEmitter = __webpack_require__(/*! eventemitter3 */ "./node_modules/eventemitter3/index.js");
var HTTPLoader_1 = __webpack_require__(/*! ../HTTPLoader */ "./src/core/vkd/HTTPLoader.ts");
var EventCenter_1 = __webpack_require__(/*! ../../../events/EventCenter */ "./src/events/EventCenter.ts");
var EventLevel_1 = __webpack_require__(/*! ../../../events/EventLevel */ "./src/events/EventLevel.ts");
var ErrorTypeList_1 = __webpack_require__(/*! ../../../config/ErrorTypeList */ "./src/config/ErrorTypeList.ts");
var M3U8 = /** @class */ (function (_super) {
    __extends(M3U8, _super);
    function M3U8(url) {
        var _this = _super.call(this) || this;
        _this._url = '';
        _this._segments = [];
        _this._type = 'live';
        _this._isEnd = false;
        _this._retry = 0;
        _this._retryMax = 10;
        _this._url = url;
        _this.init();
        return _this;
    }
    Object.defineProperty(M3U8.prototype, "segments", {
        get: function () {
            return this._segments;
        },
        set: function (value) {
            this._segments = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * 初始化
     */
    M3U8.prototype.init = function () {
        var _this = this;
        this.fetch(this._url)
            .then(function (res) {
            _this._type = res.meta.TYPE.toLocaleLowerCase();
            _this._isEnd = res.meta.ENDLIST;
            res.segments.forEach(function (item) {
                _this._segments.push(item);
            });
            _this.emit('ready');
        })
            .catch(function () {
            _this._segments.length = 0;
            _this._retry++;
            if (_this._retry < _this._retryMax) {
                EventCenter_1.default.getInstance().dispatchOutwardEvent('PlayerError', {
                    code: ErrorTypeList_1.ErrorTypeList.PLAYER_CORE_M3U8_ERROR,
                    level: EventLevel_1.EventLevel.ERROR,
                    target: _this,
                    message: "m3u8 file download fail, now retry times: " + _this._retry,
                    data: null
                });
                _this.init();
            }
        });
    };
    /**
     * 下载并解析m3u8文件
     * @param url
     */
    M3U8.prototype.fetch = function (url) {
        var _this = this;
        var meta = {
            TYPE: 'LIVE',
            ENDLIST: ''
        };
        var segments = [];
        var _start = 0;
        return new Promise(function (resolve, reject) {
            var _loader = new HTTPLoader_1.default({
                url: _this._url,
                type: null
            });
            _loader.start().then(function (res) {
                var ctx = res.responseText;
                if (ctx) {
                    var metaCtx_1 = ctx.substring(0, ctx.indexOf('#EXTINF'));
                    var endList_1 = ctx.substring(ctx.lastIndexOf('#EXTINF'));
                    var Tag_1 = M3U8.Tag;
                    var EXTINFItem_1 = new RegExp(Tag_1.EXTINF.source);
                    Object.keys(Tag_1).forEach(function (key) {
                        if (key !== '#EXTINF' && Tag_1[key].test(metaCtx_1) || Tag_1[key].test(endList_1)) {
                            meta[key] = RegExp.$2 ? [RegExp.$1, RegExp.$2] : RegExp.$1 || true;
                        }
                    });
                    ctx.match(Tag_1.EXTINF).forEach(function (item, idx) {
                        if (EXTINFItem_1.test(item)) {
                            var _time = +RegExp.$1;
                            var _title = RegExp.$2;
                            var _url = M3U8.resolve(url, _title);
                            var _tempItem = {
                                idx: idx,
                                duration: _time,
                                title: _title,
                                downloaded: false,
                                url: _url,
                            };
                            _tempItem.start = _start;
                            // _start = NormalUtils.printFn(_start + _time);
                            _start = _start + _time;
                            _tempItem.end = _start;
                            segments.push(_tempItem);
                        }
                    });
                    if (+meta['SEQUENCE'] === 0 && meta['ENDLIST']) {
                        meta.TYPE = 'VOD';
                    }
                    resolve({ meta: meta, segments: segments });
                }
                else {
                    reject(new Error('m3u8 parse error'));
                }
            }).catch(function (err) {
                reject(err);
            });
        });
    };
    /**
     * 转换相对路径
     * @param base
     * @param url
     */
    M3U8.resolve = function (base, url) {
        var _this = this;
        var result = [];
        var a = document.createElement('a');
        a.href = base;
        var b = url;
        var aArr = a.pathname.replace(/^\/+/, '').split('/'); // 过滤/符号开始的字符串并以/分割
        var bArr = b.split('/');
        aArr.pop(); // 删除.m3u8结尾文件名
        //查找路径
        var find = function () {
            switch (bArr[0]) {
                case '':
                    result = bArr.slice(1);
                    break;
                case '.':
                    result = aArr.concat(bArr.slice(1));
                    break;
                case '..':
                    bArr.shift();
                    if (aArr.length) {
                        aArr.pop();
                        find();
                    }
                    else {
                        EventCenter_1.default.getInstance().dispatchOutwardEvent('PlayerError', {
                            code: ErrorTypeList_1.ErrorTypeList.PLAYER_CORE_M3U8_ERROR,
                            level: EventLevel_1.EventLevel.ERROR,
                            target: _this,
                            message: "cannot resolve path in m3u8, base: " + base + "|url: " + url,
                            data: null
                        });
                    }
                    break;
                default:
                    result = aArr.concat(bArr);
                    break;
            }
        };
        find();
        var _result = '';
        if (result.length) {
            _result = a.protocol + '//' + a.host + '/' + result.join('/');
        }
        else {
            _result = a.href;
        }
        return _result;
    };
    M3U8.Tag = {
        EXTM3U: /^#EXTM3U/,
        TYPE: /#EXT-X-PLAYLIST-TYPE:(\w+)/,
        EXTINF: /#EXTINF:(\d+\.?\d*)(?:,(?:[^\r|\n]*)(?:\r|\n)*)(.*(?!#))/g,
        DURATION: /#EXT-X-TARGETDURATION:(\d+\.?\d*)/,
        SEQUENCE: /#EXT-X-MEDIA-SEQUENCE:(\d+)/,
        ENDLIST: /#EXT-X-ENDLIST/,
        VERSION: /#EXT-X-VERSION:(\d+)/,
        STREAM: /#EXT-X-STREAM-INF:(\w+=\w+)+/
    };
    return M3U8;
}(EventEmitter));
exports.default = M3U8;


/***/ }),

/***/ "./src/core/vkd/hls/TSPackage.ts":
/*!***************************************!*\
  !*** ./src/core/vkd/hls/TSPackage.ts ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * TS包解析器
 */
Object.defineProperty(exports, "__esModule", { value: true });
var Stream_1 = __webpack_require__(/*! ../Stream */ "./src/core/vkd/Stream.ts");
var TSPackageHeader_1 = __webpack_require__(/*! ./ts/TSPackageHeader */ "./src/core/vkd/hls/ts/TSPackageHeader.ts");
var TSPackageBody_1 = __webpack_require__(/*! ./ts/TSPackageBody */ "./src/core/vkd/hls/ts/TSPackageBody.ts");
var TSPackage = /** @class */ (function () {
    function TSPackage(buffer) {
        this._buffer = null;
        this._header = null;
        this._body = null;
        this._buffer = new Stream_1.default(buffer);
        this._header = new TSPackageHeader_1.default(this._buffer);
        this._body = new TSPackageBody_1.default(this._buffer, this._header).createInstance();
    }
    Object.defineProperty(TSPackage.prototype, "header", {
        get: function () {
            return this._header;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TSPackage.prototype, "body", {
        get: function () {
            return this._body;
        },
        enumerable: true,
        configurable: true
    });
    return TSPackage;
}());
exports.default = TSPackage;


/***/ }),

/***/ "./src/core/vkd/hls/TSStreamParser.ts":
/*!********************************************!*\
  !*** ./src/core/vkd/hls/TSStreamParser.ts ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var TSPackage_1 = __webpack_require__(/*! ./TSPackage */ "./src/core/vkd/hls/TSPackage.ts");
var TS_PACKAGE_LENGTH = 188;
var TSStreamParser = /** @class */ (function () {
    function TSStreamParser(stream) {
        this._buffer = null;
        this._tsPackageArr = [];
        this._buffer = stream;
        this.sliceBuffer();
    }
    /**
     * 将TS流分割为TS包
     */
    TSStreamParser.prototype.sliceBuffer = function () {
        var _count = 0;
        var _bufferLength = this._buffer.byteLength;
        while (_count < _bufferLength) {
            this._tsPackageArr.push(new TSPackage_1.default(this._buffer.slice(_count, _count + TS_PACKAGE_LENGTH)));
            _count += TS_PACKAGE_LENGTH;
        }
        delete this._buffer;
    };
    Object.defineProperty(TSStreamParser.prototype, "pat", {
        get: function () {
            return this._tsPackageArr.filter(function (item) { return item.header.pid === 0; });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TSStreamParser.prototype, "pmt", {
        get: function () {
            var pat = this.pat, list = [];
            pat.forEach(function (item) {
                item.body.list.forEach(function (sub) {
                    list.push(sub.pid);
                });
            });
            return this._tsPackageArr.filter(function (item) { return list.some(function (b) { return b === item.header.pid; }); });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TSStreamParser.prototype, "pes", {
        get: function () {
            var _pmt = this.pmt, _pidArr = [];
            var _pes = [];
            _pmt.forEach(function (item) {
                _pidArr = _pidArr.concat(item.body.list.map(function (b) { return b.pid; }));
            });
            var _ts = this._tsPackageArr, _length = _ts.length, _cur, _tempGroup = [];
            for (var i = 0; i < _length; i++) {
                _cur = _ts[i];
                if (_pidArr.indexOf(_cur.header.pid) > -1) {
                    // if ((_cur.body as TSPackageAdaptationField).type === 'video') {
                    //     this.assemblyES(_cur, 'video');
                    // } else if ((_cur.body as TSPackageAdaptationField).type === 'audio') {
                    //     this.assemblyES(_cur);
                    // }
                    //有效载荷单元起始指示符为1 说明下一帧开始
                    if (_cur.header.payload === 1) {
                        _tempGroup = [];
                        _tempGroup.push(_cur);
                        _pes.push(_tempGroup);
                    }
                    else if (_tempGroup.length === 0) {
                        _pes.push([_cur]);
                    }
                    else {
                        _tempGroup.push(_cur);
                    }
                }
            }
            return _pes;
        },
        enumerable: true,
        configurable: true
    });
    return TSStreamParser;
}());
exports.default = TSStreamParser;


/***/ }),

/***/ "./src/core/vkd/hls/TSTask.ts":
/*!************************************!*\
  !*** ./src/core/vkd/hls/TSTask.ts ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var EventEmitter = __webpack_require__(/*! eventemitter3 */ "./node_modules/eventemitter3/index.js");
var ErrorTypeList_1 = __webpack_require__(/*! ../../../config/ErrorTypeList */ "./src/config/ErrorTypeList.ts");
var EventLevel_1 = __webpack_require__(/*! ../../../events/EventLevel */ "./src/events/EventLevel.ts");
var HTTPLoader_1 = __webpack_require__(/*! ../HTTPLoader */ "./src/core/vkd/HTTPLoader.ts");
var TSTask = /** @class */ (function (_super) {
    __extends(TSTask, _super);
    function TSTask(segments) {
        var _this = _super.call(this) || this;
        _this._segemnts = [];
        _this._taskMap = [];
        _this._loader = null;
        _this._loaderIdx = 0;
        /**
         * 错误处理
         */
        _this.dispatchError = function (message) {
            if (message === void 0) { message = ''; }
            var errorObj = {
                code: ErrorTypeList_1.ErrorTypeList.PLAYER_CORE_TASK_ERROR,
                level: EventLevel_1.EventLevel.ERROR,
                target: _this,
                message: message,
                data: null
            };
            _this.emit('error', errorObj);
        };
        _this._segemnts = segments;
        _this.initTaskMap();
        _this.initTaskLoader();
        return _this;
    }
    /**
     * 初始化下载任务map
     */
    TSTask.prototype.initTaskMap = function () {
        this._taskMap = this._segemnts; // 这里暂时不需要处理, 如果需要处理则不能直接赋值
    };
    /**
     * 创建loader任务
     */
    TSTask.prototype.initTaskLoader = function () {
        if (!this._taskMap.length) {
            this.dispatchError("ts task map length is 0");
            return;
        }
        this.createNextKeepLoader();
    };
    /**
     * 创建下一个下载任务
     */
    TSTask.prototype.createNextKeepLoader = function () {
        var _this = this;
        if (this._loader)
            return;
        if (this._loaderIdx >= this._segemnts.length) {
            return;
        }
        var _currentTask = this._taskMap[this._loaderIdx];
        //如果当前分片已经下载完毕, 则直接进入下一任务
        if (_currentTask.downloaded) {
            this.emit('load', {
                task: _currentTask
            });
            this._loaderIdx += 1;
            this.createNextKeepLoader();
            return;
        }
        this._loader = new HTTPLoader_1.default({
            url: _currentTask.url,
            type: 'arraybuffer'
        });
        this._loader.start().then(function (res) {
            _this._loader = null;
            var _res = res.response;
            _currentTask.cacheBuffer = _res;
            _currentTask.downloaded = true;
            _this._loaderIdx += 1;
            _this.emit('load', {
                task: _currentTask
            });
            _this.createNextKeepLoader();
        }).catch(function (e) {
            _this.dispatchError("TSTask xhr error: " + (e.message || 'load fail'));
        });
    };
    return TSTask;
}(EventEmitter));
exports.default = TSTask;


/***/ }),

/***/ "./src/core/vkd/hls/VkdHLSPlayer.ts":
/*!******************************************!*\
  !*** ./src/core/vkd/hls/VkdHLSPlayer.ts ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var VkdBasePlayer_1 = __webpack_require__(/*! ../VkdBasePlayer */ "./src/core/vkd/VkdBasePlayer.ts");
var HLS_1 = __webpack_require__(/*! ./HLS */ "./src/core/vkd/hls/HLS.ts");
var MSE_1 = __webpack_require__(/*! ../MSE */ "./src/core/vkd/MSE.ts");
/**
 * hls播放器核心
 */
var VkdHLSPlayer = /** @class */ (function (_super) {
    __extends(VkdHLSPlayer, _super);
    function VkdHLSPlayer(element, options) {
        var _this = _super.call(this, element, options) || this;
        _this._hls = null;
        _this._videoElement = null;
        if (!MSE_1.default.isSupported('video/mp4; codecs="avc1.64001E, mp4a.40.5"'))
            return _this;
        _this._videoElement = element;
        _this.init();
        return _this;
    }
    /**
     * 初始化player
     */
    VkdHLSPlayer.prototype.init = function () {
        _super.prototype.init.call(this);
        var player = this;
        var hls = new HLS_1.default(player, this._options.src);
    };
    /**
     * player开始
     * @param url
     */
    VkdHLSPlayer.prototype.start = function (url) {
        _super.prototype.start.call(this, url);
    };
    VkdHLSPlayer.prototype.switchDefinition = function (definition) {
        throw new Error("Method not implemented.");
    };
    return VkdHLSPlayer;
}(VkdBasePlayer_1.default));
exports.default = VkdHLSPlayer;


/***/ }),

/***/ "./src/core/vkd/hls/ts/BasePES.ts":
/*!****************************************!*\
  !*** ./src/core/vkd/hls/ts/BasePES.ts ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var RuntimeLog_1 = __webpack_require__(/*! ../../../../log/RuntimeLog */ "./src/log/RuntimeLog.ts");
var BasePES = /** @class */ (function () {
    function BasePES(stream) {
        this._stream = stream;
    }
    Object.defineProperty(BasePES.prototype, "stream", {
        get: function () {
            return this._stream;
        },
        enumerable: true,
        configurable: true
    });
    BasePES.prototype.parse = function () {
        RuntimeLog_1.default.getInstance().log("BasePes parse() called. it's maybe a mistake ,please check code.");
    };
    return BasePES;
}());
exports.default = BasePES;


/***/ }),

/***/ "./src/core/vkd/hls/ts/ExpGolomb.ts":
/*!******************************************!*\
  !*** ./src/core/vkd/hls/ts/ExpGolomb.ts ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var EventCenter_1 = __webpack_require__(/*! ../../../../events/EventCenter */ "./src/events/EventCenter.ts");
var ErrorTypeList_1 = __webpack_require__(/*! ../../../../config/ErrorTypeList */ "./src/config/ErrorTypeList.ts");
var EventLevel_1 = __webpack_require__(/*! ../../../../events/EventLevel */ "./src/events/EventLevel.ts");
var ExpGolomb = /** @class */ (function () {
    function ExpGolomb(data) {
        this.data = data;
        // the number of bytes left to examine in this.data
        this.bytesAvailable = data.byteLength;
        // the current word being examined
        this.word = 0; // :uint
        // the number of bits left to examine in the current word
        this.bitsAvailable = 0; // :uint
    }
    // ():void
    ExpGolomb.prototype.loadWord = function () {
        var data = this.data, bytesAvailable = this.bytesAvailable, position = data.byteLength - bytesAvailable, workingBytes = new Uint8Array(4), availableBytes = Math.min(4, bytesAvailable);
        if (availableBytes === 0) {
            EventCenter_1.default.getInstance().dispatchOutwardEvent('PlayerError', {
                code: ErrorTypeList_1.ErrorTypeList.PLAYER_CORE_STREAM_PARSE_ERROR,
                level: EventLevel_1.EventLevel.ERROR,
                target: this,
                message: 'ExpGolomb no bytes available',
                data: null
            });
        }
        workingBytes.set(data.subarray(position, position + availableBytes));
        this.word = new DataView(workingBytes.buffer).getUint32(0);
        // track the amount of this.data that has been processed
        this.bitsAvailable = availableBytes * 8;
        this.bytesAvailable -= availableBytes;
    };
    // (count:int):void
    ExpGolomb.prototype.skipBits = function (count) {
        var skipBytes; // :int
        if (this.bitsAvailable > count) {
            this.word <<= count;
            this.bitsAvailable -= count;
        }
        else {
            count -= this.bitsAvailable;
            skipBytes = count >> 3;
            count -= (skipBytes >> 3);
            this.bytesAvailable -= skipBytes;
            this.loadWord();
            this.word <<= count;
            this.bitsAvailable -= count;
        }
    };
    // (size:int):uint
    ExpGolomb.prototype.readBits = function (size) {
        var bits = Math.min(this.bitsAvailable, size), // :uint
        valu = this.word >>> (32 - bits); // :uint
        if (size > 32) {
            window.console.error('Cannot read more than 32 bits at a time');
        }
        this.bitsAvailable -= bits;
        if (this.bitsAvailable > 0) {
            this.word <<= bits;
        }
        else if (this.bytesAvailable > 0) {
            this.loadWord();
        }
        bits = size - bits;
        if (bits > 0 && this.bitsAvailable) {
            return valu << bits | this.readBits(bits);
        }
        else {
            return valu;
        }
    };
    // ():uint
    ExpGolomb.prototype.skipLZ = function () {
        var leadingZeroCount; // :uint
        for (leadingZeroCount = 0; leadingZeroCount < this.bitsAvailable; ++leadingZeroCount) {
            if ((this.word & (0x80000000 >>> leadingZeroCount)) !== 0) {
                // the first bit of working word is 1
                this.word <<= leadingZeroCount;
                this.bitsAvailable -= leadingZeroCount;
                return leadingZeroCount;
            }
        }
        // we exhausted word and still have not found a 1
        this.loadWord();
        return leadingZeroCount + this.skipLZ();
    };
    // ():void
    ExpGolomb.prototype.skipUEG = function () {
        this.skipBits(1 + this.skipLZ());
    };
    // ():void
    ExpGolomb.prototype.skipEG = function () {
        this.skipBits(1 + this.skipLZ());
    };
    // ():uint
    ExpGolomb.prototype.readUEG = function () {
        var clz = this.skipLZ(); // :uint
        return this.readBits(clz + 1) - 1;
    };
    // ():int
    ExpGolomb.prototype.readEG = function () {
        var valu = this.readUEG(); // :int
        if (0x01 & valu) {
            // the number is odd if the low order bit is set
            return (1 + valu) >>> 1; // add 1 to make it even, and divide by 2
        }
        else {
            return -1 * (valu >>> 1); // divide by two then make it negative
        }
    };
    // Some convenience functions
    // :Boolean
    ExpGolomb.prototype.readBoolean = function () {
        return this.readBits(1) === 1;
    };
    // ():int
    ExpGolomb.prototype.readUByte = function () {
        return this.readBits(8);
    };
    // ():int
    ExpGolomb.prototype.readUShort = function () {
        return this.readBits(16);
    };
    // ():int
    ExpGolomb.prototype.readUInt = function () {
        return this.readBits(32);
    };
    /**
  * Advance the ExpGolomb decoder past a scaling list. The scaling
  * list is optionally transmitted as part of a sequence parameter
  * set and is not relevant to transmuxing.
  * @param count {number} the number of entries in this scaling list
  * @see Recommendation ITU-T H.264, Section 7.3.2.1.1.1
  */
    ExpGolomb.prototype.skipScalingList = function (count) {
        var lastScale = 8, nextScale = 8, j, deltaScale;
        for (j = 0; j < count; j++) {
            if (nextScale !== 0) {
                deltaScale = this.readEG();
                nextScale = (lastScale + deltaScale + 256) % 256;
            }
            lastScale = (nextScale === 0)
                ? lastScale
                : nextScale;
        }
    };
    /**
  * Read a sequence parameter set and return some interesting video
  * properties. A sequence parameter set is the H264 metadata that
  * describes the properties of upcoming video frames.
  * @param data {Uint8Array} the bytes of a sequence parameter set
  * @return {object} an object with configuration parsed from the
  * sequence parameter set, including the dimensions of the
  * associated video frames.
  */
    ExpGolomb.prototype.readSPS = function () {
        var frameCropLeftOffset = 0, frameCropRightOffset = 0, frameCropTopOffset = 0, frameCropBottomOffset = 0, profileIdc, profileCompat, levelIdc, numRefFramesInPicOrderCntCycle, picWidthInMbsMinus1, picHeightInMapUnitsMinus1, frameMbsOnlyFlag, scalingListCount, i, readUByte = this.readUByte.bind(this), readBits = this.readBits.bind(this), readUEG = this.readUEG.bind(this), readBoolean = this.readBoolean.bind(this), skipBits = this.skipBits.bind(this), skipEG = this.skipEG.bind(this), skipUEG = this.skipUEG.bind(this), skipScalingList = this.skipScalingList.bind(this);
        readUByte();
        profileIdc = readUByte(); // profile_idc
        profileCompat = readBits(5); // constraint_set[0-4]_flag, u(5)
        skipBits(3); // reserved_zero_3bits u(3),
        levelIdc = readUByte(); // level_idc u(8)
        skipUEG(); // seq_parameter_set_id
        // some profiles have more optional data we don't need
        if (profileIdc === 100 || profileIdc === 110 || profileIdc === 122 || profileIdc === 244 || profileIdc === 44 || profileIdc === 83 || profileIdc === 86 || profileIdc === 118 || profileIdc === 128) {
            var chromaFormatIdc = readUEG();
            if (chromaFormatIdc === 3) {
                skipBits(1); // separate_colour_plane_flag
            }
            skipUEG(); // bit_depth_luma_minus8
            skipUEG(); // bit_depth_chroma_minus8
            skipBits(1); // qpprime_y_zero_transform_bypass_flag
            if (readBoolean()) { // seq_scaling_matrix_present_flag
                scalingListCount = (chromaFormatIdc !== 3)
                    ? 8
                    : 12;
                for (i = 0; i < scalingListCount; i++) {
                    if (readBoolean()) { // seq_scaling_list_present_flag[ i ]
                        if (i < 6) {
                            skipScalingList(16);
                        }
                        else {
                            skipScalingList(64);
                        }
                    }
                }
            }
        }
        skipUEG(); // log2_max_frame_num_minus4
        var picOrderCntType = readUEG();
        if (picOrderCntType === 0) {
            readUEG(); // log2_max_pic_order_cnt_lsb_minus4
        }
        else if (picOrderCntType === 1) {
            skipBits(1); // delta_pic_order_always_zero_flag
            skipEG(); // offset_for_non_ref_pic
            skipEG(); // offset_for_top_to_bottom_field
            numRefFramesInPicOrderCntCycle = readUEG();
            for (i = 0; i < numRefFramesInPicOrderCntCycle; i++) {
                skipEG(); // offset_for_ref_frame[ i ]
            }
        }
        skipUEG(); // max_num_ref_frames
        skipBits(1); // gaps_in_frame_num_value_allowed_flag
        picWidthInMbsMinus1 = readUEG();
        picHeightInMapUnitsMinus1 = readUEG();
        frameMbsOnlyFlag = readBits(1);
        if (frameMbsOnlyFlag === 0) {
            skipBits(1); // mb_adaptive_frame_field_flag
        }
        skipBits(1); // direct_8x8_inference_flag
        if (readBoolean()) { // frame_cropping_flag
            frameCropLeftOffset = readUEG();
            frameCropRightOffset = readUEG();
            frameCropTopOffset = readUEG();
            frameCropBottomOffset = readUEG();
        }
        var pixelRatio = [1, 1];
        if (readBoolean()) {
            // vui_parameters_present_flag
            if (readBoolean()) {
                // aspect_ratio_info_present_flag
                var aspectRatioIdc = readUByte();
                switch (aspectRatioIdc) {
                    case 1:
                        pixelRatio = [1, 1];
                        break;
                    case 2:
                        pixelRatio = [12, 11];
                        break;
                    case 3:
                        pixelRatio = [10, 11];
                        break;
                    case 4:
                        pixelRatio = [16, 11];
                        break;
                    case 5:
                        pixelRatio = [40, 33];
                        break;
                    case 6:
                        pixelRatio = [24, 11];
                        break;
                    case 7:
                        pixelRatio = [20, 11];
                        break;
                    case 8:
                        pixelRatio = [32, 11];
                        break;
                    case 9:
                        pixelRatio = [80, 33];
                        break;
                    case 10:
                        pixelRatio = [18, 11];
                        break;
                    case 11:
                        pixelRatio = [15, 11];
                        break;
                    case 12:
                        pixelRatio = [64, 33];
                        break;
                    case 13:
                        pixelRatio = [160, 99];
                        break;
                    case 14:
                        pixelRatio = [4, 3];
                        break;
                    case 15:
                        pixelRatio = [3, 2];
                        break;
                    case 16:
                        pixelRatio = [2, 1];
                        break;
                    case 255:
                        {
                            pixelRatio = [
                                readUByte() << 8 | readUByte(),
                                readUByte() << 8 | readUByte()
                            ];
                            break;
                        }
                }
            }
        }
        return {
            width: Math.ceil((((picWidthInMbsMinus1 + 1) * 16) - frameCropLeftOffset * 2 - frameCropRightOffset * 2)),
            height: ((2 - frameMbsOnlyFlag) * (picHeightInMapUnitsMinus1 + 1) * 16) - ((frameMbsOnlyFlag
                ? 2
                : 4) * (frameCropTopOffset + frameCropBottomOffset)),
            pixelRatio: pixelRatio
        };
    };
    ExpGolomb.prototype.readSliceType = function () {
        // skip NALu type
        this.readUByte();
        // discard first_mb_in_slice
        this.readUEG();
        // return slice_type
        return this.readUEG();
    };
    return ExpGolomb;
}());
exports.default = ExpGolomb;


/***/ }),

/***/ "./src/core/vkd/hls/ts/TSPackageAdaptationField.ts":
/*!*********************************************************!*\
  !*** ./src/core/vkd/hls/ts/TSPackageAdaptationField.ts ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 创建自适应区域解析实例
 */
var BasePES_1 = __webpack_require__(/*! ./BasePES */ "./src/core/vkd/hls/ts/BasePES.ts");
var Stream_1 = __webpack_require__(/*! ../../Stream */ "./src/core/vkd/Stream.ts");
var TSPackageAdaptationField = /** @class */ (function (_super) {
    __extends(TSPackageAdaptationField, _super);
    function TSPackageAdaptationField(stream, header, type) {
        var _this = _super.call(this, stream) || this;
        _this._header = null;
        _this._start = 0;
        _this._type = '';
        _this._adaptationLength = -1;
        _this._discontinue = -1;
        _this._header = header;
        _this._start = _this._stream.position;
        _this._type = type;
        _this.parse();
        return _this;
    }
    Object.defineProperty(TSPackageAdaptationField.prototype, "type", {
        get: function () {
            return this._type;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TSPackageAdaptationField.prototype, "buffer", {
        get: function () {
            return this._buffer;
        },
        enumerable: true,
        configurable: true
    });
    TSPackageAdaptationField.prototype.parse = function () {
        if (this._header.adaptation === 0x02 || this._header.adaptation === 0x03) {
            this._adaptationLength = this._stream.readUint8(); //该长度只包含5flags所指定的区域长度
            if (this._adaptationLength) {
                var next = this._stream.readUint8();
                this._discontinue = next >>> 7;
                this._access = next >>> 6 & 0x01;
                this._priority = next >>> 5 & 0x01;
                this._PCR = next >>> 4 & 0x01;
                this._OPCR = next >>> 3 & 0x01;
                this._splicePoint = next >>> 2 & 0x01;
                this._transportPrivate = next >>> 1 & 0x01;
                this._adaptationFieldExtension = next & 0x01;
                var _start = this._stream.position;
                if (this._PCR === 1) {
                    this._programClockBase = this._stream.readUint32() << 1;
                    next = this._stream.readUint16();
                    // this._programClockBase |= next >>> 15;
                    this._programClockExtension = next & 0x1ff;
                }
                if (this._OPCR === 1) {
                    this._originProgramClockBase = this._stream.readUint32() << 1;
                    next = this._stream.readUint16();
                    // this._originProgramClockBase += next >>> 15;
                    this._originProgramClockExtension = next & 0x1ff;
                }
                if (this._splicePoint === 1) {
                    this._spliceCountdown = this._stream.readUint8();
                }
                if (this._transportPrivate === 1) {
                    var length_1 = this._stream.readUint8(), transportPrivateData = [];
                    for (var i = 0; i < length_1; i++) {
                        transportPrivateData.push(this._stream.readUint8());
                    }
                }
                if (this._adaptationFieldExtension === 1) {
                    var length_2 = this._stream.readUint8(), //该长度只包含3flags所指定的区域长度
                    next_1 = this._stream.readUint8(), start = this._stream.position;
                    var ltw = next_1 >>> 7, piecewise = next_1 >>> 6 & 0x1, seamless = next_1 >>> 5 & 0x1;
                    if (ltw === 1) {
                        next_1 = this._stream.readUint16();
                        this._ltwValid = next_1 >>> 15;
                        this._ltwOffset = next_1 & 0xefff;
                    }
                    if (piecewise === 1) {
                        next_1 = this._stream.readUint24();
                        this._piecewiseRate = next_1 & 0x3fffff;
                    }
                    if (seamless === 1) {
                        next_1 = this._stream.readInt8();
                        this._spliceType = next_1 >>> 4;
                        this._dtsNextAU1 = next_1 >>> 1 & 0x7;
                        this._marker1 = next_1 & 0x1;
                        next_1 = this._stream.readUint16();
                        this._dtsNextAU2 = next_1 >>> 1;
                        this._marker2 = next_1 & 0x1;
                        next_1 = this._stream.readUint16();
                        this._dtsNextAU3 = next_1;
                    }
                    this._stream.skip(length_2 - 1 - (this._stream.position - start));
                }
                var lastStuffing = this._adaptationLength - 1 - (this._stream.position - _start);
                this._stream.skip(lastStuffing);
            }
        }
        this._buffer = new Stream_1.default(this._stream.buffer.slice(this._stream.position));
    };
    return TSPackageAdaptationField;
}(BasePES_1.default));
exports.default = TSPackageAdaptationField;


/***/ }),

/***/ "./src/core/vkd/hls/ts/TSPackageBody.ts":
/*!**********************************************!*\
  !*** ./src/core/vkd/hls/ts/TSPackageBody.ts ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var TSPackagePAT_1 = __webpack_require__(/*! ./TSPackagePAT */ "./src/core/vkd/hls/ts/TSPackagePAT.ts");
var TSPackageCAT_1 = __webpack_require__(/*! ./TSPackageCAT */ "./src/core/vkd/hls/ts/TSPackageCAT.ts");
var TSPackageTSDT_1 = __webpack_require__(/*! ./TSPackageTSDT */ "./src/core/vkd/hls/ts/TSPackageTSDT.ts");
var TSPackagePMT_1 = __webpack_require__(/*! ./TSPackagePMT */ "./src/core/vkd/hls/ts/TSPackagePMT.ts");
var TSPackageAdaptationField_1 = __webpack_require__(/*! ./TSPackageAdaptationField */ "./src/core/vkd/hls/ts/TSPackageAdaptationField.ts");
var StreamType = {
    0x01: ['video', 'MPEG-1'],
    0x02: ['video', 'MPEG-2'],
    0x1b: ['video', 'AVC.H264'],
    0xea: ['video', 'VC-1'],
    0x03: ['audio', 'MPEG-1'],
    0x04: ['audio', 'MPEG-2'],
    0x0f: ['audio', 'MPEG-2.AAC'],
    0x11: ['audio', 'MPEG-4.AAC'],
    0x80: ['audio', 'LPCM'],
    0x81: ['audio', 'AC3'],
    0x06: ['audio', 'AC3'],
    0x82: ['audio', 'DTS'],
    0x83: ['audio', 'Dolby TrueHD'],
    0x84: ['audio', 'AC3-Plus'],
    0x85: ['audio', 'DTS-HD'],
    0x86: ['audio', 'DTS-MA'],
    0xa1: ['audio', 'AC3-Plus-SEC'],
    0xa2: ['audio', 'DTS-HD-SEC'],
};
var TSPackageBody = /** @class */ (function () {
    function TSPackageBody(stream, header) {
        var _this = this;
        this._header = null;
        this._headerPid = -1;
        this._stream = null;
        this._instance = null;
        this._bodyParseStrategies = {
            0: function () {
                _this._instance = new TSPackagePAT_1.default(_this._stream);
                //从PAT中读取PMT列表
                TSPackageBody.PATSpace = TSPackageBody.PATSpace.concat(_this._instance.list);
            },
            1: function () {
                _this._instance = new TSPackageCAT_1.default(_this._stream);
            },
            2: function () {
                _this._instance = new TSPackageTSDT_1.default(_this._stream);
            },
            0x1fff: function () {
                _this._instance = null;
            },
            'default': function () {
                if (TSPackageBody.PATSpace.some(function (item) { return item.pid === _this._headerPid; })) {
                    _this._header.packet = 'PMT';
                    _this._instance = new TSPackagePMT_1.default(_this._stream);
                    var _tempList = _this._instance.list;
                    //从PMT中读取media列表
                    TSPackageBody.PMTSpace = TSPackageBody.PMTSpace.concat(_tempList.map(function (item) {
                        return {
                            pid: item.pid,
                            es: item.es,
                            streamType: item.streamType,
                            program: _this._instance.program
                        };
                    }));
                }
                else {
                    var ts = TSPackageBody.PMTSpace.length ?
                        TSPackageBody.PMTSpace.filter(function (item) { return item.pid === _this._headerPid; }) :
                        [];
                    _this._instance = ts.length ? new TSPackageAdaptationField_1.default(_this._stream, _this._header, StreamType[ts[0].streamType][0]) : null;
                }
            }
        };
        this._header = header;
        this._headerPid = this._header.pid;
        this._stream = stream;
    }
    /**
     * 创建解析实例
     */
    TSPackageBody.prototype.createInstance = function () {
        if ([0, 1, 2, 0x1fff].indexOf(this._headerPid) > -1) {
            this._bodyParseStrategies[this._headerPid]();
        }
        else {
            this._bodyParseStrategies['default']();
        }
        return this._instance;
    };
    TSPackageBody.PATSpace = [];
    TSPackageBody.PMTSpace = [];
    return TSPackageBody;
}());
exports.default = TSPackageBody;


/***/ }),

/***/ "./src/core/vkd/hls/ts/TSPackageCAT.ts":
/*!*********************************************!*\
  !*** ./src/core/vkd/hls/ts/TSPackageCAT.ts ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var BasePES_1 = __webpack_require__(/*! ./BasePES */ "./src/core/vkd/hls/ts/BasePES.ts");
var TSPackageCAT = /** @class */ (function (_super) {
    __extends(TSPackageCAT, _super);
    function TSPackageCAT(stream) {
        var _this = _super.call(this, stream) || this;
        _this.parse();
        return _this;
    }
    TSPackageCAT.prototype.parse = function () {
        this._tableID = this._stream.readUint8();
        var next = this._stream.readUint16();
        this._sectionIndicator = next >>> 7;
        this._sectionLength = next & 0x0fff;
        this._stream.skip(2);
        next = this._stream.readUint8();
        this._version = next >>> 3;
        this._currentnextIndicator = next & 0x01;
        this._sectionNumber = this._stream.readUint8();
        this._lastSectionNumber = this._stream.readUint8();
        var N = (this._sectionLength - 9) / 4;
        var list = [];
        for (var i = 0; i < N; i++) {
            list.push({});
        }
        this._CRC32 = this._stream.readUint32();
    };
    return TSPackageCAT;
}(BasePES_1.default));
exports.default = TSPackageCAT;


/***/ }),

/***/ "./src/core/vkd/hls/ts/TSPackageES.ts":
/*!********************************************!*\
  !*** ./src/core/vkd/hls/ts/TSPackageES.ts ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Stream_1 = __webpack_require__(/*! ../../Stream */ "./src/core/vkd/Stream.ts");
var EventCenter_1 = __webpack_require__(/*! ../../../../events/EventCenter */ "./src/events/EventCenter.ts");
var ErrorTypeList_1 = __webpack_require__(/*! ../../../../config/ErrorTypeList */ "./src/config/ErrorTypeList.ts");
var EventLevel_1 = __webpack_require__(/*! ../../../../events/EventLevel */ "./src/events/EventLevel.ts");
var NormalUtils_1 = __webpack_require__(/*! ../../../../utils/NormalUtils */ "./src/utils/NormalUtils.ts");
var ExpGolomb_1 = __webpack_require__(/*! ./ExpGolomb */ "./src/core/vkd/hls/ts/ExpGolomb.ts");
/**
 * es解析类
 */
var TSPackageES = /** @class */ (function () {
    function TSPackageES(stream, type, tsArr) {
        var _this = this;
        this._stream = null;
        this._tsArr = [];
        /**
         * 抛出异常事件
         */
        this.dispatchErrorEvent = function (message) {
            EventCenter_1.default.getInstance().dispatchOutwardEvent('PlayerError', {
                code: ErrorTypeList_1.ErrorTypeList.PLAYER_CORE_STREAM_PARSE_ERROR,
                level: EventLevel_1.EventLevel.ERROR,
                target: _this,
                message: message,
                data: null
            });
        };
        var next = null;
        var totalBuffer = TSPackageES.Merge(stream, tsArr);
        this._stream = new Stream_1.default(totalBuffer.buffer);
        if (type === 'video') {
            next = this._stream.readUint32();
            if (next !== 1) {
                this._stream.back(4);
                next = this._stream.readUint24();
                if (next !== 1) {
                    this.dispatchErrorEvent("h264 nal header parse failed");
                }
            }
            //09 0xNN 打包ES为pes的时候 pes header和es数据之间需要插入一个type=9的nalu以及随意1B的数据
            this._stream.skip(2);
            this.findSPS();
            this._sps = TSPackageES.readSPSorPPS(this._stream, 'sps');
            this._pps = TSPackageES.readSPSorPPS(this._stream, 'pps');
            var nal = void 0;
            if (this._sps.length) {
                this._info = new ExpGolomb_1.default(new Uint8Array(this._sps)).readSPS();
                nal = this._stream.readUint24();
            }
            else {
                nal = this._stream.readUint24();
                if (nal === 0) {
                    nal = this._stream.readUint8();
                }
            }
            if (nal === 1) {
                var vdata = new Uint8Array(this._stream.buffer.slice(this._stream.position));
                // this._buffer = NormalUtils.concatTypedArray(Uint8Array, this._stream.writeUint32(vdata.byteLength), vdata);
                this._buffer = NormalUtils_1.default.concatUint8Array(this._stream.writeUint32(vdata.byteLength), vdata);
            }
            else {
                this.dispatchErrorEvent("h264 convert to avcc error");
            }
        }
        else if (type === 'audio') {
            next = this._stream.readUint16();
            // adts的同步字节，12位
            if (next >>> 4 !== 0xfff) {
                this.dispatchErrorEvent("aac ES parse error");
            }
            var fq = [96000, 88200, 64000, 48000, 44100, 32000, 24000, 22050, 16000, 12000, 11025, 8000, 7350];
            this._id = (next >>> 3 & 0x01) === 0 ? 'MPEG-4' : 'MPEG-2';
            this._layer = next >>> 1 & 0x03;
            this._absent = next & 0x01;
            next = this._stream.readUint16();
            this._audioObjectType = (next >>> 14 & 0x03) + 1;
            this._profile = this._audioObjectType - 1;
            this._frequencyIndex = next >>> 10 & 0x0f;
            this._frequence = fq[this._frequencyIndex];
            this._channel = next >>> 6 & 0x07;
            this._frameLength = (next & 0x03) << 11 | (this._stream.readUint16() >>> 5);
            this._audioConfig = TSPackageES.getAudioConfig(this._audioObjectType, this._channel, this._frequencyIndex);
            this._stream.skip(1);
            this._buffer = TSPackageES.Merge(this._stream, this._tsArr);
        }
    }
    Object.defineProperty(TSPackageES.prototype, "sps", {
        get: function () {
            return this._sps;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TSPackageES.prototype, "pps", {
        get: function () {
            return this._pps;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TSPackageES.prototype, "info", {
        get: function () {
            return this._info;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TSPackageES.prototype, "channel", {
        get: function () {
            return this._channel;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TSPackageES.prototype, "frequence", {
        get: function () {
            return this._frequence;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TSPackageES.prototype, "profile", {
        get: function () {
            return this._profile;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TSPackageES.prototype, "audioConfig", {
        get: function () {
            return this._audioConfig;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TSPackageES.prototype, "buffer", {
        get: function () {
            return this._buffer;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * 该方法查找sps nalu并将position置为查找到的位置
     * @param tsArr
     */
    TSPackageES.prototype.findSPS = function () {
        var _next = 0;
        do {
            if (this._stream.position <= 0 || this._stream.position >= this._stream.length) {
                this.dispatchErrorEvent("ES cannot find sps and pps info");
                break;
            }
            _next = this._stream.readUint8();
            if (_next === 0) {
                _next = this._stream.readUint24();
                if (_next === 1) {
                    //找到分隔符 判断类型(后5位)
                    _next = this._stream.readUint8();
                    if ((_next & 0x1f) === 7) {
                        //找到sps 回退5字节
                        this._stream.back(5);
                        break;
                    }
                    else if ((_next & 0x1f) !== 6) {
                        //非SEI增强信息直接回退
                        this._stream.back(5);
                        break;
                    }
                }
                else {
                    this._stream.back(3);
                }
            }
        } while (true);
    };
    /**
     * 读取 序列参数集（SPS）或 图像参数集（PPS）
     * @param stream
     * @param type
     */
    TSPackageES.readSPSorPPS = function (stream, type) {
        if (type === void 0) { type = 'sps'; }
        var isSps = type === 'sps';
        var _backStep = isSps ? 4 : 3;
        var _nextCheckFlag = isSps ? 7 : 8;
        var start = stream.readUint32(); //分隔符 0x00000001
        var result = [], next, flag = true, check = false;
        if (start === 1) {
            do {
                next = stream.readUint8();
                if (!check) {
                    if ((next & 0x1f) !== _nextCheckFlag) {
                        flag = false;
                        stream.back(5);
                        break;
                    }
                    else {
                        check = true;
                    }
                }
                if (next !== 0) {
                    result.push(next);
                }
                else {
                    next = isSps ? stream.readUint24() : stream.readUint16();
                    if (next === 1) {
                        flag = false;
                        stream.back(_backStep);
                    }
                    else {
                        stream.back(_backStep);
                        result.push(stream.readUint8());
                    }
                }
            } while (flag);
        }
        else {
            stream.back(4);
        }
        return result;
    };
    /**
     * 获取音频配置信息
     * @param audioObjectType
     * @param channel
     * @param sampleIndex
     */
    TSPackageES.getAudioConfig = function (audioObjectType, channel, sampleIndex) {
        var userAgent = navigator.userAgent.toLowerCase(), config, extensionSampleIndex;
        if (/firefox/i.test(userAgent)) {
            if (sampleIndex >= 6) {
                audioObjectType = 5;
                config = new Array(4);
                extensionSampleIndex = sampleIndex - 3;
            }
            else {
                audioObjectType = 2;
                config = new Array(2);
                extensionSampleIndex = sampleIndex;
            }
        }
        else if (userAgent.indexOf('android') !== -1) {
            audioObjectType = 2;
            config = new Array(2);
            extensionSampleIndex = sampleIndex;
        }
        else {
            audioObjectType = 5;
            config = new Array(4);
            if (sampleIndex >= 6) {
                extensionSampleIndex = sampleIndex - 3;
            }
            else {
                if (channel === 1) {
                    audioObjectType = 2;
                    config = new Array(2);
                }
                extensionSampleIndex = sampleIndex;
            }
        }
        config[0] = audioObjectType << 3;
        config[0] |= (sampleIndex & 0x0e) >> 1;
        config[1] = (sampleIndex & 0x01) << 7;
        config[1] |= channel << 3;
        if (audioObjectType === 5) {
            config[1] |= (extensionSampleIndex & 0x0e) >> 1;
            config[2] = (extensionSampleIndex & 0x01) << 7;
            config[2] |= 2 << 2;
            config[3] = 0;
        }
        return config;
    };
    /**
     * 拼接媒体数据
     * @param buffer
     * @param ts
     */
    TSPackageES.Merge = function (buffer, ts) {
        var length = buffer.length - buffer.position, data, offset = length;
        ts.forEach(function (item) {
            length += item.body.buffer.length;
        });
        data = new Uint8Array(length);
        data.set(new Uint8Array(buffer.buffer, buffer.position), 0);
        ts.forEach(function (item) {
            buffer = item.body.buffer;
            data.set(new Uint8Array(buffer.buffer, buffer.position), offset);
            offset += buffer.length - buffer.position;
        });
        return data;
    };
    return TSPackageES;
}());
exports.default = TSPackageES;


/***/ }),

/***/ "./src/core/vkd/hls/ts/TSPackageHeader.ts":
/*!************************************************!*\
  !*** ./src/core/vkd/hls/ts/TSPackageHeader.ts ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var TSPackageHeader = /** @class */ (function () {
    function TSPackageHeader(stream) {
        this._stream = null;
        this._sync = -1;
        this._error = -1;
        this._payload = -1;
        this._priority = -1;
        this._pid = -1;
        this._scrambling = -1;
        this._adaptation = -1;
        this._continuity = -1;
        this._packet = '';
        this._stream = stream;
        this._sync = this._stream.readUint8();
        var next = this._stream.readUint16();
        this._error = next >>> 15;
        this._payload = next >>> 14 & 1;
        this._priority = next >>> 13 & 1;
        this._pid = next & 0x1fff;
        next = this._stream.readUint8();
        this._scrambling = next >> 6 & 0x3; //传输加扰控制, 00表示不加密
        /**
         * 00 ISO/IEC未来使用保留
         * 01 没有调整字段，仅含有184B有效净荷
         * 02 没有有效净荷，仅含有183B调整字段
         * 03 0~182B调整字段后为有效净荷
         */
        this._adaptation = next >> 4 & 0x3;
        this._continuity = next & 0xf;
        this._packet = this._pid === 0 ? 'PAT' : 'MEDIA';
    }
    Object.defineProperty(TSPackageHeader.prototype, "pid", {
        get: function () {
            return this._pid;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TSPackageHeader.prototype, "payload", {
        get: function () {
            return this._payload;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TSPackageHeader.prototype, "packet", {
        get: function () {
            return this._packet;
        },
        set: function (value) {
            this._packet = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TSPackageHeader.prototype, "adaptation", {
        get: function () {
            return this._adaptation;
        },
        enumerable: true,
        configurable: true
    });
    return TSPackageHeader;
}());
exports.default = TSPackageHeader;


/***/ }),

/***/ "./src/core/vkd/hls/ts/TSPackagePAT.ts":
/*!*********************************************!*\
  !*** ./src/core/vkd/hls/ts/TSPackagePAT.ts ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var BasePES_1 = __webpack_require__(/*! ./BasePES */ "./src/core/vkd/hls/ts/BasePES.ts");
var TSPackagePAT = /** @class */ (function (_super) {
    __extends(TSPackagePAT, _super);
    function TSPackagePAT(stream) {
        var _this = _super.call(this, stream) || this;
        _this._tabelID = -1;
        _this.parse();
        return _this;
    }
    Object.defineProperty(TSPackagePAT.prototype, "list", {
        get: function () {
            return this._list;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * 解析
     */
    TSPackagePAT.prototype.parse = function () {
        var next = this._stream.readUint8();
        this._stream.skip(next);
        next = this._stream.readUint8();
        this._tabelID = next;
        next = this._stream.readUint16();
        this._error = next >>> 7;
        this._zero = next >>> 6 & 1;
        this._sectionLength = next & 0xfff;
        this._streamID = this._stream.readUint16();
        this._current = this._stream.readUint8() & 1;
        this._sectionNumber = this._stream.readUint8();
        this._lastSectionNumber = this._stream.readUint8();
        var N = this._sectionLength - 9;
        var list = [];
        for (var i = 0; i < N; i += 4) {
            var programNumber = this._stream.readUint16();
            var pid = this._stream.readUint16() & 0x1fff;
            list.push({
                program: programNumber,
                pid: pid,
                type: programNumber === 0 ? 'network' : 'mapPID'
            });
        }
        this._list = list;
        // this._program = this._stream.readUint16();
        // this._pid = this._stream.readUint16();
        if (this._stream.dataView.byteLength - this._stream.position >= 4) {
            this._CRC32 = this._stream.readUint32();
        }
    };
    return TSPackagePAT;
}(BasePES_1.default));
exports.default = TSPackagePAT;


/***/ }),

/***/ "./src/core/vkd/hls/ts/TSPackagePES.ts":
/*!*********************************************!*\
  !*** ./src/core/vkd/hls/ts/TSPackagePES.ts ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var EventCenter_1 = __webpack_require__(/*! ../../../../events/EventCenter */ "./src/events/EventCenter.ts");
var ErrorTypeList_1 = __webpack_require__(/*! ../../../../config/ErrorTypeList */ "./src/config/ErrorTypeList.ts");
var EventLevel_1 = __webpack_require__(/*! ../../../../events/EventLevel */ "./src/events/EventLevel.ts");
var TSPackageES_1 = __webpack_require__(/*! ./TSPackageES */ "./src/core/vkd/hls/ts/TSPackageES.ts");
var TSPackagePES = /** @class */ (function () {
    function TSPackagePES(pes) {
        var _this = this;
        this._header = null;
        this._type = '';
        /**
         * 抛出异常事件
         */
        this.dispatchErrorEvent = function (message) {
            EventCenter_1.default.getInstance().dispatchOutwardEvent('PlayerError', {
                code: ErrorTypeList_1.ErrorTypeList.PLAYER_CORE_STREAM_PARSE_ERROR,
                level: EventLevel_1.EventLevel.ERROR,
                target: _this,
                message: message,
                data: null
            });
        };
        var _it = pes[0], _stream = _it.body.stream;
        var next = _stream.readUint24(); //start code 固定为 0x000001
        this._header = _it.header;
        if (next !== 1) {
            this.dispatchErrorEvent("ts parse error, this is not pes packet.");
        }
        else {
            var _streamID = _stream.readUint8();
            if (_streamID >= 0xe0 && _streamID <= 0xef) {
                this._type = 'video';
            }
            if (_streamID >= 0xc0 && _streamID <= 0xdf) {
                this._type = 'audio';
            }
            var _packetLength = _stream.readUint16();
            this._packetLength = _packetLength;
            if (this._type === 'video' || this._type === 'audio') {
                var next_1 = _stream.readUint8();
                var first = next_1 >>> 6;
                if (first !== 0x02) {
                    this.dispatchErrorEvent("error when parse pes header");
                }
                next_1 = _stream.readUint8();
                this._ptsDTSFlag = next_1 >>> 6;
                this._escrFlag = next_1 >>> 5 & 0x01;
                this._esRateFlag = next_1 >>> 4 & 0x01;
                this._dsmFlag = next_1 >>> 3 & 0x01;
                this._additionalFlag = next_1 >>> 2 & 0x01;
                this._crcFlag = next_1 >>> 1 & 0x01;
                this._extensionFlag = next_1 & 0x01;
                this._pesHeaderLength = _stream.readUint8();
                var _N1 = this._pesHeaderLength;
                if (this._ptsDTSFlag === 2) {
                    var pts = [];
                    next_1 = _stream.readUint8();
                    pts.push(next_1 >>> 1 & 0x07);
                    next_1 = _stream.readUint16();
                    pts.push(next_1 >>> 1);
                    next_1 = _stream.readUint16();
                    pts.push(next_1 >>> 1);
                    this._pts = (pts[0] << 30 | pts[1] << 15 | pts[2]);
                    _N1 -= 5;
                    // 视频如果没有dts用pts
                    if (this._type === 'video') {
                        this._dts = this._pts;
                    }
                }
                if (this._ptsDTSFlag === 3) {
                    var pts = [];
                    next_1 = _stream.readUint8();
                    pts.push(next_1 >>> 1 & 0x07);
                    next_1 = _stream.readUint16();
                    pts.push(next_1 >>> 1);
                    next_1 = _stream.readUint16();
                    pts.push(next_1 >>> 1);
                    this._pts = (pts[0] << 30 | pts[1] << 15 | pts[2]);
                    var dts = [];
                    next_1 = _stream.readUint8();
                    dts.push(next_1 >>> 1 & 0x07);
                    next_1 = _stream.readUint16();
                    dts.push(next_1 >>> 1);
                    next_1 = _stream.readUint16();
                    dts.push(next_1 >>> 1);
                    this._dts = (dts[0] << 30 | dts[1] << 15 | dts[2]);
                    _N1 -= 10;
                }
                if (this._escrFlag === 1) {
                    var escr = [], ex = [];
                    next_1 = _stream.readUint8();
                    escr.push(next_1 >>> 3 & 0x07);
                    escr.push(next_1 & 0x03);
                    next_1 = _stream.readUint16();
                    escr.push(next_1 >>> 13);
                    escr.push(next_1 & 0x03);
                    next_1 = _stream.readUint16();
                    escr.push(next_1 >>> 13);
                    ex.push(next_1 & 0x03);
                    next_1 = _stream.readUint8();
                    ex.push(next_1 >>> 1);
                    this._escr = (escr[0] << 30 | escr[1] << 28 | escr[2] << 15 | escr[3] << 13 | escr[4]) * 300 + (ex[0] << 7 | ex[1]);
                    _N1 -= 6;
                }
                if (this._esRateFlag === 1) {
                    next_1 = _stream.readUint24();
                    this._esRate = next_1 >>> 1 & 0x3fffff;
                    _N1 -= 3;
                }
                if (this._dsmFlag === 1) {
                    this.dispatchErrorEvent("not support DSM_trick_mode");
                }
                if (this._additionalFlag === 1) {
                    next_1 = _stream.readUint8();
                    this._additionalCopyInfo = next_1 & 0x7f;
                    _N1 -= 1;
                }
                if (this._crcFlag === 1) {
                    this._pesCRC = _stream.readUint16();
                    _N1 -= 2;
                }
                if (this._extensionFlag === 1) {
                    this.dispatchErrorEvent("not support extension");
                }
                if (_N1 > 0) {
                    _stream.skip(_N1);
                }
                this._ES = new TSPackageES_1.default(_stream, this._type, pes.slice(1));
            }
            else {
                this.dispatchErrorEvent("PES format is not supported");
            }
        }
    }
    Object.defineProperty(TSPackagePES.prototype, "type", {
        get: function () {
            return this._type;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TSPackagePES.prototype, "ES", {
        get: function () {
            return this._ES;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TSPackagePES.prototype, "dts", {
        get: function () {
            return this._dts;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TSPackagePES.prototype, "pts", {
        get: function () {
            return this._pts;
        },
        enumerable: true,
        configurable: true
    });
    TSPackagePES._errorCount = 0;
    return TSPackagePES;
}());
exports.default = TSPackagePES;


/***/ }),

/***/ "./src/core/vkd/hls/ts/TSPackagePMT.ts":
/*!*********************************************!*\
  !*** ./src/core/vkd/hls/ts/TSPackagePMT.ts ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 创建PMT实例
 */
var BasePES_1 = __webpack_require__(/*! ./BasePES */ "./src/core/vkd/hls/ts/BasePES.ts");
var TSPackagePMT = /** @class */ (function (_super) {
    __extends(TSPackagePMT, _super);
    function TSPackagePMT(stream) {
        var _this = _super.call(this, stream) || this;
        _this.parse();
        return _this;
    }
    Object.defineProperty(TSPackagePMT.prototype, "list", {
        get: function () {
            return this._list;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TSPackagePMT.prototype, "program", {
        get: function () {
            return this._program;
        },
        enumerable: true,
        configurable: true
    });
    TSPackagePMT.prototype.parse = function () {
        var next = this._stream.readUint8();
        this._stream.skip(next);
        next = this._stream.readUint8();
        this._tableID = next;
        next = this._stream.readUint16();
        this._sectionLength = next & 0xfff;
        this._program = this._stream.readUint16();
        this._current = this._stream.readUint8() & 1;
        this._order = this._stream.readUint8();
        this._lastOrder = this._stream.readUint8();
        this._PCR_PID = this._stream.readUint16() & 0x1fff;
        this._programLength = this._stream.readUint16() & 0xfff;
        var N = (this._sectionLength - 13) / 5;
        var list = [];
        for (var i = 0; i < N; i++) {
            list.push({
                streamType: this._stream.readUint8(),
                pid: this._stream.readUint16() & 0x1fff,
                es: this._stream.readUint16() & 0xfff
            });
        }
        this._list = list;
        if (this._stream.dataView.byteLength - this._stream.position >= 4) {
            this._CRC32 = this._stream.readUint32();
        }
    };
    return TSPackagePMT;
}(BasePES_1.default));
exports.default = TSPackagePMT;


/***/ }),

/***/ "./src/core/vkd/hls/ts/TSPackageTSDT.ts":
/*!**********************************************!*\
  !*** ./src/core/vkd/hls/ts/TSPackageTSDT.ts ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var BasePES_1 = __webpack_require__(/*! ./BasePES */ "./src/core/vkd/hls/ts/BasePES.ts");
var TSPackageTSDT = /** @class */ (function (_super) {
    __extends(TSPackageTSDT, _super);
    function TSPackageTSDT(stream) {
        var _this = _super.call(this, stream) || this;
        _this.parse();
        return _this;
    }
    TSPackageTSDT.prototype.parse = function () { };
    return TSPackageTSDT;
}(BasePES_1.default));
exports.default = TSPackageTSDT;


/***/ }),

/***/ "./src/core/vkd/mp4/BaseBox.ts":
/*!*************************************!*\
  !*** ./src/core/vkd/mp4/BaseBox.ts ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * mp4 box组装类
 */
var Stream_1 = __webpack_require__(/*! ../Stream */ "./src/core/vkd/Stream.ts");
var Box_1 = __webpack_require__(/*! ./Box */ "./src/core/vkd/mp4/Box.ts");
var UTC_1 = __webpack_require__(/*! ../UTC */ "./src/core/vkd/UTC.ts");
var BaseBox = /** @class */ (function () {
    function BaseBox() {
        this._subBox = [];
        //构造函数
    }
    Object.defineProperty(BaseBox.prototype, "start", {
        get: function () {
            return this._start;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseBox.prototype, "size", {
        get: function () {
            return this._size;
        },
        set: function (value) {
            this._size = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseBox.prototype, "type", {
        get: function () {
            return this._type;
        },
        set: function (value) {
            this._type = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseBox.prototype, "subBox", {
        get: function () {
            return this._subBox;
        },
        set: function (value) {
            this._subBox = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseBox.prototype, "data", {
        get: function () {
            return this._data;
        },
        set: function (value) {
            this._data = value;
        },
        enumerable: true,
        configurable: true
    });
    BaseBox.prototype.avc1 = function () {
        var stream = new Stream_1.default(this.data);
        var self = this;
        stream.skip(6);
        this.dataReferenceIndex = stream.readUint16();
        stream.skip(16);
        this.width = stream.readUint16();
        this.height = stream.readUint16();
        this.horizresolution = stream.readUint32();
        this.vertresolution = stream.readUint32();
        stream.skip(4);
        this.frameCount = stream.readUint16();
        stream.skip(1);
        for (var i = 0; i < 31; i++) {
            String.fromCharCode(stream.readUint8());
        }
        this.depth = stream.readUint16();
        stream.skip(2);
        while (stream.position < stream.buffer.byteLength - 8) {
            var box = new Box_1.default();
            box.readHeader(stream);
            self.subBox.push(box);
            box.readBody(stream);
        }
        delete this.data;
        stream = null;
    };
    BaseBox.prototype.avcC = function () {
        var stream = new Stream_1.default(this.data);
        this.configVersion = stream.readUint8();
        this.profile = stream.readUint8();
        this.profileCompatibility = stream.readUint8();
        this.AVCLevelIndication = stream.readUint8();
        this.lengthSizeMinusOne = (stream.readUint8() & 3) + 1;
        this.numOfSequenceParameterSets = stream.readUint8() & 31;
        var sequenceLength = stream.readUint16();
        this.sequenceLength = sequenceLength;
        var sequence = [];
        for (var i = 0; i < sequenceLength; i++) {
            sequence.push(Number(stream.readUint8()).toString(16));
        }
        this.ppsCount = stream.readUint8();
        var ppsLength = stream.readUint16();
        this.ppsLength = ppsLength;
        var pps = [];
        for (var i = 0; i < ppsLength; i++) {
            pps.push(Number(stream.readUint8()).toString(16));
        }
        this.pps = pps;
        this.sequence = sequence;
        var last = [];
        var dataViewLength = stream.dataView.byteLength;
        while (stream.position < dataViewLength) {
            last.push(stream.readUint8());
        }
        this.last = last;
        delete this.subBox;
        delete this.data;
        stream = null;
    };
    BaseBox.prototype.btrt = function () {
        var stream = new Stream_1.default(this.data);
        this.bufferSizeDB = stream.readUint32();
        this.maxBitrate = stream.readUint32();
        this.avgBitrate = stream.readUint32();
        delete this.subBox;
        delete this.data;
        stream = null;
    };
    BaseBox.prototype.co64 = function () {
        var stream = new Stream_1.default(this.data);
        this.version = stream.readUint8();
        this.flag = stream.readByte(3);
        this.count = stream.readUint32();
        var entries = [];
        this.entries = entries;
        for (var i = 0, count = this.count; i < count; i++) {
            entries.push(stream.readUint64());
        }
        delete this.subBox;
        delete this.data;
        stream = null;
    };
    BaseBox.prototype.ctts = function () {
        var stream = new Stream_1.default(this.data);
        this.version = stream.readUint8();
        this.flag = stream.readByte(3);
        this.entryCount = stream.readUint32();
        var entry = [];
        this.entry = entry;
        for (var i = 0, count = this.entryCount; i < count; i++) {
            entry.push({
                count: stream.readUint32(),
                offset: stream.readUint32()
            });
        }
        delete this.subBox;
        delete this.data;
        stream = null;
    };
    BaseBox.prototype.dref = function () {
        var stream = new Stream_1.default(this.data);
        this.version = stream.readUint8();
        this.flag = stream.readByte(3);
        var entryCount = stream.readUint32();
        this.entryCount = entryCount;
        var self = this;
        // 暂时不支持离散视频，视频的部分内容由url指定
        for (var i = 0; i < entryCount; i++) {
            var box = new Box_1.default();
            self.subBox.push(box);
            box.read(stream);
        }
        delete this.data;
        stream = null;
    };
    BaseBox.prototype.elst = function () {
        var stream = new Stream_1.default(this.data);
        this.version = stream.readUint8();
        this.flag = stream.readByte(3);
        var entries = [];
        var entry_count = stream.readUint32();
        this.entries = entries;
        for (var i = 0; i < entry_count; i++) {
            var entry = {};
            entries.push(entry);
            if (this.version === 1) {
                entry.segment_duration = stream.readUint64();
                entry.media_time = stream.readUint64();
            }
            else {
                entry.segment_duration = stream.readUint32();
                entry.media_time = stream.readInt32();
            }
            entry.media_rate_integer = stream.readInt16();
            entry.media_rate_fraction = stream.readInt16();
        }
        delete this.subBox;
        delete this.data;
        stream = null;
    };
    BaseBox.prototype.esds = function () {
        var stream = new Stream_1.default(this.data);
        this.version = stream.readUint8();
        this.flag = stream.readByte(3);
        var box = Box_1.default.MP4ESDescrTag(stream);
        this.subBox.push(box);
        delete this.data;
        stream = null;
    };
    BaseBox.prototype.ftyp = function () {
        var stream = new Stream_1.default(this.data);
        this.major_brand = String.fromCharCode(stream.readUint8(), stream.readUint8(), stream.readUint8(), stream.readUint8());
        this.minor_version = stream.readUint32();
        var compatibleBrands = [];
        for (var i = 0, len = Math.floor((stream.buffer.byteLength - 8) / 4); i < len; i++) {
            compatibleBrands.push(String.fromCharCode(stream.readUint8(), stream.readUint8(), stream.readUint8(), stream.readUint8()));
        }
        this.compatible_brands = compatibleBrands;
        stream = null;
        delete this.subBox;
        delete this.data;
    };
    BaseBox.prototype.hdlr = function () {
        var stream = new Stream_1.default(this.data);
        this.version = stream.readUint8();
        this.flag = stream.readByte(3);
        stream.skip(4);
        this.handleType = "" + String.fromCharCode(stream.readUint8()) + String.fromCharCode(stream.readUint8()) + String.fromCharCode(stream.readUint8()) + String.fromCharCode(stream.readUint8());
        stream.skip(12);
        var name = [];
        while (stream.position < this.size - 8) {
            name.push(String.fromCharCode(stream.readUint8()));
        }
        this.name = name.join('');
        delete this.subBox;
        delete this.data;
        stream = null;
    };
    BaseBox.prototype.hmhd = function () {
    };
    BaseBox.prototype.iods = function () {
        var stream = new Stream_1.default(this.data);
        this.version = stream.readUint8();
        this.flag = stream.readByte(3);
        var content = [];
        var length = stream.buffer.byteLength;
        while (stream.position < length) {
            content.push(stream.readUint8());
        }
        this.content = content;
        delete this.subBox;
        delete this.data;
        stream = null;
    };
    BaseBox.prototype.mdat = function () {
        delete this.subBox;
    };
    BaseBox.prototype.mdhd = function () {
        var stream = new Stream_1.default(this.data);
        this.version = stream.readUint8();
        this.flag = stream.readByte(3);
        if (this.version === 1) {
            this.create = stream.readUint64();
            this.modify = stream.readUint64();
            this.createTime = new UTC_1.default().setTime(this.create * 1000);
            this.modifyTime = new UTC_1.default().setTime(this.modify * 1000);
            this.timeScale = stream.readUint32();
            this.duration = stream.readUint64();
        }
        else {
            this.create = stream.readUint32();
            this.modify = stream.readUint32();
            this.createTime = new UTC_1.default().setTime(this.create * 1000);
            this.modifyTime = new UTC_1.default().setTime(this.modify * 1000);
            this.timeScale = stream.readUint32();
            this.duration = stream.readUint32();
        }
        this.language = stream.readUint16();
        stream.readUint16();
        delete this.subBox;
        delete this.data;
        stream = null;
    };
    BaseBox.prototype.mfhd = function () {
    };
    ;
    BaseBox.prototype.mp4a = function () {
        var stream = new Stream_1.default(this.data);
        stream.skip(6);
        this.dataReferenceIndex = stream.readUint16();
        stream.skip(8);
        this.channelCount = stream.readUint16();
        this.sampleSize = stream.readUint16();
        stream.skip(4);
        this.sampleRate = stream.readUint32() >>> 16;
        var box = new Box_1.default();
        box.readHeader(stream);
        this.subBox.push(box);
        box.readBody(stream);
        delete this.data;
        stream = null;
    };
    BaseBox.prototype.mvhd = function () {
        var stream = new Stream_1.default(this.data);
        this.version = stream.readUint8();
        this.flag = stream.readByte(3);
        if (this.version === 1) {
            this.create = stream.readUint64();
            this.modify = stream.readUint64();
            this.timeScale = stream.readUint32();
            this.duration = stream.readUint64();
        }
        else {
            this.create = stream.readUint32();
            this.modify = stream.readUint32();
            this.timeScale = stream.readUint32();
            this.duration = stream.readUint32();
        }
        this.createTime = new UTC_1.default().setTime(this.create * 1000);
        this.modifyTime = new UTC_1.default().setTime(this.modify * 1000);
        this.rate = stream.readUint16() + '.' + stream.readUint16();
        this.volume = stream.readUint8() + '.' + stream.readUint8();
        stream.skip(10);
        var matrix = [];
        for (var i = 0; i < 9; i++) {
            matrix.push(stream.readUint16() + '.' + stream.readUint16());
        }
        this.matrix = matrix;
        stream.skip(24);
        this.nextTrackID = stream.readUint32();
        delete this.subBox;
        delete this.data;
    };
    BaseBox.prototype.nmhd = function () {
    };
    BaseBox.prototype.pasp = function () {
        var stream = new Stream_1.default(this.data);
        this.content = stream.buffer.slice(0, this.size - 8);
        delete this.subBox;
        delete this.data;
        stream = null;
    };
    BaseBox.prototype.sbgp = function () {
    };
    BaseBox.prototype.sdtp = function () {
    };
    BaseBox.prototype.smhd = function () {
        var stream = new Stream_1.default(this.data);
        this.version = stream.readUint8();
        this.flag = stream.readByte(3);
        this.balance = stream.readInt8() + '.' + stream.readInt8();
        delete this.subBox;
        delete this.data;
        stream = null;
    };
    BaseBox.prototype.stco = function () {
        var stream = new Stream_1.default(this.data);
        this.version = stream.readUint8();
        this.flag = stream.readByte(3);
        this.count = stream.readUint32();
        var entries = [];
        this.entries = entries;
        for (var i = 0, count = this.count; i < count; i++) {
            entries.push(stream.readUint32());
        }
        delete this.subBox;
        delete this.data;
        stream = null;
    };
    BaseBox.prototype.stsc = function () {
        var stream = new Stream_1.default(this.data);
        this.version = stream.readUint8();
        this.flag = stream.readByte(3);
        this.count = stream.readUint32();
        var entries = [];
        this.entries = entries;
        for (var i = 0, count = this.count; i < count; i++) {
            entries.push({
                first_chunk: stream.readUint32(),
                samples_per_chunk: stream.readUint32(),
                sample_desc_index: stream.readUint32()
            });
        }
        for (var i = 0, count = this.count, entry = void 0, preEntry = void 0; i < count - 1; i++) {
            entry = entries[i];
            preEntry = entries[i - 1];
            entry.chunk_count = entries[i + 1].first_chunk - entry.first_chunk;
            entry.first_sample = i === 0 ? 1 : preEntry.first_sample + preEntry.chunk_count * preEntry.samples_per_chunk;
        }
        if (this.count === 1) {
            var entry = entries[0];
            entry.first_sample = 1;
            entry.chunk_count = 0;
        }
        else if (this.count > 1) {
            var last = entries[this.count - 1];
            var pre = entries[this.count - 2];
            last.first_sample = pre.first_sample + pre.chunk_count * pre.samples_per_chunk;
            last.chunk_count = 0;
        }
        delete this.subBox;
        delete this.data;
        stream = null;
    };
    BaseBox.prototype.stsd = function () {
        var stream = new Stream_1.default(this.data);
        this.version = stream.readUint8();
        this.flag = stream.readByte(3);
        this.entryCount = stream.readUint32();
        var box = new Box_1.default();
        box.readHeader(stream);
        this.subBox.push(box);
        box.readBody(stream);
        delete this.data;
        stream = null;
    };
    BaseBox.prototype.stsh = function () {
    };
    BaseBox.prototype.stss = function () {
        var stream = new Stream_1.default(this.data);
        this.version = stream.readUint8();
        this.flag = stream.readByte(3);
        this.count = stream.readUint32();
        var entries = [];
        this.entries = entries;
        for (var i = 0, count = this.count; i < count; i++) {
            entries.push(stream.readUint32());
        }
        delete this.subBox;
        delete this.data;
        stream = null;
    };
    BaseBox.prototype.stsz = function () {
        var stream = new Stream_1.default(this.data);
        this.version = stream.readUint8();
        this.flag = stream.readByte(3);
        this.sampleSize = stream.readUint32();
        this.count = stream.readUint32();
        if (this.sampleSize === 0) {
            var entries = [];
            this.entries = entries;
            for (var i = 0, count = this.count; i < count; i++) {
                entries.push(stream.readUint32());
            }
        }
        delete this.subBox;
        delete this.data;
        stream = null;
    };
    BaseBox.prototype.stts = function () {
        var stream = new Stream_1.default(this.data);
        this.version = stream.readUint8();
        this.flag = stream.readByte(3);
        this.count = stream.readUint32();
        var entry = [];
        for (var i = 0, count = this.count; i < count; i++) {
            entry.push({
                sampleCount: stream.readUint32(),
                sampleDuration: stream.readUint32()
            });
        }
        this.entry = entry;
        delete this.subBox;
        delete this.data;
        stream = null;
    };
    BaseBox.prototype.stz2 = function () {
    };
    BaseBox.prototype.tfhd = function () {
    };
    BaseBox.prototype.tkhd = function () {
        var stream = new Stream_1.default(this.data);
        this.version = stream.readUint8();
        this.flag = stream.readByte(3);
        if (this.version === 1) {
            this.create = stream.readUint64();
            this.modify = stream.readUint64();
            this.trackID = stream.readUint32();
            this.reserverd = stream.readUint32();
            this.duration = stream.readUint64();
        }
        else {
            this.create = stream.readUint32();
            this.modify = stream.readUint32();
            this.trackID = stream.readUint32();
            this.reserverd = stream.readUint32();
            this.duration = stream.readUint32();
        }
        this.createTime = new UTC_1.default().setTime(this.create * 1000);
        this.modifyTime = new UTC_1.default().setTime(this.modify * 1000);
        stream.readUint64();
        this.layer = stream.readInt16();
        this.alternate_group = stream.readInt16();
        this.volume = stream.readInt16() >> 8;
        stream.readUint16();
        var matrix = [];
        for (var i = 0; i < 9; i++) {
            matrix.push(stream.readUint16() + '.' + stream.readUint16());
        }
        this.matrix = matrix;
        this.width = stream.readUint16() + '.' + stream.readUint16();
        this.height = stream.readUint16() + '.' + stream.readUint16();
        delete this.data;
        delete this.subBox;
        stream = null;
    };
    BaseBox.prototype.traf = function () {
    };
    BaseBox.prototype.turn = function () {
    };
    BaseBox.prototype.udta = function () {
        delete this.subBox;
    };
    BaseBox.prototype.url = function () {
        var stream = new Stream_1.default(this.data);
        this.version = stream.readUint8();
        this.flag = [stream.readUint8(), stream.readUint8(), stream.readUint8()];
        var location = [];
        var length = stream.buffer.byteLength;
        while (stream.position < length) {
            location.push(stream.readUint8());
        }
        this.location = location;
        delete this.subBox;
        delete this.data;
        stream = null;
    };
    BaseBox.prototype.vmhd = function () {
        var stream = new Stream_1.default(this.data);
        this.version = stream.readUint8();
        this.flag = [stream.readUint8(), stream.readUint8(), stream.readUint8()];
        this.graphicsmode = stream.readUint16();
        this.opcolor = [stream.readUint16(), stream.readUint16(), stream.readUint16()];
        delete this.subBox;
        delete this.data;
        stream = null;
    };
    BaseBox._boxList = ['moov', 'trak', 'edts', 'mdia', 'minf', 'dinf', 'stbl', 'mvex', 'moof', 'traf', 'mfra'];
    return BaseBox;
}());
exports.default = BaseBox;


/***/ }),

/***/ "./src/core/vkd/mp4/Box.ts":
/*!*********************************!*\
  !*** ./src/core/vkd/mp4/Box.ts ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var BaseBox_1 = __webpack_require__(/*! ./BaseBox */ "./src/core/vkd/mp4/BaseBox.ts");
var Stream_1 = __webpack_require__(/*! ../Stream */ "./src/core/vkd/Stream.ts");
var MathUtils_1 = __webpack_require__(/*! ../../../utils/MathUtils */ "./src/utils/MathUtils.ts");
var RuntimeLog_1 = __webpack_require__(/*! ../../../log/RuntimeLog */ "./src/log/RuntimeLog.ts");
var Box = /** @class */ (function (_super) {
    __extends(Box, _super);
    function Box() {
        return _super.call(this) || this;
    }
    Box.MP4DecConfigDescrTag = function (stream) {
        var box = new Box();
        var size;
        box.type = stream.readUint8();
        size = stream.readUint8();
        if (size === 0x80) {
            box.extend = true;
            stream.skip(2);
            size = stream.readUint8() + 5;
        }
        else {
            size += 2;
        }
        box.size = size;
        box.typeID = stream.readUint8();
        // 6 bits stream type,1 bit upstream flag,1 bit reserved flag
        box.streamUint = stream.readUint8();
        box.bufferSize = stream.readByte(3);
        box.maximum = stream.readUint32();
        box.average = stream.readUint32();
        box.subBox.push(Box.MP4DecSpecificDescrTag(stream));
        return box;
    };
    Box.MP4DecSpecificDescrTag = function (stream) {
        var box = new Box();
        var size, dataSize;
        box.type = stream.readUint8();
        size = stream.readUint8();
        if (size === 0x80) {
            box.extend = true;
            stream.skip(2);
            size = stream.readUint8() + 5;
            dataSize = size - 5;
        }
        else {
            dataSize = size;
            size += 2;
        }
        box.size = size;
        var EScode = [];
        for (var i = 0; i < dataSize; i++) {
            EScode.push(Number(stream.readUint8()).toString(16).padStart(2, '0'));
        }
        box.EScode = EScode;
        delete box.subBox;
        return box;
    };
    /**
     * 递归查找指定类型box
     * @param root
     * @param {string} type
     * @param {Box[]} result
     */
    Box.findBox = function (root, type, result) {
        if (result === void 0) { result = []; }
        if (!root)
            return null;
        if (root.type !== type) {
            if (root && root.subBox) {
                var boxArray = root.subBox.filter(function (item) { return item.type === type; });
                if (boxArray.length) {
                    boxArray.forEach(function (item) {
                        result.push(item);
                    });
                }
                else {
                    root.subBox.forEach(function (item) {
                        Box.findBox(item, type, result);
                    });
                }
            }
        }
        else {
            result.push(root);
        }
        result.concat(result);
        return result.length > 1 ? result : result[0];
    };
    /**
     * 通过时间获取 sample
     * @param {IObject[]} stts
     * @param {number} timeScale
     * @param {number} time
     */
    Box.seekOrderSampleByTime = function (stts, timeScale, time) {
        var startTime = 0;
        var order = 0;
        var count = 0;
        var itemDuration = 0;
        stts.every(function (item) {
            itemDuration = item.sampleCount * item.sampleDuration / timeScale;
            if (time <= startTime + itemDuration) {
                var _countInItem = Math.ceil((time - startTime) * timeScale / item.sampleDuration);
                order = count + _countInItem;
                startTime = startTime + _countInItem * item.sampleDuration / timeScale;
                return false;
            }
            else {
                startTime += itemDuration;
                count += item.sampleCount;
                return true;
            }
        });
        return { order: order, startTime: startTime };
    };
    /**
     * 获取 trak duration
     * @param {Box} trak
     * @param {number} timeScale
     * @returns {string}
     */
    Box.seekTrakDuration = function (trak, timeScale) {
        if (!trak)
            return '0';
        var stts = Box.findBox(trak, 'stts');
        var duration = 0;
        stts.entry.forEach(function (item) {
            duration += item.sampleCount * item.sampleDuration;
        });
        return Number(duration / timeScale).toFixed(4);
    };
    /**
     * 获取第 order 片的 sample 时间和长度信息
     * @param {Box} stts
     * @param {Box} ctts
     * @param {number} order
     * @returns {IObject}
     */
    Box.seekSampleTime = function (stts, ctts, order) {
        var time, duration = 0;
        var count = 0, startTime = 0;
        var offset = 0;
        stts.entry.every(function (item) {
            duration = item.sampleDuration;
            if (order < count + item.sampleCount) {
                time = startTime + (order - count) * duration;
                return false;
            }
            else {
                count += item.sampleCount;
                startTime += item.sampleCount * duration;
                return true;
            }
        });
        if (ctts) {
            var ct_1 = 0;
            ctts.entry.every(function (item) {
                ct_1 += item.count;
                if (order < ct_1) {
                    offset = item.offset;
                    return false;
                }
                else {
                    return true;
                }
            });
        }
        if (!time)
            time = startTime + (order - count) * duration;
        return { time: time, duration: duration, offset: offset };
    };
    /**
     * 计算音视频数据在 mdat 中的偏移量
     * @param {Box} stsc
     * @param {Box} stco
     * @param {Box} stsz
     * @param {number} order
     * @param {number} mdatStart
     */
    Box.seekSampleOffset = function (stsc, stco, stsz, order, mdatStart) {
        var chunkOffset = Box.stscOffset(stsc, order + 1);
        var result = stco.entries[chunkOffset.chunk_index - 1] +
            MathUtils_1.default.sum.apply(null, stsz.entries.slice(chunkOffset.samples_offset[0] - 1, chunkOffset.samples_offset[1] - 1)) - mdatStart;
        if (result === undefined) {
            throw new Error("result=" + result + ",stco.length=" + stco.entries.length + ",sum=" + MathUtils_1.default.sum.apply(null, stsz.entries.slice(0, order)));
        }
        else if (result < 0) {
            throw new Error("result=" + result + ",stco.length=" + stco.entries.length + ",sum=" + MathUtils_1.default.sum.apply(null, stsz.entries.slice(0, order)));
        }
        return result;
    };
    /**
     * 计算音视频数据在 chunk 中的偏移量
     * @param {Box} stsc
     * @param {number} sample_order
     */
    Box.stscOffset = function (stsc, sample_order) {
        var chunk_index;
        var samples_offset = [];
        // 计算sample在第几组chunk中
        var chunk_start = stsc.entries.filter(function (item) {
            return item.first_sample <= sample_order && sample_order < item.first_sample + item.chunk_count * item.samples_per_chunk;
        })[0];
        //由于stsc默认的解析逻辑把最后一个chunk的count设置成了0 所以如果在前面的chunk中没能找到sample的偏移量 需要到最后一个chunk中再次查找
        if (!chunk_start) {
            var last_chunk = stsc.entries.pop();
            stsc.entries.push(last_chunk);
            var chunk_offset = Math.floor((sample_order - last_chunk.first_sample) / last_chunk.samples_per_chunk);
            var last_chunk_index = last_chunk.first_chunk + chunk_offset;
            var last_chunk_first_sample = last_chunk.first_sample + last_chunk.samples_per_chunk * chunk_offset;
            return {
                chunk_index: last_chunk_index,
                samples_offset: [last_chunk_first_sample, sample_order]
            };
        }
        else {
            //计算在本组第几个 chunk 中
            var chunk_offset = Math.floor((sample_order - chunk_start.first_sample) / chunk_start.samples_per_chunk);
            //计算 sample 偏移
            var chunk_offset_sample = chunk_start.first_sample + chunk_offset * chunk_start.samples_per_chunk;
            chunk_index = chunk_start.first_chunk + chunk_offset;
            samples_offset = [chunk_offset_sample, sample_order];
            return {
                chunk_index: chunk_index,
                samples_offset: samples_offset
            };
        }
    };
    /**
     * 解析header
     * @param {Stream} stream
     */
    Box.prototype.readHeader = function (stream) {
        //header
        this._start = stream.position;
        this._size = stream.readUint32();
        this._type = String.fromCodePoint(stream.readUint8(), stream.readUint8(), stream.readUint8(), stream.readUint8());
        if (this._size === 1) {
            this._size = stream.readUint64();
        }
        else if (this._size === 0) {
            if (this._type !== 'mdat') {
                throw new Error('parse mp4 mdat Box failed');
            }
        }
        if (this._type === 'uuid') {
            var uuid = [];
            for (var i = 0; i < 16; i++) {
                uuid.push(stream.readUint8());
            }
        }
    };
    /**
     * 解析body
     * @param {Stream} stream
     */
    Box.prototype.readBody = function (stream) {
        var endSize = this._size - stream.position + this._start;
        var type = this._type;
        this._data = stream.buffer.slice(stream.position, stream.position + endSize);
        stream.position += this._data.byteLength;
        if (BaseBox_1.default._boxList.find(function (item) { return item === type; })) {
            //容器box解析器
            this.parseContainerBox();
        }
        else {
            //内容box解析器
            if (typeof this[type] === 'function') {
                try {
                    this[type].call(this);
                }
                catch (e) {
                    throw e;
                }
            }
            else {
                RuntimeLog_1.default.getInstance().warning("mp4 cannot parse Box type " + type);
            }
        }
    };
    /**
     * 解析容器box
     */
    Box.prototype.parseContainerBox = function () {
        var stream = new Stream_1.default(this._data);
        var size = stream.buffer.byteLength;
        while (stream.position < size) {
            var box = new Box();
            box.readHeader(stream);
            this._subBox.push(box);
            box.readBody(stream);
        }
        delete this._data;
        stream = null;
    };
    /**
     * 解析
     * @param {Stream} stream
     */
    Box.prototype.read = function (stream) {
        this.readHeader(stream);
        this.readBody(stream);
    };
    /**
     * 释放trakbox 减小内存占用
     */
    Box.prototype.freeTraksbox = function () {
        var _this = this;
        if (!this.subBox.length)
            return;
        this.subBox.forEach(function (item, idx) {
            if (item.type === 'trak') {
                delete _this.subBox[idx];
            }
        });
    };
    Box.MP4ESDescrTag = function (stream) {
        var box = new Box();
        var size;
        box.type = stream.readUint8();
        size = stream.readUint8();
        if (size === 0x80) {
            box.extend = true;
            stream.skip(2);
            size = stream.readUint8() + 5;
        }
        else {
            size += 2;
        }
        box.size = size;
        box.esID = stream.readUint16();
        box.priority = stream.readUint8();
        box.subBox.push(Box.MP4DecConfigDescrTag(stream));
        box.subBox.push(Box.SLConfigDescriptor(stream));
        return box;
    };
    Box.SLConfigDescriptor = function (stream) {
        var box = new Box();
        var size;
        box.type = stream.readUint8();
        size = stream.readUint8();
        if (size === 0x80) {
            box.extend = true;
            stream.skip(2);
            size = stream.readUint8() + 5;
        }
        else {
            size += 2;
        }
        box.size = size;
        box.SL = stream.readUint8();
        delete box.subBox;
        return box;
    };
    return Box;
}(BaseBox_1.default));
exports.default = Box;


/***/ }),

/***/ "./src/core/vkd/mp4/MP4.ts":
/*!*********************************!*\
  !*** ./src/core/vkd/mp4/MP4.ts ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * mp4组装器
 */
var MediaInfoTask_1 = __webpack_require__(/*! ./MediaInfoTask */ "./src/core/vkd/mp4/MediaInfoTask.ts");
var EventEmitter = __webpack_require__(/*! eventemitter3 */ "./node_modules/eventemitter3/index.js");
var Parse_1 = __webpack_require__(/*! ./Parse */ "./src/core/vkd/mp4/Parse.ts");
var ErrorTypeList_1 = __webpack_require__(/*! ../../../config/ErrorTypeList */ "./src/config/ErrorTypeList.ts");
var EventLevel_1 = __webpack_require__(/*! ../../../events/EventLevel */ "./src/events/EventLevel.ts");
var Box_1 = __webpack_require__(/*! ./Box */ "./src/core/vkd/mp4/Box.ts");
var MathUtils_1 = __webpack_require__(/*! ../../../utils/MathUtils */ "./src/utils/MathUtils.ts");
var DeepClone = __webpack_require__(/*! lodash/cloneDeep */ "./node_modules/lodash/cloneDeep.js");
var RuntimeLog_1 = __webpack_require__(/*! ../../../log/RuntimeLog */ "./src/log/RuntimeLog.ts");
var EventCenter_1 = __webpack_require__(/*! ../../../events/EventCenter */ "./src/events/EventCenter.ts");
var FMP4Worker_1 = __webpack_require__(/*! ../FMP4Worker */ "./src/core/vkd/FMP4Worker.ts");
var EventBus_1 = __webpack_require__(/*! ../../../events/EventBus */ "./src/events/EventBus.ts");
var EventNames_1 = __webpack_require__(/*! ../../../events/EventNames */ "./src/events/EventNames.ts");
var DownloadBlockSize = Math.pow(25, 4);
var MP4 = /** @class */ (function (_super) {
    __extends(MP4, _super);
    function MP4(url) {
        var _this = _super.call(this) || this;
        _this._videoTrak = [];
        _this._audioTrak = [];
        _this._timeRange = [];
        _this._videoOnly = false;
        _this._typeBox = {
            video: {
                stsc: null,
                stsz: null,
                stts: null,
                stco: null,
                ctts: null
            },
            audio: {
                stsc: null,
                stsz: null,
                stts: null,
                stco: null,
                ctts: null
            }
        };
        /**
         * 发送错误事件
         * @param {IObject} code
         * @param {string} message
         * @param data
         */
        _this.dispatchErrorEvent = function (message, data, code) {
            if (message === void 0) { message = ''; }
            if (data === void 0) { data = null; }
            var errorObj = {
                code: code || ErrorTypeList_1.ErrorTypeList.PLAYER_CORE_MP4_ERROR,
                level: EventLevel_1.EventLevel.ERROR,
                target: _this,
                message: message,
                data: data
            };
            EventCenter_1.default.getInstance().dispatchOutwardEvent('PlayerError', errorObj);
        };
        /**
         * 解析moov视频信息
         */
        _this.moovParse = function () {
            RuntimeLog_1.default.getInstance().log('(mp4) media info data start prasing...');
            var videoTrak, audioTrak;
            var videoCodec = '', audioCodec = '';
            var videoTimeScale, audioTimeScale;
            var sps, pps, profile, width, height;
            var channelCount, sampleRate, decoderConfig;
            var mvhd = Box_1.default.findBox(_this._moovBox, 'mvhd');
            var traks = Box_1.default.findBox(_this._moovBox, 'trak');
            _this._moovBox.freeTraksbox();
            traks = [].concat(traks);
            traks.forEach(function (trak) {
                var hdlr = Box_1.default.findBox(trak, 'hdlr');
                var mdhd = Box_1.default.findBox(trak, 'mdhd');
                if (!hdlr || !mdhd) {
                    _this.dispatchErrorEvent("mp4 parse can not find hdlr: " + hdlr + " | mdhd: " + mdhd);
                    return;
                }
                var stsd = Box_1.default.findBox(trak, 'stsd');
                var codecBox = stsd.subBox[0];
                if (hdlr.handleType === 'vide') {
                    var avcC = Box_1.default.findBox(trak, 'avcC');
                    var tkhd = Box_1.default.findBox(trak, 'tkhd');
                    videoTrak = trak;
                    videoTimeScale = mdhd.timeScale;
                    if (avcC) {
                        videoCodec = codecBox.type + ". " + MathUtils_1.default.toHex(avcC.profile, avcC.profileCompatibility, avcC.AVCLevelIndication).join('');
                        sps = avcC.sequence && avcC.sequence.map(function (item) { return Number("0x" + item); });
                        pps = avcC.pps && avcC.pps.map(function (item) { return Number("0x" + item); });
                        profile = avcC.profile;
                    }
                    else {
                        videoCodec = codecBox.type;
                    }
                    if (tkhd) {
                        width = tkhd.width;
                        height = tkhd.height;
                    }
                }
                if (hdlr.handleType === 'soun') {
                    audioTrak = trak;
                    var esds = Box_1.default.findBox(trak, 'esds');
                    var mp4a = Box_1.default.findBox(trak, 'mp4a');
                    var ESDescriptor = Box_1.default.findBox(trak, 5);
                    audioTimeScale = mdhd.timeScale;
                    if (esds) {
                        audioCodec = codecBox.type + ". " + MathUtils_1.default.toHex(esds.subBox[0].subBox[0].typeID) + ("." + esds.subBox[0].subBox[0].subBox[0].type);
                    }
                    else {
                        audioCodec = codecBox.type;
                    }
                    if (ESDescriptor && ESDescriptor.EScode) {
                        decoderConfig = ESDescriptor.EScode.map(function (item) { return Number("0x" + item); });
                    }
                    if (mp4a) {
                        channelCount = mp4a.channelCount;
                        sampleRate = mp4a.sampleRate;
                    }
                }
            });
            _this._videoTrak = DeepClone(videoTrak);
            _this._audioTrak = DeepClone(audioTrak);
            var mdat = _this._boxes.find(function (item) { return item.type === 'mdat'; });
            var videoDuration = Number(Box_1.default.seekTrakDuration(videoTrak, videoTimeScale));
            var audioDuration = Number(Box_1.default.seekTrakDuration(audioTrak, audioTimeScale));
            _this._mdatStart = mdat.start;
            var vf = _this.videoKeyFrames;
            var videoKeyFramesLg = vf.length - 1;
            vf.forEach(function (item, idx) {
                if (idx < videoKeyFramesLg) {
                    _this._timeRange.push([
                        item.time.time / videoTimeScale,
                        vf[idx + 1].time.time / videoTimeScale
                    ]);
                }
                else {
                    _this._timeRange.push([
                        item.time.time / videoTimeScale,
                        -1
                    ]);
                }
            });
            if (!audioCodec) {
                _this._videoOnly = true;
            }
            _this._meta = {
                videoCodec: videoCodec,
                audioCodec: audioCodec,
                createTime: mvhd.createTime,
                modifyTime: mvhd.modifyTime,
                duration: mvhd.duration / mvhd.timeScale,
                timeScale: mvhd.timeScale,
                videoDuration: videoDuration,
                videoTimeScale: videoTimeScale,
                audioDuration: audioDuration,
                audioTimeScale: audioTimeScale,
                endTime: _this._videoOnly ? Number(videoDuration) : Math.min(Number(videoDuration), Number(audioDuration)),
                sps: sps,
                pps: pps,
                width: width,
                height: height,
                profile: profile,
                pixelRatio: [
                    1, 1
                ],
                channelCount: channelCount,
                sampleRate: sampleRate,
                audioConfig: decoderConfig,
                videoOnly: _this._videoOnly
            };
            //发送媒体信息解析完毕事件
            _this.emit('moovParseEnd', {
                audioCodec: audioCodec,
                videoKeyFrames: _this.videoKeyFrames,
                audioKeyFrames: _this.audioKeyFrames,
                timeScale: videoTimeScale,
                mdatStart: mdat.start
            });
            //计算平均播放帧率
            var _samplesCount = _this.videoKeyFrames[_this.videoKeyFrames.length - 1].idx;
            var _frameRate = _samplesCount / videoDuration;
            _this._meta.frameRate = _frameRate;
            //外抛媒体信息至最外层
            EventCenter_1.default.getInstance().dispatchOutwardEvent('PlayerMediaInfoParsed', _this._meta);
        };
        _this._url = url;
        _this.init();
        _this.once('moovReady', _this.moovParse);
        return _this;
    }
    Object.defineProperty(MP4.prototype, "timeRange", {
        get: function () {
            return this._timeRange;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MP4.prototype, "meta", {
        get: function () {
            return this._meta;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MP4.prototype, "videoKeyFrames", {
        /**
         * 获取视频帧数组
         * @returns {IObject[]}
         */
        get: function () {
            if (this._videoFrames) {
                return this._videoFrames;
            }
            var stss = Box_1.default.findBox(this._videoTrak, 'stss');
            var frames = this.getSamplesByOrders('video', stss.entries.map(function (item) { return item - 1; }));
            this._videoFrames = frames;
            return frames;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MP4.prototype, "audioKeyFrames", {
        /**
         * 获取音频帧数组
         * @returns {IObject[]}
         */
        get: function () {
            var _this = this;
            if (this._audioFrames) {
                return this._audioFrames;
            }
            var videoMdhdBox = Box_1.default.findBox(this._videoTrak, 'mdhd');
            var audioMdhdBox = Box_1.default.findBox(this._audioTrak, 'mdhd');
            var audioSttsBox = Box_1.default.findBox(this._audioTrak, 'stts');
            if (audioMdhdBox) {
                var videoScale_1 = videoMdhdBox.timeScale;
                var audioScale_1 = audioMdhdBox.timeScale;
                var audioStts_1 = audioSttsBox.entry;
                var videoFrames = this.videoKeyFrames;
                var audioIndex = void 0;
                audioIndex = videoFrames.map(function (item) {
                    return Box_1.default.seekOrderSampleByTime(audioStts_1, audioScale_1, item.time.time / videoScale_1);
                });
                this._audioFrames = audioIndex;
            }
            else {
                this._audioFrames = [];
            }
            this._audioFrames.forEach(function (item, idx) {
                var _tempAudioSamples = _this.getSamplesByOrders('audio', item.order, 0)[0];
                item.samples = _tempAudioSamples;
            });
            return this._audioFrames;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * 视频媒体信息下载
     * @param {number} start = 0
     * @param {number} end = start + DownloadBlockSize
     * @returns {Promise}
     */
    MP4.prototype.getMediaInfoData = function (start, end) {
        var _this = this;
        if (start === void 0) { start = 0; }
        if (end === undefined)
            end = start + DownloadBlockSize;
        RuntimeLog_1.default.getInstance().log("loading media info data from " + start + " to " + end + "...");
        return new Promise(function (resolve, reject) {
            //下载结果response直接作为resolve的参数
            var mediaInfoTask = new MediaInfoTask_1.default(_this._url, start, end, resolve);
            mediaInfoTask.once('error', function (errObj) {
                // this.emit('error', errObj);
                reject(errObj);
            });
        });
    };
    /**
     * 初始化，获取moov元信息
     */
    MP4.prototype.init = function () {
        var _this = this;
        this.getMediaInfoData().then(function (res) {
            var parsed;
            var moovStart = 0;
            var moov;
            try {
                parsed = new Parse_1.default(res);
            }
            catch (e) {
                _this.dispatchErrorEvent("mp4 parse init error: " + e.message);
                return;
            }
            //查找moov box
            _this._boxes = parsed.boxes;
            _this._boxes.every(function (item) {
                moovStart += item.size;
                if (item.type === 'moov') {
                    moov = item;
                    _this._moovBox = item;
                    _this.emit('moovReady', moov);
                    return false;
                }
                else {
                    return true;
                }
            });
            var findNextBox = function (parsed) {
                if (!moov) {
                    var nextBox = parsed.nextBox;
                    if (nextBox) {
                        if (nextBox.type === 'moov') {
                            _this.getMediaInfoData(moovStart, moovStart + nextBox.size + 28).then(function (res) {
                                var _parsed = new Parse_1.default(res);
                                _this._boxes = _this._boxes.concat(_parsed.boxes);
                                var tempMoovArr = _parsed.boxes.filter(function (box) { return box.type === 'moov'; });
                                if (tempMoovArr.length) {
                                    _this._moovBox = tempMoovArr[0];
                                    _this.emit('moovReady', tempMoovArr);
                                }
                                else {
                                    _this.dispatchErrorEvent("mp4 parse can not find moov box when next box is moov");
                                }
                            });
                        }
                        else {
                            _this.dispatchErrorEvent("mp4 parse can not find moov box when next box is not moov");
                        }
                    }
                    else {
                        _this.getMediaInfoData(moovStart).then(function (res) {
                            var _parsed = new Parse_1.default(res);
                            if (_parsed) {
                                _this._boxes = _this._boxes.concat(_parsed.boxes);
                                _parsed.boxes.every(function (item) {
                                    moovStart += item.size;
                                    if (item.type === 'moov') {
                                        moov = item;
                                        _this._moovBox = moov;
                                        _this.emit('moovReady', moov);
                                        return false;
                                    }
                                    else {
                                        return true;
                                    }
                                });
                                findNextBox(_parsed);
                            }
                            else {
                                _this.dispatchErrorEvent("mp4 parse can not find moov box when downloaded next block data");
                            }
                        });
                    }
                }
            };
            findNextBox(parsed);
        }).catch(function (errObj) {
            _this.dispatchErrorEvent("" + errObj.message);
        });
    };
    /**
     * 按区段获取samples
     * @param {string} type
     * @param {number} start
     * @param {number} end
     * @returns {object}
     */
    MP4.prototype.getSamplesByOrders = function (type, start, end) {
        var _this = this;
        if (type === void 0) { type = 'video'; }
        if (end === void 0) { end = undefined; }
        var trak = type === 'video' ? this._videoTrak : this._audioTrak;
        ['stsc', 'stsz', 'stts', 'stco', 'ctts'].forEach(function (item) {
            if (_this._typeBox[type][item] === null) {
                _this._typeBox[type][item] = Box_1.default.findBox(trak, item);
            }
        });
        var mdatStart = this._mdatStart;
        var samples = [];
        end = end !== undefined ? end : this._typeBox[type].stsz.entries.length;
        if (start instanceof Array) {
            start.forEach(function (item) {
                samples.push({
                    idx: item,
                    size: _this._typeBox[type].stsz.entries[item],
                    time: Box_1.default.seekSampleTime(_this._typeBox[type].stts, _this._typeBox[type].ctts, item),
                    offset: Box_1.default.seekSampleOffset(_this._typeBox[type].stsc, _this._typeBox[type].stco, _this._typeBox[type].stsz, item, mdatStart)
                });
            });
        }
        else if (end !== 0) {
            for (var i = start; i < end; i++) {
                samples.push({
                    idx: i,
                    size: this._typeBox[type].stsz.entries[i],
                    time: Box_1.default.seekSampleTime(this._typeBox[type].stts, this._typeBox[type].ctts, i),
                    offset: Box_1.default.seekSampleOffset(this._typeBox[type].stsc, this._typeBox[type].stco, this._typeBox[type].stsz, i, mdatStart)
                });
            }
        }
        else {
            samples = [{
                    idx: start,
                    size: this._typeBox[type].stsz.entries[start],
                    time: Box_1.default.seekSampleTime(this._typeBox[type].stts, this._typeBox[type].ctts, start),
                    offset: Box_1.default.seekSampleOffset(this._typeBox[type].stsc, this._typeBox[type].stco, this._typeBox[type].stsz, start, mdatStart)
                }];
        }
        return samples;
    };
    /**
     * 生成initSegment buffer
     */
    MP4.prototype.createInitSegment = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (!_this._meta) {
                _this.dispatchErrorEvent("mp4 meta info is undefined!");
                reject(null);
            }
            FMP4Worker_1.default.getInstance().worker.postMessage({
                method: 'initSegment',
                params: {
                    meta: _this._meta
                }
            });
            EventBus_1.default.getInstance().on(EventNames_1.WorkerEvents.WORKER_INIT_SEGMENT_FINISHED, function (res) {
                resolve(res.params);
            });
        });
    };
    /**
     * 创建frgament并将其写入buffer
     */
    MP4.prototype.createFragment = function (mdatData, start, fragIndex, fragIndexEnd) {
        var _this = this;
        var _arguments = arguments;
        return new Promise(function (resolve, reject) {
            var isSeek = _arguments.length < 4;
            var framesIndex = _this.videoKeyFrames.map(function (item) { return item.idx; });
            var _video_samples = isSeek ?
                _this.getSamplesByOrders('video', framesIndex[fragIndex], framesIndex[fragIndex + 1]) :
                _this.getSamplesByOrders('video', framesIndex[fragIndex], framesIndex[fragIndexEnd]);
            var _audio_samples = [];
            if (_this.audioKeyFrames.length) {
                if (isSeek) {
                    _audio_samples = _this.getSamplesByOrders('audio', _this.audioKeyFrames[fragIndex].order, _this.audioKeyFrames[fragIndex + 1] ? _this.audioKeyFrames[fragIndex + 1].order : undefined);
                }
                else {
                    _audio_samples = _this.getSamplesByOrders('audio', _this.audioKeyFrames[fragIndex].order, _this.audioKeyFrames[fragIndexEnd] ? _this.audioKeyFrames[fragIndexEnd].order : undefined);
                }
            }
            FMP4Worker_1.default.getInstance().worker.postMessage({
                method: 'mediaSegment',
                params: {
                    mdatData: mdatData,
                    start: start,
                    samples: [_video_samples, _audio_samples]
                }
            });
            EventBus_1.default.getInstance().on(EventNames_1.WorkerEvents.WORKER_MEDIA_SEGMENT_FINISHED, function (res) {
                resolve(res.params);
            });
        });
    };
    /**
     * 销毁
     */
    MP4.prototype.dispose = function () {
        this._boxes = undefined;
        this._moovBox = undefined;
        this._videoTrak = undefined;
        this._audioTrak = undefined;
        this._mdatStart = undefined;
        this._videoFrames = undefined;
        this._audioFrames = undefined;
        this._timeRange = undefined;
        this._meta = undefined;
        this._videoOnly = undefined;
        this._typeBox = undefined;
    };
    return MP4;
}(EventEmitter));
exports.default = MP4;


/***/ }),

/***/ "./src/core/vkd/mp4/MediaDataTask.ts":
/*!*******************************************!*\
  !*** ./src/core/vkd/mp4/MediaDataTask.ts ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var EventEmitter = __webpack_require__(/*! eventemitter3 */ "./node_modules/eventemitter3/index.js");
var ErrorTypeList_1 = __webpack_require__(/*! ../../../config/ErrorTypeList */ "./src/config/ErrorTypeList.ts");
var EventLevel_1 = __webpack_require__(/*! ../../../events/EventLevel */ "./src/events/EventLevel.ts");
var HTTPLoader_1 = __webpack_require__(/*! ../HTTPLoader */ "./src/core/vkd/HTTPLoader.ts");
var MediaPlayerConfig_1 = __webpack_require__(/*! ../../../config/MediaPlayerConfig */ "./src/config/MediaPlayerConfig.ts");
var RuntimeLog_1 = __webpack_require__(/*! ../../../log/RuntimeLog */ "./src/log/RuntimeLog.ts");
var EventCenter_1 = __webpack_require__(/*! ../../../events/EventCenter */ "./src/events/EventCenter.ts");
/**
 * 视频媒体内容下载管理类
 */
//下载任务状态
var NOT_LOAD = 0;
var LOADING = 1;
var LOADED = 2;
//网速区域范围
var netStatesMap = {
    '240P': [0, 0.1],
    '360P': [0.1, 0.15],
    '480P': [0.15, 0.4],
    '720P': [0.4, 0.6],
    '1080P': [0.6, 2],
    '4K': [2, 5]
};
var MediaDataTask = /** @class */ (function (_super) {
    __extends(MediaDataTask, _super);
    function MediaDataTask(options) {
        var _this = _super.call(this) || this;
        _this._url = '';
        _this._keepLoader = null;
        _this._taskMap = [];
        _this._mdatStart = 0;
        _this._keepLoadedIndex = 0;
        _this._isLoading = false;
        _this._options = {
            url: '',
            videoElement: null,
            videoKeyFrames: [],
            audioKeyFrames: [],
            preloadTime: MediaPlayerConfig_1.playerConfig.preLoadTime,
            timeScale: 1,
            mdatStart: 0,
        };
        _this._loadStartTime = -1;
        _this._loadEndTime = -1;
        _this._netState = null;
        /**
         * 抛出异常
         */
        _this.dispatchError = function (e) {
            var errorObj = {
                code: ErrorTypeList_1.ErrorTypeList.PLAYER_CORE_TASK_ERROR,
                level: EventLevel_1.EventLevel.ERROR,
                target: _this,
                message: "MediaDataTask xhr error: " + (e.message || 'load fail'),
                data: null
            };
            _this.emit('error', errorObj);
        };
        _this._options = __assign(__assign({}, _this._options), options);
        _this._url = _this._options.url;
        _this._timeScale = options.timeScale;
        _this._videoKeyFrames = _this._options.videoKeyFrames;
        _this._audioKeyFrames = _this._options.audioKeyFrames;
        _this._preloadTime = _this._options.preloadTime;
        _this._mdatStart = _this._options.mdatStart;
        _this._preloadIndex = _this.getIndexByTime(_this._preloadTime);
        _this.initTaskList();
        if (_this._options.fromStart) {
            _this.initTaskLoader();
        }
        return _this;
    }
    Object.defineProperty(MediaDataTask.prototype, "isLoading", {
        get: function () {
            return this._isLoading;
        },
        set: function (value) {
            this._isLoading = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * 根据关键帧建立任务列表
     */
    MediaDataTask.prototype.initTaskList = function () {
        var _this = this;
        var _lg = this._videoKeyFrames.length;
        this._videoKeyFrames.forEach(function (item, idx) {
            _this._taskMap.push({
                start: _this._audioKeyFrames.length ? Math.min(item.offset, _this._audioKeyFrames[idx].samples.offset) : item.offset,
                end: idx < _this._videoKeyFrames.length - 1 ? (_this._audioKeyFrames.length ? Math.max(_this._videoKeyFrames[idx + 1].offset, _this._audioKeyFrames[idx + 1].samples.offset) : _this._videoKeyFrames[idx + 1].offset) : null,
                state: NOT_LOAD,
                time: _this._videoKeyFrames[idx].time,
                id: idx,
                isLast: idx === _lg - 1 ? true : false,
            });
        });
    };
    /**
     * 创建loader
     */
    MediaDataTask.prototype.initTaskLoader = function () {
        if (!this._taskMap.length) {
            this.emit('error', {
                code: ErrorTypeList_1.ErrorTypeList.PLAYER_CORE_TASK_ERROR,
                level: EventLevel_1.EventLevel.ERROR,
                target: this,
                message: "MediaDataTask task map length is 0"
            });
            return;
        }
        //默认开始第一分片下载
        this.createNextKeepLoader();
    };
    /**
     * 创建next loader
     */
    MediaDataTask.prototype.createNextKeepLoader = function () {
        var _this = this;
        if (this._keepLoader)
            return;
        if (this._keepLoadedIndex >= this._videoKeyFrames.length ||
            this._keepLoadedIndex > this._preloadIndex)
            return;
        var _currentTask = this._taskMap[this._keepLoadedIndex];
        //如果当前分片处于下载中或者下载完毕, 则进入下一分片
        if (_currentTask.state !== NOT_LOAD) {
            this.emit('load', {
                task: _currentTask
            });
            this._keepLoadedIndex += 1;
            this.createNextKeepLoader();
            return;
        }
        ;
        this._keepLoader = new HTTPLoader_1.default({
            url: this._url,
            fileType: 'mp4'
        });
        _currentTask.state = LOADING;
        this._loadStartTime = Date.now();
        this._keepLoader.start(_currentTask.start + this._mdatStart, _currentTask.end ? _currentTask.end + this._mdatStart : null).then(function (res) {
            _this._keepLoader = null;
            var _contentSize = +res.getResponseHeader('Content-Length') / 1048576; //B -> MB
            _this.checkNetworkState(_contentSize);
            _currentTask.buffer = res.response;
            _currentTask.state = LOADED;
            _this._keepLoadedIndex += 1;
            _this.emit('load', {
                task: _currentTask
            });
            //发送currentTask后将当前任务置空防止其占用内存
            _currentTask.buffer = undefined;
            _currentTask.state = NOT_LOAD;
            _this.createNextKeepLoader();
        }).catch(function (e) {
            _this.dispatchError(e);
        });
    };
    /**
     * 检测网络状态
     */
    MediaDataTask.prototype.checkNetworkState = function (contentSize) {
        this._loadEndTime = Date.now();
        var _networkSpeed = (contentSize * 1000) / (this._loadEndTime - this._loadStartTime); //ms -> s
        var _keys = Object.keys(netStatesMap);
        var _tempNetState = null;
        _keys.every(function (key) {
            if (_networkSpeed >= netStatesMap[key][0] &&
                _networkSpeed < netStatesMap[key][1]) {
                _tempNetState = key;
                return false;
            }
            else
                return true;
        });
        if (!_tempNetState)
            _tempNetState = '4K';
        RuntimeLog_1.default.getInstance().log("%c >> net speed: " + _networkSpeed + " MB/s, net state: " + _tempNetState + " <<", 'color: #858701;background: #061a87');
        //发送网速事件
        EventCenter_1.default.getInstance().dispatchOutwardEvent('PlayerDownloadSpeed', {
            speed: _networkSpeed,
            netState: _tempNetState
        });
        if (this._netState !== _tempNetState && MediaPlayerConfig_1.playerConfig.definition === 'Auto') {
            this._netState = _tempNetState;
            RuntimeLog_1.default.getInstance().log("media data task networkSpeedChange event fired");
            this.emit('networkSpeedChange', {
                networkState: this._netState
            });
        }
    };
    /**
     * 通过时间获取其所在索引
     * @param timeStart
     */
    MediaDataTask.prototype.getIndexByTime = function (time) {
        var _timeStart = time * this._timeScale;
        var _seekIdx = -1;
        var _videoKeyFrames = this._videoKeyFrames;
        var _audioKeyFrames = this._audioKeyFrames;
        _videoKeyFrames.every(function (item, idx) {
            var nowTime = item.time.time;
            var nextTime = _videoKeyFrames[idx + 1] ? _videoKeyFrames[idx + 1].time.time : Number.MAX_SAFE_INTEGER;
            if (nowTime <= _timeStart && _timeStart < nextTime) {
                _seekIdx = idx;
                return false;
            }
            else
                return true;
        });
        _audioKeyFrames.every(function (item, idx) {
            var nowTime = item.startTime;
            var nextTime = _audioKeyFrames[idx + 1] ? _audioKeyFrames[idx + 1].startTime : Number.MAX_SAFE_INTEGER;
            if (nowTime <= time && time < nextTime) {
                _seekIdx = Math.min(idx, _seekIdx);
                return false;
            }
            else
                return true;
        });
        return _seekIdx;
    };
    /**
     * 开始下载 为默认不开启下载的情况准备
     */
    MediaDataTask.prototype.start = function () {
        this.initTaskLoader();
    };
    /**
     * 取消当前下载, 该行为默认关闭自动下载
     */
    MediaDataTask.prototype.abort = function () {
        if (!this._keepLoader)
            return;
        this._keepLoader.abort();
        this._keepLoader = null;
        this._taskMap[this._keepLoadedIndex].state = NOT_LOAD;
    };
    /**
     * 跳转
     * @param time
     */
    MediaDataTask.prototype.seek = function (time) {
        this.abort();
        var _time = time;
        var _seekIdx = this.getIndexByTime(_time);
        this._keepLoadedIndex = _seekIdx;
        var _seekEndIdx = this.getIndexByTime(_time + this._preloadTime);
        this._preloadIndex = _seekEndIdx;
        RuntimeLog_1.default.getInstance().log("dataTask: seekIdx: " + _seekIdx + ", seekEndIdx" + _seekEndIdx);
        this.createNextKeepLoader();
    };
    /**
     * 通过时间获取播放时间 如果是最后一帧则返回null
     * @param time
     */
    MediaDataTask.prototype.getFrameTimeByTime = function (time) {
        var _currentIdx = this.getIndexByTime(time);
        var _nextIdx = _currentIdx + 1;
        if (!this._videoKeyFrames[_nextIdx]) {
            return null;
        }
        return this._videoKeyFrames[_nextIdx].time.time / this._timeScale;
    };
    /**
     * 检测当前播放时间是否已经超过条件限制并重新开启下一段preload  range下载
     * @param time
     */
    MediaDataTask.prototype.checkNeedNextRangeLoad = function (time) {
        if (this._preloadIndex >= this._videoKeyFrames.length - 1)
            return;
        var _currentTime = time;
        //获取当前帧结尾 | 下一帧开始时间
        var _startTime = this._videoKeyFrames[this._preloadIndex].time.time;
        var _duration = this._videoKeyFrames[this._preloadIndex].time.duration;
        var _endTime = (_startTime + _duration) / this._timeScale;
        // RuntimeLog.getInstance().log(`checkNeedNextRangeLoad called, currentTime: ${_currentTime}, _endTime: ${_endTime}, _preloadIndex${this._preloadIndex}`);
        if (_endTime - _currentTime <= MediaPlayerConfig_1.playerConfig.triggerNextLoadRangeTime) {
            var _time = _endTime + 1;
            var _seekIdx = this.getIndexByTime(_time);
            this._keepLoadedIndex = _seekIdx;
            var _seekEndIdx = this.getIndexByTime(_time + this._preloadTime);
            this._preloadIndex = _seekEndIdx;
            this.createNextKeepLoader();
        }
    };
    return MediaDataTask;
}(EventEmitter));
exports.default = MediaDataTask;


/***/ }),

/***/ "./src/core/vkd/mp4/MediaInfoTask.ts":
/*!*******************************************!*\
  !*** ./src/core/vkd/mp4/MediaInfoTask.ts ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 视频媒体信息下载器
 */
var EventEmitter = __webpack_require__(/*! eventemitter3 */ "./node_modules/eventemitter3/index.js");
var NormalUtils_1 = __webpack_require__(/*! ../../../utils/NormalUtils */ "./src/utils/NormalUtils.ts");
var EventLevel_1 = __webpack_require__(/*! ../../../events/EventLevel */ "./src/events/EventLevel.ts");
var ErrorTypeList_1 = __webpack_require__(/*! ../../../config/ErrorTypeList */ "./src/config/ErrorTypeList.ts");
var RuntimeLog_1 = __webpack_require__(/*! ../../../log/RuntimeLog */ "./src/log/RuntimeLog.ts");
var EventCenter_1 = __webpack_require__(/*! ../../../events/EventCenter */ "./src/events/EventCenter.ts");
//下载任务队列
var TASK_LIMIT = 2;
var MediaInfoTask = /** @class */ (function (_super) {
    __extends(MediaInfoTask, _super);
    function MediaInfoTask(url, start, end, callback) {
        var _this = _super.call(this) || this;
        _this._url = '';
        _this._start = -1;
        _this._end = -1;
        _this._taskId = '';
        _this._on = false;
        _this._callback = null;
        _this._xhr = null;
        _this._logger = null;
        _this._range = "";
        /**
         * xhr load 事件处理
         */
        _this.onXHRLoadHandler = function () {
            if (_this._xhr.status === 200 || _this._xhr.status === 206) {
                if (_this._callback && typeof _this._callback === 'function') {
                    _this._callback(_this._xhr.response);
                }
            }
            _this.update();
            _this.debug_log("MediaInfoTask xhr load. taskId: " + _this._taskId);
        };
        /**
         * xhr error 事件处理
         * @param e
         */
        _this.onXHRErrorHandler = function (e) {
            var errorObj = {
                code: ErrorTypeList_1.ErrorTypeList.PLAYER_CORE_TASK_ERROR,
                level: EventLevel_1.EventLevel.ERROR,
                target: _this,
                message: "MediaInfoTask xhr error event: " + e.message,
                data: null
            };
            _this.emit('error', errorObj);
            _this.debug_log("MediaInfoTask xhr error. taskId: " + _this._taskId);
        };
        /**
        * xhr onloadend 事件处理
        */
        _this.onXHRLoadEndHandler = function () {
            _this.debug_log("MediaInfoTask xhr load end. taskId: " + _this._taskId);
            _this.remove();
        };
        _this._taskId = NormalUtils_1.default.generateUUID();
        _this._url = url;
        _this._start = start;
        _this._end = end;
        _this._callback = callback;
        _this._range = start + "-" + end;
        _this.initHttpRequest();
        return _this;
    }
    /**
     * 输出日志
     * @param str
     */
    MediaInfoTask.prototype.debug_log = function (str) {
        if (!this._logger) {
            this._logger = RuntimeLog_1.default.getInstance();
        }
        // this._logger.log(str);
    };
    /**
     * 初始化xhr请求
     */
    MediaInfoTask.prototype.initHttpRequest = function () {
        if (this.queueCheckRangeRepeat())
            return;
        this._xhr = new XMLHttpRequest();
        this._xhr.responseType = 'arraybuffer';
        this._xhr.open('get', this._url);
        this._xhr.setRequestHeader('Range', "bytes=" + this._start + "-" + (this._end ? this._end : ""));
        this._xhr.onload = this.onXHRLoadHandler;
        this._xhr.onerror = this.onXHRErrorHandler;
        this._xhr.onloadend = this.onXHRLoadEndHandler;
        MediaInfoTask.TaskWaitingQueue.push(this);
        this.debug_log("waiting queue push. taskId: " + this._taskId);
        this.update();
    };
    /**
     * 查询Task任务范围是否重复 false: 未重复 true:重复
     */
    MediaInfoTask.prototype.queueCheckRangeRepeat = function () {
        var _this = this;
        var _finded = false;
        MediaInfoTask.TaskWaitingQueue.every(function (item) {
            if (item._range === _this._range) {
                _finded = true;
                return false;
            }
            else {
                return true;
            }
        });
        MediaInfoTask.TaskSendedQueue.every(function (item) {
            if (item._range === _this._range) {
                _finded = true;
                return false;
            }
            else {
                return true;
            }
        });
        return _finded;
    };
    /**
     * 取消本次任务
     */
    MediaInfoTask.prototype.cancel = function () {
        this._xhr.abort();
    };
    /**
     * 移除本次任务
     */
    MediaInfoTask.prototype.remove = function () {
        if (this._on) {
            MediaInfoTask.TaskSendedQueue.splice(MediaInfoTask.TaskSendedQueue.indexOf(this), 1);
            this.debug_log("sended queue remove. taskId: " + this._taskId);
        }
        else {
            MediaInfoTask.TaskWaitingQueue.splice(MediaInfoTask.TaskWaitingQueue.indexOf(this), 1);
            this.debug_log("waiting queue remove. taskId: " + this._taskId);
        }
        this.update();
    };
    /**
     * 更新 MediaInfoTask queue
     */
    MediaInfoTask.prototype.update = function () {
        var setUpNum = TASK_LIMIT - MediaInfoTask.TaskSendedQueue.length;
        if (setUpNum) {
            for (var i = setUpNum; i > 0; i--) {
                MediaInfoTask.TaskWaitingQueue[0] && MediaInfoTask.TaskWaitingQueue[0].run();
            }
        }
    };
    /**
     * 开始任务
     */
    MediaInfoTask.prototype.run = function () {
        try {
            if (this._xhr.readyState === 1) {
                var currentTask = MediaInfoTask.TaskWaitingQueue.shift();
                currentTask._on = true;
                currentTask._xhr.send();
                MediaInfoTask.TaskSendedQueue.push(currentTask);
                this.debug_log("waiting queue -> sended queue. taskId: " + currentTask._taskId);
            }
            else {
                this.remove();
            }
        }
        catch (err) {
            var errorObj = {
                code: ErrorTypeList_1.ErrorTypeList.PLAYER_CORE_TASK_ERROR,
                level: EventLevel_1.EventLevel.ERROR,
                target: this,
                message: "" + err.message,
                data: err
            };
            EventCenter_1.default.getInstance().dispatchOutwardEvent('PlayerError', errorObj);
        }
    };
    /**
     * 清空任务列表
     */
    MediaInfoTask.clear = function () {
        MediaInfoTask.TaskSendedQueue.forEach(function (item) {
            item.cancel();
        });
        MediaInfoTask.TaskSendedQueue.length = MediaInfoTask.TaskWaitingQueue.length = 0;
    };
    MediaInfoTask.TaskSendedQueue = [];
    MediaInfoTask.TaskWaitingQueue = [];
    return MediaInfoTask;
}(EventEmitter));
exports.default = MediaInfoTask;


/***/ }),

/***/ "./src/core/vkd/mp4/Parse.ts":
/*!***********************************!*\
  !*** ./src/core/vkd/mp4/Parse.ts ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * mp4 box解析类
 */
var Box_1 = __webpack_require__(/*! ./Box */ "./src/core/vkd/mp4/Box.ts");
var NormalUtils_1 = __webpack_require__(/*! ../../../utils/NormalUtils */ "./src/utils/NormalUtils.ts");
var Stream_1 = __webpack_require__(/*! ../Stream */ "./src/core/vkd/Stream.ts");
var Parse = /** @class */ (function () {
    function Parse(buffer) {
        this._boxes = [];
        this._nextBox = null;
        if (this._buffer) {
            NormalUtils_1.default.concatUint8Array(new Uint8Array(this._buffer), new Uint8Array(buffer));
        }
        else {
            this._buffer = buffer;
        }
        var bufferLength = buffer.byteLength;
        var stream = new Stream_1.default(buffer);
        while (bufferLength - stream.position >= 8) {
            var box = new Box_1.default();
            box.readHeader(stream);
            if (box.size - 8 <= (bufferLength - stream.position)) {
                box.readBody(stream);
                this._boxes.push(box);
            }
            else {
                if (box.type === 'mdat') {
                    box.readBody(stream);
                    this._boxes.push(box);
                }
                else {
                    this._nextBox = box;
                    stream.position -= 8;
                    break;
                }
            }
        }
        this._buffer = new Uint8Array(this._buffer.slice(stream.position));
    }
    Object.defineProperty(Parse.prototype, "boxes", {
        get: function () {
            return this._boxes;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Parse.prototype, "nextBox", {
        get: function () {
            return this._nextBox;
        },
        enumerable: true,
        configurable: true
    });
    return Parse;
}());
exports.default = Parse;


/***/ }),

/***/ "./src/core/vkd/mp4/VkdDataView.ts":
/*!*****************************************!*\
  !*** ./src/core/vkd/mp4/VkdDataView.ts ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * 扩展DataView
 */
Object.defineProperty(exports, "__esModule", { value: true });
var VkdDataView = /** @class */ (function () {
    function VkdDataView(buffer, offset, length) {
        this._position = 0;
        this._dataView = null;
        this._dataView = new DataView(buffer, offset, length);
    }
    Object.defineProperty(VkdDataView.prototype, "position", {
        get: function () {
            return this._position;
        },
        set: function (value) {
            this._position = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VkdDataView.prototype, "buffer", {
        get: function () {
            return this._dataView.buffer;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VkdDataView.prototype, "byteOffset", {
        get: function () {
            return this._dataView.byteOffset;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VkdDataView.prototype, "byteLength", {
        get: function () {
            return this._dataView.byteLength;
        },
        enumerable: true,
        configurable: true
    });
    VkdDataView.prototype.setBigUint64 = function (byteOffset, value, littleEndian) {
        this._dataView.setBigUint64(byteOffset, value, littleEndian);
    };
    VkdDataView.prototype.setBigInt64 = function (byteOffset, value, littleEndian) {
        this._dataView.setBigInt64(byteOffset, value, littleEndian);
    };
    VkdDataView.prototype.setUint32 = function (byteOffset, value, littleEndian) {
        this._dataView.setUint32(byteOffset, value, littleEndian);
    };
    VkdDataView.prototype.setUint16 = function (byteOffset, value, littleEndian) {
        this._dataView.setUint16(byteOffset, value, littleEndian);
    };
    VkdDataView.prototype.setUint8 = function (byteOffset, value) {
        this._dataView.setUint8(byteOffset, value);
    };
    VkdDataView.prototype.setInt32 = function (byteOffset, value, littleEndian) {
        this._dataView.setInt32(byteOffset, value, littleEndian);
    };
    VkdDataView.prototype.setInt16 = function (byteOffset, value, littleEndian) {
        this._dataView.setInt16(byteOffset, value, littleEndian);
    };
    VkdDataView.prototype.setInt8 = function (byteOffset, value) {
        this._dataView.setInt8(byteOffset, value);
    };
    VkdDataView.prototype.setFloat64 = function (byteOffset, value, littleEndian) {
        this._dataView.setFloat64(byteOffset, value, littleEndian);
    };
    VkdDataView.prototype.setFloat32 = function (byteOffset, value, littleEndian) {
        return this._dataView.setFloat32(byteOffset, value, littleEndian);
    };
    VkdDataView.prototype.getBigUint64 = function (byteOffset, littleEndian) {
        return this._dataView.getBigUint64(byteOffset, littleEndian);
    };
    VkdDataView.prototype.getBigInt64 = function (byteOffset, littleEndian) {
        return this._dataView.getBigInt64(byteOffset, littleEndian);
    };
    VkdDataView.prototype.getUint32 = function (byteOffset, littleEndian) {
        return this._dataView.getUint32(byteOffset, littleEndian);
    };
    VkdDataView.prototype.getUint16 = function (byteOffset, littleEndian) {
        return this._dataView.getUint16(byteOffset, littleEndian);
    };
    VkdDataView.prototype.getUint8 = function (byteOffset) {
        return this._dataView.getUint8(byteOffset);
    };
    VkdDataView.prototype.getInt32 = function (byteOffset, littleEndian) {
        return this._dataView.getInt32(byteOffset, littleEndian);
    };
    VkdDataView.prototype.getInt16 = function (byteOffset, littleEndian) {
        return this._dataView.getInt16(byteOffset, littleEndian);
    };
    VkdDataView.prototype.getInt8 = function (byteOffset) {
        return this._dataView.getInt8(byteOffset);
    };
    VkdDataView.prototype.getFloat64 = function (byteOffset, littleEndian) {
        return this._dataView.getFloat64(byteOffset, littleEndian);
    };
    VkdDataView.prototype.getFloat32 = function (byteOffset, littleEndian) {
        return this._dataView.getFloat32(byteOffset, littleEndian);
    };
    return VkdDataView;
}());
exports.default = VkdDataView;


/***/ }),

/***/ "./src/core/vkd/mp4/VkdMP4Player.ts":
/*!******************************************!*\
  !*** ./src/core/vkd/mp4/VkdMP4Player.ts ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * mp4播放器
 */
var VkdBasePlayer_1 = __webpack_require__(/*! ../VkdBasePlayer */ "./src/core/vkd/VkdBasePlayer.ts");
var MSE_1 = __webpack_require__(/*! ../MSE */ "./src/core/vkd/MSE.ts");
var MP4_1 = __webpack_require__(/*! ./MP4 */ "./src/core/vkd/mp4/MP4.ts");
var ErrorTypeList_1 = __webpack_require__(/*! ../../../config/ErrorTypeList */ "./src/config/ErrorTypeList.ts");
var MediaDataTask_1 = __webpack_require__(/*! ./MediaDataTask */ "./src/core/vkd/mp4/MediaDataTask.ts");
var RuntimeLog_1 = __webpack_require__(/*! ../../../log/RuntimeLog */ "./src/log/RuntimeLog.ts");
var Buffer_1 = __webpack_require__(/*! ../Buffer */ "./src/core/vkd/Buffer.ts");
var MediaPlayerConfig_1 = __webpack_require__(/*! ../../../config/MediaPlayerConfig */ "./src/config/MediaPlayerConfig.ts");
var VkdMP4Player = /** @class */ (function (_super) {
    __extends(VkdMP4Player, _super);
    function VkdMP4Player(element, options) {
        var _this = _super.call(this, element, options) || this;
        _this._timer = undefined;
        _this._isEnd = false;
        _this.errorHandler = function (err) {
            if (!err)
                err = {
                    code: ErrorTypeList_1.ErrorTypeList.UNKNOWN_ERROR,
                    message: "(player) unknow error catch!"
                };
            !err.code && (err.code = ErrorTypeList_1.ErrorTypeList.PLAYER_CORE_MP4_ERROR);
            _this.dispatchErrorEvent(err.code, err.message, err.data);
            _this.once('canplay', function () {
                _this.play();
            });
        };
        /**
         * 响应media data loader加载完成事件
         */
        _this.onMediaLoaderLoad = function (e) {
            if (_this._switchingDefinition)
                _this._switchingDefinition = false;
            var _task = __assign({}, e.task);
            _task.buffer = e.task.buffer.slice(0);
            _this._taskQueue.push(_task);
            _this.handleNextTask();
        };
        /**
         * 处理下一次任务内容
         */
        _this.handleNextTask = function () {
            if (!_this._mp4 || !_this._taskQueue.length || _this._taskHandling)
                return;
            _this._taskHandling = true;
            var _task = _this._taskQueue.shift();
            //组装碎片MP4并加入MSE中
            RuntimeLog_1.default.getInstance().log("(player) handle next task, task id: " + _task.id);
            _this._mp4.createFragment(_task.buffer, _task.start, _task.id).then(function (buffer) {
                if (buffer) {
                    _this._mediaBufferCache.write(new Uint8Array(buffer));
                    if (_this.canSwitchDefinition) {
                        if ((_this._mediaBufferCache.buffer.byteLength >= MediaPlayerConfig_1.playerConfig.playerAppendMinBufferLengthMap[_this.currentDefinition]) ||
                            _task.isLast) {
                            _this._mediaSegmentsQueue.push(_this._mediaBufferCache.buffer.slice(0));
                            _this._mediaBufferCache = new Buffer_1.default();
                            _this.appendMediaBuffer();
                        }
                    }
                    else {
                        _this._mediaSegmentsQueue.push(_this._mediaBufferCache.buffer.slice(0));
                        _this._mediaBufferCache = new Buffer_1.default();
                        _this.appendMediaBuffer();
                    }
                }
            }).catch(function (err) {
                _this.errorHandler(err);
            }).finally(function () {
                _this._taskHandling = false;
                _this.handleNextTask();
            });
        };
        /**
         * 向MSE中添加mediaSegments
         */
        _this.appendMediaBuffer = function () {
            if (!_this._mediaSegmentsQueue.length || !_this._mse)
                return;
            var _tempMediaBuffer = _this._mediaSegmentsQueue.shift();
            var mse = _this._mse;
            mse.updating = true;
            mse.appendBuffer(_tempMediaBuffer);
            mse.once('updateend', function () {
                mse.updating = false;
            });
        };
        /**
         * 判断当前播放进度是否为结束
         */
        _this.isEnded = function () {
            if (_this._mp4.meta.endTime - _this.currentTime < MediaPlayerConfig_1.playerConfig.playerEndGapTime) {
                _this._isEnd = true;
                _this.pause();
                setTimeout(function () {
                    _this.handleMediaEvent('ended', null);
                    if (MediaPlayerConfig_1.playerConfig.loop) {
                        _this.seek(0);
                        _this.play();
                    }
                }, 0);
            }
        };
        /**
         * 响应seeking事件
         */
        _this.seekingHandler = function () {
            _this.clearCache();
            if (_this._mediaDataLoader) {
                _this._mediaDataLoader.seek(_this.currentTime);
            }
        };
        /**
         * 响应timeupdate事件
         */
        _this.timeupdateHandler = function () {
            if (_this._mediaDataLoader) {
                _this._mediaDataLoader.checkNeedNextRangeLoad(_this.currentTime);
            }
        };
        /**
         * 响应waiting事件
         */
        _this.waitingHandler = function () {
            if (_this._mse && !_this._mse.updating) {
                _this.isEnded();
            }
            if (_this._isEnd) {
                clearTimeout(_this._timer);
            }
            else {
                if (!_this._timer) {
                    _this._timer = window.setTimeout(function () {
                        _this.seekingHandler();
                        clearTimeout(_this._timer);
                        _this._timer = undefined;
                    }, MediaPlayerConfig_1.playerConfig.playerWaitingHandlerTime);
                }
            }
        };
        /**
         * 响应暂停事件
         */
        _this.onPauseHandler = function () {
        };
        /**
         * 响应播放事件
         */
        _this.onPlayHandler = function () {
        };
        if (!MSE_1.default.isSupported('video/mp4; codecs="avc1.64001E, mp4a.40.5"'))
            return _this;
        _this.init();
        return _this;
    }
    /**
     * 初始化player
     */
    VkdMP4Player.prototype.init = function () {
        var _this = this;
        _super.prototype.init.call(this);
        this.createMP4Runtime(this.mainUrl).then(function (result) {
            _this._mp4 = result.mp4;
            _this._mse = result.mse;
            _this._mediaDataLoader = result.mediaDataTask;
            _super.prototype.start.call(_this, _this._mse.url);
            _this._mp4.on('error', function (err) {
                _this.errorHandler(err);
            });
        }).catch(function (err) {
            _this.errorHandler(err);
        });
    };
    /**
     * 创建MP4运行runtime
     * @returns {Promise}
     */
    VkdMP4Player.prototype.createMP4Runtime = function (url) {
        var _this = this;
        var mp4 = new MP4_1.default(url);
        var mse;
        var mediaDataTask;
        return new Promise(function (resolve, reject) {
            mp4.once('moovParseEnd', function (data) {
                RuntimeLog_1.default.getInstance().log('(mp4) media info data prased');
                if (!_this._mse) {
                    mse = new MSE_1.default(_this.video, {
                        audio_codecs: data.audioCodec
                    });
                    mse.on('sourceopen', function () {
                        mp4.createInitSegment().then(function (res) {
                            mse.appendInitBuffer(res);
                            mediaDataTask.start();
                        });
                    });
                    mse.on('error', function (err) {
                        _this.errorHandler(err);
                    });
                }
                mediaDataTask = new MediaDataTask_1.default({
                    url: url,
                    videoElement: _this.video,
                    videoKeyFrames: data.videoKeyFrames,
                    audioKeyFrames: data.audioKeyFrames,
                    timeScale: data.timeScale,
                    mdatStart: data.mdatStart
                });
                mediaDataTask.on('load', _this.onMediaLoaderLoad);
                mediaDataTask.on('error', _this.errorHandler);
                mediaDataTask.on('networkSpeedChange', _this.onNetworkSpeedChange);
                resolve({ mp4: mp4, mse: mse, mediaDataTask: mediaDataTask });
            });
            mp4.on('error', function (e) {
                !e.code && (e.code = ErrorTypeList_1.ErrorTypeList.PLAYER_CORE_MP4_ERROR);
                reject(e);
            });
        });
    };
    /**
     * 切流
     * @param url
     */
    VkdMP4Player.prototype.switchDefinition = function (definition) {
        var _this = this;
        if (!this.mainUrlMap[definition]) {
            // TODO: 先取消报错, 直接放弃切流
            // this.errorHandler({
            //     message: `no userful ${definition} src.`
            // })
            return;
        }
        var url = this.mainUrlMap[definition];
        //如果目标分辨率不存在或正处于切流中, 放弃切流
        if (!definition || this._switchingDefinition)
            return;
        this.clearCache();
        //如果剩余时间小于当前播放时间+切换预置时间, 放弃切流
        if (this.currentTime + MediaPlayerConfig_1.playerConfig.playerPreSwitchTime >= this.duration) {
            return;
        }
        var _currentTime = this.currentTime;
        var _switchStartTime = this._mediaDataLoader.getFrameTimeByTime(_currentTime + MediaPlayerConfig_1.playerConfig.playerPreSwitchTime);
        //判断当前播放所处缓冲区域的结尾时间是否大于预置时间, 优先时间长者
        if (this.buffered.length) {
            for (var i = 0; i < this.buffered.length; i++) {
                var _tempStart = this.buffered.start(i);
                var _tempEnd = this.buffered.end(i);
                if (this.currentTime >= _tempStart && this.currentTime <= _tempEnd) {
                    _switchStartTime = _tempEnd;
                    break;
                }
            }
        }
        this._mediaDataLoader.abort(); //取消当前下载器任务
        this._mediaDataLoader.removeAllListeners();
        this._mediaDataLoader = undefined;
        //取消当前下载后设置状态为切换中
        this.currentDefinition = definition;
        this._switchingDefinition = true;
        this.createMP4Runtime(url).then(function (result) {
            if (_switchStartTime === null) {
                //返回null说明预置时间已经处于最后一个gap中, 放弃切流
                RuntimeLog_1.default.getInstance().log('(player) switch start time illegal, prevent switch definition');
                return;
            }
            //卸载并重新初始化mp4模块
            _this._mp4.removeAllListeners();
            _this._mp4 = result.mp4;
            _this._mp4.on('error', function (err) {
                _this.errorHandler(err);
            });
            _this._mp4.createInitSegment().then(function (res) {
                _this._mse.appendInitBuffer(res);
            });
            //卸载并重新初始化 media data loader
            _this._mediaDataLoader = result.mediaDataTask;
            if (_switchStartTime >= _this.currentTime + MediaPlayerConfig_1.playerConfig.triggerNextLoadRangeTime)
                return;
            _this._mediaDataLoader.seek(_switchStartTime);
        }).catch(function (e) {
            _this.errorHandler(e);
        });
    };
    /**
     * 切换播放源
     * @param url
     */
    VkdMP4Player.prototype.changeSrc = function (url) {
        var _this = this;
        this.clearCache();
        if (this._mediaDataLoader) {
            this._mediaDataLoader.abort(); //取消当前下载器任务
            this._mediaDataLoader.removeAllListeners();
            this._mediaDataLoader = undefined;
        }
        if (this._mp4) {
            this._mp4.removeAllListeners();
            this._mp4 = undefined;
        }
        if (this._mse) {
            this._mse.dispose();
            this._mse = undefined;
        }
        this.createMP4Runtime(url).then(function (result) {
            //卸载并重新初始化mp4模块
            _this._mp4 = result.mp4;
            _this._mse = result.mse;
            _super.prototype.start.call(_this, _this._mse.url);
            _this._mp4.on('error', function (err) {
                _this.errorHandler(err);
            });
            _this._mp4.createInitSegment().then(function (res) {
                _this._mse.appendInitBuffer(res);
            });
            //卸载并重新初始化 media data loader
            _this._mediaDataLoader = result.mediaDataTask;
            _this._mediaDataLoader.seek(0);
        }).catch(function (e) {
            _this.errorHandler(e);
        });
    };
    /**
     * 销毁
     */
    VkdMP4Player.prototype.dispose = function () {
        _super.prototype.dispose.call(this);
        this._mp4.dispose();
        //TODO: dispose
    };
    return VkdMP4Player;
}(VkdBasePlayer_1.default));
exports.default = VkdMP4Player;


/***/ }),

/***/ "./src/events/EventBus.ts":
/*!********************************!*\
  !*** ./src/events/EventBus.ts ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * EventBus 单例
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var EventEmitter = __webpack_require__(/*! eventemitter3 */ "./node_modules/eventemitter3/index.js");
var _instance;
var EventBus = /** @class */ (function (_super) {
    __extends(EventBus, _super);
    function EventBus(sign) {
        var _this = this;
        if (sign !== PrivateSingle)
            throw new Error('class EventBus is singleton, do not use new operator!');
        _this = _super.call(this) || this;
        return _this;
    }
    EventBus.getInstance = function () {
        if (!_instance) {
            _instance = new EventBus(PrivateSingle);
        }
        return _instance;
    };
    /**
     * 销毁EventBus
     */
    EventBus.prototype.dispose = function () {
        this.removeAllListeners();
        _instance = null;
    };
    return EventBus;
}(EventEmitter));
exports.default = EventBus;
var PrivateSingle = /** @class */ (function () {
    function PrivateSingle() {
    }
    return PrivateSingle;
}());


/***/ }),

/***/ "./src/events/EventCenter.ts":
/*!***********************************!*\
  !*** ./src/events/EventCenter.ts ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var EventBus_1 = __webpack_require__(/*! ./EventBus */ "./src/events/EventBus.ts");
/**
 * EventCenter 事件发送中心单例
 */
var _instance;
var EventCenter = /** @class */ (function () {
    function EventCenter(sign) {
        if (sign !== PrivateSingle)
            throw new Error('class EventCenter is singleton, do not use new operator!');
    }
    EventCenter.getInstance = function () {
        if (!_instance) {
            _instance = new EventCenter(PrivateSingle);
        }
        return _instance;
    };
    /**
     * 发送外部事件
     * @param eventType
     * @param eventConfigObject
     * @param originEventObj
     */
    EventCenter.prototype.dispatchOutwardEvent = function (eventType, customEvent, originEventObj) {
        if (originEventObj === void 0) { originEventObj = {}; }
        var _tempOutwardEventObject = __assign(__assign({}, customEvent), { type: eventType });
        EventBus_1.default.getInstance().emit(eventType, __assign(__assign({}, _tempOutwardEventObject), { originEventObj: originEventObj }));
    };
    /**
     * 发送内部事件
     * @param {string} name
     * @param {IObject} dataObj
     */
    EventCenter.prototype.dispatchInnerEvent = function (name, dataObj) {
        EventBus_1.default.getInstance().emit(name, dataObj);
    };
    /**
     * 销毁EventBus
     */
    EventCenter.prototype.dispose = function () {
        _instance = null;
    };
    return EventCenter;
}());
exports.default = EventCenter;
var PrivateSingle = /** @class */ (function () {
    function PrivateSingle() {
    }
    return PrivateSingle;
}());


/***/ }),

/***/ "./src/events/EventLevel.ts":
/*!**********************************!*\
  !*** ./src/events/EventLevel.ts ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * event level
 * @type {{}}
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventLevel = {
    STATUS: 'status',
    COMMAND: 'command',
    ERROR: 'error',
    NOTE: 'note',
    WARNING: 'warning',
    HINT: 'hint'
};


/***/ }),

/***/ "./src/events/EventNames.ts":
/*!**********************************!*\
  !*** ./src/events/EventNames.ts ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 向内Command事件类型
 */
exports.CommandEvents = {
    //枚举value值必须和函数名对应
    DIMENSION: 'dimension',
    CHANGE_SRC: 'changeSrc',
    CHANGE_DEFINITION: 'changeDefinition',
    DISPOSE: 'dispose',
    ENTER_FULL_SCREEN: 'enterFullScreen',
    EXIT_FULL_SCREEN: 'exitFullScreen',
    PAUSE: 'pause',
    PLAY: 'play',
    REPLAY: 'replay',
    RESET: 'reset',
    SET_CURRENT_TIME_BY_PERCENT: 'setCurrentTimeByPercent',
    SWITCH_DEFINITION: 'switchDefinition',
};
exports.PropEvents = {
    ASPECTRATIO: 'aspectRatio',
    BUFFERED: 'buffered',
    BUFFERED_END: 'bufferedEnd',
    BUFFERED_PERCENT: 'bufferedPercent',
    CURRENT_WIDTH: 'currentWidth',
    CURRENT_HEIGHT: 'currentHeight',
    CURRENT_TIME: 'currentTime',
    DURATION: 'duration',
    HEIGHT: 'height',
    MUTED: 'muted',
    POSTER: 'poster',
    VIDEO_PLAYBACK_QUALITY: 'videoPlaybackQuality',
    VOLUME: 'volume',
    WIDTH: 'width',
    SRC: 'src',
    PLAYBACK_RATE: 'playbackRate',
    LOOP: 'loop',
    PRELOAD: 'preload',
    AUTOPLAY: 'autoplay',
    SUPPORT_FULL_SCREEN: 'supportFullScreen',
    FULL_SCREEN_STATE: 'fullScreenState',
    DEFINITION: 'definition',
    CONTROLS: 'controls'
};
exports.WorkerEvents = {
    WORKER_INIT_SEGMENT_FINISHED: 'workerInitSegmentFinished',
    WORKER_MEDIA_SEGMENT_FINISHED: 'workerMediaSegmentFinished',
};


/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 播放 SDK 入口类
 */
var EventEmitter = __webpack_require__(/*! eventemitter3 */ "./node_modules/eventemitter3/index.js");
var GlobalAPI_1 = __webpack_require__(/*! ./api/GlobalAPI */ "./src/api/GlobalAPI.ts");
var RuntimeLog_1 = __webpack_require__(/*! ./log/RuntimeLog */ "./src/log/RuntimeLog.ts");
var EventBus_1 = __webpack_require__(/*! ./events/EventBus */ "./src/events/EventBus.ts");
var StateTypeList_1 = __webpack_require__(/*! ./config/StateTypeList */ "./src/config/StateTypeList.ts");
var EventCenter_1 = __webpack_require__(/*! ./events/EventCenter */ "./src/events/EventCenter.ts");
var PlayerStateManager_1 = __webpack_require__(/*! ./core/PlayerStateManager */ "./src/core/PlayerStateManager.ts");
var PlayerPluginManager_1 = __webpack_require__(/*! ./plugin/PlayerPluginManager */ "./src/plugin/PlayerPluginManager.ts");
var MediaPlayerConfig_1 = __webpack_require__(/*! ./config/MediaPlayerConfig */ "./src/config/MediaPlayerConfig.ts");
var MediaPlayer = /** @class */ (function (_super) {
    __extends(MediaPlayer, _super);
    /* ------------------------ constructor ------------------------ */
    /**
     * 构造函数
     * @param element
     * @param options
     */
    function MediaPlayer(options) {
        var _this = _super.call(this) || this;
        /**
         * 监听内核销毁事件
         * @param e
         */
        _this.disposeCoreSuccessHandler = function (e) {
            RuntimeLog_1.default.getInstance().log('player core dispose success');
            RuntimeLog_1.default.getInstance().dispose();
            GlobalAPI_1.default.getInstance().dispose();
            EventCenter_1.default.getInstance().dispose();
            PlayerStateManager_1.default.getInstance().dispose();
            PlayerPluginManager_1.default.getInstance().dispose();
            _this._globalAPI = null;
            _this._options = null;
            EventBus_1.default.getInstance().dispose();
            _this.removeAllListeners();
        };
        _this.setShowLog(options.isShowLog);
        _this._options = options;
        return _this;
    }
    Object.defineProperty(MediaPlayer.prototype, "aspectRatio", {
        /* ------------------------ property ------------------------ */
        /**
         * player像素比
         * @returns {string}
         */
        get: function () {
            return this._globalAPI.getCorePropertyByName('aspectRatio');
        },
        set: function (value) {
            this._globalAPI.setCorePropertyByName('aspectRatio', value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MediaPlayer.prototype, "buffered", {
        /**
         * player已缓冲范围（只读）
         * @returns {any}
         */
        get: function () {
            return this._globalAPI.getCorePropertyByName('buffered');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MediaPlayer.prototype, "bufferedEnd", {
        /**
         * player已缓冲范围结尾时间（只读）
         * @returns {number}
         */
        get: function () {
            return this._globalAPI.getCorePropertyByName('bufferedEnd');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MediaPlayer.prototype, "bufferedPercent", {
        /**
         * player已缓冲百分比（只读）
         * @returns {number}
         */
        get: function () {
            return this._globalAPI.getCorePropertyByName('bufferedPercent');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MediaPlayer.prototype, "currentWidth", {
        /**
         * video实际宽度（只读）
         * @returns {number}
         */
        get: function () {
            return this._globalAPI.getCorePropertyByName('currentWidth');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MediaPlayer.prototype, "currentHeight", {
        /**
         * video实际高度（只读）
         * @returns {number}
         */
        get: function () {
            return this._globalAPI.getCorePropertyByName('currentHeight');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MediaPlayer.prototype, "currentTime", {
        get: function () {
            return this._globalAPI.getCorePropertyByName('currentTime');
        },
        /**
         * player当前播放时间
         * @returns {number}
         */
        set: function (value) {
            this._globalAPI.setCorePropertyByName('currentTime', value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MediaPlayer.prototype, "duration", {
        /**
         * player总时长
         * @returns {number}
         */
        get: function () {
            return this._globalAPI.getCorePropertyByName('duration');
        },
        set: function (value) {
            this._globalAPI.setCorePropertyByName('duration', value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MediaPlayer.prototype, "height", {
        /**
         * player高度
         * @returns {number}
         */
        get: function () {
            return this._globalAPI.getCorePropertyByName('height');
        },
        set: function (value) {
            this._globalAPI.setCorePropertyByName('height', value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MediaPlayer.prototype, "muted", {
        /**
         * player静音
         * @returns {boolean}
         */
        get: function () {
            return this._globalAPI.getCorePropertyByName('muted');
        },
        set: function (value) {
            this._globalAPI.setCorePropertyByName('muted', value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MediaPlayer.prototype, "poster", {
        /**
         * player封面
         * @returns {string}
         */
        get: function () {
            return this._globalAPI.getCorePropertyByName('poster');
        },
        set: function (value) {
            this._globalAPI.setCorePropertyByName('poster', value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MediaPlayer.prototype, "videoPlaybackQuality", {
        /**
         * player质量（只读）
         * @returns {number}
         */
        get: function () {
            return this._globalAPI.getCorePropertyByName('videoPlaybackQuality');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MediaPlayer.prototype, "volume", {
        /**
         * player声音
         * @returns {number}
         */
        get: function () {
            return this._globalAPI.getCorePropertyByName('volume');
        },
        set: function (value) {
            this._globalAPI.setCorePropertyByName('volume', value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MediaPlayer.prototype, "controls", {
        /**
         * player控制栏
         */
        get: function () {
            return this._globalAPI.getCorePropertyByName('controls');
        },
        set: function (value) {
            this._globalAPI.setCorePropertyByName('controls', value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MediaPlayer.prototype, "width", {
        /**
         * player宽度
         * @returns {number}
         */
        get: function () {
            return this._globalAPI.getCorePropertyByName('width');
        },
        set: function (value) {
            this._globalAPI.setCorePropertyByName('width', value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MediaPlayer.prototype, "src", {
        /**
         * player播放source
         * @returns {any}
         */
        get: function () {
            return this._globalAPI.getCorePropertyByName('src');
        },
        set: function (value) {
            this._globalAPI.setCorePropertyByName('src', value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MediaPlayer.prototype, "playbackRate", {
        /**
         * player播放速度
         * @returns {any}
         */
        get: function () {
            return this._globalAPI.getCorePropertyByName('playbackRate');
        },
        set: function (value) {
            this._globalAPI.setCorePropertyByName('playbackRate', value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MediaPlayer.prototype, "loop", {
        /**
         * player是否循环播放
         * @returns {any}
         */
        get: function () {
            return this._globalAPI.getCorePropertyByName('loop');
        },
        set: function (value) {
            this._globalAPI.setCorePropertyByName('loop', value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MediaPlayer.prototype, "preload", {
        /**
         * player是否预加载
         * @returns {any}
         */
        get: function () {
            return this._globalAPI.getCorePropertyByName('preload');
        },
        set: function (value) {
            this._globalAPI.setCorePropertyByName('preload', value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MediaPlayer.prototype, "autoplay", {
        /**
         * player是否开始自动播放
         * @returns {any}
         */
        get: function () {
            return this._globalAPI.getCorePropertyByName('autoplay');
        },
        set: function (value) {
            this._globalAPI.setCorePropertyByName('autoplay', value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MediaPlayer.prototype, "supportFullScreen", {
        /**
         * player是否支持全屏，若player无该方法则返回null
         * @returns {any}
         */
        get: function () {
            return this._globalAPI.getCorePropertyByName('supportFullScreen');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MediaPlayer.prototype, "fullScreenState", {
        /**
         * 获取player全屏状态
         * @returns {any}
         */
        get: function () {
            return this._globalAPI.getCorePropertyByName('fullScreenState');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MediaPlayer.prototype, "srcList", {
        /**
         * 获取分辨率
         */
        get: function () {
            return this._globalAPI.getCorePropertyByName('srcList');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MediaPlayer.prototype, "mediaPlayerState", {
        /**
         * 获取Player当前状态
         * @returns {any}
         */
        get: function () {
            return PlayerStateManager_1.default.getInstance().getPlayerState();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MediaPlayer.prototype, "mediaPlayerConfig", {
        /**
         * 获取Player当前配置
         */
        get: function () {
            return MediaPlayerConfig_1.playerConfig;
        },
        enumerable: true,
        configurable: true
    });
    /* ------------------------ function --------------------------- */
    /**
     * 初始化player外抛事件监听器
     */
    MediaPlayer.prototype.initOutwardStatesEventsListener = function () {
        var _this = this;
        EventBus_1.default.getInstance().on('PlayerMediaEvent', function (e) {
            _this.dispatchOutwardEvent('PlayerMediaEvent', e);
        });
        EventBus_1.default.getInstance().on('PlayerError', function (e) {
            _this.dispatchOutwardEvent('playerError', e);
        });
        EventBus_1.default.getInstance().on('PlayerMediaInfoParsed', function (e) {
            _this.dispatchOutwardEvent('PlayerMediaInfoParsed', e);
        });
        EventBus_1.default.getInstance().on('PlayerDownloadSpeed', function (e) {
            _this.dispatchOutwardEvent('PlayerDownloadSpeed', e);
        });
    };
    /**
     * 向media player抛出事件
     */
    MediaPlayer.prototype.dispatchOutwardEvent = function (type, params) {
        this.emit(type, params);
    };
    /**
     * 初始化 player SDK
     */
    MediaPlayer.prototype.init = function () {
        var options = this._options;
        RuntimeLog_1.default.getInstance().outputSdkInfo();
        // Player状态设置为未就绪
        PlayerStateManager_1.default.getInstance().updatePlayerState(StateTypeList_1.StateTypeList.NOT_READY);
        this.initOutwardStatesEventsListener();
        // 初始化API模块
        var _GlobalAPIOpts = options;
        this._globalAPI = GlobalAPI_1.default.getInstance(_GlobalAPIOpts);
        // 初始化插件模块
        PlayerPluginManager_1.default.getInstance(options.pluginList || []);
        // 初始化打点模块
        // SensorUtils.getInstance(options.saInstance, options.productId, options.isProd);
        // EventBus.getInstance().on('disposeCoreSuccess', this.disposeCoreSuccessHandler);
    };
    /**
     * 切换视频分辨率
     * @param {string} resolution
     */
    MediaPlayer.prototype.changeResolution = function (resolution) {
        this._globalAPI.callFuncByName('changeResolution', resolution);
    };
    /**
     * 切换视频播放源
     * @param {string} source
     */
    MediaPlayer.prototype.changeSrc = function (source) {
        this._globalAPI.callFuncByName('changeSrc', source);
    };
    /**
     * 切换分辨率
     * @param definition
     */
    MediaPlayer.prototype.changeDefinition = function (definition) {
        this._globalAPI.callFuncByName('changeDefinition', definition);
    };
    /**
     * 进入全屏
     */
    MediaPlayer.prototype.enterFullScreen = function () {
        this._globalAPI.callFuncByName('enterFullScreen');
    };
    /**
     * 退出全屏
     */
    MediaPlayer.prototype.exitFullScreen = function () {
        this._globalAPI.callFuncByName('exitFullScreen');
    };
    /**
     * player暂停播放
     */
    MediaPlayer.prototype.pause = function () {
        this._globalAPI.callFuncByName('pause');
    };
    /**
     * player开始播放
     */
    MediaPlayer.prototype.play = function () {
        this._globalAPI.callFuncByName('play');
    };
    /**
     * player重播
     */
    MediaPlayer.prototype.replay = function () {
        this._globalAPI.callFuncByName('replay');
    };
    /**
     * player重置
     */
    MediaPlayer.prototype.reset = function () {
        this._globalAPI.callFuncByName('reset');
    };
    /**
     * 通过百分比设置player当前播放进度
     * @param {number} percent
     */
    MediaPlayer.prototype.setCurrentTimeByPercent = function (percent) {
        this._globalAPI.callFuncByName('setCurrentTimeByPercent', percent);
    };
    /**
     * 设置是否显示log日志
     * @param {boolean} value
     */
    MediaPlayer.prototype.setShowLog = function (value) {
        RuntimeLog_1.default.getInstance().changeShowLog(value);
    };
    /**
     * 注册插件
     */
    MediaPlayer.prototype.registerPlugin = function (plugins) {
        PlayerPluginManager_1.default.getInstance().registerPlugin(plugins);
    };
    /**
     * 销毁player
     */
    MediaPlayer.prototype.dispose = function () {
        this._globalAPI.callFuncByName('dispose');
    };
    return MediaPlayer;
}(EventEmitter));
exports.default = MediaPlayer;


/***/ }),

/***/ "./src/log/RuntimeLog.ts":
/*!*******************************!*\
  !*** ./src/log/RuntimeLog.ts ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var EventBus_1 = __webpack_require__(/*! ../events/EventBus */ "./src/events/EventBus.ts");
var EventNames_1 = __webpack_require__(/*! ../events/EventNames */ "./src/events/EventNames.ts");
var MediaPlayerConfig_1 = __webpack_require__(/*! ../config/MediaPlayerConfig */ "./src/config/MediaPlayerConfig.ts");
/**
 * 运行时日志
 */
var _instance;
var RuntimeLog = /** @class */ (function () {
    function RuntimeLog(sign) {
        var _this = this;
        /**
         * log事件handler
         */
        this.logEventHandler = function (e) {
            if (!e.message)
                return;
            _this.log(e.message);
        };
        /**
         * command事件handler
         */
        this.commandEventHandler = function (e) {
            _this.command(e.message || 'command has no message');
        };
        /**
         * 初始化warning命令事件监听
         */
        this.initWarningListener = function () {
            //TODO: 暂无警告需求
        };
        /**
         * 初始化error事件handler
         */
        this.initErrorLinstener = function () {
            EventBus_1.default.getInstance().on('PlayerError', _this.errorEventHandler);
        };
        /**
         * command事件handler
         */
        this.errorEventHandler = function (e) {
            _this.error(e.message || 'error has no message');
        };
        if (sign !== PrivateClass)
            throw new Error('class RuntimeLogCenter is singleton, do not use new operator!');
        this.initLogListener();
        this.initCommandListener();
        this.initWarningListener();
        this.initErrorLinstener();
        this._isShowLog = false;
        this._isUploadLog = false; //目前强制不开启
    }
    RuntimeLog.getInstance = function () {
        if (!_instance) {
            _instance = new RuntimeLog(PrivateClass);
        }
        return _instance;
    };
    /**
     * 初始化log命令事件监听
     */
    RuntimeLog.prototype.initLogListener = function () {
        EventBus_1.default.getInstance().on('PlayerMediaEvent', this.logEventHandler);
    };
    /**
     * 初始化command命令事件监听
     */
    RuntimeLog.prototype.initCommandListener = function () {
        for (var key in EventNames_1.CommandEvents) {
            EventBus_1.default.getInstance().on(EventNames_1.CommandEvents[key], this.commandEventHandler);
        }
        for (var key in EventNames_1.PropEvents) {
            EventBus_1.default.getInstance().on('set-' + EventNames_1.PropEvents[key], this.commandEventHandler);
            // EventBus.getInstance().on('get-' + PropEvents[key], this.commandEventHandler);
        }
    };
    /**
     * 上传日志
     */
    RuntimeLog.prototype.uploadLog = function (argsArr) {
        if (!this._isUploadLog)
            return;
        var _message = argsArr.join(' ');
        var _tempMsgObj = {
            message: _message,
            type: 'logList'
        };
        // SensorUtils.getInstance().track(_tempMsgObj);
    };
    RuntimeLog.prototype.outputSdkInfo = function () {
        //sdk info in console log
        var args = ["%c %c \u2665 VKD-Player version: " + MediaPlayerConfig_1.MediaPlayerSdkInfo.version + " \u2730 %cAuthor: @ " + MediaPlayerConfig_1.MediaPlayerSdkInfo.author + " ",
            'background: #f86; padding:5px 0; line-height:14px; margin: 10px 0; font-family: Arial;',
            'color: #f86; background: #030307; padding:5px 0;',
            'color: #f86; background: #030307; padding:5px 0;'
        ];
        console.log.apply(console, args);
    };
    /**
     * 是否输出runtime日志
     * @param {boolean} value
     */
    RuntimeLog.prototype.changeShowLog = function (value) {
        this._isShowLog = value;
    };
    /**
     * 输出 log
     * @param args
     */
    RuntimeLog.prototype.log = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (!this._isShowLog)
            return;
        args[0] = "[VIDEO-SDK RT Log]: " + args[0];
        console.log.apply(this, args);
        this.uploadLog(args);
    };
    /**
     * 输出 command
     * @param args
     */
    RuntimeLog.prototype.command = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (!this._isShowLog)
            return;
        args[0] = "[VIDEO-SDK RT Command]: " + args[0];
        console.log.apply(this, args);
        this.uploadLog(args);
    };
    /**
     * 输出 warning
     * @param args
     */
    RuntimeLog.prototype.warning = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (!this._isShowLog)
            return;
        args[0] = "[VIDEO-SDK RT Warn]: " + args[0];
        console.warn.apply(this, args);
        this.uploadLog(args);
    };
    /**
     * 输出 error
     * @param args
     */
    RuntimeLog.prototype.error = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (!this._isShowLog)
            return;
        args[0] = "[VIDEO-SDK RT Error]: " + args[0];
        console.error.apply(this, args);
        this.uploadLog(args);
    };
    /**
     * 销毁 RuntimLog
     */
    RuntimeLog.prototype.dispose = function () {
        _instance = null;
    };
    return RuntimeLog;
}());
exports.default = RuntimeLog;
var PrivateClass = /** @class */ (function () {
    function PrivateClass() {
    }
    return PrivateClass;
}());


/***/ }),

/***/ "./src/plugin/PlayerPluginManager.ts":
/*!*******************************************!*\
  !*** ./src/plugin/PlayerPluginManager.ts ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var RuntimeLog_1 = __webpack_require__(/*! ../log/RuntimeLog */ "./src/log/RuntimeLog.ts");
var EventBus_1 = __webpack_require__(/*! ../events/EventBus */ "./src/events/EventBus.ts");
var NormalUtils_1 = __webpack_require__(/*! ../utils/NormalUtils */ "./src/utils/NormalUtils.ts");
/**
 * 插件管理类单例
 */
var _instance;
var PlayerPluginManager = /** @class */ (function () {
    function PlayerPluginManager(sign, pluginArr) {
        if (sign !== PrivateClass)
            throw new Error('class PlayerPluginManager is singleton, do not use new operator!');
        if (!this._plugins && !pluginArr) {
            throw new Error('plugin array is undefined! It\'s a must-pass param when initialization.');
        }
        this._plugins = pluginArr;
        //media events
        EventBus_1.default.getInstance().on('PlayerMediaEvent', function (e) {
            // this.dispatchOutwardEvent('PlayerMediaEvent', e);
            pluginArr.forEach(function (item) {
                var funcName = "on" + e.code;
                if (NormalUtils_1.default.typeOf(item[funcName]) === 'Function') {
                    item[funcName](e);
                }
            });
        });
        //error events
        EventBus_1.default.getInstance().on('PlayerError', function (e) {
            pluginArr.forEach(function (item) {
                if (NormalUtils_1.default.typeOf(item['onError']) === 'Function') {
                    item['onError'].call(item, e);
                }
            });
        });
        //network events
        EventBus_1.default.getInstance().on('PlayerDownloadSpeed', function (e) {
            pluginArr.forEach(function (item) {
                if (NormalUtils_1.default.typeOf(item['onNetSpeed']) === 'Function') {
                    item['onNetSpeed'].call(item, e);
                }
            });
        });
        //media info
        EventBus_1.default.getInstance().on('PlayerMediaInfoParsed', function (e) {
            pluginArr.forEach(function (item) {
                if (NormalUtils_1.default.typeOf(item['onMediaInfoParsed']) === 'Function') {
                    item['onMediaInfoParsed'].call(item, e);
                }
            });
        });
    }
    Object.defineProperty(PlayerPluginManager.prototype, "pluginList", {
        get: function () {
            return this._plugins;
        },
        enumerable: true,
        configurable: true
    });
    PlayerPluginManager.getInstance = function (pluginArr) {
        if (!_instance) {
            _instance = new PlayerPluginManager(PrivateClass, pluginArr);
        }
        return _instance;
    };
    /**
     * 注册插件
     * @param pluginInstance
     */
    PlayerPluginManager.prototype.registerPlugin = function (pluginInstance) {
        var _this = this;
        if (!this._plugins) {
            RuntimeLog_1.default.getInstance().warning("cannot register plugins when pluginManager init failed.");
            return;
        }
        ;
        if (pluginInstance instanceof Array) {
            pluginInstance.forEach(function (item) {
                _this._plugins.push(pluginInstance);
            });
        }
        else {
            this._plugins.push(pluginInstance);
        }
    };
    /**
     * 销毁
     */
    PlayerPluginManager.prototype.dispose = function () {
        if (this._plugins) {
            this._plugins.length = 0;
        }
        _instance = undefined;
    };
    return PlayerPluginManager;
}());
exports.default = PlayerPluginManager;
/**
 * 内部类
 */
var PrivateClass = /** @class */ (function () {
    function PrivateClass() {
    }
    return PrivateClass;
}());


/***/ }),

/***/ "./src/utils/MathUtils.ts":
/*!********************************!*\
  !*** ./src/utils/MathUtils.ts ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var MathUtils = /** @class */ (function () {
    function MathUtils() {
    }
    /**
     * 十进制转十六进制
     */
    MathUtils.toHex = function () {
        var value = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            value[_i] = arguments[_i];
        }
        var hex = [];
        value.forEach(function (item) {
            hex.push(Number(item).toString(16));
        });
        return hex;
    };
    /**
     * 多项求和
     * @param {number} valueArr
     * @returns {number}
     */
    MathUtils.sum = function () {
        var valueArr = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            valueArr[_i] = arguments[_i];
        }
        var count = 0;
        valueArr.forEach(function (item) {
            count += item;
        });
        return count;
    };
    return MathUtils;
}());
exports.default = MathUtils;


/***/ }),

/***/ "./src/utils/NormalUtils.ts":
/*!**********************************!*\
  !*** ./src/utils/NormalUtils.ts ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var NormalUtils = /** @class */ (function () {
    function NormalUtils() {
    }
    /**
     * 合并两个object， 返回合并后的object
     * @param {object} objA
     * @param {object} objB
     * @returns {object}
     */
    NormalUtils.mergeObj = function (objA, objB) {
        var _tempObj;
        _tempObj = __assign(__assign({}, objA), objB);
        return _tempObj;
    };
    /**
     * 判断是否为微信浏览器环境
     * @returns {boolean}
     */
    NormalUtils.is_weixin = function () {
        var ua = navigator.userAgent.toLowerCase();
        return ua.indexOf('micromessenger') != -1;
    };
    /**
     * 判断是否为苹果操作系统
     */
    NormalUtils.is_iOS = function () {
        var ua = navigator.userAgent;
        return !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    };
    /**
     * 解析路径或文件名中的文件扩展
     * @param {string} url
     * @returns {string[]}
     */
    NormalUtils.parseExtended = function (url) {
        var _tempUrl = url;
        var pattern = /\.\w{2,4}/ig;
        return _tempUrl.match(pattern).pop().toString();
    };
    /**
     * 类型判断
     * @param obj
     * @returns {any}
     */
    NormalUtils.typeOf = function (obj) {
        return Object.prototype.toString.call(obj).match(/([^\s.*]+)(?=]$)/g)[0];
    };
    /**
     * 创建dom
     * @param {HTMLElement} el
     * @param {string} tpl
     * @param {{}} attrs
     * @param {string} cname
     */
    NormalUtils.createDom = function (el, tpl, attrs, cname) {
        if (el === void 0) { el = 'div'; }
        if (tpl === void 0) { tpl = ''; }
        if (cname === void 0) { cname = ''; }
        var dom = document.createElement(el);
        dom.className = cname;
        dom.innerHTML = tpl;
        Object.keys(attrs).forEach(function (item) {
            var key = item;
            var value = attrs[item];
            if (el === 'video' || el === 'audio') {
                if (value) {
                    dom.setAttribute(key, value);
                }
            }
            else {
                dom.setAttribute(key, value);
            }
        });
        return dom;
    };
    /**
     * 生成符合 RFC4122 标准的 UUID
     * @returns {string}
     */
    NormalUtils.generateUUID = function () {
        var lut = [];
        for (var i = 0; i < 256; i++) {
            lut[i] = (i < 16 ? '0' : '') + (i).toString(16);
        }
        var d0 = Math.random() * 0xffffffff | 0;
        var d1 = Math.random() * 0xffffffff | 0;
        var d2 = Math.random() * 0xffffffff | 0;
        var d3 = Math.random() * 0xffffffff | 0;
        return lut[d0 & 0xff] + lut[d0 >> 8 & 0xff] + lut[d0 >> 16 & 0xff] + lut[d0 >> 24 & 0xff] + '-' +
            lut[d1 & 0xff] + lut[d1 >> 8 & 0xff] + '-' + lut[d1 >> 16 & 0x0f | 0x40] + lut[d1 >> 24 & 0xff] + '-' +
            lut[d2 & 0x3f | 0x80] + lut[d2 >> 8 & 0xff] + '-' + lut[d2 >> 16 & 0xff] + lut[d2 >> 24 & 0xff] +
            lut[d3 & 0xff] + lut[d3 >> 8 & 0xff] + lut[d3 >> 16 & 0xff] + lut[d3 >> 24 & 0xff];
    };
    /**
     * 拼接两个或多个类型化数组
     * @param constructorFn
     * @param {any[]} arrays
     */
    NormalUtils.concatTypedArray = function (constructorFn) {
        var arrays = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            arrays[_i - 1] = arguments[_i];
        }
        var totalLength = 0;
        for (var _a = 0, arrays_1 = arrays; _a < arrays_1.length; _a++) {
            var arr = arrays_1[_a];
            totalLength += arr.length;
        }
        var result = new constructorFn(totalLength);
        var offset = 0;
        for (var _b = 0, arrays_2 = arrays; _b < arrays_2.length; _b++) {
            var arr = arrays_2[_b];
            result.set(arr, offset);
            offset += arr.length;
        }
        return result;
    };
    /**
     * 拼接Uint8Array
     * @param constructorFn
     * @param {any[]} arrays
     */
    NormalUtils.concatUint8Array = function () {
        var arrays = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            arrays[_i] = arguments[_i];
        }
        var totalLength = 0;
        for (var _a = 0, arrays_3 = arrays; _a < arrays_3.length; _a++) {
            var arr = arrays_3[_a];
            totalLength += arr.length;
        }
        var result = new Uint8Array(totalLength);
        var offset = 0;
        for (var _b = 0, arrays_4 = arrays; _b < arrays_4.length; _b++) {
            var arr = arrays_4[_b];
            result.set(arr, offset);
            offset += arr.length;
        }
        return result;
    };
    /**
     * 过滤字符串中的空格
     * @param str
     */
    NormalUtils.strSpaceFilter = function (str) {
        return str = str.replace(/\s+/g, "");
    };
    /**
     * 解决多位小数精度问题
     */
    // static printFn(value: number) {
    //     const precision = 14;
    //     return Number(format(value, precision));
    // }
    /**
     * 节流器
     */
    NormalUtils.throttle = function (cb, duration) {
        if (duration === void 0) { duration = 500; }
        var lastTime = new Date().getTime();
        return function () {
            var now = new Date().getTime();
            if (now - lastTime > duration) {
                cb();
                lastTime = now;
            }
        };
    };
    return NormalUtils;
}());
exports.default = NormalUtils;


/***/ })

/******/ })["default"];
});
//# sourceMappingURL=VFMediaPlayer.js.map