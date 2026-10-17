import React from 'react';

interface UnifyLogoProps {
  variant?: 'full' | 'compact' | 'icon' | 'dark' | 'monochrome';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showTagline?: boolean;
}

export const UnifyLogo: React.FC<UnifyLogoProps> = ({
  variant = 'compact',
  size = 'md',
  className = '',
  showTagline = false,
}) => {
  // Dimension scales
  const sizeMap = {
    xs: { iconSize: 22, textScale: 'text-lg', dotSize: 4 },
    sm: { iconSize: 28, textScale: 'text-xl', dotSize: 5 },
    md: { iconSize: 36, textScale: 'text-2xl', dotSize: 6 },
    lg: { iconSize: 48, textScale: 'text-3xl', dotSize: 8 },
    xl: { iconSize: 64, textScale: 'text-4xl', dotSize: 10 },
  };

  const { iconSize, textScale } = sizeMap[size];
  const isDark = variant === 'dark';
  const isMono = variant === 'monochrome';

  // SVG U-shaped Ribbon Fold Symbol with Sphere Center
  const renderIcon = () => (
    <svg
      width={iconSize}
      height={iconSize}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="flex-shrink-0 transition-transform duration-200 hover:scale-105"
      aria-label="Unify Logo Mark"
    >
      <defs>
        {/* Main Ribbon Gradient: Deep Violet -> Indigo -> Electric Blue -> Cyan */}
        <linearGradient id="unifyRibbonGrad" x1="12" y1="20" x2="88" y2="85" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#7E22CE" />
          <stop offset="25%" stopColor="#6366F1" />
          <stop offset="65%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#06B6D4" />
        </linearGradient>

        {/* Sphere Gradient for Center Community Dot */}
        <linearGradient id="unifySphereGrad" x1="40" y1="35" x2="60" y2="55" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#A855F7" />
          <stop offset="40%" stopColor="#6366F1" />
          <stop offset="100%" stopColor="#3B82F6" />
        </linearGradient>

        {/* Shadow Fold Gradient for 3D depth */}
        <linearGradient id="unifyFoldShadow" x1="30" y1="50" x2="65" y2="85" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1E1B4B" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#312E81" stopOpacity="0.0" />
        </linearGradient>

        {/* Monochrome Gradients */}
        <linearGradient id="unifyMonoGrad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="currentColor" />
          <stop offset="100%" stopColor="currentColor" />
        </linearGradient>
      </defs>

      {/* Main U Ribbon Path: Flowing continuous loop with curved tips */}
      <path
        d="M20 22C20 18.6863 22.6863 16 26 16C28.2 16 30.1 17.2 31.1 19.1C35.2 27.2 38.5 42 39 52C40 67 47 78 60 78C73 78 80 67 80 48V22C80 18.6863 82.6863 16 86 16C89.3137 16 92 18.6863 92 22V48C92 74 78 90 56 90C34 90 20 74 20 48V22Z"
        fill={isMono ? 'url(#unifyMonoGrad)' : 'url(#unifyRibbonGrad)'}
      />

      {/* Left Wing Ribbon Overlay with Depth Curl */}
      <path
        d="M20 22C20 18.6863 22.6863 16 26 16C29.3137 16 32 18.6863 32 22V48C32 68 44 80 58 82C42 82 20 70 20 44V22Z"
        fill={isMono ? 'currentColor' : '#8B5CF6'}
        opacity={isMono ? '0.7' : '0.85'}
      />

      {/* Inner ribbon fold shadow for the tactile 3D contour from prompt image */}
      {!isMono && (
        <path
          d="M32 46C34 60 44 76 60 78C48 76 38 64 34 50Z"
          fill="url(#unifyFoldShadow)"
        />
      )}

      {/* Center People/Community Sphere */}
      <circle
        cx="50"
        cy="40"
        r="11.5"
        fill={isMono ? 'currentColor' : 'url(#unifySphereGrad)'}
        filter={isMono ? undefined : 'drop-shadow(0 2px 4px rgba(79, 70, 229, 0.35))'}
      />
    </svg>
  );

  if (variant === 'icon') {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        {renderIcon()}
      </div>
    );
  }

  const textColor = isDark ? 'text-white' : isMono ? 'text-current' : 'text-[#10132B]';
  const taglineColor = isDark ? 'text-slate-400' : 'text-[#64748B]';

  return (
    <div className={`inline-flex flex-col items-start select-none ${className}`}>
      <div className="flex items-center gap-2.5">
        {renderIcon()}
        
        {/* Wordmark "unify" */}
        <div className="flex flex-col">
          <div className="flex items-baseline">
            <span
              className={`font-extrabold tracking-tight font-['Plus_Jakarta_Sans',sans-serif] ${textColor} ${textScale} leading-none`}
            >
              un
            </span>
            {/* The 'i' with custom gradient dot */}
            <span className="relative inline-flex flex-col items-center">
              <span
                className="w-1.5 h-1.5 rounded-full mb-0.5"
                style={{
                  background: isMono
                    ? 'currentColor'
                    : 'linear-gradient(135deg, #A855F7 0%, #6366F1 100%)',
                }}
              />
              <span
                className={`font-extrabold tracking-tight font-['Plus_Jakarta_Sans',sans-serif] ${textColor} ${textScale} leading-none`}
              >
                i
              </span>
            </span>
            <span
              className={`font-extrabold tracking-tight font-['Plus_Jakarta_Sans',sans-serif] ${textColor} ${textScale} leading-none`}
            >
              fy
            </span>
          </div>
        </div>
      </div>

      {/* Official Tagline: "Connect. Create. Grow." */}
      {(showTagline || variant === 'full') && (
        <div className={`mt-1 flex items-center text-[10px] md:text-[11px] font-medium tracking-wide ${taglineColor}`}>
          <span>Connect</span>
          <span className="mx-1 text-[#8B5CF6] font-bold">•</span>
          <span>Create</span>
          <span className="mx-1 text-[#3B82F6] font-bold">•</span>
          <span>Grow.</span>
        </div>
      )}
    </div>
  );
};
