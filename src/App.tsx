import { ThemeProvider } from 'styled-components';
import Editor from './pages/Editor';
import GlobalStyles from './styles/GlobalStyles';
import theme from './styles/theme';

function App() {
  return (
    <>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <Editor />
      </ThemeProvider>
    </>
  );
}

export default App;
