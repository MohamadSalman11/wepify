import { Title, type HandleStyleChanges } from '.';
import Input from '../../../../components/form/Input';
import { useAppSelector } from '../../../../store';
import type { LinkElement } from '../../../../types';

/**
 * Component definition
 */

function LinkSettings({ handleStyleChanges }: { handleStyleChanges: HandleStyleChanges }) {
  const selection = useAppSelector((state) => state.selection.selectedElement) as LinkElement;

  return (
    <div>
      <Title>Link</Title>
      <div>
        <Input
          type='text'
          defaultValue={selection.link}
          placeholder='https://example.com'
          onChange={(e) => handleStyleChanges(e.target.value, 'link')}
        />
      </div>
    </div>
  );
}

export default LinkSettings;
