import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import cleanup from 'rollup-plugin-cleanup';
import { terser } from 'rollup-plugin-terser';
import pkg from './package.json';

export default [
    {
        input: 'src/index.ts',
        output: [
            {
                file: pkg.main,
                format: 'cjs',
                sourcemap: false
            },
            {
                file: pkg.module,
                format: 'esm',
                sourcemap: false
            }
        ],
        plugins: [
            resolve(),
            typescript({ tsconfig: './tsconfig.build.json' }),
            commonjs({
                exclude: 'node_modules',
                ignoreGlobal: true
            }),
            terser(),
            cleanup({ comments: 'none' })
        ],
        external: Object.keys({ ...pkg.devDependencies, ...pkg.dependencies })
    }
];
