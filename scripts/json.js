import fs from 'fs-extra';

async function json(path) {
  (await fs.exists(path)) || (await fs.writeJson(path, {}));
  return new Proxy(await fs.readJson(path), {
    set(o, k, v) {
      o[k] = v;
      fs.writeJson(path, o);
      return true;
    },
  });
}
export const scripts = json('scripts.json');
