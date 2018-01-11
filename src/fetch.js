/**
 * @file fetch
 * @author ienix(enix@foxmail.com)
 *
 * @since 2017/12/4
 */

import isNode from 'detect-node';

let fetch;

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

export default fetch;
