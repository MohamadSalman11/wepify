import type { PageMetadata } from '@shared/typing';
import { generateFileNameFromPageName } from '@shared/utils';
import { useState, type MouseEvent } from 'react';
import { LuCopy, LuEllipsis, LuHouse, LuLink, LuPencil, LuSquareMenu, LuTrash2 } from 'react-icons/lu';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import Button from '../../../components/Button';
import Dropdown from '../../../components/Dropdown';
import Input from '../../../components/form/Input';
import Icon from '../../../components/Icon';
import Modal, { useModalContext, type OnCloseModal } from '../../../components/Modal';
import { Path, ToastMessages } from '../../../constant';
import { useAppSelector } from '../../../store';
import { AppToast } from '../../../utils/appToast';
import { buildPath } from '../../../utils/buildPath';
import { createNewPage } from '../../../utils/createNewPage';
import { FormValidator } from '../../../utils/FormValidator';
import { addPage, deletePage, duplicatePage, selectPagesMetadata, setPageAsIndex, updatePage } from '../editorSlice';

/**
 * Constants
 */

const MAX_PAGE_NAME_LENGTH = 7;
const CLASS_BUTTON_PAGE_ACTIONS = 'page-actions-button';
const SELECTOR_BUTTON_PAGE_ACTIONS = `.${CLASS_BUTTON_PAGE_ACTIONS}`;

/**
 * Component definition
 */

export default function PagesPanel() {
  const pages = useAppSelector(selectPagesMetadata);

  return (
    <>
      <Modal>
        <Modal.Open openName='add-page'>
          <Button fullWidth>Add New Page</Button>
        </Modal.Open>
        <Modal.Window name='add-page'>
          <Modal.Dialog title='Add Page'>
            <AddDialog />
          </Modal.Dialog>
        </Modal.Window>
      </Modal>
      <StyledPagesList>
        {pages.map((page, i) => (
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
  const isActivePage = page.id === pageId;

  const handleOpenEditor = (event: MouseEvent<HTMLLIElement>, page: PageMetadata) => {
    const target = event.target as HTMLElement;

    if (page.id === pageId) {
      return;
    }

    if (!target.closest(SELECTOR_BUTTON_PAGE_ACTIONS) && siteId) {
      navigate(buildPath(Path.Editor, { siteId, pageId: page.id }));
    }
  };

  return (
    <StyledPageItem $active={isActivePage} onClick={(event) => handleOpenEditor(event, page)}>
      <div>
        <Icon icon={LuSquareMenu} color={isActivePage ? 'var(--color-white)' : 'var(--color-gray)'} />
        <span>
          {page.name.length > MAX_PAGE_NAME_LENGTH ? `${page.name.slice(0, MAX_PAGE_NAME_LENGTH)}...` : page.name}
        </span>
        <div>
          <Dropdown>
            <Dropdown.Open>
              <span className={CLASS_BUTTON_PAGE_ACTIONS}>
                <Icon icon={LuEllipsis} size='md' />
              </span>
            </Dropdown.Open>
            <Dropdown.Drop translateX={18} translateY={-15}>
              <Dropdown.Button icon={LuHouse} onClick={() => dispatch(setPageAsIndex(page.id))}>
                Set as index
              </Dropdown.Button>
              <Modal.Open openName='edit'>
                <Dropdown.Button icon={LuPencil} onClick={() => open('edit')}>
                  Edit
                </Dropdown.Button>
              </Modal.Open>
              <Dropdown.Button icon={LuLink} onClick={() => handleCopyLink(page.isIndex ? 'index' : page.name)}>
                Copy page link
              </Dropdown.Button>
              <Modal.Open openName='duplicate-page'>
                <Dropdown.Button icon={LuCopy}>Duplicate page</Dropdown.Button>
              </Modal.Open>
              <Modal.Open openName='delete'>
                <Dropdown.Button icon={LuTrash2} onClick={() => open('delete')}>
                  Delete
                </Dropdown.Button>
              </Modal.Open>
            </Dropdown.Drop>
          </Dropdown>
          <Modal.Window name='edit'>
            <Modal.Dialog title='Edit Page'>
              <EditDialog page={page} />
            </Modal.Dialog>
          </Modal.Window>
          <Modal.Window name='duplicate-page'>
            <Modal.Dialog title='Duplicate Page'>
              <DuplicateDialog page={page} />
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

function PageForm({
  initialName = '',
  initialTitle = '',
  excludePageId,
  onSubmit,
  onCloseModal,
  successMessage
}: {
  initialName?: string;
  initialTitle?: string;
  excludePageId?: string;
  onSubmit: (name: string, title: string) => void;
  onCloseModal?: OnCloseModal;
  successMessage?: string;
}) {
  const pages = useAppSelector(selectPagesMetadata);
  const [name, setName] = useState(initialName);
  const [title, setTitle] = useState(initialTitle || initialName);

  const handleSave = () => {
    const trimmedName = name.trim();
    const trimmedTitle = title.trim();

    const validator = new FormValidator([{ value: trimmedName, emptyMessage: ToastMessages.page.emptyName }]);

    if (!validator.validate()) {
      return;
    }

    const nameExists = pages.some((p) => p.name.toLowerCase() === trimmedName.toLowerCase() && p.id !== excludePageId);

    if (nameExists) {
      AppToast.error(ToastMessages.page.duplicateName);
      return;
    }

    onSubmit(trimmedName, trimmedTitle || trimmedName);
    onCloseModal?.();

    if (successMessage) {
      AppToast.success(successMessage);
    }
  };

  return (
    <>
      <Input type='text' placeholder='Page Name' value={name} onChange={(e) => setName(e.target.value)} />
      <Input type='text' placeholder='Page Title' value={title} onChange={(e) => setTitle(e.target.value)} />
      <DialogActions>
        <Button onClick={handleSave} size='sm' pill>
          OK
        </Button>
        <Button onClick={onCloseModal} variation='secondary' size='sm' pill>
          Cancel
        </Button>
      </DialogActions>
    </>
  );
}

function AddDialog({ onCloseModal }: { onCloseModal?: OnCloseModal }) {
  const dispatch = useDispatch();

  return (
    <PageForm
      onCloseModal={onCloseModal}
      onSubmit={(name, title) => {
        const newPage = createNewPage(name, title);
        dispatch(addPage(newPage));
      }}
    />
  );
}

function EditDialog({ page, onCloseModal }: { page: PageMetadata; onCloseModal?: OnCloseModal }) {
  const dispatch = useDispatch();

  return (
    <PageForm
      initialName={page.name}
      initialTitle={page.title}
      excludePageId={page.id}
      successMessage={ToastMessages.page.updated}
      onCloseModal={onCloseModal}
      onSubmit={(name, title) => {
        dispatch(updatePage({ id: page.id, updates: { name, title } }));
      }}
    />
  );
}

function DuplicateDialog({ page, onCloseModal }: { page: PageMetadata; onCloseModal?: OnCloseModal }) {
  const dispatch = useDispatch();

  return (
    <PageForm
      initialName={`${page.name} (Copy)`}
      initialTitle={`${page.title || page.name} (Copy)`}
      onCloseModal={onCloseModal}
      onSubmit={(name, title) => {
        dispatch(duplicatePage({ id: page.id, newName: name, newTitle: title }));
      }}
    />
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
  const pages = useAppSelector(selectPagesMetadata);

  const handleDelete = async () => {
    const isDeletingCurrentPage = pageId === page.id;
    const availablePageId = (pages[currentIndex - 1] || pages[currentIndex + 1])?.id;

    dispatch(deletePage(page.id));
    onCloseModal?.();
    AppToast.success(ToastMessages.page.deleted);

    if (isDeletingCurrentPage && !availablePageId) {
      dispatch(setIsLoadingDashboard(true));

      dispatch(clearEditor());
      navigate(Path.Dashboard);
      return;
    }

    if (page.isIndex) {
      dispatch(setPageAsIndex(availablePageId));
    }

    if (isDeletingCurrentPage) {
      dispatch(setIsLoadingEditor(true));
      navigate(buildPath(Path.Editor, { siteId: site.id, pageId: availablePageId }));
    }
  };

  return (
    <>
      <p>Are you sure you want to delete "{page.name}"? This action cannot be undone.</p>
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

const handleCopyLink = (pageName: string) => {
  const fileName = generateFileNameFromPageName(pageName);

  navigator.clipboard
    .writeText(fileName)
    .then(() => {
      AppToast.success(ToastMessages.page.linkCopied);
    })
    .catch(() => {
      AppToast.error(ToastMessages.page.linkCopyErr);
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

      & > span {
        box-shadow: var(--box-shadow);
        border-radius: var(--border-radius-sm);
        background-color: var(--color-white);
        padding: 0.2rem 0.2rem 0 0.2rem;

        & > span {
          margin-top: -0.1rem;
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
  padding: 0.2rem 0.6rem;
  border-radius: var(--border-radius-full);
  text-transform: uppercase;
  box-shadow: var(--box-shadow-2);
  z-index: var(--zindex-base);
  pointer-events: none;
  user-select: none;
`;
