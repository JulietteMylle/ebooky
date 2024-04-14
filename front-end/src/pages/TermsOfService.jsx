import Terms from "../components/molecules/Terms";

export const TermsOfService = () => {
  return (
    <div>
      <div className="text-justify-center bg-[#064e3b] text-white py-10">
        <h1 className="font-semibold text-2xl text-center">
          Nos conditions générale d&apos;utilisation & notre politique de
          confidentialité
        </h1>
        <p className="text-center font-light italic">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate{" "}
        </p>
      </div>
      <div className="m-8 ">
        <Terms />
      </div>
    </div>
  );
};

export default TermsOfService;
