import keymap from "./keymap.json";

export type Key = typeof keymap[number];

export const modifiers = ["Ctrl", "Meta", "Alt", "Shift"];

export const parseEvent = (e: KeyboardEvent) => {
  return keymap.find((k) => k.webview.includes(e.code));
};
