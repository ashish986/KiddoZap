import React, { useEffect } from 'react';

declare global {
  interface Window {
    adsbygoogle?: any[];
  }
}

interface AdBannerProps {
  slotId?: string;
  format?: 'horizontal' | 'rectangle' | 'banner';
  className?: string;
}

export const AdBanner: React.FC<AdBannerProps> = ({
  slotId = 'default-slot',
  format = 'horizontal',
  className = '',
}) => {
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.adsbygoogle) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch {
      // AdSense script will fill in slot automatically
    }
  }, []);

  return (
    <div className={`w-full my-2 flex flex-col items-center justify-center select-none ${className}`}>
      <div className="w-full max-w-4xl flex flex-col items-center justify-center overflow-hidden">
        {/* Real AdSense Unit */}
        <ins
          className="adsbygoogle"
          style={{ display: 'block', width: '100%' }}
          data-ad-client="ca-pub-1249623486151192"
          data-ad-slot={slotId !== 'default-slot' ? slotId : undefined}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    </div>
  );
};
