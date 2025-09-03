import { getMergedResponsiveStyle } from '@compiler/utils/getMergedResponsiveStyle';
import { PageElementStyle } from '@shared/typing';
import { useAppSelector } from '../../../store';
import { selectCurrentElement } from '../slices/editorSlice';

export const useStyle = (): PageElementStyle => {
  const el = useAppSelector(selectCurrentElement);
  const device = useAppSelector((state) => state.editor.deviceSimulator.type);

  return getMergedResponsiveStyle(el.style, el.responsive, device);
};
