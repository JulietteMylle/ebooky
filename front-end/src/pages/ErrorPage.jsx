export const ErrorPage = () => {
    const returnBack = () => {
        window.history.back();
    };
    return (
        <div>
            <img src="src/assets/Oups.png" alt="Oups" />
            <h1>Page introuvable</h1>
            <p>La page que vous recherchez n&apos;existe pas ou a été retirée</p>
            <button onClick={returnBack}>Revenir en arrière</button>
        </div>
    );
};
