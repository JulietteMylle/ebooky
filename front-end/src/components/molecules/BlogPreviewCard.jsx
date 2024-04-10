export default function BlogPreviewCard() {
    return (
        <div className="flex flex-col border-2 w-1/4 h-auto">
            <img src="public/images/placeholder.webp" className="flex flex-row pb-1" alt="" />
            <div className="font-bold p-6">
                <p className="font-thin text-sm pb-3">Catégorie</p>
                <p className="text-3xl pb-2">Titre Article Blog</p>
                <p className="font-thin text-sm pb-6">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore minus dolore vel, maiores
                    reprehenderit velit voluptatibus non sequi aut distinctio quisquam magni!
                </p>
                <div className="flex flex-row content-center">
                    <img className="rounded-full w-10 h-10 mr-10" src="public/images/placeholder.webp" alt="" />
                    <div className="flex flex-col">
                        <p className="font-light">Username</p>
                        <p className="font-thin">26 fev. 2024</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
