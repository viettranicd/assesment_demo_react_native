// stores/navigationStore.ts
import { create } from 'zustand';

type NavigationStore = {
  currentPath: string;
  setCurrentPath: (path: string) => void;
};

export const getNavigationStore = create<NavigationStore>((set) => ({
  currentPath: '/',
  setCurrentPath: (path) => set({ currentPath: path }),
}));
