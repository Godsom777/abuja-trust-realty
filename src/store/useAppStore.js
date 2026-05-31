import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAppStore = create(
  persist(
    (set, get) => ({
      currency: 'ngn',
      savedProperties: [],
      viewMode: 'list',
      
      // Rates relative to 1 NGN (e.g. 1 NGN = X USD)
      // These are stable conversion rates based on market guidelines:
      // $1 USD = ₦1,500 NGN, £1 GBP = ₦1,900 NGN
      rates: {
        ngn: 1,
        usd: 1 / 1500,
        gbp: 1 / 1900
      },

      setCurrency: (currency) => set({ currency }),
      setViewMode: (viewMode) => set({ viewMode }),
      
      toggleSaveProperty: (propertyId) => {
        const { savedProperties } = get();
        const exists = savedProperties.includes(propertyId);
        const updated = exists
          ? savedProperties.filter(id => id !== propertyId)
          : [...savedProperties, propertyId];
        set({ savedProperties: updated });
      },

      isPropertySaved: (propertyId) => {
        return get().savedProperties.includes(propertyId);
      }
    }),
    {
      name: 'abujatrust-app-storage', // name of the item in localStorage
      // Avoid Next.js hydration issues by using a custom partialize or custom storage wait
      skipHydration: true,
    }
  )
);
