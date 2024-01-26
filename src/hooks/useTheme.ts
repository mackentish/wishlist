import colorThemes from '@/styles/colorThemes';
import { useEffect, useState } from 'react';

export function useTheme() {
    const [theme, setTheme] = useState<keyof typeof colorThemes>('orange');
    useEffect(() => {
        let value;
        value = localStorage.getItem('theme') as keyof typeof colorThemes;
        if (value) {
            setTheme(value);
        }
    }, [setTheme]);

    return { theme, setTheme };
}
