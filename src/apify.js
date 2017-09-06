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
export default
function (sendRequest, apis = {}, configure = {}) {
    apis = Object.assign({}, apis);

    let all = Object.keys(apis || {});

    all.forEach(key => {
        let origin = Object.assign(apis[key]);

        apis[key] = (options, config) => {
            let param = Object.assign({}, options);

            return sendRequest(origin, param, Object.assign({}, configure, config));
        };

        apis[key].origin || (apis[key].origin = origin);

        apis[key].getUrl = () => origin.toString();
    });

    return apis || {};
}

