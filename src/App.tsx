import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { DashboardPath, EditorPath, Path } from './constant';
import RecentSites from './features/dashboard/main/RecentSites';
import SitesView from './features/dashboard/main/SitesView';
import StarredSites from './features/dashboard/main/StarredSites';
import Panel from './features/editor/panels';
import Preview from './features/editor/Preview';
import Dashboard from './pages/Dashboard';
import Editor from './pages/Editor';
import Home from './pages/Home';
import GlobalStyles from './styles/GlobalStyles';
import theme from './styles/theme';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <Routes>
          <Route path={Path.Home} element={<Home />} />
          <Route path={Path.Dashboard} element={<Dashboard />}>
            <Route index element={<SitesView />} />
            <Route path={DashboardPath.Recent} element={<RecentSites />} />
            <Route path={DashboardPath.Starred} element={<StarredSites />} />
          </Route>
          <Route path={Path.Editor} element={<Editor />}>
            <Route index element={<Navigate replace to={EditorPath.Elements} />} />
            <Route path={EditorPath.Elements} element={<Panel panel={EditorPath.Elements} sectioned={true} />} />
            <Route path={EditorPath.Pages} element={<Panel panel={EditorPath.Pages} />} />
            <Route path={EditorPath.Layers} element={<Panel panel={EditorPath.Layers} />} />
            <Route path={EditorPath.Uploads} element={<Panel panel={EditorPath.Uploads} />} />
            <Route path={EditorPath.Preview} element={<Preview />} />
          </Route>
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
