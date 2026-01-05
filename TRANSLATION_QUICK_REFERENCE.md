# Quick Reference: Adding Translations to Pages

## 1. Import the Hook
```typescript
import { useTranslation } from 'react-i18next';
```

## 2. Use in Component
```typescript
const MyPage = () => {
  const { t } = useTranslation();
  
  return <h1>{t('myPage.title')}</h1>;
};
```

## 3. Add Translation Keys

### English (`src/lib/i18n/locales/en.json`)
```json
{
  "myPage": {
    "title": "My Page Title",
    "subtitle": "My page description",
    "button": "Click Me"
  }
}
```

### Amharic (`src/lib/i18n/locales/am.json`)
```json
{
  "myPage": {
    "title": "የእኔ ገጽ ርዕስ",
    "subtitle": "የእኔ ገጽ መግለጫ",
    "button": "ጠቅ ያድርጉ"
  }
}
```

### Oromo (`src/lib/i18n/locales/or.json`)
```json
{
  "myPage": {
    "title": "Mata Duree Fuula Koo",
    "subtitle": "Ibsa fuula koo",
    "button": "Cuqaasi"
  }
}
```

## Common Translation Keys

### Navigation
- `common.home` - Home
- `common.about` - About
- `common.services` - Services
- `common.news` - News
- `common.contact` - Contact

### Actions
- `common.submit` - Submit
- `common.cancel` - Cancel
- `common.save` - Save
- `common.delete` - Delete
- `common.edit` - Edit
- `common.readMore` - Read More
- `common.viewAll` - View All

### States
- `common.loading` - Loading...
- `common.noResults` - No results found

## Examples

### Simple Text
```typescript
<h1>{t('gallery.title')}</h1>
```

### With Variables
```typescript
{t('welcome', { name: userName })}
// Translation: "Welcome, {{name}}!"
```

### With Count (Pluralization)
```typescript
{t('items', { count: itemCount })}
// Translation: "{{count}} item" / "{{count}} items"
```

### Conditional Text
```typescript
{isLoading ? t('common.loading') : t('common.submit')}
```

## Page Structure Template

```typescript
import { useTranslation } from 'react-i18next';

const MyPage = () => {
  const { t } = useTranslation();
  
  return (
    <div>
      {/* Header */}
      <h1>{t('myPage.title')}</h1>
      <p>{t('myPage.subtitle')}</p>
      
      {/* Content */}
      <div>
        <button>{t('common.submit')}</button>
        <button>{t('common.cancel')}</button>
      </div>
      
      {/* Empty State */}
      {items.length === 0 && (
        <p>{t('myPage.noItems')}</p>
      )}
    </div>
  );
};

export default MyPage;
```

## Testing Checklist
- [ ] All hardcoded text replaced with `t()` calls
- [ ] Translation keys added to all 3 language files (en, am, or)
- [ ] Keys follow naming convention (camelCase, grouped)
- [ ] Tested language switching in browser
- [ ] No console errors
- [ ] Text displays correctly in all languages
