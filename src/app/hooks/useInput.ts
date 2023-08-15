"use client";
import { ChangeEvent, useState } from "react";
import { InputHook } from "../interfaces/inputHook";

function useInput(): InputHook {
  const [value, setValue] = useState("");
  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [confirmPasswordErrors, setRepeatPasswordErrors] = useState<string[]>(
    []
  );
  const [emailErrors, setEmailErrors] = useState<string[]>([]);
  const [phoneErrors, setPhoneErrors] = useState<string[]>([]);

  const clear = () => {
    setValue("");
  };

  const validatePassword = (): void => {
    const errors: string[] = [];
    if (value.length < 8) {
      errors.push("La contraseña debe tener al menos 8 caracteres.");
    }
    if (!/(?=.*[a-z])/.test(value)) {
      errors.push("La contraseña debe contener al menos una minúscula.");
    }
    if (!/(?=.*[A-Z])/.test(value)) {
      errors.push("La contraseña debe contener al menos una mayúscula.");
    }
    if (!/(?=.*\d)/.test(value)) {
      errors.push("La contraseña debe contener al menos un número.");
    }
    setPasswordErrors(errors);
  };

  const validateConfirmPassword = (password: string): void => {
    password !== value
      ? setRepeatPasswordErrors(["Las contraseñas no coinciden"])
      : setRepeatPasswordErrors([]);
  };

  const validateEmail = (): void => {
    const errors: string[] = [];
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      errors.push("El email ingresado no es valido");
    }
    setEmailErrors(errors);
  };

  const validatePhone = (): void => {
    const errors: string[] = [];
    if (value.length !== 10) {
      errors.push("El número debe ser exactamente 10 dígitos");
    }
    setPhoneErrors(errors);
  };

  return {
    value,
    onChange,
    validatePassword,
    validateConfirmPassword,
    validateEmail,
    validatePhone,
    passwordErrors,
    confirmPasswordErrors,
    emailErrors,
    phoneErrors,
    clear
  };
}

export default useInput;
