import { GAME } from '../../../config/game';
import { polarPoint, rotationForIndex, slicePath, sliceAngle } from './wheelGeometry';

const CENTER = GAME.WHEEL_SIZE / 2;
const RADIUS = CENTER - 6;
const LABEL_RADIUS = RADIUS * 0.62;
const SLICE_STYLES = ['a', 'b'];

// SVG wheel. `targetIndex` is where it should stop; null leaves it at rest.
export default function SpinWheel({ segments, targetIndex, spinning }) {
  const angle = sliceAngle(segments.length);
  const rotation = targetIndex === null ? 0 : rotationForIndex(targetIndex, segments.length, GAME.EXTRA_TURNS);

  return (
    <div className="wheel">
      <span className="wheel__pointer" aria-hidden="true" />
      <svg className="wheel__svg" viewBox={`0 0 ${GAME.WHEEL_SIZE} ${GAME.WHEEL_SIZE}`} aria-hidden="true" focusable="false"
           style={{ transform: `rotate(${rotation}deg)`, transitionDuration: spinning ? `${GAME.SPIN_DURATION_MS}ms` : '0ms' }}>
        {segments.map((segment, index) => {
          const label = polarPoint(CENTER, LABEL_RADIUS, (index + 0.5) * angle);
          const style = segment.percent === 0 ? 'miss' : SLICE_STYLES[index % SLICE_STYLES.length];
          return (
            <g key={segment.id} className={`wheel__slice wheel__slice--${style}`}>
              <path d={slicePath(index, segments.length, CENTER, RADIUS)} />
              <text x={label.x} y={label.y} textAnchor="middle" dominantBaseline="middle"
                    transform={`rotate(${(index + 0.5) * angle} ${label.x} ${label.y})`}>
                {segment.label}
              </text>
            </g>
          );
        })}
        <circle cx={CENTER} cy={CENTER} r="18" className="wheel__hub" />
      </svg>
    </div>
  );
}
