import { EditorToIframe } from '@shared/constants';
import iframeConnection from '@shared/iframeConnection';
import { ComponentType, createContext, ReactNode, useContext, useState } from 'react';
import { LuChevronLeft } from 'react-icons/lu';
import styled, { css } from 'styled-components';
import Icon from '../../../components/Icon';
import { useAppSelector } from '../../../store';
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
  const { setLeftPanelOpen } = usePanel();
  const deviceSimulator = useAppSelector((state) => state.editor.deviceSimulator);

  const handleCloseLeftPanel = () => {
    setLeftPanelOpen(false);
    iframeConnection.send(EditorToIframe.DeviceChanged, { deviceSimulator });
  };

  return (
    <StyledPanel $sectioned={sectioned} $borderDir={borderDir}>
      {panel === 'settings' || (
        <StyledButton onClick={handleCloseLeftPanel}>
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

  ${({ $borderDir }) => css`border-${$borderDir}: var(--border-base);`}
`;

const PanelContainer = styled.div<{ $sectioned: boolean }>`
  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-width: thin;
  max-height: 100%;

  &::-webkit-scrollbar {
    width: 0.6rem;
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

  ${({ $sectioned }) =>
    !$sectioned &&
    css`
      & > ul,
      .masonry-grid {
        padding: 2.4rem;
      }

      & > span {
        margin: 3.2rem 2.4rem 0rem 2.4rem;
      }

      & > button {
        margin-top: 3.2rem;
        margin-left: 2.4rem;
        width: calc(100% - 4.5rem);
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

export const SectionTitle = styled.span`
  display: inline-block;
  font-size: 1.4rem;
`;
