import { nanoid } from '@reduxjs/toolkit';
import type { Site, SiteMetadata } from '@shared/typing';
import { validateFields } from '@shared/utils';
import { useEffect, useRef, useState, type MouseEvent } from 'react';
import toast from 'react-hot-toast';
import {
  LuArrowLeft,
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
import { controlDownloadZip } from '../../../../iframe/ts/controller';
import Button from '../../../components/Button';
import Dropdown from '../../../components/Dropdown';
import Input from '../../../components/form/Input';
import Icon from '../../../components/Icon';
import Modal, { type OnCloseModal } from '../../../components/Modal';
import { EditorPath, Path, StorageKey, TOAST_DELAY_MS, TOAST_DURATION, ToastMessages } from '../../../constant';
import { useModalContext } from '../../../context/ModalContext';
import { useAppSelector } from '../../../store';
import { AppStorage } from '../../../utils/appStorage';
import { buildPath } from '../../../utils/buildPath';
import { formatDate } from '../../../utils/formatDate';
import { formatSize } from '../../../utils/formatSize';
import { runWithToast } from '../../../utils/runWithToast';
import { setActiveSiteById } from '../../../utils/setActiveSiteById';
import { updateInSitesStorage } from '../../../utils/updateSitesInStorage';
import { setIsLoading } from '../../editor/slices/editorSlice';
import {
  deleteSite,
  duplicateSite,
  FilterCriteria,
  setFilterLabel,
  setFilters,
  setIsProcessing,
  toggleSiteStarred,
  updateSiteDetails
} from '../slices/dashboardSlice';

/**
 * Constants
 */

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const BODY_SCROLL_OFFSET = 75;

const MAX_SITE_NAME_LENGTH = 12;
const MAX_SITE_DESCRIPTION_LENGTH = 20;

const DELAY_DOWNLOAD_SITE_MS = 200;

/**
 * Types
 */

interface EmptyStateMessages {
  noSitesTitle: string;
  noSitesInfo: string;
}

/**
 * Component definition
 */

export default function SitesView({
  sitesMetadata,
  title,
  emptyStateMessages
}: {
  sitesMetadata?: SiteMetadata[];
  title?: string;
  emptyStateMessages?: EmptyStateMessages;
}) {
  const dispatch = useDispatch();
  const { sitesMetadata: fallbackSites, filters, filterLabel } = useAppSelector((state) => state.dashboard);
  const sitesToRender = sitesMetadata ?? [...fallbackSites].sort((a, b) => b.createdAt - a.createdAt);
  const isFiltering = Boolean(filters.modifiedWithinDays || filters.pageRange || filters.sizeRange);

  const handleClearFilter = () => {
    dispatch(setFilterLabel(''));
    dispatch(setFilters({}));
  };

  return (
    <StyledSiteView $isFiltering={isFiltering}>
      <h2>
        {isFiltering ? (
          <FilterHeader>
            <span onClick={handleClearFilter}>
              <Icon icon={LuArrowLeft} hover={true} />
            </span>
            {filterLabel}
          </FilterHeader>
        ) : (
          title || 'Sites'
        )}
      </h2>
      <SiteSection>
        <TableHead />
        <TableBody sitesMetadata={sitesToRender} filters={filters} emptyStateMessages={emptyStateMessages} />
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

function TableBody({
  sitesMetadata,
  filters,
  emptyStateMessages
}: {
  sitesMetadata: SiteMetadata[];
  filters: FilterCriteria;
  emptyStateMessages?: EmptyStateMessages;
}) {
  const now = Date.now();
  const isFiltering = Boolean(filters.modifiedWithinDays || filters.pageRange || filters.sizeRange);
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

  const filteredSites = isFiltering
    ? sitesMetadata.filter((site) => {
        const { sizeKb, pagesCount, lastModified } = site;

        const sizeMatch = !filters.sizeRange || (sizeKb >= filters.sizeRange.min && sizeKb <= filters.sizeRange.max);
        const pageMatch =
          !filters.pageRange || (pagesCount >= filters.pageRange.min && pagesCount <= filters.pageRange.max);
        const modifiedMatch =
          !filters.modifiedWithinDays || now - lastModified <= filters.modifiedWithinDays * MS_PER_DAY;

        return sizeMatch && pageMatch && modifiedMatch;
      })
    : sitesMetadata;

  const noSitesToDisplay = filteredSites.length === 0;

  if (noSitesToDisplay) {
    return (
      <StyledBodySection ref={tableBodyRef} $top={top}>
        <article>
          <div>
            <NoResultsWrapper>
              <NoResultsMessage>
                {isFiltering ? 'No matching result' : emptyStateMessages?.noSitesTitle || 'No sites available'}
              </NoResultsMessage>
              <NoResultsInfo>
                {isFiltering
                  ? 'Try adjusting or clearing your filters to find sites.'
                  : emptyStateMessages?.noSitesInfo || 'Ready to build your website? Add a new site to get started.'}
              </NoResultsInfo>
            </NoResultsWrapper>
          </div>
        </article>
      </StyledBodySection>
    );
  }

  return (
    <StyledBodySection ref={tableBodyRef} $top={top}>
      {filteredSites.map((site) => (
        <Modal key={site.id}>
          <TableRow siteMetadata={site} />
        </Modal>
      ))}
    </StyledBodySection>
  );
}

function TableRow({ siteMetadata }: { siteMetadata: SiteMetadata }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { open } = useModalContext();
  const { id, name, description, sizeKb, pagesCount, firstPageId, createdAt, lastModified, isStarred } = siteMetadata;

  const toggleStar = () => {
    dispatch(toggleSiteStarred(id));
    const message = isStarred ? ToastMessages.site.removedStar : ToastMessages.site.addedStar;
    toast.success(message, { duration: TOAST_DURATION });
  };

  const handleDuplicateSite = () => {
    runWithToast({
      startMessage: ToastMessages.site.duplicating,
      successMessage: ToastMessages.site.duplicated,
      icon: <StyledLoader icon={LuLoader} color='var(--color-primary)' size='md' />,
      delay: TOAST_DELAY_MS,
      onExecute: async () => {
        const newId = nanoid();
        dispatch(setIsProcessing(true));

        await updateInSitesStorage((sites) => {
          const existing = sites.find((s) => s.id === id);
          return existing ? [...sites, { ...existing, id: newId }] : sites;
        });

        return newId;
      },
      onSuccess: (newId) => dispatch(duplicateSite({ id, newId })),
      onFinally: () => dispatch(setIsProcessing(false))
    });
  };

  const handleRowClick = async (event: MouseEvent<HTMLElement>) => {
    const target = event.target as HTMLElement;
    if (!target.closest('svg') && !target.closest('li')) {
      dispatch(setIsLoading(true));
      await setActiveSiteById(id);
      navigate(buildPath(Path.Editor, { siteId: id, pageId: firstPageId }));
    }
  };

  const handlePreviewSite = async () => {
    dispatch(setIsLoading(true));
    await setActiveSiteById(id);
    navigate(`${buildPath(Path.Editor, { siteId: id, pageId: firstPageId })}/${EditorPath.Preview}`);
  };

  const handleDownloadSite = (shouldMinify: boolean) => {
    runWithToast({
      startMessage: ToastMessages.site.generating,
      successMessage: ToastMessages.site.generated,
      icon: <StyledLoader icon={LuLoader} color='var(--color-primary)' size='md' />,
      delay: DELAY_DOWNLOAD_SITE_MS,
      onExecute: async () => {
        dispatch(setIsProcessing(true));
        const sites = (await AppStorage.getItem(StorageKey.Sites)) as Site[];
        const site = sites.find((s) => s.id === id);

        if (!site) {
          throw new Error(ToastMessages.site.downloadFailed);
        }

        await controlDownloadZip(site, shouldMinify);
      },
      onFinally: () => dispatch(setIsProcessing(false))
    });
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
          <Icon icon={LuDownload} size='md' onClick={() => handleDownloadSite(true)} />
          <Icon icon={LuPencilLine} size='md' onClick={() => open('edit')} />
          <Modal.Window name='edit'>
            <Modal.Dialog title='Edit Site'>
              <EditDialog siteMetadata={siteMetadata} />
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
            <Dropdown.Button icon={LuDownload} onClick={() => handleDownloadSite(true)}>
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
            <EditDialog siteMetadata={siteMetadata} />
          </Modal.Dialog>
        </Modal.Window>
        <Modal.Window name='delete'>
          <Modal.Dialog title='Delete Site'>
            <DeleteDialog siteMetadata={siteMetadata} />
          </Modal.Dialog>
        </Modal.Window>
      </RowActions>
    </StyledTableRow>
  );
}

function EditDialog({ siteMetadata, onCloseModal }: { siteMetadata: SiteMetadata; onCloseModal?: OnCloseModal }) {
  const dispatch = useDispatch();
  const { id, name, description } = siteMetadata;
  const [newName, setNewName] = useState(name);
  const [newDescription, setNewDescription] = useState(description);

  const handleSiteUpdate = async () => {
    const trimmedName = newName.trim();
    const trimmedDescription = newDescription.trim();

    const isValid = validateFields([
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

    if (!isValid) return;

    runWithToast({
      startMessage: ToastMessages.site.updating,
      successMessage: ToastMessages.site.updated,
      icon: <StyledLoader icon={LuLoader} color='var(--color-primary)' size='md' />,
      delay: TOAST_DELAY_MS,
      onExecute: async () => {
        dispatch(setIsProcessing(true));
        onCloseModal?.();
        await updateInSitesStorage((sites) =>
          sites.map((s) => (s.id === id ? { ...s, name: trimmedName, description: trimmedDescription } : s))
        );
        return { id, name: trimmedName, description: trimmedDescription };
      },
      onSuccess: ({ id, name, description }) => dispatch(updateSiteDetails({ id, name, description })),
      onFinally: () => dispatch(setIsProcessing(false))
    });
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
        <Button size='sm' pill={true} onClick={handleSiteUpdate}>
          OK
        </Button>
        <Button onClick={onCloseModal} variation='secondary' size='sm' pill={true}>
          Cancel
        </Button>
      </DialogActions>
    </>
  );
}

function DeleteDialog({ siteMetadata, onCloseModal }: { siteMetadata: SiteMetadata; onCloseModal?: OnCloseModal }) {
  const dispatch = useDispatch();
  const { id, name } = siteMetadata;

  const handleDelete = () => {
    runWithToast({
      startMessage: ToastMessages.site.deleting,
      successMessage: ToastMessages.site.deleted,
      icon: <StyledLoader icon={LuLoader} color='var(--color-red)' size='md' />,
      delay: TOAST_DELAY_MS,
      onExecute: async () => {
        dispatch(setIsProcessing(true));
        onCloseModal?.();
        await updateInSitesStorage((sites) => sites.filter((s) => s.id !== id));
        return id;
      },
      onSuccess: (deletedId) => dispatch(deleteSite(deletedId)),
      onFinally: () => {
        dispatch(setIsProcessing(false));
      }
    });
  };

  return (
    <>
      <p>Are you sure you want to delete "{name}"? This action cannot be undone.</p>
      <DialogActions>
        <Button size='sm' variation='danger' pill={true} onClick={handleDelete}>
          Delete Forever
        </Button>
        <Button onClick={onCloseModal} size='sm' variation='secondary' pill={true}>
          Cancel
        </Button>
      </DialogActions>
    </>
  );
}

/**
 * Styles
 */

const StyledSiteView = styled.div<{ $isFiltering: boolean }>`
  width: 100%;
  margin-top: ${({ $isFiltering }) => ($isFiltering ? '0' : '5.2rem')};

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

const FilterHeader = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 2.4rem;
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

  @media (max-width: 100em) {
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

  @media (max-width: 100em) {
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

  @media (max-width: 100em) {
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
