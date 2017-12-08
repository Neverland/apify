/**
 * @file post
 * @author ienix(enix@foxmail.com)
 *
 * @since 2017/9/25
 */

import request from '../request';

/**
 * post
 *
 * @param {string} uri
 * @param {?Object} data - 提交的数据
 * @param {?Object} option - 可以覆盖 fetch api的配置
 * @return {Promise}
 */

export default (uri, data, option) => request('POST', uri, data, option);
