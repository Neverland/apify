/**
 * @file fetchOption
 * @author ienix(enix@foxmail.com)
 *
 * @since 2017/9/6
 */

export default [
    'method',        // GET/POST等
    'headers',       // 一个普通对象，或者一个 Headers 对象
    'body',          // 传递给服务器的数据，可以是字符串/Buffer/Blob/FormData，如果方法是 GET/HEAD，则不能有此参数
    'mode',          // cors / no-cors / same-origin， 是否跨域，默认是 no-cors
    'credentials',   // omit / same-origin / include
    'cache',         // default / no-store / reload / no-cache / force-cache / only-if-cached
    'redirect',      // follow / error / manual
    'referrer',      // no-referrer / client / 或者一个url
    'referrerPolicy',// no-referrer / no-referrer-when-downgrade / origin /  origin-when-cross-origin / unsafe-url
    'integrity'      // 资源完整性验证
]
