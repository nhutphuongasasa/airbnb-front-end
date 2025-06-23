"use client";

import React, { useCallback, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import Modal from "./Modal";
import { Heading } from "../Heading";
import Input from "../inputs/Input";
import toast from "react-hot-toast";
import Button from "../Button";
import { FcGoogle } from "react-icons/fc";
import { AiFillGithub } from "react-icons/ai";
import useLoginModal from "@/hooks/useLoginModal";
import { useRouter } from "next/navigation";
import useRegisterModal from "../../hooks/useRegisterModal";
import { signIn } from "next-auth/react";
import userUserStore from "@/hooks/useUser";
import axios from "axios";

const LoginModal = () => {
  const width = 500;
  const height = 600;

  const left = window.screenX + (window.outerWidth - width) / 2;
  const top = window.screenY + (window.outerHeight - height) / 2.5;



  const router = useRouter()
  const loginModal = useLoginModal();
  const registerModal = useRegisterModal()
  const userStore = userUserStore()
  const [isLoading, setIsLoading] = useState(false);
  //register giup gan cac input,... voi he thong quan li react-hook-form
  //giup truyen cac rule nhu required, maxLength, ...
  //tu dung cap nhat gia tri ma khong can onChange khi nguoi dung nhap vao input
  const { register, handleSubmit, formState: { errors } } = useForm<
    FieldValues
  >({
    defaultValues: {
      email: "",
      password: ""
    }
  });
  // dung FieldValue de thay the cho viec tao Props
  const onSubmit: SubmitHandler<FieldValues> = async(data) => {

    setIsLoading(true);

    try {
      const result = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/login`,{
        email: data.email,
        password: data.password
      })
      console.log(result.data.user)

      userStore.onSet(result.data.user)
      loginModal.onClose()

    } catch (error) {
      console.log(error)
    }
    setIsLoading(false);
  };

  const handleLoginWithGoogle = useCallback( async () => {
    const popup = window.open(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/google`,
      "googleLogin",
      // "width=500,height=600"
      `width=${width},height=${height},left=${left},top=${top}`
    )

    const handleMessage = (event: MessageEvent) => {
      console.log("Got message", event)
      // if(event.origin !== process.env.NEXT_PUBLIC_SERVER_URL) return
      toast.success("handle Message")

      const {user, error} = event.data

      if(error){
        // toast.error(error.message)
        return
      }

      if ( user ) {
        // toast(user.id)
        router.refresh();
        loginModal.onClose();
        userStore.onSet(user)
      }
      localStorage.setItem('user', JSON.stringify(user))
    }

    window.addEventListener('message',handleMessage)

    const checkPopupClosed = setInterval(() => {
      if(popup?.closed){
        clearInterval(checkPopupClosed)
        window.removeEventListener('message', handleMessage)
        setIsLoading(false)
        // loginModal.onClose()
      }
    },500)

    return () => {
      window.removeEventListener("message", handleMessage);
      clearInterval(checkPopupClosed);
    };
  },[router, loginModal])

  const toggle = useCallback(() => {
    loginModal.onClose()
    registerModal.onOpen()
  },[loginModal, registerModal])

  const bodyContent = (
    <div className="flex flex-col gap-2">
      <Heading title="Welcome to Airbnb" subtitle="Login to Account" />
      <Input
        id="email"
        label="email"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <Input
        type="password"
        id="password"
        label="Password"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
    </div>
  );

  const footerContent = (
    <div className="flex flex-col gap-4 mt-3">
      <hr />
      <Button
        outline
        label="Continue with Google"
        icon={FcGoogle}
        onClick={() => {
          handleLoginWithGoogle()
          //chuyen snag landing page
        }}
        
      />
      <Button
        outline
        label="Continue with Github"
        icon={AiFillGithub}
        onClick={() => window.location.href  = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/github`}
        // onClick={() => signIn('github')}
      />
      <div className="gap-2 flex justify-center text-neutral-500 text-center mt-2 font-light">
        <div>First time using Airbnb? </div>
        <div
          onClick={toggle}
          className="text-neutral-800 cursor-pointer hover:underline"
        >
          Create an account
        </div>
      </div>
    </div>
  );

  return (
    <Modal
      disabled={isLoading}
      isOpen={loginModal.isOpen}
      title="Login"
      actionLabel="Continue"
      onClose={loginModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
      footer={footerContent}
    />
  );
};

export default LoginModal;
