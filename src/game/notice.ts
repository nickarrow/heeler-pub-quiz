/** A degraded-storage notice, or null when persistence is healthy. Shown once,
 * quietly; it never interrupts play. Its own module so both the restore code and
 * the hook can name it without a circular import. */
export type StorageNotice =
  | null
  | 'discarded-unparseable-game'
  | 'in-memory-only'
