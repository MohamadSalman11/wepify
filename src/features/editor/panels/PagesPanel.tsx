import type { SitePage } from '@shared/types';
import { useState, type MouseEvent } from 'react';
import toast from 'react-hot-toast';
import { LuCopy, LuEllipsis, LuHouse, LuPencil, LuSquareMenu, LuTrash2 } from 'react-icons/lu';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import Button from '../../../components/Button';
import Dropdown from '../../../components/Dropdown';
import Input from '../../../components/form/Input';
import Icon from '../../../components/Icon';
import { Modal, type OnCloseModal } from '../../../components/Modal';
import { Path, StorageKey, ToastMessages } from '../../../constant';
import { useAppSelector } from '../../../store';
import { AppStorage } from '../../../utils/appStorage';
import { buildPath } from '../../../utils/buildPath';
import { createNewPage } from '../../../utils/createNewPage';
import { addPage, deletePage, setIsIndexPage, setIsLoading, updatePageInfo } from '../slices/editorSlice';
import { setPage } from '../slices/pageSlice';

/**
 * Constants
 */

const SELECTOR_DROPDOWN_ACTIVE = '[data-active]';
const PAGE_NAME_MAX_LENGTH = 7;

/**
 * Component definition
 */

export default function PagesPanel() {
  const { isModalOpen } = useAppSelector((state) => state.dashboard);
  const { site } = useAppSelector((state) => state.editor);
  const { pageId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // TODO: save page

  function handleAddNewPage() {
    const newPage = createNewPage();
    dispatch(addPage(newPage));
  }

  function handleOpenEditor(event: MouseEvent<HTMLLIElement>, page: SitePage) {
    if ((event.target as HTMLElement).closest(SELECTOR_DROPDOWN_ACTIVE)) return;
    dispatch(setIsLoading(true));
    dispatch(setPage({ id: page.id, elements: page.elements }));
    navigate(buildPath(Path.Editor, { siteId: site.id, pageId: page.id }));
  }

  function handleSetIndexPage(event: MouseEvent, pageId: string) {
    event.stopPropagation();
    dispatch(setIsIndexPage(pageId));
  }

  return (
    <>
      <Button fullWidth={true} onClick={handleAddNewPage}>
        Add New Page
      </Button>
      <PagesList>
        {site.pages?.map((page, i) => (
          <PageItem $active={page.id === pageId} onClick={(event) => handleOpenEditor(event, page)}>
            <div>
              <Icon icon={LuSquareMenu} />
              <span>
                {page.name.length > PAGE_NAME_MAX_LENGTH ? `${page.name.slice(0, PAGE_NAME_MAX_LENGTH)}...` : page.name}
              </span>
              <div>
                <Dropdown>
                  <Dropdown.open>
                    <span data-active>
                      <Icon icon={LuEllipsis} size='md' />
                    </span>
                  </Dropdown.open>
                  <Dropdown.drop translateX={18} translateY={-15} isHidden={isModalOpen}>
                    <li onClick={(event) => handleSetIndexPage(event, page.id)}>
                      <Icon icon={LuHouse} /> Set as index
                    </li>
                    <Modal>
                      <Modal.open>
                        <li data-active>
                          <Icon icon={LuPencil} /> Edit
                        </li>
                      </Modal.open>
                      <Modal.window>
                        <Modal.dialog title='Edit Page'>
                          <EditDialog page={page} />
                        </Modal.dialog>
                      </Modal.window>
                    </Modal>
                    <Modal>
                      <Modal.open>
                        <li data-active>
                          <Icon icon={LuTrash2} /> Delete
                        </li>
                      </Modal.open>
                      <Modal.window>
                        <Modal.dialog title='Delete page'>
                          <DeleteDialog currentIndex={i} page={page} />
                        </Modal.dialog>
                      </Modal.window>
                    </Modal>
                    <li
                      onClick={(event) => {
                        event.stopPropagation();
                        handleCopyLink(page.name);
                      }}
                    >
                      <Icon icon={LuCopy} /> Copy page link
                    </li>
                  </Dropdown.drop>
                </Dropdown>
              </div>
            </div>
            {page.isIndex && <IndexBadge>Index</IndexBadge>}
          </PageItem>
        ))}
      </PagesList>
    </>
  );
}

function EditDialog({ page, onCloseModal }: { page: SitePage; onCloseModal?: OnCloseModal }) {
  const dispatch = useDispatch();
  const [newName, setNewName] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const { site } = useAppSelector((state) => state.editor);

  function handleSave() {
    const trimmedName = newName.trim();
    if (!trimmedName) {
      toast.error('Page name cannot be empty');
      return;
    }

    const nameExists = site.pages.some(
      (p) => page.name.toLowerCase() === trimmedName.toLowerCase() && p.id !== page.id
    );

    if (nameExists) {
      toast.error('A page with this name already exists. Please choose a different name.');
      return;
    }
    dispatch(updatePageInfo({ id: page.id, name: newName, title: newTitle }));
    onCloseModal?.();
    toast.success(ToastMessages.page.renamed);
  }

  return (
    <>
      <Input
        type='text'
        placeholder='Page Name'
        defaultValue={page.name}
        onChange={(event) => setNewName(event.target.value)}
      />
      <Input
        type='text'
        placeholder='Page Tittle'
        defaultValue={page.title || page.name}
        onChange={(event) => setNewTitle(event.target.value)}
      />
      <DialogActions>
        <Button onClick={handleSave} size='sm' pill={true}>
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
  page,
  currentIndex,
  onCloseModal
}: {
  page: SitePage;
  currentIndex: number;
  onCloseModal?: OnCloseModal;
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pageId } = useParams();
  const { site } = useAppSelector((state) => state.editor);

  async function handleDelete() {
    const isDeletingCurrentPage = pageId === page.id;
    const availablePageId = (site.pages[currentIndex - 1] || site.pages[currentIndex + 1])?.id;

    dispatch(deletePage(page.id));
    onCloseModal?.();
    toast.success(ToastMessages.site.deleted);

    if (isDeletingCurrentPage && !availablePageId) {
      await AppStorage.setItem(StorageKey.Site, null);
      navigate(Path.Dashboard);
      return;
    }

    if (page.isIndex) {
      dispatch(setIsIndexPage({ siteId: site.id, pageId: availablePageId }));
    }

    if (pageId === page.id) {
      navigate(buildPath(Path.Editor, { siteId: site.id, pageId: availablePageId }));
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

const handleCopyLink = (pageName: string) => {
  const fileName =
    pageName
      .toLocaleLowerCase()
      .trim()
      .replace(/\s+/g, '_')
      .replace(/[^\w_-]/g, '') + '.html';

  navigator.clipboard
    .writeText(fileName)
    .then(() => {
      toast.success(ToastMessages.page.linkCopied);
    })
    .catch(() => {
      toast.error(ToastMessages.page.linkCopyErr);
    });
};

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

const PageItem = styled.li<{ $active: boolean }>`
  position: relative;

  & > div {
    display: flex;
    position: relative;
    column-gap: 1.2rem;
    align-items: center;
    cursor: pointer;
    border-radius: var(--border-radius-md);
    background-color: ${(props) => (props.$active ? 'var(--color-primary-light)' : 'var(--color-white-2)')};
    padding: 1.2rem;
    width: 100%;
    overflow: hidden;
    color: ${(props) => props.$active && 'var(--color-white)'};

    &:hover div {
      transform: translateY(0);
    }

    div {
      display: flex;
      position: absolute;
      top: 10%;
      left: 5%;
      justify-content: flex-end;
      transform: translateY(-4rem);
      transition: var(--transition-base);
      width: 90%;

      span {
        border-radius: var(--border-radius-sm);
        background-color: var(--color-gray-light-2);
        padding: 0.2rem 0.2rem 0 0.2rem;

        svg {
          color: var(--color-white);
        }
      }

      @media (pointer: coarse) {
        transform: none;
      }
    }
  }

  svg {
    color: ${(props) => props.$active && 'var(--color-white)'};
  }
`;

const DialogActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  column-gap: 0.8rem;
  margin-top: 1.2rem;
`;

const IndexBadge = styled.span`
  position: absolute;
  top: 0;
  left: 3%;
  transform: translateY(-50%);
  background-color: var(--color-white);
  font-size: 1rem;
  font-weight: var(--font-weight-semibold);
  padding: 0.2rem 0.6rem;
  border-radius: var(--border-radius-full);
  text-transform: uppercase;
  box-shadow: var(--box-shadow);
  z-index: var(--zindex-base);
  pointer-events: none;
  user-select: none;
`;
