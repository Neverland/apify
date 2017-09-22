/**
 * @file index
 * @author ienix(enix@foxmail.com)
 *
 * @since 2017/9/6
 */

/* global Promise */

/* eslint-disable */
import 'whatwg-fetch';
import {Promise} from 'es6-promise';

Promise.polyfill();
/* eslint-enable */


import request from './request';
import apify from './apify';

export default {
    request,
    apify
}
