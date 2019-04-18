# apify
A api solution for `web browser` based Fetch api!

[![Build Status](https://www.travis-ci.org/Neverland/apify.svg)](https://www.travis-ci.org/Neverland/apify)
[![npm](https://img.shields.io/npm/v/i-apify.svg)](https://www.npmjs.com/package/i-apify)
[![Github All Releases](https://img.shields.io/npm/dm/i-apify.svg)](https://www.npmjs.com/package/i-apify)
[![codecov](https://codecov.io/gh/Neverland/apify/branch/master/graph/badge.svg)](https://codecov.io/gh/Neverland/apify)

```javascript
api.method(payload, option);
```
## Description
>  基于fetch api的前端数据链路层封装，可以达到一次配置随意轻松使用！

apify 提供了以下功能
   - requset用于发送请求支持`POST`，`GET` 请求, `PUT`，`DELETE`需要自己扩展
   - apify 用于把配置处理为可以发送请求的函数化列表
   - 可以使用apify处理过的简单发送请求方式，也可以直接用requset发送请求
   - i-apify 使用了fetch Api的polyfill，可以直接使用 Headers 和 Response 类

## Define

```ecmascript 6

import {apify, request} from 'i-apify';

let list = {
    getUser: '/api/v1/getUser',
    getCity: '/api/method/getCity?type=normal'
};

export default apify(request.post, list, <option>);

```

## Usage

### request 对象

> request的post，get出了配合apify使用外均可以独立使用。

```ecmascript 6

import {request} from 'i-apify';

request.post('/api/v1/getUser', payload, <option>);
request.get('/api/method/getCity?type=normal', payload, <option>);

```

### apify处理后的函数使用

|参数|说明|default|
|---|----|----|
|payload| {Object string} | null |
|option|{Object=}|{}|

### 1. 直接使用
```javascript

api.getUser({
    id: ${userId},
    name: ${userName}
})
    .then(response => {
        // do something
    })
    .catch();

```

### 2. 使用local option覆盖global option
```javascript
api.getCity(null, <option>)
    .then()
    .catch();
```

## Option

### 默认option及初始值

|参数|default|说明|Fetch API 参数|
|---|----|----|----|
|method|POST|请求方式|Y|
|credentials|include|默认可以跨域请求|Y|
|headers|'Accept': 'application/json' <br>'Content-Type':'application/json'|数据类型JSON|Y|
|dataType|json|收发数据类型json|N|
|x-timeout|5000ms|超时时间|N|
|x-silent|false|用于在hook或handler控制loading是否静默|N|
|x-message|true|用于在hook或handler控制是否展示异常等逻辑，可以配合ui-dialog。|N|

### 全局配置与局部配置
 >可以使用apify的option来配置所有方法，
 
```javascript
let option = {
    'x-timeout': 1000 * 10
};

apify(request.post, list, option);
```

>发送请求时可以对当前方法进行最终配置

```javascript

api.getUser(null, {
    timeout: 1000 * 6,
    dataType: 'formData' // formdata需要在payload handler中支持
})
    .then()
    .catch();

```

```javascript
import {apify, request} from 'i-apify';

let list = {
    getUser: '/api/v1/getUser',
};

let option = {
    hook: {
        beforeRequest({option}) {
            if (!option['x-silent']) {
                ui.loading.show();
            }
        }
    },
    handler: {
        error(error, option) {
            let {data, message} = error;
            
            if (option['x-message']) {
                ui.alert(message);
            }
        }
    }
};

let api = apify(request.post, list, option);

// 请求时会有loading，错误会弹窗提示
api.getUser(null)
    .then()
    .catch();

// 局部配置会覆盖全局配置
// 请求时不会有loading，错误不会弹窗提示
api.getUser(null, {
    'x-silent': true,
    'x-message': false,
})
    .then()
    .catch();

```

通过apify, 或者api.method的option参数可以使用所有fetch api的配置参数。

### fetch option

>关于fetch api, 可以通过option直接支持fetch api的配置。
[Fetch api](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)

```javascript

let option = {
    method: 'GET',
    mode: 'cors',
    cache: 'default' 
};

// global

apify(request.post, list, option);

// local
api.getUser(payload, option);
```

## hook

>通过hook函数可以对请求流程进行精细控制

### hook fetch进程钩子函数

|函数名|调用阶段|
|----|----|
|beforeRequest(option)|发送请求前执行|
|timeout(option)|超时时执行|
|requestSuccess(option, response)|请求成功后执行|
|afterParse(option, data)|解析fetch的response后执行|
|requestFail(option, error)|请求失败后执行|

## handler 请求后数据处理函数

>使用handler可以对请求成功或者失败后对所所获取的数据或逻辑进行最后处理

|参数|说明|
|----|----|
|data|通过fetch api所获得的数据|
|option|请求时使用的最终配置|

### handler配置
```javascript

import {apify, request} from 'i-apify';

let list = {
    getUser: '/api/v1/getUser',
};

let option = {
    handler: {
        success(result, option) {
            // 可以在这里把数据处理成自己想要对格式
        },
        error(data, option) {
            // 可以在这里把数据处理成自己想要对格式
            return data;
        },
        payload(data, option) {
            // 可以在这里对fetch的option 进行处理
            /* global cleenDeep */

            return cleenDeep(data);
        }
    }
}

export default apify(request.post, list, option);

```

## 配合async awiat 使用

```javascript
let option = {
    handler: {
        success(result, option) {
            // 可以在这里对response在进行细分
            if (result.success) {
                return result.data;
            }
            
            return Promise.reject({data: [1, 2, 3]});
        }
    }
}

async function () {
    try {
        await api.getUser();
    }
    catch(e) {
        console.log(e.data) // [1, 2, 3]
    }
}

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

## License MIT
