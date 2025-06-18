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
import Button from '../../../components/Button';
import Dropdown from '../../../components/Dropdown';
import Input from '../../../components/form/Input';
import Icon from '../../../components/Icon';
import Modal, { type OnCloseModal } from '../../../components/Modal';
import { Path, TOAST_DURATION, ToastMessages } from '../../../constant';
import { useAppSelector } from '../../../store';
import type { Site } from '../../../types';
import { buildPath } from '../../../utils/buildPath';
import { calculateSiteSize } from '../../../utils/calculateSiteSize';
import { formatDate } from '../../../utils/formatDate';
import {
  deleteSite,
  setFilterLabel,
  setFilters,
  toggleSiteStarred,
  updateSiteDetails,
  type FilterCriteria
} from '../slices/dashboardSlice';

/**
 * Styles
 */

const StyledSiteView = styled.div<{ isFiltering: boolean }>`
  width: 100%;
  height: 100%;
  overflow-y: auto;
  margin-top: ${({ isFiltering }) => (isFiltering ? '0' : '5.2rem')};

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

  span {
    display: inline-block;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: var(--transition-base);
    cursor: pointer;
    border-radius: var(--border-radius-full);
    width: 3.5rem;
    height: 3.5rem;

    &:hover {
      background-color: var(--color-white-2);
    }
  }
`;

const NoResultsWrapper = styled.div`
  text-align: center;
  flex-direction: column;
  margin-top: 3.2rem;
`;

const NoResultsMessage = styled.span`
  margin-bottom: 0.8rem;
  font-size: 1.8rem;
`;

const NoResultsInfo = styled.p`
  color: var(--color-gray);
  font-size: 1.2rem;
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

  tbody tr {
    &:nth-child(1) {
      border-top: 1px solid var(--color-gray-light-3);
    }

    & td:nth-child(1) div {
      display: flex;
      column-gap: 0.8rem;
      align-items: center;
    }

    & td:nth-child(7) {
      text-align: right;

      & div {
        position: relative;
      }

      & div > svg:not(svg:nth-child(5)) {
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

    & td[colspan='7'] {
      pointer-events: none;
    }

    &:hover {
      background-color: var(--color-gray-light-3);

      svg {
        opacity: 1 !important;
      }
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

const StarIcon = styled(LuStar)<{ isStarred: boolean }>`
  fill: ${(props) => props.isStarred && 'var(--color-gray)'};
  stroke: ${(props) => props.isStarred && 'var(--color-gray)'};
`;

/**
 * Component definition
 */

export default function SitesView() {
  const { sites, filters, filterLabel, isModalOpen } = useAppSelector((state) => state.dashboard);
  const dispatch = useDispatch();
  const isFiltering = Boolean(filters.modifiedWithinDays || filters.pageRange || filters.sizeRange);

  function handleClearFilter() {
    dispatch(setFilterLabel(''));
    dispatch(setFilters({}));
  }

  return (
    <StyledSiteView isFiltering={isFiltering}>
      <h2>
        {isFiltering ? (
          <FilterHeader>
            <span onClick={handleClearFilter}>
              <Icon icon={LuArrowLeft} />
            </span>
            {filterLabel}
          </FilterHeader>
        ) : (
          'Sites'
        )}
      </h2>
      <Table>
        <TableHead />
        <TableBody sites={sites} filters={filters} isModalOpen={isModalOpen} />
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

function TableBody({ sites, filters, isModalOpen }: { sites: Site[]; filters: FilterCriteria; isModalOpen: boolean }) {
  const now = Date.now();

  const filteredSites = sites.filter((site) => {
    const sizeKB = calculateSiteSize(site, 'kb');
    const pageCount = site.pages.length;
    const modifiedTime = new Date(site.lastModified).getTime();

    const sizeMatch = !filters.sizeRange || (sizeKB >= filters.sizeRange.min && sizeKB <= filters.sizeRange.max);
    const pageMatch = !filters.pageRange || (pageCount >= filters.pageRange.min && pageCount <= filters.pageRange.max);
    const modifiedMatch =
      !filters.modifiedWithinDays || now - modifiedTime <= filters.modifiedWithinDays * 24 * 60 * 60 * 1000;

    return sizeMatch && pageMatch && modifiedMatch;
  });

  if (filteredSites.length === 0) {
    return (
      <tbody>
        <tr>
          <td colSpan={7}>
            <NoResultsWrapper>
              <NoResultsMessage>No matching result</NoResultsMessage>
              <NoResultsInfo>Try adjusting your filters or clear them to see all sites.</NoResultsInfo>
            </NoResultsWrapper>
          </td>
        </tr>
      </tbody>
    );
  }

  return (
    <tbody>
      {filteredSites.map((site) => (
        <TableRow site={site} key={site.id} isModalOpen={isModalOpen} />
      ))}
    </tbody>
  );
}

function TableRow({ site, isModalOpen }: { site: Site; isModalOpen: boolean }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { id, name, description, pagesCount, pages, createdAt, lastModified, isStarred } = site;

  const toggleStar = () => {
    dispatch(toggleSiteStarred(id));

    const message = isStarred ? ToastMessages.site.addedStar : ToastMessages.site.removedStar;
    toast.success(message, { duration: TOAST_DURATION });
  };

  function handleRowClick(event: MouseEvent<HTMLTableRowElement>) {
    const target = event.target as HTMLElement;
    if (!target.closest('svg') && !target.closest('li')) {
      navigate(buildPath(Path.Editor, { site: id, page: pages[0].id }));
    }
  }

  return (
    <tr onClick={handleRowClick}>
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
          <Icon icon={LuEye} size='md' />
          <Icon icon={LuDownload} size='md' />
          <Modal>
            <Modal.open>
              <Icon icon={LuPencilLine} size='md' />
            </Modal.open>
            <Modal.window>
              <Modal.dialog title='Edit Site'>
                <EditDialog site={site} />
              </Modal.dialog>
            </Modal.window>
          </Modal>
          <StarIcon onClick={toggleStar} isStarred={isStarred} />
          <Dropdown>
            <Dropdown.open>
              <Icon icon={LuEllipsis} size='md' />
            </Dropdown.open>
            <Dropdown.drop top={0} shouldHide={isModalOpen}>
              <DropdownOptions site={site} />
            </Dropdown.drop>
          </Dropdown>
        </div>
      </td>
    </tr>
  );
}

function DropdownOptions({ site }: { site: Site }) {
  return (
    <>
      <li>
        <Icon icon={LuEye} size='md' /> Preview
      </li>
      <li>
        <Icon icon={LuDownload} size='md' /> Download
      </li>
      <Modal>
        <Modal.open>
          <li>
            <Icon icon={LuPencilLine} size='md' /> Edit
          </li>
        </Modal.open>
        <Modal.window>
          <Modal.dialog title='Edit Site'>
            <EditDialog site={site} />
          </Modal.dialog>
        </Modal.window>
      </Modal>
      <li>
        <Icon icon={LuCopy} size='md' /> Duplicate
      </li>
      <Modal>
        <Modal.open>
          <li>
            <Icon icon={LuTrash2} size='md' /> Delete
          </li>
        </Modal.open>
        <Modal.window>
          <Modal.dialog title='Delete Site'>
            <DeleteDialog site={site} />
          </Modal.dialog>
        </Modal.window>
      </Modal>
    </>
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
