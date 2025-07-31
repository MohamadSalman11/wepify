import styled, { css } from 'styled-components';
import ElementsPanel from './ElementsPanel';
import LayersPanel from './LayersPanel';
import PagesPanel from './PagesPanel';
import SettingsPanel from './SettingsPanel';
import UploadsPanel from './UploadsPanel';

/**
 * Constants
 */

const DEFAULT_BORDER_DIRECTION = 'right';

const PANEL_COMPONENTS: Record<PanelKey, React.ComponentType> = {
  elements: ElementsPanel,
  settings: SettingsPanel,
  pages: PagesPanel,
  layers: LayersPanel,
  uploads: UploadsPanel
};

/**
 * Types
 */

type PanelKey = 'elements' | 'settings' | 'pages' | 'layers' | 'uploads';
type BorderDirection = 'right' | 'left';

interface PanelProps {
  panel: PanelKey;
  sectioned?: boolean;
  borderDir?: BorderDirection;
}

/**
 * Component definition
 */

export default function Panel({ panel, sectioned = false, borderDir = DEFAULT_BORDER_DIRECTION }: PanelProps) {
  const PanelComponent = PANEL_COMPONENTS[panel];

  return (
    <PanelContainer $sectioned={sectioned} $borderDir={borderDir}>
      <PanelComponent />
    </PanelContainer>
  );
}

/**
 * Styles
 */

const PanelContainer = styled.div<{ $sectioned: boolean; $borderDir: BorderDirection }>`
  background-color: var(--color-white);
  overflow-y: auto;
  padding: ${({ $sectioned }) => ($sectioned ? '0' : '3.2rem 2.4rem')};
  ${({ $borderDir }) => css`border-${$borderDir}: var(--border-base);`}

  &::-webkit-scrollbar {
    display: none;
  }

  ${({ $sectioned }) =>
    $sectioned &&
    css`
      & > div {
        display: flex;
        flex-direction: column;
        border-bottom: var(--border-base);
        padding: 3.2rem 2.2rem;
        width: 100%;
      }
    `}
`;
