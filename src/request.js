/**
 * @file request
 * @author ienix(enix@foxmail.com)
 *
 * @since 2017/9/5
 */

import * as defaultConfig from './constants';

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

let sendRequest = (method = 'POST', uri, data = {}, option = {}) => {
    option = Object.assign({}, defaultConfig, option);

    if ('json' !== option.dataType.toLocaleLowerCase()) {
        return Promise.reject(option.errorHanlder({success: false, message: 'Data type doesn\'t support!'}));
    }

    /**
     * 从枚举获取真实key
     *
     * 'x-silent',
     * 'x-message',
     * 'x-timeout'
     *
     */
    let {silent, message, timeout} = X_OPTION_ENUM;

    /**
     * 合并默认配置和自定义配置
     */
    option = assign({}, X_OPTION, option);

    let uiLoading;
    // 启用loading
    if (option[silent] === false) {
        uiLoading = loading();
    }

    let xTimeout = option[timeout];
    let hideLoading = () => {
        uiLoading && uiLoading.then(vm => {
            vm.hideUi();
            vm.$destroy(true);
        });
    };

    let xMessage = option[message];

    delete option[silent];
    delete option[timeout];
    delete option[message];

    // 合并payload
    let payload = assign(
        {},
        {method},
        {headers},
        {body: data},
        CREDENTIALS,
        option
    );

    return new Promise((resolve, reject) => {
        let networkTimeout = setTimeout(() => {

        }, xTimeout);

        return fetch(uri, payload)
            .then(response => {
                /**
                 * 1.这里有数据返回，先关闭掉loading。
                 * 2.在根据情况出来response
                 */
                hideLoading();
                clearTimeout(networkTimeout);

                if (response.status !== 200) {
                    return reject(response);
                }

                return response.json()
                    .then(json => {
                        return resolve(json);
                    });
            })
            .catch(error => {
                // hook error

                // 404, 500 ...
                if (error.status && error.status !== 200) {

                    // handler
                }

                return reject(error);
            });
    });
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

    let param = assign({}, {method: GET}, option);

    return fetch(uri, {param});
};

// let put
// let delete

export default request;
