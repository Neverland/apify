/**
 * @file util
 * @author ienix(enix@foxmail.com)
 *
 * @since 2017/9/6
 */

export default {
    isPromise(obj) {
        return Object.prototype.toString.call(obj) === '[object Promise]' || !!obj && ((typeof obj === 'undefined' ? 'undefined' : typeof(obj)) === 'object' || typeof obj === 'function') && typeof obj.constructor === 'function' && !Object.hasOwnProperty.call(obj, 'constructor') && obj.constructor.name === 'Promise';
    }
}
