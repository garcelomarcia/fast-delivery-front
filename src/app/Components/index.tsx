"use client";

import React from "react";
import Image from "next/image";
import logo from "../Assets/logo.png";
import back from "../Assets/goBack.png";
import { useRouter } from "next/navigation";

export function Navbar() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("session");
    router.push("/login");
  };
  return (
    <nav
      style={{
        borderBottom: "1px solid gray",
        boxShadow: "0px 2px 4px rgba(0,0,0,0.1)",
        display: "flex", // Use flexbox
        justifyContent: "space-between", // Place items on opposite ends
        alignItems: "center", // Align items vertically at the center
        padding: "8px 16px" // Add some padding for better spacing
      }}
    >
      <div>
        <Image
          src={logo}
          alt="logo"
          style={{ width: "51px", height: "32px" }}
        />
      </div>
      <div className="flex-1 text-center">
        <h1 className="text-xl font-bold">
          <span className="text-yellow-500">FAST </span>
          <span>DELIVERY</span>
        </h1>
      </div>
      <div onClick={handleLogout}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5" // Corrected attribute name
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
          />
        </svg>
      </div>
    </nav>
  );
}

export function BackButton() {
  const router = useRouter();
  const handleBack = () => {
    router.back();
  };
  return (
    <div>
      <Image
        onClick={handleBack}
        src={back}
        alt="goBack"
        style={{ marginTop: "15px", marginLeft: "10px" }}
      />
    </div>
  );
}
interface ButtonProps {
  buttonText: string;
}

export const Button: React.FC<ButtonProps> = ({ buttonText }) => {
  return (
    <button
      type="submit"
      className="my-6 text-white bg-[#217BCE] hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-md text-sm px-5 py-2.5"
    >
      {buttonText}
    </button>
  );
};

export default BackButton;
