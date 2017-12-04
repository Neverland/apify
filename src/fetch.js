/**
 * @file fetch
 * @author ienix(enix@foxmail.com)
 *
 * @since 2017/12/4
 */

import isNode from 'detect-node';

export default
function () {
    /**
     * in node runtime
     */
    if (isNode) {

        return import('node-fetch')
            .then(fetch => {
                return fetch;
            });

        return;
    }

    /**
     * in browser runtime
     */

    return import('whatwg-fetch')
        .then(fetch => {
            return window.fetch;
        });
}
