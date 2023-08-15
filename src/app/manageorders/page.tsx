"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import avatar from "../Assets/Ellipse 10.png";
import dropdown from "../Assets/dropdown.png";
import avatar2 from "../Assets/Ellipse 6.png";
import { Navbar } from "app/Components";
import { useState } from "react";
import BackButton from "app/Components";
import "./page.css";
import axios from "axios";
import Link from "next/link";
import packageImage from "../Assets/paquete.png";
import { Package } from "../interfaces/packages";

interface Day {
  id: number;
  name: string;
  dayNumber: number;
  month: string;
  monthNumber: number;
  year: number;
}

interface User {
  id: number;
  name: string;
  lastname: string;
  email: string;
  address: string;
  phone: string;
  isAdmin: boolean;
  status: string;
}

const dateActually = new Date();
const year = dateActually.getFullYear();
const month = String(dateActually.getMonth() + 1).padStart(2, "0");
const day = String(dateActually.getDate()).padStart(2, "0");
const formattedDateDay = `${year}-${month}-${day}`;

const options = {
  weekday: "short",
  day: "2-digit",
  month: "short",
  year: "numeric"
} as const;
const formatter = new Intl.DateTimeFormat("es-ES", options);
const formattedDate = formatter.format(dateActually);
const days: Day[] = [];

// Función para obtener el nombre del día en formato corto (Lun, Mar, Mié, ...)
function getShortDayName(day: Date): string {
  const options = { weekday: "short" as const };
  return day.toLocaleString("es-ES", options);
}

// funcion para obtener el mes en numero
function getMonthNumber(day: Date): number {
  return day.getMonth() + 1; // Sumamos 1 porque los meses en JavaScript van de 0 a 11
}

// Función para obtener el nombre del mes en formato corto (ene, feb, mar, ...)
function getShortMonthName(day: Date): string {
  const options = { month: "short" as const };
  return day.toLocaleString("es-ES", options);
}

// Agregar 10 días hacia atrás
for (let i = 10; i >= 1; i--) {
  const prevDay = new Date(dateActually);
  prevDay.setDate(dateActually.getDate() - i);
  days.push({
    id: prevDay.getDate(),
    name: getShortDayName(prevDay),
    dayNumber: prevDay.getDate(),
    month: getShortMonthName(prevDay),
    monthNumber: getMonthNumber(prevDay),
    year: prevDay.getFullYear()
  });
}

// Agregar el día actual
days.push({
  id: dateActually.getDate(),
  name: getShortDayName(dateActually),
  dayNumber: dateActually.getDate(),
  month: getShortMonthName(dateActually),
  monthNumber: getMonthNumber(dateActually),
  year: dateActually.getFullYear()
});

// Agregar 10 días hacia adelante
for (let i = 1; i <= 10; i++) {
  const nextDay = new Date(dateActually);
  nextDay.setDate(dateActually.getDate() + i);
  days.push({
    id: nextDay.getDate(),
    name: getShortDayName(nextDay),
    dayNumber: nextDay.getDate(),
    month: getShortMonthName(nextDay),
    monthNumber: getMonthNumber(nextDay),
    year: nextDay.getFullYear()
  });
}

const Index = () => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true),
    handleToggle = () => {
      setIsExpanded(!isExpanded);
    };

  const [dateSelected, setDateSelected] = useState(
    formattedDateDay || "2023-07-07"
  );
  const [packageDay, setPackageDay] = useState<Package[]>([]);
  const [packageDayDelivered, setPackageDayDelivered] = useState<Package[]>([]);
  const [allPackages, setAllpackages] = useState<Package[]>([]);
  const [allDeliveries, setAllDeliveries] = useState<User[]>([]);
  const [allDeliveriesActive, setAllDeliveriesActive] = useState<User[]>([]);

  const isClient = typeof window !== "undefined";
  let token = "";
  if (isClient) {
    const dataLocalStorage = JSON.parse(localStorage.getItem("session") || "");
    token = dataLocalStorage.value;
  }

  const handleDaySelected = (year: any, monthNumber: any, dayNumber: any) => {
    const paddedMonth = String(monthNumber).padStart(2, "0");
    const paddeDay = String(dayNumber).padStart(2, "0");
    const dataSelectedUpdated = `${year}-${paddedMonth}-${paddeDay}`;
    setDateSelected(dataSelectedUpdated);
  };

  useEffect(() => {
    handleObtenerPaquetes();
  }, [dateSelected]);

  const handleObtenerRepartidores = async () => {
    try {
      axios
        .get("https://fastdeliveryserver.xyz/api/user/deliveries", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then((response) => {
          setAllDeliveries(response.data.allUsers);
        });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleObtenerRepartidores();
  }, []);

  useEffect(() => {
    handleObtenerRepartidoresActivos();
  }, [allDeliveries]);

  const handleObtenerRepartidoresActivos = () => {
    const repartidoresActivos = [];
    for (let i = 0; i < allDeliveries.length; i++) {
      if (allDeliveries[i].status === "active") {
        repartidoresActivos.push(allDeliveries[i]);
      }
    }
    setAllDeliveriesActive(repartidoresActivos);
  };

  const handleObtenerPaquetes = async () => {
    try {
      const response = await axios.get(
        `https://fastdeliveryserver.xyz/api/packages/packagestodos`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      const todosPaquetes = response.data.allPackages;
      setAllpackages(todosPaquetes);
    } catch (error) {
      console.error("Error al obtener los paquetes:", error);
    }
  };

  useEffect(() => {
    const paquetesdeldia = [];
    const entregadosdeldia = [];
    for (let i = 0; i < allPackages.length; i++) {
      const deliveryDate = allPackages[i].deliveryday;
      if (deliveryDate?.toString().slice(0, 10) === dateSelected.toString()) {
        paquetesdeldia.push(allPackages[i]);
        if (allPackages[i].status === "entregado") {
          entregadosdeldia.push(allPackages[i]);
        }
      }
    }
    setPackageDayDelivered(entregadosdeldia);
    setPackageDay(paquetesdeldia);
  }, [dateSelected, allPackages]);

  const fecha = dateSelected.split("-")[2].padStart(2, "0");

  return (
    <div className="shadow-lg mx-auto w-full">
      <Navbar />
      <BackButton />
      <div className="shadow-lg rounded-md mx-auto w-90 my-4 flex flex-row items-center justify-between p-4">
        <div className="flex items-center">
          <Image src={avatar} alt="logo" className="w-20 h-20" />
          <div className="ml-4">
            <p className="font-sans text-sm">Hola Admin!</p>
            <p className="font-bold text-lg font-sans">Gestionar pedidos</p>
          </div>
        </div>
      </div>
      <div className="rounded-md w-3/4 mx-auto my-4 flex flex-row justify-center sm:w-100">
        <ul className="w-full flex justify-around overflow-x-auto overflow-hidden whitespace-nowrap items-center">
          {days.map((day) => (
            <li
              key={day.id}
              className={
                day.dayNumber === parseInt(fecha)
                  ? "bg-yellow-500 rounded-45 m-2 p-4 h-20vh w-12vw md:w-8vw lg:w-6vw flex items-center flex-col justify-center"
                  : "bg-blue-500 rounded-45 m-2 p-4 h-20vh w-12vw md:w-8vw lg:w-6vw flex items-center flex-col justify-center"
              }
              onClick={() =>
                handleDaySelected(day.year, day.monthNumber, day.dayNumber)
              }
            >
              <p style={{ color: "white" }}>{day.month}</p>
              <p
                style={{
                  color: "white",
                  fontWeight: "bolder",
                  fontSize: "1.5rem"
                }}
              >
                {day.dayNumber}
              </p>
              <p style={{ color: "white" }}>{day.name}</p>
            </li>
          ))}
        </ul>
      </div>

      <div
        id="detalles"
        className="rounded-md w-3/4 my-4 mx-auto flex flex-col justify-center items-center p-4"
      >
        <h1
          className="cursor-pointer w-90 flex justify-between items-center font-bold"
          onClick={handleToggle}
        >
          {`${formattedDate} - Detalles`}
          <Image className="h-3 w-4 ml-auto" src={dropdown} alt="dropdown" />
        </h1>
        {isExpanded && (
          <>
            <>
              <div
                id="container"
                className="flex w-80 mx-auto pb-10 pt-10 mt-4 items-center justify-between sm:w-1/2"
              >
                <section
                  className="circular-progress"
                  style={{
                    background: `conic-gradient(${
                      Math.round(
                        (allDeliveriesActive.length / allDeliveries.length) *
                          100
                      ) < 50
                        ? "#6373F7"
                        : "#FEBD93"
                    } ${
                      Math.round(
                        (allDeliveriesActive.length / allDeliveries.length) *
                          100
                      ) * 3.6
                    }deg, #ededed 0deg)`
                  }}
                >
                  <span className="absolute font-bold">
                    {allDeliveries.length
                      ? `${Math.round(
                          (allDeliveriesActive.length / allDeliveries.length) *
                            100
                        )}%`
                      : "0%"}
                  </span>
                </section>
                <section
                  id="container-state"
                  className="flex flex-col ml-8 w-45"
                >
                  <p className="my-0 mb-2 font-bold">Repartidores</p>
                  <div className="flex items-center">
                    <p
                      id="state"
                      className="my-0 text-gray-paragraphs"
                      style={{ color: "black" }}
                    >
                      {`${allDeliveriesActive.length} / ${allDeliveries.length} activos`}
                    </p>
                  </div>
                </section>
                <section className="image-profile-delivery ml-2">
                  <Image src={avatar2} alt={"profile-picture"} />
                </section>
              </div>
              <Link
                href={"deliverypersons"}
                className="flex items-center justify-center bg-dark-blue-button rounded mt-4 w-80 mx-auto sm:w-1/2 h-5vh text-white font-bold"
              >
                <h3>REPARTIDORES</h3>
              </Link>
            </>
            <>
              <div
                id="container"
                className="flex w-80 mx-auto pb-10 pt-10 mt-4 items-center justify-between sm:w-1/2"
              >
                <section
                  className="circular-progress"
                  style={{
                    background: `conic-gradient(${
                      Math.round(
                        (packageDayDelivered.length / packageDay.length) * 100
                      ) < 50
                        ? "#6373F7"
                        : "#FEBD93"
                    } ${
                      Math.round(
                        (packageDayDelivered.length / packageDay.length) * 100
                      ) * 3.6
                    }deg, #ededed 0deg)`
                  }}
                >
                  <span className="absolute font-bold">
                    {packageDay.length
                      ? `${Math.round(
                          (packageDayDelivered.length / packageDay.length) * 100
                        )}%`
                      : "0%"}
                  </span>
                </section>
                <section
                  id="container-state"
                  className="flex flex-col ml-8 w-45"
                >
                  <p className="my-0 mb-2 font-bold">Paquetes</p>
                  <div className="flex items-center">
                    <p
                      id="state"
                      className="my-0 text-gray-paragraphs"
                      style={{ color: "black" }}
                    >
                      {`${packageDayDelivered.length} / ${packageDay.length} paquetes`}
                    </p>
                  </div>
                </section>
                <section className="image-profile-delivery ml-2">
                  <Image
                    // className="h-12vh w-20vw sm:w-3vw lg:w-4vw object-contain"
                    src={packageImage}
                    alt={"package-picture"}
                  />
                </section>
              </div>
              <Link
                href={"/managepackages"}
                className="flex items-center justify-center bg-dark-blue-button rounded mt-4 w-80 mx-auto sm:w-1/2 h-5vh text-white font-bold"
              >
                <h3>VER PAQUETES</h3>
              </Link>
            </>
          </>
        )}
      </div>
    </div>
  );
};

export default Index;
