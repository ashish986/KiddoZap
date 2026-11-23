import type { ReactNode } from 'react';

const storeUrl = 'https://play.google.com/store/apps/details?id=com.kiddozap.app';

export function PlayStoreLink({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <a className={className ? `play-store-link ${className}` : 'play-store-link'} href={storeUrl}>
      <img src="/assets/home/google-play.svg" width="18" height="18" alt="" />{children}
    </a>
  );
}
