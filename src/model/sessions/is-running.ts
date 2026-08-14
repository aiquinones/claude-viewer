// Signal 0 sends nothing and only asks whether the process is there. `EPERM` means it is and
// belongs to someone else, which still counts; `ESRCH` is the dead one. A syscall rather than a
// `ps` subprocess, so it costs nothing and behaves the same on every platform.
//
// Both CLIs need this and for the same reason: each writes a file naming its pid and neither can
// clean up after a crash, so the file alone is never proof.
export const isRunning = (pid: number): boolean => {
  try {
    process.kill(pid, 0);
    return true;
  } catch (caught) {
    return (caught as NodeJS.ErrnoException).code === 'EPERM';
  }
};
