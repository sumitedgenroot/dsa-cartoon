"use client";

import { useCallback, useSyncExternalStore } from "react";

export type Lang = "java" | "cpp";

const KEY = "dsa-lang";
const listeners = new Set<() => void>();

function subscribe(cb: () => void) {
  listeners.add(cb);
  window.addEventListener("storage", cb);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", cb);
  };
}

function getSnapshot(): Lang {
  try {
    return localStorage.getItem(KEY) === "cpp" ? "cpp" : "java";
  } catch {
    return "java";
  }
}

export function useLang() {
  const lang = useSyncExternalStore(subscribe, getSnapshot, () => "java" as Lang);
  const setLang = useCallback((l: Lang) => {
    try {
      localStorage.setItem(KEY, l);
    } catch {}
    listeners.forEach((f) => f());
  }, []);
  return { lang, setLang };
}

export const LANG_LABEL: Record<Lang, string> = { java: "Java", cpp: "C++" };
