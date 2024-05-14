import React from "react";

const CircleNumber = ({ number }) => {
  return (
    <div className="bg-white border rounded-full h-20 w-20 flex justify-center items-center">
      <span className="text-lg font-bold">{number}</span>
    </div>
  );
};

export const BarProfile = ({ userData }) => {
  return (
    <div>
      <div className="relative border">
        <div className="bg-[#064e3b] dark:bg-[#26474E] text-white py-20 flex justify-center items-center">
          {/* Condition pour afficher userData */}
          {userData && userData.username && (
            <span className="text-3xl m-6 font-semibold">
              Bonjour {userData.username}
            </span>
          )}
        </div>
       
        <div className="flex justify-center absolute -bottom-16 left-0 right-0 object-none object-bottom">
          <div className="bg-white border rounded-full h-32 w-32 flex justify-center items-center">
            <img
              src="src/assets/images/cover_img.png"
              alt=""
              className=" rounded-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
