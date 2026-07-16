"use client";

import { useCallback, useState } from "react";

const DEFAULT_TARGET = 4000;

function storageKey(month: string) {
  return `recivo:target:${month}`;
}

function readTarget(month: string): number {
  if (typeof window === "undefined") return DEFAULT_TARGET;
  const stored = window.localStorage.getItem(storageKey(month));
  return stored ? Number(stored) : DEFAULT_TARGET;
}

/** Configurable collection target for a period month, persisted per-device. */
export function useMonthlyTarget(month: string) {
  const [loadedMonth, setLoadedMonth] = useState(month);
  const [target, setTargetState] = useState(() => readTarget(month));

  if (month !== loadedMonth) {
    setLoadedMonth(month);
    setTargetState(readTarget(month));
  }

  const setTarget = useCallback(
    (value: number) => {
      setTargetState(value);
      window.localStorage.setItem(storageKey(month), String(value));
    },
    [month]
  );

  return { target, setTarget };
}
