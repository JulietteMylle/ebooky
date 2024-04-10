import BlogPreviewCard from '../molecules/BlogPreviewCard';
import { Button } from '../ui/button';

export const BlogPreview = () => {
    return (
        <div>
            <p className="space-y-4 p-5 px-16">Blog</p>
            <div className="space-y-4 p-5 px-16">
                <div className="flex flex-row justify-between">
                    <h2 className="text-2xl font-bold align-middle">Ils en discutent sur notre site</h2>
                    <Button> Voir plus </Button>
                </div>
                <h5>Retrouvez ici tous nos articles de Blog.</h5>
            </div>
            <div className="flex flex-row justify-evenly py-9">
                <BlogPreviewCard />
                <BlogPreviewCard />
                <BlogPreviewCard />
            </div>
        </div>
    );
};
