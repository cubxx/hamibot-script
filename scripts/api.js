import { exec, ChildProcess } from 'child_process';
import dotenv from 'dotenv';
// import * as FormData from 'form-data';
dotenv.config();

const host = 'https://api.hamibot.com/v1';
const key = process.env.API_KEY;

export const t = new Proxy(
  /** @type {Record<string, (path: `/${string}`, data?: {}) => Promise<{}>>} */ ({}),
  {
    get(o, k) {
      return (path, data) =>
        fetch(host + path, {
          method: k,
          headers: {
            Authorization: key,
            'Content-Type':
              data instanceof FormData
                ? 'multipart/form-data'
                : 'application/json',
          },
          body: data instanceof FormData ? data : JSON.stringify(data),
        }).then((res) =>
          res.ok && ('' + res.status).startsWith('2')
            ? res.json()
            : Promise.reject(`${res.status} ${res.statusText}: ${path}`),
        );
    },
  },
);
export const c = new Proxy(
  /**
   * @type {Record<
   *   string,
   *   (path: `/${string}`, command: string) => ChildProcess
   * >}
   */ ({}),
  {
    get(o, k) {
      return (path, command) =>
        exec(
          `curl -X ${k.toUpperCase()} -H "Authorization: ${key}" ${command} ${host + path}`,
          (error, stdout, stderr) => {
            if (error) {
              console.error(`curl error: ${error}`);
              return;
            }
          },
        );
    },
  },
);
export function toFormData(...kvs) {
  const form = new FormData();
  kvs.forEach(([k, v]) => form.append(k, v));
  return form;
}
