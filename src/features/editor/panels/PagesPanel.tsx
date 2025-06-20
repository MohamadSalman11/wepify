import { useState } from 'react';
import toast from 'react-hot-toast';
import { LuPencil, LuSquareMenu, LuTrash } from 'react-icons/lu';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import Button from '../../../components/Button';
import Input from '../../../components/form/Input';
import Icon from '../../../components/Icon';
import Modal, { type OnCloseModal } from '../../../components/Modal';
import { Path, ToastMessages } from '../../../constant';
import { createNewPage } from '../../../helpers/createNewPage';
import { useAppSelector } from '../../../store';
import type { SitePage } from '../../../types';
import { buildPath } from '../../../utils/buildPath';
import { addPage, deletePage, deleteSite, updatePageName } from '../../dashboard/slices/dashboardSlice';
import { setIsLoading } from '../slices/editorSlice';
import { clearPage } from '../slices/pageSlice';
import { selectElement } from '../slices/selectionSlice';

/**
 * Styles
 */

const PagesList = styled.ul`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.2rem;
  margin-top: 2.4rem;
  list-style: none;
`;

const PageItem = styled.li<{ active: boolean }>`
  display: flex;
  position: relative;
  column-gap: 1.2rem;
  align-items: center;
  cursor: pointer;
  border-radius: var(--border-radius-md);
  background-color: ${(props) => (props.active ? 'var(--color-primary-light)' : 'var(--color-white-2)')};
  color: ${(props) => props.active && 'var(--color-white)'};
  padding: 1.2rem;
  width: 100%;
  overflow: hidden;

  &:hover div {
    transform: translateY(0);
  }

  div {
    display: flex;
    position: absolute;
    top: 10%;
    left: 5%;
    justify-content: space-between;
    transform: translateY(-4rem);
    transition: var(--transition-base);
    width: 90%;

    span {
      border-radius: var(--border-radius-sm);
      background-color: var(--color-white-3);
      padding: 0.4rem 0.4rem 0.2rem 0.4rem;
    }
  }

  svg {
    color: ${(props) => props.active && 'var(--color-white)'};
  }
`;

const DialogActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  column-gap: 0.8rem;
  margin-top: 1.2rem;
`;

/**
 * Component definition
 */

function PagesPanel() {
  const { sites } = useAppSelector((state) => state.dashboard);
  const { elements } = useAppSelector((state) => state.page);
  const { site: siteId, page: pageId } = useParams();
  const dispatch = useDispatch();
  const pages = sites.find((site) => site.id === siteId)?.pages;
  const navigate = useNavigate();

  return (
    <>
      <Button
        fullWidth={true}
        onClick={() => {
          dispatch(addPage({ siteId, page: createNewPage(siteId) }));
        }}
      >
        Add New Site
      </Button>
      <PagesList>
        {pages?.map((page, i) => (
          <PageItem
            active={page.id === pageId}
            onClick={(event) => {
              if ((event.target as HTMLElement).closest('[data-active]')) return;
              dispatch(clearPage());
              dispatch(selectElement(elements.find((el) => el.id === 'section-1')));
              dispatch(setIsLoading(true));
              navigate(buildPath(Path.Editor, { site: siteId, page: page.id }));
            }}
          >
            <Icon icon={LuSquareMenu} />
            <span>{page.name.length > 8 ? `${page.name.slice(0, 8)}...` : page.name}</span>
            <div>
              <Modal>
                <Modal.open>
                  <span data-active>
                    <Icon icon={LuPencil} />
                  </span>
                </Modal.open>
                <Modal.window>
                  <Modal.dialog title='Rename'>
                    <RenameDialog siteId={siteId} pageId={page.id} name={page.name} />
                  </Modal.dialog>
                </Modal.window>
              </Modal>
              <Modal>
                <Modal.open>
                  <span data-active>
                    <Icon icon={LuTrash} />
                  </span>
                </Modal.open>
                <Modal.window>
                  <Modal.dialog title='Delete page'>
                    <DeleteDialog currentIndex={i} currentPageId={pageId} pages={pages} siteId={siteId} page={page} />
                  </Modal.dialog>
                </Modal.window>
              </Modal>
            </div>
          </PageItem>
        ))}
      </PagesList>
    </>
  );
}

function RenameDialog({
  name,
  siteId,
  pageId,
  onCloseModal
}: {
  name: string;
  siteId: string;
  pageId: string;
  onCloseModal: OnCloseModal;
}) {
  const dispatch = useDispatch();
  const [newName, setNewName] = useState('');

  return (
    <>
      <Input
        type='text'
        placeholder='Page Name'
        defaultValue={name}
        onChange={(event) => setNewName(event.target.value)}
      />
      <DialogActions>
        <Button
          onClick={() => {
            dispatch(updatePageName({ siteId, pageId, name: newName }));
            onCloseModal();
            toast.success(ToastMessages.page.renamed);
          }}
          size='sm'
          pill={true}
        >
          OK
        </Button>
        <Button onClick={onCloseModal} variation='secondary' size='sm' pill={true}>
          Cancel
        </Button>
      </DialogActions>
    </>
  );
}

function DeleteDialog({
  siteId,
  page,
  pages,
  currentIndex,
  currentPageId,
  onCloseModal
}: {
  siteId: string;
  page: SitePage;
  pages: SitePage[];
  currentIndex: number;
  currentPageId: string;
  onCloseModal?: OnCloseModal;
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function handleDelete() {
    const isDeletingCurrentPage = currentPageId === page.id;
    const availablePageId = isDeletingCurrentPage && (pages[currentIndex - 1] || pages[currentIndex + 1])?.id;

    dispatch(deletePage({ siteId, pageId: page.id }));
    onCloseModal?.();
    toast.success(ToastMessages.site.deleted);

    if (isDeletingCurrentPage && !availablePageId) {
      dispatch(deleteSite(siteId));
      navigate(Path.Dashboard);
      return;
    }

    if (currentPageId === page.id) {
      navigate(buildPath(Path.Editor, { site: siteId, page: availablePageId }));
    }
  }

  return (
    <>
      <p>Are you sure you want to delete "{page.name}"? This action cannot be undone.</p>
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

export default PagesPanel;
