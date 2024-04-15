import { Button } from "../components/ui/button";

const ErrorPage = () => {
  const returnBack = () => {
    window.history.back();
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center text-[#064e3b]"
      style={{ backgroundImage: "url('src/assets/images/Oups.png')" }}
    >
      <div className="flex flex-col justify-center items-center h-full">
        <h1 className="text-4xl font-bold mb-4">Page introuvable</h1>
        <p className="text-lg mb-4">
          La page que vous recherchez n&apos;existe pas ou a été retirée.
        </p>
        <Button onClick={returnBack}>Revenir en arrière</Button>
      </div>
    </div>
  );
};

export default ErrorPage;
