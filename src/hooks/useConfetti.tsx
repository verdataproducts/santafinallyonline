import { useCallback } from 'react';
import confetti from 'canvas-confetti';
import { useSoundStore } from '@/stores/soundStore';

export const useConfetti = () => {
  const isMuted = useSoundStore((state) => state.isMuted);

  const celebrate = useCallback(() => {
    // Christmas-themed confetti colors
    const colors = [
      '#c93a40', // red
      '#2d5f3f', // green
      '#f0c419', // gold
      '#ffffff', // white
    ];

    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { 
      startVelocity: 30, 
      spread: 360, 
      ticks: 60, 
      zIndex: 9999,
      colors: colors,
    };

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      // Create confetti bursts from different positions
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);

    // Add celebratory sound effect if not muted
    if (!isMuted) {
      const audio = new Audio('https://cdn.pixabay.com/audio/2022/03/24/audio_a9107de3bb.mp3');
      audio.volume = 0.2;
      audio.play().catch(() => {
        // Silently fail if audio can't play
      });
    }
  }, [isMuted]);

  const fireworksBurst = useCallback(() => {
    const colors = ['#c93a40', '#2d5f3f', '#f0c419', '#ffffff'];
    
    // Single big burst
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: colors,
      zIndex: 9999,
    });

    // Add celebratory sound effect if not muted
    if (!isMuted) {
      const audio = new Audio('https://cdn.pixabay.com/audio/2022/03/24/audio_a9107de3bb.mp3');
      audio.volume = 0.2;
      audio.play().catch(() => {
        // Silently fail if audio can't play
      });
    }
  }, [isMuted]);

  return { celebrate, fireworksBurst };
};
