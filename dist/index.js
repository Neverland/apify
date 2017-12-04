(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('underscore'), require('deep-assign'), require('detect-node'), require('query-string')) :
	typeof define === 'function' && define.amd ? define(['underscore', 'deep-assign', 'detect-node', 'query-string'], factory) :
	(global['i-apify'] = factory(global.u,global['deepAssign:'],global.isNode,global.queryString));
}(this, (function (u,deepAssign,isNode,queryString) { 'use strict';

u = u && u.hasOwnProperty('default') ? u['default'] : u;
deepAssign = deepAssign && deepAssign.hasOwnProperty('default') ? deepAssign['default'] : deepAssign;
isNode = isNode && isNode.hasOwnProperty('default') ? isNode['default'] : isNode;
queryString = queryString && queryString.hasOwnProperty('default') ? queryString['default'] : queryString;

/**
 * @file fetch
 * @author ienix(enix@foxmail.com)
 *
 * @since 2017/12/4
 */

var fetch = void 0;

/**
 * in node runtime
 */
if (isNode) {
  fetch = require('node-fetch');
}
/**
 * in browser runtime
 */

else {
    require('whatwg-fetch');
    fetch = window.fetch;
  }

var fetch$1 = fetch;
module.exports = exports['default'];

var babelHelpers = {};
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};





var asyncGenerator = function () {
  function AwaitValue(value) {
    this.value = value;
  }

  function AsyncGenerator(gen) {
    var front, back;

    function send(key, arg) {
      return new Promise(function (resolve, reject) {
        var request = {
          key: key,
          arg: arg,
          resolve: resolve,
          reject: reject,
          next: null
        };

        if (back) {
          back = back.next = request;
        } else {
          front = back = request;
          resume(key, arg);
        }
      });
    }

    function resume(key, arg) {
      try {
        var result = gen[key](arg);
        var value = result.value;

        if (value instanceof AwaitValue) {
          Promise.resolve(value.value).then(function (arg) {
            resume("next", arg);
          }, function (arg) {
            resume("throw", arg);
          });
        } else {
          settle(result.done ? "return" : "normal", result.value);
        }
      } catch (err) {
        settle("throw", err);
      }
    }

    function settle(type, value) {
      switch (type) {
        case "return":
          front.resolve({
            value: value,
            done: true
          });
          break;

        case "throw":
          front.reject(value);
          break;

        default:
          front.resolve({
            value: value,
            done: false
          });
          break;
      }

      front = front.next;

      if (front) {
        resume(front.key, front.arg);
      } else {
        back = null;
      }
    }

    this._invoke = send;

    if (typeof gen.return !== "function") {
      this.return = undefined;
    }
  }

  if (typeof Symbol === "function" && Symbol.asyncIterator) {
    AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
      return this;
    };
  }

  AsyncGenerator.prototype.next = function (arg) {
    return this._invoke("next", arg);
  };

  AsyncGenerator.prototype.throw = function (arg) {
    return this._invoke("throw", arg);
  };

  AsyncGenerator.prototype.return = function (arg) {
    return this._invoke("return", arg);
  };

  return {
    wrap: function (fn) {
      return function () {
        return new AsyncGenerator(fn.apply(this, arguments));
      };
    },
    await: function (value) {
      return new AwaitValue(value);
    }
  };
}();















var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};





































babelHelpers;

/**
 * @file util
 * @author ienix(enix@foxmail.com)
 *
 * @since 2017/9/6
 */

var util = {
    isPromise: function isPromise(obj) {
        return Object.prototype.toString.call(obj) === '[object Promise]' || !!obj && ((typeof obj === 'undefined' ? 'undefined' : typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' || typeof obj === 'function') && typeof obj.constructor === 'function' && !Object.hasOwnProperty.call(obj, 'constructor') && obj.constructor.name === 'Promise';
    }
};
module.exports = exports['default'];

/**
 * @file constants
 * @author ienix(enix@foxmail.com)
 *
 * @since 2017/9/5
 */

var GET = 'GET';
var POST = 'POST';
var DELETE = 'DELETE';
var PUT = 'PUT';

var METHOD$1 = {
    GET: GET,
    POST: POST,
    DELETE: DELETE,
    PUT: PUT
};

/**
 * @const FETCH_TIMEOUT - 5s
 */
var FETCH_TIMEOUT = 1000 * 5;

var X_OPTION_ENUM$1 = {
    silent: 'x-silent',
    message: 'x-message',
    timeout: 'x-timeout'
};

/**
 * @const same-origin 只有同源有这个配置才能传递cookie
 */
var CREDENTIALS = {
    credentials: 'same-origin'
};

var X_OPTION = {
    // 用于控制 ui loading
    'x-silent': false,
    // 用于控制 ui dialog 抛出的全局信息
    'x-message': true,
    // 用于控制 ui dialog 抛出的全局信息
    'x-timeout': FETCH_TIMEOUT
};

var HEADERS = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
};

var DATA_TYPE = 'json';

var defaultConfig = _extends({}, {
    timeout: FETCH_TIMEOUT,
    headers: HEADERS,
    credentials: CREDENTIALS,
    dataType: DATA_TYPE,
    X_OPTION_ENUM: X_OPTION_ENUM$1,
    METHOD: METHOD$1
}, X_OPTION);
module.exports = exports['default'];

/**
 * @file handler
 * @author ienix(enix@foxmail.com)
 *
 * @since 2017/9/5
 */

var handlers = {
    success: function success(data, promise) {
        return data;
    },
    error: function error(data, promise) {
        return data;
    }
};
module.exports = exports["default"];

/**
 * @file hook
 * @author ienix(enix@foxmail.com)
 *
 * @since 2017/9/6
 */

var hooks = {
    beforeRequest: function beforeRequest() {},
    payload: function payload(option, data) {
        return data;
    },
    timeout: function timeout() {},
    requestSuccess: function requestSuccess() {},
    requestFail: function requestFail() {}
};
module.exports = exports["default"];

/**
 * @file fetchOption
 * @author ienix(enix@foxmail.com)
 *
 * @since 2017/9/6
 */

var fetchOptionList = ['method', // GET/POST等
'headers', // 一个普通对象，或者一个 Headers 对象
'body', // 传递给服务器的数据，可以是字符串/Buffer/Blob/FormData，如果方法是 GET/HEAD，则不能有此参数
'mode', // cors / no-cors / same-origin， 是否跨域，默认是 no-cors
'credentials', // omit / same-origin / include
'cache', // default / no-store / reload / no-cache / force-cache / only-if-cached
'redirect', // follow / error / manual
'referrer', // no-referrer / client / 或者一个url
'referrerPolicy', // no-referrer / no-referrer-when-downgrade / origin /  origin-when-cross-origin / unsafe-url
'integrity' // 资源完整性验证
];
module.exports = exports['default'];

/**
 * @file request
 * @author ienix(enix@foxmail.com)
 *
 * @since 2017/9/5
 */

/* global fetch, Promise */

var X_OPTION_ENUM = defaultConfig.X_OPTION_ENUM;

/**
 * sendRequest
 *
 * option 中的配置可以覆盖默认配置
 * 如x-silent配置为true那么就不启用loading
 *
 * @param {string} method - POST|GET|PUT|DELETE
 * @param {string} uri - uri
 * @param {?Object} data - payload
 * @param {Object} option - custom option
 * @return {Promise}
 */

function sendRequest() {
    var method = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'POST';
    var uri = arguments[1];
    var data = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var option = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
    var _option = option,
        _option$hook = _option.hook,
        hook = _option$hook === undefined ? {} : _option$hook,
        _option$handler = _option.handler,
        handler = _option$handler === undefined ? {} : _option$handler;


    hook = _extends({}, hooks, hook);
    handler = _extends({}, handlers, handler);
    option = deepAssign({}, defaultConfig, { handler: handler }, { hook: hook }, option);

    if (!option.METHOD[method]) {
        return Promise.reject(handler.error({ success: false, message: 'The ' + method + ' type doesn\'t support!' }));
    }

    method = option.METHOD[method];
    option = _extends({}, option, {
        'x-uri': uri,
        'x-method': method
    });

    if ('json' !== option.dataType.toLocaleLowerCase()) {
        return Promise.reject(handler.error({ success: false, message: 'Data type doesn\'t support!' }));
    }

    var globalHook = option.hook;

    /**
     * 从枚举获取真实key
     *
     * 'x-silent',
     * 'x-message',
     * 'x-timeout'
     *
     */
    var silent = X_OPTION_ENUM.silent,
        message = X_OPTION_ENUM.message,
        timeout = X_OPTION_ENUM.timeout;

    var xTimeout = option[timeout];

    /**
     * hook: beforeRequest
     */
    globalHook.beforeRequest(option);

    var payload = sendRequest.getPayload(method, data, option);
    var promise = new Promise(function (resolve, reject) {
        var networkTimeout = setTimeout(function () {
            /**
             * hook: timeout
             */
            globalHook.timeout(option);

            return reject(handler.error({ type: false, message: 'network timeout!', data: {} }, promise));
        }, xTimeout);

        if (!fetch$1) {
            var _data = { type: false, message: 'The fetch is not defined!', data: {} };
            var result = handler.error(_data, promise);

            return reject(result);
        }
        return fetch$1(uri, payload).then(function (response) {
            if (response.status !== 200) {
                sendRequest.clearTimeout(networkTimeout);
                return reject(response);
            }
            /**
             * hook: requestSuccess()
             */
            globalHook.requestSuccess(option, response);

            return response.json();
        }).then(function (json) {
            var data = { success: false, message: 'success', data: json };
            var result = handler.success(data, option, promise);

            if (util.isPromise(result)) {
                return result;
            }

            return resolve(result || data);
        }).catch(function (error) {
            var result = {};
            var _error$status = error.status,
                status = _error$status === undefined ? {} : _error$status,
                _error$statusText = error.statusText,
                statusText = _error$statusText === undefined ? '' : _error$statusText,
                _error$message = error.message,
                message = _error$message === undefined ? '' : _error$message;


            sendRequest.clearTimeout(networkTimeout);

            /**
             * hook: requestFail()
             */
            globalHook.requestFail(option, error);

            // 404, 500 ...
            if (status && status !== 200) {
                var _data2 = { success: false, message: statusText || message || 'Error', data: error };

                result = handler.error(_data2, option, promise);

                if (util.isPromise(result)) {
                    return result;
                }
            }

            return reject(error);
        });
    });

    return promise;
}

sendRequest.getPayload = function (method, data, option) {
    var credentials = option.credentials,
        headers = option.headers,
        hook = option.hook;


    if ('string' !== typeof data) {
        data = JSON.stringify(data);
    }

    var fetchOption = u.pick(option, fetchOptionList);

    data = _extends({}, { method: method }, { headers: headers }, { body: data }, credentials, fetchOption);

    if ('GET' === method) {
        delete data.body;
    }

    /**
     * hook: payload
     */
    return hook.payload(option, data);
};

sendRequest.clearTimeout = function (timeout) {
    clearTimeout(timeout);
};

module.exports = exports['default'];

/**
 * @file post
 * @author ienix(enix@foxmail.com)
 *
 * @since 2017/9/25
 */

/**
 * post
 *
 * @param {string} uri
 * @param {?Object} data - 提交的数据
 * @param {?Object} option - 可以覆盖 fetch api的配置
 * @return {Promise}
 */

var post = (function (uri, data, option) {
  return sendRequest('POST', uri, data, option);
});
module.exports = exports['default'];

/**
 * @file get
 * @author ienix(enix@foxmail.com)
 *
 * @since 2017/9/25
 */

/* global queryString */

/**
 * get
 *
 * @param {string} uri
 * @param {string} data -  fromData
 * @param {?Object} option - 可以覆盖 fetch api的配置
 * @return {Promise}
 */

var get$1 = (function (uri) {
  var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var option = arguments[2];

  /**
   * @property {Object} search - 用于收集uri上的search
   */
  var search = {};
  /**
   * @property {string} pureUri - 用于存储除search外的根链接
   */
  var pureUri = uri;
  /**
   * @property {string} hasSearch - 用于标示uri中是否有`search`
   */
  var hasSearch = uri.indexOf('?') > -1;

  if (hasSearch) {
    var temp = uri.split('?');

    pureUri = temp[0];
    search = queryString.parse(temp[1]);
  }

  var payload = _extends({}, search, data);
  var query = queryString.stringify(payload);

  if (query) {
    uri = pureUri + '?' + query;
  }

  return sendRequest('GET', uri, '', option);
});
module.exports = exports['default'];

/**
 * @file index
 * @author ienix(enix@foxmail.com)
 *
 * @since 2017/9/25
 */

var request = {
  get: get$1,
  post: post
};
module.exports = exports['default'];

/**
 * @file apify
 * @author ienix(enix@foxmail.com)
 *
 * @since 2017/9/6
 */

/**
 * 使api url function 化
 *
 * e.g
 *
 *  const API_CONFIG = {
 *      postCode: '/api/post/code',
 *      postAuth: '/api/post/auth'
 *  }
 *
 *  api = apify(API_CONFIG);
 *
 *  api.postCode({})
 *      .then()
 *      .fail();
 */

/**
 * apify
 *
 * @param {Function} sendRequest 发送请求的函数
 * @param {Object} apis - 静态uri映射map
 * @param {Object} configure - 可以覆盖 fetch api的配置
 * @return {Object}
 */
var apify = function (sendRequest) {
  var apis = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var configure = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  apis = _extends({}, apis);

  var all = Object.keys(apis || {});

  all.forEach(function (key) {
    var origin = _extends(apis[key]);

    apis[key] = function (options, config) {
      var param = _extends({}, options);

      return sendRequest(origin, param, _extends({}, configure, config));
    };

    apis[key].origin || (apis[key].origin = origin);

    apis[key].getUrl = function () {
      return origin.toString();
    };
  });

  return apis || {};
};
module.exports = exports["default"];

/**
 * @file index
 * @author ienix(enix@foxmail.com)
 *
 * @since 2017/9/6
 */

var index = {
  request: request,
  apify: apify
};
module.exports = exports['default'];

return index;

})));
