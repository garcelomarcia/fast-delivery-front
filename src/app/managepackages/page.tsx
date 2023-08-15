"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import trash from "../Assets/trash.png";
import polygon from "../Assets/polygon.png";
import dropdown from "../Assets/dropdown.png";
import { BackButton, Navbar } from "../Components";
import Link from "next/link";
import "./styles.css";
import axios from "axios";
import { Package } from "../interfaces/packages";
import imagen from "../Assets/package-icon-vector.jpg";

export default function ManagePackages() {
  const [token, setToken] = useState<string>("");
  const [stateDropdown, setStateDropdown] = useState(
    "dropdown-Controller-Container active"
  );
  const [packages, setPackages] = useState<Package[]>([]);
  const [loadedPackages, setLoadedPackages] = useState<number>(10);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);

  useEffect(() => {
    const session = localStorage.getItem("session") || "";
    const valor = session ? JSON.parse(session)?.value : "";
    const tokenn = valor;
    if (tokenn !== token) {
      setToken(tokenn);
    }
  }, [token]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://fastdeliveryserver.xyz/api/packages/", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setPackages(response.data.allPackages);
        setLoadingMore(false);
      } catch (error) {
        console.error("Error al obtener los datos:", error);

        setPackages([]);
        setLoadingMore(false);
      }
    };

    fetchData();
  }, [token]);

  const handleLoadMore = () => {
    setLoadingMore(true);
    setLoadedPackages((prevLoaded) => prevLoaded + 10);
  };

  const packagesToShow = packages.slice(0, loadedPackages);

  const dropdownController = () => {
    if (stateDropdown === "dropdown-Controller-Container active") {
      setStateDropdown("dropdown-Controller-Container");
    } else {
      setStateDropdown("dropdown-Controller-Container active");
    }
  };

  return (
    <>
      <div className="mx-auto w-90">
        {" "}
        <Navbar /> <BackButton />
      </div>

      <div className="w-90 flex flex-col justify-start mx-auto items-center">
        <div
          className={`${stateDropdown} w-full shadow-lg rounded-md w-321 my-4 flex flex-col justify-center p-8`}
        >
          <div className="flex justify-between mx-4">
            <p className="font-bold text-lg font-sans"> Todos los paquetes </p>
            <button onClick={dropdownController}>
              <Image
                src={
                  stateDropdown === "dropdown-Controller-Container active"
                    ? dropdown
                    : polygon
                }
                alt="dropdown"
              />
            </button>
          </div>

          <p className="ml-4 font-sans text-sm">
            {" "}
            Hay {packages.length} paquetes cargados
          </p>

          <div className="divide-y">
            {packagesToShow.map((packageItem: Package) => (
              <div
                className="flex justify-between py-4 h-110px w-full"
                key={packageItem.id}
              >
                <Image
                  className="w-[80px] h-[80px] bg-[#E8EFFA] border-sm rounded-sm"
                  src={imagen}
                  alt="imagen paquete"
                  width={80}
                  height={80}
                />
                <div className="flex justify-between">
                  <div>
                    <div className="flex justify-between items-center">
                      <p className="font-sans text-sm mr-auto whitespace-normal break-words">
                        {packageItem.fullAdress} <br /> {packageItem.clientname}{" "}
                        <br /> {packageItem.status}
                      </p>
                      <div className="ml-2">
                        <Image src={trash} alt="trash" width={16} height={16} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {loadingMore}
            {!loadingMore && loadedPackages < packages.length && (
              <button
                onClick={handleLoadMore}
                className="flex justify-between mx -4 mt-3 font-bold text-lg font-sans"
              >
                Cargar más
              </button>
            )}
          </div>
        </div>
        <Link href="addpackages">
          <button
            type="button"
            className="flex items-center justify-center w-10 h-10 bg-[#217BCE] hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 text-white rounded-full text-sm"
          >
            {" "}
            <span className="text-lg font-bold">+</span>
          </button>
        </Link>
      </div>
    </>
  );
}
