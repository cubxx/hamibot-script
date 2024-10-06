import { spawn } from 'child_process';
import { page, goto, filter } from './browser.js';
import path from 'path';

function debounce(fn, ms) {
  let timer;
  return function (...e) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, e), ms);
  };
}
async function update(name, code) {
  await goto.editor(name);
  (await page.waitForSelector('input[type="checkbox"]')).evaluate(
    (el) => el.checked || el.click(),
  );
  await filter(page.$$('div.file'), (el) =>
    el.evaluate((el) => !el.innerText.includes('配置模式')),
  ).then(
    (el) => el.evaluate((el) => el.click()),
    () => {
      throw 'Script not found';
    },
  );
  (await page.$('div.CodeMirror-scroll')).evaluate((el) =>
    el.dispatchEvent(new MouseEvent('mousedown')),
  );
  const cmd = spawn('clip');
  cmd.stdin.write(code.replace(/ {4}/g, '  '));
  cmd.stdin.end();
  await page.keyboard.down('Control');
  await page.keyboard.press('KeyA');
  await page.keyboard.press('KeyV');
  await page.keyboard.press('KeyS');
  await page.keyboard.up('Control');
}
/**@type {()=>import('rollup').Plugin} */
export function sync(wait = 3e3) {
  const update_debounce = debounce(update, wait);
  return {
    name: 'sync',
    generateBundle(options, bundle) {
      Object.keys(bundle).forEach((filebase) => {
        update_debounce(path.basename(filebase, '.js'), bundle[filebase].code);
      });
    },
  };
}
