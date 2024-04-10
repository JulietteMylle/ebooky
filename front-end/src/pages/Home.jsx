import { BestSellers } from "../components/organisms/BestSellers";
import { BlogPreview } from "../components/organisms/BlogPreview";
import HeroSection from "../components/organisms/HeroSection";
import { NewBooks } from "../components/organisms/NewBooks";
import { Newsletter } from "../components/organisms/Newsletter";
import { Testimonials } from "../components/organisms/Testimonials";


const Home = () => {
    return (
        <div>
            <div className="mt-5">
                <HeroSection />
                <Newsletter />
                <NewBooks />
                <Testimonials />
                <BestSellers />
                <BlogPreview />
            </div>
        </div>
    );
};

export default Home;
