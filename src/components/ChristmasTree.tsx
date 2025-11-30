import { CSSProperties } from "react";

export const ChristmasTree = ({ className = "", style }: { className?: string; style?: CSSProperties }) => {
  return (
    <div className={`inline-block ${className}`} style={style}>
      <svg width="40" height="50" viewBox="0 0 40 50" fill="none">
        {/* Star */}
        <path
          d="M20 2 L22 8 L28 8 L23 12 L25 18 L20 14 L15 18 L17 12 L12 8 L18 8 Z"
          fill="hsl(45 95% 50%)"
          className="animate-pulse"
        />
        {/* Tree layers */}
        <path d="M20 10 L8 20 L12 20 L6 28 L10 28 L4 36 L36 36 L30 28 L34 28 L28 20 L32 20 Z" 
          fill="hsl(145 70% 35%)" 
        />
        {/* Ornaments */}
        <circle cx="15" cy="24" r="2" fill="hsl(355 85% 45%)" className="animate-twinkle" />
        <circle cx="25" cy="24" r="2" fill="hsl(45 95% 50%)" className="animate-twinkle" style={{ animationDelay: '0.5s' }} />
        <circle cx="20" cy="30" r="2" fill="hsl(215 100% 50%)" className="animate-twinkle" style={{ animationDelay: '0.3s' }} />
        <circle cx="12" cy="32" r="2" fill="hsl(355 85% 45%)" className="animate-twinkle" style={{ animationDelay: '0.7s' }} />
        <circle cx="28" cy="32" r="2" fill="hsl(45 95% 50%)" className="animate-twinkle" style={{ animationDelay: '0.2s' }} />
        {/* Trunk */}
        <rect x="16" y="36" width="8" height="8" fill="hsl(25 60% 40%)" />
      </svg>
    </div>
  );
};
