import { useEffect, useState } from "react";
import { differenceInDays, differenceInHours, differenceInMinutes } from "date-fns";
import { Clock, Package } from "lucide-react";

export const ChristmasCountdown = () => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const calculateTimeLeft = () => {
      const now = new Date();
      const currentYear = now.getFullYear();
      const christmas = new Date(currentYear, 11, 25); // December 25
      
      // If Christmas has passed this year, calculate for next year
      if (now > christmas) {
        christmas.setFullYear(currentYear + 1);
      }
      
      const days = differenceInDays(christmas, now);
      const hours = differenceInHours(christmas, now) % 24;
      const minutes = differenceInMinutes(christmas, now) % 60;
      
      setTimeLeft({ days, hours, minutes });
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  if (!mounted) {
    return null; // Prevent hydration mismatch
  }

  const isLastMinute = timeLeft.days <= 7;
  const deliveryCutoff = timeLeft.days <= 14;

  return (
    <div className="bg-gradient-festive text-primary-foreground py-2 px-4">
      <div className="container mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-sm">
          <div className="flex items-center gap-2 font-bold">
            <Clock className="w-4 h-4" />
            <span>
              {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m until Christmas!
            </span>
          </div>
          
          {deliveryCutoff && (
            <div className={`flex items-center gap-2 ${isLastMinute ? 'animate-pulse' : ''}`}>
              <Package className="w-4 h-4" />
              <span className="font-semibold">
                {isLastMinute 
                  ? "⚠️ Last chance for Christmas delivery!" 
                  : "🎁 Order soon for guaranteed Christmas delivery"}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
