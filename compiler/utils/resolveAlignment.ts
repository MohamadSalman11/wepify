import { AlignmentName, AlignmentValue, FlexDirectionOption } from '../../src/features/editor/panels/SettingsPanel';

const DEFAULT_FLEX_DIRECTION = 'column';

const ALIGNMENT_RESOLUTION_MAP = {
  'justifyContent:flex-start': {
    column: ['alignItems', 'flex-start'],
    row: ['justifyContent', 'flex-start'],
    'column-reverse': ['alignItems', 'flex-start'],
    'row-reverse': ['justifyContent', 'flex-end']
  },
  'justifyContent:flex-end': {
    column: ['alignItems', 'flex-end'],
    row: ['justifyContent', 'flex-end'],
    'column-reverse': ['alignItems', 'flex-end'],
    'row-reverse': ['justifyContent', 'flex-start']
  },
  'justifyContent:center': {
    column: ['alignItems', 'center'],
    row: ['justifyContent', 'center'],
    'column-reverse': ['alignItems', 'center'],
    'row-reverse': ['justifyContent', 'center']
  },
  'alignItems:flex-start': {
    column: ['justifyContent', 'flex-start'],
    row: ['alignItems', 'flex-start'],
    'column-reverse': ['justifyContent', 'flex-end'],
    'row-reverse': ['alignItems', 'flex-start']
  },
  'alignItems:flex-end': {
    column: ['justifyContent', 'flex-end'],
    row: ['alignItems', 'flex-end'],
    'column-reverse': ['justifyContent', 'flex-start'],
    'row-reverse': ['alignItems', 'flex-end']
  },
  'alignItems:center': {
    column: ['justifyContent', 'center'],
    row: ['alignItems', 'center'],
    'column-reverse': ['justifyContent', 'center'],
    'row-reverse': ['alignItems', 'center']
  }
};

export const resolveAlignment = (
  targetName: AlignmentName,
  targetValue: AlignmentValue,
  flexDirection: FlexDirectionOption
): [AlignmentName, AlignmentValue] => {
  return (ALIGNMENT_RESOLUTION_MAP[`${targetName}:${targetValue}`]?.[flexDirection] ?? [targetName, targetValue]) as [
    AlignmentName,
    AlignmentValue
  ];
};

export const reverseResolveAlignment = (
  targetName: AlignmentName,
  targetValue: AlignmentValue,
  flexDirection: FlexDirectionOption = DEFAULT_FLEX_DIRECTION
): [AlignmentName, AlignmentValue] => {
  const entries = Object.entries(ALIGNMENT_RESOLUTION_MAP);

  for (const [key, directionMap] of entries) {
    const [originalName, originalValue] = key.split(':') as [AlignmentName, AlignmentValue];
    const [resolvedName, resolvedValue] = directionMap[flexDirection];

    if (resolvedName === targetName && resolvedValue === targetValue) {
      return [originalName, originalValue];
    }
  }

  return [targetName, targetValue];
};
