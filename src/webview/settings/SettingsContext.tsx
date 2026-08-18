import { createContext, ReactNode, useContext } from 'react';
import { DEFAULT_SETTINGS, ViewerSettings } from '../../model/settings/settings';
import { UsageMetric, UsageScope } from '../../model/usage/types';

// The usage surface's toggles write settings back. Every other setting here is read-only to the
// panel and changed in the Settings UI; these two are controls on the surface itself, because
// which number you're looking at is part of reading it.
export interface UsageSettingsChange {
  metric?: UsageMetric;
  scope?: UsageScope;
}

// Everything about settings the webview has: the values, and the ways to change them. One context
// rather than props, because a budget is read at the bottom of the tree — SkillCost is five
// parents down from App — and threading it would mean every component in between knowing.
interface SettingsBridge {
  settings: ViewerSettings;
  openSettings: () => void;
  setUsage: (change: UsageSettingsChange) => void;
}

// The defaults are the context's default value, not `undefined`, so a component below no provider
// still reads a budget and still renders. That's what keeps every existing story working with no
// decorator; a story that wants a different budget wraps itself.
const SettingsContext = createContext<SettingsBridge>({
  settings: DEFAULT_SETTINGS,
  openSettings: () => undefined,
  setUsage: () => undefined
});

interface SettingsProviderProps extends Partial<SettingsBridge> {
  children: ReactNode;
}

export const SettingsProvider = ({
  settings = DEFAULT_SETTINGS,
  openSettings = () => undefined,
  setUsage = () => undefined,
  children
}: SettingsProviderProps) => (
  <SettingsContext.Provider value={{ settings, openSettings, setUsage }}>
    {children}
  </SettingsContext.Provider>
);

export const useSettings = (): ViewerSettings => useContext(SettingsContext).settings;

export const useOpenSettings = (): (() => void) => useContext(SettingsContext).openSettings;

export const useSetUsage = (): ((change: UsageSettingsChange) => void) =>
  useContext(SettingsContext).setUsage;
