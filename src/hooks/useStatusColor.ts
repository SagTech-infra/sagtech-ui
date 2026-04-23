export type StatusTone = 'success' | 'warning' | 'error' | 'info' | 'neutral';

export interface StatusMeta {
  tone: StatusTone;
  label: string;
  badgeColor: 'success' | 'warning' | 'error' | 'blue' | 'grey';
}

/**
 * Maps a status string to a visual tone. Unknown statuses fall back to neutral.
 * Custom mapping overrides the default matcher.
 */
export function useStatusColor(
  status: string | undefined | null,
  customMap?: Record<string, StatusMeta>,
): StatusMeta {
  if (!status) {
    return { tone: 'neutral', label: 'Unknown', badgeColor: 'grey' };
  }
  const key = status.toLowerCase();
  if (customMap && customMap[key]) return customMap[key];
  if (customMap && customMap[status]) return customMap[status];

  if (['active', 'live', 'success', 'completed', 'approved', 'published', 'paid'].includes(key)) {
    return { tone: 'success', label: status, badgeColor: 'success' };
  }
  if (['pending', 'paused', 'in_progress', 'in progress', 'draft', 'scheduled'].includes(key)) {
    return { tone: 'warning', label: status, badgeColor: 'warning' };
  }
  if (['failed', 'error', 'rejected', 'cancelled', 'canceled', 'blocked', 'overdue'].includes(key)) {
    return { tone: 'error', label: status, badgeColor: 'error' };
  }
  if (['info', 'new', 'beta'].includes(key)) {
    return { tone: 'info', label: status, badgeColor: 'blue' };
  }
  return { tone: 'neutral', label: status, badgeColor: 'grey' };
}
