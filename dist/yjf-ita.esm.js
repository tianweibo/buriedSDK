import require$$1 from 'http';
import require$$2 from 'https';
import require$$0 from 'url';
import require$$3 from 'stream';
import require$$4 from 'assert';
import require$$8 from 'zlib';

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

var axios$1 = {exports: {}};

var bind$2 = function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
};

var bind$1 = bind$2;

/*global toString:true*/

// utils is a library of generic helper functions non-specific to axios

var toString = Object.prototype.toString;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Array, otherwise false
 */
function isArray(val) {
  return toString.call(val) === '[object Array]';
}

/**
 * Determine if a value is undefined
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if the value is undefined, otherwise false
 */
function isUndefined(val) {
  return typeof val === 'undefined';
}

/**
 * Determine if a value is a Buffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Buffer, otherwise false
 */
function isBuffer(val) {
  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
    && typeof val.constructor.isBuffer === 'function' && val.constructor.isBuffer(val);
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
function isArrayBuffer(val) {
  return toString.call(val) === '[object ArrayBuffer]';
}

/**
 * Determine if a value is a FormData
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an FormData, otherwise false
 */
function isFormData(val) {
  return (typeof FormData !== 'undefined') && (val instanceof FormData);
}

/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  var result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a String, otherwise false
 */
function isString(val) {
  return typeof val === 'string';
}

/**
 * Determine if a value is a Number
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Number, otherwise false
 */
function isNumber(val) {
  return typeof val === 'number';
}

/**
 * Determine if a value is an Object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Object, otherwise false
 */
function isObject(val) {
  return val !== null && typeof val === 'object';
}

/**
 * Determine if a value is a plain Object
 *
 * @param {Object} val The value to test
 * @return {boolean} True if value is a plain Object, otherwise false
 */
function isPlainObject(val) {
  if (toString.call(val) !== '[object Object]') {
    return false;
  }

  var prototype = Object.getPrototypeOf(val);
  return prototype === null || prototype === Object.prototype;
}

/**
 * Determine if a value is a Date
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Date, otherwise false
 */
function isDate(val) {
  return toString.call(val) === '[object Date]';
}

/**
 * Determine if a value is a File
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */
function isFile(val) {
  return toString.call(val) === '[object File]';
}

/**
 * Determine if a value is a Blob
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Blob, otherwise false
 */
function isBlob(val) {
  return toString.call(val) === '[object Blob]';
}

/**
 * Determine if a value is a Function
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
function isFunction(val) {
  return toString.call(val) === '[object Function]';
}

/**
 * Determine if a value is a Stream
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Stream, otherwise false
 */
function isStream(val) {
  return isObject(val) && isFunction(val.pipe);
}

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
function isURLSearchParams(val) {
  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
}

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 * @returns {String} The String freed of excess whitespace
 */
function trim(str) {
  return str.replace(/^\s*/, '').replace(/\s*$/, '');
}

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 * nativescript
 *  navigator.product -> 'NativeScript' or 'NS'
 */
function isStandardBrowserEnv() {
  if (typeof navigator !== 'undefined' && (navigator.product === 'ReactNative' ||
                                           navigator.product === 'NativeScript' ||
                                           navigator.product === 'NS')) {
    return false;
  }
  return (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined'
  );
}

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 */
function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (isPlainObject(result[key]) && isPlainObject(val)) {
      result[key] = merge(result[key], val);
    } else if (isPlainObject(val)) {
      result[key] = merge({}, val);
    } else if (isArray(val)) {
      result[key] = val.slice();
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 * @return {Object} The resulting value of object a
 */
function extend(a, b, thisArg) {
  forEach(b, function assignValue(val, key) {
    if (thisArg && typeof val === 'function') {
      a[key] = bind$1(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}

/**
 * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
 *
 * @param {string} content with BOM
 * @return {string} content value without BOM
 */
function stripBOM(content) {
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }
  return content;
}

var utils$e = {
  isArray: isArray,
  isArrayBuffer: isArrayBuffer,
  isBuffer: isBuffer,
  isFormData: isFormData,
  isArrayBufferView: isArrayBufferView,
  isString: isString,
  isNumber: isNumber,
  isObject: isObject,
  isPlainObject: isPlainObject,
  isUndefined: isUndefined,
  isDate: isDate,
  isFile: isFile,
  isBlob: isBlob,
  isFunction: isFunction,
  isStream: isStream,
  isURLSearchParams: isURLSearchParams,
  isStandardBrowserEnv: isStandardBrowserEnv,
  forEach: forEach,
  merge: merge,
  extend: extend,
  trim: trim,
  stripBOM: stripBOM
};

var utils$d = utils$e;

function encode(val) {
  return encodeURIComponent(val).
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @returns {string} The formatted url
 */
var buildURL$3 = function buildURL(url, params, paramsSerializer) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }

  var serializedParams;
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (utils$d.isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    var parts = [];

    utils$d.forEach(params, function serialize(val, key) {
      if (val === null || typeof val === 'undefined') {
        return;
      }

      if (utils$d.isArray(val)) {
        key = key + '[]';
      } else {
        val = [val];
      }

      utils$d.forEach(val, function parseValue(v) {
        if (utils$d.isDate(v)) {
          v = v.toISOString();
        } else if (utils$d.isObject(v)) {
          v = JSON.stringify(v);
        }
        parts.push(encode(key) + '=' + encode(v));
      });
    });

    serializedParams = parts.join('&');
  }

  if (serializedParams) {
    var hashmarkIndex = url.indexOf('#');
    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }

    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
};

var utils$c = utils$e;

function InterceptorManager$1() {
  this.handlers = [];
}

/**
 * Add a new interceptor to the stack
 *
 * @param {Function} fulfilled The function to handle `then` for a `Promise`
 * @param {Function} rejected The function to handle `reject` for a `Promise`
 *
 * @return {Number} An ID used to remove interceptor later
 */
InterceptorManager$1.prototype.use = function use(fulfilled, rejected) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected
  });
  return this.handlers.length - 1;
};

/**
 * Remove an interceptor from the stack
 *
 * @param {Number} id The ID that was returned by `use`
 */
InterceptorManager$1.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};

/**
 * Iterate over all the registered interceptors
 *
 * This method is particularly useful for skipping over any
 * interceptors that may have become `null` calling `eject`.
 *
 * @param {Function} fn The function to call for each interceptor
 */
InterceptorManager$1.prototype.forEach = function forEach(fn) {
  utils$c.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};

var InterceptorManager_1 = InterceptorManager$1;

var utils$b = utils$e;

/**
 * Transform the data for a request or a response
 *
 * @param {Object|String} data The data to be transformed
 * @param {Array} headers The headers for the request or response
 * @param {Array|Function} fns A single function or Array of functions
 * @returns {*} The resulting transformed data
 */
var transformData$1 = function transformData(data, headers, fns) {
  /*eslint no-param-reassign:0*/
  utils$b.forEach(fns, function transform(fn) {
    data = fn(data, headers);
  });

  return data;
};

var isCancel$1 = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};

var utils$a = utils$e;

var normalizeHeaderName$1 = function normalizeHeaderName(headers, normalizedName) {
  utils$a.forEach(headers, function processHeader(value, name) {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = value;
      delete headers[name];
    }
  });
};

/**
 * Update an Error with the specified config, error code, and response.
 *
 * @param {Error} error The error to update.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The error.
 */
var enhanceError$2 = function enhanceError(error, config, code, request, response) {
  error.config = config;
  if (code) {
    error.code = code;
  }

  error.request = request;
  error.response = response;
  error.isAxiosError = true;

  error.toJSON = function toJSON() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: this.config,
      code: this.code
    };
  };
  return error;
};

var enhanceError$1 = enhanceError$2;

/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The created error.
 */
var createError$3 = function createError(message, config, code, request, response) {
  var error = new Error(message);
  return enhanceError$1(error, config, code, request, response);
};

var createError$2 = createError$3;

/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 */
var settle$2 = function settle(resolve, reject, response) {
  var validateStatus = response.config.validateStatus;
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(createError$2(
      'Request failed with status code ' + response.status,
      response.config,
      null,
      response.request,
      response
    ));
  }
};

var utils$9 = utils$e;

var cookies$1 = (
  utils$9.isStandardBrowserEnv() ?

  // Standard browser envs support document.cookie
    (function standardBrowserEnv() {
      return {
        write: function write(name, value, expires, path, domain, secure) {
          var cookie = [];
          cookie.push(name + '=' + encodeURIComponent(value));

          if (utils$9.isNumber(expires)) {
            cookie.push('expires=' + new Date(expires).toGMTString());
          }

          if (utils$9.isString(path)) {
            cookie.push('path=' + path);
          }

          if (utils$9.isString(domain)) {
            cookie.push('domain=' + domain);
          }

          if (secure === true) {
            cookie.push('secure');
          }

          document.cookie = cookie.join('; ');
        },

        read: function read(name) {
          var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
          return (match ? decodeURIComponent(match[3]) : null);
        },

        remove: function remove(name) {
          this.write(name, '', Date.now() - 86400000);
        }
      };
    })() :

  // Non standard browser env (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return {
        write: function write() {},
        read: function read() { return null; },
        remove: function remove() {}
      };
    })()
);

/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
var isAbsoluteURL$1 = function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
};

/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 * @returns {string} The combined URL
 */
var combineURLs$1 = function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
};

var isAbsoluteURL = isAbsoluteURL$1;
var combineURLs = combineURLs$1;

/**
 * Creates a new URL by combining the baseURL with the requestedURL,
 * only when the requestedURL is not already an absolute URL.
 * If the requestURL is absolute, this function returns the requestedURL untouched.
 *
 * @param {string} baseURL The base URL
 * @param {string} requestedURL Absolute or relative URL to combine
 * @returns {string} The combined full path
 */
var buildFullPath$2 = function buildFullPath(baseURL, requestedURL) {
  if (baseURL && !isAbsoluteURL(requestedURL)) {
    return combineURLs(baseURL, requestedURL);
  }
  return requestedURL;
};

var utils$8 = utils$e;

// Headers whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
var ignoreDuplicateOf = [
  'age', 'authorization', 'content-length', 'content-type', 'etag',
  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
  'referer', 'retry-after', 'user-agent'
];

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} headers Headers needing to be parsed
 * @returns {Object} Headers parsed into an object
 */
var parseHeaders$1 = function parseHeaders(headers) {
  var parsed = {};
  var key;
  var val;
  var i;

  if (!headers) { return parsed; }

  utils$8.forEach(headers.split('\n'), function parser(line) {
    i = line.indexOf(':');
    key = utils$8.trim(line.substr(0, i)).toLowerCase();
    val = utils$8.trim(line.substr(i + 1));

    if (key) {
      if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
        return;
      }
      if (key === 'set-cookie') {
        parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
      }
    }
  });

  return parsed;
};

var utils$7 = utils$e;

var isURLSameOrigin$1 = (
  utils$7.isStandardBrowserEnv() ?

  // Standard browser envs have full support of the APIs needed to test
  // whether the request URL is of the same origin as current location.
    (function standardBrowserEnv() {
      var msie = /(msie|trident)/i.test(navigator.userAgent);
      var urlParsingNode = document.createElement('a');
      var originURL;

      /**
    * Parse a URL to discover it's components
    *
    * @param {String} url The URL to be parsed
    * @returns {Object}
    */
      function resolveURL(url) {
        var href = url;

        if (msie) {
        // IE needs attribute set twice to normalize properties
          urlParsingNode.setAttribute('href', href);
          href = urlParsingNode.href;
        }

        urlParsingNode.setAttribute('href', href);

        // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
        return {
          href: urlParsingNode.href,
          protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
          host: urlParsingNode.host,
          search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
          hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
          hostname: urlParsingNode.hostname,
          port: urlParsingNode.port,
          pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
            urlParsingNode.pathname :
            '/' + urlParsingNode.pathname
        };
      }

      originURL = resolveURL(window.location.href);

      /**
    * Determine if a URL shares the same origin as the current location
    *
    * @param {String} requestURL The URL to test
    * @returns {boolean} True if URL shares the same origin, otherwise false
    */
      return function isURLSameOrigin(requestURL) {
        var parsed = (utils$7.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
        return (parsed.protocol === originURL.protocol &&
            parsed.host === originURL.host);
      };
    })() :

  // Non standard browser envs (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return function isURLSameOrigin() {
        return true;
      };
    })()
);

var utils$6 = utils$e;
var settle$1 = settle$2;
var cookies = cookies$1;
var buildURL$2 = buildURL$3;
var buildFullPath$1 = buildFullPath$2;
var parseHeaders = parseHeaders$1;
var isURLSameOrigin = isURLSameOrigin$1;
var createError$1 = createError$3;

var xhr = function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    var requestData = config.data;
    var requestHeaders = config.headers;

    if (utils$6.isFormData(requestData)) {
      delete requestHeaders['Content-Type']; // Let the browser set it
    }

    var request = new XMLHttpRequest();

    // HTTP basic authentication
    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : '';
      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
    }

    var fullPath = buildFullPath$1(config.baseURL, config.url);
    request.open(config.method.toUpperCase(), buildURL$2(fullPath, config.params, config.paramsSerializer), true);

    // Set the request timeout in MS
    request.timeout = config.timeout;

    // Listen for ready state
    request.onreadystatechange = function handleLoad() {
      if (!request || request.readyState !== 4) {
        return;
      }

      // The request errored out and we didn't get a response, this will be
      // handled by onerror instead
      // With one exception: request that using file: protocol, most browsers
      // will return status as 0 even though it's a successful request
      if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
        return;
      }

      // Prepare the response
      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
      var responseData = !config.responseType || config.responseType === 'text' ? request.responseText : request.response;
      var response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config: config,
        request: request
      };

      settle$1(resolve, reject, response);

      // Clean up request
      request = null;
    };

    // Handle browser request cancellation (as opposed to a manual cancellation)
    request.onabort = function handleAbort() {
      if (!request) {
        return;
      }

      reject(createError$1('Request aborted', config, 'ECONNABORTED', request));

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(createError$1('Network Error', config, null, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      var timeoutErrorMessage = 'timeout of ' + config.timeout + 'ms exceeded';
      if (config.timeoutErrorMessage) {
        timeoutErrorMessage = config.timeoutErrorMessage;
      }
      reject(createError$1(timeoutErrorMessage, config, 'ECONNABORTED',
        request));

      // Clean up request
      request = null;
    };

    // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.
    if (utils$6.isStandardBrowserEnv()) {
      // Add xsrf header
      var xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath)) && config.xsrfCookieName ?
        cookies.read(config.xsrfCookieName) :
        undefined;

      if (xsrfValue) {
        requestHeaders[config.xsrfHeaderName] = xsrfValue;
      }
    }

    // Add headers to the request
    if ('setRequestHeader' in request) {
      utils$6.forEach(requestHeaders, function setRequestHeader(val, key) {
        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
          // Remove Content-Type if data is undefined
          delete requestHeaders[key];
        } else {
          // Otherwise add header to the request
          request.setRequestHeader(key, val);
        }
      });
    }

    // Add withCredentials to request if needed
    if (!utils$6.isUndefined(config.withCredentials)) {
      request.withCredentials = !!config.withCredentials;
    }

    // Add responseType to request if needed
    if (config.responseType) {
      try {
        request.responseType = config.responseType;
      } catch (e) {
        // Expected DOMException thrown by browsers not compatible XMLHttpRequest Level 2.
        // But, this can be suppressed for 'json' type as it can be parsed by default 'transformResponse' function.
        if (config.responseType !== 'json') {
          throw e;
        }
      }
    }

    // Handle progress if needed
    if (typeof config.onDownloadProgress === 'function') {
      request.addEventListener('progress', config.onDownloadProgress);
    }

    // Not all browsers support upload events
    if (typeof config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', config.onUploadProgress);
    }

    if (config.cancelToken) {
      // Handle cancellation
      config.cancelToken.promise.then(function onCanceled(cancel) {
        if (!request) {
          return;
        }

        request.abort();
        reject(cancel);
        // Clean up request
        request = null;
      });
    }

    if (!requestData) {
      requestData = null;
    }

    // Send the request
    request.send(requestData);
  });
};

var _followRedirects_1_14_9_followRedirects = {exports: {}};

var debug$1;

var debug_1 = function () {
  if (!debug$1) {
    try {
      /* eslint global-require: off */
      debug$1 = require("debug")("follow-redirects");
    }
    catch (error) { /* */ }
    if (typeof debug$1 !== "function") {
      debug$1 = function () { /* */ };
    }
  }
  debug$1.apply(null, arguments);
};

var url$1 = require$$0;
var URL = url$1.URL;
var http$2 = require$$1;
var https$1 = require$$2;
var Writable = require$$3.Writable;
var assert = require$$4;
var debug = debug_1;

// Create handlers that pass events from native requests
var events = ["abort", "aborted", "connect", "error", "socket", "timeout"];
var eventHandlers = Object.create(null);
events.forEach(function (event) {
  eventHandlers[event] = function (arg1, arg2, arg3) {
    this._redirectable.emit(event, arg1, arg2, arg3);
  };
});

// Error types with codes
var RedirectionError = createErrorType(
  "ERR_FR_REDIRECTION_FAILURE",
  "Redirected request failed"
);
var TooManyRedirectsError = createErrorType(
  "ERR_FR_TOO_MANY_REDIRECTS",
  "Maximum number of redirects exceeded"
);
var MaxBodyLengthExceededError = createErrorType(
  "ERR_FR_MAX_BODY_LENGTH_EXCEEDED",
  "Request body larger than maxBodyLength limit"
);
var WriteAfterEndError = createErrorType(
  "ERR_STREAM_WRITE_AFTER_END",
  "write after end"
);

// An HTTP(S) request that can be redirected
function RedirectableRequest(options, responseCallback) {
  // Initialize the request
  Writable.call(this);
  this._sanitizeOptions(options);
  this._options = options;
  this._ended = false;
  this._ending = false;
  this._redirectCount = 0;
  this._redirects = [];
  this._requestBodyLength = 0;
  this._requestBodyBuffers = [];

  // Attach a callback if passed
  if (responseCallback) {
    this.on("response", responseCallback);
  }

  // React to responses of native requests
  var self = this;
  this._onNativeResponse = function (response) {
    self._processResponse(response);
  };

  // Perform the first request
  this._performRequest();
}
RedirectableRequest.prototype = Object.create(Writable.prototype);

RedirectableRequest.prototype.abort = function () {
  abortRequest(this._currentRequest);
  this.emit("abort");
};

// Writes buffered data to the current native request
RedirectableRequest.prototype.write = function (data, encoding, callback) {
  // Writing is not allowed if end has been called
  if (this._ending) {
    throw new WriteAfterEndError();
  }

  // Validate input and shift parameters if necessary
  if (!(typeof data === "string" || typeof data === "object" && ("length" in data))) {
    throw new TypeError("data should be a string, Buffer or Uint8Array");
  }
  if (typeof encoding === "function") {
    callback = encoding;
    encoding = null;
  }

  // Ignore empty buffers, since writing them doesn't invoke the callback
  // https://github.com/nodejs/node/issues/22066
  if (data.length === 0) {
    if (callback) {
      callback();
    }
    return;
  }
  // Only write when we don't exceed the maximum body length
  if (this._requestBodyLength + data.length <= this._options.maxBodyLength) {
    this._requestBodyLength += data.length;
    this._requestBodyBuffers.push({ data: data, encoding: encoding });
    this._currentRequest.write(data, encoding, callback);
  }
  // Error when we exceed the maximum body length
  else {
    this.emit("error", new MaxBodyLengthExceededError());
    this.abort();
  }
};

// Ends the current native request
RedirectableRequest.prototype.end = function (data, encoding, callback) {
  // Shift parameters if necessary
  if (typeof data === "function") {
    callback = data;
    data = encoding = null;
  }
  else if (typeof encoding === "function") {
    callback = encoding;
    encoding = null;
  }

  // Write data if needed and end
  if (!data) {
    this._ended = this._ending = true;
    this._currentRequest.end(null, null, callback);
  }
  else {
    var self = this;
    var currentRequest = this._currentRequest;
    this.write(data, encoding, function () {
      self._ended = true;
      currentRequest.end(null, null, callback);
    });
    this._ending = true;
  }
};

// Sets a header value on the current native request
RedirectableRequest.prototype.setHeader = function (name, value) {
  this._options.headers[name] = value;
  this._currentRequest.setHeader(name, value);
};

// Clears a header value on the current native request
RedirectableRequest.prototype.removeHeader = function (name) {
  delete this._options.headers[name];
  this._currentRequest.removeHeader(name);
};

// Global timeout for all underlying requests
RedirectableRequest.prototype.setTimeout = function (msecs, callback) {
  var self = this;

  // Destroys the socket on timeout
  function destroyOnTimeout(socket) {
    socket.setTimeout(msecs);
    socket.removeListener("timeout", socket.destroy);
    socket.addListener("timeout", socket.destroy);
  }

  // Sets up a timer to trigger a timeout event
  function startTimer(socket) {
    if (self._timeout) {
      clearTimeout(self._timeout);
    }
    self._timeout = setTimeout(function () {
      self.emit("timeout");
      clearTimer();
    }, msecs);
    destroyOnTimeout(socket);
  }

  // Stops a timeout from triggering
  function clearTimer() {
    // Clear the timeout
    if (self._timeout) {
      clearTimeout(self._timeout);
      self._timeout = null;
    }

    // Clean up all attached listeners
    self.removeListener("abort", clearTimer);
    self.removeListener("error", clearTimer);
    self.removeListener("response", clearTimer);
    if (callback) {
      self.removeListener("timeout", callback);
    }
    if (!self.socket) {
      self._currentRequest.removeListener("socket", startTimer);
    }
  }

  // Attach callback if passed
  if (callback) {
    this.on("timeout", callback);
  }

  // Start the timer if or when the socket is opened
  if (this.socket) {
    startTimer(this.socket);
  }
  else {
    this._currentRequest.once("socket", startTimer);
  }

  // Clean up on events
  this.on("socket", destroyOnTimeout);
  this.on("abort", clearTimer);
  this.on("error", clearTimer);
  this.on("response", clearTimer);

  return this;
};

// Proxy all other public ClientRequest methods
[
  "flushHeaders", "getHeader",
  "setNoDelay", "setSocketKeepAlive",
].forEach(function (method) {
  RedirectableRequest.prototype[method] = function (a, b) {
    return this._currentRequest[method](a, b);
  };
});

// Proxy all public ClientRequest properties
["aborted", "connection", "socket"].forEach(function (property) {
  Object.defineProperty(RedirectableRequest.prototype, property, {
    get: function () { return this._currentRequest[property]; },
  });
});

RedirectableRequest.prototype._sanitizeOptions = function (options) {
  // Ensure headers are always present
  if (!options.headers) {
    options.headers = {};
  }

  // Since http.request treats host as an alias of hostname,
  // but the url module interprets host as hostname plus port,
  // eliminate the host property to avoid confusion.
  if (options.host) {
    // Use hostname if set, because it has precedence
    if (!options.hostname) {
      options.hostname = options.host;
    }
    delete options.host;
  }

  // Complete the URL object when necessary
  if (!options.pathname && options.path) {
    var searchPos = options.path.indexOf("?");
    if (searchPos < 0) {
      options.pathname = options.path;
    }
    else {
      options.pathname = options.path.substring(0, searchPos);
      options.search = options.path.substring(searchPos);
    }
  }
};


// Executes the next native request (initial or redirect)
RedirectableRequest.prototype._performRequest = function () {
  // Load the native protocol
  var protocol = this._options.protocol;
  var nativeProtocol = this._options.nativeProtocols[protocol];
  if (!nativeProtocol) {
    this.emit("error", new TypeError("Unsupported protocol " + protocol));
    return;
  }

  // If specified, use the agent corresponding to the protocol
  // (HTTP and HTTPS use different types of agents)
  if (this._options.agents) {
    var scheme = protocol.substr(0, protocol.length - 1);
    this._options.agent = this._options.agents[scheme];
  }

  // Create the native request
  var request = this._currentRequest =
        nativeProtocol.request(this._options, this._onNativeResponse);
  this._currentUrl = url$1.format(this._options);

  // Set up event handlers
  request._redirectable = this;
  for (var e = 0; e < events.length; e++) {
    request.on(events[e], eventHandlers[events[e]]);
  }

  // End a redirected request
  // (The first request must be ended explicitly with RedirectableRequest#end)
  if (this._isRedirect) {
    // Write the request entity and end.
    var i = 0;
    var self = this;
    var buffers = this._requestBodyBuffers;
    (function writeNext(error) {
      // Only write if this request has not been redirected yet
      /* istanbul ignore else */
      if (request === self._currentRequest) {
        // Report any write errors
        /* istanbul ignore if */
        if (error) {
          self.emit("error", error);
        }
        // Write the next buffer if there are still left
        else if (i < buffers.length) {
          var buffer = buffers[i++];
          /* istanbul ignore else */
          if (!request.finished) {
            request.write(buffer.data, buffer.encoding, writeNext);
          }
        }
        // End the request if `end` has been called on us
        else if (self._ended) {
          request.end();
        }
      }
    }());
  }
};

// Processes a response from the current native request
RedirectableRequest.prototype._processResponse = function (response) {
  // Store the redirected response
  var statusCode = response.statusCode;
  if (this._options.trackRedirects) {
    this._redirects.push({
      url: this._currentUrl,
      headers: response.headers,
      statusCode: statusCode,
    });
  }

  // RFC7231§6.4: The 3xx (Redirection) class of status code indicates
  // that further action needs to be taken by the user agent in order to
  // fulfill the request. If a Location header field is provided,
  // the user agent MAY automatically redirect its request to the URI
  // referenced by the Location field value,
  // even if the specific status code is not understood.

  // If the response is not a redirect; return it as-is
  var location = response.headers.location;
  if (!location || this._options.followRedirects === false ||
      statusCode < 300 || statusCode >= 400) {
    response.responseUrl = this._currentUrl;
    response.redirects = this._redirects;
    this.emit("response", response);

    // Clean up
    this._requestBodyBuffers = [];
    return;
  }

  // The response is a redirect, so abort the current request
  abortRequest(this._currentRequest);
  // Discard the remainder of the response to avoid waiting for data
  response.destroy();

  // RFC7231§6.4: A client SHOULD detect and intervene
  // in cyclical redirections (i.e., "infinite" redirection loops).
  if (++this._redirectCount > this._options.maxRedirects) {
    this.emit("error", new TooManyRedirectsError());
    return;
  }

  // RFC7231§6.4: Automatic redirection needs to done with
  // care for methods not known to be safe, […]
  // RFC7231§6.4.2–3: For historical reasons, a user agent MAY change
  // the request method from POST to GET for the subsequent request.
  if ((statusCode === 301 || statusCode === 302) && this._options.method === "POST" ||
      // RFC7231§6.4.4: The 303 (See Other) status code indicates that
      // the server is redirecting the user agent to a different resource […]
      // A user agent can perform a retrieval request targeting that URI
      // (a GET or HEAD request if using HTTP) […]
      (statusCode === 303) && !/^(?:GET|HEAD)$/.test(this._options.method)) {
    this._options.method = "GET";
    // Drop a possible entity and headers related to it
    this._requestBodyBuffers = [];
    removeMatchingHeaders(/^content-/i, this._options.headers);
  }

  // Drop the Host header, as the redirect might lead to a different host
  var currentHostHeader = removeMatchingHeaders(/^host$/i, this._options.headers);

  // If the redirect is relative, carry over the host of the last request
  var currentUrlParts = url$1.parse(this._currentUrl);
  var currentHost = currentHostHeader || currentUrlParts.host;
  var currentUrl = /^\w+:/.test(location) ? this._currentUrl :
    url$1.format(Object.assign(currentUrlParts, { host: currentHost }));

  // Determine the URL of the redirection
  var redirectUrl;
  try {
    redirectUrl = url$1.resolve(currentUrl, location);
  }
  catch (cause) {
    this.emit("error", new RedirectionError(cause));
    return;
  }

  // Create the redirected request
  debug("redirecting to", redirectUrl);
  this._isRedirect = true;
  var redirectUrlParts = url$1.parse(redirectUrl);
  Object.assign(this._options, redirectUrlParts);

  // Drop confidential headers when redirecting to a less secure protocol
  // or to a different domain that is not a superdomain
  if (redirectUrlParts.protocol !== currentUrlParts.protocol &&
     redirectUrlParts.protocol !== "https:" ||
     redirectUrlParts.host !== currentHost &&
     !isSubdomain(redirectUrlParts.host, currentHost)) {
    removeMatchingHeaders(/^(?:authorization|cookie)$/i, this._options.headers);
  }

  // Evaluate the beforeRedirect callback
  if (typeof this._options.beforeRedirect === "function") {
    var responseDetails = { headers: response.headers };
    try {
      this._options.beforeRedirect.call(null, this._options, responseDetails);
    }
    catch (err) {
      this.emit("error", err);
      return;
    }
    this._sanitizeOptions(this._options);
  }

  // Perform the redirected request
  try {
    this._performRequest();
  }
  catch (cause) {
    this.emit("error", new RedirectionError(cause));
  }
};

// Wraps the key/value object of protocols with redirect functionality
function wrap(protocols) {
  // Default settings
  var exports = {
    maxRedirects: 21,
    maxBodyLength: 10 * 1024 * 1024,
  };

  // Wrap each protocol
  var nativeProtocols = {};
  Object.keys(protocols).forEach(function (scheme) {
    var protocol = scheme + ":";
    var nativeProtocol = nativeProtocols[protocol] = protocols[scheme];
    var wrappedProtocol = exports[scheme] = Object.create(nativeProtocol);

    // Executes a request, following redirects
    function request(input, options, callback) {
      // Parse parameters
      if (typeof input === "string") {
        var urlStr = input;
        try {
          input = urlToOptions(new URL(urlStr));
        }
        catch (err) {
          /* istanbul ignore next */
          input = url$1.parse(urlStr);
        }
      }
      else if (URL && (input instanceof URL)) {
        input = urlToOptions(input);
      }
      else {
        callback = options;
        options = input;
        input = { protocol: protocol };
      }
      if (typeof options === "function") {
        callback = options;
        options = null;
      }

      // Set defaults
      options = Object.assign({
        maxRedirects: exports.maxRedirects,
        maxBodyLength: exports.maxBodyLength,
      }, input, options);
      options.nativeProtocols = nativeProtocols;

      assert.equal(options.protocol, protocol, "protocol mismatch");
      debug("options", options);
      return new RedirectableRequest(options, callback);
    }

    // Executes a GET request, following redirects
    function get(input, options, callback) {
      var wrappedRequest = wrappedProtocol.request(input, options, callback);
      wrappedRequest.end();
      return wrappedRequest;
    }

    // Expose the properties on the wrapped protocol
    Object.defineProperties(wrappedProtocol, {
      request: { value: request, configurable: true, enumerable: true, writable: true },
      get: { value: get, configurable: true, enumerable: true, writable: true },
    });
  });
  return exports;
}

/* istanbul ignore next */
function noop() { /* empty */ }

// from https://github.com/nodejs/node/blob/master/lib/internal/url.js
function urlToOptions(urlObject) {
  var options = {
    protocol: urlObject.protocol,
    hostname: urlObject.hostname.startsWith("[") ?
      /* istanbul ignore next */
      urlObject.hostname.slice(1, -1) :
      urlObject.hostname,
    hash: urlObject.hash,
    search: urlObject.search,
    pathname: urlObject.pathname,
    path: urlObject.pathname + urlObject.search,
    href: urlObject.href,
  };
  if (urlObject.port !== "") {
    options.port = Number(urlObject.port);
  }
  return options;
}

function removeMatchingHeaders(regex, headers) {
  var lastValue;
  for (var header in headers) {
    if (regex.test(header)) {
      lastValue = headers[header];
      delete headers[header];
    }
  }
  return (lastValue === null || typeof lastValue === "undefined") ?
    undefined : String(lastValue).trim();
}

function createErrorType(code, defaultMessage) {
  function CustomError(cause) {
    Error.captureStackTrace(this, this.constructor);
    if (!cause) {
      this.message = defaultMessage;
    }
    else {
      this.message = defaultMessage + ": " + cause.message;
      this.cause = cause;
    }
  }
  CustomError.prototype = new Error();
  CustomError.prototype.constructor = CustomError;
  CustomError.prototype.name = "Error [" + code + "]";
  CustomError.prototype.code = code;
  return CustomError;
}

function abortRequest(request) {
  for (var e = 0; e < events.length; e++) {
    request.removeListener(events[e], eventHandlers[events[e]]);
  }
  request.on("error", noop);
  request.abort();
}

function isSubdomain(subdomain, domain) {
  const dot = subdomain.length - domain.length - 1;
  return dot > 0 && subdomain[dot] === "." && subdomain.endsWith(domain);
}

// Exports
_followRedirects_1_14_9_followRedirects.exports = wrap({ http: http$2, https: https$1 });
_followRedirects_1_14_9_followRedirects.exports.wrap = wrap;

var name = "axios";
var version = "0.21.1";
var description = "Promise based HTTP client for the browser and node.js";
var main = "index.js";
var scripts = {
	test: "grunt test && bundlesize",
	start: "node ./sandbox/server.js",
	build: "NODE_ENV=production grunt build",
	preversion: "npm test",
	version: "npm run build && grunt version && git add -A dist && git add CHANGELOG.md bower.json package.json",
	postversion: "git push && git push --tags",
	examples: "node ./examples/server.js",
	coveralls: "cat coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js",
	fix: "eslint --fix lib/**/*.js"
};
var repository = {
	type: "git",
	url: "https://github.com/axios/axios.git"
};
var keywords = [
	"xhr",
	"http",
	"ajax",
	"promise",
	"node"
];
var author = "Matt Zabriskie";
var license = "MIT";
var bugs = {
	url: "https://github.com/axios/axios/issues"
};
var homepage = "https://github.com/axios/axios";
var devDependencies = {
	bundlesize: "^0.17.0",
	coveralls: "^3.0.0",
	"es6-promise": "^4.2.4",
	grunt: "^1.0.2",
	"grunt-banner": "^0.6.0",
	"grunt-cli": "^1.2.0",
	"grunt-contrib-clean": "^1.1.0",
	"grunt-contrib-watch": "^1.0.0",
	"grunt-eslint": "^20.1.0",
	"grunt-karma": "^2.0.0",
	"grunt-mocha-test": "^0.13.3",
	"grunt-ts": "^6.0.0-beta.19",
	"grunt-webpack": "^1.0.18",
	"istanbul-instrumenter-loader": "^1.0.0",
	"jasmine-core": "^2.4.1",
	karma: "^1.3.0",
	"karma-chrome-launcher": "^2.2.0",
	"karma-coverage": "^1.1.1",
	"karma-firefox-launcher": "^1.1.0",
	"karma-jasmine": "^1.1.1",
	"karma-jasmine-ajax": "^0.1.13",
	"karma-opera-launcher": "^1.0.0",
	"karma-safari-launcher": "^1.0.0",
	"karma-sauce-launcher": "^1.2.0",
	"karma-sinon": "^1.0.5",
	"karma-sourcemap-loader": "^0.3.7",
	"karma-webpack": "^1.7.0",
	"load-grunt-tasks": "^3.5.2",
	minimist: "^1.2.0",
	mocha: "^5.2.0",
	sinon: "^4.5.0",
	typescript: "^2.8.1",
	"url-search-params": "^0.10.0",
	webpack: "^1.13.1",
	"webpack-dev-server": "^1.14.1"
};
var browser = {
	"./lib/adapters/http.js": "./lib/adapters/xhr.js"
};
var jsdelivr = "dist/axios.min.js";
var unpkg = "dist/axios.min.js";
var typings = "./index.d.ts";
var dependencies = {
	"follow-redirects": "^1.10.0"
};
var bundlesize = [
	{
		path: "./dist/axios.min.js",
		threshold: "5kB"
	}
];
var __npminstall_done = "Sun Apr 17 2022 15:49:00 GMT+0800 (GMT+08:00)";
var _from = "axios@0.21.1";
var _resolved = "https://registry.npmmirror.com/axios/-/axios-0.21.1.tgz";
var require$$9 = {
	name: name,
	version: version,
	description: description,
	main: main,
	scripts: scripts,
	repository: repository,
	keywords: keywords,
	author: author,
	license: license,
	bugs: bugs,
	homepage: homepage,
	devDependencies: devDependencies,
	browser: browser,
	jsdelivr: jsdelivr,
	unpkg: unpkg,
	typings: typings,
	dependencies: dependencies,
	bundlesize: bundlesize,
	__npminstall_done: __npminstall_done,
	_from: _from,
	_resolved: _resolved
};

var utils$5 = utils$e;
var settle = settle$2;
var buildFullPath = buildFullPath$2;
var buildURL$1 = buildURL$3;
var http$1 = require$$1;
var https = require$$2;
var httpFollow = _followRedirects_1_14_9_followRedirects.exports.http;
var httpsFollow = _followRedirects_1_14_9_followRedirects.exports.https;
var url = require$$0;
var zlib = require$$8;
var pkg = require$$9;
var createError = createError$3;
var enhanceError = enhanceError$2;

var isHttps = /https:?/;

/**
 *
 * @param {http.ClientRequestArgs} options
 * @param {AxiosProxyConfig} proxy
 * @param {string} location
 */
function setProxy(options, proxy, location) {
  options.hostname = proxy.host;
  options.host = proxy.host;
  options.port = proxy.port;
  options.path = location;

  // Basic proxy authorization
  if (proxy.auth) {
    var base64 = Buffer.from(proxy.auth.username + ':' + proxy.auth.password, 'utf8').toString('base64');
    options.headers['Proxy-Authorization'] = 'Basic ' + base64;
  }

  // If a proxy is used, any redirects must also pass through the proxy
  options.beforeRedirect = function beforeRedirect(redirection) {
    redirection.headers.host = redirection.host;
    setProxy(redirection, proxy, redirection.href);
  };
}

/*eslint consistent-return:0*/
var http_1 = function httpAdapter(config) {
  return new Promise(function dispatchHttpRequest(resolvePromise, rejectPromise) {
    var resolve = function resolve(value) {
      resolvePromise(value);
    };
    var reject = function reject(value) {
      rejectPromise(value);
    };
    var data = config.data;
    var headers = config.headers;

    // Set User-Agent (required by some servers)
    // Only set header if it hasn't been set in config
    // See https://github.com/axios/axios/issues/69
    if (!headers['User-Agent'] && !headers['user-agent']) {
      headers['User-Agent'] = 'axios/' + pkg.version;
    }

    if (data && !utils$5.isStream(data)) {
      if (Buffer.isBuffer(data)) ; else if (utils$5.isArrayBuffer(data)) {
        data = Buffer.from(new Uint8Array(data));
      } else if (utils$5.isString(data)) {
        data = Buffer.from(data, 'utf-8');
      } else {
        return reject(createError(
          'Data after transformation must be a string, an ArrayBuffer, a Buffer, or a Stream',
          config
        ));
      }

      // Add Content-Length header if data exists
      headers['Content-Length'] = data.length;
    }

    // HTTP basic authentication
    var auth = undefined;
    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password || '';
      auth = username + ':' + password;
    }

    // Parse url
    var fullPath = buildFullPath(config.baseURL, config.url);
    var parsed = url.parse(fullPath);
    var protocol = parsed.protocol || 'http:';

    if (!auth && parsed.auth) {
      var urlAuth = parsed.auth.split(':');
      var urlUsername = urlAuth[0] || '';
      var urlPassword = urlAuth[1] || '';
      auth = urlUsername + ':' + urlPassword;
    }

    if (auth) {
      delete headers.Authorization;
    }

    var isHttpsRequest = isHttps.test(protocol);
    var agent = isHttpsRequest ? config.httpsAgent : config.httpAgent;

    var options = {
      path: buildURL$1(parsed.path, config.params, config.paramsSerializer).replace(/^\?/, ''),
      method: config.method.toUpperCase(),
      headers: headers,
      agent: agent,
      agents: { http: config.httpAgent, https: config.httpsAgent },
      auth: auth
    };

    if (config.socketPath) {
      options.socketPath = config.socketPath;
    } else {
      options.hostname = parsed.hostname;
      options.port = parsed.port;
    }

    var proxy = config.proxy;
    if (!proxy && proxy !== false) {
      var proxyEnv = protocol.slice(0, -1) + '_proxy';
      var proxyUrl = process.env[proxyEnv] || process.env[proxyEnv.toUpperCase()];
      if (proxyUrl) {
        var parsedProxyUrl = url.parse(proxyUrl);
        var noProxyEnv = process.env.no_proxy || process.env.NO_PROXY;
        var shouldProxy = true;

        if (noProxyEnv) {
          var noProxy = noProxyEnv.split(',').map(function trim(s) {
            return s.trim();
          });

          shouldProxy = !noProxy.some(function proxyMatch(proxyElement) {
            if (!proxyElement) {
              return false;
            }
            if (proxyElement === '*') {
              return true;
            }
            if (proxyElement[0] === '.' &&
                parsed.hostname.substr(parsed.hostname.length - proxyElement.length) === proxyElement) {
              return true;
            }

            return parsed.hostname === proxyElement;
          });
        }

        if (shouldProxy) {
          proxy = {
            host: parsedProxyUrl.hostname,
            port: parsedProxyUrl.port,
            protocol: parsedProxyUrl.protocol
          };

          if (parsedProxyUrl.auth) {
            var proxyUrlAuth = parsedProxyUrl.auth.split(':');
            proxy.auth = {
              username: proxyUrlAuth[0],
              password: proxyUrlAuth[1]
            };
          }
        }
      }
    }

    if (proxy) {
      options.headers.host = parsed.hostname + (parsed.port ? ':' + parsed.port : '');
      setProxy(options, proxy, protocol + '//' + parsed.hostname + (parsed.port ? ':' + parsed.port : '') + options.path);
    }

    var transport;
    var isHttpsProxy = isHttpsRequest && (proxy ? isHttps.test(proxy.protocol) : true);
    if (config.transport) {
      transport = config.transport;
    } else if (config.maxRedirects === 0) {
      transport = isHttpsProxy ? https : http$1;
    } else {
      if (config.maxRedirects) {
        options.maxRedirects = config.maxRedirects;
      }
      transport = isHttpsProxy ? httpsFollow : httpFollow;
    }

    if (config.maxBodyLength > -1) {
      options.maxBodyLength = config.maxBodyLength;
    }

    // Create the request
    var req = transport.request(options, function handleResponse(res) {
      if (req.aborted) return;

      // uncompress the response body transparently if required
      var stream = res;

      // return the last request in case of redirects
      var lastRequest = res.req || req;


      // if no content, is HEAD request or decompress disabled we should not decompress
      if (res.statusCode !== 204 && lastRequest.method !== 'HEAD' && config.decompress !== false) {
        switch (res.headers['content-encoding']) {
        /*eslint default-case:0*/
        case 'gzip':
        case 'compress':
        case 'deflate':
        // add the unzipper to the body stream processing pipeline
          stream = stream.pipe(zlib.createUnzip());

          // remove the content-encoding in order to not confuse downstream operations
          delete res.headers['content-encoding'];
          break;
        }
      }

      var response = {
        status: res.statusCode,
        statusText: res.statusMessage,
        headers: res.headers,
        config: config,
        request: lastRequest
      };

      if (config.responseType === 'stream') {
        response.data = stream;
        settle(resolve, reject, response);
      } else {
        var responseBuffer = [];
        stream.on('data', function handleStreamData(chunk) {
          responseBuffer.push(chunk);

          // make sure the content length is not over the maxContentLength if specified
          if (config.maxContentLength > -1 && Buffer.concat(responseBuffer).length > config.maxContentLength) {
            stream.destroy();
            reject(createError('maxContentLength size of ' + config.maxContentLength + ' exceeded',
              config, null, lastRequest));
          }
        });

        stream.on('error', function handleStreamError(err) {
          if (req.aborted) return;
          reject(enhanceError(err, config, null, lastRequest));
        });

        stream.on('end', function handleStreamEnd() {
          var responseData = Buffer.concat(responseBuffer);
          if (config.responseType !== 'arraybuffer') {
            responseData = responseData.toString(config.responseEncoding);
            if (!config.responseEncoding || config.responseEncoding === 'utf8') {
              responseData = utils$5.stripBOM(responseData);
            }
          }

          response.data = responseData;
          settle(resolve, reject, response);
        });
      }
    });

    // Handle errors
    req.on('error', function handleRequestError(err) {
      if (req.aborted && err.code !== 'ERR_FR_TOO_MANY_REDIRECTS') return;
      reject(enhanceError(err, config, null, req));
    });

    // Handle request timeout
    if (config.timeout) {
      // Sometime, the response will be very slow, and does not respond, the connect event will be block by event loop system.
      // And timer callback will be fired, and abort() will be invoked before connection, then get "socket hang up" and code ECONNRESET.
      // At this time, if we have a large number of request, nodejs will hang up some socket on background. and the number will up and up.
      // And then these socket which be hang up will devoring CPU little by little.
      // ClientRequest.setTimeout will be fired on the specify milliseconds, and can make sure that abort() will be fired after connect.
      req.setTimeout(config.timeout, function handleRequestTimeout() {
        req.abort();
        reject(createError('timeout of ' + config.timeout + 'ms exceeded', config, 'ECONNABORTED', req));
      });
    }

    if (config.cancelToken) {
      // Handle cancellation
      config.cancelToken.promise.then(function onCanceled(cancel) {
        if (req.aborted) return;

        req.abort();
        reject(cancel);
      });
    }

    // Send the request
    if (utils$5.isStream(data)) {
      data.on('error', function handleStreamError(err) {
        reject(enhanceError(err, config, null, req));
      }).pipe(req);
    } else {
      req.end(data);
    }
  });
};

var utils$4 = utils$e;
var normalizeHeaderName = normalizeHeaderName$1;

var DEFAULT_CONTENT_TYPE = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

function setContentTypeIfUnset(headers, value) {
  if (!utils$4.isUndefined(headers) && utils$4.isUndefined(headers['Content-Type'])) {
    headers['Content-Type'] = value;
  }
}

function getDefaultAdapter() {
  var adapter;
  if (typeof XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    adapter = xhr;
  } else if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
    // For node use HTTP adapter
    adapter = http_1;
  }
  return adapter;
}

var defaults$2 = {
  adapter: getDefaultAdapter(),

  transformRequest: [function transformRequest(data, headers) {
    normalizeHeaderName(headers, 'Accept');
    normalizeHeaderName(headers, 'Content-Type');
    if (utils$4.isFormData(data) ||
      utils$4.isArrayBuffer(data) ||
      utils$4.isBuffer(data) ||
      utils$4.isStream(data) ||
      utils$4.isFile(data) ||
      utils$4.isBlob(data)
    ) {
      return data;
    }
    if (utils$4.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils$4.isURLSearchParams(data)) {
      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
      return data.toString();
    }
    if (utils$4.isObject(data)) {
      setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
      return JSON.stringify(data);
    }
    return data;
  }],

  transformResponse: [function transformResponse(data) {
    /*eslint no-param-reassign:0*/
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (e) { /* Ignore */ }
    }
    return data;
  }],

  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,
  maxBodyLength: -1,

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  }
};

defaults$2.headers = {
  common: {
    'Accept': 'application/json, text/plain, */*'
  }
};

utils$4.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  defaults$2.headers[method] = {};
});

utils$4.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  defaults$2.headers[method] = utils$4.merge(DEFAULT_CONTENT_TYPE);
});

var defaults_1 = defaults$2;

var utils$3 = utils$e;
var transformData = transformData$1;
var isCancel = isCancel$1;
var defaults$1 = defaults_1;

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 * @returns {Promise} The Promise to be fulfilled
 */
var dispatchRequest$1 = function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  // Ensure headers exist
  config.headers = config.headers || {};

  // Transform request data
  config.data = transformData(
    config.data,
    config.headers,
    config.transformRequest
  );

  // Flatten headers
  config.headers = utils$3.merge(
    config.headers.common || {},
    config.headers[config.method] || {},
    config.headers
  );

  utils$3.forEach(
    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
    function cleanHeaderConfig(method) {
      delete config.headers[method];
    }
  );

  var adapter = config.adapter || defaults$1.adapter;

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = transformData(
      response.data,
      response.headers,
      config.transformResponse
    );

    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData(
          reason.response.data,
          reason.response.headers,
          config.transformResponse
        );
      }
    }

    return Promise.reject(reason);
  });
};

var utils$2 = utils$e;

/**
 * Config-specific merge-function which creates a new config-object
 * by merging two configuration objects together.
 *
 * @param {Object} config1
 * @param {Object} config2
 * @returns {Object} New object resulting from merging config2 to config1
 */
var mergeConfig$2 = function mergeConfig(config1, config2) {
  // eslint-disable-next-line no-param-reassign
  config2 = config2 || {};
  var config = {};

  var valueFromConfig2Keys = ['url', 'method', 'data'];
  var mergeDeepPropertiesKeys = ['headers', 'auth', 'proxy', 'params'];
  var defaultToConfig2Keys = [
    'baseURL', 'transformRequest', 'transformResponse', 'paramsSerializer',
    'timeout', 'timeoutMessage', 'withCredentials', 'adapter', 'responseType', 'xsrfCookieName',
    'xsrfHeaderName', 'onUploadProgress', 'onDownloadProgress', 'decompress',
    'maxContentLength', 'maxBodyLength', 'maxRedirects', 'transport', 'httpAgent',
    'httpsAgent', 'cancelToken', 'socketPath', 'responseEncoding'
  ];
  var directMergeKeys = ['validateStatus'];

  function getMergedValue(target, source) {
    if (utils$2.isPlainObject(target) && utils$2.isPlainObject(source)) {
      return utils$2.merge(target, source);
    } else if (utils$2.isPlainObject(source)) {
      return utils$2.merge({}, source);
    } else if (utils$2.isArray(source)) {
      return source.slice();
    }
    return source;
  }

  function mergeDeepProperties(prop) {
    if (!utils$2.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(config1[prop], config2[prop]);
    } else if (!utils$2.isUndefined(config1[prop])) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  }

  utils$2.forEach(valueFromConfig2Keys, function valueFromConfig2(prop) {
    if (!utils$2.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(undefined, config2[prop]);
    }
  });

  utils$2.forEach(mergeDeepPropertiesKeys, mergeDeepProperties);

  utils$2.forEach(defaultToConfig2Keys, function defaultToConfig2(prop) {
    if (!utils$2.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(undefined, config2[prop]);
    } else if (!utils$2.isUndefined(config1[prop])) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  });

  utils$2.forEach(directMergeKeys, function merge(prop) {
    if (prop in config2) {
      config[prop] = getMergedValue(config1[prop], config2[prop]);
    } else if (prop in config1) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  });

  var axiosKeys = valueFromConfig2Keys
    .concat(mergeDeepPropertiesKeys)
    .concat(defaultToConfig2Keys)
    .concat(directMergeKeys);

  var otherKeys = Object
    .keys(config1)
    .concat(Object.keys(config2))
    .filter(function filterAxiosKeys(key) {
      return axiosKeys.indexOf(key) === -1;
    });

  utils$2.forEach(otherKeys, mergeDeepProperties);

  return config;
};

var utils$1 = utils$e;
var buildURL = buildURL$3;
var InterceptorManager = InterceptorManager_1;
var dispatchRequest = dispatchRequest$1;
var mergeConfig$1 = mergeConfig$2;

/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 */
function Axios$1(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}

/**
 * Dispatch a request
 *
 * @param {Object} config The config specific for this request (merged with this.defaults)
 */
Axios$1.prototype.request = function request(config) {
  /*eslint no-param-reassign:0*/
  // Allow for axios('example/url'[, config]) a la fetch API
  if (typeof config === 'string') {
    config = arguments[1] || {};
    config.url = arguments[0];
  } else {
    config = config || {};
  }

  config = mergeConfig$1(this.defaults, config);

  // Set config.method
  if (config.method) {
    config.method = config.method.toLowerCase();
  } else if (this.defaults.method) {
    config.method = this.defaults.method.toLowerCase();
  } else {
    config.method = 'get';
  }

  // Hook up interceptors middleware
  var chain = [dispatchRequest, undefined];
  var promise = Promise.resolve(config);

  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    chain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    chain.push(interceptor.fulfilled, interceptor.rejected);
  });

  while (chain.length) {
    promise = promise.then(chain.shift(), chain.shift());
  }

  return promise;
};

Axios$1.prototype.getUri = function getUri(config) {
  config = mergeConfig$1(this.defaults, config);
  return buildURL(config.url, config.params, config.paramsSerializer).replace(/^\?/, '');
};

// Provide aliases for supported request methods
utils$1.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios$1.prototype[method] = function(url, config) {
    return this.request(mergeConfig$1(config || {}, {
      method: method,
      url: url,
      data: (config || {}).data
    }));
  };
});

utils$1.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/
  Axios$1.prototype[method] = function(url, data, config) {
    return this.request(mergeConfig$1(config || {}, {
      method: method,
      url: url,
      data: data
    }));
  };
});

var Axios_1 = Axios$1;

/**
 * A `Cancel` is an object that is thrown when an operation is canceled.
 *
 * @class
 * @param {string=} message The message.
 */
function Cancel$1(message) {
  this.message = message;
}

Cancel$1.prototype.toString = function toString() {
  return 'Cancel' + (this.message ? ': ' + this.message : '');
};

Cancel$1.prototype.__CANCEL__ = true;

var Cancel_1 = Cancel$1;

var Cancel = Cancel_1;

/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @class
 * @param {Function} executor The executor function.
 */
function CancelToken(executor) {
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }

  var resolvePromise;
  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });

  var token = this;
  executor(function cancel(message) {
    if (token.reason) {
      // Cancellation has already been requested
      return;
    }

    token.reason = new Cancel(message);
    resolvePromise(token.reason);
  });
}

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  if (this.reason) {
    throw this.reason;
  }
};

/**
 * Returns an object that contains a new `CancelToken` and a function that, when called,
 * cancels the `CancelToken`.
 */
CancelToken.source = function source() {
  var cancel;
  var token = new CancelToken(function executor(c) {
    cancel = c;
  });
  return {
    token: token,
    cancel: cancel
  };
};

var CancelToken_1 = CancelToken;

/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 * @returns {Function}
 */
var spread = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
};

/**
 * Determines whether the payload is an error thrown by Axios
 *
 * @param {*} payload The value to test
 * @returns {boolean} True if the payload is an error thrown by Axios, otherwise false
 */
var isAxiosError = function isAxiosError(payload) {
  return (typeof payload === 'object') && (payload.isAxiosError === true);
};

var utils = utils$e;
var bind = bind$2;
var Axios = Axios_1;
var mergeConfig = mergeConfig$2;
var defaults = defaults_1;

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  var context = new Axios(defaultConfig);
  var instance = bind(Axios.prototype.request, context);

  // Copy axios.prototype to instance
  utils.extend(instance, Axios.prototype, context);

  // Copy context to instance
  utils.extend(instance, context);

  return instance;
}

// Create the default instance to be exported
var axios = createInstance(defaults);

// Expose Axios class to allow class inheritance
axios.Axios = Axios;

// Factory for creating new instances
axios.create = function create(instanceConfig) {
  return createInstance(mergeConfig(axios.defaults, instanceConfig));
};

// Expose Cancel & CancelToken
axios.Cancel = Cancel_1;
axios.CancelToken = CancelToken_1;
axios.isCancel = isCancel$1;

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = spread;

// Expose isAxiosError
axios.isAxiosError = isAxiosError;

axios$1.exports = axios;

// Allow use of default import syntax in TypeScript
axios$1.exports.default = axios;

var _axios_0_21_1_axios = axios$1.exports;

var mpCloudSdk = {exports: {}};

(function (module, exports) {
!function(t,e){e(exports);}(commonjsGlobal,function(t){var n=function(t,e){return (n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e;}||function(t,e){for(var r in e)e.hasOwnProperty(r)&&(t[r]=e[r]);})(t,e)};function e(t,e){function r(){this.constructor=t;}n(t,e),t.prototype=null===e?Object.create(e):(r.prototype=e.prototype,new r);}var h=function(){return (h=Object.assign||function(t){for(var e,r=1,n=arguments.length;r<n;r++)for(var o in e=arguments[r])Object.prototype.hasOwnProperty.call(e,o)&&(t[o]=e[o]);return t}).apply(this,arguments)};function r(t,e,r,n){var o,i=arguments.length,a=i<3?e:null===n?n=Object.getOwnPropertyDescriptor(e,r):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,r,n);else for(var s=t.length-1;0<=s;s--)(o=t[s])&&(a=(i<3?o(a):3<i?o(e,r,a):o(e,r))||a);return 3<i&&a&&Object.defineProperty(e,r,a),a}function p(t,a,s,c){return new(s=s||Promise)(function(r,e){function n(t){try{i(c.next(t));}catch(t){e(t);}}function o(t){try{i(c.throw(t));}catch(t){e(t);}}function i(t){var e;t.done?r(t.value):((e=t.value)instanceof s?e:new s(function(t){t(e);})).then(n,o);}i((c=c.apply(t,a||[])).next());})}function k(r,n){var o,i,a,t,s={label:0,sent:function(){if(1&a[0])throw a[1];return a[1]},trys:[],ops:[]};return t={next:e(0),throw:e(1),return:e(2)},"function"==typeof Symbol&&(t[Symbol.iterator]=function(){return this}),t;function e(e){return function(t){return function(e){if(o)throw new TypeError("Generator is already executing.");for(;s;)try{if(o=1,i&&(a=2&e[0]?i.return:e[0]?i.throw||((a=i.return)&&a.call(i),0):i.next)&&!(a=a.call(i,e[1])).done)return a;switch(i=0,a&&(e=[2&e[0],a.value]),e[0]){case 0:case 1:a=e;break;case 4:return s.label++,{value:e[1],done:!1};case 5:s.label++,i=e[1],e=[0];continue;case 7:e=s.ops.pop(),s.trys.pop();continue;default:if(!(a=0<(a=s.trys).length&&a[a.length-1])&&(6===e[0]||2===e[0])){s=0;continue}if(3===e[0]&&(!a||e[1]>a[0]&&e[1]<a[3])){s.label=e[1];break}if(6===e[0]&&s.label<a[1]){s.label=a[1],a=e;break}if(a&&s.label<a[2]){s.label=a[2],s.ops.push(e);break}a[2]&&s.ops.pop(),s.trys.pop();continue}e=n.call(r,s);}catch(t){e=[6,t],i=0;}finally{o=a=0;}if(5&e[0])throw e[1];return {value:e[0]?e[1]:void 0,done:!0}}([e,t])}}}function o(){return function(t,e,r){var l=r.value;r.value=function(t){var e,r=t||{},n=r.success,o=void 0===n?null:n,i=r.fail,a=void 0===i?null:i,s=r.complete,c=void 0===s?null:s,u=!c&&!a&&!o;try{e=l.apply(this,arguments);}catch(t){return u?Promise.reject(t):(a&&a(t),void(c&&c(t)))}if(e=e.then?e:Promise.resolve(e),u)return e;e.then(function(t){try{o&&o(t),c&&c(t);}catch(t){throw t}}).catch(function(t){a&&a(t),c&&c(t);});};}}function T(t,e,r){Array.isArray(e)||(e=e.split("."));var n=e.reduce(function(t,e){return t?t[e]:null},t);return r?n||r:n}function i(t,e){return t(e={exports:{}},e.exports),e.exports}var d,a,s=i(function(t,e){var r;t.exports=(r=r||function(l){var r=Object.create||function(t){var e;return n.prototype=t,e=new n,n.prototype=null,e};function n(){}var t={},e=t.lib={},o=e.Base={extend:function(t){var e=r(this);return t&&e.mixIn(t),e.hasOwnProperty("init")&&this.init!==e.init||(e.init=function(){e.$super.init.apply(this,arguments);}),(e.init.prototype=e).$super=this,e},create:function(){var t=this.extend();return t.init.apply(t,arguments),t},init:function(){},mixIn:function(t){for(var e in t)t.hasOwnProperty(e)&&(this[e]=t[e]);t.hasOwnProperty("toString")&&(this.toString=t.toString);},clone:function(){return this.init.prototype.extend(this)}},p=e.WordArray=o.extend({init:function(t,e){t=this.words=t||[],this.sigBytes=null!=e?e:4*t.length;},toString:function(t){return (t||a).stringify(this)},concat:function(t){var e=this.words,r=t.words,n=this.sigBytes,o=t.sigBytes;if(this.clamp(),n%4)for(var i=0;i<o;i++){var a=r[i>>>2]>>>24-i%4*8&255;e[n+i>>>2]|=a<<24-(n+i)%4*8;}else for(i=0;i<o;i+=4)e[n+i>>>2]=r[i>>>2];return this.sigBytes+=o,this},clamp:function(){var t=this.words,e=this.sigBytes;t[e>>>2]&=4294967295<<32-e%4*8,t.length=l.ceil(e/4);},clone:function(){var t=o.clone.call(this);return t.words=this.words.slice(0),t},random:function(t){for(var e,r=[],n=function(e){e=e;var r=987654321,n=4294967295;return function(){var t=((r=36969*(65535&r)+(r>>16)&n)<<16)+(e=18e3*(65535&e)+(e>>16)&n)&n;return t/=4294967296,(t+=.5)*(.5<l.random()?1:-1)}},o=0;o<t;o+=4){var i=n(4294967296*(e||l.random()));e=987654071*i(),r.push(4294967296*i()|0);}return new p.init(r,t)}}),i=t.enc={},a=i.Hex={stringify:function(t){for(var e=t.words,r=t.sigBytes,n=[],o=0;o<r;o++){var i=e[o>>>2]>>>24-o%4*8&255;n.push((i>>>4).toString(16)),n.push((15&i).toString(16));}return n.join("")},parse:function(t){for(var e=t.length,r=[],n=0;n<e;n+=2)r[n>>>3]|=parseInt(t.substr(n,2),16)<<24-n%8*4;return new p.init(r,e/2)}},s=i.Latin1={stringify:function(t){for(var e=t.words,r=t.sigBytes,n=[],o=0;o<r;o++){var i=e[o>>>2]>>>24-o%4*8&255;n.push(String.fromCharCode(i));}return n.join("")},parse:function(t){for(var e=t.length,r=[],n=0;n<e;n++)r[n>>>2]|=(255&t.charCodeAt(n))<<24-n%4*8;return new p.init(r,e)}},c=i.Utf8={stringify:function(t){try{return decodeURIComponent(escape(s.stringify(t)))}catch(t){throw new Error("Malformed UTF-8 data")}},parse:function(t){return s.parse(unescape(encodeURIComponent(t)))}},u=e.BufferedBlockAlgorithm=o.extend({reset:function(){this._data=new p.init,this._nDataBytes=0;},_append:function(t){"string"==typeof t&&(t=c.parse(t)),this._data.concat(t),this._nDataBytes+=t.sigBytes;},_process:function(t){var e=this._data,r=e.words,n=e.sigBytes,o=this.blockSize,i=n/(4*o),a=(i=t?l.ceil(i):l.max((0|i)-this._minBufferSize,0))*o,s=l.min(4*a,n);if(a){for(var c=0;c<a;c+=o)this._doProcessBlock(r,c);var u=r.splice(0,a);e.sigBytes-=s;}return new p.init(u,s)},clone:function(){var t=o.clone.call(this);return t._data=this._data.clone(),t},_minBufferSize:0}),d=(e.Hasher=u.extend({cfg:o.extend(),init:function(t){this.cfg=this.cfg.extend(t),this.reset();},reset:function(){u.reset.call(this),this._doReset();},update:function(t){return this._append(t),this._process(),this},finalize:function(t){return t&&this._append(t),this._doFinalize()},blockSize:16,_createHelper:function(r){return function(t,e){return new r.init(e).finalize(t)}},_createHmacHelper:function(r){return function(t,e){return new d.HMAC.init(r,e).finalize(t)}}}),t.algo={});return t}(Math),r);}),c=(i(function(t,e){var c;t.exports=(c=s,function(o){var t=c,e=t.lib,r=e.WordArray,n=e.Hasher,i=t.algo,a=[],w=[];!function(){function t(t){for(var e=o.sqrt(t),r=2;r<=e;r++)if(!(t%r))return;return 1}function e(t){return 4294967296*(t-(0|t))|0}for(var r=2,n=0;n<64;)t(r)&&(n<8&&(a[n]=e(o.pow(r,.5))),w[n]=e(o.pow(r,1/3)),n++),r++;}();var b=[],s=i.SHA256=n.extend({_doReset:function(){this._hash=new r.init(a.slice(0));},_doProcessBlock:function(t,e){for(var r=this._hash.words,n=r[0],o=r[1],i=r[2],a=r[3],s=r[4],c=r[5],u=r[6],l=r[7],p=0;p<64;p++){if(p<16)b[p]=0|t[e+p];else {var d=b[p-15],h=(d<<25|d>>>7)^(d<<14|d>>>18)^d>>>3,f=b[p-2],y=(f<<15|f>>>17)^(f<<13|f>>>19)^f>>>10;b[p]=h+b[p-7]+y+b[p-16];}var v=n&o^n&i^o&i,m=(n<<30|n>>>2)^(n<<19|n>>>13)^(n<<10|n>>>22),g=l+((s<<26|s>>>6)^(s<<21|s>>>11)^(s<<7|s>>>25))+(s&c^~s&u)+w[p]+b[p];l=u,u=c,c=s,s=a+g|0,a=i,i=o,o=n,n=g+(m+v)|0;}r[0]=r[0]+n|0,r[1]=r[1]+o|0,r[2]=r[2]+i|0,r[3]=r[3]+a|0,r[4]=r[4]+s|0,r[5]=r[5]+c|0,r[6]=r[6]+u|0,r[7]=r[7]+l|0;},_doFinalize:function(){var t=this._data,e=t.words,r=8*this._nDataBytes,n=8*t.sigBytes;return e[n>>>5]|=128<<24-n%32,e[14+(64+n>>>9<<4)]=o.floor(r/4294967296),e[15+(64+n>>>9<<4)]=r,t.sigBytes=4*e.length,this._process(),this._hash},clone:function(){var t=n.clone.call(this);return t._hash=this._hash.clone(),t}});t.SHA256=n._createHelper(s),t.HmacSHA256=n._createHmacHelper(s);}(Math),c.SHA256);}),i(function(t,e){var r;t.exports=(r=s,void function(){var t=r.lib.Base,u=r.enc.Utf8;r.algo.HMAC=t.extend({init:function(t,e){t=this._hasher=new t.init,"string"==typeof e&&(e=u.parse(e));var r=t.blockSize,n=4*r;e.sigBytes>n&&(e=t.finalize(e)),e.clamp();for(var o=this._oKey=e.clone(),i=this._iKey=e.clone(),a=o.words,s=i.words,c=0;c<r;c++)a[c]^=1549556828,s[c]^=909522486;o.sigBytes=i.sigBytes=n,this.reset();},reset:function(){var t=this._hasher;t.reset(),t.update(this._iKey);},update:function(t){return this._hasher.update(t),this},finalize:function(t){var e=this._hasher,r=e.finalize(t);return e.reset(),e.finalize(this._oKey.clone().concat(r))}});}());}),i(function(t,e){t.exports=s.HmacSHA256;})),u=i(function(t,e){var r;t.exports=(r=s,function(){var c=r.lib.WordArray;r.enc.Base64={stringify:function(t){var e=t.words,r=t.sigBytes,n=this._map;t.clamp();for(var o=[],i=0;i<r;i+=3)for(var a=(e[i>>>2]>>>24-i%4*8&255)<<16|(e[i+1>>>2]>>>24-(i+1)%4*8&255)<<8|e[i+2>>>2]>>>24-(i+2)%4*8&255,s=0;s<4&&i+.75*s<r;s++)o.push(n.charAt(a>>>6*(3-s)&63));var c=n.charAt(64);if(c)for(;o.length%4;)o.push(c);return o.join("")},parse:function(t){var e=t.length,r=this._map,n=this._reverseMap;if(!n){n=this._reverseMap=[];for(var o=0;o<r.length;o++)n[r.charCodeAt(o)]=o;}var i=r.charAt(64);if(i){var a=t.indexOf(i);-1!==a&&(e=a);}return function(t,e,r){for(var n=[],o=0,i=0;i<e;i++)if(i%4){var a=r[t.charCodeAt(i-1)]<<i%4*2,s=r[t.charCodeAt(i)]>>>6-i%4*2;n[o>>>2]|=(a|s)<<24-o%4*8,o++;}return c.create(n,o)}(t,e,n)},_map:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="};}(),r.enc.Base64);}),l=i(function(t,e){var a;t.exports=(a=s,function(l){var t=a,e=t.lib,r=e.WordArray,n=e.Hasher,o=t.algo,S=[];!function(){for(var t=0;t<64;t++)S[t]=4294967296*l.abs(l.sin(t+1))|0;}();var i=o.MD5=n.extend({_doReset:function(){this._hash=new r.init([1732584193,4023233417,2562383102,271733878]);},_doProcessBlock:function(t,e){for(var r=0;r<16;r++){var n=e+r,o=t[n];t[n]=16711935&(o<<8|o>>>24)|4278255360&(o<<24|o>>>8);}var i=this._hash.words,a=t[e+0],s=t[e+1],c=t[e+2],u=t[e+3],l=t[e+4],p=t[e+5],d=t[e+6],h=t[e+7],f=t[e+8],y=t[e+9],v=t[e+10],m=t[e+11],g=t[e+12],w=t[e+13],b=t[e+14],_=t[e+15],A=i[0],x=i[1],q=i[2],R=i[3];A=k(A,x,q,R,a,7,S[0]),R=k(R,A,x,q,s,12,S[1]),q=k(q,R,A,x,c,17,S[2]),x=k(x,q,R,A,u,22,S[3]),A=k(A,x,q,R,l,7,S[4]),R=k(R,A,x,q,p,12,S[5]),q=k(q,R,A,x,d,17,S[6]),x=k(x,q,R,A,h,22,S[7]),A=k(A,x,q,R,f,7,S[8]),R=k(R,A,x,q,y,12,S[9]),q=k(q,R,A,x,v,17,S[10]),x=k(x,q,R,A,m,22,S[11]),A=k(A,x,q,R,g,7,S[12]),R=k(R,A,x,q,w,12,S[13]),q=k(q,R,A,x,b,17,S[14]),A=T(A,x=k(x,q,R,A,_,22,S[15]),q,R,s,5,S[16]),R=T(R,A,x,q,d,9,S[17]),q=T(q,R,A,x,m,14,S[18]),x=T(x,q,R,A,a,20,S[19]),A=T(A,x,q,R,p,5,S[20]),R=T(R,A,x,q,v,9,S[21]),q=T(q,R,A,x,_,14,S[22]),x=T(x,q,R,A,l,20,S[23]),A=T(A,x,q,R,y,5,S[24]),R=T(R,A,x,q,b,9,S[25]),q=T(q,R,A,x,u,14,S[26]),x=T(x,q,R,A,f,20,S[27]),A=T(A,x,q,R,w,5,S[28]),R=T(R,A,x,q,c,9,S[29]),q=T(q,R,A,x,h,14,S[30]),A=M(A,x=T(x,q,R,A,g,20,S[31]),q,R,p,4,S[32]),R=M(R,A,x,q,f,11,S[33]),q=M(q,R,A,x,m,16,S[34]),x=M(x,q,R,A,b,23,S[35]),A=M(A,x,q,R,s,4,S[36]),R=M(R,A,x,q,l,11,S[37]),q=M(q,R,A,x,h,16,S[38]),x=M(x,q,R,A,v,23,S[39]),A=M(A,x,q,R,w,4,S[40]),R=M(R,A,x,q,a,11,S[41]),q=M(q,R,A,x,u,16,S[42]),x=M(x,q,R,A,d,23,S[43]),A=M(A,x,q,R,y,4,S[44]),R=M(R,A,x,q,g,11,S[45]),q=M(q,R,A,x,_,16,S[46]),A=E(A,x=M(x,q,R,A,c,23,S[47]),q,R,a,6,S[48]),R=E(R,A,x,q,h,10,S[49]),q=E(q,R,A,x,b,15,S[50]),x=E(x,q,R,A,p,21,S[51]),A=E(A,x,q,R,g,6,S[52]),R=E(R,A,x,q,u,10,S[53]),q=E(q,R,A,x,v,15,S[54]),x=E(x,q,R,A,s,21,S[55]),A=E(A,x,q,R,f,6,S[56]),R=E(R,A,x,q,_,10,S[57]),q=E(q,R,A,x,d,15,S[58]),x=E(x,q,R,A,w,21,S[59]),A=E(A,x,q,R,l,6,S[60]),R=E(R,A,x,q,m,10,S[61]),q=E(q,R,A,x,c,15,S[62]),x=E(x,q,R,A,y,21,S[63]),i[0]=i[0]+A|0,i[1]=i[1]+x|0,i[2]=i[2]+q|0,i[3]=i[3]+R|0;},_doFinalize:function(){var t=this._data,e=t.words,r=8*this._nDataBytes,n=8*t.sigBytes;e[n>>>5]|=128<<24-n%32;var o=l.floor(r/4294967296),i=r;e[15+(64+n>>>9<<4)]=16711935&(o<<8|o>>>24)|4278255360&(o<<24|o>>>8),e[14+(64+n>>>9<<4)]=16711935&(i<<8|i>>>24)|4278255360&(i<<24|i>>>8),t.sigBytes=4*(e.length+1),this._process();for(var a=this._hash,s=a.words,c=0;c<4;c++){var u=s[c];s[c]=16711935&(u<<8|u>>>24)|4278255360&(u<<24|u>>>8);}return a},clone:function(){var t=n.clone.call(this);return t._hash=this._hash.clone(),t}});function k(t,e,r,n,o,i,a){var s=t+(e&r|~e&n)+o+a;return (s<<i|s>>>32-i)+e}function T(t,e,r,n,o,i,a){var s=t+(e&n|r&~n)+o+a;return (s<<i|s>>>32-i)+e}function M(t,e,r,n,o,i,a){var s=t+(e^r^n)+o+a;return (s<<i|s>>>32-i)+e}function E(t,e,r,n,o,i,a){var s=t+(r^(e|~n))+o+a;return (s<<i|s>>>32-i)+e}t.MD5=n._createHelper(i),t.HmacMD5=n._createHmacHelper(i);}(Math),a.MD5);});(a=d=d||{})[a.MTOP=1]="MTOP",a[a.MY=2]="MY",a[a.GATEWAY=3]="GATEWAY";var f,y=(e(v,f=Error),v);function v(){return null!==f&&f.apply(this,arguments)||this}function m(t){this.options=t||{},this.options.dataProxyGatewayUrl=this.options.dataProxyGatewayUrl||this.options.gatewayUrl;}var g=(w.prototype.init=function(e,r){return p(this,void 0,void 0,function(){return k(this,function(t){switch(t.label){case 0:return this.options=h({},e),this.proxy=r,this.tasks=[],this.inited=!0,[4,this.listenNetworkChange()];case 1:return t.sent(),this.flushGatewayRequestQueue(),this.pauseExecTask=!1,[2]}})})},w.prototype.listenNetworkChange=function(){return p(this,void 0,void 0,function(){var e,r=this;return k(this,function(t){switch(t.label){case 0:return t.trys.push([0,2,,3]),[4,this.exec({url:"my.getNetworkType"})];case 1:return e=t.sent(),this.networkType=e.networkType,window.my&&window.my.onNetworkStatusChange&&window.my.onNetworkStatusChange(function(t){t&&t.networkType&&(r.networkType=t.networkType);}),[3,3];case 2:return t.sent(),[3,3];case 3:return [2]}})})},w.getRequestType=function(t){return 0===t.indexOf("mtop.")?d.MTOP:0===t.indexOf("my.")?d.MY:d.GATEWAY},w.prototype.verifyResponse=function(e,r,n){return p(this,void 0,void 0,function(){return k(this,function(t){switch(t.label){case 0:if(T(n,"mc-code")||T(e,"errCode")||T(e,"error_response.code"),r.__is_retry_task__)return this.tryThrowError(e,n),[2,e];t.label=1;case 1:return t.trys.push([1,3,,4]),this.tryThrowError(e,n),[2,e];case 2:return [2,t.sent()];case 3:throw t.sent();case 4:return [2]}})})},w.prototype.tryThrowError=function(t,e){var r=T(e,"mc-msg")||T(t,"errMsg")||T(t,"error_response.msg"),n=T(e,"mc-code")||T(t,"errCode")||T(t,"error_response.code");if(n&&"200"!=n){var o=new y(n+":::"+r);throw o.code=n,o.msg=r,o}},w.prototype.sendGatewayRequest=function(n){return p(this,void 0,void 0,function(){var e,r=this;return k(this,function(t){switch(t.label){case 0:return this.pauseExecTask?[2,new Promise(function(t,e){r.tasks.push({detail:n,success:t,fail:e});})]:[3,1];case 1:return n=this.createGatewayRequest(n),[4,this.proxy.apply(h({},n),d.GATEWAY)];case 2:return e=t.sent(),[4,this.verifyResponse(T(e,"data"),n,T(e,"headers"))];case 3:return [2,t.sent()]}})})},w.prototype.flushGatewayRequestQueue=function(o){var i=this;void 0===o&&(o=!1),this.tasks.forEach(function(t){var e=t.detail,r=t.success,n=t.fail;if(o)return n("初始化失败");i.exec(e,d.GATEWAY).then(r).catch(n);}),this.tasks=[];},w.prototype.exec=function(e,r){return p(this,void 0,void 0,function(){return k(this,function(t){switch(t.label){case 0:if(r=r||w.getRequestType(e.url),!this.inited)throw new Error("请先调用cloud.init()");return r!==d.GATEWAY?[3,2]:[4,this.sendGatewayRequest(e)];case 1:return [2,t.sent()];case 2:return [4,this.proxy.apply(e,r)];case 3:return [2,t.sent()]}})})},w.prototype.getHttpRequestSign=function(t,e,r,n,o){if(this.options.signSecret){var i=o;delete n["mc-sign"];var a=e+"\n"+u.stringify(l(i))+"\napplication/json\n"+Object.keys(n).filter(function(t){return /^mc-/.test(t)}).sort().map(function(t){return t.toLowerCase()+":"+n[t]}).join("\n")+"\n"+t+(r?"?"+r:"");return u.stringify(c(a,this.options.signSecret))}},w.prototype.createGatewayRequest=function(t){var e=this.options,r=e.sessionKey,n=e.appKey,o=e.requestId,i=e.miniappId,a=e.openId,s=e.unionId,c=e.cloudId;t.method="POST";var u=h(h({},t.headers),{"Content-Type":"application/json","mc-timestamp":""+Date.now(),"mc-session":r});a&&(u["mc-open-id"]=a),c&&(u["mc-cloud-id"]=c),s&&(u["mc-union-id"]=s),n&&(u["mc-appKey"]=n),i&&(u["mc-miniapp-id"]=i),o&&(u["mc-request-id"]=o),t.env&&(u["mc-env"]=t.env),this.networkType&&(u["mc-network"]=this.networkType),u["mc-session"]||delete u["mc-session"],t.rawData=t.rawData||t.data,"object"==typeof t.data&&(t.data=JSON.stringify(t.data));var l=this.getHttpRequestSign(t.url,t.method,"",u,t.data);return h(h({},t),{url:""+t.url,headers:h(h({},u),{sign:l,"eagleeye-traceid":o})})},w);function w(){this.inited=!1,this.pauseExecTask=!1;}function b(t,e){this.request=e,this.options=t;}new g;var _,A=(e(x,_=b),x.prototype.invoke=function(e,r,n,o){return void 0===n&&(n="main"),p(this,void 0,void 0,function(){return k(this,function(t){switch(t.label){case 0:return [4,this.fcRequest({fcName:e,handler:n,data:r,options:o})];case 1:return [2,t.sent()]}})})},x.prototype.fcRequest=function(e){return p(this,void 0,void 0,function(){return k(this,function(t){switch(t.label){case 0:return [4,this.request.exec({env:this.options.env||"online",url:"fc",data:e},d.GATEWAY)];case 1:return [2,t.sent()]}})})},r([o()],x.prototype,"invoke",null),x);function x(){return null!==_&&_.apply(this,arguments)||this}var q,M="mtop.taobao.miniapp.cloud.store.config.v2.get",E="mtop.taobao.miniapp.cloud.store.config.v2.seller.get",O="mtop.taobao.miniapp.cloud.store.file.v2.save",P="mtop.taobao.miniapp.cloud.store.file.v2.seller.save",R="mtop.taobao.miniapp.cloud.store.file.v2.delete",S="mtop.taobao.miniapp.cloud.store.file.v2.seller.delete",I="mtop.taobao.miniapp.cloud.store.file.v2.list",B="mtop.taobao.miniapp.cloud.store.file.v2.seller.list",H="other",C=(e(D,q=b),D.prototype.parseUploadResult=function(t,e){return this.parsePostUploadResult(t,e)},D.prototype.parsePostUploadResult=function(t,e){var r,n,o;try{var i=JSON.parse(e.data);n=i.fileId,r=i.url,o=i.message;}catch(t){}return {imageUrl:r,specialId:n,message:o}},D.prototype.uploadFile=function(S){return p(this,void 0,void 0,function(){var e,r,n,o,i,a,s,c,u,l,p,d,h,f,y,v,m,g,w,b,_,A,x,q,R;return k(this,function(t){switch(t.label){case 0:e=S.filePath,r=S.fileType,n=void 0===r?H:r,o=S.fileName,i=void 0===o?"miniappfile":o,a=S.seller,s=void 0!==a&&a,c=S.dirId,t.label=1;case 1:return t.trys.push([1,3,,4]),l=s?E:M,[4,this.storageRequest(l,{newContainer:!0,cloudPath:i,fileType:n,sellerSpace:s,dirId:c})];case 2:return u=t.sent(),[3,4];case 3:throw p=t.sent(),new Error("获取配置错误"+(p.message||p.toString()));case 4:return d=T(u,["data","model",n],{}),h=d.url,f=void 0===h?"":h,y=d.formData,v=void 0===y?null:y,m=d.headers,(g={url:f,fileType:n,header:void 0===m?null:m,formData:v,filePath:e,fileName:"file"}).header&&g.header.Authorization&&(g.formData.Authorization=g.header.Authorization),i&&(g.formData.localFileName=Date.now()+"-"+function(t){if(!t)return "file";var e=t.lastIndexOf("/");return 0<=e?t.substr(e+1):t}(i)),g.header?"image"!==n&&(g.header.origin=g.header.origin||"https://miniapp-cloud.taobao.com",g.header.referer=g.header.referer||"https://miniapp-cloud.taobao.com"):delete g.header,g.formData||delete g.formData,[4,this.storageRequest("my.uploadFile",g)];case 5:if(w=t.sent(),b=this.parseUploadResult(n,w),_=b.imageUrl,A=b.specialId,x=b.message,!A)throw new Error(x||"upload exception:unknown error");return q={fileType:n,specialId:A,url:_,cloudPath:i,sellerSpace:s},[4,this.storageRequest(s?P:O,q)];case 6:if(!T(R=t.sent(),"data.model.fileId"))throw new Error(T(R,["result","msgInfo"],"上传文件失败"));return [2,T(R,"data.model")]}})})},D.prototype.deleteFile=function(c){return p(this,void 0,void 0,function(){var e,r,n,o,i,a,s;return k(this,function(t){switch(t.label){case 0:return e=c.fileId,r=c.fileType,n=void 0===r?H:r,o=c.seller,i=void 0!==o&&o,a=Array.isArray(e)?e:[e],a=JSON.stringify(a),[4,this.storageRequest(i?S:R,{fileType:n,fileIds:a,sellerSpace:i})];case 1:if(T(s=t.sent(),["data","model"]))return [2,!0];throw new Error(T(s,["data","msgInfo"]))}})})},D.prototype.getTempFileURL=function(s){return p(this,void 0,void 0,function(){var e,r,n,o,i,a;return k(this,function(t){switch(t.label){case 0:if(e=s.fileId,r=s.seller,n=void 0!==r&&r,!e)throw new Error("缺少fileId,请检查参数");return o=Array.isArray(e)?e:[e],o=JSON.stringify(o),[4,this.storageRequest(n?B:I,{fileIds:o,sellerSpace:n})];case 1:if(i=t.sent(),a=T(i,["data","model"]))return [2,a];throw new Error(T(i,["data","msgInfo"]))}})})},D.prototype.downloadByFileId=function(l){return p(this,void 0,void 0,function(){var e,r,n,o,i,a,s,c,u;return k(this,function(t){switch(t.label){case 0:if(e=l.fileId,r=l.cache,!e)throw new Error("缺少fileId,请检查参数");return n=Array.isArray(e)?e:[e],[4,this.storageRequest(I,{fileIds:JSON.stringify(n)})];case 1:o=t.sent(),i=T(o,["data","model"])||[],a=[],s=0,t.label=2;case 2:return s<i.length?(c=(i[s]||{}).url,[4,this._downloadByUrl(c,r)]):[3,5];case 3:(u=t.sent())&&a.push(u),t.label=4;case 4:return s++,[3,2];case 5:return [2,a]}})})},D.prototype.storageRequest=function(r,n,o){return p(this,void 0,void 0,function(){var e;return k(this,function(t){switch(t.label){case 0:return e="test"===this.options.env?"test":"online",(n=n||{}).env=e,[4,this.request.exec({url:r,data:n},o)];case 1:return [2,t.sent()]}})})},D.prototype._downloadByUrl=function(n,o){return p(this,void 0,void 0,function(){var e,r;return k(this,function(t){switch(t.label){case 0:return n?o?[4,this.request.proxy.apply({url:"my.getStorage",data:{key:n}})]:[3,2]:[2,null];case 1:if(e=t.sent().data)return [2,e];t.label=2;case 2:return [4,this.request.exec({url:"my.downloadFile",data:{url:n}})];case 3:return r=t.sent().apFilePath,o?[4,this.request.exec({url:"my.setStorage",data:{key:n,data:r}})]:[3,5];case 4:t.sent(),t.label=5;case 5:return [2,r]}})})},r([o()],D.prototype,"uploadFile",null),r([o()],D.prototype,"deleteFile",null),r([o()],D.prototype,"getTempFileURL",null),r([o()],D.prototype,"downloadByFileId",null),D);function D(){return null!==q&&q.apply(this,arguments)||this}var j=(Object.defineProperty(G.prototype,"name",{get:function(){return this._coll},enumerable:!0,configurable:!0}),G.prototype.aggregate=function(r){return p(this,void 0,void 0,function(){var e;return k(this,function(t){switch(t.label){case 0:return Array.isArray(r)||(r=[r]),e={aggregate_pipelines:r,collection_name:this._coll},[4,this._db.dbRequest("miniapp.cloud.db.collection.aggregate",e)];case 1:return [2,t.sent()]}})})},G.prototype.count=function(r){return p(this,void 0,void 0,function(){var e;return k(this,function(t){switch(t.label){case 0:return e={filter:r,collection_name:this._coll},[4,this._db.dbRequest("miniapp.cloud.db.collection.count",e)];case 1:return [2,t.sent()]}})})},G.prototype.deleteMany=function(r){return p(this,void 0,void 0,function(){var e;return k(this,function(t){switch(t.label){case 0:return e={filter:r,collection_name:this._coll},[4,this._db.dbRequest("miniapp.cloud.db.collection.remove",e)];case 1:return [2,t.sent()]}})})},G.prototype.find=function(r,n){return void 0===n&&(n={}),p(this,void 0,void 0,function(){var e;return k(this,function(t){switch(t.label){case 0:return e={displayed_fields:n.projection,order_by:n.sort,skip:n.skip,limit:n.limit,filter:r,collection_name:this._coll},[4,this._db.dbRequest("miniapp.cloud.db.collection.get",e)];case 1:return [2,t.sent()]}})})},G.prototype.replaceOne=function(r,n){return p(this,void 0,void 0,function(){var e;return k(this,function(t){switch(t.label){case 0:return e={filter:r,new_record:n,collection_name:this._coll},[4,this._db.dbRequest("miniapp.cloud.db.collection.replace",e)];case 1:return [2,t.sent()]}})})},G.prototype.insertOne=function(r){return p(this,void 0,void 0,function(){var e;return k(this,function(t){switch(t.label){case 0:return e={record:r,collection_name:this._coll},[4,this._db.dbRequest("miniapp.cloud.db.collection.add",e)];case 1:return [2,t.sent()]}})})},G.prototype.insertMany=function(r){return p(this,void 0,void 0,function(){var e;return k(this,function(t){switch(t.label){case 0:if(e={records:r,collection_name:this._coll},!Array.isArray(r))throw new Error("带插入的数据只能为数组");return [4,this._db.dbRequest("miniapp.cloud.db.collection.addMany",e)];case 1:return [2,t.sent()]}})})},G.prototype.updateMany=function(r,n,o){return p(this,void 0,void 0,function(){var e;return k(this,function(t){switch(t.label){case 0:return e={filter:r,action:n,arrayFilters:o,collection_name:this._coll},[4,this._db.dbRequest("miniapp.cloud.db.collection.update",e)];case 1:return [2,t.sent()]}})})},G.prototype.createIndex=function(r,n,o){return p(this,void 0,void 0,function(){var e;return k(this,function(t){switch(t.label){case 0:return e={index_name:r,unique:n,fields:o,collection_name:this._coll},[4,this._db.dbRequest("miniapp.cloud.db.index.create",e)];case 1:return [2,t.sent()]}})})},r([o()],G.prototype,"aggregate",null),r([o()],G.prototype,"count",null),r([o()],G.prototype,"deleteMany",null),r([o()],G.prototype,"find",null),r([o()],G.prototype,"replaceOne",null),r([o()],G.prototype,"insertOne",null),r([o()],G.prototype,"insertMany",null),r([o()],G.prototype,"updateMany",null),r([o()],G.prototype,"createIndex",null),G);function G(t,e){this._db=t,this._coll=e;}var U,N=(e(z,U=b),z.prototype.collection=function(t){if(!t)throw new Error("集合名称不能为空");return new j(this,t)},z.prototype.createCollection=function(r,t){return p(this,void 0,void 0,function(){var e;return k(this,function(t){switch(t.label){case 0:return e={collection_name:r},[4,this.dbRequest("miniapp.cloud.db.collection.create",e)];case 1:return [2,t.sent()]}})})},z.prototype.dbRequest=function(r,n){return p(this,void 0,void 0,function(){var e;return k(this,function(t){switch(t.label){case 0:return "test"!==(e=this.options.env)&&(e="online"),n=h(h({},n),{env:e}),[4,this.request.exec({env:e,url:"db/"+r,data:n},d.GATEWAY)];case 1:return [2,t.sent()]}})})},r([o()],z.prototype,"createCollection",null),z);function z(){return null!==U&&U.apply(this,arguments)||this}var W,Y=(e(F,W=b),F.prototype.invoke=function(d){return p(this,void 0,void 0,function(){var e,i,a,s,c,u,l,p;return k(this,function(t){switch(t.label){case 0:return e=d.data,i=d.headers,a=d.authScope,s=d.api,e=e||{},Object.keys(e).forEach(function(t){e[t]="string"==typeof e[t]?e[t]:JSON.stringify(e[t]);}),c={apiName:s,httpHeaders:i,data:e},[4,this.topRequest(c)];case 1:if(!T(u=t.sent(),"error_response"))return [2,u];if(l=T(u,"error_response.code"),(p=my&&my.canIUse("qn.cleanToken"))&&!a&&(a="*"),26!=l&&27!=l&&53!=l||!a)return [3,9];t.label=2;case 2:return t.trys.push([2,8,,9]),p?(console.log("call my.qn.cleanToken"),[4,my.qn.cleanToken()]):[3,4];case 3:t.sent(),t.label=4;case 4:return [4,(r=my.authorize,n={scopes:a},r?(n=n||{},new Promise(function(t,e){r.call(o||my,h(h({},n),{success:t,fail:e}));})):Promise.reject("未实现my.api"))];case 5:return [4,t.sent()];case 6:return t.sent(),[4,this.topRequest(c)];case 7:return T(u=t.sent(),"error_response")?[3,9]:[2,u];case 8:return t.sent(),[3,9];case 9:throw new Error(""+JSON.stringify(T(u,"error_response")))}var r,n,o;})})},F.prototype.topRequest=function(e){return p(this,void 0,void 0,function(){return k(this,function(t){switch(t.label){case 0:return [4,this.request.exec({env:this.options.env||"online",url:"top",data:e},d.GATEWAY)];case 1:return [2,t.sent()]}})})},r([o()],F.prototype,"invoke",null),F);function F(){return null!==W&&W.apply(this,arguments)||this}var J,K=(e(L,J=b),L.prototype.invoke=function(o){return p(this,void 0,void 0,function(){var e,r,n;return k(this,function(t){switch(t.label){case 0:return e=o.data,r=o.headers,n=o.api,[4,this.topRequest({apiName:n,httpHeaders:r,data:e})];case 1:return [2,t.sent()]}})})},L.prototype.topRequest=function(e){return p(this,void 0,void 0,function(){return k(this,function(t){switch(t.label){case 0:return [4,this.request.exec({url:"process",data:e},d.GATEWAY)];case 1:return [2,t.sent()]}})})},r([o()],L.prototype,"invoke",null),L);function L(){return null!==J&&J.apply(this,arguments)||this}var Q,V=(e(X,Q=b),X.prototype.invoke=function(i){return p(this,void 0,void 0,function(){var e,r,n,o;return k(this,function(t){switch(t.label){case 0:return e=i.data,r=i.headers,n=i.api,o=i.targetAppKey,[4,this.qimenRequest({apiName:n,httpHeaders:r,targetAppKey:o,data:e})];case 1:return [2,t.sent()]}})})},X.prototype.qimenRequest=function(e){return p(this,void 0,void 0,function(){return k(this,function(t){switch(t.label){case 0:return [4,this.request.exec({env:this.options.env||"online",url:"qimen",data:e},d.GATEWAY)];case 1:return [2,t.sent()]}})})},r([o()],X.prototype,"invoke",null),X);function X(){return null!==Q&&Q.apply(this,arguments)||this}var $,Z=(e(tt,$=b),tt.prototype.httpRequest=function(s){return p(this,void 0,void 0,function(){var e,r,n,o,i,a;return k(this,function(t){switch(t.label){case 0:return e=s.body,r=s.params,n=s.headers,o=s.path,i=s.method,a=s.exts,[4,this.innerRequest({path:o,headers:n,body:e,queryString:r,method:i,options:a})];case 1:return [2,t.sent()]}})})},tt.prototype.innerRequest=function(e){return p(this,void 0,void 0,function(){return k(this,function(t){switch(t.label){case 0:return [4,this.request.exec({env:this.options.env||"online",url:"cloudHttp",data:e},d.GATEWAY)];case 1:return [2,t.sent()]}})})},r([o()],tt.prototype,"httpRequest",null),tt);function tt(){return null!==$&&$.apply(this,arguments)||this}var et,rt=(e(nt,et=Error),nt.prototype.toString=function(){return (this.code||"")+" "+(this.message||"")},nt);function nt(){return null!==et&&et.apply(this,arguments)||this}var ot,it=(e(at,ot=m),at.getMtopErrorMsg=function(t){var e=new rt;if(!t)return e.code="500",e.message="客户端网络错误,请稍后重试",e;var r,n,o=t.ret&&t.ret[0]&&t.ret[0].split("::");if(t.data=t.data||T(t,["err","data"]),t.data&&t.data.errCode&&(r=t.data.errCode,n=t.data.errMessage||t.data.errMsg),t.data&&t.data.errorCode&&(r=t.data.errorCode),t.data&&t.data.errorMessage&&(n=t.data.errorMessage),t.data&&t.data.errorPage)try{if(my&&my.tb&&my.tb.showErrorView)return my.tb.showErrorView({reason:t.data.errorPage.reason,message:t.data.errorPage.message,action:t.data.errorPage.action,icon:t.data.errorPage.icon}),e;delete t.data.errorPage;}catch(t){}return t.data&&t.data.success||o&&"SUCCESS"===o[0]&&!r?void 0:(r=r||(o&&"FAIL_SYS_SESSION_EXPIRED"===o[0]?"904":"500"),n=n||o&&o[1]||"客户端网络错误,请稍后重试",e.code=r,e.message=n,e)},at.GATEWAY_APIS={"db/miniapp.cloud.db.collection.create":"mtop.taobao.dataproxy.collection.create","db/miniapp.cloud.db.index.create":"mtop.taobao.dataproxy.index.create","db/miniapp.cloud.db.collection.aggregate":"mtop.taobao.dataproxy.record.aggregate","db/miniapp.cloud.db.collection.count":"mtop.taobao.dataproxy.record.count","db/miniapp.cloud.db.collection.remove":"mtop.taobao.dataproxy.record.delete","db/miniapp.cloud.db.collection.get":"mtop.taobao.dataproxy.record.select","db/miniapp.cloud.db.collection.replace":"mtop.taobao.dataproxy.record.replace","db/miniapp.cloud.db.collection.add":"mtop.taobao.dataproxy.record.insert","db/miniapp.cloud.db.collection.addMany":"mtop.taobao.dataproxy.record.batch.insert","db/miniapp.cloud.db.collection.update":"mtop.taobao.dataproxy.record.update",fc:"mtop.miniapp.cloud.invoke.fc",top:"mtop.miniapp.cloud.invoke.top",qimen:"mtop.miniapp.cloud.invoke.qimen.cloud",process:"mtop.miniapp.cloud.invoke.process",cloudHttp:"mtop.miniapp.cloud.application.request"},at);function at(){var t=null!==ot&&ot.apply(this,arguments)||this;return t.sendMtop=function(i,a,s){return p(t,void 0,void 0,function(){return k(this,function(t){return console.log("sendMtop",a),[2,new Promise(function(r,n){var e=1;if(1024e3<=a.length){var t=new rt;t.code="500",t.message="本次请求内容过长，请控制在1M以内",n(t);}else {var o=function(){my.sendMtop(h(h({api:i,v:"1.0",data:a,method:"POST",needLogin:!0,sessionOption:"AutoLoginAndManualLogin"},s),{success:function(t){var e=at.getMtopErrorMsg(t);e?n(e):r(t);},fail:function(t){if(console.log("sendMtop error",t),1===t.error_type&&0<e)return --e,o();n(at.getMtopErrorMsg(t));}}));};o();}})]})})},t.invokeMyApi=function(r,n){return p(t,void 0,void 0,function(){return k(this,function(t){return [2,new Promise(function(t,e){return r=r.replace(/^my\./,""),my[r](h(h({},n),{success:t,fail:e}))})]})})},t.sendHttpRequest=function(n,o,i,a){return p(t,void 0,void 0,function(){var e=this;return k(this,function(t){return [2,new Promise(function(r,t){my.httpRequest({url:e.options.gatewayUrl+"/"+n,data:o,dataType:"text",method:a,headers:i,success:function(e){try{r(h(h({},e),{data:JSON.parse(e.data)}));}catch(t){r(h(h({},e),{data:e.data}));}},fail:t});})]})})},t.apply=function(u,l){return p(t,void 0,void 0,function(){var e,r,n,o,i,a,s,c;return k(this,function(t){switch(t.label){case 0:return e=u.url,r=u.data,n=u.headers,o=u.mtopOptions,i=u.method,l!==d.MTOP?[3,2]:[4,this.sendMtop(e,r,o)];case 1:return [2,t.sent()];case 2:return l!==d.GATEWAY?[3,8]:this.options.gatewayUrl?[4,this.sendHttpRequest(e,r,n,i)]:[3,4];case 3:return [2,t.sent()];case 4:return t.trys.push([4,6,,7]),u.rawData&&Object.keys(u.rawData).forEach(function(t){"object"==typeof u.rawData[t]&&(u.rawData[t]=JSON.stringify(u.rawData[t]));}),[4,this.sendMtop(at.GATEWAY_APIS[e],h(h({},u.rawData),{protocols:JSON.stringify(n)}),o)];case 5:return a=t.sent(),(s=a&&a.data||{}).errCode?[2,{headers:{"mc-code":s.errCode,"mc-msg":s.errMessage},data:{}}]:[2,{headers:{"mc-code":200,"mc-msg":"请求成功"},data:T(s,["data"])||{}}];case 6:return (c=t.sent())&&c.code?[2,{headers:{"mc-code":c.code,"mc-msg":c.message}}]:[2,{headers:{"mc-code":500,"mc-msg":c.message||c}}];case 7:return [3,10];case 8:return [4,this.invokeMyApi(e,r)];case 9:return [2,t.sent()];case 10:return [2]}})})},t}var st=(ct.prototype.init=function(i,a){return p(this,void 0,void 0,function(){var r,n,o;return k(this,function(t){switch(t.label){case 0:return t.trys.push([0,2,,3]),e=i.env,r="string"==typeof(e=e||"online")?{database:e,file:e,function:e,message:e}:(e.database=e.database||"online",e.file=e.file||"online",e.function=e.function||"online",e.message=e.message||"online",e),n=new g,this.db=new N({env:r.database},n),this.function=new A({env:r.function},n),this.file=new C({env:r.file},n),this.qimenApi=new V({env:r.database},n),this.topApi=new Y({env:r.database},n),this.processApi=new K({env:r.database},n),this.application=new Z({env:r.database},n),[4,n.init(h({},i),a||new it({gatewayUrl:i.__gatewayUrl}))];case 1:return t.sent(),[2,!0];case 2:return o=t.sent(),console.error("SDK初始化失败 ",o),[3,3];case 3:return [2,!1]}var e;})})},ct);function ct(){}var ut=new st;t.Cloud=st,t.default=ut,Object.defineProperty(t,"__esModule",{value:!0});});
}(mpCloudSdk, mpCloudSdk.exports));

var cloud = /*@__PURE__*/getDefaultExportFromCjs(mpCloudSdk.exports);

/**
 * 发起一个Http请求
 * @param method 请求类型，GET 或 POST
 * @param url 请求地址
 * @param data 请求数据
 */
async function httpRequest(method, url, data = {}) {
    console.log(data, 'dataPoint');
    cloud.init({ env: data.is_prod ? 'online' : 'test' });
    try {
        const _data = {};
        const _params = {
            ...data,
        };
        if (method == "GET") {
        }
        else {
            _data.body = _params;
        }
        let result = {};
        result = await cloud.application.httpRequest({
            path: url,
            method: method,
            headers: { "Content-Type": "application/json" },
            exts: {
                timeout: 10000,
                //cloudAppId: 7606
                //cloudAppId: 31017
                cloudAppId: 34134
            },
            ..._data,
        });
        return result.data || result;
    }
    catch (err) {
        if (JSON.stringify(err).indexOf("mtop请求错误") >= 0) {
            throw { msg: "当前网络异常" };
        }
        throw (err || { msg: "服务器异常" });
    }
}
function get(url, data = {}) {
    return httpRequest("GET", url, data);
}
function post(url, data = {}) {
    return httpRequest("POST", url, data);
}
var http = {
    httpRequest,
    get,
    post,
};

/* act_id: "未知"                            // 活动ID          - 需要传入 手动
act_name: "未知"                             // 活动名称         - 需要传入 手动
app: ""                                     //  ？
application_dep_platform: "crm_enbrands"    // 部署平台code     - 通过埋点平台获取传入
application_label: "common"                 // 部署平台name     - 通过埋点平台获取传入
city: ""                                    // 所属城市
device_model: ""                            // 设备幸好
distinct_id: 100                            // 用户ID          - 手动传入，标识用户唯一性的字段，埋点平台有很多未知的情况，需考虑
district: ""                                // 客户端所在的区县信息
event_code: "sjymMaidian"                   // 事件code        - 通过埋点平台获取传入
event_elements: "[]"                        // ???
event_label: "all_general"                  // 事件标签         - 通过埋点平台获取传入
event_name: "事件页面-埋点"                   // 事件name        - 通过埋点平台获取传入
event_paramters: "[]"                       // ????
event_time: 1650085480159                   // 埋入时间
event_trigger_mode: "open"                  // 事件触发类型     - 通过埋点平台获取传入
ip: ""                                      // ip
is_interactive: false                       // 是否标准互动
is_prod: false                              // 埋点的环境       - 手动传入 true false
lat: ""                                     // 经纬度
lon: ""                                     // 经纬度
member_id: "未知"                            // 会员ID          - 手动传入
merchant_id: 100                            // 店铺ID          - 手动传入
mix_nick: "未知"                             // 混淆nick        - 手动传入
nick: "未知"                                 // nick           - 手动传入
open_id: "未知"                              //  微信平台下请务必传入正确的open_id                 - 手动传入
open_type: 1                                //  1正常数据也就是对接新埋点平台，2互动营销类的，3其他
os: ""                                      //  系统
os_version: ""                              //  系统版本
ouid: "未知"                                 //  ouid（TB）                                   - 手动传入
phone: "未知"                                //  手机号                                       - 手动传入
platform_app: "埋点管理平台"                  //  应用名称                                      - 通过埋点平台获取传入
platform_app_code: "mdglpt"                 //  应用code                                     - 通过埋点平台获取传入
platform_app_version: "1.1.1"               //  应用版本                                      - 通过埋点平台获取传入
platform_business: "BD"                     //  部署                                         - 通过埋点平台获取传入
platform_system: "pc"                       //  系统运行的系统                                 - 通过埋点平台获取传入
provider: "未知"                             //  提供者                                       - 手动传入
province: ""                                //  客户端所在的省份
referrer: "https://bp.enbrands.com/event"   //  页面路径
runtime_env: "pc"                           //  运行环境                                     - 手动传入
screen_height: 1080                         //  设备高
screen_width: 1920                          //  设备宽
url: "/app"                                 //  页面路由
user_agent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.75 Safari/537.36"   //???
vis_carrier: ""                             //  访问载体,对于Web,填入浏览器，对于APP，填入Android或IOS的App	WEB：Mozilla。Android：MIUI iPhone：iOS，对应$browser
vis_version: ""                             //  访问载体版本
visitor_id: "" */ //  客户端设备唯一标识，PC端填入浏览器fingerprint，手机端可填Android:IMEI/Iphone:udid	fingerprin通过JS可以获取
const host = "https://bp-receive.enbrands.com/receive/addReceive";
const host_test = "https://test-open-gateway.enbrands.com/receive/addReceive";
const keys = [
    'is_prod',
    'runtime_env',
    // 事件
    // 'event_uuid', // event_uuid，server_time这两个前端不用传，由filebeat提供的
    'event_time',
    'event_name',
    'event_code',
    'event_trigger_mode',
    'event_elements',
    'event_paramters',
    'event_label',
    // 我们每个互动都要传递
    'distinct_id',
    'member_id',
    'merchant_id',
    'act_id',
    'is_interactive',
    'url',
    // 应用
    'platform_system',
    'platform_app',
    'platform_app_code',
    'platform_app_version',
    'platform_business',
    'application_dep_platform',
    'application_label',
    // 新增字段
    'nick',
    'mix_nick',
    'open_id',
    'phone',
    'ouid',
    'act_name',
    'provider',
    'open_type',
    // How
    'app',
    'os',
    'os_version',
    'vis_carrier',
    'vis_version',
    'visitor_id',
    'device_model',
    'referrer',
    'screen_height',
    'screen_width',
    'user_agent',
    'utm',
    // where
    'ip',
    'lon',
    'lat',
    'province',
    'city',
    'district',
];
class BuriedPoint {
    defaultSetting = {}; // 最终完成喂点传递参数
    isPosition = false;
    host = host;
    host_test = host_test;
    lat = '';
    lon = '';
    storageList = [];
    setConfig(config, next) {
        this.defaultSetting = config;
        if (config.runtime_env === 'h5' || config.runtime_env === 'pc') {
            if (this.isPosition) { // 获取经纬度
                navigator.geolocation && navigator.geolocation.getCurrentPosition(this.showPosition);
            }
        }
        next && next(); // 初始化结束之后去完成喂点等
    }
    setAsyncConfig(config, next) {
        this.defaultSetting = {
            ...this.defaultSetting,
            ...config
        };
        next?.();
    }
    defaultSettingCheck() {
        const { defaultSetting } = this;
        if (!defaultSetting.nick) {
            console.warn('请传入旺旺号|未知');
            return false;
        }
        if (!defaultSetting.mix_nick) {
            console.warn('请传入加密后的旺旺号|未知');
            return false;
        }
        if (!defaultSetting.act_name) {
            console.warn('请传入活动名称|未知');
            return false;
        }
        if (!defaultSetting.open_id) {
            console.warn('微信平台下请务必传入open_id|未知');
            return false;
        }
        if (!defaultSetting.phone) {
            console.warn('请传入电话|未知');
            return false;
        }
        if (!defaultSetting.ouid) {
            console.warn('淘宝平台下请务必传入ou_id|未知');
            return false;
        }
        if (!defaultSetting.provider) {
            console.warn('请传入提供者|未知');
            return false;
        }
        if (!defaultSetting.open_type) {
            console.warn('请设置open_type');
            return false;
        }
        else if (defaultSetting.open_type != 1 && defaultSetting.open_type != 2 && defaultSetting.open_type != 3) {
            console.warn('open_type的值为1正常数据也就是对接新埋点平台，2互动营销类的，3其他');
            return false;
        }
        if (!defaultSetting.platform_app) {
            console.warn('请设置 platform_app, 比如 OLAY SKIN ID 肌肤测试系统');
        }
        if (!defaultSetting.platform_app_code) {
            console.warn('请设置 platform_app_code, 必须为标识该应用的唯一英文code');
        }
        if (!defaultSetting.application_label) {
            console.warn('请设置 application_label, 作为一个应用的标识');
        }
        if (!defaultSetting.platform_app_version) {
            console.warn('请设置 platform_app_version, 也就是该应用的版本');
        }
        if (!defaultSetting.platform_business) {
            console.warn('请设置 platform_business, 也就是该应用的业务平台：TB、TM、JD、WX、JZONE、DY、YZ、OTHERS');
        }
        if (!defaultSetting.application_dep_platform) {
            console.warn('请设置 application_dep_platform, 也就是该应用的部署平台');
        }
        if (!(typeof (defaultSetting.is_interactive) == 'boolean')) {
            console.warn('请设置 is_interactive, 是否互动');
        }
        // -----------------标识身份-----------------
        if (!defaultSetting.merchant_id) {
            console.warn('请设置 merchant_id, 即商家店铺ID。如果没有，直接填写 "未知" ');
        }
        if (!defaultSetting.distinct_id) {
            console.warn('用户登陆的ID，大平台（淘宝、京东）侧用户ID（能区别用户唯一性），如果未登录，直接填写 "未知" ');
        }
        if (!defaultSetting.act_id) {
            console.warn('当下参与的活动ID，由当下互动活动的业务ID决定。如果没有，直接填写 "未知" ');
        }
        if (!defaultSetting.member_id) {
            console.warn('店铺会员ID，如果没有，直接填写 "未知" ');
        }
        if (typeof defaultSetting.is_prod !== 'boolean') {
            console.warn('请填写 is_prod，是否是生产环境');
        }
        if (!defaultSetting.runtime_env) {
            console.warn('请填写 runtime_env: "pc"、"h5"、"jd"、"qq"、"weapp"、"swan"、"alipay"、"tt"、"rn" ');
        }
        if (!defaultSetting.platform_app || !defaultSetting.platform_app_code || !defaultSetting.platform_app_version || !defaultSetting.platform_business || !defaultSetting.application_dep_platform || typeof defaultSetting.is_interactive !== 'boolean' || !defaultSetting.merchant_id || !defaultSetting.distinct_id || !defaultSetting.act_id || !defaultSetting.member_id || typeof defaultSetting.is_prod !== 'boolean' || !defaultSetting.application_label || !defaultSetting.runtime_env) {
            return false;
        }
        return true;
    }
    eventParamsCheck(obj) {
        const { defaultSetting } = this;
        if (!obj.event_name) {
            console.warn('请填写事件名称');
        }
        if (!obj.event_code) {
            console.warn('请填写事件code');
        }
        if (!obj.event_trigger_mode) {
            console.warn('请填写事件的trigger_mode');
        }
        if (!obj.event_label) {
            console.warn('请填写事件标签');
        }
        if (defaultSetting.runtime_env !== 'pc' && defaultSetting.runtime_env !== 'h5' && !obj.url) {
            console.warn('请填写当前事件的页面url，非网页的情况下，url为必填参数');
        }
        if (!obj.event_name || !obj.event_code || !obj.event_trigger_mode || !obj.event_label || defaultSetting.runtime_env !== 'pc' && defaultSetting.runtime_env !== 'h5' && !obj.url) {
            return false;
        }
        return true;
    }
    async doFed(config) {
        if (config.runtime_env === 'h5' || config.runtime_env === 'pc') {
            if (config.is_prod) {
                return _axios_0_21_1_axios.post(this.host, config);
            }
            else {
                return _axios_0_21_1_axios.post(this.host_test, config);
            }
        }
        if (config.runtime_env === 'alipay') {
            return http.post("/receive/addReceive", {
                ...config
            });
        }
        /* if (config.is_prod) {
            this.request({
                url: this.host,
                data: config
            })
        } else {
            this.request({
                url: this.host_test,
                data: config
            })
        } */
    }
    get_event_time() {
        return +new Date();
    }
    getFedParams(options) {
        const params = {};
        for (let i in keys) {
            const key = keys[i];
            params[key] = '';
            try {
                if (options[key] !== undefined) {
                    params[key] = options[key];
                }
                else if (this.defaultSetting[key] !== undefined) {
                    params[key] = this.defaultSetting[key];
                }
                else {
                    params[key] = this['get_' + key]();
                }
            }
            catch (e) {
                params[key] = '';
            }
        }
        let kvs = [];
        if (params.event_paramters instanceof Array) {
            kvs = params.event_paramters;
        }
        else {
            for (let i in params.event_paramters) {
                kvs.push({
                    name: i,
                    value: params.event_paramters[i]
                });
            }
        }
        params.event_paramters = JSON.stringify(kvs);
        params.event_elements = JSON.stringify(params.event_elements);
        console.log('params', params);
        return params;
    }
    async fed(obj) {
        const result = this.defaultSettingCheck();
        const eventParamsResult = this.eventParamsCheck(obj);
        obj.event_time = this.get_event_time();
        this.storageList.push(obj);
        if (result && eventParamsResult) {
            this.storageList.map(async (storage) => {
                return this.doFed(this.getFedParams(storage));
            });
            //return OmegaLogger.prototype.fed.call(this, obj);
            this.storageList = [];
        }
        if (!result) {
            this.storageList.push(obj);
            this.storageList.length > 100 && console.warn(`当下埋点异常，参数校验不通过，已累计异常埋点${this.storageList.length}条`);
        }
    }
    // 是否开启定位
    setPosition(flag) {
        this.isPosition = flag;
    }
    showPosition(position) {
        var lat = position.coords.latitude; //纬度
        var lon = position.coords.longitude; //经度
        this.lat = lat;
        this.lon = lon;
        console.info('纬度:' + lat + ',经度:' + lon);
    }
}

export { BuriedPoint as default };
