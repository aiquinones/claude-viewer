import { createContext, ReactNode, useCallback, useContext } from 'react';
import { estimateTokens, TokenEstimator } from '../../model/estimate-tokens';
import { DEFAULT_SETTINGS, SettingsSection, ViewerSettings } from '../../model/settings/settings';
import { ThemeMode } from '../../model/settings/theme';
import { UsageScope } from '../../model/usage/types';

// The usage surface's scope toggle writes its setting back. Every other setting here is read-only
// to the panel and changed in the Settings UI; this one is a control on the surface itself, because
// which sessions you're counting is part of reading it.
export interface UsageSettingsChange {
  scope: UsageScope;
}

// Everything about settings the webview has: the values, and the ways to change them. One context
// rather than props, because a budget is read at the bottom of the tree — SkillCost is five
// parents down from App — and threading it would mean every component in between knowing.
interface SettingsBridge {
  settings: ViewerSettings;
  openSettings: (section: SettingsSection) => void;
  setUsage: (change: UsageSettingsChange) => void;
  // The estimator dialog. It opens from any surface, so App owns it and this is how a number
  // buried in a row asks for it.
  openEstimator: () => void;
  setEstimator: (estimator: TokenEstimator) => void;
  // The panel menu's theme pick. Every mode the menu draws is one a setting may hold, so this goes
  // straight to the host — there is no "that one isn't built" case left to split on.
  setTheme: (mode: ThemeMode) => void;
  // The stage-naming dialog's Save. The whole map — a skill left out of it keeps its own name.
  setStageNames: (names: Record<string, string>) => void;
}

// The defaults are the context's default value, not `undefined`, so a component below no provider
// still reads a budget and still renders. That's what keeps every existing story working with no
// decorator; a story that wants a different budget wraps itself.
const SettingsContext = createContext<SettingsBridge>({
  settings: DEFAULT_SETTINGS,
  openSettings: () => undefined,
  setUsage: () => undefined,
  openEstimator: () => undefined,
  setEstimator: () => undefined,
  setTheme: () => undefined,
  setStageNames: () => undefined
});

interface SettingsProviderProps extends Partial<SettingsBridge> {
  children: ReactNode;
}

export const SettingsProvider = ({
  settings = DEFAULT_SETTINGS,
  openSettings = () => undefined,
  setUsage = () => undefined,
  openEstimator = () => undefined,
  setEstimator = () => undefined,
  setTheme = () => undefined,
  setStageNames = () => undefined,
  children
}: SettingsProviderProps) => (
  <SettingsContext.Provider
    value={{
      settings,
      openSettings,
      setUsage,
      openEstimator,
      setEstimator,
      setTheme,
      setStageNames
    }}
  >
    {children}
  </SettingsContext.Provider>
);

export const useSettings = (): ViewerSettings => useContext(SettingsContext).settings;

export const useOpenSettings = (): ((section: SettingsSection) => void) =>
  useContext(SettingsContext).openSettings;

export const useSetUsage = (): ((change: UsageSettingsChange) => void) =>
  useContext(SettingsContext).setUsage;

export const useOpenEstimator = (): (() => void) => useContext(SettingsContext).openEstimator;

export const useSetEstimator = (): ((estimator: TokenEstimator) => void) =>
  useContext(SettingsContext).setEstimator;

export const useSetTheme = (): ((mode: ThemeMode) => void) => useContext(SettingsContext).setTheme;

export const useSetStageNames = (): ((names: Record<string, string>) => void) =>
  useContext(SettingsContext).setStageNames;

export const useEstimator = (): TokenEstimator =>
  useContext(SettingsContext).settings.tokens.estimator.value;

// Chars → est. tokens under whatever estimator is set. The host reports what it read and this is
// where that becomes a number, so switching estimators costs no disk read at all.
export const useEstimate = (): ((chars: number) => number) => {
  const estimator: TokenEstimator = useEstimator();
  return useCallback((chars: number): number => estimateTokens({ chars, estimator }), [estimator]);
};
