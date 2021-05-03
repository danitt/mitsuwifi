import Conf from "https://raw.githubusercontent.com/danitt/deno-conf/master/mod.ts";

const config = new Conf({
  projectName: 'mitsuwifi'
});

export function setVar<Key extends string = string, Value = unknown>(name: Key, value: Value): void {
  config.set(name, value);
}

export function getVar<Key extends string = string, Value = unknown>(name: Key): Value | undefined {
  return config.get(name, undefined);
}

export function hasVar<Key extends string = string>(name: Key): boolean {
  return config.has(name);
}

export function deleteVar<Key extends string = string>(name: Key): void {
  config.delete(name);
}
