// Geometry for the Boba Spin wheel. Angles are degrees clockwise from the top (12 o'clock).
const RADIANS_PER_DEGREE = Math.PI / 180;
const FULL_TURN = 360;

export const sliceAngle = (count) => FULL_TURN / count;

// Point on a circle of `radius` around (center, center) at `degrees` clockwise from the top.
export function polarPoint(center, radius, degrees) {
  const radians = degrees * RADIANS_PER_DEGREE;
  return { x: center + radius * Math.sin(radians), y: center - radius * Math.cos(radians) };
}

export function slicePath(index, count, center, radius) {
  const angle = sliceAngle(count);
  const start = polarPoint(center, radius, index * angle);
  const end = polarPoint(center, radius, (index + 1) * angle);
  const largeArc = angle > 180 ? 1 : 0;
  return `M ${center} ${center} L ${start.x.toFixed(2)} ${start.y.toFixed(2)} `
    + `A ${radius} ${radius} 0 ${largeArc} 1 ${end.x.toFixed(2)} ${end.y.toFixed(2)} Z`;
}

// Total clockwise rotation that parks the middle of slice `index` under the pointer at the top.
export const rotationForIndex = (index, count, turns) =>
  turns * FULL_TURN - (index + 0.5) * sliceAngle(count);
