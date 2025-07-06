import { nanoid } from '@reduxjs/toolkit';
import type { Site } from '@shared/types';
import { useState, type MouseEvent } from 'react';
import toast from 'react-hot-toast';
import {
  LuArrowLeft,
  LuCopy,
  LuDownload,
  LuEllipsis,
  LuEye,
  LuLayoutTemplate,
  LuPencilLine,
  LuStar,
  LuTrash2
} from 'react-icons/lu';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { controlDownloadZip } from '../../../../iframe/ts/controller';
import Button from '../../../components/Button';
import Dropdown from '../../../components/Dropdown';
import Input from '../../../components/form/Input';
import Icon from '../../../components/Icon';
import Modal, { type OnCloseModal } from '../../../components/Modal';
import { EditorPath, Path, StorageKey, TOAST_DURATION, ToastMessages } from '../../../constant';
import { useModalContext } from '../../../context/ModalContext';
import { useAppSelector } from '../../../store';
import { AppStorage } from '../../../utils/appStorage';
import { buildPath } from '../../../utils/buildPath';
import { calculateSiteSize } from '../../../utils/calculateSiteSize';
import { formatDate } from '../../../utils/formatDate';
import { setIsLoading } from '../../editor/slices/editorSlice';
import {
  deleteSite,
  duplicateSite,
  FilterCriteria,
  setFilterLabel,
  setFilters,
  toggleSiteStarred,
  updateSiteDetails
} from '../slices/dashboardSlice';

/**
 * Component definition
 */

export default function SitesView({ sites, title }: { sites?: Site[]; title?: string }) {
  const { sites: fallbackSites, filters, filterLabel } = useAppSelector((state) => state.dashboard);
  const sitesToRender = sites ?? [...fallbackSites].sort((a, b) => b.createdAt - a.createdAt);
  const isFiltering = Boolean(filters.modifiedWithinDays || filters.pageRange || filters.sizeRange);
  const dispatch = useDispatch();

  function handleClearFilter() {
    dispatch(setFilterLabel(''));
    dispatch(setFilters({}));
  }

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
      <Table>
        <TableHead />
        <TableBody sites={sitesToRender} filters={filters} />
      </Table>
    </StyledSiteView>
  );
}

function TableHead() {
  return (
    <thead>
      <tr>
        <th>Name</th>
        <th>Description</th>
        <th>Size</th>
        <th>Pages</th>
        <th>Created</th>
        <th>Last Modified</th>
      </tr>
    </thead>
  );
}

function TableBody({ sites, filters }: { sites: Site[]; filters: FilterCriteria }) {
  const now = Date.now();
  const isFiltering = Boolean(filters.modifiedWithinDays || filters.pageRange || filters.sizeRange);

  const filteredSites = isFiltering
    ? sites.filter((site) => {
        const sizeKB = calculateSiteSize(site, 'kb');
        const pageCount = site.pages.length;
        const modifiedTime = new Date(site.lastModified).getTime();
        const sizeMatch = !filters.sizeRange || (sizeKB >= filters.sizeRange.min && sizeKB <= filters.sizeRange.max);
        const pageMatch =
          !filters.pageRange || (pageCount >= filters.pageRange.min && pageCount <= filters.pageRange.max);
        const modifiedMatch =
          !filters.modifiedWithinDays || now - modifiedTime <= filters.modifiedWithinDays * 24 * 60 * 60 * 1000;

        return sizeMatch && pageMatch && modifiedMatch;
      })
    : sites;

  const noSitesToDisplay = filteredSites.length === 0;

  if (noSitesToDisplay) {
    return (
      <StyledTbody>
        <tr>
          <td colSpan={7}>
            <NoResultsWrapper>
              <NoResultsMessage>{isFiltering ? 'No matching result' : 'No sites available'}</NoResultsMessage>
              <NoResultsInfo>
                {isFiltering
                  ? 'Try adjusting or clearing your filters to find sites.'
                  : 'Ready to build your website? Add a new site to get started.'}
              </NoResultsInfo>
            </NoResultsWrapper>
          </td>
        </tr>
      </StyledTbody>
    );
  }

  return (
    <tbody>
      {sites.map((site) => (
        <Modal key={site.id}>
          <TableRow site={site} />
        </Modal>
      ))}
    </tbody>
  );
}

function TableRow({ site }: { site: Site }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { open } = useModalContext();

  const { id, name, description, pagesCount, pages, createdAt, lastModified, isStarred } = site;

  const toggleStar = () => {
    dispatch(toggleSiteStarred(id));

    const message = isStarred ? ToastMessages.site.removedStar : ToastMessages.site.addedStar;
    toast.success(message, { duration: TOAST_DURATION });
  };

  async function handleRowClick(event: MouseEvent<HTMLTableRowElement>) {
    const target = event.target as HTMLElement;
    if (!target.closest('svg') && !target.closest('li')) {
      dispatch(setIsLoading(true));
      await AppStorage.setItem(StorageKey.Site, site);
      navigate(buildPath(Path.Editor, { siteId: id, pageId: pages[0].id }));
    }
  }

  async function handlePreviewSite() {
    dispatch(setIsLoading(true));
    await AppStorage.setItem(StorageKey.Site, site);
    navigate(`${buildPath(Path.Editor, { siteId: id, pageId: pages[0].id })}/${EditorPath.Preview}`);
  }

  async function handleDownloadSite(shouldMinify: boolean) {
    await controlDownloadZip(site, shouldMinify);
  }

  return (
    <StyledTableRow onClick={handleRowClick}>
      <td>
        <div>
          <Icon icon={LuLayoutTemplate} /> {name}
        </div>
      </td>
      <td>{description}</td>
      <td>{calculateSiteSize(site)}</td>
      <td>{pagesCount}</td>
      <td>{formatDate(createdAt)}</td>
      <td>{formatDate(lastModified)}</td>
      <td>
        <div>
          <Icon icon={LuEye} size='md' onClick={handlePreviewSite} />
          <Icon icon={LuDownload} size='md' onClick={() => handleDownloadSite(true)} />
          <Icon icon={LuPencilLine} size='md' onClick={() => open('edit')} />
          <Modal.Window name='edit'>
            <Modal.Dialog title='Edit Site'>
              <EditDialog site={site} />
            </Modal.Dialog>
          </Modal.Window>
          <StarIcon onClick={toggleStar} $isStarred={isStarred} />
          <Dropdown>
            <Dropdown.Open>
              <Icon icon={LuEllipsis} size='md' />
            </Dropdown.Open>
            <Dropdown.Drop translateX={-80} translateY={-10}>
              <Dropdown.Button onClick={handlePreviewSite} icon={LuEye}>
                Preview
              </Dropdown.Button>
              <Dropdown.Button icon={LuDownload} onClick={() => handleDownloadSite(true)}>
                Download
              </Dropdown.Button>
              <Dropdown.Button icon={LuPencilLine} onClick={() => open('edit')}>
                Edit
              </Dropdown.Button>
              <Dropdown.Button icon={LuCopy} onClick={() => dispatch(duplicateSite({ id, newId: nanoid() }))}>
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
        </div>
      </td>
    </StyledTableRow>
  );
}

function EditDialog({ site, onCloseModal }: { site: Site; onCloseModal?: OnCloseModal }) {
  const dispatch = useDispatch();
  const [name, setName] = useState(site.name);
  const [description, setDescription] = useState(site.description);

  function handleSiteUpdate() {
    dispatch(updateSiteDetails({ id: site.id, name, description }));
    onCloseModal?.();
    toast.success(ToastMessages.site.updated, { duration: TOAST_DURATION });
  }

  return (
    <>
      <Input type='text' value={name} placeholder='Name' onChange={(event) => setName(event.target.value)} />
      <Input
        type='text'
        value={description}
        placeholder='Description'
        onChange={(event) => setDescription(event.target.value)}
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

function DeleteDialog({ site, onCloseModal }: { site: Site; onCloseModal?: OnCloseModal }) {
  const dispatch = useDispatch();

  function handleDelete() {
    dispatch(deleteSite(site.id));
    onCloseModal?.();
    toast.success(ToastMessages.site.deleted);
  }

  return (
    <>
      <p>Are you sure you want to delete "{site.name}"? This action cannot be undone.</p>
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
  height: 100%;
  overflow-y: auto;
  margin-top: ${({ $isFiltering }) => ($isFiltering ? '0' : '5.2rem')};

  h2 {
    position: sticky;
    top: 0;
    background-color: var(--color-white);
    padding: 1.2rem;
    width: 100%;
    font-size: 2rem;
  }
`;

const FilterHeader = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 2.4rem;
`;

const NoResultsWrapper = styled.div`
  text-align: center;
  margin-top: 3.2rem;
`;

const NoResultsMessage = styled.span`
  margin-bottom: 0.8rem;
  font-size: 1.8rem;
`;

const NoResultsInfo = styled.p`
  color: var(--color-gray);
  font-size: 1.2rem;
  margin-top: 1.2rem;
`;

const Table = styled.table`
  width: 100%;
  margin-top: 2.4rem;
  border-collapse: collapse;
  font-size: 1.4rem;
  margin-bottom: 20rem;

  th,
  td {
    cursor: default;
    padding: 1.2rem;
    width: 1%;
    text-align: left;
    white-space: nowrap;
  }

  th {
    color: var(--color-gray);
  }
`;

const StyledTbody = styled.tbody`
  border-top: 1px solid var(--color-gray-light-3);
`;

const StyledTableRow = styled.tr`
  td:nth-child(1) div {
    display: flex;
    column-gap: 0.8rem;
    align-items: center;
  }

  td:nth-child(7) {
    text-align: right;

    div {
      position: relative;
    }

    div > svg:not(svg:nth-child(5)) {
      opacity: 0;
    }

    svg {
      cursor: pointer;
      margin-left: 1.6rem;
      font-size: 1.6rem;

      &:hover {
        color: var(--color-gray-light-2);
      }
    }
  }

  td[colspan='7'] {
    pointer-events: none;
  }

  &:hover {
    background-color: var(--color-gray-light-3);

    svg {
      opacity: 1 !important;
    }
  }
`;

const DialogActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  column-gap: 0.8rem;
  margin-top: 1.2rem;
`;

const StarIcon = styled(LuStar)<{ $isStarred: boolean }>`
  fill: ${(props) => props.$isStarred && 'var(--color-gray)'};
  stroke: ${(props) => props.$isStarred && 'var(--color-gray)'};
`;
