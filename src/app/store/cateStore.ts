import { CategoryType } from '@/types/indexType';
import { create } from 'zustand';

type CategoryStore = {
  categories: CategoryType[];
  setCategories: (categories: CategoryType[]) => void;
};

export const useCategoryStore = create<CategoryStore>(set => ({
  categories: [],
  setCategories: categories => set({ categories }),
}));
