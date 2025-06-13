import { useDispatch } from 'react-redux';
import type { ELEMENTS_TEMPLATE } from '../../../constant';
import { useAppSelector } from '../../../store';
import type { GridElement, PageElement } from '../../../types';
import { calculateNewGridColumns } from '../../../utils/calculateNewGridColumns';
import { createNewElement } from '../helpers/createElement';
import { addElement, setNewElement, updateElement } from '../slices/pageSlice';
import { selectElement, setSelectLastUpdates, updateSelectElement } from '../slices/selectionSlice';

export function useAddElementToPage() {
  const dispatch = useDispatch();
  const page = useAppSelector((state) => state.page);
  const { selectedElement, lastSelectedSection } = useAppSelector((state) => state.selection);

  function addElementToPage(elementName: keyof typeof ELEMENTS_TEMPLATE, additionalProps?: Record<string, any>) {
    const selection =
      selectedElement.name === 'img'
        ? (page.elements.find((el) => el.id === lastSelectedSection) as PageElement)
        : selectedElement;

    console.log(selection);

    const { newElement, children } = createNewElement(elementName, page.elements, selection.children, additionalProps);
    const payload = { id: selection.id, updates: { children } };

    if (selection.name === 'grid') {
      (payload.updates as GridElement).columns = calculateNewGridColumns(
        selection as GridElement,
        selection.children.length
      );

      dispatch(setSelectLastUpdates({ columns: payload.updates.columns, columnWidth: selection.columnWidth }));
    }

    dispatch(setNewElement(newElement));

    if (newElement.name !== 'grid') {
      dispatch(selectElement(newElement));
    }

    if (newElement.name === 'section') {
      dispatch(addElement(newElement));
      return;
    }

    dispatch(updateElement(payload));
    dispatch(updateSelectElement(payload.updates));
  }

  return { addElementToPage };
}
