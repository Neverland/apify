/**
 * @file env
 * @author ienix(guoaimin01@baidu.com)
 *
 * @since 2017/12/4
 */

import isNode from 'detect-node';

export default
function () {
    let fetch = function () {};
    /**
     * in node runtime
     */
    if (isNode) {
        return import('node-fetch').then;
    }

    /**
     * in browser runtime
     */
    return import('whatwg-fetch').then;
}
