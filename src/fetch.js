/**
 * @file fetch
 * @author ienix(enix@foxmail.com)
 *
 * @since 2017/12/4
 */

import 'whatwg-fetch';
import isNode from 'detect-node';
import nodeFetch from 'node-fetch';

let fetch;

/**
 * in node runtime
 */
if (isNode) {
    fetch = nodeFetch;
}
/**
 * in browser runtime
 */

else {
    fetch = window.fetch;
}

export default fetch;
