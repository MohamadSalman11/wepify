import { ComponentType, createContext, ReactNode, useContext, useState } from 'react';
import { LuChevronLeft } from 'react-icons/lu';
import styled, { css } from 'styled-components';
import Icon from '../../../components/Icon';
import ElementsPanel from './ElementsPanel';
import LayersPanel from './LayersPanel';
import PagesPanel from './PagesPanel';
import SettingsPanel from './SettingsPanel';
import UploadsPanel from './UploadsPanel';

/**
 * Constants
 */

const DEFAULT_BORDER_DIRECTION = 'right';

const PANEL_COMPONENTS: Record<PanelKey, ComponentType> = {
  elements: ElementsPanel,
  settings: SettingsPanel,
  pages: PagesPanel,
  layers: LayersPanel,
  uploads: UploadsPanel
};

/**
 * Types
 */

type BorderDirection = 'right' | 'left';
type PanelKey = 'elements' | 'settings' | 'pages' | 'layers' | 'uploads';

interface PanelProps {
  panel: PanelKey;
  sectioned?: boolean;
  borderDir?: BorderDirection;
}

interface PanelContextProps {
  leftPanelOpen: boolean;
  setLeftPanelOpen: (val: boolean) => void;
}

/**
 * Component definition
 */

export default function Panel({ panel, sectioned = false, borderDir = DEFAULT_BORDER_DIRECTION }: PanelProps) {
  const PanelComponent = PANEL_COMPONENTS[panel];
  const { leftPanelOpen, setLeftPanelOpen } = usePanel();

  return (
    <StyledPanel $sectioned={sectioned} $borderDir={borderDir}>
      {panel === 'settings' || (
        <StyledButton
          onClick={() => {
            setLeftPanelOpen(!leftPanelOpen);
          }}
        >
          <Icon icon={LuChevronLeft} size='md' />
        </StyledButton>
      )}
      <PanelContainer $sectioned={sectioned}>
        <PanelComponent />
      </PanelContainer>
    </StyledPanel>
  );
}

const PanelContext = createContext<PanelContextProps | null>(null);

export const PanelProvider = ({ children }: { children: ReactNode }) => {
  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  return <PanelContext.Provider value={{ leftPanelOpen, setLeftPanelOpen }}>{children}</PanelContext.Provider>;
};

export const usePanel = () => {
  const context = useContext(PanelContext);

  if (!context) {
    throw new Error('usePanel must be used within a <PanelProvider>');
  }

  return context;
};

/**
 * Styles
 */

const StyledPanel = styled.div<{ $sectioned: boolean; $borderDir: BorderDirection }>`
  position: relative;
  background-color: var(--color-white);
  z-index: var(--zindex-panel);

  padding: ${({ $sectioned }) => ($sectioned ? '0' : '3.2rem 2.4rem')};
  ${({ $borderDir }) => css`border-${$borderDir}: var(--border-base);`}
`;

const PanelContainer = styled.div<{ $sectioned: boolean }>`
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-width: none;
  max-height: 100%;

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

const StyledButton = styled.button`
  position: absolute;
  right: 0;
  top: 52%;
  transform: translate(50%, -50%);
  background-color: var(--color-white);
  padding: 0.6rem 0.2rem;
  box-shadow: var(--box-shadow);
  border-radius: var(--border-radius-lg);

  svg {
    margin-top: 0.15rem;
    margin-left: 0.1rem;
  }
`;
