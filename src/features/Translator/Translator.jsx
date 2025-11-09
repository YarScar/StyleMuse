import { useEffect, useState } from 'react'
import { translateText } from '../../lib/translate.js'
import { useI18n } from '../../context/I18nContext.jsx'
import './translator.css'

export default function Translator(){
  const { t } = useI18n()
  const [from, setFrom] = useState('en')
  const [to, setTo] = useState('es')
  const [q, setQ] = useState('Write me a Y2K-inspired fashion prompt')
  const [out, setOut] = useState('')
  const LANGS = [
    { code:'en', name:'English' },
    { code:'es', name:'Español' },
    { code:'ar', name:'العربية' },
    { code:'fr', name:'Français' },
  ]

  async function onTranslate(){
    const r = await translateText(q, from, to)
    setOut(r)
  }

  useEffect(()=>{ setOut('') },[from, to])

  return (
    <div className="translator-page">
      <h2>{t('Translate Text')}</h2>
      <div className="row">
        <label>{t('From')}
          <select value={from} onChange={e=> setFrom(e.target.value)}>
            {LANGS.map(l => <option key={l.code} value={l.code}>{l.name}</option>)}
          </select>
        </label>
        <label>{t('To')}
          <select value={to} onChange={e=> setTo(e.target.value)}>
            {LANGS.map(l => <option key={l.code} value={l.code}>{l.name}</option>)}
          </select>
        </label>
      </div>
      <textarea rows={4} value={q} onChange={e=> setQ(e.target.value)} />
      <button onClick={onTranslate}>{t('Translate Now')}</button>
      {out && <pre className="out">{out}</pre>}
    </div>
  )
}
