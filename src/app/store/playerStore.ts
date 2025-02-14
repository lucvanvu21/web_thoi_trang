import { create } from 'zustand';

interface PlayerState {
  activeServer: number | null;
  activeEpisodeIndex: number | null;
  currentEpisodeUrl: string | null;
  sub: string | null;
  path: string | null;
  setPath: (path: string) => void;
  setActiveServer: (server: number) => void;
  setActiveEpisodeIndex: (index: number) => void;
  setCurrentEpisodeUrl: (url: string) => void;
  setSub: (sub: string) => void;
  resetState: () => void;
}

export const usePlayerStore = create<PlayerState>(set => ({
  activeServer: 0,
  activeEpisodeIndex: 0,
  currentEpisodeUrl: null,
  sub: null,
  path: null,
  setPath: path => set({ path }),
  setActiveServer: server => set({ activeServer: server }),
  setActiveEpisodeIndex: index => set({ activeEpisodeIndex: index }),
  setCurrentEpisodeUrl: url => set({ currentEpisodeUrl: url }),
  setSub: sub => set({ sub }),
  resetState: () =>
    set({
      activeServer: null,
      activeEpisodeIndex: null,
      currentEpisodeUrl: null,
      sub: null,
    }),
}));
