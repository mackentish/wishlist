'use client';

import { Button, FadeIn, InputError, secondaryBtnClass } from '@/components';
import { useLists } from '@/hooks';
import { inputStyles } from '@/styles/globalTailwind';
import { Pages } from '@/types';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

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
    const [isSubmitting, setIsSubmitting] = useState(false);

    const onSubmit: SubmitHandler<Inputs> = (data) => {
        setIsSubmitting(true);
        createList.mutate(data, {
            onSuccess: () => {
                setIsSubmitting(false);
                router.back();
            },
            onError: (error) => {
                setIsSubmitting(false);
                console.error('err', error);
            },
        });
    };

    return (
        <FadeIn className="h-full pt-20 flex flex-col gap-8 items-center align-top w-full max-w-3xl">
            <h1 className="font-bold text-3xl text-black dark:text-white">
                Create a New List!
            </h1>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-4 w-full h-full pb-4"
            >
                {/* Name Input */}
                <span>
                    <input
                        placeholder="List Name"
                        className={
                            !!errors.name
                                ? inputStyles.error
                                : inputStyles.default
                        }
                        {...register('name', { required: true })}
                    />
                    {errors.name && (
                        <InputError message="A list must have a name" />
                    )}
                </span>

                {/* Description Input */}
                <input
                    placeholder="List Description?"
                    className={inputStyles.default}
                    {...register('description', { required: false })}
                />
                {/* Buttons */}
                <div className="flex flex-row gap-4 w-full">
                    <Button
                        disabled={isSubmitting}
                        onClick={() => handleSubmit(onSubmit)}
                    >
                        {isSubmitting ? 'Creating...' : 'Create'}
                    </Button>
                    <Link href={Pages.Home} className={secondaryBtnClass}>
                        Cancel
                    </Link>
                </div>
            </form>
        </FadeIn>
    );
}
