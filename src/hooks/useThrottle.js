import { useCallback, useRef } from "react";

export function useThrottle(callback, delay = 1000) {
  const lastCall = useRef(0);

  return useCallback(
    (...args) => {
      const now = new Date().getTime();
      if (now - lastCall.current >= delay) {
        lastCall.current = now;
        return callback(...args);
      }
    },
    [callback, delay]
  );
}
