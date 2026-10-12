export function createSupportPreferencesStore(adapter: {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
}): {
  load: () => Promise<{ selectedIds: string[]; note: string }>;
  save: (sheet: { selectedIds: string[]; note: string }) => Promise<void>;
  remove: () => Promise<void>;
};
