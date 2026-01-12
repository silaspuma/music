import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const themes = {
    dark: {
        name: 'Dark (Default)',
        bg: '#121212',
        bgLight: '#1a1a1a',
        bgLighter: '#282828',
        primary: '#1ed760',
        primaryHover: '#1fdf64',
        text: '#ffffff',
        textMuted: '#b3b3b3',
        gradient: 'from-[#1a1a1a] to-[#121212]',
    },
    light: {
        name: 'Light',
        bg: '#ffffff',
        bgLight: '#f6f6f6',
        bgLighter: '#e5e5e5',
        primary: '#1ed760',
        primaryHover: '#1db954',
        text: '#000000',
        textMuted: '#6a6a6a',
        gradient: 'from-gray-50 to-white',
    },
    blue: {
        name: 'Ocean Blue',
        bg: '#0a1929',
        bgLight: '#132f4c',
        bgLighter: '#1e4976',
        primary: '#3ea6ff',
        primaryHover: '#65b7ff',
        text: '#ffffff',
        textMuted: '#b2c9e0',
        gradient: 'from-[#132f4c] to-[#0a1929]',
    },
    purple: {
        name: 'Purple Dream',
        bg: '#1a0b2e',
        bgLight: '#2d1b4e',
        bgLighter: '#3e2a5f',
        primary: '#a855f7',
        primaryHover: '#c084fc',
        text: '#ffffff',
        textMuted: '#c4b5fd',
        gradient: 'from-[#2d1b4e] to-[#1a0b2e]',
    },
    green: {
        name: 'Forest Green',
        bg: '#0d1f17',
        bgLight: '#1a3328',
        bgLighter: '#26473a',
        primary: '#10b981',
        primaryHover: '#34d399',
        text: '#ffffff',
        textMuted: '#bbf7d0',
        gradient: 'from-[#1a3328] to-[#0d1f17]',
    },
};

export function ThemeProvider({ children }) {
    const [currentTheme, setCurrentTheme] = useState(() => {
        return localStorage.getItem('musicAppTheme') || 'dark';
    });

    useEffect(() => {
        localStorage.setItem('musicAppTheme', currentTheme);
        
        // Apply theme colors as CSS variables
        const theme = themes[currentTheme];
        document.documentElement.style.setProperty('--bg', theme.bg);
        document.documentElement.style.setProperty('--bg-light', theme.bgLight);
        document.documentElement.style.setProperty('--bg-lighter', theme.bgLighter);
        document.documentElement.style.setProperty('--primary', theme.primary);
        document.documentElement.style.setProperty('--primary-hover', theme.primaryHover);
        document.documentElement.style.setProperty('--text', theme.text);
        document.documentElement.style.setProperty('--text-muted', theme.textMuted);
    }, [currentTheme]);

    const value = {
        currentTheme,
        setCurrentTheme,
        theme: themes[currentTheme],
        themes,
    };

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
