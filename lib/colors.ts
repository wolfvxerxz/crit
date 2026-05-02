export const ORANGE = '#FF5512';
export const ORANGE_DARK = '#521700';
export const BG = '#111111';
export const SURFACE = '#191919';
export const BORDER = '#3A3A3A';
export const TEXT = '#EEEEEE';
export const TEXT_MUTED = '#7B7B7B';
export const TEXT_DIM = '#6E6E6E';

export const scoreColor = (score: number): string => {
  if (score >= 75) return '#22c55e';
  if (score >= 55) return '#f59e0b';
  return ORANGE;
};

export const severityColor = (sev: string): string => {
  if (sev === 'critical') return ORANGE;
  if (sev === 'warning') return '#f59e0b';
  return '#22c55e';
};
