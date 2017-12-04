/**
 * @file rollup.config
 * @author ienix(enix@foxmail.com)
 *
 * @since 2017/7/17
 */

import babel from 'rollup-plugin-babel';
import minify from 'rollup-plugin-minify'

export default {
    input: 'src/index.js',
    plugins: [
        babel({
            include: 'src/**',
            runtimeHelpers: true
        }),
        minify({umd: {
            dest: 'dist/index.min.js'
        }})
    ],
    name: 'i-apify',
    output: {
        file: 'dist/index.js',
        format: 'umd',
    },
    external: [
        'underscore',
        'deep-assign',
        'query-string'
    ],
    globals: {
        'underscore': 'u',
        'deep-assign': 'deepAssign:',
        'query-string': 'queryString',
        'detect-node': 'isNode'
    },
};