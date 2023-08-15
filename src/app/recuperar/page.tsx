"use client";
import axios from "axios";
import React, { FormEvent } from "react";
import Image from "next/image";
import logo from "../Assets/logo.png";
import { Button } from "app/Components";
import useInput from "../hooks/useInput";
import Swal from "sweetalert2";

const Recuperar = () => {
  const email = useInput();
  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    axios
      .post("https://fastdeliveryserver.xyz/api/user/recover", { email: email.value })
      .then((res) => {
        if (res.status === 200) {
          Swal.fire({
            title: "Aviso",
            text: "Correo de recuperación enviado",
            icon: "info",
            confirmButtonColor: "#217BCE"
          });
        }
      })
      .catch(() => alert(`Error`));
  };
  return (
    <div className="flex flex-col justify-center m-auto items-center">
      <div className="mt-8">
        <Image src={logo} alt="logo" />
      </div>
      <br /> <br />
      <h1 className="text-md">¿Olvidaste tu contraseña?</h1>
      <form
        onSubmit={handleSubmit}
        className="w-90 mx-auto flex flex-col justify-start mt-8 items-center"
      >
        <div className="py-2 w-90 mx-auto">
          <h1 className="text-md text-yellow-400">
            Ingresá tu mail para que podamos enviarte una nueva contraseña
          </h1>
          <input
            type="text"
            id="username"
            className="border-b-2 border-blue-500 focus:outline-none w-full"
            placeholder="user@email.com"
            {...email}
            required
          />
        </div>

        <Button buttonText="RECUPERAR CONTRASEÑA" />
      </form>
    </div>
  );
};

export default Recuperar;
