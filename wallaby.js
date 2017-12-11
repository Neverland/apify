/**
 * @file wallaby
 * @author ienix(guoaimin01@baidu.com)
 *
 * @since 2017/12/11
 */

module.exports = function () {
    return {
        files: [
            'src/**/*.js'
        ],

        tests: [
            'test/**/*Spec.js'
        ]
    };
};
