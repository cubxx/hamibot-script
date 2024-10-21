import { $, check, loop, toSearchParams, type Page } from '~/helper';

defineConfig([
  {
    label: '免费时长',
    name: 'freetimes',
    help: '单位: h',
    type: 'range',
    max: 24,
    'show-value': true,
  },
  {
    label: '页面检查间隔',
    name: 'checkInterval',
    help: '单位: ms',
    type: 'range',
    max: 1000,
    step: 10,
    'show-value': true,
  },
  {
    label: '免费听歌模式',
    name: 'freeMode',
    type: 'checkbox',
  },
]);
const { freetimes, checkInterval, freeMode, APP_ENV } = hamibot.env;
APP_ENV === 'development' && console.show();

const pkgName = 'com.tencent.qqmusic';
const freetimeEndStr = `${freetimes.split('').join(' ')} 小时`;
const nav = {
  qqmusic() {
    log('goto qqmusic');
    app.launchPackage(pkgName);
  },
  freetime() {
    log('goto freetime');
    const shareUrl = 'https://y.qq.com/tmead/h5/2022/free2/index.html';
    app.startActivity({
      action: 'VIEW',
      packageName: pkgName,
      data:
        'qqmusic://qq.com/ui/openUrl?' +
        toSearchParams({ p: { url: shareUrl }, source: shareUrl }),
    });
  },
  back() {
    log('back');
    currentPackage() !== pkgName ? nav.qqmusic() : back();
  },
};
const pages: Page[] = [
  {
    name: '免费模式',
    is: () => $('t?免费模式剩余时长').el,
    do() {
      const freetimeText = $('t?免费模式剩余时长', 0).el?.text() ?? '';
      //         t(freetimeText);
      if (freetimeText.includes(freetimeEndStr)) {
        log(`已获取 ${freetimeEndStr}, 即将退出`);
        sleep(3e3);
        throw 0;
      }
      if (!$('t=去浏览').click()) {
        sleep(11e3);
        back();
      }
      // if (!$('t=去完成').click()) {
      //   this.is() || sleep(11e3);
      // }
      $('t=领取奖励').click();
      $('t=我知道了').click();
      return $('t=续时长').click() && $('t=去开启').click();
    },
  },
  {
    name: '首页',
    is: () => $('d=听歌识曲').el,
    do: nav.freetime,
  },
  {
    name: '广告',
    is: () => $('t?免费听歌').el,
    do() {
      if ($('t^已获得免费听歌').el)
        return (
          $('t=关闭').click() && $('t?跳过').click() && $('d=关闭广告').click()
        );
      $('t=点击一下，获得奖励').click() &&
        $('t^只需点一下').click() &&
        $('t=立即点击').click();
    },
  },
  {
    name: '次数用完',
    is: () => $('t=今日免费畅听次数已用完').el,
    do() {
      $('t=取消').click();
      $('t=立即抽奖').click();
    },
  },
  {
    name: '首屏广告',
    is: () => $('t=跳过').el,
    do: () => $('t=跳过').click(),
  },
];

auto.waitFor();
if (freeMode) {
  loop(() => check(pages, nav.back), +checkInterval);
} else {
  while (1) {
    $('t=浏览').click() || sleep(16e3) || nav.back();
    if (!$('t=待领取').click()) break;
  }
}
