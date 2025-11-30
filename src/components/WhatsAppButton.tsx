export const WhatsAppButton = () => {
  const phoneNumber = "19123036921"; // +1 912 303 6921 formatted for WhatsApp

  return (
    <a
      href={`https://wa.me/${phoneNumber}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-[100] bg-gradient-toy text-white rounded-full w-14 h-14 md:w-16 md:h-16 shadow-lg transition-all duration-300 hover:scale-110 group flex items-center justify-center animate-float"
      aria-label="Ask Santa"
      style={{
        boxShadow: '0 0 20px rgba(59, 130, 246, 0.5), 0 0 40px rgba(59, 130, 246, 0.3)',
        animation: 'float 3s ease-in-out infinite, glow-pulse 2s ease-in-out infinite',
      }}
    >
      <div className="relative flex items-center justify-center">
        <span className="text-2xl md:text-3xl">🎅</span>
        <span className="absolute -bottom-1 -right-1 text-xs md:text-sm font-bold bg-white text-primary rounded-full w-4 h-4 md:w-5 md:h-5 flex items-center justify-center shadow-md">
          ?
        </span>
      </div>
      <span className="hidden md:block absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-card text-foreground px-4 py-2 rounded-lg shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm font-semibold border border-border">
        🎅 Ask Santa anything!
      </span>
    </a>
  );
};
