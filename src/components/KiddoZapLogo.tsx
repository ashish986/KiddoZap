import React from 'react';

interface KiddoZapLogoProps {
  className?: string;
  size?: number | string;
  variant?: 'badge' | 'header' | 'icon';
  showBanner?: boolean;
}

export const KiddoZapLogo: React.FC<KiddoZapLogoProps> = ({
  className = '',
  size = 40,
  variant = 'header',
}) => {
  if (variant === 'badge') {
    return (
      <div
        className={`relative inline-flex items-center justify-center select-none group transition-transform duration-300 hover:scale-105 ${className}`}
        style={{ width: size, height: size }}
      >
        <img
          src="/logo.svg"
          alt="KiddoZap Logo"
          className="w-full h-full object-contain drop-shadow-xl"
          referrerPolicy="no-referrer"
          loading="eager"
        />
      </div>
    );
  }

  if (variant === 'icon') {
    return (
      <div
        className={`relative inline-flex items-center justify-center rounded-2xl overflow-hidden shadow-md transition-all active:scale-95 ${className}`}
        style={{ width: size, height: size }}
      >
        <img
          src="/logo.svg"
          alt="KiddoZap Icon"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </div>
    );
  }

  // Header variant: Brand logo icon + glowing accent
  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-2xl overflow-hidden shadow-sm border border-amber-300/60 transition-transform duration-200 hover:rotate-1 hover:scale-105 ${className}`}
      style={{ width: size, height: size }}
    >
      <img
        src="/logo.svg"
        alt="KiddoZap"
        className="w-full h-full object-cover scale-110"
        referrerPolicy="no-referrer"
      />
    </div>
  );
};
