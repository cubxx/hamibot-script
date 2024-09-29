import { exec } from 'child_process';
import { c, t, toFormData } from './api.js';
import { readFile } from 'fs/promises';

// console.log(await t.get('usage'));

const {
  API_KEY: key,
  SCRIPT_NAME: name,
  SCRIPT_ID: script_id,
  DEVICE_ID: device_id,
} = process.env;

c.put(
  `/devscripts/${script_id}/files`,
  `-F "data=@dist/${name}.js;type=application/javascript" \
   -F "data=@src/${name}/config.json;type=application/json"`,
);
// t.put(
//   `/devscripts/${script_id}/files`,
//   toFormData(
//     [
//       'file',
//       new Blob([await readFile(`dist/${name}.js`)], {
//         type: 'application/javascript',
//       }),
//     ],
//     [
//       'file',
//       new Blob([await readFile(`src/${name}/config.json`)], {
//         type: 'application/json',
//       }),
//     ],
//   ),
// );

exec('start msedge https://hamibot.com/dashboard/scripts/console');
