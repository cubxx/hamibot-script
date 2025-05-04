import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import tsConfigPaths from 'rollup-plugin-tsconfig-paths';
import 'dotenv/config';
import { sync } from './plugins/sync.js';

const { script_name } = process.env;
const signature = `// Cubx https://github.com/cubxx/hamibot-script ${new Date().toLocaleString()}`;
/**
 * @type {import('rollup').RollupOptions}
 * @link https://www.rollupjs.com/configuration-options
 */
export default {
  input: `src/${script_name}.ts`,
  output: {
    dir: 'dist',
    entryFileNames: `${script_name}.js`,
    intro: `${signature}\n(function(){\n'use strict';`,
    outro: `})();`,
    sourcemap: false,
  },
  treeshake: {
    propertyReadSideEffects: false,
    unknownGlobalSideEffects: false,
  },
  plugins: [tsConfigPaths(), resolve(), typescript({ target: 'es5' }), sync()],
};
