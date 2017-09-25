/**
 * @file get
 * @author ienix(guoaimin01@baidu.com)
 *
 * @since 2017/9/25
 */

/* global queryString */

import queryString from 'query-string';

import request from '../request';

/**
 * get
 *
 * @param {string} uri
 * @param {string} data -  fromData
 * @param {?Object} option - 可以覆盖 fetch api的配置
 * @return {Promise}
 */

export default (uri, data = {}, option) => {
    /**
     * @property {Object} search - 用于收集uri上的search
     */
    let search = {};
    /**
     * @property {string} pureUri - 用于存储除search外的根链接
     */
    let pureUri = uri;
    /**
     * @property {string} hasSearch - 用于标示uri中是否有`search`
     */
    let hasSearch = uri.indexOf('?') > -1;

    if (hasSearch) {
        let temp = uri.split('?');

        pureUri = temp[0];
        search = queryString.parse(temp[1]);
    }

    let payload = Object.assign({}, search, data);
    let query = queryString.stringify(payload);

    if (query) {
        uri = `${pureUri}?${query}`;
    }

    return request('GET', uri, '', option);
};
