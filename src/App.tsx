import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
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
          <Route path='/sites' element={<Dashboard />} />
          <Route path='/editor/sites/:site/pages/:page' element={<Editor />} />
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
