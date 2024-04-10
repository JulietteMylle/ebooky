import { BrowserRouter } from 'react-router-dom';
import NavBar from './components/organisms/NavBar';
import { Footer } from './components/organisms/Footer';
import Routes from './lib/routes';
import { ThemeProvider } from './components/providers/theme-provider';

const App = () => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <NavBar />
        <Routes />
        <Footer />
      </ThemeProvider>
    </BrowserRouter>
  )
};

export default App;
