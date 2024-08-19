import colorThemes from '@/styles/colorThemes';
import React, {
    ReactNode,
    createContext,
    useContext,
    useEffect,
    useState,
} from 'react';

interface ThemeContextType {
    theme: keyof typeof colorThemes;
    setTheme: (theme: keyof typeof colorThemes) => void;
    isDarkMode: boolean;
    setIsDarkMode: (isDarkMode: boolean) => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(
    undefined
);

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

interface ThemeProviderProps {
    children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
    const [theme, setTheme] = useState<keyof typeof colorThemes>('turquoise');
    const [isDarkMode, setIsDarkMode] = useState(false);

    const handleThemeChange = (theme: keyof typeof colorThemes) => {
        setTheme(theme);
        localStorage.setItem('wishlist_theme', theme);
    };

    const handleModeChange = (isDark: boolean) => {
        setIsDarkMode(isDark);
        localStorage.setItem('wishlist_mode', isDark ? 'dark' : 'light');
    };

    useEffect(() => {
        // set theme based on local storage
        let storedTheme;
        storedTheme = localStorage.getItem(
            'wishlist_theme'
        ) as keyof typeof colorThemes;

        if (storedTheme) {
            handleThemeChange(storedTheme);
        }

        // set isDarkMode based on local storage or system preference
        if (localStorage.getItem('wishlist_mode')) {
            handleModeChange(localStorage.getItem('wishlist_mode') === 'dark');
        } else if (
            typeof window !== 'undefined' && // << do this check to avoid SSR error
            window.matchMedia &&
            window.matchMedia('(prefers-color-scheme: dark)').matches
        ) {
            handleModeChange(true);
        } else {
            handleModeChange(false);
        }
    }, [setTheme, setIsDarkMode]);

    useEffect(() => {
        const htmlElement = document.documentElement;
        if (isDarkMode) {
            htmlElement.classList.add('dark');
            localStorage.setItem('wishlist_mode', 'dark');
        } else {
            htmlElement.classList.remove('dark');
            localStorage.setItem('wishlist_mode', 'light');
        }
    }, [isDarkMode]);

    return (
        <ThemeContext.Provider
            value={{
                theme,
                setTheme: handleThemeChange,
                isDarkMode,
                setIsDarkMode: handleModeChange,
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
}
