/**
 * @file rollup.config
 * @author ienix(enix@foxmail.com)
 *
 * @since 2017/7/17
 */

import babel from '@rollup/plugin-babel';
import minify from 'rollup-plugin-minify'

export default {
    input: 'src/index.js',
    plugins: [
        babel({
            exclude: 'node_modules/**',
            include: 'src/**',
            babelHelpers: 'bundled'
        }),
        minify({umd: {
            dest: 'dist/index.min.js'
        }})
    ],
    output: {
        file: 'dist/index.js',
        format: 'umd',
        name: 'i-apify',
        sourcemap: true,
        globals: {
            'underscore': 'u',
            'deep-assign': 'deepAssign:',
            'query-string': 'queryString'
        }
    },
    external: [
        'underscore',
        'deep-assign',
        'query-string',
        'whatwg-fetch'
    ]
};
