import TestimonialCard from '../molecules/TestimonialCard';

export const Testimonials = () => {
    return (
        <div>
            <div className="space-y-4 p-5 px-16">
                <p className="text-2xl font-bold align-middle text-center">Ils nous ont fait confiance</p>

            </div>
            <div className="flex flex-row justify-around">
                <TestimonialCard />

            </div>
        </div>
    );
};
