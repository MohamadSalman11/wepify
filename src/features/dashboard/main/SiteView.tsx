import { useState } from 'react';
import toast from 'react-hot-toast';
import {
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
import { deleteSite, toggleSiteStarred, updateSiteDetails } from '../slices/dashboardSlice';

/**
 * Styles
 */

const StyledSiteView = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: auto;
  margin-top: 5.2rem;

  h2 {
    position: sticky;
    top: 0;
    background-color: var(--color-white);
    padding: 1.2rem;
    width: 100%;
    font-size: 2rem;
  }
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
  return (
    <StyledSiteView>
      <h2>Sites</h2>
      <Table>
        <TableHead />
        <TableBody />
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

function TableBody() {
  const { sites } = useAppSelector((state) => state.dashboard);

  return (
    <tbody>
      {sites.map((site) => (
        <TableRow site={site} key={site.id} />
      ))}
    </tbody>
  );
}

function TableRow({ site }: { site: Site }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { id, name, description, pagesCount, pages, createdAt, lastModified, isStarred } = site;

  const toggleStar = (event: any) => {
    event.stopPropagation();

    dispatch(toggleSiteStarred(id));

    const message = isStarred ? ToastMessages.site.addedStar : ToastMessages.site.removedStar;
    toast.success(message, { duration: TOAST_DURATION });
  };

  return (
    <tr onClick={() => navigate(buildPath(Path.Editor, { site: id, page: pages[0].id }))}>
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
            <Dropdown.drop top={0}>
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
