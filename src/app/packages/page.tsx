"use client";
import React, { useEffect, useState } from "react";
import { BackButton, Navbar } from "app/Components";
import axios from "axios";
import Image from "next/image";
import imagen from "../Assets/package-icon-vector.jpg";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

const GetPackages = () => {
  const currentDate = new Date().toISOString().slice(0, 10);
  const router = useRouter();
  const [packagesDay, setPackagesDay] = useState<any>([]);
  const [packagesTaken, setPackagesTaken] = useState<any>([]);
  const isClient = typeof window !== "undefined";
  let token = "";
  let userId = "";
  if (isClient) {
    const dataLocalStorage = JSON.parse(
      localStorage.getItem("session") || "{}"
    );
    token = dataLocalStorage.value;
    userId = dataLocalStorage.user;
  }

  const handleTomarPaquete = (paquete: any) => {
    const updatedPackagesTaken = [...packagesTaken];
    updatedPackagesTaken.push(paquete);
    setPackagesTaken(updatedPackagesTaken);
  };

  const handleCancelarPaquete = (paquete: any) => {
    const updatedPackagesTaken = packagesTaken.filter(
      (item: any) => item.id !== paquete.id
    );
    setPackagesTaken(updatedPackagesTaken);
  };

  const fetchDataPackagesDay = async () => {
    console.log(currentDate);

    try {
      const response = await axios.get(
        `https://fastdeliveryserver.xyz/api/packages/packagesDay/${currentDate}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      const allPackagesPendingDay = response.data.AllPackagesDay;
      if (!allPackagesPendingDay[0]) {
        return Swal.fire({
          title: "Hoy no hay paquetes para entregar",
          icon: "info",
          confirmButtonText: "Continuar",
          confirmButtonColor: "#217BCE"
        });
      }
      setPackagesDay(allPackagesPendingDay);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchDataPackagesDay();
  }, []);

  const isPackageTaken = (paquete: any) => {
    const isTaken = packagesTaken.some(
      (takenPackage: any) => takenPackage.id === paquete.id
    );
    return isTaken;
  };

  const handleConfirmarPaquetes = async (paquetes: any) => {
    if (packagesTaken.length > 10) {
      return Swal.fire({
        title: "Advertencia",
        text: `No se pueden tomar más de 10 (diez) pedidos por día`,
        icon: "warning",
        confirmButtonText: "Continuar",
        confirmButtonColor: "#217BCE"
      });
    } else if (packagesTaken.length === 0) {
      return Swal.fire({
        title: "Advertencia",
        text: `Debe seleccionar al menos un paquete para iniciar la jornada`,
        icon: "warning",
        confirmButtonText: "Continuar",
        confirmButtonColor: "#217BCE"
      });
    }
    try {
      const updatedPackages = await Promise.all(
        paquetes.map(async (paquete: any) => {
          const response = await axios.put(
            `https://fastdeliveryserver.xyz/api/packages/edit/package/${paquete.id}`,
            {
              status: "en curso",
              userId: userId
            },
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          );
          router.push("/");
          return response.data.editedPackage;
        })
      );
      console.log("Paquetes actualizados con éxito:", updatedPackages);
    } catch (error) {
      console.error("Error al actualizar los paquetes:", error);
    }
  };

  return (
    <>
      <div className="mx-auto w-90">
        <Navbar />
      </div>

      <div className="max-w-md flex flex-col justify-start mx-auto items-center">
        <div className="shadow-lg rounded-md w-full my-4 flex flex-col justify-center p-4">
          <BackButton />
          <div className="flex justify-between mx-4 mt-3">
            <p className="font-bold text-lg font-sans"> Obtener Paquetes </p>
          </div>

          <p className="ml-4 font-sans text-sm">
            {" "}
            ¿Cuántos paquetes más vas a repartir hoy?{" "}
          </p>
          <div className="divide-y">
            {packagesDay?.map((paquete: any) => (
              <div
                key={paquete.id}
                className="flex justify-between py-4 h-110px w-full"
              >
                <Image
                  className="bg-[#E8EFFA] border-sm rounded-sm"
                  src={imagen}
                  alt="imagen paquete"
                  width={80}
                  height={80}
                />

                <div className="flex justify-between">
                  <div className="flex flex-col justify-between h-full">
                    <div className="flex justify-between">
                      <p className="font-sans text-sm mr-2 text-right">
                        <span>
                          {" "}
                          {`${paquete.street} ${paquete.number} ${paquete.city}`}
                        </span>{" "}
                        <br />
                        <span>{paquete.clientname} </span>
                        <br />
                        {isPackageTaken(paquete) ? (
                          <button
                            className="w-20 bg-gray-500 hover:bg-blue-600 text-white font-semibold text-xs py-1 px-2 rounded mt-2"
                            onClick={() => handleCancelarPaquete(paquete)}
                          >
                            Cancelar
                          </button>
                        ) : (
                          <button
                            className="w-20 bg-blue-500 hover:bg-blue-600 text-white font-semibold text-xs py-1 px-2 rounded mt-2"
                            onClick={() => handleTomarPaquete(paquete)}
                          >
                            Tomar
                          </button>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold text-sm py-2 px-4 rounded mb-4"
          onClick={() => handleConfirmarPaquetes(packagesTaken)}
        >
          INICIAR JORNADA
        </button>
      </div>
    </>
  );
};

export default GetPackages;
