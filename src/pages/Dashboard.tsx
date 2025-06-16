import localforage from 'localforage';
import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import {
  LuCalendar,
  LuChevronDown,
  LuClock4,
  LuCopy,
  LuDownload,
  LuEllipsis,
  LuEye,
  LuFilePlus,
  LuFileStack,
  LuHardDrive,
  LuHouse,
  LuLayoutTemplate,
  LuPencilLine,
  LuSearch,
  LuStar,
  LuTrash2
} from 'react-icons/lu';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Button from '../components/Button';
import Logo from '../components/Logo';
import { ELEMENTS_TEMPLATE } from '../constant';
import { addSite, deleteSite, setSites } from '../features/dashboard/dashboardSlice';
import { setPage } from '../features/editor/slices/pageSlice';
import useOutsideClick from '../hooks/useOutsideClick';
import { useAppSelector } from '../store';
import { calculateSiteSize } from '../utils/calculateSiteSize';

const StyledDashboard = styled.div`
  padding: 1.2rem 2.4rem;

  & > div:nth-of-type(2) {
    margin-top: 1.2rem;
  }
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const LogoBox = styled.div`
  display: flex;
  align-items: center;
  column-gap: 1.2rem;
  font-size: 2rem;

  img {
    margin-bottom: 0.4rem;
  }
`;

const Sidebar = styled.aside`
  width: 20rem;
  padding-top: 0.4rem;

  button {
    display: flex;
    column-gap: 1.2rem;
    justify-content: center;
    align-items: center;

    svg {
      color: var(--color-white);
    }
  }

  svg {
    color: var(--color-black-light);
    font-size: 2rem;
  }

  ul {
    margin-top: 2.4rem;

    li {
      display: flex;
      column-gap: 1.2rem;
      align-items: center;
      transition: var(--transition-base);
      cursor: pointer;
      margin-top: 1.2rem;
      border-radius: var(--border-radius-full);
      padding: 0.8rem 3.2rem;
      width: 100%;

      &:hover {
        background-color: var(--color-gray-light-2);
      }

      &:nth-child(1) {
        background-color: var(--color-primary-light-2);
      }
    }
  }
`;

const Container = styled.div`
  display: flex;
`;

const Box = styled.div`
  padding: 2.4rem;
  flex-grow: 1;
  height: 88vh;
  margin-left: 3.2rem;
  border-radius: var(--border-radius-xl);
  background-color: var(--color-white);
  position: relative;
  overflow-y: hidden;
`;

const SearchBox = styled.div`
  margin: 1.2rem auto;
  width: fit-content;
  text-align: center;

  h1 {
    font-weight: 400;
    font-size: 2.2rem;
  }

  nav > ul {
    display: flex;
    column-gap: 2.4rem;
    justify-content: center;
    align-items: center;
    margin-top: 1.6rem;

    & > li {
      position: relative;

      & > span {
        display: flex;
        column-gap: 0.8rem;
        justify-content: center;
        align-items: center;
        transition: var(--transition-base);
        cursor: pointer;
        border-radius: var(--border-radius-full);
        background-color: var(--color-gray-light-3);
        padding: 0.8rem 1.2rem;
        font-size: 1.2rem;

        &:hover {
          background-color: var(--color-gray-light-2);
        }

        svg:nth-child(1) {
          font-size: 1.8rem;
        }
      }

      ul {
        transform: translateX(50%);
      }
    }
  }
`;

const Searchbar = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  margin-top: 2.4rem;

  input {
    border-radius: var(--border-radius-full);
    background-color: var(--color-white-2);
    padding: 1.6rem 1.6rem 1.6rem 6.4rem;
    width: 80rem;
    font-size: 1.6rem;
  }

  svg {
    position: absolute;
    left: 3%;
    font-size: 2rem;
  }
`;

const SitesTable = styled.table`
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

    & td:nth-child(1) svg {
      margin-right: 0.8rem;
    }

    & td:nth-child(7) {
      text-align: right;

      svg:not(svg:nth-child(5)) {
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

const Dropdown = styled.ul<{ top: number }>`
  position: absolute;
  right: 2%;
  top: ${({ top }) => top}px;
  width: 20rem;
  font-size: 1.4rem;
  border-radius: var(--border-radius-sm);
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  overflow: hidden;
  z-index: 999;
  background-color: white;

  li {
    display: flex;
    column-gap: 1.2rem;
    align-items: center;
    cursor: pointer;
    padding: 1.2rem;
    width: 100%;

    &:hover {
      background-color: var(--color-gray-light-3);
    }

    svg {
      font-size: 1.7rem;
    }
  }
`;

const Sites = styled.div`
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
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const EditBox = styled.div`
  background-color: var(--color-white);
  border-radius: var(--border-radius-lg);
  padding: 2.4rem;
  width: 30rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  font-size: 1.4rem;

  h3 {
    margin-bottom: 1.2rem;
    font-size: 1.6rem;
  }

  input {
    margin-bottom: 1.2rem;
    border: 1px solid var(--color-gray-light-2);
    border-radius: var(--border-radius-md);
    padding: 0.8rem;
    width: 100%;
  }

  .actions {
    display: flex;
    justify-content: flex-end;
    gap: 1.2rem;
    margin-top: 0.4rem;

    button {
      cursor: pointer;
      border: none;
      border-radius: var(--border-radius-full);
      padding: 0.6rem 1.2rem;
      font-size: 1.2rem;

      &:first-child {
        background-color: var(--color-primary);
        color: var(--color-white);
      }

      &:last-child {
        background-color: var(--color-gray-light-2);
      }
    }
  }
`;

function Dashboard() {
  const [dropdownTop, setDropdownTop] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSizeDropdownOpen, setIsSizeDropdownOpen] = useState(false);
  const [isPagesDropdownOpen, setIsPagesDropdownOpen] = useState(false);
  const pagesDropdownRef = useOutsideClick<HTMLUListElement>(() => setIsPagesDropdownOpen(false));
  const dropdownRef = useOutsideClick<HTMLUListElement>(() => setIsDropdownOpen(false));
  const sizeDropdownRef = useOutsideClick<HTMLUListElement>(() => setIsSizeDropdownOpen(false));
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);
  const dateDropdownRef = useOutsideClick<HTMLUListElement>(() => setIsDateDropdownOpen(false));
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [renameName, setRenameName] = useState('');
  const [renameDesc, setRenameDesc] = useState('');
  const [isStarred, setIsStarred] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newSiteName, setNewSiteName] = useState('Untitled');
  const [newSiteDesc, setNewSiteDesc] = useState('');
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedSiteId, setSelectedSiteId] = useState('');
  const { sites } = useAppSelector((state) => state.dashboard);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const toggleStar = () => {
    setIsStarred((prev) => !prev);
    if (!isStarred) {
      toast.success('1 site added to starred', {
        duration: 5000
      });
    }
  };

  useEffect(() => {
    async function loadSites() {
      const sites = await localforage.getItem('sites');
      console.log(sites);
      if (sites) dispatch(setSites(sites));
    }

    loadSites();
  }, [dispatch]);

  const handleDeleteClick = () => {
    setIsDropdownOpen(false);
    setIsDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    setIsDeleteConfirmOpen(false);
    dispatch(deleteSite(selectedSiteId));
    toast.success('Site deleted permanently.');
  };

  const cancelDelete = () => {
    setIsDeleteConfirmOpen(false);
  };

  useEffect(() => {
    localforage.setItem('sites', sites);
  }, [sites]);

  function showDropdown(event) {
    event.stopPropagation();

    const rect = event.currentTarget.getBoundingClientRect();
    const scrollY = window.scrollY || window.pageYOffset;
    const offsetTop = rect.bottom + scrollY - 100;
    setDropdownTop(offsetTop);
    setIsDropdownOpen(true);
  }

  return (
    <StyledDashboard>
      <Toaster position='top-center' reverseOrder={false} />
      <Header>
        <LogoBox>
          <Logo />
          <span>Wepify</span>
        </LogoBox>
      </Header>
      <Container>
        <Sidebar>
          <Button size='full' onClick={() => setIsCreateOpen(true)}>
            <LuFilePlus />
            Create New Site
          </Button>
          <ul>
            <li>
              <LuHouse /> Home
            </li>
            <li>
              <LuClock4 /> Recent
            </li>
            <li>
              <LuStar /> Stared
            </li>
          </ul>
        </Sidebar>
        <Box>
          <SearchBox>
            <h1>Welcome to Wepify</h1>
            <Searchbar>
              <LuSearch />
              <input type='text' placeholder='Search in Wepify' />
            </Searchbar>
            <nav>
              <ul>
                <li>
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsSizeDropdownOpen(true);
                    }}
                  >
                    <LuHardDrive />
                    Size
                    <LuChevronDown />
                  </span>
                  {isSizeDropdownOpen && (
                    <Dropdown ref={sizeDropdownRef}>
                      <li>{'<'} 500 KB</li>
                      <li>500 KB - 1 MB</li>
                      <li>1 MB - 5 MB</li>
                      <li>5 MB - 10 MB</li>
                      <li>{'>'} 10 MB</li>
                    </Dropdown>
                  )}
                </li>
                <li>
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsPagesDropdownOpen(true);
                    }}
                  >
                    <LuFileStack />
                    Pages
                    <LuChevronDown />
                  </span>
                  {isPagesDropdownOpen && (
                    <Dropdown ref={pagesDropdownRef}>
                      <li>1 - 3 pages</li>
                      <li>4 - 10 pages</li>
                      <li>11 - 25 pages</li>
                      <li>26 - 50 pages</li>
                      <li>{'>'} 50 pages</li>
                    </Dropdown>
                  )}
                </li>
                <li>
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsDateDropdownOpen(true);
                    }}
                  >
                    <LuCalendar />
                    Modified
                    <LuChevronDown />
                  </span>
                  {isDateDropdownOpen && (
                    <Dropdown ref={dateDropdownRef}>
                      <li>Today</li>
                      <li>Last 7 days</li>
                      <li>Last 30 days</li>
                      <li>Last 60 days</li>
                      <li>Last 90 days</li>
                    </Dropdown>
                  )}
                </li>
              </ul>
            </nav>
          </SearchBox>

          <Sites>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '1.2rem' }}>Sites</h2>
            <SitesTable>
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
              <tbody>
                {sites.map((site) => (
                  <tr onClick={() => navigate(`/editor/sites/${site.id}/pages/${site.pages[0].id}`)}>
                    <td>
                      <LuLayoutTemplate /> {site.title}
                    </td>
                    <td>{site.description}</td>
                    <td>{calculateSiteSize(site)}</td>
                    <td>{site.pagesCount}</td>
                    <td>
                      {new Date(site.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: '2-digit',
                        year: 'numeric'
                      })}
                    </td>
                    <td>
                      {new Date(site.lastModified).toLocaleDateString('en-US', {
                        month: 'short',
                        day: '2-digit',
                        year: 'numeric'
                      })}
                    </td>
                    <td>
                      <div>
                        <LuEye />
                        <LuDownload />
                        <LuPencilLine onClick={() => setIsEditOpen(true)} />
                        <LuStar
                          onClick={toggleStar}
                          style={{
                            stroke: isStarred ? '#1c2735' : '#94a3b7',
                            fill: isStarred ? '#94a3b7' : 'none'
                          }}
                        />
                        <LuEllipsis
                          onClick={(event) => {
                            showDropdown(event);
                            setSelectedSiteId(site.id);
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </SitesTable>
          </Sites>

          {isDeleteConfirmOpen && (
            <ModalOverlay onClick={cancelDelete}>
              <EditBox onClick={(e) => e.stopPropagation()}>
                <h3>Delete Confirmation</h3>
                <p>Are you sure you want to delete this site? This action cannot be undone.</p>
                <div className='actions'>
                  <button
                    onClick={confirmDelete}
                    style={{ backgroundColor: 'var(--color-red)', color: 'var(--color-white)' }}
                  >
                    Delete Forever
                  </button>
                  <button onClick={cancelDelete}>Cancel</button>
                </div>
              </EditBox>
            </ModalOverlay>
          )}

          {isDropdownOpen && (
            <Dropdown ref={dropdownRef} top={dropdownTop}>
              <li>
                <LuEye /> Preview
              </li>
              <li>
                <LuDownload /> Download
              </li>
              <li
                onClick={() => {
                  setIsEditOpen(true);
                  setIsDropdownOpen(false);
                }}
              >
                <LuPencilLine /> Edit
              </li>
              <li>
                <LuCopy /> Duplicate
              </li>
              <li onClick={handleDeleteClick}>
                <LuTrash2 /> Delete
              </li>
            </Dropdown>
          )}
        </Box>
      </Container>

      {isEditOpen && (
        <ModalOverlay onClick={() => setIsEditOpen(false)}>
          <EditBox onClick={(e) => e.stopPropagation()}>
            <h3>Edit</h3>
            <input type='text' placeholder='Name' value={renameName} onChange={(e) => setRenameName(e.target.value)} />
            <input
              type='text'
              placeholder='Description'
              value={renameDesc}
              onChange={(e) => setRenameDesc(e.target.value)}
            />
            <div className='actions'>
              <button
                onClick={() => {
                  setIsEditOpen(false);
                }}
              >
                OK
              </button>
              <button onClick={() => setIsEditOpen(false)}>Cancel</button>
            </div>
          </EditBox>
        </ModalOverlay>
      )}

      {isCreateOpen && (
        <ModalOverlay onClick={() => setIsCreateOpen(false)}>
          <EditBox onClick={(e) => e.stopPropagation()}>
            <h3>Create New Site</h3>
            <input
              type='text'
              placeholder='Name'
              value={newSiteName}
              onChange={(e) => setNewSiteName(e.target.value)}
            />
            <input
              type='text'
              placeholder='Short Description'
              value={newSiteDesc}
              onChange={(e) => setNewSiteDesc(e.target.value)}
            />
            <div className='actions'>
              <button
                onClick={() => {
                  const siteId = Date.now() + 1;
                  const page = {
                    id: Date.now() + 10,
                    siteId,
                    title: 'Untitled',
                    siteTitle: newSiteName,
                    siteDescription: newSiteDesc,
                    elements: [{ ...ELEMENTS_TEMPLATE['section'], id: 'section-1' }]
                  };

                  setIsCreateOpen(false);
                  dispatch(
                    addSite({
                      id: siteId,
                      title: newSiteName,
                      description: newSiteDesc,
                      size: 10,
                      pagesCount: 1,
                      createdAt: Date.now(),
                      lastModified: Date.now(),
                      pages: [page]
                    })
                  );

                  dispatch(setPage(page));
                  navigate(`/editor/sites/${siteId}/pages/${page.id}`);
                }}
              >
                Create
              </button>
              <button onClick={() => setIsCreateOpen(false)}>Cancel</button>
            </div>
          </EditBox>
        </ModalOverlay>
      )}
    </StyledDashboard>
  );
}

export default Dashboard;
