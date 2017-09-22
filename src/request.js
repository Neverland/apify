/**
 * @file request
 * @author ienix(enix@foxmail.com)
 *
 * @since 2017/9/5
 */

/* global fetch */
/* global deepAssign */
/* global Promise */
/* global queryString */
/* global deepAssign */

import u from 'underscore';
import queryString from 'query-string';
import deepAssign from 'deep-assign';

import util from './util';

import defaultConfig from './constants';
import handlers from './config/handler';
import hooks from './config/hook';
import fetchOptionList from './config/fetchOptionList';

let {X_OPTION_ENUM, METHOD} = defaultConfig;

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

function sendRequest(method = 'POST', uri, data = {}, option = {}) {
    let {hook = {}, handler = {}} = option;

    hook = Object.assign({}, hooks, hook);
    handler = Object.assign({}, handlers, handler);
    option = deepAssign({}, defaultConfig, {handler}, {hook}, option);

    if ('json' !== option.dataType.toLocaleLowerCase()) {
        return Promise.reject(handler.error({success: false, message: 'Data type doesn\'t support!'}));
    }

    let globalHook = option.hook;

    /**
     * 从枚举获取真实key
     *
     * 'x-silent',
     * 'x-message',
     * 'x-timeout'
     *
     */
    let {silent, message, timeout} = X_OPTION_ENUM;
    let xTimeout = option[timeout];

    /**
     * hook: beforeRequest
     */
    globalHook.beforeRequest(option);

    let payload = sendRequest.getPayload(method, data, option);


    let promise = new Promise((resolve, reject) => {
        let networkTimeout = setTimeout(() => {
            /**
             * hook: beforeRequest
             */
            globalHook.timeout();

            return reject(handler.error({type: false, message: 'network timeout!', data: {}}, promise));
        }, xTimeout);

        if (!fetch) {
            let data = {type: false, message: 'The fetch is not defined!', data: {}};
            let result = handler.error(data, promise);

            return reject(result);
        }

        return fetch(uri, payload)
            .then(response => {
                if (response.status !== 200) {
                    clearTimeout(networkTimeout);
                    return reject(response);
                }

                /**
                 * hook: afterSuccessRequest()
                 */
                globalHook.requestSuccess();

                return response.json()
                    .then(json => {
                        let data = {success: false, message: 'success', data: json};
                        let result = handler.success(data, promise);

                        if (util.isPromise(result)) {
                            return result;
                        }

                        return resolve(result || data);
                    });
            })
            .catch(error => {
                let result = {};
                let {status = {}, statusText = 'Error'} = error;

                /**
                 * hook: requestFail()
                 */
                globalHook.requestFail();

                // 404, 500 ...
                if (status && status !== 200) {
                    let data = {success: false, message: statusText, data: error};

                    result = handler.error(data, promise);

                    if (util.isPromise(result)) {
                        return result;
                    }
                }

                return reject(result);
            });
    });

    return promise;
}

sendRequest.getPayload = (method, data, option) => {
    let {credentials, headers, hook} = option;

    if ('string' !== typeof data) {
        data = JSON.stringify(data);
    }

    let fetchOption = u.pick(option, fetchOptionList);

    data = Object.assign(
        {},
        {method},
        {headers: new Headers(headers)},
        {body: data},
        credentials,
        fetchOption
    );

    /**
     * hook: beforeRequest
     */
    return hook.payload(data);
};

let request = {};

/**
 * post
 *
 * @param {string} uri
 * @param {?Object} data - 提交的数据
 * @param {?Object} option - 可以覆盖 fetch api的配置
 * @return {Promise}
 */

request.post = (uri, data, option) => {
    return sendRequest(METHOD.POST, uri, data, option);
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

request.get = (uri, data = '', option) => {
    if (u.isObject(data)
        && !u.isEmpty(data)) {

        data = queryString.stringify(data);
    }

    if (data.length !== 0
        && uri.indexOf('?') === -1) {
        uri += '?';
    }

    uri += data;

    let param = Object.assign({}, {method: METHOD.GET}, option);

    return fetch(uri, {param});
};

// let put
// let delete

export default request;
