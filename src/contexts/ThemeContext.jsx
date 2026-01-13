import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const themes = {
    dark: {
        name: 'Dark (Default)',
        bg: '#121212',
        bgLight: '#1a1a1a',
        bgLighter: '#282828',
        primary: '#ff6b1a',
        primaryHover: '#ff8c42',
        text: '#ffffff',
        textMuted: '#b3b3b3',
    },
    light: {
        name: 'Light',
        bg: '#ffffff',
        bgLight: '#f6f6f6',
        bgLighter: '#e5e5e5',
        primary: '#ff6b1a',
        primaryHover: '#ff8c42',
        text: '#000000',
        textMuted: '#6a6a6a',
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
    },
    custom: {
        name: 'Custom',
        bg: '#121212',
        bgLight: '#1a1a1a',
        bgLighter: '#282828',
        primary: '#ff6b1a',
        primaryHover: '#ff8c42',
        text: '#ffffff',
        textMuted: '#b3b3b3',
    },
};

const applyThemeColors = (themeObj) => {
    document.documentElement.style.setProperty('--bg', themeObj.bg);
    document.documentElement.style.setProperty('--bg-light', themeObj.bgLight);
    document.documentElement.style.setProperty('--bg-lighter', themeObj.bgLighter);
    document.documentElement.style.setProperty('--primary', themeObj.primary);
    document.documentElement.style.setProperty('--primary-hover', themeObj.primaryHover);
    document.documentElement.style.setProperty('--text', themeObj.text);
    document.documentElement.style.setProperty('--text-muted', themeObj.textMuted);
    
    // Also update background and text color on body element
    document.body.style.backgroundColor = themeObj.bg;
    document.body.style.color = themeObj.text;
};

export function ThemeProvider({ children }) {
    const [currentTheme, setCurrentTheme] = useState(() => {
        return localStorage.getItem('musicAppTheme') || 'dark';
    });
    
    const [customTheme, setCustomTheme] = useState(() => {
        const saved = localStorage.getItem('musicAppCustomTheme');
        return saved ? JSON.parse(saved) : null;
    });

    useEffect(() => {
        localStorage.setItem('musicAppTheme', currentTheme);
        
        // Get the theme to apply
        const themeToApply = customTheme && currentTheme === 'custom' 
            ? customTheme 
            : themes[currentTheme];
        
        if (themeToApply) {
            applyThemeColors(themeToApply);
        }
    }, [currentTheme, customTheme]);

    const saveCustomTheme = (themeObj) => {
        setCustomTheme(themeObj);
        localStorage.setItem('musicAppCustomTheme', JSON.stringify(themeObj));
        setCurrentTheme('custom');
    };

    const value = {
        currentTheme,
        setCurrentTheme,
        theme: customTheme && currentTheme === 'custom' ? customTheme : themes[currentTheme],
        themes,
        customTheme,
        saveCustomTheme,
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
