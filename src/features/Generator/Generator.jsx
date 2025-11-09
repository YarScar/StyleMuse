import { useState } from 'react'
import { generateImage } from '../../lib/hf.js'
import { useI18n } from '../../context/I18nContext.jsx'
import './generator.css'

export default function Generator(){
  const { t } = useI18n()
  const [prompt, setPrompt] = useState('A Y2K cyber fashion outfit, iridescent fabrics, pastel neon backdrop')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  async function onGenerate(){
    setLoading(true); setError(null)
    const r = await generateImage({ prompt })
    if(r.error) setError(r.error)
    setResult(r.imageUrl || null)
    setLoading(false)
  }

  return (
    <div className="gen-page">
      <h2>{t('Generate')}</h2>
      <textarea value={prompt} onChange={e=> setPrompt(e.target.value)} rows={3} />
      <button disabled={loading} onClick={onGenerate}>{loading ? '...' : t('Generate Image')}</button>
      {error && <p className="error">{error}</p>}
      {result && <img src={result} alt="generated" className="gen-img" />}
    </div>
  )
}
