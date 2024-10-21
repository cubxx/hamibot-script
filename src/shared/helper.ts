import type { TimeoutID } from 'timers';

const type_map = {
  '#': 'id',
  '.': 'className',
  t: 'text',
  d: 'desc',
} as const;
const mode_map = {
  '=': '',
  '?': 'Contains',
  '^': 'StartsWith',
  $: 'EndsWith',
  ':': 'Matches',
} as const;
export function $<
  T extends keyof typeof type_map,
  U extends keyof typeof mode_map,
  V = `${(typeof type_map)[T]}${(typeof mode_map)[U]}`,
>(selector: `${T}${U}${string}`, ms = 1) {
  const type = selector[0],
    mode = selector[1],
    content = selector.slice(2);
  const selectFn = globalThis[type_map[type] + mode_map[mode]];
  if (typeof selectFn !== 'function') log(`invalid selector ${selector}`);
  const ui: UiSelector = selectFn(content);
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

export function toSearchParams(obj: Record<string, unknown>) {
  return Object.entries(obj)
    .map(
      ([key, value]) => `${key}=${encodeURIComponent(JSON.stringify(value))}`,
    )
    .join('&');
}
