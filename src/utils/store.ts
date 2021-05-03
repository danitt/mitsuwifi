import Conf from "https://raw.githubusercontent.com/danitt/deno-conf/master/mod.ts";

const config = new Conf({
  projectName: 'mitsuwifi'
});

export function setVar<T = unknown>(name: string, value: T): void {
  config.set(name, value);
}

export function getVar<T = unknown>(name: string): T | undefined {
  return config.get(name, undefined);
}

export function hasVar(name: string): boolean {
  return config.has(name);
}

export function deleteVar(name: string): void {
  config.delete(name);
}
