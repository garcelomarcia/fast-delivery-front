import React, { useEffect, useState } from "react";
import "./circular.css";
import Image from "next/image";
import profile from "../Assets/profile.png";
import Link from "next/link";
import axios from "axios";

interface Props {
  name: string;
  surname: string;
  status: string;
  id: number;
  User: object;
  counter: number;
}

const initialState = {
  allPackages: [],
  packagesActives: [],
  packagesPercentage: 0
};

const Circular: React.FC<Props> = ({ name, surname, status, id, counter }) => {
  const obj: { [key: string]: string } = {
    inactive: "#FF6B6B",
    Finalizó: "#96DB76",
    "Viaje en curso": "#217BCE"
  };

  let json;

  const [token, setToken] = useState<string>(""),
    [packages, setPackages] = useState(initialState),
    session = localStorage.getItem("session") || "",
    color = obj[status] || "";

  useEffect(() => {
    const getAllPackageFunction = async (prop: string) => {
      try {
        const getPackages = await axios.get(
          `https://fastdeliveryserver.xyz/api/packages/${id}/packages`,
          {
            headers: {
              Authorization: `Bearer ${prop}`
            }
          }
        );

        const packagesActives = await getPackages.data.packages.filter(
          (packages: { status: string }) => {
            return packages.status === "entregado";
          }
        );

        if (getPackages) {
          setPackages({
            ...packages,
            allPackages: getPackages.data.packages,
            packagesActives,
            packagesPercentage: Math.round(
              (packagesActives.length / getPackages.data.packages.length) * 100
            )
          });
        }
      } catch (error) {
        console.log(
          `Error al obtener los datos del usuario ${name} ${surname}`
        );

        setPackages({
          ...packages,
          packagesPercentage: 0
        });
      }
    };

    json = JSON.parse(session);

    try {
      if (json && json.value) {
        getAllPackageFunction(json.value);
        setToken(json.value);
      }
    } catch (error) {
      // Handle the error gracefully (if needed)
      console.error("Error parsing JSON:");
    }
  }, [counter, token]);

  return (
    <>
      {packages ? (
        <Link href={`courierdetails/${id}`}>
          <div
            id="container"
            className="flex w-90 py-4 mx-auto items-center sm:justify-between"
          >
            <section
              className="circular-progress"
              style={{
                background: `conic-gradient(${
                  packages.packagesPercentage === 100 ? "#96DB76" : "#FCBC11"
                } ${packages.packagesPercentage * 3.6}deg, #ededed 0deg)`
              }}
            >
              <span className="absolute font-bold">
                {packages.packagesPercentage
                  ? `${packages.packagesPercentage}%`
                  : "0%"}
              </span>
            </section>
            <section id="container-state" className="flex flex-col ml-8 w-45">
              <p className="my-0 mb-2 font-bold">{name}</p>
              <p className="my-0 mb-2 font-bold">{surname}</p>
              <div className="flex items-center">
                <p className="my-0 mr-2 h-2 w-2 rounded-lg bg-cyan-text"></p>
                <p
                  id="state"
                  className="my-0 text-cyan-text font-bold"
                  style={{ color: `${color}` }}
                >
                  {status}
                </p>
              </div>
            </section>
            <section className="image-profile-delivery ml-2">
              <Image src={profile} alt={"profile-picture"} />
            </section>
          </div>
        </Link>
      ) : (
        <h1>No se encontro el usuario</h1>
      )}
    </>
  );
};

export default Circular;
