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
                    className="gap-2 font-black uppercase tracking-widest text-[10px] border-white/10 glass hover:bg-secondary hover:border-secondary hover:text-background transition-all duration-500 rounded-full px-5 h-10 shadow-lg"
                >
                    <Globe className="h-3 w-3" />
                    <span className="hidden sm:inline">{currentLanguage.nativeName}</span>
                    <span className="sm:hidden">{currentLanguage.code.toUpperCase()}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-background/95 backdrop-blur-xl border-white/10 rounded-2xl p-2 shadow-2xl">
                {languages.map((language) => (
                    <DropdownMenuItem
                        key={language.code}
                        onClick={() => changeLanguage(language.code)}
                        className={`cursor-pointer rounded-xl p-3 mb-1 transition-all duration-300 ${currentLangCode === language.code
                                ? 'bg-secondary text-background font-black shadow-lg shadow-secondary/20'
                                : 'hover:bg-white/5 text-white/70 hover:text-white'
                            }`}
                    >
                        <div className="flex flex-col">
                            <span className="font-black text-sm uppercase tracking-tighter">{language.nativeName}</span>
                            <span className="text-[9px] uppercase tracking-widest opacity-50">{language.name}</span>
                        </div>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
