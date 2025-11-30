import { useEffect, useState } from 'react';

export const SantaSleigh = () => {
  const [isFlying, setIsFlying] = useState(false);

  useEffect(() => {
    // Trigger sleigh animation every 45 seconds
    const triggerFlight = () => {
      setIsFlying(true);
      
      // Play jingle bell sound
      const audio = new Audio('https://cdn.pixabay.com/audio/2022/03/10/audio_4cf48dde4e.mp3');
      audio.volume = 0.3;
      audio.play().catch(() => {
        // Silently fail if audio can't play (e.g., no user interaction yet)
      });

      // Reset after animation completes
      setTimeout(() => {
        setIsFlying(false);
      }, 8000);
    };

    // Initial delay before first flight
    const initialTimeout = setTimeout(triggerFlight, 10000);

    // Set up interval for periodic flights
    const interval = setInterval(triggerFlight, 45000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, []);

  if (!isFlying) return null;

  return (
    <div className="fixed top-20 -right-64 z-50 pointer-events-none animate-sleigh-fly">
      <svg width="200" height="120" viewBox="0 0 200 120" fill="none" className="drop-shadow-2xl">
        {/* Reindeer */}
        <g transform="translate(10, 30)">
          {/* Rudolph's red nose */}
          <circle cx="5" cy="15" r="3" fill="hsl(0 100% 50%)" className="animate-pulse" />
          
          {/* Reindeer body */}
          <ellipse cx="15" cy="20" rx="12" ry="8" fill="hsl(30 40% 35%)" />
          
          {/* Reindeer head */}
          <circle cx="8" cy="15" r="6" fill="hsl(30 40% 35%)" />
          
          {/* Antlers */}
          <path d="M6 8 L4 2 M6 8 L8 3 M10 8 L12 2 M10 8 L8 3" stroke="hsl(30 30% 30%)" strokeWidth="2" />
          
          {/* Legs */}
          <line x1="10" y1="28" x2="10" y2="38" stroke="hsl(30 40% 35%)" strokeWidth="2" />
          <line x1="20" y1="28" x2="20" y2="38" stroke="hsl(30 40% 35%)" strokeWidth="2" />
        </g>

        {/* Harness line */}
        <line x1="35" y1="50" x2="70" y2="65" stroke="hsl(45 95% 50%)" strokeWidth="2" />

        {/* Santa */}
        <g transform="translate(80, 45)">
          {/* Santa's body */}
          <ellipse cx="15" cy="25" rx="12" ry="15" fill="hsl(355 85% 45%)" />
          
          {/* Santa's head */}
          <circle cx="15" cy="10" r="8" fill="hsl(25 70% 75%)" />
          
          {/* Santa's hat */}
          <path d="M10 8 L15 -2 L20 8" fill="hsl(355 85% 45%)" />
          <circle cx="15" cy="-2" r="3" fill="hsl(0 0% 100%)" />
          <line x1="8" y1="8" x2="22" y2="8" stroke="hsl(0 0% 100%)" strokeWidth="2" />
          
          {/* Santa's beard */}
          <ellipse cx="15" cy="14" rx="6" ry="4" fill="hsl(0 0% 100%)" />
        </g>

        {/* Sleigh */}
        <g transform="translate(70, 55)">
          {/* Sleigh body */}
          <path 
            d="M10 25 Q5 20 5 15 L5 5 L60 5 L60 15 Q60 20 55 25 Z" 
            fill="hsl(355 85% 45%)" 
            stroke="hsl(45 95% 50%)" 
            strokeWidth="2"
          />
          
          {/* Decorative gold trim */}
          <rect x="5" y="5" width="55" height="3" fill="hsl(45 95% 50%)" />
          
          {/* Runners */}
          <path d="M0 30 Q5 28 10 30 L55 30 Q60 28 65 30" stroke="hsl(0 0% 80%)" strokeWidth="3" strokeLinecap="round" />
          <path d="M0 35 Q5 33 10 35 L55 35 Q60 33 65 35" stroke="hsl(0 0% 80%)" strokeWidth="3" strokeLinecap="round" />
          
          {/* Gift bags in sleigh */}
          <rect x="15" y="8" width="12" height="12" fill="hsl(145 70% 35%)" />
          <rect x="30" y="10" width="10" height="10" fill="hsl(215 100% 50%)" />
          <rect x="43" y="9" width="11" height="11" fill="hsl(45 95% 50%)" />
          
          {/* Bows on gifts */}
          <circle cx="21" cy="8" r="2" fill="hsl(355 85% 45%)" />
          <circle cx="35" cy="10" r="2" fill="hsl(45 95% 50%)" />
          <circle cx="48.5" cy="9" r="2" fill="hsl(355 85% 45%)" />
        </g>

        {/* Sparkles trailing behind */}
        <g className="animate-twinkle">
          <circle cx="160" cy="60" r="2" fill="hsl(45 95% 50%)" opacity="0.8" />
          <circle cx="170" cy="55" r="1.5" fill="hsl(0 0% 100%)" opacity="0.6" />
          <circle cx="165" cy="70" r="1.5" fill="hsl(45 95% 50%)" opacity="0.7" />
          <circle cx="175" cy="65" r="2" fill="hsl(0 0% 100%)" opacity="0.5" />
        </g>
      </svg>
    </div>
  );
};
