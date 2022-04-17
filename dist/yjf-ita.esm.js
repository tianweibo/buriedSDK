import require$$1 from 'http';
import require$$2 from 'https';
import require$$0$2 from 'url';
import require$$3 from 'stream';
import require$$4 from 'assert';
import require$$8 from 'zlib';

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

var axios$2 = {exports: {}};

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
  return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '');
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
InterceptorManager$1.prototype.use = function use(fulfilled, rejected, options) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected,
    synchronous: options ? options.synchronous : false,
    runWhen: options ? options.runWhen : null
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

var normalizeHeaderName$1 = function normalizeHeaderName(headers, normalizedName) {
  utils$b.forEach(headers, function processHeader(value, name) {
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
var enhanceError$3 = function enhanceError(error, config, code, request, response) {
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

var enhanceError$2 = enhanceError$3;

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
  return enhanceError$2(error, config, code, request, response);
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

var utils$a = utils$e;

var cookies$1 = (
  utils$a.isStandardBrowserEnv() ?

  // Standard browser envs support document.cookie
    (function standardBrowserEnv() {
      return {
        write: function write(name, value, expires, path, domain, secure) {
          var cookie = [];
          cookie.push(name + '=' + encodeURIComponent(value));

          if (utils$a.isNumber(expires)) {
            cookie.push('expires=' + new Date(expires).toGMTString());
          }

          if (utils$a.isString(path)) {
            cookie.push('path=' + path);
          }

          if (utils$a.isString(domain)) {
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

var utils$9 = utils$e;

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

  utils$9.forEach(headers.split('\n'), function parser(line) {
    i = line.indexOf(':');
    key = utils$9.trim(line.substr(0, i)).toLowerCase();
    val = utils$9.trim(line.substr(i + 1));

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

var utils$8 = utils$e;

var isURLSameOrigin$1 = (
  utils$8.isStandardBrowserEnv() ?

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
        var parsed = (utils$8.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
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

var utils$7 = utils$e;
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
    var responseType = config.responseType;

    if (utils$7.isFormData(requestData)) {
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

    function onloadend() {
      if (!request) {
        return;
      }
      // Prepare the response
      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
      var responseData = !responseType || responseType === 'text' ||  responseType === 'json' ?
        request.responseText : request.response;
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
    }

    if ('onloadend' in request) {
      // Use onloadend if available
      request.onloadend = onloadend;
    } else {
      // Listen for ready state to emulate onloadend
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
        // readystate handler is calling before onerror or ontimeout handlers,
        // so we should call onloadend on the next 'tick'
        setTimeout(onloadend);
      };
    }

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
      reject(createError$1(
        timeoutErrorMessage,
        config,
        config.transitional && config.transitional.clarifyTimeoutError ? 'ETIMEDOUT' : 'ECONNABORTED',
        request));

      // Clean up request
      request = null;
    };

    // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.
    if (utils$7.isStandardBrowserEnv()) {
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
      utils$7.forEach(requestHeaders, function setRequestHeader(val, key) {
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
    if (!utils$7.isUndefined(config.withCredentials)) {
      request.withCredentials = !!config.withCredentials;
    }

    // Add responseType to request if needed
    if (responseType && responseType !== 'json') {
      request.responseType = config.responseType;
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

var followRedirects = {exports: {}};

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

var url$1 = require$$0$2;
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
followRedirects.exports = wrap({ http: http$2, https: https$1 });
followRedirects.exports.wrap = wrap;

var _from$1 = "axios@^0.21.1";
var _id$1 = "axios@0.21.4";
var _inBundle$1 = false;
var _integrity$1 = "sha512-ut5vewkiu8jjGBdqpM44XxjuCjq9LAKeHVmoVfHVzy8eHgxxq8SbAVQNovDA8mVi05kP0Ea/n/UzcSHcTJQfNg==";
var _location$1 = "/axios";
var _phantomChildren$1 = {
};
var _requested$1 = {
	type: "range",
	registry: true,
	raw: "axios@^0.21.1",
	name: "axios",
	escapedName: "axios",
	rawSpec: "^0.21.1",
	saveSpec: null,
	fetchSpec: "^0.21.1"
};
var _requiredBy$1 = [
	"/"
];
var _resolved$1 = "https://registry.npmjs.org/axios/-/axios-0.21.4.tgz";
var _shasum$1 = "c67b90dc0568e5c1cf2b0b858c43ba28e2eda575";
var _spec$1 = "axios@^0.21.1";
var _where$1 = "/Users/tianwb/Desktop/workInyjf/yjf-ita";
var author$1 = {
	name: "Matt Zabriskie"
};
var browser = {
	"./lib/adapters/http.js": "./lib/adapters/xhr.js"
};
var bugs = {
	url: "https://github.com/axios/axios/issues"
};
var bundleDependencies$1 = false;
var bundlesize = [
	{
		path: "./dist/axios.min.js",
		threshold: "5kB"
	}
];
var dependencies = {
	"follow-redirects": "^1.14.0"
};
var deprecated$1 = false;
var description$1 = "Promise based HTTP client for the browser and node.js";
var devDependencies = {
	coveralls: "^3.0.0",
	"es6-promise": "^4.2.4",
	grunt: "^1.3.0",
	"grunt-banner": "^0.6.0",
	"grunt-cli": "^1.2.0",
	"grunt-contrib-clean": "^1.1.0",
	"grunt-contrib-watch": "^1.0.0",
	"grunt-eslint": "^23.0.0",
	"grunt-karma": "^4.0.0",
	"grunt-mocha-test": "^0.13.3",
	"grunt-ts": "^6.0.0-beta.19",
	"grunt-webpack": "^4.0.2",
	"istanbul-instrumenter-loader": "^1.0.0",
	"jasmine-core": "^2.4.1",
	karma: "^6.3.2",
	"karma-chrome-launcher": "^3.1.0",
	"karma-firefox-launcher": "^2.1.0",
	"karma-jasmine": "^1.1.1",
	"karma-jasmine-ajax": "^0.1.13",
	"karma-safari-launcher": "^1.0.0",
	"karma-sauce-launcher": "^4.3.6",
	"karma-sinon": "^1.0.5",
	"karma-sourcemap-loader": "^0.3.8",
	"karma-webpack": "^4.0.2",
	"load-grunt-tasks": "^3.5.2",
	minimist: "^1.2.0",
	mocha: "^8.2.1",
	sinon: "^4.5.0",
	"terser-webpack-plugin": "^4.2.3",
	typescript: "^4.0.5",
	"url-search-params": "^0.10.0",
	webpack: "^4.44.2",
	"webpack-dev-server": "^3.11.0"
};
var homepage = "https://axios-http.com";
var jsdelivr = "dist/axios.min.js";
var keywords = [
	"xhr",
	"http",
	"ajax",
	"promise",
	"node"
];
var license$1 = "MIT";
var main$1 = "index.js";
var name$1 = "axios";
var repository = {
	type: "git",
	url: "git+https://github.com/axios/axios.git"
};
var scripts$1 = {
	build: "NODE_ENV=production grunt build",
	coveralls: "cat coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js",
	examples: "node ./examples/server.js",
	fix: "eslint --fix lib/**/*.js",
	postversion: "git push && git push --tags",
	preversion: "npm test",
	start: "node ./sandbox/server.js",
	test: "grunt test",
	version: "npm run build && grunt version && git add -A dist && git add CHANGELOG.md bower.json package.json"
};
var typings = "./index.d.ts";
var unpkg = "dist/axios.min.js";
var version$1 = "0.21.4";
var require$$0$1 = {
	_from: _from$1,
	_id: _id$1,
	_inBundle: _inBundle$1,
	_integrity: _integrity$1,
	_location: _location$1,
	_phantomChildren: _phantomChildren$1,
	_requested: _requested$1,
	_requiredBy: _requiredBy$1,
	_resolved: _resolved$1,
	_shasum: _shasum$1,
	_spec: _spec$1,
	_where: _where$1,
	author: author$1,
	browser: browser,
	bugs: bugs,
	bundleDependencies: bundleDependencies$1,
	bundlesize: bundlesize,
	dependencies: dependencies,
	deprecated: deprecated$1,
	description: description$1,
	devDependencies: devDependencies,
	homepage: homepage,
	jsdelivr: jsdelivr,
	keywords: keywords,
	license: license$1,
	main: main$1,
	name: name$1,
	repository: repository,
	scripts: scripts$1,
	typings: typings,
	unpkg: unpkg,
	version: version$1
};

var utils$6 = utils$e;
var settle = settle$2;
var buildFullPath = buildFullPath$2;
var buildURL$1 = buildURL$3;
var http$1 = require$$1;
var https = require$$2;
var httpFollow = followRedirects.exports.http;
var httpsFollow = followRedirects.exports.https;
var url = require$$0$2;
var zlib = require$$8;
var pkg$1 = require$$0$1;
var createError = createError$3;
var enhanceError$1 = enhanceError$3;

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
    // See https://github.com/axios/axios/issues/69
    if ('User-Agent' in headers || 'user-agent' in headers) {
      // User-Agent is specified; handle case where no UA header is desired
      if (!headers['User-Agent'] && !headers['user-agent']) {
        delete headers['User-Agent'];
        delete headers['user-agent'];
      }
      // Otherwise, use specified value
    } else {
      // Only set header if it hasn't been set in config
      headers['User-Agent'] = 'axios/' + pkg$1.version;
    }

    if (data && !utils$6.isStream(data)) {
      if (Buffer.isBuffer(data)) ; else if (utils$6.isArrayBuffer(data)) {
        data = Buffer.from(new Uint8Array(data));
      } else if (utils$6.isString(data)) {
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
        var totalResponseBytes = 0;
        stream.on('data', function handleStreamData(chunk) {
          responseBuffer.push(chunk);
          totalResponseBytes += chunk.length;

          // make sure the content length is not over the maxContentLength if specified
          if (config.maxContentLength > -1 && totalResponseBytes > config.maxContentLength) {
            stream.destroy();
            reject(createError('maxContentLength size of ' + config.maxContentLength + ' exceeded',
              config, null, lastRequest));
          }
        });

        stream.on('error', function handleStreamError(err) {
          if (req.aborted) return;
          reject(enhanceError$1(err, config, null, lastRequest));
        });

        stream.on('end', function handleStreamEnd() {
          var responseData = Buffer.concat(responseBuffer);
          if (config.responseType !== 'arraybuffer') {
            responseData = responseData.toString(config.responseEncoding);
            if (!config.responseEncoding || config.responseEncoding === 'utf8') {
              responseData = utils$6.stripBOM(responseData);
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
      reject(enhanceError$1(err, config, null, req));
    });

    // Handle request timeout
    if (config.timeout) {
      // This is forcing a int timeout to avoid problems if the `req` interface doesn't handle other types.
      var timeout = parseInt(config.timeout, 10);

      if (isNaN(timeout)) {
        reject(createError(
          'error trying to parse `config.timeout` to int',
          config,
          'ERR_PARSE_TIMEOUT',
          req
        ));

        return;
      }

      // Sometime, the response will be very slow, and does not respond, the connect event will be block by event loop system.
      // And timer callback will be fired, and abort() will be invoked before connection, then get "socket hang up" and code ECONNRESET.
      // At this time, if we have a large number of request, nodejs will hang up some socket on background. and the number will up and up.
      // And then these socket which be hang up will devoring CPU little by little.
      // ClientRequest.setTimeout will be fired on the specify milliseconds, and can make sure that abort() will be fired after connect.
      req.setTimeout(timeout, function handleRequestTimeout() {
        req.abort();
        reject(createError(
          'timeout of ' + timeout + 'ms exceeded',
          config,
          config.transitional && config.transitional.clarifyTimeoutError ? 'ETIMEDOUT' : 'ECONNABORTED',
          req
        ));
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
    if (utils$6.isStream(data)) {
      data.on('error', function handleStreamError(err) {
        reject(enhanceError$1(err, config, null, req));
      }).pipe(req);
    } else {
      req.end(data);
    }
  });
};

var utils$5 = utils$e;
var normalizeHeaderName = normalizeHeaderName$1;
var enhanceError = enhanceError$3;

var DEFAULT_CONTENT_TYPE = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

function setContentTypeIfUnset(headers, value) {
  if (!utils$5.isUndefined(headers) && utils$5.isUndefined(headers['Content-Type'])) {
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

function stringifySafely(rawValue, parser, encoder) {
  if (utils$5.isString(rawValue)) {
    try {
      (parser || JSON.parse)(rawValue);
      return utils$5.trim(rawValue);
    } catch (e) {
      if (e.name !== 'SyntaxError') {
        throw e;
      }
    }
  }

  return (encoder || JSON.stringify)(rawValue);
}

var defaults$3 = {

  transitional: {
    silentJSONParsing: true,
    forcedJSONParsing: true,
    clarifyTimeoutError: false
  },

  adapter: getDefaultAdapter(),

  transformRequest: [function transformRequest(data, headers) {
    normalizeHeaderName(headers, 'Accept');
    normalizeHeaderName(headers, 'Content-Type');

    if (utils$5.isFormData(data) ||
      utils$5.isArrayBuffer(data) ||
      utils$5.isBuffer(data) ||
      utils$5.isStream(data) ||
      utils$5.isFile(data) ||
      utils$5.isBlob(data)
    ) {
      return data;
    }
    if (utils$5.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils$5.isURLSearchParams(data)) {
      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
      return data.toString();
    }
    if (utils$5.isObject(data) || (headers && headers['Content-Type'] === 'application/json')) {
      setContentTypeIfUnset(headers, 'application/json');
      return stringifySafely(data);
    }
    return data;
  }],

  transformResponse: [function transformResponse(data) {
    var transitional = this.transitional;
    var silentJSONParsing = transitional && transitional.silentJSONParsing;
    var forcedJSONParsing = transitional && transitional.forcedJSONParsing;
    var strictJSONParsing = !silentJSONParsing && this.responseType === 'json';

    if (strictJSONParsing || (forcedJSONParsing && utils$5.isString(data) && data.length)) {
      try {
        return JSON.parse(data);
      } catch (e) {
        if (strictJSONParsing) {
          if (e.name === 'SyntaxError') {
            throw enhanceError(e, this, 'E_JSON_PARSE');
          }
          throw e;
        }
      }
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

defaults$3.headers = {
  common: {
    'Accept': 'application/json, text/plain, */*'
  }
};

utils$5.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  defaults$3.headers[method] = {};
});

utils$5.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  defaults$3.headers[method] = utils$5.merge(DEFAULT_CONTENT_TYPE);
});

var defaults_1 = defaults$3;

var utils$4 = utils$e;
var defaults$2 = defaults_1;

/**
 * Transform the data for a request or a response
 *
 * @param {Object|String} data The data to be transformed
 * @param {Array} headers The headers for the request or response
 * @param {Array|Function} fns A single function or Array of functions
 * @returns {*} The resulting transformed data
 */
var transformData$1 = function transformData(data, headers, fns) {
  var context = this || defaults$2;
  /*eslint no-param-reassign:0*/
  utils$4.forEach(fns, function transform(fn) {
    data = fn.call(context, data, headers);
  });

  return data;
};

var isCancel$1 = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};

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
  config.data = transformData.call(
    config,
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
    response.data = transformData.call(
      config,
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
        reason.response.data = transformData.call(
          config,
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

var pkg = require$$0$1;

var validators$1 = {};

// eslint-disable-next-line func-names
['object', 'boolean', 'number', 'function', 'string', 'symbol'].forEach(function(type, i) {
  validators$1[type] = function validator(thing) {
    return typeof thing === type || 'a' + (i < 1 ? 'n ' : ' ') + type;
  };
});

var deprecatedWarnings = {};
var currentVerArr = pkg.version.split('.');

/**
 * Compare package versions
 * @param {string} version
 * @param {string?} thanVersion
 * @returns {boolean}
 */
function isOlderVersion(version, thanVersion) {
  var pkgVersionArr = thanVersion ? thanVersion.split('.') : currentVerArr;
  var destVer = version.split('.');
  for (var i = 0; i < 3; i++) {
    if (pkgVersionArr[i] > destVer[i]) {
      return true;
    } else if (pkgVersionArr[i] < destVer[i]) {
      return false;
    }
  }
  return false;
}

/**
 * Transitional option validator
 * @param {function|boolean?} validator
 * @param {string?} version
 * @param {string} message
 * @returns {function}
 */
validators$1.transitional = function transitional(validator, version, message) {
  var isDeprecated = version && isOlderVersion(version);

  function formatMessage(opt, desc) {
    return '[Axios v' + pkg.version + '] Transitional option \'' + opt + '\'' + desc + (message ? '. ' + message : '');
  }

  // eslint-disable-next-line func-names
  return function(value, opt, opts) {
    if (validator === false) {
      throw new Error(formatMessage(opt, ' has been removed in ' + version));
    }

    if (isDeprecated && !deprecatedWarnings[opt]) {
      deprecatedWarnings[opt] = true;
      // eslint-disable-next-line no-console
      console.warn(
        formatMessage(
          opt,
          ' has been deprecated since v' + version + ' and will be removed in the near future'
        )
      );
    }

    return validator ? validator(value, opt, opts) : true;
  };
};

/**
 * Assert object's properties type
 * @param {object} options
 * @param {object} schema
 * @param {boolean?} allowUnknown
 */

function assertOptions(options, schema, allowUnknown) {
  if (typeof options !== 'object') {
    throw new TypeError('options must be an object');
  }
  var keys = Object.keys(options);
  var i = keys.length;
  while (i-- > 0) {
    var opt = keys[i];
    var validator = schema[opt];
    if (validator) {
      var value = options[opt];
      var result = value === undefined || validator(value, opt, options);
      if (result !== true) {
        throw new TypeError('option ' + opt + ' must be ' + result);
      }
      continue;
    }
    if (allowUnknown !== true) {
      throw Error('Unknown option ' + opt);
    }
  }
}

var validator$1 = {
  isOlderVersion: isOlderVersion,
  assertOptions: assertOptions,
  validators: validators$1
};

var utils$1 = utils$e;
var buildURL = buildURL$3;
var InterceptorManager = InterceptorManager_1;
var dispatchRequest = dispatchRequest$1;
var mergeConfig$1 = mergeConfig$2;
var validator = validator$1;

var validators = validator.validators;
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

  var transitional = config.transitional;

  if (transitional !== undefined) {
    validator.assertOptions(transitional, {
      silentJSONParsing: validators.transitional(validators.boolean, '1.0.0'),
      forcedJSONParsing: validators.transitional(validators.boolean, '1.0.0'),
      clarifyTimeoutError: validators.transitional(validators.boolean, '1.0.0')
    }, false);
  }

  // filter out skipped interceptors
  var requestInterceptorChain = [];
  var synchronousRequestInterceptors = true;
  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    if (typeof interceptor.runWhen === 'function' && interceptor.runWhen(config) === false) {
      return;
    }

    synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;

    requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  var responseInterceptorChain = [];
  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
  });

  var promise;

  if (!synchronousRequestInterceptors) {
    var chain = [dispatchRequest, undefined];

    Array.prototype.unshift.apply(chain, requestInterceptorChain);
    chain = chain.concat(responseInterceptorChain);

    promise = Promise.resolve(config);
    while (chain.length) {
      promise = promise.then(chain.shift(), chain.shift());
    }

    return promise;
  }


  var newConfig = config;
  while (requestInterceptorChain.length) {
    var onFulfilled = requestInterceptorChain.shift();
    var onRejected = requestInterceptorChain.shift();
    try {
      newConfig = onFulfilled(newConfig);
    } catch (error) {
      onRejected(error);
      break;
    }
  }

  try {
    promise = dispatchRequest(newConfig);
  } catch (error) {
    return Promise.reject(error);
  }

  while (responseInterceptorChain.length) {
    promise = promise.then(responseInterceptorChain.shift(), responseInterceptorChain.shift());
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
var axios$1 = createInstance(defaults);

// Expose Axios class to allow class inheritance
axios$1.Axios = Axios;

// Factory for creating new instances
axios$1.create = function create(instanceConfig) {
  return createInstance(mergeConfig(axios$1.defaults, instanceConfig));
};

// Expose Cancel & CancelToken
axios$1.Cancel = Cancel_1;
axios$1.CancelToken = CancelToken_1;
axios$1.isCancel = isCancel$1;

// Expose all/spread
axios$1.all = function all(promises) {
  return Promise.all(promises);
};
axios$1.spread = spread;

// Expose isAxiosError
axios$1.isAxiosError = isAxiosError;

axios$2.exports = axios$1;

// Allow use of default import syntax in TypeScript
axios$2.exports.default = axios$1;

var axios = axios$2.exports;

var mpCloudSdk = {exports: {}};

var _from = "@tbmp/mp-cloud-sdk@^1.4.2";
var _id = "@tbmp/mp-cloud-sdk@1.5.4";
var _inBundle = false;
var _integrity = "sha512-GZJhTj5GWK5cCGvy+rOWgQSBxtXccO98TvAC4x7lluWFLyEXxPP4SH1YDFW6MZpbPVSXB6xVBVwWrs15842Emw==";
var _location = "/@tbmp/mp-cloud-sdk";
var _phantomChildren = {
};
var _requested = {
	type: "range",
	registry: true,
	raw: "@tbmp/mp-cloud-sdk@^1.4.2",
	name: "@tbmp/mp-cloud-sdk",
	escapedName: "@tbmp%2fmp-cloud-sdk",
	scope: "@tbmp",
	rawSpec: "^1.4.2",
	saveSpec: null,
	fetchSpec: "^1.4.2"
};
var _requiredBy = [
	"/"
];
var _resolved = "https://registry.npmjs.org/@tbmp/mp-cloud-sdk/-/mp-cloud-sdk-1.5.4.tgz";
var _shasum = "8e385e061aba2acfbd1c6e658f391b7878a03f28";
var _spec = "@tbmp/mp-cloud-sdk@^1.4.2";
var _where = "/Users/tianwb/Desktop/workInyjf/yjf-ita";
var author = "";
var bundleDependencies = false;
var deprecated = false;
var description = "";
var gitHead = "d383321e8319c91defa380a232d5a5997cc44030";
var license = "ISC";
var main = "index.js";
var name = "@tbmp/mp-cloud-sdk";
var publishConfig = {
	access: "public"
};
var scripts = {
	test: "echo \"Error: no test specified\" && exit 1"
};
var types = "./types/platforms/mp/index.d.ts";
var version = "1.5.4";
var require$$0 = {
	_from: _from,
	_id: _id,
	_inBundle: _inBundle,
	_integrity: _integrity,
	_location: _location,
	_phantomChildren: _phantomChildren,
	_requested: _requested,
	_requiredBy: _requiredBy,
	_resolved: _resolved,
	_shasum: _shasum,
	_spec: _spec,
	_where: _where,
	author: author,
	bundleDependencies: bundleDependencies,
	deprecated: deprecated,
	description: description,
	gitHead: gitHead,
	license: license,
	main: main,
	name: name,
	publishConfig: publishConfig,
	scripts: scripts,
	types: types,
	version: version
};

(function (module, exports) {
!function(e,t){t(exports);}(commonjsGlobal,function(e){var n=function(e,t){return (n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t;}||function(e,t){for(var r in t)t.hasOwnProperty(r)&&(e[r]=t[r]);})(e,t)};function t(e,t){function r(){this.constructor=e;}n(e,t),e.prototype=null===t?Object.create(t):(r.prototype=t.prototype,new r);}var d=function(){return (d=Object.assign||function(e){for(var t,r=1,n=arguments.length;r<n;r++)for(var o in t=arguments[r])Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o]);return e}).apply(this,arguments)};function r(e,t,r,n){var o,i=arguments.length,a=i<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,r):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,r,n);else for(var s=e.length-1;0<=s;s--)(o=e[s])&&(a=(i<3?o(a):3<i?o(t,r,a):o(t,r))||a);return 3<i&&a&&Object.defineProperty(t,r,a),a}function c(e,a,s,c){return new(s=s||Promise)(function(r,t){function n(e){try{i(c.next(e));}catch(e){t(e);}}function o(e){try{i(c.throw(e));}catch(e){t(e);}}function i(e){var t;e.done?r(e.value):((t=e.value)instanceof s?t:new s(function(e){e(t);})).then(n,o);}i((c=c.apply(e,a||[])).next());})}function f(r,n){var o,i,a,s={label:0,sent:function(){if(1&a[0])throw a[1];return a[1]},trys:[],ops:[]},e={next:t(0),throw:t(1),return:t(2)};return "function"==typeof Symbol&&(e[Symbol.iterator]=function(){return this}),e;function t(t){return function(e){return function(t){if(o)throw new TypeError("Generator is already executing.");for(;s;)try{if(o=1,i&&(a=2&t[0]?i.return:t[0]?i.throw||((a=i.return)&&a.call(i),0):i.next)&&!(a=a.call(i,t[1])).done)return a;switch(i=0,(t=a?[2&t[0],a.value]:t)[0]){case 0:case 1:a=t;break;case 4:return s.label++,{value:t[1],done:!1};case 5:s.label++,i=t[1],t=[0];continue;case 7:t=s.ops.pop(),s.trys.pop();continue;default:if(!(a=0<(a=s.trys).length&&a[a.length-1])&&(6===t[0]||2===t[0])){s=0;continue}if(3===t[0]&&(!a||t[1]>a[0]&&t[1]<a[3])){s.label=t[1];break}if(6===t[0]&&s.label<a[1]){s.label=a[1],a=t;break}if(a&&s.label<a[2]){s.label=a[2],s.ops.push(t);break}a[2]&&s.ops.pop(),s.trys.pop();continue}t=n.call(r,s);}catch(e){t=[6,e],i=0;}finally{o=a=0;}if(5&t[0])throw t[1];return {value:t[0]?t[1]:void 0,done:!0}}([t,e])}}}function o(){return function(e,t,r){var a=r.value;r.value=function(e){var t,r=e||{},e=r.success,n=void 0===e?null:e,e=r.fail,o=void 0===e?null:e,r=r.complete,i=void 0===r?null:r,r=!i&&!o&&!n;try{t=a.apply(this,arguments);}catch(e){return r?Promise.reject(e):(o&&o(e),void(i&&i(e)))}if(t=t.then?t:Promise.resolve(t),r)return t;t.then(function(e){try{n&&n(e),i&&i(e);}catch(e){throw e}}).catch(function(e){o&&o(e),i&&i(e);});};}}function h(e,t,r){e=(t=!Array.isArray(t)?t.split("."):t).reduce(function(e,t){return e?e[t]:null},e);return r?e||r:e}function i(e,t){return e(t={exports:{}},t.exports),t.exports}var u,s=i(function(e,t){e.exports=(e=function(u){var r=Object.create||function(e){return t.prototype=e,e=new t,t.prototype=null,e};function t(){}var e={},n=e.lib={},o=n.Base={extend:function(e){var t=r(this);return e&&t.mixIn(e),t.hasOwnProperty("init")&&this.init!==t.init||(t.init=function(){t.$super.init.apply(this,arguments);}),(t.init.prototype=t).$super=this,t},create:function(){var e=this.extend();return e.init.apply(e,arguments),e},init:function(){},mixIn:function(e){for(var t in e)e.hasOwnProperty(t)&&(this[t]=e[t]);e.hasOwnProperty("toString")&&(this.toString=e.toString);},clone:function(){return this.init.prototype.extend(this)}},l=n.WordArray=o.extend({init:function(e,t){e=this.words=e||[],this.sigBytes=null!=t?t:4*e.length;},toString:function(e){return (e||a).stringify(this)},concat:function(e){var t=this.words,r=e.words,n=this.sigBytes,o=e.sigBytes;if(this.clamp(),n%4)for(var i=0;i<o;i++){var a=r[i>>>2]>>>24-i%4*8&255;t[n+i>>>2]|=a<<24-(n+i)%4*8;}else for(i=0;i<o;i+=4)t[n+i>>>2]=r[i>>>2];return this.sigBytes+=o,this},clamp:function(){var e=this.words,t=this.sigBytes;e[t>>>2]&=4294967295<<32-t%4*8,e.length=u.ceil(t/4);},clone:function(){var e=o.clone.call(this);return e.words=this.words.slice(0),e},random:function(e){for(var t=[],r=0;r<e;r+=4){var n=function(t){var t=t,r=987654321,n=4294967295;return function(){var e=((r=36969*(65535&r)+(r>>16)&n)<<16)+(t=18e3*(65535&t)+(t>>16)&n)&n;return e/=4294967296,(e+=.5)*(.5<u.random()?1:-1)}}(4294967296*(o||u.random())),o=987654071*n();t.push(4294967296*n()|0);}return new l.init(t,e)}}),i=e.enc={},a=i.Hex={stringify:function(e){for(var t=e.words,r=e.sigBytes,n=[],o=0;o<r;o++){var i=t[o>>>2]>>>24-o%4*8&255;n.push((i>>>4).toString(16)),n.push((15&i).toString(16));}return n.join("")},parse:function(e){for(var t=e.length,r=[],n=0;n<t;n+=2)r[n>>>3]|=parseInt(e.substr(n,2),16)<<24-n%8*4;return new l.init(r,t/2)}},s=i.Latin1={stringify:function(e){for(var t=e.words,r=e.sigBytes,n=[],o=0;o<r;o++){var i=t[o>>>2]>>>24-o%4*8&255;n.push(String.fromCharCode(i));}return n.join("")},parse:function(e){for(var t=e.length,r=[],n=0;n<t;n++)r[n>>>2]|=(255&e.charCodeAt(n))<<24-n%4*8;return new l.init(r,t)}},c=i.Utf8={stringify:function(e){try{return decodeURIComponent(escape(s.stringify(e)))}catch(e){throw new Error("Malformed UTF-8 data")}},parse:function(e){return s.parse(unescape(encodeURIComponent(e)))}},d=n.BufferedBlockAlgorithm=o.extend({reset:function(){this._data=new l.init,this._nDataBytes=0;},_append:function(e){"string"==typeof e&&(e=c.parse(e)),this._data.concat(e),this._nDataBytes+=e.sigBytes;},_process:function(e){var t=this._data,r=t.words,n=t.sigBytes,o=this.blockSize,i=n/(4*o),a=(i=e?u.ceil(i):u.max((0|i)-this._minBufferSize,0))*o,n=u.min(4*a,n);if(a){for(var s=0;s<a;s+=o)this._doProcessBlock(r,s);var c=r.splice(0,a);t.sigBytes-=n;}return new l.init(c,n)},clone:function(){var e=o.clone.call(this);return e._data=this._data.clone(),e},_minBufferSize:0}),p=(n.Hasher=d.extend({cfg:o.extend(),init:function(e){this.cfg=this.cfg.extend(e),this.reset();},reset:function(){d.reset.call(this),this._doReset();},update:function(e){return this._append(e),this._process(),this},finalize:function(e){return e&&this._append(e),this._doFinalize()},blockSize:16,_createHelper:function(r){return function(e,t){return new r.init(t).finalize(e)}},_createHmacHelper:function(r){return function(e,t){return new p.HMAC.init(r,t).finalize(e)}}}),e.algo={});return e}(Math),e);}),a=(i(function(e,t){var a;e.exports=(a=s,function(o){var e=a,t=e.lib,r=t.WordArray,n=t.Hasher,t=e.algo,i=[],h=[];!function(){function e(e){return 4294967296*(e-(0|e))|0}for(var t=2,r=0;r<64;)!function(e){for(var t=o.sqrt(e),r=2;r<=t;r++)if(!(e%r))return;return 1}(t)||(r<8&&(i[r]=e(o.pow(t,.5))),h[r]=e(o.pow(t,1/3)),r++),t++;}();var y=[],t=t.SHA256=n.extend({_doReset:function(){this._hash=new r.init(i.slice(0));},_doProcessBlock:function(e,t){for(var r=this._hash.words,n=r[0],o=r[1],i=r[2],a=r[3],s=r[4],c=r[5],u=r[6],l=r[7],d=0;d<64;d++){d<16?y[d]=0|e[t+d]:(p=y[d-15],f=y[d-2],y[d]=((p<<25|p>>>7)^(p<<14|p>>>18)^p>>>3)+y[d-7]+((f<<15|f>>>17)^(f<<13|f>>>19)^f>>>10)+y[d-16]);var p=n&o^n&i^o&i,f=l+((s<<26|s>>>6)^(s<<21|s>>>11)^(s<<7|s>>>25))+(s&c^~s&u)+h[d]+y[d],l=u,u=c,c=s,s=a+f|0,a=i,i=o,o=n,n=f+(((n<<30|n>>>2)^(n<<19|n>>>13)^(n<<10|n>>>22))+p)|0;}r[0]=r[0]+n|0,r[1]=r[1]+o|0,r[2]=r[2]+i|0,r[3]=r[3]+a|0,r[4]=r[4]+s|0,r[5]=r[5]+c|0,r[6]=r[6]+u|0,r[7]=r[7]+l|0;},_doFinalize:function(){var e=this._data,t=e.words,r=8*this._nDataBytes,n=8*e.sigBytes;return t[n>>>5]|=128<<24-n%32,t[14+(64+n>>>9<<4)]=o.floor(r/4294967296),t[15+(64+n>>>9<<4)]=r,e.sigBytes=4*t.length,this._process(),this._hash},clone:function(){var e=n.clone.call(this);return e._hash=this._hash.clone(),e}});e.SHA256=n._createHelper(t),e.HmacSHA256=n._createHmacHelper(t);}(Math),a.SHA256);}),i(function(e,t){var r;e.exports=(r=s,void function(){var e=r.lib.Base,s=r.enc.Utf8;r.algo.HMAC=e.extend({init:function(e,t){e=this._hasher=new e.init,"string"==typeof t&&(t=s.parse(t));var r=e.blockSize,n=4*r;(t=t.sigBytes>n?e.finalize(t):t).clamp();for(var e=this._oKey=t.clone(),t=this._iKey=t.clone(),o=e.words,i=t.words,a=0;a<r;a++)o[a]^=1549556828,i[a]^=909522486;e.sigBytes=t.sigBytes=n,this.reset();},reset:function(){var e=this._hasher;e.reset(),e.update(this._iKey);},update:function(e){return this._hasher.update(e),this},finalize:function(e){var t=this._hasher,e=t.finalize(e);return t.reset(),t.finalize(this._oKey.clone().concat(e))}});}());}),i(function(e,t){e.exports=s.HmacSHA256;})),l=i(function(e,t){var r;e.exports=(r=s,function(){var c=r.lib.WordArray;r.enc.Base64={stringify:function(e){var t=e.words,r=e.sigBytes,n=this._map;e.clamp();for(var o=[],i=0;i<r;i+=3)for(var a=(t[i>>>2]>>>24-i%4*8&255)<<16|(t[i+1>>>2]>>>24-(i+1)%4*8&255)<<8|t[i+2>>>2]>>>24-(i+2)%4*8&255,s=0;s<4&&i+.75*s<r;s++)o.push(n.charAt(a>>>6*(3-s)&63));var c=n.charAt(64);if(c)for(;o.length%4;)o.push(c);return o.join("")},parse:function(e){var t=e.length,r=this._map;if(!(n=this._reverseMap))for(var n=this._reverseMap=[],o=0;o<r.length;o++)n[r.charCodeAt(o)]=o;var i=r.charAt(64);return !i||-1!==(i=e.indexOf(i))&&(t=i),function(e,t,r){for(var n=[],o=0,i=0;i<t;i++){var a,s;i%4&&(a=r[e.charCodeAt(i-1)]<<i%4*2,s=r[e.charCodeAt(i)]>>>6-i%4*2,n[o>>>2]|=(a|s)<<24-o%4*8,o++);}return c.create(n,o)}(e,t,n)},_map:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="};}(),r.enc.Base64);}),p=i(function(e,t){var o;e.exports=(o=s,function(c){var e=o,t=e.lib,r=t.WordArray,n=t.Hasher,t=e.algo,R=[];!function(){for(var e=0;e<64;e++)R[e]=4294967296*c.abs(c.sin(e+1))|0;}();t=t.MD5=n.extend({_doReset:function(){this._hash=new r.init([1732584193,4023233417,2562383102,271733878]);},_doProcessBlock:function(e,t){for(var r=0;r<16;r++){var n=t+r,o=e[n];e[n]=16711935&(o<<8|o>>>24)|4278255360&(o<<24|o>>>8);}var i=this._hash.words,a=e[t+0],s=e[t+1],c=e[t+2],u=e[t+3],l=e[t+4],d=e[t+5],p=e[t+6],f=e[t+7],h=e[t+8],y=e[t+9],v=e[t+10],m=e[t+11],g=e[t+12],b=e[t+13],w=e[t+14],_=e[t+15],A=M(A=i[0],S=i[1],q=i[2],x=i[3],a,7,R[0]),x=M(x,A,S,q,s,12,R[1]),q=M(q,x,A,S,c,17,R[2]),S=M(S,q,x,A,u,22,R[3]);A=M(A,S,q,x,l,7,R[4]),x=M(x,A,S,q,d,12,R[5]),q=M(q,x,A,S,p,17,R[6]),S=M(S,q,x,A,f,22,R[7]),A=M(A,S,q,x,h,7,R[8]),x=M(x,A,S,q,y,12,R[9]),q=M(q,x,A,S,v,17,R[10]),S=M(S,q,x,A,m,22,R[11]),A=M(A,S,q,x,g,7,R[12]),x=M(x,A,S,q,b,12,R[13]),q=M(q,x,A,S,w,17,R[14]),A=O(A,S=M(S,q,x,A,_,22,R[15]),q,x,s,5,R[16]),x=O(x,A,S,q,p,9,R[17]),q=O(q,x,A,S,m,14,R[18]),S=O(S,q,x,A,a,20,R[19]),A=O(A,S,q,x,d,5,R[20]),x=O(x,A,S,q,v,9,R[21]),q=O(q,x,A,S,_,14,R[22]),S=O(S,q,x,A,l,20,R[23]),A=O(A,S,q,x,y,5,R[24]),x=O(x,A,S,q,w,9,R[25]),q=O(q,x,A,S,u,14,R[26]),S=O(S,q,x,A,h,20,R[27]),A=O(A,S,q,x,b,5,R[28]),x=O(x,A,S,q,c,9,R[29]),q=O(q,x,A,S,f,14,R[30]),A=I(A,S=O(S,q,x,A,g,20,R[31]),q,x,d,4,R[32]),x=I(x,A,S,q,h,11,R[33]),q=I(q,x,A,S,m,16,R[34]),S=I(S,q,x,A,w,23,R[35]),A=I(A,S,q,x,s,4,R[36]),x=I(x,A,S,q,l,11,R[37]),q=I(q,x,A,S,f,16,R[38]),S=I(S,q,x,A,v,23,R[39]),A=I(A,S,q,x,b,4,R[40]),x=I(x,A,S,q,a,11,R[41]),q=I(q,x,A,S,u,16,R[42]),S=I(S,q,x,A,p,23,R[43]),A=I(A,S,q,x,y,4,R[44]),x=I(x,A,S,q,g,11,R[45]),q=I(q,x,A,S,_,16,R[46]),A=E(A,S=I(S,q,x,A,c,23,R[47]),q,x,a,6,R[48]),x=E(x,A,S,q,f,10,R[49]),q=E(q,x,A,S,w,15,R[50]),S=E(S,q,x,A,d,21,R[51]),A=E(A,S,q,x,g,6,R[52]),x=E(x,A,S,q,u,10,R[53]),q=E(q,x,A,S,v,15,R[54]),S=E(S,q,x,A,s,21,R[55]),A=E(A,S,q,x,h,6,R[56]),x=E(x,A,S,q,_,10,R[57]),q=E(q,x,A,S,p,15,R[58]),S=E(S,q,x,A,b,21,R[59]),A=E(A,S,q,x,l,6,R[60]),x=E(x,A,S,q,m,10,R[61]),q=E(q,x,A,S,c,15,R[62]),S=E(S,q,x,A,y,21,R[63]),i[0]=i[0]+A|0,i[1]=i[1]+S|0,i[2]=i[2]+q|0,i[3]=i[3]+x|0;},_doFinalize:function(){var e=this._data,t=e.words,r=8*this._nDataBytes,n=8*e.sigBytes;t[n>>>5]|=128<<24-n%32;var o=c.floor(r/4294967296),r=r;t[15+(64+n>>>9<<4)]=16711935&(o<<8|o>>>24)|4278255360&(o<<24|o>>>8),t[14+(64+n>>>9<<4)]=16711935&(r<<8|r>>>24)|4278255360&(r<<24|r>>>8),e.sigBytes=4*(t.length+1),this._process();for(var t=this._hash,i=t.words,a=0;a<4;a++){var s=i[a];i[a]=16711935&(s<<8|s>>>24)|4278255360&(s<<24|s>>>8);}return t},clone:function(){var e=n.clone.call(this);return e._hash=this._hash.clone(),e}});function M(e,t,r,n,o,i,a){a=e+(t&r|~t&n)+o+a;return (a<<i|a>>>32-i)+t}function O(e,t,r,n,o,i,a){a=e+(t&n|r&~n)+o+a;return (a<<i|a>>>32-i)+t}function I(e,t,r,n,o,i,a){a=e+(t^r^n)+o+a;return (a<<i|a>>>32-i)+t}function E(e,t,r,n,o,i,a){a=e+(r^(t|~n))+o+a;return (a<<i|a>>>32-i)+t}e.MD5=n._createHelper(t),e.HmacMD5=n._createHmacHelper(t);}(Math),o.MD5);});(A=u=u||{})[A.MTOP=1]="MTOP",A[A.MY=2]="MY",A[A.GATEWAY=3]="GATEWAY";var y,v=(t(m,y=Error),m);function m(){return null!==y&&y.apply(this,arguments)||this}var g=function(e){this.options=e||{},this.options.dataProxyGatewayUrl=this.options.dataProxyGatewayUrl||this.options.gatewayUrl;},b=(w.prototype.init=function(t,r){return c(this,void 0,void 0,function(){return f(this,function(e){return this.options=d({},t),this.proxy=r,this.tasks=[],this.inited=!0,[2]})})},w.getRequestType=function(e){return 0===e.indexOf("mtop.")?u.MTOP:0===e.indexOf("my.")?u.MY:u.GATEWAY},w.prototype.verifyResponse=function(t,r,n){return c(this,void 0,void 0,function(){return f(this,function(e){switch(e.label){case 0:if(h(n,"mc-code")||h(t,"errCode")||h(t,"error_response.code"),r.__is_retry_task__)return this.tryThrowError(t,n),[2,t];e.label=1;case 1:return e.trys.push([1,3,,4]),this.tryThrowError(t,n),[2,t];case 2:return [2,e.sent()];case 3:throw e.sent();case 4:return [2]}})})},w.prototype.tryThrowError=function(e,t){var r=h(t,"mc-msg")||h(e,"errMsg")||h(e,"error_response.msg"),t=h(t,"mc-code")||h(e,"errCode")||h(e,"error_response.code");if(t&&"200"!=t){e=new v(t+":::"+r);throw e.code=t,e.msg=r,e}},w.prototype.sendGatewayRequest=function(r){return c(this,void 0,void 0,function(){var t;return f(this,function(e){switch(e.label){case 0:return r=this.createGatewayRequest(r),[4,this.proxy.apply(d({},r),u.GATEWAY)];case 1:return t=e.sent(),[4,this.verifyResponse(h(t,"data"),r,h(t,"headers"))];case 2:return [2,e.sent()]}})})},w.prototype.exec=function(t,r){return c(this,void 0,void 0,function(){return f(this,function(e){switch(e.label){case 0:if(r=r||w.getRequestType(t.url),!this.inited)throw new Error("请先调用cloud.init()");return t.data=t.data||{},r!==u.GATEWAY?[3,2]:[4,this.sendGatewayRequest(t)];case 1:return [2,e.sent()];case 2:return [4,this.proxy.apply(t,r)];case 3:return [2,e.sent()]}})})},w.prototype.getHttpRequestSign=function(e,t,r,n,o){if(this.options.signSecret){o=o;delete n["mc-sign"];r=t+"\n"+l.stringify(p(o))+"\napplication/json\n"+Object.keys(n).filter(function(e){return /^mc-/.test(e)}).sort().map(function(e){return e.toLowerCase()+":"+n[e]}).join("\n")+"\n"+e+(r?"?"+r:"");return l.stringify(a(r,this.options.signSecret))}},w.prototype.createGatewayRequest=function(e){var t=this.options,r=t.sessionKey,n=t.appKey,o=t.requestId,i=t.miniappId,a=t.openId,s=t.unionId,c=t.cloudId,t=t.sdkVersion;e.method="POST";r=d(d({},e.headers),{"Content-Type":"application/json","mc-timestamp":""+Date.now(),"mc-session":r});a&&(r["mc-open-id"]=a),c&&(r["mc-cloud-id"]=c),s&&(r["mc-union-id"]=s),n&&(r["mc-appKey"]=n),i&&(r["mc-miniapp-id"]=i),o&&(r["mc-request-id"]=o),t&&(r["mc-sdk-version"]=t),e.env&&(r["mc-env"]=e.env),r["mc-session"]||delete r["mc-session"],e.rawData=e.rawData||e.data,"object"==typeof e.data&&(e.data=JSON.stringify(e.data));t=this.getHttpRequestSign(e.url,e.method,"",r,e.data);return d(d({},e),{url:""+e.url,headers:d(d({},r),{sign:t,"eagleeye-traceid":o})})},w);function w(){this.inited=!1;}new b;var _,A=function(e,t){this.request=t,this.options=e;},x=(t(q,_=A),q.prototype.invoke=function(t,r,n,o){return void 0===n&&(n="main"),c(this,void 0,void 0,function(){return f(this,function(e){switch(e.label){case 0:return [4,this.fcRequest({fcName:t,handler:n,data:r,options:Object.assign(o||{},this.options)})];case 1:return [2,e.sent()]}})})},q.prototype.fcRequest=function(t){return c(this,void 0,void 0,function(){return f(this,function(e){switch(e.label){case 0:return [4,this.request.exec({env:this.options.env||"online",url:"fc",data:t},u.GATEWAY)];case 1:return [2,e.sent()]}})})},r([o()],q.prototype,"invoke",null),q);function q(){return null!==_&&_.apply(this,arguments)||this}var S,R=require$$0,M="mtop.taobao.miniapp.cloud.store.config.get",O="mtop.taobao.miniapp.cloud.store.config.v2.seller.get",I="mtop.taobao.miniapp.cloud.store.file.save",E="mtop.taobao.miniapp.cloud.store.file.v2.seller.save",P="mtop.taobao.miniapp.cloud.store.file.delete",k="mtop.taobao.miniapp.cloud.store.file.v2.seller.delete",T="mtop.taobao.miniapp.cloud.store.file.list",B="mtop.taobao.miniapp.cloud.store.file.v2.seller.list",j="other",D=(t(H,S=A),H.prototype.parseUploadResult=function(e,t,r){return this.parsePostUploadResult(e,t,r)},H.prototype.parsePostUploadResult=function(e,t,r){var n;if(t.data)if(r)try{var o=(s=JSON.parse(t.data)).fileId,i=s.url,a=s.message;}catch(e){console.log(e);}else try{var s=JSON.parse(t.data);switch(e){case"image":case"font":o=s.jsonData.fileId,i=s.jsonData.url,a=s.errorMessage;break;case"video":o=s.fileId,n=s.videoId,i=s.url,a=s.message;break;case"audio":o=s.fileId,n=s.videoId,i=s.url,a=s.message;}}catch(e){}return {imageUrl:i,specialId:o,message:a,videoId:n}},H.prototype.uploadFile=function(p){return c(this,void 0,void 0,function(){var t,r,n,o,i,a,s,c,u,l,d;return f(this,function(e){switch(e.label){case 0:t=p.filePath,i=p.fileType,r=void 0===i?j:i,o=p.fileName,n=void 0===o?"miniappfile":o,i=p.seller,o=void 0!==i&&i,i=p.dirId,e.label=1;case 1:return e.trys.push([1,3,,4]),s=o?O:M,[4,this.storageRequest(s,{newContainer:!0,cloudPath:n,fileType:r,sellerSpace:o,dirId:i})];case 2:return a=e.sent(),[3,4];case 3:throw s=e.sent(),new Error("获取配置错误"+(s.message||s.toString()));case 4:return u=h(a,["data","model",r],{}),l=u.url,c=void 0===l?"":l,l=u.formData,l=void 0===l?null:l,u=u.headers,(c={url:c,fileType:r,header:void 0===u?null:u,formData:l,filePath:t,fileName:"file"}).formData=c.formData||{},c.header&&c.header.Authorization&&(c.formData.Authorization=c.header.Authorization),n&&(c.formData.localFileName=Date.now()+"-"+function(e){if(!e)return "file";var t=e.lastIndexOf("/");return 0<=t?e.substr(t+1):e}(n)),c.header?"image"!==r&&(c.header.origin=c.header.origin||"https://miniapp-cloud.taobao.com",c.header.referer=c.header.referer||"https://miniapp-cloud.taobao.com"):delete c.header,[4,this.storageRequest("my.uploadFile",c)];case 5:if(u=e.sent(),console.log(u),l=this.parseUploadResult(r,u,o),d=l.imageUrl,c=l.specialId,u=l.message,l=l.videoId,!(d={fileType:r,specialId:c||h(a,["data","model",r,"formData","key"],""),videoId:l,url:d,cloudPath:n,sellerSpace:o}).specialId)throw new Error(u||"上传文件失败");return [4,this.storageRequest(o?E:I,d)];case 6:if(!h(d=e.sent(),"data.model.fileId"))throw new Error(h(d,["result","msgInfo"],"上传文件失败"));return [2,h(d,"data.model")]}})})},H.prototype.deleteFile=function(o){return c(this,void 0,void 0,function(){var t,r,n;return f(this,function(e){switch(e.label){case 0:if(r=o.fileId,n=o.fileType,t=void 0===n?j:n,n=o.seller,n=void 0!==n&&n,r=Array.isArray(r)?r:[r],n)throw new Error("商家空间资源不允许使用接口删除");return r=JSON.stringify(r),[4,this.storageRequest(n?k:P,{fileType:t,fileIds:r,sellerSpace:n})];case 1:if(h(n=e.sent(),["data","model"]))return [2,!0];throw new Error(h(n,["data","msgInfo"]))}})})},H.prototype.getTempFileURL=function(n){return c(this,void 0,void 0,function(){var t,r;return f(this,function(e){switch(e.label){case 0:if(t=n.fileId,r=n.seller,r=void 0!==r&&r,!t)throw new Error("缺少fileId,请检查参数");return t=Array.isArray(t)?t:[t],t=JSON.stringify(t),[4,this.storageRequest(r?B:T,{fileIds:t,sellerSpace:r})];case 1:if(t=e.sent(),r=h(t,["data","model"]))return [2,r];throw new Error(h(t,["data","msgInfo"]))}})})},H.prototype.downloadByFileId=function(s){return c(this,void 0,void 0,function(){var t,r,n,o,i,a;return f(this,function(e){switch(e.label){case 0:if(r=s.fileId,t=s.cache,!r)throw new Error("缺少fileId,请检查参数");return r=Array.isArray(r)?r:[r],[4,this.storageRequest(T,{fileIds:JSON.stringify(r)})];case 1:i=e.sent(),n=h(i,["data","model"])||[],o=[],i=0,e.label=2;case 2:return i<n.length?(a=(n[i]||{}).url,[4,this._downloadByUrl(a,t)]):[3,5];case 3:(a=e.sent())&&o.push(a),e.label=4;case 4:return i++,[3,2];case 5:return [2,o]}})})},H.prototype.storageRequest=function(r,n,o){return c(this,void 0,void 0,function(){var t;return f(this,function(e){switch(e.label){case 0:return t="test"===this.options.env?"test":"online",(n=n||{}).env=t,n.sdkVersion=R.version,[4,this.request.exec({url:r,data:n},o)];case 1:return [2,e.sent()]}})})},H.prototype._downloadByUrl=function(n,o){return c(this,void 0,void 0,function(){var t,r;return f(this,function(e){switch(e.label){case 0:return n?o?[4,this.request.proxy.apply({url:"my.getStorage",data:{key:n}})]:[3,2]:[2,null];case 1:if(t=e.sent().data)return [2,t];e.label=2;case 2:return [4,this.request.exec({url:"my.downloadFile",data:{url:n}})];case 3:return r=e.sent().apFilePath,o?[4,this.request.exec({url:"my.setStorage",data:{key:n,data:r}})]:[3,5];case 4:e.sent(),e.label=5;case 5:return [2,r]}})})},r([o()],H.prototype,"uploadFile",null),r([o()],H.prototype,"deleteFile",null),r([o()],H.prototype,"getTempFileURL",null),r([o()],H.prototype,"downloadByFileId",null),H);function H(){return null!==S&&S.apply(this,arguments)||this}var C=(Object.defineProperty(G.prototype,"name",{get:function(){return this._coll},enumerable:!1,configurable:!0}),G.prototype.aggregate=function(r){return c(this,void 0,void 0,function(){var t;return f(this,function(e){switch(e.label){case 0:return Array.isArray(r)||(r=[r]),t={aggregate_pipelines:r,collection_name:this._coll},[4,this._db.dbRequest("miniapp.cloud.db.collection.aggregate",t)];case 1:return [2,e.sent()]}})})},G.prototype.count=function(r){return c(this,void 0,void 0,function(){var t;return f(this,function(e){switch(e.label){case 0:return t={filter:r,collection_name:this._coll},[4,this._db.dbRequest("miniapp.cloud.db.collection.count",t)];case 1:return [2,e.sent()]}})})},G.prototype.deleteMany=function(r){return c(this,void 0,void 0,function(){var t;return f(this,function(e){switch(e.label){case 0:return t={filter:r,collection_name:this._coll},[4,this._db.dbRequest("miniapp.cloud.db.collection.remove",t)];case 1:return [2,e.sent()]}})})},G.prototype.find=function(r,n){return void 0===n&&(n={}),c(this,void 0,void 0,function(){var t;return f(this,function(e){switch(e.label){case 0:return t={displayed_fields:n.projection,order_by:n.sort,skip:n.skip,limit:n.limit,filter:r,collection_name:this._coll},[4,this._db.dbRequest("miniapp.cloud.db.collection.get",t)];case 1:return [2,e.sent()]}})})},G.prototype.replaceOne=function(r,n){return c(this,void 0,void 0,function(){var t;return f(this,function(e){switch(e.label){case 0:return t={filter:r,new_record:n,collection_name:this._coll},[4,this._db.dbRequest("miniapp.cloud.db.collection.replace",t)];case 1:return [2,e.sent()]}})})},G.prototype.insertOne=function(r){return c(this,void 0,void 0,function(){var t;return f(this,function(e){switch(e.label){case 0:return t={record:r,collection_name:this._coll},[4,this._db.dbRequest("miniapp.cloud.db.collection.add",t)];case 1:return [2,e.sent()]}})})},G.prototype.insertMany=function(r){return c(this,void 0,void 0,function(){var t;return f(this,function(e){switch(e.label){case 0:if(t={records:r,collection_name:this._coll},!Array.isArray(r))throw new Error("带插入的数据只能为数组");return [4,this._db.dbRequest("miniapp.cloud.db.collection.addMany",t)];case 1:return [2,e.sent()]}})})},G.prototype.updateMany=function(r,n,o){return c(this,void 0,void 0,function(){var t;return f(this,function(e){switch(e.label){case 0:return t={filter:r,action:n,arrayFilters:o,collection_name:this._coll},[4,this._db.dbRequest("miniapp.cloud.db.collection.update",t)];case 1:return [2,e.sent()]}})})},r([o()],G.prototype,"aggregate",null),r([o()],G.prototype,"count",null),r([o()],G.prototype,"deleteMany",null),r([o()],G.prototype,"find",null),r([o()],G.prototype,"replaceOne",null),r([o()],G.prototype,"insertOne",null),r([o()],G.prototype,"insertMany",null),r([o()],G.prototype,"updateMany",null),G);function G(e,t){this._db=e,this._coll=t;}var U,z=(t(N,U=A),N.prototype.collection=function(e){if(!e)throw new Error("集合名称不能为空");return new C(this,e)},N.prototype.createCollection=function(r,e){return c(this,void 0,void 0,function(){var t;return f(this,function(e){switch(e.label){case 0:return t={collection_name:r},[4,this.dbRequest("miniapp.cloud.db.collection.create",t)];case 1:return [2,e.sent()]}})})},N.prototype.dbRequest=function(r,n){return c(this,void 0,void 0,function(){var t;return f(this,function(e){switch(e.label){case 0:return "test"!==(t=this.options.env)&&(t="online"),n=d(d({},n),{env:t}),this.options.localDebug?[4,this.request.exec({env:t,debugAction:"MONGO_INVOKE",url:"db/"+r,data:n},u.GATEWAY)]:[3,2];case 1:return [2,e.sent()];case 2:return [4,this.request.exec({env:t,url:"db/"+r,data:n},u.GATEWAY)];case 3:return [2,e.sent()]}})})},r([o()],N.prototype,"createCollection",null),N);function N(){return null!==U&&U.apply(this,arguments)||this}var F,W=(t(Y,F=A),Y.prototype.invoke=function(l){return c(this,void 0,void 0,function(){var t,i,a,s,c,u;return f(this,function(e){switch(e.label){case 0:return t=l.data,c=l.headers,i=l.authScope,a=l.api,t=t||{},Object.keys(t).forEach(function(e){t[e]="string"==typeof t[e]?t[e]:JSON.stringify(t[e]);}),a={apiName:a,httpHeaders:c,data:t},[4,this.topRequest(a)];case 1:if(s=e.sent(),!h(s,"error_response"))return [2,s];if(c=h(s,"error_response.code"),(u=my&&my.canIUse("qn.cleanToken"))&&!i&&(i="*"),26!=c&&27!=c&&53!=c||!i)return [3,9];e.label=2;case 2:return (e.trys.push([2,8,,9]),u)?(console.log("call my.qn.cleanToken"),[4,my.qn.cleanToken()]):[3,4];case 3:e.sent(),e.label=4;case 4:return [4,(r=my.authorize,n={scopes:i},r?(n=n||{},new Promise(function(e,t){r.call(o||my,d(d({},n),{success:e,fail:t}));})):Promise.reject("未实现my.api"))];case 5:return [4,e.sent()];case 6:return e.sent(),[4,this.topRequest(a)];case 7:return h(s=e.sent(),"error_response")?[3,9]:[2,s];case 8:return e.sent(),[3,9];case 9:throw new Error(""+JSON.stringify(h(s,"error_response")))}var r,n,o;})})},Y.prototype.topRequest=function(t){return c(this,void 0,void 0,function(){return f(this,function(e){switch(e.label){case 0:return [4,this.request.exec({env:this.options.env||"online",url:"top",data:t},u.GATEWAY)];case 1:return [2,e.sent()]}})})},r([o()],Y.prototype,"invoke",null),Y);function Y(){return null!==F&&F.apply(this,arguments)||this}var K,J=(t(L,K=A),L.prototype.invoke=function(i){return c(this,void 0,void 0,function(){var t,r,n,o;return f(this,function(e){switch(e.label){case 0:return t=i.data,r=i.headers,n=i.api,o=i.targetAppKey,[4,this.qimenRequest({apiName:n,httpHeaders:r,targetAppKey:o,data:t})];case 1:return [2,e.sent()]}})})},L.prototype.qimenRequest=function(t){return c(this,void 0,void 0,function(){return f(this,function(e){switch(e.label){case 0:return [4,this.request.exec({env:this.options.env||"online",url:"qimen",data:t},u.GATEWAY)];case 1:return [2,e.sent()]}})})},r([o()],L.prototype,"invoke",null),L);function L(){return null!==K&&K.apply(this,arguments)||this}var V,X=(t($,V=A),$.prototype.httpRequest=function(s){return c(this,void 0,void 0,function(){var t,r,n,o,i,a;return f(this,function(e){switch(e.label){case 0:return t=s.body,r=s.params,n=s.headers,o=s.path,i=s.method,a=s.exts,[4,this.innerRequest({path:o,headers:n,body:t,queryString:r,method:i,options:Object.assign(a||{},this.options)})];case 1:return [2,e.sent()]}})})},$.prototype.innerRequest=function(t){return c(this,void 0,void 0,function(){return f(this,function(e){switch(e.label){case 0:return [4,this.request.exec({env:this.options.env||"online",url:"cloudHttp",data:t},u.GATEWAY)];case 1:return [2,e.sent()]}})})},r([o()],$.prototype,"httpRequest",null),$);function $(){return null!==V&&V.apply(this,arguments)||this}var Q,Z=require$$0,ee=(t(te,Q=Error),te.prototype.toString=function(){return (this.code||"")+" "+(this.message||"")},te);function te(){return null!==Q&&Q.apply(this,arguments)||this}var re,ne=(t(oe,re=g),oe.getMtopErrorMsg=function(e){var t=new ee;if(!e)return t.code="500",t.message="客户端网络错误,请稍后重试",t;var r,n,o=e.ret&&e.ret[0]&&e.ret[0].split("::");if(e.data=e.data||h(e,["err","data"]),e.data&&e.data.errCode&&(r=e.data.errCode,n=e.data.errMessage||e.data.errMsg),e.data&&e.data.errorCode&&(r=e.data.errorCode),e.data&&e.data.errorMessage&&(n=e.data.errorMessage),e.data&&e.data.errorPage)try{if(my&&my.tb&&my.tb.showErrorView)return my.tb.showErrorView({reason:e.data.errorPage.reason,message:e.data.errorPage.message,action:e.data.errorPage.action,icon:e.data.errorPage.icon}),t;delete e.data.errorPage;}catch(e){}return e.data&&e.data.success||o&&"SUCCESS"===o[0]&&!r?void 0:(r=r||(o&&"FAIL_SYS_SESSION_EXPIRED"===o[0]?"904":"500"),n=n||o&&o[1]||"客户端网络错误,请稍后重试",t.code=r,t.message=n,t)},oe.GATEWAY_APIS={"db/miniapp.cloud.db.collection.create":"mtop.taobao.dataproxy.collection.create","db/miniapp.cloud.db.index.create":"mtop.taobao.dataproxy.index.create","db/miniapp.cloud.db.collection.aggregate":"mtop.taobao.dataproxy.record.aggregate","db/miniapp.cloud.db.collection.count":"mtop.taobao.dataproxy.record.count","db/miniapp.cloud.db.collection.remove":"mtop.taobao.dataproxy.record.delete","db/miniapp.cloud.db.collection.get":"mtop.taobao.dataproxy.record.select","db/miniapp.cloud.db.collection.replace":"mtop.taobao.dataproxy.record.replace","db/miniapp.cloud.db.collection.add":"mtop.taobao.dataproxy.record.insert","db/miniapp.cloud.db.collection.addMany":"mtop.taobao.dataproxy.record.batch.insert","db/miniapp.cloud.db.collection.update":"mtop.taobao.dataproxy.record.update",fc:"mtop.miniapp.cloud.invoke.fc",top:"mtop.miniapp.cloud.invoke.top",qimen:"mtop.miniapp.cloud.invoke.qimen.cloud",cloudHttp:"mtop.miniapp.cloud.application.request"},oe);function oe(){var e=null!==re&&re.apply(this,arguments)||this;return e.sendMtop=function(t,o,i){return c(e,void 0,void 0,function(){return f(this,function(e){return [2,new Promise(function(r,n){var e;1024e3<=o.length?((e=new ee).code="500",e.message="本次请求内容过长，请控制在1M以内",n(e)):(console.log("sendMtop ",o),my.sendMtop(d(d({api:t,v:"1.0",data:o,method:"POST",needLogin:!0,sessionOption:"AutoLoginAndManualLogin"},i),{success:function(e){var t=oe.getMtopErrorMsg(e);t?n(t):r(e);},fail:function(e){console.log("sendMtop error",e),n(oe.getMtopErrorMsg(e));}})));})]})})},e.invokeMyApi=function(r,n){return c(e,void 0,void 0,function(){return f(this,function(e){return [2,new Promise(function(e,t){return r=r.replace(/^my\./,""),my[r](d(d({},n),{success:e,fail:t}))})]})})},e.apply=function(a,s){return c(e,void 0,void 0,function(){var t,r,n,o,i;return f(this,function(e){switch(e.label){case 0:return t=a.url,r=a.data,n=a.headers,o=a.mtopOptions,s!==u.MTOP?[3,2]:[4,this.sendMtop(t,r,o)];case 1:return [2,e.sent()];case 2:if(s!==u.GATEWAY)return [3,7];e.label=3;case 3:return e.trys.push([3,5,,6]),a.rawData&&Object.keys(a.rawData).forEach(function(e){"object"==typeof a.rawData[e]&&(a.rawData[e]=JSON.stringify(a.rawData[e]));}),[4,this.sendMtop(oe.GATEWAY_APIS[t],d(d({},a.rawData),{sdkVersion:Z.version,protocols:JSON.stringify(n)}),o)];case 4:return i=e.sent(),(i=i&&i.data||{}).errCode?[2,{headers:{"mc-code":i.errCode,"mc-msg":i.errMessage},data:{}}]:[2,{headers:{"mc-code":200,"mc-msg":"请求成功"},data:h(i,["data"])||{}}];case 5:return (i=e.sent())&&i.code?[2,{headers:{"mc-code":i.code,"mc-msg":i.message}}]:[2,{headers:{"mc-code":500,"mc-msg":i.message||i}}];case 6:return [3,9];case 7:return [4,this.invokeMyApi(t,r)];case 8:return [2,e.sent()];case 9:return [2]}})})},e}ie.prototype.init=function(o,i){return c(this,void 0,void 0,function(){var r,n;return f(this,function(e){switch(e.label){case 0:return e.trys.push([0,2,,3]),t=o.env,r="string"==typeof(t=t||"online")?{database:t,file:t,function:t,message:t}:(t.database=t.database||"online",t.file=t.file||"online",t.function=t.function||"online",t.message=t.message||"online",t),n=new b,this.db=new z({env:r.database},n),this.function=new x(d(d({},o),{env:r.function}),n),this.file=new D({env:r.file},n),this.qimenApi=new J({env:r.database},n),this.topApi=new W({env:r.database},n),this.application=new X(d(d({},o),{env:r.database}),n),[4,n.init(d({},o),i||new ne({gatewayUrl:o.__gatewayUrl}))];case 1:return e.sent(),[2,!0];case 2:return n=e.sent(),console.error("SDK初始化失败 ",n),[3,3];case 3:return [2,!1]}var t;})})},A=ie;function ie(){}g=new A;e.Cloud=A,e.default=g,Object.defineProperty(e,"__esModule",{value:!0});});
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
                return axios.post(this.host, config);
            }
            else {
                return axios.post(this.host_test, config);
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
