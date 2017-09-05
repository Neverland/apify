(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.aqua = factory());
}(this, (function () { 'use strict';

var babelHelpers = {};




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
 * @file constants
 * @author ienix(enix@foxmail.com)
 *
 * @since 2017/9/5
 */

var GET$1 = 'GET';
var POST$1 = 'POST';
var DELETE = 'DELETE';
var PUT = 'PUT';

var METHOD$1 = {
    GET: GET$1,
    POST: POST$1,
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
var CREDENTIALS$1 = {
    credentials: 'same-origin'
};

var X_OPTION$1 = {
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

var constants = _extends({}, {
    timeout: FETCH_TIMEOUT,
    xOptionEnum: X_OPTION_ENUM$1,
    headers: HEADERS,
    METHOD: METHOD$1,
    X_OPTION_ENUM: X_OPTION_ENUM$1,
    credentials: CREDENTIALS$1,
    dataType: DATA_TYPE
}, X_OPTION$1);
module.exports = exports['default'];



var defaultConfig = Object.freeze({
	default: constants
});

/**
 * @file request
 * @author ienix(enix@foxmail.com)
 *
 * @since 2017/9/5
 */

var X_OPTION_ENUM = undefined;

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

var sendRequest = function sendRequest() {
    var method = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'POST';
    var uri = arguments[1];
    var data = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var option = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

    option = _extends({}, defaultConfig, option);

    if ('json' !== option.dataType.toLocaleLowerCase()) {
        return Promise.reject(option.errorHanlder({ success: false, message: 'Data type doesn\'t support!' }));
    }

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

    /**
     * 合并默认配置和自定义配置
     */

    option = assign({}, X_OPTION, option);

    var uiLoading = void 0;
    // 启用loading
    if (option[silent] === false) {
        uiLoading = loading();
    }

    var xTimeout = option[timeout];
    var hideLoading = function hideLoading() {
        uiLoading && uiLoading.then(function (vm) {
            vm.hideUi();
            vm.$destroy(true);
        });
    };

    delete option[silent];
    delete option[timeout];
    delete option[message];

    // 合并payload
    var payload = assign({}, { method: method }, { headers: headers }, { body: data }, CREDENTIALS, option);

    return new Promise(function (resolve, reject) {
        var networkTimeout = setTimeout(function () {}, xTimeout);

        return fetch(uri, payload).then(function (response) {
            /**
             * 1.这里有数据返回，先关闭掉loading。
             * 2.在根据情况出来response
             */
            hideLoading();
            clearTimeout(networkTimeout);

            if (response.status !== 200) {
                return reject(response);
            }

            return response.json().then(function (json) {
                return resolve(json);
            });
        }).catch(function (error) {
            // hook error

            // 404, 500 ...
            return reject(error);
        });
    });
};

var request = {};

/**
 * post
 *
 * @param {string} uri
 * @param {?Object} data - 提交的数据
 * @param {?Object} option - 可以覆盖 fetch api的配置
 * @return {Promise}
 */

request.post = function (uri, data, option) {
    return sendRequest(POST, uri, data, option);
};

/**
 * get
 *
 * 提供一个简单的get,规范中的请求都应该由post方式发送
 *
 * @param {string} uri
 * @param {string} data -  fromData
 * @param {?Object} option - 可以覆盖 fetch api的配置
 * @return {Promise}
 */

request.get = function (uri) {
    var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
    var option = arguments[2];

    if (u.isObject(data) && !u.isEmpty(data)) {

        data = queryString.stringify(data);
    }

    if (data.length !== 0 && uri.indexOf('?') === -1) {
        uri += '?';
    }

    uri += data;

    var param = assign({}, { method: GET }, option);

    return fetch(uri, { param: param });
};

module.exports = exports['default'];

return request;

})));
