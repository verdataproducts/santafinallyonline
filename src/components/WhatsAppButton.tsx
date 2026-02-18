export const WhatsAppButton = () => {
  const phoneNumber = "19123036921";

  return (
    <a
      href={`https://wa.me/${phoneNumber}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-[100] bg-gradient-toy text-primary-foreground rounded-full w-14 h-14 md:w-16 md:h-16 shadow-lg transition-all duration-300 hover:scale-110 group flex items-center justify-center"
      aria-label="Chat with us"
      style={{
        boxShadow: '0 0 20px hsl(25 100% 55% / 0.5), 0 0 40px hsl(25 100% 55% / 0.3)',
        animation: 'float 3s ease-in-out infinite, glow-pulse 2s ease-in-out infinite',
      }}
    >
      <div className="relative flex items-center justify-center">
        <span className="text-2xl md:text-3xl">💬</span>
      </div>
      <span className="hidden md:block absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-card text-foreground px-4 py-2 rounded-lg shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm font-semibold border border-border">
        Chat with us!
      </span>
    </a>
  );
};
