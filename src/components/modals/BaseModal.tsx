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
                ' absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] bg-white dark:bg-black text-black dark:text-white border border-solid border-gray300 dark:border-gray700 rounded-xl p-8 min-w-80 min-h-80 max-w-3xl'
            }
        >
            <div className="flex flex-col gap-4 w-full justify-center items-center">
                {children}
            </div>
        </ReactModal>
    );
}
