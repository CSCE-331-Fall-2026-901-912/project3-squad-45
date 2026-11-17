// Boba Spin game settings. Segment weights are relative odds; a percent of 0 is a miss.
export const GAME = {
  SEGMENTS: [
    { id: 'off5', label: '5% off', percent: 5, weight: 30 },
    { id: 'miss-a', label: 'Try again', percent: 0, weight: 18 },
    { id: 'off10', label: '10% off', percent: 10, weight: 22 },
    { id: 'off15', label: '15% off', percent: 15, weight: 10 },
    { id: 'miss-b', label: 'Try again', percent: 0, weight: 12 },
    { id: 'off20', label: '20% off', percent: 20, weight: 3 },
  ],
  CODE_LENGTH: 8,
  // No 0, O, 1, I or L so codes are easy to read aloud.
  CODE_ALPHABET: 'ABCDEFGHJKMNPQRSTUVWXYZ23456789',
  CODE_TTL_MINUTES: 30,
  MAX_SPINS_PER_IP_PER_HOUR: 20,
};
