import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import tsConfigPaths from 'rollup-plugin-tsconfig-paths';
import 'dotenv/config';
import { sync } from './plugins/sync.js';

const { SCRIPT_NAME } = process.env;
const signature = `// Cubx https://github.com/cubxx/hamibot-script ${new Date().toLocaleString()}`;
/**
 * @type {import('rollup').RollupOptions}
 * @link https://www.rollupjs.com/configuration-options
 */
export default {
  input: `src/${SCRIPT_NAME}.ts`,
  output: {
    dir: 'dist',
    entryFileNames: `${SCRIPT_NAME}.js`,
    intro: `${signature}\n(function(){\n'use strict';`,
    outro: `})();`,
    sourcemap: false,
  },
  treeshake: {
    propertyReadSideEffects: false,
    unknownGlobalSideEffects: false,
  },
  plugins: [tsConfigPaths(), resolve(), typescript(), sync()],
};
