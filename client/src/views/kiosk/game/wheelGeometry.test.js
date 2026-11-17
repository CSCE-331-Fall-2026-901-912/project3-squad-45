import assert from 'node:assert/strict';
import { test } from 'node:test';
import { polarPoint, rotationForIndex, sliceAngle, slicePath } from './wheelGeometry.js';

test('sliceAngle divides the circle evenly', () => {
  assert.equal(sliceAngle(6), 60);
  assert.equal(sliceAngle(4), 90);
});

test('polarPoint measures clockwise from the top', () => {
  const top = polarPoint(100, 50, 0);
  assert.equal(Math.round(top.x), 100);
  assert.equal(Math.round(top.y), 50);
  const right = polarPoint(100, 50, 90);
  assert.equal(Math.round(right.x), 150);
  assert.equal(Math.round(right.y), 100);
});

test('slicePath draws a wedge from the center', () => {
  assert.match(slicePath(0, 4, 100, 100), /^M 100 100 L 100\.00 0\.00 A 100 100 0 0 1 200\.00 100\.00 Z$/);
});

test('rotationForIndex lands the slice middle at the top after full turns', () => {
  // With 6 slices, slice 0 is centered at 30 degrees, so it must rotate back by 30.
  assert.equal(rotationForIndex(0, 6, 5), 5 * 360 - 30);
  assert.equal(rotationForIndex(2, 6, 0), -150);
  // The slice center plus the rotation is a whole number of turns.
  assert.equal((((2 + 0.5) * 60) + rotationForIndex(2, 6, 3)) % 360, 0);
});
