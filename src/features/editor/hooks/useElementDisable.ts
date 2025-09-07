import { ElementsName } from '@shared/constants';
import { useAppSelector } from '../../../store';
import { selectCurrentElement } from '../editorSlice';

const ELEMENTS_MEDIA = [ElementsName.Image];
const ELEMENTS_LAYOUT = [ElementsName.Grid, ElementsName.List, ElementsName.ListItem];

const ELEMENTS_TEXT = [
  ElementsName.Heading,
  ElementsName.Text,
  ElementsName.Link,
  ElementsName.Button,
  ElementsName.Input
];

const ELEMENTS_ALL = [...ELEMENTS_LAYOUT, ...ELEMENTS_TEXT, ...ELEMENTS_MEDIA];

const ELEMENT_DISABLED_RULES: Partial<Record<ElementsName, DisabledRule>> = {
  [ElementsName.Container]: { blacklist: ELEMENTS_ALL },
  [ElementsName.List]: { blacklist: ELEMENTS_ALL },
  [ElementsName.Heading]: { blacklist: ELEMENTS_ALL },
  [ElementsName.Text]: { blacklist: ELEMENTS_ALL },
  [ElementsName.Link]: { blacklist: ELEMENTS_ALL },
  [ElementsName.Button]: { blacklist: ELEMENTS_ALL },
  [ElementsName.Input]: { blacklist: ELEMENTS_ALL },
  [ElementsName.Image]: { blacklist: ELEMENTS_ALL },
  [ElementsName.Grid]: { blacklist: ELEMENTS_ALL },
  [ElementsName.GridItem]: { whitelist: [ElementsName.Grid], blacklist: [ElementsName.ListItem, ...ELEMENTS_TEXT] },
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
