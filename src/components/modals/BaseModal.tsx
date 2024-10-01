import { useTheme } from '@/hooks';
import React from 'react';
import ReactModal from 'react-modal';

export function BaseModal({ children, isOpen, onRequestClose }: any) {
    const { theme } = useTheme();
    return (
        <ReactModal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            data-theme={theme}
            className={
                theme +
                ' absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] bg-white-100 dark:bg-black-900 text-black-900 dark:text-white-100 border border-solid border-gray-300 dark:border-gray-700 rounded-xl p-8 w-[400px] max-w-3xl h-fit max-h-[90vh]'
            }
        >
            <div className="flex flex-col gap-4 w-full justify-center items-center">
                {children}
            </div>
        </ReactModal>
    );
}
