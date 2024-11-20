// import { BestSellers } from "../components/organisms/BestSellers";
// import { BlogPreview } from "../components/organisms/BlogPreview";
import { Helmet, HelmetProvider } from "react-helmet-async";
import HeroSection from "../components/organisms/HeroSection";
import { NewBooks } from "../components/organisms/NewBooks";
// import { Newsletter } from "../components/organisms/Newsletter";
import { Testimonials } from "../components/organisms/Testimonials";
import { TopRated } from "../components/organisms/TopRated";

const Home = () => {
  return (
    <HelmetProvider>
      <div className="container mx-auto px-4">
        {/* Grace au HelmetProvider jutilise Helmet pour gérer dynamiquement les balises meta */}
        <Helmet>
          <title>Home Page - Ebooky</title>

          <meta
            name="description"
            content="Obtennez tous vos livres préférés en un clic"
          />
        </Helmet>

        <div className="mt-5 space-y-8">
          <HeroSection />
          <NewBooks />
          <Testimonials />
          <TopRated />
        </div>
      </div>
    </HelmetProvider>
  );
};

export default Home;
