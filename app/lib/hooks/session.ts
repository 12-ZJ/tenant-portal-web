"use client";

import { useEffect, useRef } from "react";

const sessionTimeout = Number(process.env.NEXT_PUBLIC_SESSION_TIMEOUT ?? 30);
const INACTIVITY_LIMIT = sessionTimeout * 60 * 1000;

export const useAutoLogout = (onLogout: () => void) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimer = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      onLogout();
    }, INACTIVITY_LIMIT);
  };

  useEffect(() => {
    const events = ["mousemove", "keydown", "click", "scroll"];
    events.forEach((event) => window.addEventListener(event, resetTimer));
    resetTimer();

    return () => {
      events.forEach((event) =>
        window.removeEventListener(event, resetTimer)
      );
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);
};