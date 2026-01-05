import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

const languages = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'am', name: 'Amharic', nativeName: 'አማርኛ' },
    { code: 'or', name: 'Oromo', nativeName: 'Afaan Oromoo' },
];

export const LanguageSwitcher = () => {
    const { i18n, t } = useTranslation();

    const changeLanguage = (languageCode: string) => {
        i18n.changeLanguage(languageCode);
    };

    // Use resolvedLanguage to handle cases like 'en-US' -> 'en'
    const currentLangCode = i18n.resolvedLanguage || i18n.language;
    const currentLanguage = languages.find(lang => lang.code === currentLangCode) ||
        languages.find(lang => currentLangCode?.startsWith(lang.code)) ||
        languages[0];

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 font-semibold border-2 hover:bg-primary hover:text-white hover:border-primary transition-all duration-300"
                >
                    <Globe className="h-4 w-4" />
                    <span className="hidden sm:inline">{currentLanguage.nativeName}</span>
                    <span className="sm:hidden">{currentLanguage.code.toUpperCase()}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
                {languages.map((language) => (
                    <DropdownMenuItem
                        key={language.code}
                        onClick={() => changeLanguage(language.code)}
                        className={`cursor-pointer font-medium ${currentLangCode === language.code
                                ? 'bg-primary text-white'
                                : 'hover:bg-slate-100'
                            }`}
                    >
                        <div className="flex flex-col">
                            <span className="font-bold">{language.nativeName}</span>
                            <span className="text-xs opacity-70">{language.name}</span>
                        </div>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
