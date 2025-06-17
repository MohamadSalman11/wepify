import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { Path } from './constant';
import Dashboard from './pages/Dashboard';
import Editor from './pages/Editor';
import GlobalStyles from './styles/GlobalStyles';
import theme from './styles/theme';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <Routes>
          <Route path={Path.Dashboard} element={<Dashboard />} />
          <Route path={Path.Editor} element={<Editor />} />
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
