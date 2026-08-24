export type AppThemeSetting = 'system' | 'light' | 'dark';

export interface AppSettings {
  theme: AppThemeSetting;
  notificationsEnabled: boolean;
  reminderWaterTest: boolean;
  reminderWeeklyMaint: boolean;
  reminderChemicals: boolean;
}

const SETTINGS_KEY = 'bazen_app_settings_v1';

export const DEFAULT_SETTINGS: AppSettings = {
  theme: 'system',
  notificationsEnabled: true,
  reminderWaterTest: true,
  reminderWeeklyMaint: true,
  reminderChemicals: true,
};

export const getStoredSettings = (): AppSettings => {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_SETTINGS,
      ...parsed,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
};

export const saveStoredSettings = (newSettings: Partial<AppSettings> | AppSettings): AppSettings => {
  try {
    const current = getStoredSettings();
    const merged: AppSettings = {
      ...current,
      ...newSettings,
    };
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(merged));
    return merged;
  } catch (err) {
    console.error('Failed to save settings to localStorage', err);
    return {
      ...DEFAULT_SETTINGS,
      ...newSettings,
    };
  }
};

/**
 * Helper to determine whether the effective theme is dark
 */
export const getIsEffectiveDark = (themeSetting: AppThemeSetting): boolean => {
  if (themeSetting === 'dark') return true;
  if (themeSetting === 'light') return false;
  // 'system'
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  return false;
};
