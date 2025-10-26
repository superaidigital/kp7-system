import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { translations, TranslationKeys } from '../translations';

type Language = 'th' | 'en';

interface LanguageContextType {
    language: Language;
    setLanguage: (language: Language) => void;
    t: (key: TranslationKeys) => string;
    formatDate: (dateString: string, type?: 'datetime' | 'date') => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [language, setLanguage] = useState<Language>('th');

    const t = useCallback((key: TranslationKeys): string => {
        const keys = key.split('.');
        let result: any = translations[language];
        for (const k of keys) {
            result = result?.[k];
            if (result === undefined) {
                // Fallback to English if translation is missing
                let fallbackResult: any = translations.en;
                 for (const fk of keys) {
                    fallbackResult = fallbackResult?.[fk];
                 }
                return fallbackResult || key;
            }
        }
        return result || key;
    }, [language]);

    const formatDate = useCallback((dateString: string, type: 'datetime' | 'date' = 'datetime'): string => {
        const date = new Date(dateString);
        const locale = language === 'th' ? 'th-TH' : 'en-CA'; // en-CA for YYYY-MM-DD

        const dateOptions: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        };

        if (type === 'date') {
            return date.toLocaleDateString(locale, dateOptions);
        }

        const timeOptions: Intl.DateTimeFormatOptions = {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
        };
        
        return date.toLocaleString(locale, { ...dateOptions, ...timeOptions });
    }, [language]);

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t, formatDate }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = (): LanguageContextType => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};