import Terms from "../components/molecules/Terms";

export const TermsOfService = () => {
  return (
    <div className="bg-[#064e3b] dark:bg-[#26474E] text-white py-10">
      <div className="container mx-auto text-center mb-8">
        <h1 className="text-2xl font-bold mb-4">
          Nos conditions générales d&apos;utilisation & notre politique de
          confidentialité
        </h1>
      </div>

      <div className="bg-[#E0EBE1]">
        <Terms />
      </div>
    </div>
  );
};

export default TermsOfService;
