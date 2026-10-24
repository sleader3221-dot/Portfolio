import { useEffect, useState } from "react";

const fmt = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Asia/Kolkata",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

/** Live Bengaluru time, ticking once a second. */
export function useClock() {
  const [now, setNow] = useState(() => fmt.format(new Date()));
  useEffect(() => {
    const id = window.setInterval(() => setNow(fmt.format(new Date())), 1000);
    return () => window.clearInterval(id);
  }, []);
  return now;
}
