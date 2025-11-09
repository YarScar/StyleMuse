import { createContext, useContext, useEffect, useMemo, useState } from 'react'

// Minimal i18n: single-language (en) identity translator
const baseStrings = {
  en: {
    'Try On':'Try On','Generate':'Generate','Gallery':'Gallery','My Closet':'My Closet','Translate':'Translate',
    'Upload Photo':'Upload Photo','Choose Outfit':'Choose Outfit','Export':'Export','Prompt':'Prompt','Generate Image':'Generate Image',
    'Translate Text':'Translate Text','From':'From','To':'To','Translate Now':'Translate Now'
  }
}

const I18nCtx = createContext(null)

export function I18nProvider({ children }){
  const [dict] = useState(baseStrings)

  useEffect(()=>{ document.documentElement.lang = 'en' },[])

  function t(key){
    return dict['en'][key] || key
  }

  const value = useMemo(()=>({ t }),[])
  return <I18nCtx.Provider value={value}>{children}</I18nCtx.Provider>
}

export function useI18n(){
  return useContext(I18nCtx)
}
