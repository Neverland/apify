/**
 * @file fetch
 * @author ienix(enix@foxmail.com)
 *
 * @since 2017/12/4
 */

import isNode from 'detect-node';

export default
function () {
    let errorCatch = error => {throw new Error(error)};
    /**
     * in node runtime
     */
    if (isNode) {

        import('node-fetch')
            .catch(error => errorCatch);

        return;
    }

    /**
     * in browser runtime
     */

    import('whatwg-fetch')
        .catch(error => errorCatch);
}
