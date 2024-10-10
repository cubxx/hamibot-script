import { $, check, loop, type Page } from '~/helper';

const { freetimes, checkInterval, APP_ENV } = hamibot.env;
APP_ENV === 'development' && console.show();

const pkgName = 'com.tencent.qqmusic';
const freetimeEndStr = `${freetimes.split('').join(' ')} 小时`;
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
      // $('t=去完成').click();
      $('t=领取奖励').click();
      $('t?我知道了').click();
      return $('t=续时长').click() && $('t=去开启').click();
    },
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
    name: '充值',
    is: () => $('t?确认协议').el,
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
      if (currentPackage() === pkgName) return;
      log('goto ' + pkgName);
      app.launchPackage(pkgName);
    }),
  +checkInterval,
);
