import { ElementsName } from '@shared/constants';
import { useAppSelector } from '../../../store';
import { selectCurrentElement } from '../editorSlice';

export enum Settings {
  Alignment = 'alignment',
  Size = 'size',
  Link = 'link',
  Input = 'input',
  Grid = 'grid',
  Flex = 'flex',
  Space = 'space',
  Typography = 'typography',
  Fill = 'fill',
  Stroke = 'stroke',
  Page = 'page'
}

const ELEMENTS_MEDIA = [ElementsName.Image];

const ELEMENTS_TEXT = [
  ElementsName.Heading,
  ElementsName.Text,
  ElementsName.Link,
  ElementsName.Button,
  ElementsName.Input
];

const SETTINGS_RULES: Record<string, VisibilityRule> = {
  [Settings.Alignment]: {
    blacklist: [
      ElementsName.Grid,
      ElementsName.List,
      ElementsName.ListItem,
      ElementsName.Heading,
      ElementsName.Text,
      ElementsName.Link,
      ElementsName.Input,
      ...ELEMENTS_MEDIA
    ]
  },
  [Settings.Size]: { blacklist: [ElementsName.GridItem, ElementsName.ListItem] },
  [Settings.Link]: { whitelist: [ElementsName.Link] },
  [Settings.Input]: { whitelist: [ElementsName.Input] },
  [Settings.Grid]: { whitelist: [ElementsName.Grid] },
  [Settings.Flex]: { blacklist: [ElementsName.Grid, ElementsName.ListItem, ...ELEMENTS_TEXT, ...ELEMENTS_MEDIA] },
  [Settings.Typography]: { blacklist: [...ELEMENTS_MEDIA] },
  [Settings.Fill]: { blacklist: [...ELEMENTS_MEDIA] }
};

type VisibilityRule = {
  whitelist?: ElementsName[]; // only enabled for these
  blacklist?: ElementsName[]; // disabled for these
};

export const useSettingsVisibility = () => {
  const selectedElementName = useAppSelector(selectCurrentElement).name;

  const isVisible = (setting: keyof typeof SETTINGS_RULES) => {
    if (!selectedElementName) {
      return false;
    }

    const rule = SETTINGS_RULES[setting];

    if (!rule) {
      return false;
    }

    return rule.whitelist
      ? !rule.whitelist.includes(selectedElementName)
      : rule.blacklist?.includes(selectedElementName);
  };

  return { isVisible };
};
