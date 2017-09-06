/**
 * @file constants
 * @author ienix(enix@foxmail.com)
 *
 * @since 2017/9/5
 */

const GET = 'GET';
const POST = 'POST';
const DELETE = 'DELETE';
const PUT = 'PUT';

const METHOD = {
    GET,
    POST,
    DELETE,
    PUT
};

/**
 * @const FETCH_TIMEOUT - 5s
 */
const FETCH_TIMEOUT = 1000 * 5;

const X_OPTION_ENUM = {
    silent: 'x-silent',
    message: 'x-message',
    timeout: 'x-timeout'
};

/**
 * @const same-origin 只有同源有这个配置才能传递cookie
 */
const CREDENTIALS = {
    credentials: 'same-origin'
};

const X_OPTION = {
    // 用于控制 ui loading
    'x-silent': false,
    // 用于控制 ui dialog 抛出的全局信息
    'x-message': true,
    // 用于控制 ui dialog 抛出的全局信息
    'x-timeout': FETCH_TIMEOUT
};

const HEADERS = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
};

const DATA_TYPE = 'json';

export default Object.assign({},
    {
        timeout: FETCH_TIMEOUT,
        headers: HEADERS,
        credentials: CREDENTIALS,
        dataType: DATA_TYPE,
        X_OPTION_ENUM,
        METHOD
    },
    X_OPTION
);
