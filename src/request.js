/**
 * @file request
 * @author ienix(enix@foxmail.com)
 *
 * @since 2017/9/5
 */

/* global fetch, Promise */

import u from 'underscore';
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

    if (!option.METHOD[method]) {
        return Promise.reject(handler.error({success: false, message: `The ${method} type doesn\'t support!`}, option));
    }

    method = option.METHOD[method];
    option = Object.assign({}, option, {
        'x-uri': uri,
        'x-method': method
    });

    if ('json' !== option.dataType.toLocaleLowerCase()) {
        return Promise.reject(handler.error({success: false, message: 'Data type doesn\'t support!'}, option));
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
    let {timeout} = X_OPTION_ENUM;
    let xTimeout = option[timeout];

    /**
     * hook: beforeRequest
     */
    globalHook.beforeRequest(option);

    return new Promise((resolve, reject) => {
        let networkTimeout = setTimeout(() => {
            /**
             * hook: timeout
             */
            globalHook.timeout(option);

            return reject(handler.error({type: false, message: 'network timeout!', data: {}}, option));
        }, xTimeout);

        if (!fetch) {
            let data = {type: false, message: 'The fetch is not defined!', data: {}};
            /**
             * handler: error()
             */
            let result = handler.error(data, option);

            return reject(result);
        }

        let payload = sendRequest.getPayload(method, data, option);

        return fetch(uri, payload)
            .then(response => {
                sendRequest.clearTimeout(networkTimeout);

                if (response.status !== 200) {
                    return Promise.reject(response);
                }
                /**
                 * hook: requestSuccess()
                 */
                globalHook.requestSuccess(option, response);

                return response.json();
            })
            .then(json => {
                let data = {success: false, message: 'success', data: json};

                /**
                 * hook: afterParse()
                 */
                globalHook.afterParse(option, data);

                /**
                 * handler: success()
                 */
                let result = handler.success(data, option);

                if (util.isPromise(result)) {
                    return result;
                }

                return resolve(result || data);
            })
            .catch(error => {
                let result = {};
                let {status = {}, statusText = '', message = ''} = error;

                sendRequest.clearTimeout(networkTimeout);

                /**
                 * hook: requestFail()
                 */
                globalHook.requestFail(option, error);

                // 404, 500 ...
                if (status && status !== 200) {
                    let data = {success: false, message: statusText || message || 'Error', data: error};

                    /**
                     * handler: error()
                     */
                    result = handler.error(data, option);

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
sendRequest.getPayload = (method, data, option) => {
    let {credentials, headers} = option;

    if ('string' !== typeof data) {
        data = JSON.stringify(data, (key, value) => {
            if (undefined === value) {
                return null;
            }

            return value;
        });
    }

    let fetchOption = u.pick(option, fetchOptionList);

    data = Object.assign(
        {},
        {method},
        {headers},
        {body: data},
        credentials,
        fetchOption
    );

    if ('GET' === method) {
        delete data.body;
    }

    /**
     * handler: payload()
     */
    return option.handler.payload(data, option) || data;
};

sendRequest.clearTimeout = timeout => clearTimeout(timeout);

export default sendRequest;

