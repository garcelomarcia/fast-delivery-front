import React from "react";

function Spinner() {
  return (
    <>
      <div className="flex justify-center pt-40 h-screen">
        <div className="border-t-8 border-orange-500 rounded-full animate-spin ease-linear w-12 h-12"></div>
      </div>
    </>
  );
}

export default Spinner;
