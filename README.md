# apify
A api solution for browser based Fetch api!

> Auto-polyfill Promise, Fetch api! Support IE6+

[![Build Status](https://www.travis-ci.org/Neverland/apify.svg)](https://www.travis-ci.org/Neverland/apify)
[![npm](https://img.shields.io/npm/v/i-apify.svg)](https://www.npmjs.com/package/i-apify)
[![Github All Releases](https://img.shields.io/npm/dm/i-apify.svg)](https://www.npmjs.com/package/i-apify)

```javascript
api.method(payload, option);
```
## Description
>  基于fetch api的前端数据链路层封装，可以达到一次配置随意轻松使用！

apify 有两个方法
   - requset用于发送请求支持`POST`，`GET` 请求, `PUT`，`DELETE`需要自己扩展
   - apify 用于把配置处理为可以发送请求的函数化列表
   - 可以使用apify处理过的简单发送请求方式，也可以直接用requset发送请求

## Define

```ecmascript 6

import {apify, request} from 'i-apify';

let apiList = {
    a: '/test/a',
    b: 'test/b'
};

// global option

let option = {
    // 1.请求成功数据处理器，用于把数据处理为自己想要的格式
    // 2.也可以使用
    handler: {
        success(data, promise) {
            return data;
        },
        error(data, promise) {
            return data;
        }
    },
};

let api = apify(request.post, apiList, option);

```

## Usage

```ecmascript 6
/**
 * @param {JSON|string} payload
 * @param {?Object} option
 * @return Promise
 */

/* global api */
// 1.
api.a({x:1, y:1})
    .then();

// 2.

api.a({x:1, y:1})
    .then()
    .catch();

// 3.

// local option

let option = {
    handler: {
        error() {
            
        },
        success() {
            
        }
    },
    hook: {
        beforeRequest() {
            // ui loading
        },
        timeout() {
            alert('Timeout!');
        }
    },
    'x-message': false,
    'x-silent': true,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
};

api.a({x:1, y:1}, option)
    .then();
```

## Option

api.a(url, payload, [option]);

通过option可以使用所有fetch api的配置参数

### fetch option

关于fetch api
[Fetch api](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)

### default option

/**
 *  @param {Object} option
 */

1. 默认参数可以通过apify全局覆盖，也可以通过api.method(url, payload, option); 调用是通过第三个参数覆盖默认或者全局配置
2. x-custom 可以用于hook的函数中

```ecmascript 6
    let option = {
        'x-silent': false,
        // 用于控制 ui dialog 抛出的信息
        'x-message': true,
        // 用于控制 ui dialog 抛出的信息
        'x-timeout': 5000,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        handler: {
            success(data, promise) {
                return data;
            },
            error(data, promise) {
                return data;
            }
        },
        hook: {
            beforeRequest() {
            
            },
            payload(data) {
                return data;
            },
            timeout() {
        
            },
            requestSuccess() {
        
            },
            requestFail() {
        
            }
        }
    };
```

### custom option

#### hook fetch进程钩子函数

```
    beforeRequest: 发送请求前执行
    payload: 获得payload后执行
    timeout：超时时执行
    requestSuccess: 请求成功后执行
    requestFail：请求失败后执行
```
#### handler 请求后数据处理函数
1. handler配置
```ecmascript 6
    // 此处的promise为api的promise对象
    let option = {
        handler: {
            success(data, promise) {
                // 可以在这里把数据处理成自己想要对格式
                // 如果在这里使用promise会组织默认对处理逻辑
            },
            error(data, promise) {
                // 可以在这里把数据处理成自己想要对格式
                // 如果在这里使用promise会组织默认对处理逻辑
                // promise.reject(data);
            }
        }
    }
```
#### 自定义配置
通过option传递的自定义配置可以在hook中接收到，并不会影响fetch配置
```ecmascript 6
    api.method(payload, {custom: true})
```

2.handler 接受到的data

```
    // success data
    {success: true, data: 接口返回的原始数据, message: 自定义message}
    
    // error data
    {success: false, data: 接口返回的原始数据, message: 自定义message}
```
#### global config

```ecmascript 6
    apify(request.post, apiList, option)
```

#### local config

```ecmascript 6
    api.method(payload, option)
```

## Payload
```
{JSON|string}
```

## Building & Testing

### Building
```
    npm run build
```
### testing
```
    npm run test
```
