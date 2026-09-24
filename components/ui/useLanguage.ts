"use client";

import { useSyncExternalStore } from "react";
import { getLanguage, languageChangeEvent } from "@/lib/language";

function subscribe(callback: () => void) {
  window.addEventListener(languageChangeEvent, callback);
  return () => window.removeEventListener(languageChangeEvent, callback);
}

export function useLanguage() {
  return useSyncExternalStore(subscribe, getLanguage, () => "en");
}
