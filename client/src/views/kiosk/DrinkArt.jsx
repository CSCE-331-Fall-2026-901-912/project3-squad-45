// Decorative cup illustration, colored by menu category. Photos can replace it through `imageUrl`.
const PALETTES = {
  'Milk Tea': { liquid: '#c99a6b', accent: '#7a4a2a', pearls: true },
  'Fruit Tea': { liquid: '#f39a4f', accent: '#c4571d', pearls: false },
  'Classic Tea': { liquid: '#a9c26a', accent: '#5f7a2c', pearls: false },
  Slush: { liquid: '#ff93b8', accent: '#d2467a', pearls: false },
  Specialty: { liquid: '#9c78cf', accent: '#5b3a8c', pearls: true },
};
const FALLBACK = PALETTES['Milk Tea'];
const PEARL_POSITIONS = [[36, 118], [50, 124], [64, 116], [44, 110], [58, 108], [72, 122]];

export default function DrinkArt({ category, imageUrl, className = '' }) {
  if (imageUrl) return <img className={`drink-art ${className}`} src={imageUrl} alt="" />;
  const { liquid, accent, pearls } = PALETTES[category] ?? FALLBACK;
  return (
    <svg className={`drink-art ${className}`} viewBox="0 0 100 140" aria-hidden="true" focusable="false">
      <rect x="62" y="2" width="6" height="40" rx="3" fill={accent} transform="rotate(12 65 20)" />
      <path d="M22 30 H78 L72 128 Q71 136 63 136 H37 Q29 136 28 128 Z" fill="#fff" fillOpacity="0.55" stroke={accent} strokeWidth="2.5" />
      <path d="M25 52 H75 L71 126 Q70 133 63 133 H37 Q30 133 29 126 Z" fill={liquid} />
      <rect x="18" y="22" width="64" height="10" rx="5" fill={accent} />
      {pearls && PEARL_POSITIONS.map(([cx, cy]) => <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="4.5" fill="#2b1411" />)}
      <path d="M34 60 Q32 90 36 112" stroke="#fff" strokeOpacity="0.5" strokeWidth="4" strokeLinecap="round" fill="none" />
    </svg>
  );
}
