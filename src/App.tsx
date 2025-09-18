import { Tooltip } from 'radix-ui';
import { Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import NotFound from './components/NotFound';
import RequireDesktop from './components/RequiredDesktop';
import { DashboardPath, EditorPath, Path } from './constant';
import HomeSites from './features/dashboard/main/HomeSites';
import RecentSites from './features/dashboard/main/RecentSites';
import StarredSites from './features/dashboard/main/StarredSites';
import Templates from './features/dashboard/main/Templates';
import Panel, { PanelProvider } from './features/editor/panels';
import Preview from './features/editor/Preview';
import Dashboard from './pages/Dashboard';
import Editor from './pages/Editor';
import Home from './pages/Home';
import GlobalStyles from './styles/GlobalStyles';
import theme from './styles/theme';

function App() {
  return (
    <BrowserRouter>
      <Tooltip.Provider disableHoverableContent delayDuration={200}>
        <PanelProvider>
          <ThemeProvider theme={theme}>
            <GlobalStyles />
            <Routes>
              <Route
                path={Path.Home}
                element={
                  <Suspense fallback={null}>
                    <Home />
                  </Suspense>
                }
              />
              <Route
                path={Path.Dashboard}
                element={
                  <RequireDesktop>
                    <Dashboard />
                  </RequireDesktop>
                }
              >
                <Route index element={<HomeSites />} />
                <Route path={DashboardPath.Recent} element={<RecentSites />} />
                <Route path={DashboardPath.Starred} element={<StarredSites />} />
                <Route path={DashboardPath.Templates} element={<Templates />} />
              </Route>
              <Route
                path={Path.Editor}
                element={
                  <RequireDesktop>
                    <Editor />
                  </RequireDesktop>
                }
              >
                <Route index element={<Navigate replace to={EditorPath.Elements} />} />
                <Route path={EditorPath.Elements} element={<Panel panel={EditorPath.Elements} sectioned />} />
                <Route path={EditorPath.Pages} element={<Panel panel={EditorPath.Pages} />} />
                <Route path={EditorPath.Layers} element={<Panel panel={EditorPath.Layers} />} />
                <Route path={EditorPath.Uploads} element={<Panel panel={EditorPath.Uploads} />} />
                <Route path={EditorPath.Preview} element={<Preview />} />
              </Route>
              <Route path={Path.NotFound} element={<NotFound />} />
            </Routes>
          </ThemeProvider>
        </PanelProvider>
      </Tooltip.Provider>
    </BrowserRouter>
  );
}

export default App;
