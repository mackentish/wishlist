"use client";

import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Input, Button, InputError, secondaryBtnClass } from "@/components";
import { Pages } from "@/types";
import Link from "next/link";
import { useLists } from "@/hooks";

type Inputs = {
  name: string;
  description?: string;
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
    /*
    await createList.mutate(data, {
      onSuccess: () => {
        router.push(Pages.Home);
      },
    });
    */
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
          <Input
            placeholder="List Name"
            isError={!!errors.name}
            {...register("name", { required: true })}
          />
          {errors.name && <InputError message="A list must have a name" />}
        </span>

        {/* Note Input */}
        <Input
          placeholder="List Description?"
          {...register("description", { required: false })}
        />
        {/* Buttons */}
        <div className="flex flex-row gap-4 w-full">
          <Button onClick={() => handleSubmit(onSubmit)}>
            <p className="font-mono">Done</p>
          </Button>
          <Link href={Pages.Home} className={secondaryBtnClass}>
            <p className="font-mono">Cancel</p>
          </Link>
        </div>
      </form>
    </div>
  );
}
