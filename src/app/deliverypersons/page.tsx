"use client";
import React, { useEffect, useState } from "react";
import Circular from "./Circular";
import Image from "next/image";
import dropdown from "../Assets/dropdown.png";
import { BackButton, Navbar } from "app/Components";
import axios from "axios";

interface I_User {
  name: string;
  lastname: string;
  status: string;
  id: number;
}

const Page = () => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [stateDeliveryData, setStateDeliveryData] = useState([]);
  const [usersActually, setUsersActually] = useState([]);
  const [counterControll, setCounterControll] = useState(0);
  const countPoints = Math.round(stateDeliveryData.length / 10);
  const points = Array.from({ length: countPoints }, (_, i) => i + 1);
  const [token, setToken] = useState<string>("");

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const updateUsers = () => {
    console.log("click");

    if (counterControll > stateDeliveryData.length) {
      setCounterControll(0);
      const controllData = stateDeliveryData.slice(
        counterControll,
        counterControll + 9
      );
      setUsersActually(controllData);
    } else {
      const controllData = stateDeliveryData.slice(
        counterControll,
        counterControll + 9
      );
      setUsersActually(controllData);
      return setCounterControll(counterControll + 10);
    }
  };

  useEffect(() => {
    try {
      const getData = async (prop: string) => {
        const getDataFetch = await axios.get(
          "https://fastdeliveryserver.xyz/api/user/deliveries",
          {
            headers: {
              Authorization: `Bearer ${prop}`
            }
          }
        );

        getDataFetch
          ? setStateDeliveryData(getDataFetch.data.allUsers)
          : new Error("Error: No se pudieron obtener los usuarios");
      };
      const json = JSON.parse(localStorage.getItem("session") || "{}");
      if (json && json.value) {
        getData(json.value);
        setToken(json.value);
      }
    } catch (error) {
      // Handle the error gracefully (if needed)
      console.error("Error parsing JSON:", error);
    }
  }, [token]);

  useEffect(() => {
    const controllerCountUsers = () => {
      if (stateDeliveryData.length > 0) {
        const controllData = stateDeliveryData.slice(
          counterControll,
          counterControll + 10
        );
        setUsersActually(controllData);
      }
    };

    controllerCountUsers();
  }, [stateDeliveryData]);

  return (
    <>
      <Navbar />
      <div className="py-6">
        <div className="w-90 mx-auto">
          <button className="">
            <BackButton />
          </button>
        </div>
        <div
          className="w-90 top-0 bg-white shadow-sm rounded-md mx-auto px-6 pb-6"
          style={{ boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.14)" }}
        >
          <section className="flex justify-between w-90 mx-auto">
            <div
              className="py-6 font-bold font-sans text-base leading-tight cursor-pointer "
              onClick={handleToggle}
            >
              Repartidores
            </div>

            <button className="">
              <Image src={dropdown} alt="dropdown" />
            </button>
          </section>
          {usersActually ? (
            usersActually.map((User: I_User, index) => (
              <Circular
                name={User.name}
                surname={User.lastname}
                status={User.status}
                id={User.id}
                key={index}
                User={User}
                counter={counterControll}
              />
            ))
          ) : (
            <h1>No se encontraron usuarios</h1>
          )}
          <div className="flex w-90 mx-auto justify-center py-4 ">
            {points.map((punto, key) => (
              <button onClick={() => updateUsers()} key={key}>
                <li>
                  <a href={`#punto${punto}`}></a>
                </li>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
