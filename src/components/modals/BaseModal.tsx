import {
    useScrollFieldIntoView,
    useTheme,
    useVisualViewportOverlay,
} from '@/hooks';
import React from 'react';
import ReactModal from 'react-modal';
import { X } from '../icons';

interface BaseModalProps {
    children: React.ReactNode;
    isOpen: boolean;
    onRequestClose: () => void;
}

export function BaseModal({
    children,
    isOpen,
    onRequestClose,
}: BaseModalProps) {
    const { theme } = useTheme();
    const overlayRef = useVisualViewportOverlay(isOpen);
    const contentRef = useScrollFieldIntoView(isOpen);

    return (
        <ReactModal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            data={{ theme }}
            htmlOpenClassName="ReactModal__Html--open"
            preventScroll
            overlayRef={overlayRef}
            contentRef={contentRef}
            overlayClassName={
                theme +
                ' fixed z-50 top-0 left-0 w-full h-full flex items-stretch justify-center bg-[rgba(255,255,255,0.75)] sm:items-center sm:p-4'
            }
            className={
                theme +
                ' w-full max-h-full overflow-y-auto overscroll-contain outline-none bg-white-100 dark:bg-black-900 text-black-900 dark:text-white-100 rounded-none border-0 p-6 sm:h-fit sm:max-w-[400px] sm:p-8 sm:rounded-xl sm:border sm:border-solid sm:border-gray-300 sm:dark:border-gray-700'
            }
        >
            <div className="flex sm:hidden w-full justify-end">
                <button
                    type="button"
                    aria-label="Close"
                    onClick={onRequestClose}
                    className="-m-2 p-2"
                >
                    <X />
                </button>
            </div>

            <div className="flex flex-col gap-4 w-full justify-center items-center">
                {children}
            </div>
        </ReactModal>
    );
}
