import es from './dictionaries/es.js';
import hi from './dictionaries/hi.js';
import ko from './dictionaries/ko.js';
import zhCN from './dictionaries/zh-CN.js';

// Built-in translations for kiosk text: interface copy, drink names and descriptions,
// ingredients, and store info. They are instant, free and work offline. Anything not listed
// here (new menu items, chat replies) falls back to the translation API when it is configured.
// To add a string, add the same English key to every file in ./dictionaries; the dictionary
// test fails if a language is missing one.
export const UI_DICTIONARY = { es, 'zh-CN': zhCN, ko, hi };
