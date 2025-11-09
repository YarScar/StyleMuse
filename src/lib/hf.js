export async function generateImage({ prompt }) {
  const token = import.meta.env.VITE_HF_TOKEN
  const model = import.meta.env.VITE_HF_MODEL || 'stabilityai/stable-diffusion-2-1'
  if(!token){
    return { error: 'Missing Hugging Face token (VITE_HF_TOKEN)' }
  }
  const res = await fetch(`https://api-inference.huggingface.co/models/${model}`,{
    method:'POST',
    headers:{ 'Authorization':`Bearer ${token}`, 'Content-Type':'application/json' },
    body: JSON.stringify({ inputs: prompt })
  })
  if(!res.ok){
    return { error: `HF error ${res.status}` }
  }
  const blob = await res.blob()
  return { imageUrl: URL.createObjectURL(blob) }
}
