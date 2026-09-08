import { useCallback, useEffect, useState } from 'react';
import { AppState } from 'react-native';

const CODE_TTL_MS = 60_000;

/**
 * 验证码倒计时。
 * 只存过期时间戳，剩余秒数始终由 `Date.now()` 推算：
 * App 切后台时 JS 定时器被冻结，回前台后下一次 tick（或 AppState 恢复事件）会立即校正到真实剩余时间，
 * 不会像递减计数器那样把后台流逝的时间"补"回来。
 */
export function useCodeCountdown() {
  const [expiresAt, setExpiresAt] = useState<number | null>(null);
  const [now, setNow] = useState(() => Date.now());

  const start = useCallback(() => {
    const ts = Date.now();
    setNow(ts);
    setExpiresAt(ts + CODE_TTL_MS);
  }, []);

  useEffect(() => {
    if (expiresAt == null) return;

    const timer = setInterval(() => setNow(Date.now()), 1000);
    const subscription = AppState.addEventListener('change', (status) => {
      if (status === 'active') setNow(Date.now());
    });

    return () => {
      clearInterval(timer);
      subscription.remove();
    };
  }, [expiresAt]);

  const seconds =
    expiresAt == null ? 0 : Math.max(0, Math.ceil((expiresAt - now) / 1000));

  return { seconds, start };
}
