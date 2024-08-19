import React from 'react';

export function Moon({ isActive }: { isActive: boolean }) {
    return (
        <svg
            viewBox="0 0 24 24"
            className="fill-none w-6 h-6"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M9.5 2C10.8833 2 12.1833 2.2625 13.4 2.7875C14.6167 3.3125 15.675 4.025 16.575 4.925C17.475 5.825 18.1875 6.88333 18.7125 8.1C19.2375 9.31667 19.5 10.6167 19.5 12C19.5 13.3833 19.2375 14.6833 18.7125 15.9C18.1875 17.1167 17.475 18.175 16.575 19.075C15.675 19.975 14.6167 20.6875 13.4 21.2125C12.1833 21.7375 10.8833 22 9.5 22C8.61667 22 7.75417 21.8875 6.9125 21.6625C6.07083 21.4375 5.26667 21.1 4.5 20.65C6.05 19.75 7.27083 18.5333 8.1625 17C9.05417 15.4667 9.5 13.8 9.5 12C9.5 10.2 9.05417 8.53333 8.1625 7C7.27083 5.46667 6.05 4.25 4.5 3.35C5.26667 2.9 6.07083 2.5625 6.9125 2.3375C7.75417 2.1125 8.61667 2 9.5 2Z"
                className={
                    isActive ? 'fill-primary' : 'fill-black dark:fill-white'
                }
            />
        </svg>
    );
}
