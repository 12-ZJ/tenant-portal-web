"use client";

import { useState } from "react";
import { GoEye, GoEyeClosed } from 'react-icons/go';
import { useRouter, useSearchParams } from "next/navigation";
import { UserInfo } from "@/app/lib/types";
import { extractErrorMessage, toastError } from "@/app/lib/utils";
import { useLoadingStore, useUserStore } from "@/app/store";
import { FiLogIn } from "react-icons/fi";
import { login } from "@/app/lib/services/user";
import { jwtDecode } from "jwt-decode";
import ErrorContent from "../common/error-content";
import { ActionButton } from "../common/button";

const blank_error = {
    emailMsg: "",
    passMsg: ""
}

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState(blank_error);
  const [isShowPassword, setIsShowPassword] = useState(false);

  const { setProcessing } = useLoadingStore((state) => state)

  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/";

  const { setUserInfo } = useUserStore((state) => (state));

  const toggleShowPassword = () => {
    setIsShowPassword(!isShowPassword);
  };

  const validateForm = () => {
    const newErrors = { ...blank_error };

    if (!email) {
      newErrors.emailMsg= "Please fill out this field.";
    }

    if (!password) {
        newErrors.passMsg = "Please fill out this field.";
    }

    return newErrors;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validateForm();
    setErrors(newErrors);

    const isValid = Object.values(newErrors).every((v) => !v);
    if (!isValid) {
      setProcessing(false);
      return;
    }

    setProcessing(true);
    try {
      // const token = await login({
      //   email: email,
      //   password: password,
      // });
      // const tokenDecode = jwtDecode<UserInfo>(token);
      // setUserInfo(tokenDecode);
      router.replace(redirectPath);
    } catch (error) {
      toastError(extractErrorMessage(error));
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form className="content-card !rounded-t-none w-[375px]" onSubmit={handleLogin}>
      <div>
        <div className="w-full mb-7 space-y-5">
          <div>
            <label htmlFor="input_email" className="required">E-mail</label>
            <div className="relative mt-1">
              <input
                className={`${errors.emailMsg ? "error" : ""}`}
                id="input_email"
                name="email"
                type="text"
                placeholder=""
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <ErrorContent errorMsg={errors.emailMsg}/>
            </div>
          </div>

          <div>
            <label htmlFor="input_password" className="required">Password</label>
            <div className="relative mt-1">
              <div className={`flex border rounded-[6px] w-full items-center ${errors.passMsg ? "border-theme_red" : "border-theme_border"}`}>
                  <input
                    className="border-none"
                    id="input_password"
                    name="password"
                    type={isShowPassword ? "text" : "password"}
                    placeholder=""
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={toggleShowPassword}
                    className="flex mr-2 w-6 h-6 items-center justify-center text-theme_orange">
                    {isShowPassword ? (
                      <GoEyeClosed className="w-4 h-4" />
                    ) : (
                      <GoEye className="w-4 h-4" />
                    )}
                  </button>
              </div>
              <ErrorContent errorMsg={errors.passMsg}/>
            </div>
          </div>
        </div>
        <ActionButton
          type="submit" 
          className="primary-button h-11 w-full flex justify-center items-center" 
          label="Login"
          icon={<FiLogIn />}
        />
      </div>
    </form>
  );
}