import React from 'react';

interface KavaLogoProps {
  variant?: 'full' | 'wordmark' | 'icon';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  theme?: 'light' | 'dark' | 'auto';
  showPetalBadge?: boolean;
}

export function KavaPetalIcon({ size = 32, className = '' }: { size?: number; className?: string }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 48 48" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 transition-transform duration-300 ${className}`}
    >
      {/* Top Petal - Teal / Mint */}
      <path 
        d="M24 6C24 6 29.5 13 29.5 18.5C29.5 21.5376 27.0376 24 24 24C20.9624 24 18.5 21.5376 18.5 18.5C18.5 13 24 6 24 6Z" 
        fill="#00A88F" 
      />
      {/* Right Petal - Deep Slate Navy */}
      <path 
        d="M42 24C42 24 35 29.5 29.5 29.5C26.4624 29.5 24 27.0376 24 24C24 20.9624 26.4624 18.5 29.5 18.5C35 18.5 42 24 42 24Z" 
        fill="#0B132B" 
      />
      {/* Bottom Petal - Radiant Cyan / Sky */}
      <path 
        d="M24 42C24 42 18.5 35 18.5 29.5C18.5 26.4624 20.9624 24 24 24C27.0376 24 29.5 26.4624 29.5 29.5C29.5 35 24 42 24 42Z" 
        fill="#06B6D4" 
      />
      {/* Left Petal - Fresh Mint Green */}
      <path 
        d="M6 24C6 24 13 18.5 18.5 18.5C21.5376 18.5 24 20.9624 24 24C24 27.0376 21.5376 29.5 18.5 29.5C13 29.5 6 24 6 24Z" 
        fill="#2DD4BF" 
      />
    </svg>
  );
}

export function KavaWordmark({ 
  height = 24, 
  color = 'currentColor', 
  className = '' 
}: { 
  height?: number; 
  color?: string; 
  className?: string; 
}) {
  // Approximate aspect ratio ~ 3.6 : 1
  const width = Math.round(height * 3.75);

  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 180 48" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Letter 'K' */}
      <path 
        d="M8 8H17V21L30 8H41.5L25 24L42 40H30.5L17 26.8V40H8V8Z" 
        fill={color} 
      />
      {/* Letter 'A' (Modern stylized stencil with geometric open crossbar) */}
      <path 
        d="M66.5 8L82 40H72.5L68.8 32H54.2L50.5 40H41L56.5 8H66.5ZM61.5 16.2L57 26H66L61.5 16.2Z" 
        fill={color} 
      />
      {/* Letter 'V' */}
      <path 
        d="M84 8H93.5L104.5 33.5L115.5 8H125L109.5 40H99.5L84 8Z" 
        fill={color} 
      />
      {/* Letter 'A' (Second 'A') */}
      <path 
        d="M149.5 8L165 40H155.5L151.8 32H137.2L133.5 40H124L139.5 8H149.5ZM144.5 16.2L140 26H149L144.5 16.2Z" 
        fill={color} 
      />
    </svg>
  );
}

export default function KavaLogo({
  variant = 'full',
  size = 'md',
  className = '',
  theme = 'auto',
  showPetalBadge = false
}: KavaLogoProps) {
  const sizeConfig = {
    sm: { wordmarkH: 18, iconSize: 22, textClass: 'text-base', gap: 'gap-2' },
    md: { wordmarkH: 22, iconSize: 28, textClass: 'text-lg', gap: 'gap-2.5' },
    lg: { wordmarkH: 28, iconSize: 36, textClass: 'text-2xl', gap: 'gap-3' },
    xl: { wordmarkH: 36, iconSize: 44, textClass: 'text-3xl', gap: 'gap-3.5' }
  }[size];

  const textColor = theme === 'dark' ? '#F8FAFC' : theme === 'light' ? '#0B132B' : 'currentColor';

  if (variant === 'icon') {
    return <KavaPetalIcon size={sizeConfig.iconSize} className={className} />;
  }

  if (variant === 'wordmark') {
    return (
      <div className={`inline-flex items-center ${className}`}>
        <KavaWordmark height={sizeConfig.wordmarkH} color={textColor} />
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center ${sizeConfig.gap} group select-none ${className}`}>
      {showPetalBadge ? (
        <div className="relative flex items-center justify-center">
          <KavaPetalIcon size={sizeConfig.iconSize} className="group-hover:rotate-45 transition-transform duration-500 ease-out" />
        </div>
      ) : (
        <div className="w-8 h-8 rounded-full bg-slate-950 text-white flex items-center justify-center font-extrabold text-xs tracking-wider shadow-sm group-hover:scale-105 transition-transform">
          K
        </div>
      )}
      <KavaWordmark height={sizeConfig.wordmarkH} color={textColor} />
    </div>
  );
}
