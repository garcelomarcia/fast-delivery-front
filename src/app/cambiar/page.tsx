"use client";
import axios from "axios";
import React, { FormEvent } from "react";
import { Navbar, Button } from "app/Components";
import Image from "next/image";
import logo from "../Assets/logo.png";
import useInput from "../hooks/useInput";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

export default function Cambiar() {
  const router = useRouter();
  const password = useInput();
  const confirmPassword = useInput();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    password.validatePassword();
    confirmPassword.validateConfirmPassword(password.value);

    if (password.value === confirmPassword.value) {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get("token");
      const result = await axios.get(`https://fastdeliveryserver.xyz/api/user/me`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const user = result.data;

      const response = await axios.put(
        `https://fastdeliveryserver.xyz/api/user/edit/${user.id}`,
        { ...user, password: password.value },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.editedUser) {
        Swal.fire({
          title: "Éxito",
          text: "Contraseña Reestablecida",
          icon: "success",
          confirmButtonColor: "#217BCE",
          confirmButtonText: "Continuar"
        });
        user.isAdmin ? router.push("manageorders") : router.push(`/login`);
      }
    } else {
      return Swal.fire({
        title: "Error",
        text: "Las contraseñas no coinciden",
        icon: "error",
        confirmButtonColor: "#217BCE"
      });
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col justify-center m-auto items-center">
        <div className="mt-8">
          <Image src={logo} alt="logo" />
        </div>
        <br /> <br />
        <form
          onSubmit={handleSubmit}
          className="w-90 mx-auto flex flex-col justify-start mt-8 items-center"
        >
          <div className="py-2 w-90 mx-auto">
            <h1 className="text-md text-yellow-400">Nueva Contraseña</h1>
            <input
              type="password"
              id="password"
              className="border-b-2 border-blue-500 focus:outline-none w-full"
              placeholder="Contraseña"
              {...password}
              required
            />
            {password.passwordErrors ? (
              <span className="text-red-500 text-sm">
                {password.passwordErrors[0]}
              </span>
            ) : (
              ""
            )}
          </div>
          <div className="py-2 w-90 mx-auto">
            <h1 className="text-md text-yellow-400">Confirmar Contraseña</h1>
            <input
              type="password"
              id="confirmPassword"
              className="border-b-2 border-blue-500 focus:outline-none w-full"
              placeholder="Confirmar Contraseña"
              {...confirmPassword}
              required
            />
            {confirmPassword.confirmPasswordErrors ? (
              <span className="text-red-500 text-sm">
                {confirmPassword.confirmPasswordErrors[0]}
              </span>
            ) : (
              ""
            )}
          </div>

          <Button buttonText="CAMBIAR CONTRASEÑA" />
        </form>
      </div>
    </>
  );
}
