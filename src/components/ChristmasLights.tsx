export const ChristmasLights = () => {
  const lights = Array.from({ length: 30 }, (_, i) => i);

  return (
    <div className="fixed top-0 left-0 right-0 z-40 h-12 pointer-events-none overflow-hidden">
      <svg className="w-full h-full" viewBox="0 0 100 10" preserveAspectRatio="none">
        <path
          d="M0,5 Q5,2 10,5 T20,5 T30,5 T40,5 T50,5 T60,5 T70,5 T80,5 T90,5 T100,5"
          stroke="hsl(145 70% 35%)"
          strokeWidth="0.3"
          fill="none"
        />
      </svg>
      <div className="absolute top-0 left-0 right-0 flex justify-around px-4">
        {lights.map((i) => {
          const colors = [
            'hsl(355 85% 45%)', // red
            'hsl(45 95% 50%)', // gold
            'hsl(145 70% 35%)', // green
            'hsl(215 100% 50%)', // blue
          ];
          const color = colors[i % colors.length];
          const delay = i * 0.1;
          
          return (
            <div
              key={i}
              className="w-3 h-3 rounded-full animate-twinkle"
              style={{
                backgroundColor: color,
                boxShadow: `0 0 10px ${color}, 0 0 20px ${color}`,
                animationDelay: `${delay}s`,
              }}
            />
          );
        })}
      </div>
    </div>
  );
};
