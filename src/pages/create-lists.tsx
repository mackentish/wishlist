"use client";

import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Button, InputError, secondaryBtnClass } from "@/components";
import { Pages } from "@/types";
import Link from "next/link";
import { useLists } from "@/hooks";
import { inputStyles } from "@/styles/globalTailwind";

type Inputs = {
  name: string;
  description: string | null;
};

export default function CreateLists() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();
  const { createList } = useLists();
  const router = useRouter();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    await createList.mutate(data, {
      onSuccess: () => {
        console.log("here");
        router.back();
      },
      onError: (error) => {
        console.error("err", error);
      },
    });
  };

  return (
    <div className="h-full pt-20 flex flex-col gap-8 items-center align-top w-full max-w-3xl">
      <h1 className="font-mono font-bold text-3xl">Create a New List!</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 w-full h-full pb-4"
      >
        {/* Name Input */}
        <span>
          <input
            placeholder="List Name"
            className={!!errors.name ? inputStyles.error : inputStyles.default}
            {...register("name", { required: true })}
          />
          {errors.name && <InputError message="A list must have a name" />}
        </span>

        {/* Description Input */}
        <input
          placeholder="List Description?"
          className={inputStyles.default}
          {...register("description", { required: false })}
        />
        {/* Buttons */}
        <div className="flex flex-row gap-4 w-full">
          <Button onClick={() => handleSubmit(onSubmit)}>Done</Button>
          <Link href={Pages.Home} className={secondaryBtnClass}>
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
