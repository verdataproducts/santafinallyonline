import { MessageCircle } from "lucide-react";

export const WhatsAppButton = () => {
  const phoneNumber = "19123036921"; // +1 912 303 6921 formatted for WhatsApp

  return (
    <a
      href={`https://wa.me/${phoneNumber}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-gradient-toy text-white rounded-full w-14 h-14 shadow-lg transition-all duration-300 hover:scale-110 group flex items-center justify-center animate-float relative"
      aria-label="Ask Santa"
      style={{
        boxShadow: '0 0 20px rgba(var(--primary-rgb, 220, 38, 38), 0.5), 0 0 40px rgba(var(--primary-rgb, 220, 38, 38), 0.3)',
        animation: 'float 3s ease-in-out infinite, glow-pulse 2s ease-in-out infinite',
      }}
    >
      <span className="text-2xl font-bold">?</span>
      <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-card text-foreground px-4 py-2 rounded-lg shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm font-semibold border border-border">
        🎅 Ask Santa anything!
      </span>
    </a>
  );
};
