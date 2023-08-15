"use client";
import React, { useEffect, useState, ChangeEvent } from "react";
import Image from "next/image";
import { BackButton, Navbar } from "app/Components";
import dropdown from "../../Assets/dropdown.png";
import trash from "../../Assets/trash.png";
import profile from "../../Assets/Ellipse 9.png";
import "../styles.css";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Package } from "../../interfaces/packages";
import { useAppSelector, useAppDispatch } from "redux/hooks";
import { setUser } from "redux/features/users";
import { setPackages, deletePackage } from "redux/features/packages";

type DropdownState = boolean;

const Page = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.users);
  const packages = useAppSelector((state) => state.packages);
  const [isChecked, setIsChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [dropdownOpenOnCourse, setDropdownOpenOncourse] =
    useState<DropdownState>(false);
  const [dropdownOpenDelivered, setDropdownOpenDelivered] =
    useState<DropdownState>(false);
  const [dropdownOpenPending, setDropdownOpenPending] =
    useState<DropdownState>(false);
  const [token, setToken] = useState<string>("");

  const fetchUser = async (token: string) => {
    try {
      const response = await axios.get(
        `https://fastdeliveryserver.xyz/api/user/details/${params.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      dispatch(setUser(response.data.deliveryDetails));
      return response.data.deliveryDetails;
    } catch (error) {
      console.log(error);
      // localStorage.removeItem("session");
      // return router.push("/login");
    }
  };

  const fetchPackages = async (token: string) => {
    try {
      const response = await axios.get(
        `https://fastdeliveryserver.xyz/api/packages/${params.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      const packagesById = response.data.packages;
      const currentDate = new Date().toISOString().slice(0, 10);

      const res = await axios.get(
        `https://fastdeliveryserver.xyz/api/packages/packagesDay/${currentDate}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      const pendingToday = res.data.AllPackagesDay;
      const allPackages = packagesById.concat(pendingToday);
      dispatch(setPackages(allPackages));
      return allPackages;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  const handleCheckboxChange = async (event: ChangeEvent<HTMLInputElement>) => {
    setIsChecked(event.target.checked);
    const change = user.status === "active" ? "inactive" : "active";
    try {
      const response = await axios.put(
        `https://fastdeliveryserver.xyz/api/user/edit/${params.id}`,
        { status: change },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      dispatch(setUser(response.data.editedUser));
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (
    event: React.MouseEvent<HTMLImageElement, MouseEvent>
  ) => {
    event.preventDefault();
    event.stopPropagation();
    const id = event.currentTarget.id;
    await axios.delete(
      `https://fastdeliveryserver.xyz/api/packages/delete/package/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    dispatch(deletePackage(Number(id)));
  };

  useEffect(() => {
    const getAll = async () => {
      const json = JSON.parse(localStorage.getItem("session") || "{}");

      try {
        if (json && json.value) {
          const userData = await fetchUser(json.value);
          await fetchPackages(json.value);
          setToken(json.value);
          console.log(userData.status);
          setIsChecked(userData.status === "active");
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error parsing JSON:", error);
        localStorage.removeItem("session");
        return router.push("/login");
      }
    };
    getAll();
  }, []);
  // console.log(isChecked);
  // console.log("isLoading:", isLoading);
  // console.log("user:", user);

  if (isLoading) return <></>;

  return (
    <div className="mx-auto">
      <Navbar />
      <BackButton />
      <div
        id="container-courier-details"
        className="w-90 mx-auto flex flex-col justify-start mx-auto items-center"
      >
        <div className="shadow-lg rounded-[4px] w-full my-4 flex flex-col justify-center p-4">
          <div className="flex justify-between items-center p-4">
            <div className="flex">
              <Image
                alt="profile"
                src={profile}
                width={40}
                height={40}
                className="self-start"
              />
              <div className="ml-4 flex-col justify-center items-center">
                <p className="font-bold text-lg font-sans">{user.name}</p>

                {user.status === "active" ? (
                  <p className="text-blue-500">{user.status}</p>
                ) : (
                  <p className="text-orange-500">{user.status}</p>
                )}
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={isChecked}
                onChange={handleCheckboxChange}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
          <div className="shadow-lg rounded-[11px] w-full my-4 flex flex-col justify-center p-4">
            <div
              style={{ cursor: "pointer" }}
              className="flex justify-between mx-4"
              onClick={() => {
                setDropdownOpenOncourse(!dropdownOpenOnCourse);
              }}
            >
              <p className="font-bold text-lg font-sans">Repartos En Curso</p>
              <Image
                src={dropdown}
                alt="dropdown"
                width={13}
                className={`self-start transition-transform transform ${
                  dropdownOpenOnCourse ? "rotate-180" : ""
                }`}
              />
            </div>
            <p className="ml-4 font-sans text-sm">
              {" "}
              {`Estas repartiendo ${packages["en curso"].length} paquetes`}{" "}
            </p>
            {dropdownOpenOnCourse && packages["en curso"].length > 0
              ? packages["en curso"].map((paquete: Package) => {
                  return (
                    <div
                      key={paquete.id}
                      className="flex justify-between py-4 h-110px w-full"
                    >
                      <div className="w-[80px] h-[80px] bg-[#E8EFFA] border-sm rounded-sm">
                        <img
                          style={{ height: "inherit" }}
                          src={paquete.image}
                          alt="img-package"
                        />
                      </div>
                      <div className="flex justify-between w-51vw md:w-60vw items-center">
                        <div className="flex justify-between">
                          <p className="font-sans text-sm mr-8 hidden md:block">
                            {paquete.clientname}
                          </p>
                          <p className="font-sans text-sm mr-8">
                            {paquete.fullAdress}
                          </p>
                        </div>
                        <div className="flex flex-col justify-around items-center w-30vw md:w-10vw lg:w-6vw h-full">
                          <p className="font-sans text-sm font-bold self-end">
                            {paquete.status}
                          </p>
                          <Image
                            src={trash}
                            alt="trash"
                            width={16}
                            className="h-5"
                            id={String(paquete.id)}
                            onClick={handleDelete}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })
              : false}
          </div>
          <div className="shadow-lg rounded-[11px] w-full my-4 flex flex-col justify-center p-4">
            <div
              style={{ cursor: "pointer" }}
              className="flex justify-between mx-4"
              onClick={() => {
                setDropdownOpenPending(!dropdownOpenPending);
              }}
            >
              <p className="font-bold text-lg font-sans">Repartos Pendientes</p>
              <Image
                src={dropdown}
                alt="dropdown"
                width={13}
                className={`self-start transition-transform transform ${
                  dropdownOpenPending ? "rotate-180" : ""
                }`}
              />
            </div>
            <p className="ml-4 font-sans text-sm">
              {" "}
              {`Estas repartiendo ${packages.pendiente.length} paquetes`}{" "}
            </p>
            {dropdownOpenPending && packages.pendiente.length > 0
              ? packages.pendiente.map((paquete: Package) => {
                  return (
                    <div
                      key={paquete.id}
                      className="flex justify-between py-4 h-110px w-full"
                    >
                      <div className="w-[80px] h-[80px] bg-[#E8EFFA] border-sm rounded-sm">
                        <img
                          style={{ height: "inherit" }}
                          src={paquete.image}
                          alt="img-package"
                        />
                      </div>
                      <div className="flex justify-between w-51vw md:w-60vw items-center">
                        <div className="flex justify-between">
                          <p className="font-sans text-sm mr-8 hidden md:block">
                            {paquete.clientname}
                          </p>
                          <p className="font-sans text-sm mr-8">
                            {paquete.fullAdress}
                          </p>
                        </div>
                        <div className="flex flex-col justify-around items-center w-30vw md:w-10vw lg:w-6vw h-full">
                          <p className="font-sans text-sm font-bold self-end">
                            {paquete.status}
                          </p>
                          <Image
                            src={trash}
                            alt="trash"
                            width={16}
                            className="h-5"
                            id={String(paquete.id)}
                            onClick={handleDelete}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })
              : false}
          </div>
          <div
            onClick={() => {
              setDropdownOpenDelivered(!dropdownOpenDelivered);
            }}
            className="shadow-lg rounded-[4px] w-full my-4 flex flex-col justify-center p-4"
          >
            <div className="flex justify-between mx-4">
              <p className="font-bold text-lg font-sans">
                Historial de Repartos
              </p>

              <Image
                src={dropdown}
                alt="dropdown"
                width={13}
                className={`self-start transition-transform transform ${
                  dropdownOpenDelivered ? "rotate-180" : ""
                }`}
              />
            </div>
            <p className="ml-4 font-sans text-sm">
              {" "}
              {`Ya repartiste ${packages.entregado.length} paquetes`}{" "}
            </p>
            {dropdownOpenDelivered && packages.entregado.length > 0
              ? packages.entregado.map((paquete: Package) => {
                  return (
                    <div
                      key={paquete.id}
                      className="flex justify-between py-4 h-110px w-full"
                    >
                      <div className="w-[80px] h-[80px] bg-[#E8EFFA] border-sm rounded-sm">
                        <img
                          style={{ height: "inherit" }}
                          src={paquete.image}
                          alt="img-package"
                        />
                      </div>
                      <div className="flex justify-between w-51vw md:w-60vw items-center">
                        <div className="flex justify-between">
                          <p className="font-sans text-sm mr-8 hidden md:block">
                            {paquete.clientname}
                          </p>
                          <p className="font-sans text-sm mr-8">
                            {paquete.fullAdress}
                          </p>
                        </div>
                        <div className="flex flex-col justify-around items-center w-30vw md:w-10vw lg:w-6vw h-full">
                          <p className="font-sans text-sm font-bold self-end">
                            {paquete.status}
                          </p>
                          <Image
                            src={trash}
                            alt="trash"
                            width={16}
                            className="h-5"
                            id={String(paquete.id)}
                            onClick={handleDelete}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })
              : false}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Page;
