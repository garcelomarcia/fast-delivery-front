"use client";
import axios from "axios";
import React, { FormEvent } from "react";
import { useAppDispatch } from "../../redux/hooks";
import { setUser } from "redux/features/users";
import Image from "next/image";
import logo from "../Assets/logo.png";
import { Button } from "app/Components";
import useInput from "../hooks/useInput";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { setToken } from "redux/features/token";

export default function Login() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const email = useInput();
  const password = useInput();

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    axios
      .post(`https://fastdeliveryserver.xyz/api/user/login`, {
        email: email.value,
        password: password.value
      })
      .then((response) => {
        const token = response.data.token;
        dispatch(setToken(token));
        dispatch(setUser(response.data.user));
        if (response.data.user.isAdmin) {
          const now = new Date();
          const item = {
            value: token,

            expiry: now.getTime() + 60 * 1000,
            user: response.data.user.id // Convierte a milisegundos
          };
          dispatch(setToken(token));

          localStorage.setItem("session", JSON.stringify(item));
          return router.push("manageorders");
        } else {
          return router.push(
            `/affidavit?id=${response.data.user.id}?token=${token}`
          );
        }
      })
      .catch(() => {
        Swal.fire({
          title: "Error",
          text: `Datos incorrectos`,
          icon: "error",
          confirmButtonColor: "#217BCE"
        });
      });
  };

  return (
    <div className="flex flex-col justify-center m-auto items-center">
      <div className="mt-8">
        <Image src={logo} alt="logo" />
      </div>
      <form
        onSubmit={handleSubmit}
        className="w-90 mx-auto flex flex-col justify-start mt-8 items-center"
      >
        <div className="py-2 w-90 mx-auto">
          <h1 className="text-md text-yellow-400">Username</h1>
          <input
            type="text"
            id="username"
            className="border-b-2 border-blue-500 focus:outline-none w-full"
            placeholder="user@email.com"
            {...email}
            required
            autoCapitalize="none"
          />
        </div>
        <div className="py-2 w-90 mx-auto">
          <h1 className="text-md text-yellow-400">Contraseña</h1>
          <input
            type="password"
            id="password"
            className="border-b-2 border-blue-500 focus:outline-none w-full"
            placeholder="Contraseña"
            {...password}
            required
          />
        </div>

        <Button buttonText="INGRESAR" />
        <Link href="recuperar">
          <button className="text-[#217BCE] my-2 font-sans" type="button">
            Recuperar Contraseña
          </button>
        </Link>
        <Link href="register">
          <button
            className="text-[#217BCE] my-2 font-sans font-bold"
            type="button"
          >
            Registrarse
          </button>
        </Link>
      </form>
    </div>
  );
}
