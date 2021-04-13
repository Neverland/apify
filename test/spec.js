/**
 * @file index
 * @author ienix(enix@foxmail.com)
 *
 * @since 2017/9/8
 */

/* global fetch */
/* global describe */
/* global require */
/* global it */

let assert = require('assert');
let should = require('should');

let iApify = require('../dist/index');
let {apify, request} = iApify;

let apiMap = {getData: '/get/data?_version=1'};
let api = apify(request.post, apiMap);

const NOOP = function () {};
const OPTION = {
    handler: {
        payload: function() {
            return new Promise(NOOP, NOOP);
        }
    }
};

// 单测中不需要使用this，所以不需要使用箭头函数

describe('iApify', function () {
    describe('1. iApify api', function () {
        it('1.1 iApify 是 Object 类型！', function () {
            iApify.should.be.a.Object();
        });
        it('1.2 iApify 包含 `request` and `apify` 方法!', function () {
            iApify.should.have.property('request');
            iApify.should.have.property('apify');
        });
    });

    describe('2. request', function () {
        describe('#request api', function () {
            it('2.1 request 包含 `post`, `get` 方法!', function () {
                request.should.have.property('post');
                request.should.have.property('get');
            });
            it('2.2 request 的`post` and `get`方法是`Function` 类型!', function () {
                request.get.should.be.a.Function();
                request.get.should.be.a.Function();
            });
        });
    });

    describe('3. apify', function () {
        describe('#apify api', function () {
            it('3.1 apify 会是 uri|url 列表函数化', function () {
                api.getData.should.be.a.Function();
            });
            it('3.2 api实例的`getUrl`可以获取原始url', function () {
                api.getData.getUrl().should.be.equal(apiMap.getData);
            });
        });
    });

    describe('4. api', function () {
        describe('#api', function () {
            it('4.1 api 的实例是promise实例', function () {
                api.getData({}, OPTION)
                    .then(NOOP, NOOP)
                    .catch().should.be.a.Promise();
            });
        });

        describe('#api', function () {
            it('4.2 api hook 可以正常执行，并且能够覆盖默认hook！', function () {
                let beforeRequest =  option => {
                    option['x-silent'].should.be.equal(false);

                    option.hook.beforeRequest.toString().should.be.equal(beforeRequest.toString());
                };

                api.getData(null, {
                    hook: {
                        beforeRequest
                    }
                })
                    .then(NOOP, NOOP);
            });
            it('4.3 api payload handler可以正常执行！', function () {
                let data = {a: 1};
                let payload =  payload => {
                    payload.should.be.equal(data);
                };

                api.getData(data, {
                    handler: {
                        payload
                    }
                })
                    .then(NOOP, NOOP);
            });
        });
    });
});
