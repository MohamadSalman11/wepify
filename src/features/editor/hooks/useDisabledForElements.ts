// hooks/useDisabledForElement.ts
import { ElementsName } from '@shared/constants';
import { useAppSelector } from '../../../store';
import { selectCurrentElement } from '../editorSlice';

type DisabledRule = {
  whitelist?: ElementsName[]; // only enabled for these
  blacklist?: ElementsName[]; // disabled for these
};

const ELEMENT_DISABLED_RULES: Record<ElementsName, DisabledRule> = {
  [ElementsName.Container]: { blacklist: [ElementsName.Grid, ElementsName.Link] },
  [ElementsName.GridItem]: { whitelist: [ElementsName.Grid] },
  [ElementsName.ListItem]: { whitelist: [ElementsName.List] }
};

export const useElementDisable = () => {
  const selectedElement = useAppSelector(selectCurrentElement);

  const isDisabled = (feature: ElementsName) => {
    if (!selectedElement.name) {
      return true;
    }

    const rule = ELEMENT_DISABLED_RULES[feature];

    if (!rule) {
      return true;
    }

    return rule.whitelist
      ? !rule.whitelist.includes(selectedElement.name)
      : rule.blacklist?.includes(selectedElement.name);
  };

  return { isDisabled };
};
