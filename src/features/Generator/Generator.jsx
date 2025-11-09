import { useState } from 'react'
import { generateImage } from '../../lib/hf.js'
import { useI18n } from '../../context/I18nContext.jsx'
import './generator.css'

export default function Generator(){
  const { t } = useI18n()
  const [prompt, setPrompt] = useState('low-rise metallic skirt, baby tee, platform boots, cyber accessories')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const [preset, setPreset] = useState('y2k-cyber')
  const [size, setSize] = useState('512') // 512 | 640x832 | 832x640
  const [quality, setQuality] = useState('standard') // standard | high

  function buildFinalPrompt() {
    const presetTextMap = {
      'y2k-cyber': 'Y2K cyber fashion, iridescent and reflective fabrics, metallic finishes, neon accents, early 2000s editorial, clean studio backdrop, soft rim light, high detail, sharp focus',
      'streetwear': 'contemporary streetwear editorial, layered textures, bold accessories, lifestyle fashion photography, clean backdrop',
      'editorial': 'high fashion editorial, dramatic lighting, studio shot, professional styling, glossy finish, high detail',
      'minimal': 'minimalist fashion photography, monochrome palette, clean lines, soft lighting'
    }
    const style = presetTextMap[preset] || presetTextMap['y2k-cyber']
    // Compose prompt from user description + preset
    return `${style}. Outfit details: ${prompt}. Full-body look, posed, symmetric composition`
  }

  function mapSize() {
    switch (size) {
      case '640x832': return { width: 640, height: 832 }
      case '832x640': return { width: 832, height: 640 }
      default: return { width: 512, height: 512 }
    }
  }

  function mapQuality() {
    return quality === 'high'
      ? { steps: 50, guidanceScale: 8.5 }
      : { steps: 30, guidanceScale: 7.5 }
  }

  async function onGenerate(){
    setLoading(true); setError(null); setResult(null)
    const { width, height } = mapSize()
    const { steps, guidanceScale } = mapQuality()
    const finalPrompt = buildFinalPrompt()
    const negativePrompt = 'lowres, blurry, watermark, text, logo, deformed, extra limbs, bad anatomy, ugly, noisy, jpeg artifacts'
    const r = await generateImage({ prompt: finalPrompt, negativePrompt, width, height, steps, guidanceScale })
    if(r.error) setError(r.error)
    setResult(r.imageUrl || null)
    setLoading(false)
  }

  return (
    <div className="gen-page">
      <h2>{t('Generate')}</h2>

      {/* Controls */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap: 8 }}>
        <label>
          <span style={{ display:'block', fontSize:12, opacity:.8 }}>Style</span>
          <select value={preset} onChange={e=> setPreset(e.target.value)}>
            <option value="y2k-cyber">Y2K Cyber Fashion</option>
            <option value="streetwear">Streetwear</option>
            <option value="editorial">High Fashion Editorial</option>
            <option value="minimal">Minimalist</option>
          </select>
        </label>
        <label>
          <span style={{ display:'block', fontSize:12, opacity:.8 }}>Size</span>
          <select value={size} onChange={e=> setSize(e.target.value)}>
            <option value="512">Square 512x512</option>
            <option value="640x832">Portrait 640x832</option>
            <option value="832x640">Landscape 832x640</option>
          </select>
        </label>
        <label>
          <span style={{ display:'block', fontSize:12, opacity:.8 }}>Quality</span>
          <select value={quality} onChange={e=> setQuality(e.target.value)}>
            <option value="standard">Standard</option>
            <option value="high">High</option>
          </select>
        </label>
      </div>

      <label htmlFor="prompt" style={{ display:'none' }}>{t('Prompt')}</label>
      <textarea
        id="prompt"
        name="prompt"
        aria-label="Describe the outfit"
        value={prompt}
        onChange={e=> setPrompt(e.target.value)}
        rows={3}
        placeholder="Describe the outfit (e.g., holographic mini skirt, baby tee, pink faux-fur jacket, platform boots)"
      />
      <button disabled={loading} onClick={onGenerate}>{loading ? '...' : t('Generate Image')}</button>
      {error && <p className="error">{error}</p>}
      {result && <img src={result} alt="generated" className="gen-img" />}
    </div>
  )
}
