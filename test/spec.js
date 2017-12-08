/**
 * @file index
 * @author ienix(enix@foxmail.com)
 *
 * @since 2017/9/8
 */

/* global describe */
/* global require */
/* global it */

let assert = require('assert');
let should = require('should');

let iApify = require('../dist/index');
let {apify, request} = iApify;

let apiMap = {getData: '/get/data?_version=1'};
let api = apify(request.post, apiMap);

describe('iApify', function () {
    describe('#iApify api', function () {
        it('iApify 是 Object 类型！', function () {
            iApify.should.be.a.Object();
        });
        it('iApify 包含 `request` and `apify` 方法!', function () {
            iApify.should.have.property('request');
            iApify.should.have.property('apify');
        });
    });

    describe('request', function () {
        describe('#request api', function () {
            it('request 包含 `post`, `get` 方法!', function () {
                request.should.have.property('post');
                request.should.have.property('get');
            });
            it('request 的`post` and `get`方法是`Function` 类型!', function () {
                request.get.should.be.a.Function();
                request.get.should.be.a.Function();
            });
        });
    });

    describe('apify', function () {
        describe('#apify api', function () {
            it('apify 会是 uri|url 列表函数化', function () {
                api.getData.should.be.a.Function();
            });
            it('api实例的`getUrl`可以获取原始url', function () {
                api.getData.getUrl().should.be.equal(apiMap.getData);
            });
        });
    });

    describe('api', function () {
        describe('#api', function () {
            it('api 的实例是promise实例', function () {
                api.getData({}).catch().should.be.a.Promise();
            });
        });

        describe('#api', function () {
            it('api hook 可以正常执行，并且能够覆盖默认hook！', function () {
                let beforeRequest =  option => {
                    option['x-silent'].should.be.equal(false);

                    option.hook.beforeRequest.toString().should.be.equal(beforeRequest.toString());
                };
                api.getData(null, {
                    hook: {
                        beforeRequest
                    }
                })
                    .catch();
            });
        });
    });
});
