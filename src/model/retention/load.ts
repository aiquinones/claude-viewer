// How long Claude Code keeps a transcript before deleting it, and which settings file said so.
//
// This is the one number that explains the shape of the Sessions grid. Claude Code runs a sweep at
// startup and deletes anything under `projects/` older than `cleanupPeriodDays`, so the history on
// disk can't reach further back than that — and a grid drawn over a longer span is mostly empty by
// construction, which reads as the extension having failed to find something.
//
// Read-only, like everything else here: this reports the setting, it never writes it.

import { platform } from 'node:os';
import { join } from 'node:path';
import { readTextFile } from '../../config/read';
import { ConfigError, Result } from '../../config/result';
import { userClaudeDir } from '../../config/paths';
import { parseCleanupPeriod } from './retention-schema';
import { DEFAULT_RETENTION, Retention, RetentionSource } from './types';

// Where an administrator's settings live. Per-platform, and absent on most machines — read first
// because Claude Code applies it over everything else, including a value you set yourself.
const managedSettingsPath = (): string => {
  if (platform() === 'darwin') {
    return '/Library/Application Support/ClaudeCode/managed-settings.json';
  }
  if (platform() === 'win32') {
    return join(
      process.env.PROGRAMDATA ?? 'C:\\ProgramData',
      'ClaudeCode',
      'managed-settings.json'
    );
  }
  return '/etc/claude-code/managed-settings.json';
};

interface Layer {
  source: RetentionSource;
  path: string;
}

// Highest precedence first. A layer that doesn't exist, doesn't parse, or doesn't set the key is
// skipped — the same fall-through the budget settings use, and for the same reason: reporting a
// source whose value isn't the one in force would make the explanation worse than none.
const layers = (workspaceRoot: string | undefined): Layer[] => {
  const found: Layer[] = [{ source: 'managed', path: managedSettingsPath() }];

  if (workspaceRoot) {
    found.push({
      source: 'local',
      path: join(workspaceRoot, '.claude', 'settings.local.json')
    });
    found.push({ source: 'project', path: join(workspaceRoot, '.claude', 'settings.json') });
  }

  found.push({ source: 'user', path: join(userClaudeDir(), 'settings.json') });
  return found;
};

export const loadRetention = async (workspaceRoot: string | undefined): Promise<Retention> => {
  for (const layer of layers(workspaceRoot)) {
    const read: Result<string, ConfigError> = await readTextFile(layer.path);
    if (!read.ok) continue;

    const days: number | undefined = parseCleanupPeriod(read.value);
    if (days === undefined) continue;

    return { days, source: layer.source, path: layer.path };
  }

  return DEFAULT_RETENTION;
};
