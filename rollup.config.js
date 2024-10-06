import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import tsConfigPaths from 'rollup-plugin-tsconfig-paths';
import 'dotenv/config';
import { sync } from './scripts/plugin.js';

const name = process.env.SCRIPT_NAME;
const signature = `// Cubx https://github.com/Cubxx/hamibot-script ${new Date().toLocaleString()}`;
/**
 * @type {import('rollup').RollupOptions}
 * @link https://www.rollupjs.com/configuration-options
 */
export default {
  input: `src/${name}/index.ts`,
  output: {
    dir: 'dist',
    entryFileNames: `${name}.js`,
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
