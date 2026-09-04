import React from 'react';

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
  return (
    <div
      className={`w-full my-6 flex flex-col items-center justify-center select-none ${className}`}
    >
      <div className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-1">
        Advertisement
      </div>
      <div
        className="w-full max-w-4xl min-h-[90px] sm:min-h-[100px] rounded-2xl bg-amber-50/70 border-2 border-dashed border-amber-300/80 flex flex-col items-center justify-center p-3 text-center transition-all overflow-hidden"
      >
        {/* Placeholder for Google AdSense <ins class="adsbygoogle"> */}
        <div className="flex items-center gap-2 text-amber-800 text-xs font-bold">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          <span>Google AdSense Safe Family Ad Space</span>
        </div>
        <p className="text-[11px] text-slate-500 max-w-sm mt-0.5">
          kiddozap.com ad container (Responsive 728x90 / 320x50 family-safe ad unit)
        </p>
      </div>
    </div>
  );
};
