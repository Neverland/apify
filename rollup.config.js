/**
 * @file rollup.config
 * @author ienix(enix@foxmail.com)
 *
 * @since 2017/7/17
 */

import babel from 'rollup-plugin-babel';
import minify from 'rollup-plugin-minify'

export default {
    entry: 'src/index.js',
    format: 'umd',
    plugins: [
        babel({
            include: 'src/**',
            runtimeHelpers: true
        }),
        minify({umd: {
            dest: 'dist/index.min.js'
        }})
    ],
    moduleName: 'i-apify',
    dest: 'dist/index.js'
};