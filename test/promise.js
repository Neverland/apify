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

class Promise {
    constructor(resolver) {
        this.state = STATE.pending;
        this.value = null;
        this.callbackQueue = [];

        let resolve = result => {
            if (this.state === STATE.pending) {
                this.state = STATE.fulfilled;
                this.value = result;

                this.callbackQueue.forEach(callback => callback(result));
            }
        };

        let reject = error => {
            if (this.state === STATE.pending) {
                this.state = STATE.rejected;
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

            if (this.state === STATE.fulfilled) {
                onResolvedHandler(this.value);
            }

            if (this.state === STATE.rejected) {
                onRejectedHandler(this.value);
            }
        });
    }

    ['catch'](onRejected) {
        return this.then(null, onRejected);
    }
}

export default Promise;
