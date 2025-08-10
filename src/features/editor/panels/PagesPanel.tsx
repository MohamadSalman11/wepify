import { nanoid } from '@reduxjs/toolkit';
import type { PageMetadata } from '@shared/typing';
import { generateFileNameFromPageName, validateFields } from '@shared/utils';
import { useState, type MouseEvent } from 'react';
import toast from 'react-hot-toast';
import { LuCopy, LuEllipsis, LuHouse, LuLink, LuPencil, LuSquareMenu, LuTrash2 } from 'react-icons/lu';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import Button from '../../../components/Button';
import Dropdown from '../../../components/Dropdown';
import Input from '../../../components/form/Input';
import Icon from '../../../components/Icon';
import Modal, { type OnCloseModal } from '../../../components/Modal';
import { Path, StorageKey, ToastMessages } from '../../../constant';
import { useIframeContext } from '../../../context/IframeContext';
import { useModalContext } from '../../../context/ModalContext';
import { useAppSelector } from '../../../store';
import { AppStorage } from '../../../utils/appStorage';
import { buildPath } from '../../../utils/buildPath';
import { createNewPage } from '../../../utils/createNewPage';
import { addPage, deletePage, setIsIndexPage, setIsLoading, updatePageInfo } from '../slices/editorSlice';

/**
 * Constants
 */

const MAX_PAGE_NAME_LENGTH = 7;

/**
 * Component definition
 */

export default function PagesPanel() {
  const dispatch = useDispatch();
  const pagesMetadata = useAppSelector((state) => state.editor.pagesMetadata);

  const handleAddNewPage = () => {
    const newPage = createNewPage();
    dispatch(addPage(newPage));
  };

  return (
    <>
      <Button fullWidth onClick={handleAddNewPage}>
        Add New Page
      </Button>
      <StyledPagesList>
        {pagesMetadata?.map((page, i) => (
          <Modal key={page.id}>
            <PageItem page={page} index={i} />
          </Modal>
        ))}
      </StyledPagesList>
    </>
  );
}

function PageItem({ page, index }: { page: PageMetadata; index: number }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { siteId, pageId } = useParams();
  const { open } = useModalContext();
  const { iframeRef } = useIframeContext();

  const handleOpenEditor = (event: MouseEvent<HTMLLIElement>, page: PageMetadata) => {
    const target = event.target as HTMLElement;

    if (page.id === pageId) return;

    if (!target.closest('svg') && siteId) {
      dispatch(setIsLoading(true));
      iframeRef.current?.contentWindow?.location.reload();
      navigate(buildPath(Path.Editor, { siteId, pageId: page.id }));
    }
  };

  return (
    <StyledPageItem $active={page.id === pageId} onClick={(event) => handleOpenEditor(event, page)}>
      <div>
        <Icon icon={LuSquareMenu} color={page.isIndex ? 'var(--color-white)' : 'var(--color-gray)'} />
        <span>
          {page.name.length > MAX_PAGE_NAME_LENGTH ? `${page.name.slice(0, MAX_PAGE_NAME_LENGTH)}...` : page.name}
        </span>
        <div>
          <Dropdown>
            <Dropdown.Open>
              <span>
                <Icon icon={LuEllipsis} size='md' />
              </span>
            </Dropdown.Open>
            <Dropdown.Drop translateX={18} translateY={-15}>
              <Dropdown.Button icon={LuHouse} onClick={() => dispatch(setIsIndexPage(page.id))}>
                Set as index
              </Dropdown.Button>
              <Modal.Open openName='edit'>
                <Dropdown.Button icon={LuPencil} onClick={() => open('edit')}>
                  Edit
                </Dropdown.Button>
              </Modal.Open>
              <Modal.Open openName='delete'>
                <Dropdown.Button icon={LuTrash2} onClick={() => open('delete')}>
                  Delete
                </Dropdown.Button>
              </Modal.Open>
              <Dropdown.Button icon={LuLink} onClick={() => handleCopyLink(page.isIndex ? 'index' : page.name)}>
                Copy page link
              </Dropdown.Button>
              <Dropdown.Button
                icon={LuCopy}
                onClick={() => dispatch(addPage({ ...page, id: nanoid(), isIndex: false }))}
              >
                Duplicate page
              </Dropdown.Button>
            </Dropdown.Drop>
          </Dropdown>
          <Modal.Window name='edit'>
            <Modal.Dialog title='Edit Page'>
              <EditDialog page={page} />
            </Modal.Dialog>
          </Modal.Window>
          <Modal.Window name='delete'>
            <Modal.Dialog title='Delete page'>
              <DeleteDialog currentIndex={index} page={page} />
            </Modal.Dialog>
          </Modal.Window>
        </div>
      </div>
      {page.isIndex && <IndexBadge>Index</IndexBadge>}
    </StyledPageItem>
  );
}

function EditDialog({ page, onCloseModal }: { page: PageMetadata; onCloseModal?: OnCloseModal }) {
  const dispatch = useDispatch();
  const [newName, setNewName] = useState(page.name || '');
  const [newTitle, setNewTitle] = useState(page.title || page.name || '');
  const site = useAppSelector((state) => state.editor.site);

  const handleSave = () => {
    const trimmedName = newName.trim();
    const trimmedTitle = newTitle.trim();

    const isValid = validateFields([
      {
        value: trimmedName,
        emptyMessage: ToastMessages.page.emptyName
      }
    ]);

    if (!isValid) return;

    const nameExists = site.pages.some((p) => p.name.toLowerCase() === trimmedName.toLowerCase() && p.id !== page.id);

    if (nameExists) {
      toast.error(ToastMessages.page.duplicateName);
      return;
    }

    dispatch(updatePageInfo({ id: page.id, name: trimmedName, title: trimmedTitle }));
    onCloseModal?.();
    toast.success(ToastMessages.page.renamed);
  };

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
        placeholder='Page Title'
        defaultValue={page.title}
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
  page: PageMetadata;
  currentIndex: number;
  onCloseModal?: OnCloseModal;
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pageId } = useParams();
  const site = useAppSelector((state) => state.editor.site);

  const handleDelete = async () => {
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
      dispatch(setIsIndexPage(availablePageId));
    }

    if (isDeletingCurrentPage) {
      dispatch(setIsLoading(true));
      navigate(buildPath(Path.Editor, { siteId: site.id, pageId: availablePageId }));
    }
  };

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
  const fileName = generateFileNameFromPageName(pageName);

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

const StyledPagesList = styled.ul`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.2rem;
  margin-top: 2.4rem;
  list-style: none;
`;

const StyledPageItem = styled.li<{ $active: boolean }>`
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
        box-shadow: var(--box-shadow);
        border-radius: var(--border-radius-sm);
        background-color: var(--color-white);
        padding: 0.2rem 0.2rem 0 0.2rem;
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
  padding: 0.2rem 0.6rem;
  border-radius: var(--border-radius-full);
  text-transform: uppercase;
  box-shadow: var(--box-shadow-2);
  z-index: var(--zindex-base);
  pointer-events: none;
  user-select: none;
`;
