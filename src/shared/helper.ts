import type { TimeoutID } from 'timers';

const alias_map = {
  '#': 'id',
  '.': 'className',
  '=': 'text',
  '+': 'desc',
};
const alias2_map = {
  '?': 'Contains',
  '^': 'StartsWith',
  $: 'EndsWith',
};
const alias2 = new Set(Object.keys(alias2_map));
export function $(
  selector: `${keyof typeof alias_map}${'' | keyof typeof alias2_map}${string}`,
  ms = 1,
) {
  const [selectFn, content] = alias2.has(selector[1])
    ? [alias_map[selector[0]] + alias2_map[selector[1]], selector.slice(2)]
    : [alias_map[selector[0]], selector.slice(1)];
  if (!selectFn) log(`invalid selector ${selector}`);
  /** @type {UiSelector} */
  const ui = globalThis[selectFn](content);
  const el = ui.findOne(ms);
  return {
    ui,
    el,
    click() {
      if (!el) return `${selector} not found`;
      sleep(random(500, 1000));
      if (!el.click()) {
        const bounds = el.bounds();
        click(bounds.centerX() + 1, bounds.centerY());
      }
    },
  };
}

export type Page = {
  name: string;
  is: () => UiObject | null | boolean;
  do: () => string | void;
};
export function check(pages: Page[], notFound: () => void) {
  for (const page of pages) {
    if (page.is()) {
      log(`page is ${page.name}`);
      const err = page.do();
      if (err) log(`page ${page.name} error: ${err}`);
      return;
    }
  }
  notFound?.();
}
export function loop(fn: () => void, ms: number) {
  (function loop() {
    fn();
    setTimeout(loop, ms);
  })();
}

export function throttle(fn: () => void, ms: number) {
  let timer: null | TimeoutID = null;
  return () => {
    if (timer !== null) {
      clearTimeout(timer);
      return;
    }
    timer = setTimeout(() => {
      fn();
      timer = null;
    }, ms);
  };
}
