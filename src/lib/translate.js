const LT_URL = import.meta.env.VITE_LT_URL || 'https://libretranslate.com'
const LT_KEY = import.meta.env.VITE_LT_KEY || ''

export async function translateText(q, source='en', target='es'){
  try{
    const res = await fetch(`${LT_URL}/translate`,{
      method:'POST',
      headers:{ 'Content-Type':'application/json' },
      body: JSON.stringify({ q, source, target, api_key: LT_KEY })
    })
    if(!res.ok) return q
    const data = await res.json()
    return data.translatedText || q
  }catch{
    return q
  }
}
