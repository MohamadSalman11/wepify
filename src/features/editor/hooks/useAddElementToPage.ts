import { useDispatch } from 'react-redux';
import { ElementNames, TAGS_WITHOUT_CHILDREN, type ELEMENTS_TEMPLATE } from '../../../constant';
import { useAppSelector } from '../../../store';
import type { GridElement, PageElement } from '../../../types';
import { calculateNewGridColumns } from '../../../utils/calculateNewGridColumns';
import { createNewElement } from '../helpers/createElement';
import { addElement, setNewElement, updateElement } from '../slices/pageSlice';
import { selectElement, setSelectLastUpdates, updateSelectElement } from '../slices/selectionSlice';

export const useAddElementToPage = () => {
  const dispatch = useDispatch();
  const page = useAppSelector((state) => state.page);
  const { selectedElement, lastSelectedSection } = useAppSelector((state) => state.selection.present);

  function addElementToPage(elementName: keyof typeof ELEMENTS_TEMPLATE, additionalProps?: Record<string, any>) {
    const selection = TAGS_WITHOUT_CHILDREN.has(selectedElement.tag)
      ? (page.elements.find((el) => el.id === lastSelectedSection) as PageElement)
      : selectedElement;

    const { newElement, children } = createNewElement(elementName, page.elements, selection.children, additionalProps);
    const payload = { id: selection.id, updates: { children } };

    if (selection.name === ElementNames.Grid) {
      const updates = payload.updates as { children: PageElement[]; columns: number };
      const selectionGrid = selection as GridElement;

      updates.columns = calculateNewGridColumns(selectionGrid, (selection.children as PageElement[]).length);
      dispatch(setSelectLastUpdates({ columns: updates.columns, columnWidth: selectionGrid.columnWidth }));
    }

    dispatch(setNewElement(newElement));

    if (newElement.name !== ElementNames.Grid) {
      dispatch(selectElement(newElement));
    }

    if (newElement.name === ElementNames.Section) {
      dispatch(addElement(newElement));
      return;
    }

    dispatch(updateElement(payload));
    dispatch(updateSelectElement(payload.updates));
  }

  return { addElementToPage };
};
