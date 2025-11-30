import { MessageCircle } from "lucide-react";

export const WhatsAppButton = () => {
  const phoneNumber = "19123036921"; // +1 912 303 6921 formatted for WhatsApp

  return (
    <a
      href={`https://wa.me/${phoneNumber}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 group"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="w-6 h-6" />
      <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-card text-foreground px-3 py-2 rounded-lg shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm font-medium">
        Chat with us on WhatsApp
      </span>
    </a>
  );
};
