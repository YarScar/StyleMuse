function getHfToken(){
  // Prefer Vite env, fallback to window or optional <meta name="hf-token">
  const envTok = (import.meta?.env && import.meta.env.VITE_HF_TOKEN) || ''
  const winTok = typeof window !== 'undefined' ? (window.VITE_HF_TOKEN || '') : ''
  const metaTok = typeof document !== 'undefined'
    ? (document.querySelector('meta[name="hf-token"]')?.content || '')
    : ''
  return (envTok || winTok || metaTok || '').trim()
}

export async function generateImage({ prompt, negativePrompt, width = 512, height = 512, guidanceScale = 7.5, steps = 30, seed }) {
  const token = getHfToken()
  const model = import.meta.env.VITE_HF_MODEL || 'stabilityai/stable-diffusion-2-1'
  const clean = (prompt||'').trim()
  if (!clean) return { error: 'Empty prompt' }
  if (!token) {
    return { error: 'Missing Hugging Face token (VITE_HF_TOKEN). Ensure it is set in .env (prefixed with VITE_) and dev server restarted.' }
  }
  const body = {
    inputs: clean,
    parameters: {
      negative_prompt: (negativePrompt || 'lowres, blurry, watermark, text, logo, deformed, extra limbs, bad anatomy').slice(0, 1000),
      width, height,
      guidance_scale: guidanceScale,
      num_inference_steps: steps,
      ...(typeof seed === 'number' ? { seed } : {})
    }
  }

  async function callOnce(){
    const res = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'image/png',
      },
      body: JSON.stringify(body),
    })
    return res
  }

  try {
    // try request, if 503 (model loading), wait and retry once
    let res = await callOnce()
    if (res.status === 503) {
      let waitMs = 5000
      try {
        const j = await res.json()
        if (j?.estimated_time) waitMs = Math.ceil(j.estimated_time * 1000)
      } catch {}
      await new Promise(r => setTimeout(r, waitMs))
      res = await callOnce()
    }

    if (!res.ok) {
      let msg = `HF error ${res.status}`
      try {
        const j = await res.json()
        if (j?.error) msg = j.error
      } catch {}
      return { error: msg }
    }
    const blob = await res.blob()
    return { imageUrl: URL.createObjectURL(blob) }
  } catch {
    return { error: 'Network error contacting Hugging Face' }
  }
}
