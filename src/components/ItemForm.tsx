import { inputStyles } from '@/styles/globalTailwind'
import React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { Button, InputError } from '.'

interface ItemFormProps {
    onDone: (data: { name: string; link: string; note: string | null }) => void
    onCancel: () => void
    errorMessage?: string
    defaults?: { name: string; link: string; note: string | null }
    doneText?: string
}

type Inputs = {
    name: string
    link: string
    note: string | null
}

export function ItemForm({
    onDone,
    onCancel,
    errorMessage = undefined,
    defaults = undefined,
    doneText = 'Done',
}: ItemFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Inputs>()

    const onSubmit: SubmitHandler<Inputs> = (data) => {
        onDone(data)
    }

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
                        defaultValue={defaults?.link}
                        placeholder="Item Link"
                        className={
                            !!errors.link
                                ? inputStyles.error
                                : inputStyles.default
                        }
                        type="url"
                        {...register('link', { required: true })}
                    />
                    {errors.link && (
                        <InputError message="An item must have a link" />
                    )}
                </span>
            </div>
            {/* Note Input */}
            <input
                defaultValue={defaults?.note ?? undefined}
                placeholder="Item Note?"
                className={inputStyles.default}
                {...register('note', { required: false })}
            />

            {/* Error Message */}
            {errorMessage && <InputError message={errorMessage} />}

            {/* Buttons */}
            <div className="flex flex-row gap-4 w-full">
                <Button onClick={() => handleSubmit(onSubmit)}>
                    {doneText}
                </Button>
                <Button onClick={onCancel} btnType="secondary">
                    Cancel
                </Button>
            </div>
        </form>
    )
}
