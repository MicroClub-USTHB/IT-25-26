import { useState, useEffect } from "react";

export interface CountdownState {
  hours: string;
  minutes: string;
  seconds: string;
  totalSeconds: number;
}

/**
 * Calculates and updates countdown to a target time ("HH:MM" 24h).
 */
export function useCountdown(targetTime: string | null): CountdownState {
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    if (!targetTime) return;

    const calc = () => {
      const now = new Date();
      const [h, m] = targetTime.split(":").map(Number);
      const target = new Date();
      target.setHours(h, m, 0, 0);
      let diff = Math.floor((target.getTime() - now.getTime()) / 1000);
      if (diff < 0) diff += 86400; // next day
      setRemaining(diff);
    };

    calc();
    const interval = setInterval(calc, 1000);
    return () => clearInterval(interval);
  }, [targetTime]);

  const hours = String(Math.floor(remaining / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((remaining % 3600) / 60)).padStart(2, "0");
  const seconds = String(remaining % 60).padStart(2, "0");

  return { hours, minutes, seconds, totalSeconds: remaining };
}
