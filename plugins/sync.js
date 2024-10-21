import { spawn } from 'child_process';
import { choose, goto, page } from './shared/browser.js';
import { basename, extname } from 'path';

function debounce(fn, ms) {
  let timer;
  return function (...e) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, e), ms);
  };
}
async function cv(text) {
  (await page.$('div.CodeMirror-scroll')).evaluate((el) =>
    el.dispatchEvent(new MouseEvent('mousedown')),
  );
  const cmd = spawn('clip');
  cmd.stdin.write(text);
  cmd.stdin.end();
  await page.keyboard.down('Control');
  await page.keyboard.press('KeyA');
  await page.keyboard.press('KeyV');
  await page.keyboard.press('KeyS');
  await page.keyboard.up('Control');
}
async function focusFile(filename) {
  return choose(page.$$('div.file'), async (el) => {
    const text = await el.evaluate((el) => el.innerText);
    return text.includes(filename);
  }).then(
    (el) => el.evaluate((el) => el.click()),
    () => {
      throw `${filename} not found`;
    },
  );
}
async function update(name, code, config) {
  await goto.editor(name);
  (await page.waitForSelector('input[type="checkbox"]')).evaluate(
    (el) => el.checked || el.click(),
  );
  if (config) {
    await focusFile('配置模式');
    await cv(config);
  }
  await focusFile('.js');
  await cv(code.replace(/ {4}/g, '  '));
}
/**@returns {import('rollup').Plugin} */
export function sync(debounce_ms = 3e3) {
  const update_debounce = debounce(update, debounce_ms);
  const configs = {};
  return {
    name: 'sync',
    transform(code, id) {
      return code.replace(/defineConfig\(([^\)]+)\)/, (_, g1) => {
        configs[id] = JSON.stringify(new Function('return ' + g1)(), null, 2);
        return '';
      });
    },
    generateBundle(options, bundle) {
      Object.keys(bundle).forEach((filebase) => {
        const { code, facadeModuleId } = bundle[filebase];
        update_debounce(
          basename(filebase, extname(filebase)),
          code,
          configs[facadeModuleId],
        );
      });
    },
  };
}
