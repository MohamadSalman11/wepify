// hooks/useDisabledForElement.ts
import { ElementsName } from '@shared/constants';
import { useAppSelector } from '../../../store';
import { selectCurrentElement } from '../editorSlice';

type VisibilityRule = {
  whitelist?: ElementsName[]; // only enabled for these
  blacklist?: ElementsName[]; // disabled for these
};

const SETTINGS_RULES: Record<string, VisibilityRule> = {};

export const useElementDisable = () => {
  const selectedElement = useAppSelector(selectCurrentElement);

  const isVisible = (setting: keyof typeof SETTINGS_RULES) => {
    if (!selectedElement.name) {
      return true;
    }

    const rule = SETTINGS_RULES[setting];

    if (!rule) {
      return true;
    }

    return rule.whitelist
      ? !rule.whitelist.includes(selectedElement.name)
      : rule.blacklist?.includes(selectedElement.name);
  };

  return { isVisible };
};
