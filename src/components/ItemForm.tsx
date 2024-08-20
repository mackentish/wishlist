import { inputStyles } from '@/styles/globalTailwind';
import React, { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Button, InputError, Typography } from '.';

interface ItemFormProps {
    onDone: (data: {
        name: string;
        link: string | null;
        note: string | null;
    }) => void;
    onCancel: () => void;
    errorMessage?: string;
    defaults?: { name: string; link: string | null; note: string | null };
    doneText?: string;
    isLoading: boolean;
}

type Inputs = {
    name: string;
    link: string | null;
    note: string | null;
};

export function ItemForm({
    onDone,
    onCancel,
    errorMessage = undefined,
    defaults = undefined,
    doneText = 'Done',
    isLoading,
}: ItemFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Inputs>();
    const [itemNote, setItemNote] = useState<string | null>(null);

    const onSubmit: SubmitHandler<Inputs> = (data) => {
        onDone(data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
            <div className="flex flex-row gap-4">
                {/* Name Input */}
                <span className="w-full">
                    <input
                        defaultValue={defaults?.name}
                        placeholder="Item Name"
                        className={
                            !!errors.name
                                ? inputStyles.error
                                : inputStyles.default
                        }
                        {...register('name', { required: true })}
                    />
                    {errors.name && (
                        <InputError message="An item must have a name" />
                    )}
                </span>

                {/* Link Input */}
                <span className="w-full">
                    <input
                        defaultValue={defaults?.link ?? undefined}
                        placeholder="Item Link?"
                        className={inputStyles.default}
                        type="url"
                        {...register('link', { required: false })}
                    />
                </span>
            </div>
            {/* Note Input */}
            <div className="flex flex-col md:flex-row md:items-center md:gap-2">
                <input
                    defaultValue={defaults?.note ?? undefined}
                    placeholder="Item Note?"
                    className={inputStyles.default}
                    {...register('note', {
                        required: false,
                        onChange: (e) => {
                            if (e.target.value.length <= 100) {
                                setItemNote(e.target.value);
                            }
                        },
                    })}
                />
                <Typography
                    type="p"
                    classOverride={`text-xs ${(itemNote?.length || 0) >= 100 ? 'text-error' : ''}`}
                >
                    {itemNote?.length || 0}/100
                </Typography>
            </div>

            {/* Error Message */}
            {errorMessage && <InputError message={errorMessage} />}

            {/* Buttons */}
            <div className="flex flex-row gap-4 w-full">
                <Button
                    disabled={isLoading}
                    onClick={() => handleSubmit(onSubmit)}
                >
                    {doneText}
                </Button>
                <Button onClick={onCancel} btnType="secondary">
                    Cancel
                </Button>
            </div>
        </form>
    );
}
