"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

const PROGRESS_KEY = "dsa-progress";
const listeners = new Set<() => void>();

function subscribe(cb: () => void) {
  listeners.add(cb);
  window.addEventListener("storage", cb);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", cb);
  };
}

const notify = () => listeners.forEach((f) => f());

function readRaw(key: string): string {
  try {
    return localStorage.getItem(key) ?? "";
  } catch {
    return "";
  }
}

function write(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {}
  notify();
}

/** Topics marked as learned, persisted in this browser. */
export function useProgress() {
  const raw = useSyncExternalStore(subscribe, () => readRaw(PROGRESS_KEY), () => "");
  const done = useMemo<Record<string, boolean>>(() => {
    try {
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }, [raw]);

  const toggle = useCallback(
    (id: string) => {
      const next = { ...done };
      if (next[id]) delete next[id];
      else next[id] = true;
      write(PROGRESS_KEY, JSON.stringify(next));
    },
    [done],
  );

  return { done, toggle };
}

/** Best score per game, persisted in this browser. */
export function useHighScore(game: string) {
  const key = `dsa-hs-${game}`;
  const raw = useSyncExternalStore(subscribe, () => readRaw(key), () => "");
  const best = Number(raw) || 0;
  const submit = useCallback(
    (score: number) => {
      if (score > (Number(readRaw(key)) || 0)) write(key, String(score));
    },
    [key],
  );
  return { best, submit };
}
