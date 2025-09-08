import { nanoid } from '@reduxjs/toolkit';
import type { Site, SiteMetadata } from '@shared/typing';
import { useEffect, useRef, useState, type MouseEvent } from 'react';
import {
  LuCopy,
  LuDownload,
  LuEllipsis,
  LuEye,
  LuLayoutTemplate,
  LuLoader,
  LuPencilLine,
  LuStar,
  LuTrash2
} from 'react-icons/lu';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import Button from '../../../components/Button';
import Dropdown from '../../../components/Dropdown';
import Input from '../../../components/form/Input';
import Icon from '../../../components/Icon';
import Modal, { useModalContext, type OnCloseModal } from '../../../components/Modal';
import { Breakpoint, EditorPath, Path, StorageKey, ToastMessages } from '../../../constant';
import SiteExporter from '../../../SiteExporter';
import { AppStorage } from '../../../utils/appStorage';
import { AppToast } from '../../../utils/appToast';
import { buildPath } from '../../../utils/buildPath';
import { formatDate } from '../../../utils/formatDate';
import { formatSize } from '../../../utils/formatSize';
import { FormValidator } from '../../../utils/FormValidator';
import { deleteSite, duplicateSite, setProcessing, setSiteStarred, updateSite } from '../dashboardSlice';

/**
 * Constants
 */

const BODY_SCROLL_OFFSET = 75;

const MAX_SITE_NAME_LENGTH = 12;
const MAX_SITE_DESCRIPTION_LENGTH = 20;

/**
 * Types
 */

interface EmptyStateMessages {
  title: string;
  info: string;
}

/**
 * Component definition
 */

export default function SitesView({
  sites,
  title,
  emptyStateMessages
}: {
  sites: SiteMetadata[];
  title: string;
  emptyStateMessages: EmptyStateMessages;
}) {
  return (
    <StyledSiteView>
      <h2>{title}</h2>
      <SiteSection>
        <TableHead />
        <TableBody sites={sites} emptyStateMessages={emptyStateMessages} />
      </SiteSection>
    </StyledSiteView>
  );
}

function TableHead() {
  return (
    <header>
      <StyledTableHead>
        <h3>Name</h3>
        <h3>Description</h3>
        <h3>Size</h3>
        <h3>Pages</h3>
        <h3>Created</h3>
        <h3>Last Modified</h3>
      </StyledTableHead>
    </header>
  );
}

function TableBody({ sites, emptyStateMessages }: { sites: SiteMetadata[]; emptyStateMessages: EmptyStateMessages }) {
  const [top, setTop] = useState(0);
  const tableBodyRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const updateTop = () => {
      if (tableBodyRef.current) {
        const { top } = tableBodyRef.current.getBoundingClientRect();
        setTop(top);
      }
    };

    updateTop();
    window.addEventListener('resize', updateTop);
    return () => window.removeEventListener('resize', updateTop);
  }, []);

  const noSitesToDisplay = sites.length === 0;

  if (noSitesToDisplay) {
    return (
      <StyledBodySection ref={tableBodyRef} $top={top}>
        <article>
          <div>
            <NoResultsWrapper>
              <NoResultsMessage>{emptyStateMessages.title}</NoResultsMessage>
              <NoResultsInfo>{emptyStateMessages.info}</NoResultsInfo>
            </NoResultsWrapper>
          </div>
        </article>
      </StyledBodySection>
    );
  }

  return (
    <StyledBodySection ref={tableBodyRef} $top={top}>
      {sites.map((site) => (
        <Modal key={site.id}>
          <TableRow site={site} />
        </Modal>
      ))}
    </StyledBodySection>
  );
}

function TableRow({ site }: { site: SiteMetadata }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { open } = useModalContext();
  const { id, name, description, sizeKb, pagesCount, createdAt, lastModified, isStarred } = site;

  const toggleStar = () => {
    const message = isStarred ? ToastMessages.site.removedStar : ToastMessages.site.addedStar;

    dispatch(setSiteStarred({ id, isStarred: !isStarred }));
    AppToast.success(message);
  };

  const handleDuplicateSite = () => {
    const icon = <StyledLoader icon={LuLoader} color='var(--color-primary)' size='md' />;

    AppToast.custom(ToastMessages.site.duplicating, { icon });
    dispatch(duplicateSite({ id, newId: nanoid() }));
  };

  const handleRowClick = async (event: MouseEvent<HTMLElement>) => {
    const target = event.target as HTMLElement;

    if (!target.closest('svg') && !target.closest('li')) {
      navigate(buildPath(Path.Editor, { siteId: id, pageId: site.firstPageId }));
    }
  };

  const handleSiteDownload = async () => {
    const icon = <StyledLoader icon={LuLoader} color='var(--color-primary)' size='md' />;

    dispatch(setProcessing(true));
    AppToast.custom(ToastMessages.site.downloading, { icon });

    const sites = await AppStorage.get(StorageKey.Sites, {});
    const siteToDownload = sites[site.id as keyof typeof sites];

    if (siteToDownload) {
      setTimeout(() => {
        AppToast.dismiss();
        dispatch(setProcessing(false));
        new SiteExporter(siteToDownload as Site, true).downloadZip();
      }, 1000);
    }
  };

  const handlePreviewSite = () => {
    navigate(`${buildPath(Path.Editor, { siteId: site.id, pageId: site.firstPageId })}/${EditorPath.Preview}`);
  };

  return (
    <StyledTableRow as='article' onClick={handleRowClick}>
      <LayoutIconContainer>
        <Icon icon={LuLayoutTemplate} /> {name}
      </LayoutIconContainer>
      <p>{description}</p>
      <p>{formatSize(sizeKb)}</p>
      <p>{pagesCount}</p>
      <p>{formatDate(createdAt)}</p>
      <p>{formatDate(lastModified)}</p>
      <RowActions>
        <ActionGroup>
          <Icon icon={LuEye} size='md' onClick={handlePreviewSite} />
          <Icon icon={LuDownload} size='md' onClick={handleSiteDownload} />
          <Icon icon={LuPencilLine} size='md' onClick={() => open('edit')} />
          <Modal.Window name='edit'>
            <Modal.Dialog title='Edit Site'>
              <EditDialog site={site} />
            </Modal.Dialog>
          </Modal.Window>
          <Icon icon={LuStar} fill={isStarred} size='md' onClick={toggleStar} />
        </ActionGroup>
        <Dropdown>
          <Dropdown.Open>
            <Icon icon={LuEllipsis} size='md' />
          </Dropdown.Open>
          <Dropdown.Drop translateX={-80} translateY={-12}>
            <Dropdown.Button onClick={handlePreviewSite} icon={LuEye}>
              Preview
            </Dropdown.Button>
            <Dropdown.Button icon={LuDownload} onClick={handleSiteDownload}>
              Download
            </Dropdown.Button>
            <Dropdown.Button icon={LuPencilLine} onClick={() => open('edit')}>
              Edit
            </Dropdown.Button>
            <Dropdown.Button icon={LuCopy} onClick={handleDuplicateSite}>
              Duplicate
            </Dropdown.Button>
            <Dropdown.Button icon={LuTrash2} onClick={() => open('delete')}>
              Delete
            </Dropdown.Button>
          </Dropdown.Drop>
        </Dropdown>
        <Modal.Window name='edit'>
          <Modal.Dialog title='Edit Site'>
            <EditDialog site={site} />
          </Modal.Dialog>
        </Modal.Window>
        <Modal.Window name='delete'>
          <Modal.Dialog title='Delete Site'>
            <DeleteDialog site={site} />
          </Modal.Dialog>
        </Modal.Window>
      </RowActions>
    </StyledTableRow>
  );
}

function EditDialog({ site, onCloseModal }: { site: SiteMetadata; onCloseModal?: OnCloseModal }) {
  const dispatch = useDispatch();
  const { id, name, description } = site;
  const [newName, setNewName] = useState(name);
  const [newDescription, setNewDescription] = useState(description);

  const handleSiteUpdate = async () => {
    const trimmedName = newName.trim();
    const trimmedDescription = newDescription.trim();

    const formValidator = new FormValidator([
      {
        value: trimmedName,
        emptyMessage: ToastMessages.site.emptyName,
        maxLength: MAX_SITE_NAME_LENGTH,
        maxLengthMessage: ToastMessages.site.nameTooLong
      },
      {
        value: trimmedDescription,
        emptyMessage: ToastMessages.site.emptyDescription,
        maxLength: MAX_SITE_DESCRIPTION_LENGTH,
        maxLengthMessage: ToastMessages.site.descriptionTooLong
      }
    ]);

    if (!formValidator.validate()) {
      return;
    }

    const icon = <StyledLoader icon={LuLoader} color='var(--color-primary)' size='md' />;

    AppToast.custom(ToastMessages.site.updating, { icon });
    onCloseModal?.();
    dispatch(updateSite({ siteId: id, updates: { description: trimmedDescription, name: trimmedName } }));
  };

  return (
    <>
      <Input type='text' value={newName} placeholder='Name' onChange={(event) => setNewName(event.target.value)} />
      <Input
        type='text'
        value={newDescription}
        placeholder='Description'
        onChange={(event) => setNewDescription(event.target.value)}
      />
      <DialogActions>
        <Button size='sm' pill onClick={handleSiteUpdate}>
          OK
        </Button>
        <Button onClick={onCloseModal} variation='secondary' size='sm' pill>
          Cancel
        </Button>
      </DialogActions>
    </>
  );
}

function DeleteDialog({ site, onCloseModal }: { site: SiteMetadata; onCloseModal?: OnCloseModal }) {
  const dispatch = useDispatch();
  const { id, name } = site;

  const handleDelete = () => {
    const icon = <StyledLoader icon={LuLoader} color='var(--color-red)' size='md' />;

    AppToast.custom(ToastMessages.site.deleting, { icon });
    onCloseModal?.();
    dispatch(deleteSite(id));
  };

  return (
    <>
      <p>Are you sure you want to delete "{name}"? This action cannot be undone.</p>
      <DialogActions>
        <Button size='sm' variation='danger' pill onClick={handleDelete}>
          Delete Forever
        </Button>
        <Button onClick={onCloseModal} size='sm' variation='secondary' pill>
          Cancel
        </Button>
      </DialogActions>
    </>
  );
}

/**
 * Styles
 */

const StyledSiteView = styled.div`
  width: 100%;
  max-width: 192rem;
  margin-left: auto;
  margin-right: auto;
  margin-top: 5.2rem;

  h2 {
    position: sticky;
    top: 0;
    background-color: var(--color-white);
    padding: 1.2rem;
    width: 100%;
    font-weight: var(--font-weight-regular);
    font-size: 2rem;
  }
`;

const SiteSection = styled.section`
  width: 100%;
  margin-top: 1.6rem;
  font-size: 1.4rem;
  margin-bottom: 20rem;
`;

const StyledBodySection = styled.section<{ $top: number }>`
  border-top: 1px solid var(--color-gray-light-4);
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  padding: 0 0 1.2rem 0;
  overflow-y: auto;
  scrollbar-width: none;
  height: ${({ $top }) => `calc(88vh - ${$top - BODY_SCROLL_OFFSET}px)`};

  &::-webkit-scrollbar {
    display: none;
  }
`;

const StyledTableHead = styled.article`
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 1.2rem;
  padding: 1.2rem;
  font-size: 1.2rem;
  border-bottom: 1px solid var(--color-gray-light-4);

  @media (max-width: ${Breakpoint.laptop}em) {
    grid-template-columns: repeat(6, minmax(0, 1fr)) 2rem;
  }

  h3 {
    color: var(--color-gray);
    font-weight: var(--font-weight-medium);
  }
`;

const StyledTableRow = styled.article`
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  align-items: center;
  gap: 1.2rem;
  padding: 1.2rem;
  transition: var(--transition-base);
  cursor: default;

  @media (max-width: ${Breakpoint.laptop}em) {
    grid-template-columns: repeat(6, minmax(0, 1fr)) 2rem;
  }

  &:hover {
    background-color: var(--color-gray-light-4);

    & > div:nth-of-type(2) > div {
      opacity: 1;
    }
  }
`;

const LayoutIconContainer = styled.div`
  display: flex;
  column-gap: 0.8rem;
  align-items: center;
`;

const RowActions = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  position: relative;
  text-align: right;

  span {
    margin-left: 1.6rem;
    white-space: pre-wrap;

    svg:hover {
      color: var(--color-gray-light) !important;
    }
  }
`;

const ActionGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: var(--transition-base);

  @media (pointer: coarse) {
    opacity: 1;
  }

  @media (max-width: ${Breakpoint.laptop}em) {
    display: none;
  }
`;

const DialogActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  column-gap: 0.8rem;
  margin-top: 1.2rem;
`;

const NoResultsWrapper = styled.div`
  text-align: center;
  margin-top: 3.2rem;
  color: var(--color-gray);
`;

const NoResultsMessage = styled.span`
  margin-bottom: 0.8rem;
  font-size: 1.8rem;
`;

const NoResultsInfo = styled.p`
  font-size: 1.2rem;
  margin-top: 1.2rem;
`;

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

export const StyledLoader = styled(Icon)`
  animation: ${spin} 1.5s linear infinite;
`;
