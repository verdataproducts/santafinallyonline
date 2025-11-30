import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SoundStore {
  isMuted: boolean;
  toggleMute: () => void;
}

export const useSoundStore = create<SoundStore>()(
  persist(
    (set) => ({
      isMuted: false,
      toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
    }),
    {
      name: 'sound-settings',
    }
  )
);
