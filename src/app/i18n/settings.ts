export const fallbackLng = "pt";
export const languages = [fallbackLng, "en", "de"] as const;
export const defaultNS = "translation";

export type TLanguages = typeof languages[number];

export function getOptions(lng = fallbackLng, ns = defaultNS) {
  return {
    supportedLngs: languages,
    fallbackLng,
    lng,
    fallbackNS: defaultNS,
    defaultNS,
    ns,
  };
}
