import { MessageCircle } from "lucide-react";

export const WhatsAppButton = () => {
  const phoneNumber = "19123036921"; // +1 912 303 6921 formatted for WhatsApp

  return (
    <a
      href={`https://wa.me/${phoneNumber}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-gradient-toy hover:shadow-2xl text-white rounded-full px-6 py-4 shadow-lg transition-all duration-300 hover:scale-110 group flex items-center gap-3 animate-float"
      aria-label="Ask Santa"
    >
      <span className="text-3xl animate-wiggle">🎅</span>
      <span className="font-bold text-lg whitespace-nowrap">Ask Santa</span>
      <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-card text-foreground px-3 py-2 rounded-lg shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm font-medium">
        Chat with Santa on WhatsApp! 🎄
      </span>
    </a>
  );
};
