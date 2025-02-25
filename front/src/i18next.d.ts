import 'react-i18next';

// Import translations
import en from './locales/en.json';

declare module 'react-i18next' {
    type DefaultResources = typeof en;
    interface Resources extends DefaultResources {}
}