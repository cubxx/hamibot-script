import { $, check, loop, type Page } from '~/helper';

const { freetimes, checkInterval, APP_ENV } = hamibot.env;
APP_ENV === 'development' && console.show();

const pkgName = 'com.tencent.qqmusic';
const freetimeEndStr = `${freetimes.split('').join(' ')} 小时`;
const pages: Page[] = [
  {
    name: '开屏广告',
    is: () => $('=跳过').el,
    do: () => $('=跳过').click(),
  },
  {
    name: '主页',
    is: () => $('#kin').el,
    do: () => $('#kin').click(),
  },
  {
    name: '免费模式',
    is: () => $('=续时长').el && $('=?免费模式剩余时长').el,
    do() {
      const freetimeText = $('=?免费模式剩余时长', 0).el?.text() ?? '';
      //         t(freetimeText);
      if (freetimeText.includes(freetimeEndStr)) {
        log(`已获取 ${freetimeEndStr}, 即将退出`);
        sleep(3e3);
        throw 0;
      }
      if (!$('=去浏览').click()) {
        sleep(11e3);
        back();
      }
      return $('=续时长').click();
    },
  },
  {
    name: '广告',
    is: () => $('=^免费听歌').el && $('=关闭').el,
    do() {
      let err;
      for (let i = 20; i > 0; i--) {
        if ($('=^已获得免费听歌').el) return $('=关闭').click();
        err = $('=点击一下，获得奖励').click() && $('=立即点击').click();
      }
      return err;
    },
  },
  {
    name: '充值',
    is: () => $('=确认协议并以').el,
    do: () => (back() ? void 0 : 'back error'),
  },
];

auto.waitFor();
loop(
  () =>
    check(pages, () => currentPackage() !== pkgName && launchPackage(pkgName)),
  +checkInterval,
);
