import type { MoveableProps } from 'moveable';

export const MOVEABLE_CONFIG: MoveableProps = {
  target: null,
  draggable: true,
  dragTarget: null,
  resizable: true,
  scalable: true,
  rotatable: true,
  dragTargetSelf: true,
  origin: true,
  snappable: true,
  snapDirections: {
    left: true,
    top: true,
    right: true,
    bottom: true,
    center: true,
    middle: true
  },
  elementSnapDirections: {
    left: true,
    top: true,
    right: true,
    bottom: true,
    center: true,
    middle: true
  },
  snapRotationDegrees: [0, 45, 90, 135, 180, 225, 270, 315]
};
