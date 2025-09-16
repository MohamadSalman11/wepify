import { Tooltip } from 'radix-ui';
import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import FullScreenMessage from './components/FullScreenMessage';
import NotFound from './components/NotFound';
import RequireDesktop from './components/RequiredDesktop';
import { DashboardPath, EditorPath, LoadingMessages, Path } from './constant';
import HomeSites from './features/dashboard/main/HomeSites';
import RecentSites from './features/dashboard/main/RecentSites';
import StarredSites from './features/dashboard/main/StarredSites';
import Panel, { PanelProvider } from './features/editor/panels';
import Preview from './features/editor/Preview';
import GlobalStyles from './styles/GlobalStyles';
import theme from './styles/theme';

const Home = lazy(() => import('./pages/Home'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Editor = lazy(() => import('./pages/Editor'));

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
                    <Suspense
                      fallback={<FullScreenMessage mode='loading' message={LoadingMessages.DashboardCodeSplit} />}
                    >
                      <Dashboard />
                    </Suspense>
                  </RequireDesktop>
                }
              >
                <Route index element={<HomeSites />} />
                <Route path={DashboardPath.Recent} element={<RecentSites />} />
                <Route path={DashboardPath.Starred} element={<StarredSites />} />
              </Route>
              <Route
                path={Path.Editor}
                element={
                  <RequireDesktop>
                    <Suspense fallback={<FullScreenMessage mode='loading' message={LoadingMessages.EditorCodeSplit} />}>
                      <Editor />
                    </Suspense>
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
