import { $, check, loop, type Page } from '~/helper';

const { freetimes, checkInterval, APP_ENV } = hamibot.env;
APP_ENV === 'development' && console.show();

const pkgName = 'com.tencent.qqmusic';
const freetimeEndStr = `${freetimes.split('').join(' ')} 小时`;
const pages: Page[] = [
  {
    name: '免费模式',
    is: () => $('=?免费模式剩余时长').el,
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
      $('=去完成').click();
      $('=领取奖励').click();
      return $('=续时长').click() && $('=去开启').click();
    },
  },
  {
    name: '广告',
    is: () => $('=?免费听歌').el,
    do() {
      let err;
      for (let i = 20; i > 0; i--) {
        if ($('=^已获得免费听歌').el)
          return $('=关闭').click() && $('=?跳过').click();
        err =
          $('=点击一下，获得奖励').click() &&
          $('=立即点击').click() &&
          $('=^只需点一下').click();
        if (!err) {
          sleep(1e3);
          currentPackage() === pkgName && back();
        }
      }
      return err;
    },
  },
  {
    name: '充值',
    is: () => $('=?确认协议').el,
    do: () => (back() ? void 0 : 'back error'),
  },
];

auto.waitFor();
app.startActivity({
  action: 'VIEW',
  packageName: pkgName,
  data: `qqmusic://qq.com/ui/openUrl?p=${encodeURIComponent(
    JSON.stringify({ url: 'https://y.qq.com/tmead/h5/2022/free2/index.html' }),
  )}`,
});
loop(
  () =>
    check(pages, () => {
      if (currentPackage() !== pkgName) {
        log('goto ' + pkgName);
        app.launchPackage(pkgName);
      }
    }),
  +checkInterval,
);
