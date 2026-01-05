# Multi-Language Support Documentation

## Overview
This project now includes comprehensive multi-language support using **i18next** and **react-i18next**. The system supports three languages:
- **English (en)** - Default language
- **Amharic (am)** - አማርኛ
- **Oromo (or)** - Afaan Oromoo

## Features
✅ Automatic language detection based on browser settings  
✅ Language preference stored in localStorage  
✅ Dynamic language switching without page reload  
✅ Comprehensive translations for all public pages  
✅ Beautiful language switcher component in header  
✅ Mobile-responsive language selection  

## Installation
The following packages have been installed:
```bash
npm install i18next react-i18next i18next-browser-languagedetector
```

## Project Structure
```
src/
├── lib/
│   └── i18n/
│       ├── config.ts              # i18n configuration
│       └── locales/
│           ├── en.json            # English translations
│           ├── am.json            # Amharic translations
│           └── or.json            # Oromo translations
├── components/
│   └── LanguageSwitcher.tsx       # Language selector component
└── App.tsx                        # i18n initialization
```

## Configuration

### i18n Setup (`src/lib/i18n/config.ts`)
The configuration file sets up:
- Language detection (localStorage → browser language)
- Fallback language (English)
- Supported languages
- Translation resources

### Translation Files
Translation files are organized by namespace and key:
```json
{
  "common": {
    "home": "Home",
    "about": "About",
    ...
  },
  "gallery": {
    "title": "Media Gallery",
    "subtitle": "Explore our visual archives...",
    ...
  }
}
```

## Usage

### In Components
```typescript
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('gallery.title')}</h1>
      <p>{t('gallery.subtitle')}</p>
    </div>
  );
}
```

### Language Switcher
The `LanguageSwitcher` component is already integrated into:
- Desktop header (top-right)
- Mobile menu (bottom section)

```typescript
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

<LanguageSwitcher />
```

### Programmatic Language Change
```typescript
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { i18n } = useTranslation();
  
  const changeToAmharic = () => {
    i18n.changeLanguage('am');
  };
  
  return <button onClick={changeToAmharic}>አማርኛ</button>;
}
```

## Translation Keys

### Common Keys
- `common.home`, `common.about`, `common.services`, etc.
- `common.readMore`, `common.viewAll`, `common.loading`
- `common.submit`, `common.cancel`, `common.save`, `common.delete`

### Page-Specific Keys
Each page has its own namespace:
- `home.*` - Home page
- `about.*` - About page
- `services.*` - Services page
- `news.*` - News page
- `gallery.*` - Gallery page
- `documents.*` - Documents page
- `tenders.*` - Tenders page
- `reports.*` - Reports page
- `leadership.*` - Leadership page
- `departments.*` - Departments page
- `engagement.*` - Engagement page
- `faqs.*` - FAQs page
- `contact.*` - Contact page
- `footer.*` - Footer section

## Adding New Translations

### Step 1: Add to English (`en.json`)
```json
{
  "mySection": {
    "title": "My Title",
    "description": "My Description"
  }
}
```

### Step 2: Add to Amharic (`am.json`)
```json
{
  "mySection": {
    "title": "የእኔ ርዕስ",
    "description": "የእኔ መግለጫ"
  }
}
```

### Step 3: Add to Oromo (`or.json`)
```json
{
  "mySection": {
    "title": "Mata Duree Koo",
    "description": "Ibsa Koo"
  }
}
```

### Step 4: Use in Component
```typescript
const { t } = useTranslation();
<h1>{t('mySection.title')}</h1>
```

## Updating Existing Pages

To add translations to an existing page:

1. **Import the hook:**
```typescript
import { useTranslation } from 'react-i18next';
```

2. **Use the hook in your component:**
```typescript
const { t } = useTranslation();
```

3. **Replace hardcoded text:**
```typescript
// Before
<h1>Welcome</h1>

// After
<h1>{t('home.welcome')}</h1>
```

## Example: Gallery Page
The Gallery page has been fully translated. See `src/pages/Gallery.tsx` for reference:

```typescript
import { useTranslation } from 'react-i18next';

const Gallery = () => {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('gallery.title')}</h1>
      <p>{t('gallery.subtitle')}</p>
      <TabsTrigger>{t('gallery.allMedia')}</TabsTrigger>
      <TabsTrigger>{t('gallery.photos')}</TabsTrigger>
      <TabsTrigger>{t('gallery.videos')}</TabsTrigger>
    </div>
  );
};
```

## Best Practices

### 1. Consistent Key Naming
- Use camelCase for keys: `mySection.myKey`
- Group related translations: `gallery.title`, `gallery.subtitle`
- Use descriptive names: `noResultsFound` instead of `msg1`

### 2. Avoid Hardcoded Text
❌ Bad:
```typescript
<button>Submit</button>
```

✅ Good:
```typescript
<button>{t('common.submit')}</button>
```

### 3. Handle Plurals
```json
{
  "items": "{{count}} item",
  "items_plural": "{{count}} items"
}
```

```typescript
{t('items', { count: 5 })} // "5 items"
```

### 4. Handle Variables
```json
{
  "welcome": "Welcome, {{name}}!"
}
```

```typescript
{t('welcome', { name: 'John' })} // "Welcome, John!"
```

## Testing

### Test Language Switching
1. Open the application
2. Click the language switcher in the header
3. Select a different language
4. Verify all text changes accordingly
5. Refresh the page - language should persist

### Test Missing Keys
If a translation key is missing, i18next will display the key itself:
```
gallery.missingKey → displays as "gallery.missingKey"
```

## Troubleshooting

### Language not changing
- Check browser console for errors
- Verify translation keys exist in all language files
- Clear localStorage: `localStorage.clear()`

### Translations not loading
- Ensure `import './lib/i18n/config'` is in `App.tsx`
- Check JSON syntax in translation files
- Verify file paths in `config.ts`

### Missing translations
- Add the key to all three language files (en, am, or)
- Use the same key structure in all files
- Restart the dev server

## Future Enhancements

### Adding More Languages
1. Create new translation file: `src/lib/i18n/locales/xx.json`
2. Import in `config.ts`:
```typescript
import xxTranslations from './locales/xx.json';
```
3. Add to resources:
```typescript
xx: { translation: xxTranslations }
```
4. Add to supported languages:
```typescript
supportedLngs: ['en', 'am', 'or', 'xx']
```
5. Update LanguageSwitcher component

### RTL Support
For right-to-left languages (Arabic, Hebrew):
```typescript
document.dir = i18n.dir(); // 'rtl' or 'ltr'
```

## Resources
- [i18next Documentation](https://www.i18next.com/)
- [react-i18next Documentation](https://react.i18next.com/)
- [Language Codes (ISO 639-1)](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes)

## Support
For questions or issues with the language system, please contact the development team.
