/**
 * @file get
 * @author ienix(enix@foxmail.com)
 *
 * @since 2017/9/25
 */

/* global describe */
/* global require */
/* global it */

let assert = require('assert');
let should = require('should');

let iApify = require('../dist/index');
let {apify, request} = iApify;

let apiMap = {
    getWithQuery: '/get/data?_version=1',
    getWithoutQuery: '/get/data',
    get: '/get/data?',
    getting: '/get/data'
};
let api = apify(request.get, apiMap);

describe('get', function () {
    describe('#requestg `get` testing，可以正确合并参数', function () {
        it('`data` 为空时', function () {
            api.getWithQuery({}, {
                hook: {
                    payload(data, option) {
                        option['x-uri'] .should.be.equal(api.getWithQuery.getUrl());
                    }
                }
            });
        });
        it('请求方式为 `GET`', function () {
            api.getWithQuery({}, {
                hook: {
                    payload(data, option) {
                        option['x-method'] .should.be.equal(option.METHOD['GET']);
                    }
                }
            });
        });
    });
});
