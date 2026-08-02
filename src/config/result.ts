// Every config read returns one of these instead of throwing. A malformed file on disk is
// expected input, so it travels as a value the caller has to look at.
export type Result<T, E> = { ok: true; value: T } | { ok: false; error: E };

export const ok = <T>(value: T): Result<T, never> => ({ ok: true, value });

export const err = <E>(error: E): Result<never, E> => ({ ok: false, error });

export type ConfigErrorKind = 'not-found' | 'unreadable' | 'malformed';

export interface ConfigError {
  kind: ConfigErrorKind;
  path: string;
  message: string;
}

export const configError = (kind: ConfigErrorKind, path: string, message: string): ConfigError => ({
  kind,
  path,
  message
});
