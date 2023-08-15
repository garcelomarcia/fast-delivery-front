"use client";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { setUser } from "redux/features/users";
import { setPackages, deletePackage } from "redux/features/packages";
import Image from "next/image";
import { Navbar, Button } from "../app/Components";
import dropdown from "./Assets/dropdown.png";
import trash from "./Assets/trash.png";
import Link from "next/link";
import { Package } from "./interfaces/packages";
import { useRouter } from "next/navigation";
import imagen from "../app/Assets/package-icon-vector.jpg";
import { setToken } from "redux/features/token";
import { getGeolocation, haversine } from "./utils";
import Swal from "sweetalert2";

type DropdownState = boolean;

export default function HomePage() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.users);
  const packages = useAppSelector((state) => state.packages);
  const token = useAppSelector((state) => state.token);
  const router = useRouter();
  const [delliveredDropdownOpen, setDeliveredDropdownOpen] =
    useState<DropdownState>(false);
  const [pendingDropdownOpen, setPendingDropdownOpen] =
    useState<DropdownState>(false);
  const [onCourseDropdownOpen, setOnCourseDropdownOpen] =
    useState<DropdownState>(false);
  const [distances, setDistances] = useState<number[]>([]);
  const [onCourse, setOnCourse] = useState<Package[]>([]);

  const fetchUser = async (token: string) => {
    try {
      const response = await axios.get("https://fastdeliveryserver.xyz/api/user/me", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      dispatch(setUser(response.data));
      if (response.data.isAdmin) return router.push("/manageorders");
      return response.data;
    } catch (error) {
      localStorage.removeItem("session");
      return router.push("/login");
    }
  };

  const fetchPackages = async (id: number, token: string) => {
    try {
      const response = await axios.get(
        `https://fastdeliveryserver.xyz/api/packages/${id}/packages`,
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

  const getDistances = async () => {
    const response = await getGeolocation();
    const lat = response.latitude;
    const lng = response.longitude;

    console.log(packages["en curso"]);

    const dist = packages["en curso"].map((each) => {
      const result = haversine(lat, lng, each.lat, each.lng);
      return Number(result.toFixed(1));
    });
    setDistances(dist);
  };

  const handleDetail = (packageId: number) => () => {
    router.push(`/delivery?package=${packageId}`);
  };

  const handleDelete = (packageId: number) => async () => {
    await axios.delete(
      `https://fastdeliveryserver.xyz/api/packages/delete/${packageId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    dispatch(deletePackage(packageId));
  };

  useEffect(() => {
    const json = JSON.parse(localStorage.getItem("session") || "{}");

    if (!localStorage.getItem("session") || !json.value) {
      router.push("/login");
      return;
    }

    if (json.value !== "" && user.id === 0) {
      dispatch(setToken(json.value));
      fetchUser(json.value);
    }
    getDistances();
  }, [packages]);

  useEffect(() => {
    const packagesWithDistances = packages["en curso"].map((each, index) => {
      const distance = distances[index];
      return {
        ...each,
        distance: distance
      };
    });
    packagesWithDistances.sort((a, b) => a.distance - b.distance);
    setOnCourse(packagesWithDistances);
  }, [distances]);

  useEffect(() => {
    // Check if user is defined and now is greater than the expiry time
    if (user && user.id !== 0) {
      const now = new Date().getTime();
      const session = JSON.parse(localStorage.getItem("session") || "{}");
      const expiry = session.expiry || 0;

      if (now > expiry) {
        router.push(`affidavit?id=${user.id}&token=${session.value}`);
      }
      if (user.status === "inactive") {
        Swal.fire({
          title: "Lo Sentimos",
          text: `Tu usuario ha sido deshabilitado`,
          icon: "warning",
          confirmButtonText: "Continuar",
          confirmButtonColor: "#217BCE"
        });
        localStorage.removeItem("session");
        router.push("/login");
      }
      fetchPackages(user.id, session.value);
    }
  }, [user]);

  return (
    <div className="mx-auto w-90">
      <Navbar />
      <div className="max-w-md flex flex-col justify-start mx-auto items-center">
        <Link href="packages">
          <Button buttonText="OBTENER PAQUETES" />
        </Link>
        <div className="shadow-lg rounded-md w-full my-4 flex flex-col justify-center p-4">
          <div className="flex justify-between mx-4">
            <p className="font-bold text-lg font-sans">Repartos En Curso</p>
            <Image
              className={`self-start transition-transform transform cursor-pointer ${
                onCourseDropdownOpen ? "rotate-180" : ""
              }`}
              src={dropdown}
              alt="dropdown"
              width={13}
              onClick={() => setOnCourseDropdownOpen(!onCourseDropdownOpen)}
            />
          </div>
          <p className="ml-4 font-sans text-sm">
            {onCourse.length === 0
              ? "No tenés historial de repartos"
              : `Tenés ${onCourse.length} paquetes por entregar hoy`}
          </p>
          {onCourseDropdownOpen && (
            <div className="divide-y">
              {onCourse.map((paquete: any) => {
                return (
                  <div
                    className="flex justify-between py-4 h-110px w-full cursor-pointer"
                    key={paquete.id}
                    onClick={handleDetail(paquete.id)}
                  >
                    <Image
                      className="bg-[#E8EFFA] border-sm rounded-sm"
                      src={paquete.image === "imagen" ? paquete.image : imagen}
                      alt="imagen paquete"
                      width={80}
                      height={80}
                    />
                    <div className="">
                      <div className="flex flex-col justify-between h-full">
                        {/* <div className="flex justify-between"> */}
                        <p className="font-sans text-sm">
                          {`${paquete.street} ${paquete.number} ${paquete.city}`}
                        </p>
                        {/* <Image
                            className="h-5"
                            src={trash}
                            alt="trash"
                            width={16}
                            height={16}
                          /> */}
                        {/* </div> */}
                        <p className="font-sans text-sm self-end">
                          {paquete.clientname}
                        </p>
                        <p className="font-sans text-sm font-bold self-end">
                          {`${paquete.distance} km`}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <div className="shadow-lg rounded-md w-full my-4 flex flex-col justify-center p-4">
          <div className="flex justify-between mx-4">
            <p className="font-bold text-lg font-sans">Repartos Pendientes</p>
            <Image
              className={`self-start transition-transform transform cursor-pointer ${
                pendingDropdownOpen ? "rotate-180" : ""
              }`}
              src={dropdown}
              alt="dropdown"
              width={13}
              onClick={() => setPendingDropdownOpen(!pendingDropdownOpen)}
            />
          </div>
          <p className="ml-4 font-sans text-sm">
            {packages.pendiente.length === 0
              ? "No tenés historial de repartos"
              : `Tenés ${packages.pendiente.length} paquetes pendientes`}
          </p>
          {pendingDropdownOpen && (
            <div className="divide-y">
              {packages.pendiente.map((paquete: Package) => {
                return (
                  <div
                    className="flex justify-between py-4 h-110px w-full cursor-pointer"
                    key={paquete.id}
                  >
                    <Image
                      className="bg-[#E8EFFA] border-sm rounded-sm"
                      src={paquete.image === "imagen" ? paquete.image : imagen}
                      alt="imagen paquete"
                      width={80}
                      height={80}
                    />
                    <div className="">
                      <div className="flex flex-col justify-between h-full">
                        <p className="font-sans text-sm self-end">
                          {`${paquete.street} ${paquete.number} ${paquete.city}`}
                        </p>

                        <p className="font-sans text-sm self-end">
                          {paquete.clientname}
                        </p>
                        <p className="font-sans text-sm font-bold self-end">
                          {paquete.status}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <div className="shadow-lg rounded-md w-full my-4 flex flex-col justify-center p-4">
          <div className="flex justify-between mx-4">
            <p className="font-bold text-lg font-sans">Historial de Repartos</p>
            <Image
              className={`self-start transition-transform transform cursor-pointer${
                delliveredDropdownOpen ? "rotate-180" : ""
              }`}
              src={dropdown}
              alt="dropdown"
              width={13}
              onClick={() => setDeliveredDropdownOpen(!delliveredDropdownOpen)}
            />
          </div>
          <p className="ml-4 font-sans text-sm">
            {packages.entregado.length === 0
              ? "No tenés historial de repartos"
              : `Ya repartiste ${packages.entregado.length} paquetes`}
          </p>
          {delliveredDropdownOpen && (
            <div className="divide-y">
              {packages.entregado.map((paquete: Package) => {
                return (
                  <div
                    className="flex justify-between py-4 h-110px w-full cursor-pointer"
                    key={paquete.id}
                  >
                    <Image
                      className="bg-[#E8EFFA] border-sm rounded-sm"
                      src={paquete.image === "imagen" ? paquete.image : imagen}
                      alt="imagen paquete"
                      width={80}
                      height={80}
                    />
                    <div className="">
                      <div className="flex flex-col justify-between h-full">
                        <div className="flex justify-between">
                          <p className="font-sans text-sm mr-8">
                            {`${paquete.street} ${paquete.number} ${paquete.city}`}
                          </p>
                          <Image
                            className="h-5"
                            src={trash}
                            alt="trash"
                            width={16}
                            height={16}
                            onClick={handleDelete(paquete.id)}
                          />
                        </div>
                        <p className="font-sans text-sm self-end">
                          {paquete.clientname}
                        </p>
                        <p className="font-sans text-sm font-bold self-end">
                          {paquete.status}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
