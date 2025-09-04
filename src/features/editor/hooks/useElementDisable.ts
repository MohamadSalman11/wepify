// hooks/useDisabledForElement.ts
import { ElementsName } from '@shared/constants';
import { useAppSelector } from '../../../store';
import { selectCurrentElement } from '../editorSlice';

const DEFAULT_BLACKLIST_MEDIA = [ElementsName.Image];
const DEFAULT_BLACKLIST_LAYOUT = [ElementsName.Grid, ElementsName.List, ElementsName.ListItem];

const DEFAULT_BLACKLIST_TEXT = [
  ElementsName.Heading,
  ElementsName.Text,
  ElementsName.Link,
  ElementsName.Button,
  ElementsName.Input
];

const DEFAULT_BLACKLIST = [...DEFAULT_BLACKLIST_LAYOUT, ...DEFAULT_BLACKLIST_TEXT, ...DEFAULT_BLACKLIST_MEDIA];

const ELEMENT_DISABLED_RULES: Partial<Record<ElementsName, DisabledRule>> = {
  [ElementsName.Container]: {
    blacklist: DEFAULT_BLACKLIST
  },
  [ElementsName.List]: {
    blacklist: DEFAULT_BLACKLIST
  },
  [ElementsName.Heading]: {
    blacklist: DEFAULT_BLACKLIST
  },
  [ElementsName.Text]: {
    blacklist: DEFAULT_BLACKLIST
  },
  [ElementsName.Link]: {
    blacklist: DEFAULT_BLACKLIST
  },
  [ElementsName.Button]: {
    blacklist: DEFAULT_BLACKLIST
  },
  [ElementsName.Input]: {
    blacklist: DEFAULT_BLACKLIST
  },
  [ElementsName.Grid]: {
    blacklist: DEFAULT_BLACKLIST
  },
  [ElementsName.GridItem]: {
    whitelist: [ElementsName.Grid],
    blacklist: [ElementsName.ListItem, ...DEFAULT_BLACKLIST_TEXT]
  },
  [ElementsName.ListItem]: { whitelist: [ElementsName.List] }
};

type DisabledRule = {
  whitelist?: ElementsName[]; // only enabled for these
  blacklist?: ElementsName[]; // disabled for these
};

export const useElementDisable = () => {
  const selectedElementName = useAppSelector(selectCurrentElement).name;

  const isDisabled = (feature: ElementsName) => {
    if (!selectedElementName) {
      return true;
    }

    const rule = ELEMENT_DISABLED_RULES[feature];

    if (!rule) {
      return true;
    }

    return rule.whitelist
      ? !rule.whitelist.includes(selectedElementName)
      : rule.blacklist?.includes(selectedElementName);
  };

  return { isDisabled };
};
