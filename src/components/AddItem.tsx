import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { inputStyles } from "@/styles/globalTailwind";
import { Button, InputError } from ".";

interface AddItemProps {
  onDone: (data: { name: string; link: string; note?: string }) => void;
  onCancel: () => void;
}

type Inputs = {
  name: string;
  link: string;
  note: string;
};

export function AddItem({ onDone, onCancel }: AddItemProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    onDone(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
      <div className="flex flex-row gap-4">
        {/* Name Input */}
        <span className="w-full">
          <input
            placeholder="Item Name"
            className={!!errors.name ? inputStyles.error : inputStyles.default}
            {...register("name", { required: true })}
          />
          {errors.name && <InputError message="An item must have a name" />}
        </span>

        {/* Link Input */}
        <span className="w-full">
          <input
            placeholder="Item Link"
            className={!!errors.link ? inputStyles.error : inputStyles.default}
            type="url"
            {...register("link", { required: true })}
          />
          {errors.link && <InputError message="An item must have a link" />}
        </span>
      </div>
      {/* Note Input */}
      <input
        placeholder="Item Note?"
        className={inputStyles.default}
        {...register("note", { required: false })}
      />

      {/* Buttons */}
      <div className="flex flex-row gap-4 w-full">
        <Button onClick={() => handleSubmit(onSubmit)}>
          <p className="font-mono">Done</p>
        </Button>
        <Button onClick={onCancel} btnType="secondary">
          <p className="font-mono">Cancel</p>
        </Button>
      </div>
    </form>
  );
}
