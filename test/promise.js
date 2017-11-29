/**
 * @file index.js
 * @author ienix(enix@foxmail.com)
 *
 * @since 2017/11/29
 */

const STATE = {
    pending: 0,
    fulfilled: 1,
    rejected: 2
};

const PENDING = 0;
const FULFILLED = 1;
const REJECTED = 2;

class Promise {
    constructor(resolver) {
        this.state = PENDING;
        this.value = null;
        this.callbackQueue = [];

        let resolve = result => {
            if (this.state === PENDING) {
                this.state = FULFILLED;
                this.value = result;

                setTimeout(() => {
                    this.callbackQueue.forEach(callback => callback(result));
                });
            }
        };

        let reject = error => {
            if (this.state === PENDING) {
                this.state = REJECTED;
                this.value = error;
            }
        };

        resolver(resolve, reject);
    }

    then(onResolved, onRejected) {
        return new Promise((resolve, reject) => {
            let onResolvedHandler = value => {
                let result = onResolved
                    ? onResolved(value)
                    : value;

                if (result instanceof Promise) {
                    return result.then(value => resolve(value));
                }

                resolve(result);
            };
            let onRejectedHandler = value => {
                let result = onRejected
                    ? onRejected(value)
                    : value;

                reject(result);
            };

            this.callbackQueue.push(onResolvedHandler);

            if (this.state === FULFILLED) {
                onResolvedHandler(this.value);
            }

            if (this.state === REJECTED) {
                onRejectedHandler(this.value);
            }
        });
    }

    ['catch'](onRejected) {
        return this.then(null, onRejected);
    }
}

export default Promise;
