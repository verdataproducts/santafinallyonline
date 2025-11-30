import { Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSoundStore } from '@/stores/soundStore';
import { toast } from 'sonner';

export const SoundControl = () => {
  const { isMuted, toggleMute } = useSoundStore();

  const handleToggle = () => {
    toggleMute();
    toast.success(isMuted ? '🔊 Sound effects enabled' : '🔇 Sound effects muted', {
      position: 'bottom-center',
      duration: 2000,
    });
  };

  return (
    <Button
      onClick={handleToggle}
      size="icon"
      variant="secondary"
      className="fixed bottom-24 right-6 z-50 h-14 w-14 rounded-full shadow-2xl hover:scale-110 transition-all duration-300 border-2 border-border"
      aria-label={isMuted ? 'Unmute sound effects' : 'Mute sound effects'}
    >
      {isMuted ? (
        <VolumeX className="h-6 w-6" />
      ) : (
        <Volume2 className="h-6 w-6" />
      )}
    </Button>
  );
};
