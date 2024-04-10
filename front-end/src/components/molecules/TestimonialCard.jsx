export default function TestimonialCard() {
    return (
        <div className="border-2 p-10 m-10 dark:border-white rounded-md">
            <p>⭐ ⭐ ⭐ ⭐ ⭐</p>
            <br />
            <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsam ipsa inventore mollitia facere quas
                voluptates, aspernatur autem totam accusamus minima porro, quos nihil expedita necessitatibus sit
                temporibus at incidunt quae
            </p>
            <br />
            <div className="flex flex-row content-center">
                <img className="rounded-full w-10 h-10 mr-10" src="public/images/placeholder.webp" alt="" />
                <p className="">Username</p>
            </div>
        </div>
    );
}
