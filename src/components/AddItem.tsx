import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button, Input, InputError } from ".";

interface AddItemProps {
  onDone: (name: string, link: string, note?: string) => void;
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
    onDone(data.name, data.link, data.note);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
      <div className="flex flex-row gap-4">
        {/* Name Input */}
        <span className="w-full">
          <Input
            placeholder="Name"
            isError={!!errors.name}
            {...register("name", { required: true })}
          />
          {errors.name && <InputError message="An item must have a name" />}
        </span>

        {/* Link Input */}
        <span className="w-full">
          <Input
            placeholder="Link"
            isError={!!errors.link}
            type="url"
            {...register("link", { required: true })}
          />
          {errors.link && <InputError message="An item must have a link" />}
        </span>
      </div>
      {/* Note Input */}
      <Input placeholder="Note?" {...register("note", { required: false })} />
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
