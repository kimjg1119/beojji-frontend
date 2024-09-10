'use client';

import { IS_DEBUG, KEY_TAB_COUNT } from '@/lib/config';
import { useEffect } from 'react';

/**
 * 활성 탭이 모두 hide되는 순간에 localStorage를 비웁니다.
 * 이 동작은 Session Context Provider에서 제공되어서는 안됩니다:
 *  Session Context Provider는 해당 Context를 사용하는 컴포넌트가 불릴 때 여러번 존재할 수 있습니다.
 *
 * @param param0
 * @returns
 */
export default function ClearStorageDependOnTabs({ keys, children }: React.PropsWithChildren<{ keys : Array<string> }>) {
  useEffect(() => {
    const prevCount = Number(localStorage.getItem(KEY_TAB_COUNT) || '0');
    localStorage.setItem(KEY_TAB_COUNT, String(prevCount + 1));

    const callback = () => {
      const count = Number(localStorage.getItem(KEY_TAB_COUNT) || '0');

      // Since React dev mode render twice;
      const unit = IS_DEBUG ? 2 : 1;
      localStorage.setItem(KEY_TAB_COUNT, String(count - unit));

      if (count <= unit) {
        keys.forEach((key => localStorage.removeItem(key)))
      }
    };

    window.addEventListener('pagehide', callback);

    return () => window.removeEventListener('pagehide', callback); // Cleanup
  }, []);

  return children;
}
