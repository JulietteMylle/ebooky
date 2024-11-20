import { BrowserRouter } from "react-router-dom";
import NavBar from "./components/organisms/NavBar";
import { Footer } from "./components/organisms/Footer";
import Routes from "./lib/routes";
import { ThemeProvider } from "./components/providers/theme-provider";
import { HelmetProvider } from "react-helmet-async";

const App = () => {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <ThemeProvider>
          <NavBar />
          <Routes />
          <Footer />
        </ThemeProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
};

export default App;
