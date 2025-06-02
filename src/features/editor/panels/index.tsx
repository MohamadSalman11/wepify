import styled, { css } from 'styled-components';

import ElementsPanel from './ElementsPanel';
import LayersPanel from './LayersPanel';
import PagesPanel from './PagesPanel';
import SettingsPanel from './SettingsPanel';
import UploadsPanel from './UploadsPanel';

type PanelKey = 'elements' | 'settings' | 'pages' | 'layers' | 'uploads';
type BorderDirection = 'right' | 'left';

const PanelContainer = styled.div<{ sectioned: boolean; borderDir: BorderDirection }>`
  background-color: var(--color-black-light-2);
  overflow-y: auto;
  padding: ${({ sectioned }) => (sectioned ? '0' : '3.2rem 2.4rem')};
  ${({ borderDir }) => css`border-${borderDir}: var(--border-base);`}

  &::-webkit-scrollbar {
    display: none;
  }

  ${({ sectioned }) =>
    sectioned &&
    css`
      & > div {
        display: flex;
        flex-direction: column;
        border-bottom: var(--border-base);
        padding: 3.2rem 2.4rem;
        width: 100%;
      }
    `}
`;

const panelComponents: Record<PanelKey, React.ComponentType> = {
  elements: ElementsPanel,
  settings: SettingsPanel,
  pages: PagesPanel,
  layers: LayersPanel,
  uploads: UploadsPanel
};

function Panel({
  panel,
  sectioned = false,
  borderDir = 'right'
}: {
  panel: PanelKey;
  sectioned?: boolean;
  borderDir?: BorderDirection;
}) {
  const PanelComponent = panelComponents[panel];

  return (
    <PanelContainer sectioned={sectioned} borderDir={borderDir}>
      <PanelComponent />
    </PanelContainer>
  );
}

export default Panel;
