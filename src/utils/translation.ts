import translationsJson from "/translations.json";

export type Language = "sv" | "en";

export type TranslationKeys = keyof (typeof translationsJson)["en"];

export interface Translations {
  [key: string]: Record<TranslationKeys, string>;
}

const translations: Translations = translationsJson;

export default translations;
