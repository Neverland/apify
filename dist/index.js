(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('whatwg-fetch'), require('underscore'), require('deep-assign'), require('query-string')) :
  typeof define === 'function' && define.amd ? define(['whatwg-fetch', 'underscore', 'deep-assign', 'query-string'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global['i-apify'] = factory(null, global.u, global['deepAssign:'], global.queryString));
}(this, (function (whatwgFetch, u, deepAssign, queryString) { 'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var u__default = /*#__PURE__*/_interopDefaultLegacy(u);
  var deepAssign__default = /*#__PURE__*/_interopDefaultLegacy(deepAssign);
  var queryString__default = /*#__PURE__*/_interopDefaultLegacy(queryString);

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  /**
   * @file util
   * @author ienix(enix@foxmail.com)
   *
   * @since 2017/9/6
   */
  var util = {
    isPromise: function isPromise(obj) {
      return Object.prototype.toString.call(obj) === '[object Promise]' || !!obj && ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' || typeof obj === 'function') && typeof obj.constructor === 'function' && !Object.hasOwnProperty.call(obj, 'constructor') && obj.constructor.name === 'Promise';
    }
  };

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
  var METHOD = {
    GET: GET,
    POST: POST,
    DELETE: DELETE,
    PUT: PUT
  };
  /**
   * @const FETCH_TIMEOUT - 5s
   */

  var FETCH_TIMEOUT = 1000 * 5;
  var X_OPTION_ENUM = {
    silent: 'x-silent',
    message: 'x-message',
    timeout: 'x-timeout'
  };
  /**
   * @const same-origin 只有同源有这个配置才能传递cookie
   */

  var CREDENTIALS = 'omit';
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
  var defaultConfig = Object.assign({}, {
    timeout: FETCH_TIMEOUT,
    headers: HEADERS,
    credentials: CREDENTIALS,
    dataType: DATA_TYPE,
    X_OPTION_ENUM: X_OPTION_ENUM,
    METHOD: METHOD
  }, X_OPTION);

  /**
   * @file handler
   * @author ienix(enix@foxmail.com)
   *
   * @since 2017/9/5
   */
  var handlers = {
    success: function success(data) {
      return data;
    },
    error: function error(data) {
      return data;
    },
    payload: function payload(data) {
      return data;
    }
  };

  /**
   * @file hook
   * @author ienix(enix@foxmail.com)
   *
   * @since 2017/9/6
   */
  var hooks = {
    beforeRequest: function beforeRequest() {},
    timeout: function timeout() {},
    requestSuccess: function requestSuccess() {},
    afterParse: function afterParse() {},
    requestFail: function requestFail() {}
  };

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

  /**
   * @file request
   * @author ienix(enix@foxmail.com)
   *
   * @since 2017/9/5
   */
  var X_OPTION_ENUM$1 = defaultConfig.X_OPTION_ENUM,
      METHOD$1 = defaultConfig.METHOD;
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
    var uri = arguments.length > 1 ? arguments[1] : undefined;
    var data = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var option = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
    var _option = option,
        _option$hook = _option.hook,
        hook = _option$hook === void 0 ? {} : _option$hook,
        _option$handler = _option.handler,
        handler = _option$handler === void 0 ? {} : _option$handler;
    hook = Object.assign({}, hooks, hook);
    handler = Object.assign({}, handlers, handler);
    option = deepAssign__default['default']({}, defaultConfig, {
      handler: handler
    }, {
      hook: hook
    }, option);

    if (!option.METHOD[method]) {
      return Promise.reject(handler.error({
        success: false,
        message: "The ".concat(method, " type doesn't support!")
      }, option));
    }

    method = option.METHOD[method];
    option = Object.assign({}, option, {
      'x-uri': uri,
      'x-method': method
    });

    if ('json' !== option.dataType.toLocaleLowerCase()) {
      return Promise.reject(handler.error({
        success: false,
        message: 'Data type doesn\'t support!'
      }, option));
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

    var timeout = X_OPTION_ENUM$1.timeout;
    var xTimeout = option[timeout];
    /**
     * hook: beforeRequest
     */

    globalHook.beforeRequest(option);
    return new Promise(function (resolve, reject) {
      var networkTimeout = setTimeout(function () {
        /**
         * hook: timeout
         */
        globalHook.timeout(option);
        return reject(handler.error({
          type: false,
          message: 'network timeout!',
          data: {}
        }, option));
      }, xTimeout);

      if (!fetch) {
        var _data = {
          type: false,
          message: 'The fetch is not defined!',
          data: {}
        };
        /**
         * handler: error()
         */

        var result = handler.error(_data, option);
        return reject(result);
      }

      var payload = sendRequest.getPayload(method, data, option);
      return fetch(option['x-uri'], payload).then(function (response) {
        sendRequest.clearTimeout(networkTimeout);

        if (response.status !== 200) {
          return Promise.reject(response);
        }
        /**
         * hook: requestSuccess()
         */


        globalHook.requestSuccess(option, response);
        return response.json();
      }).then(function (json) {
        var data = json || {};
        /**
         * hook: afterParse()
         */

        globalHook.afterParse(option, data);
        /**
         * handler: success()
         */

        var result = handler.success(data, option);

        if (util.isPromise(result)) {
          return result;
        }

        return resolve(data);
      })["catch"](function (error) {
        var result = {};
        var _error$status = error.status,
            status = _error$status === void 0 ? {} : _error$status,
            _error$statusText = error.statusText,
            _error$message = error.message;
        sendRequest.clearTimeout(networkTimeout);
        /**
         * hook: requestFail()
         */

        globalHook.requestFail(option, error); // 404, 500 ...

        if (status && status !== 200) {
          /**
           * handler: error()
           */
          result = handler.error(error, option);

          if (util.isPromise(result)) {
            return result;
          }
        }

        return reject(error);
      });
    });
  }
  /**
   * 获取最终payload
   *
   * @param {string} method - http method
   * @param {string} data - 配置加数据产生的fetch option
   * @param {Promise} promise - fetch 实例
   */


  sendRequest.getPayload = function (method, data, option) {
    var credentials = option.credentials,
        headers = option.headers;

    if ('string' !== typeof data) {
      data = JSON.stringify(data, function (key, value) {
        if (undefined === value) {
          return null;
        }

        return value;
      });
    }

    var fetchOption = u__default['default'].pick(option, fetchOptionList);
    data = Object.assign({}, {
      method: method
    }, {
      headers: headers
    }, {
      body: data
    }, {
      credentials: credentials
    }, fetchOption);

    if ('GET' === method) {
      delete data.body;
    }
    /**
     * handler: payload()
     */


    return option.handler.payload(data, option) || data;
  };

  sendRequest.clearTimeout = function (timeout) {
    return clearTimeout(timeout);
  };

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

  /**
   * @file get
   * @author ienix(enix@foxmail.com)
   *
   * @since 2017/9/25
   */
  /**
   * get
   *
   * @param {string} uri
   * @param {string} data -  fromData
   * @param {?Object} option - 可以覆盖 fetch api的配置
   * @return {Promise}
   */

  var get = (function (uri) {
    var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var option = arguments.length > 2 ? arguments[2] : undefined;

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
      search = queryString__default['default'].parse(temp[1]);
    }

    var payload = Object.assign({}, search, data);
    var query = queryString__default['default'].stringify(payload);

    if (query) {
      uri = "".concat(pureUri, "?").concat(query);
    }

    return sendRequest('GET', uri, '', option);
  });

  /**
   * @file index
   * @author ienix(enix@foxmail.com)
   *
   * @since 2017/9/25
   */
  var request = {
    get: get,
    post: post
  };

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
  function apify (sendRequest) {
    var apis = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var configure = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    apis = Object.assign({}, apis);
    var all = Object.keys(apis || {});
    all.forEach(function (key) {
      var origin = Object.assign(apis[key]);

      apis[key] = function (options, config) {
        var param = Object.assign({}, options);
        return sendRequest(origin, param, Object.assign({}, configure, config));
      };

      apis[key].origin || (apis[key].origin = origin);

      apis[key].getUrl = function () {
        return origin.toString();
      };
    });
    return apis || {};
  }

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

  return index;

})));
//# sourceMappingURL=index.js.map
