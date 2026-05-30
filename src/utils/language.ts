import type { Language } from '../components/LanguageSwitcher'

export const LANG_KEY = 'dfb-language'

export function getStoredLanguage(): Language {
  return localStorage.getItem(LANG_KEY) === 'FR' ? 'FR' : 'DE'
}

export function persistLanguage(language: Language) {
  localStorage.setItem(LANG_KEY, language)
}

export function textForLanguage(
  language: Language,
  deValue?: string | null,
  frValue?: string | null,
): string {
  const de = deValue?.trim() ?? ''
  const fr = frValue?.trim() ?? ''

  if (language === 'FR' && fr) {
    return fr
  }

  return de
}
