import { useState, useRef, useEffect } from 'react'
import { useI18n } from '../../context/I18nContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import './tryon.css'

const placeholderOutfits = [
  { id:'y2k-pink', label:'Pink Puff', src:'/src/assets/outfits/pink.svg' },
  { id:'y2k-blue', label:'Blue Shine', src:'/src/assets/outfits/blue.svg' },
]

export default function TryOn(){
  const { t } = useI18n()
  const { showToast } = useToast()
  const [photo, setPhoto] = useState(null)
  const [active, setActive] = useState(placeholderOutfits[0])
  const [transform, setTransform] = useState({ x:50, y:50, scale:1, rot:0 })
  const dragRef = useRef(null)
  const dragging = useRef(false)
  const last = useRef({x:0,y:0})
  const basePhotoRef = useRef(null)
  const areaRef = useRef(null)

  function onUpload(e){
    const file = e.target.files?.[0]
    if(!file) return
    const reader = new FileReader()
    reader.onload = ()=> setPhoto(reader.result)
    reader.readAsDataURL(file)
  }

  function onPointerDown(e){
    dragging.current = true
    last.current = { x: e.clientX, y: e.clientY }
  }
  function onPointerMove(e){
    if(!dragging.current) return
    const dx = e.clientX - last.current.x
    const dy = e.clientY - last.current.y
    last.current = { x: e.clientX, y: e.clientY }
    setTransform(tr => ({ ...tr, x: tr.x + dx, y: tr.y + dy }))
  }
  function onPointerUp(){ dragging.current = false }

  useEffect(()=>{
    window.addEventListener('pointerup', onPointerUp)
    window.addEventListener('pointermove', onPointerMove)
    return ()=>{
      window.removeEventListener('pointerup', onPointerUp)
      window.removeEventListener('pointermove', onPointerMove)
    }
  },[])

  async function exportComposite(){
    if(!photo){ showToast(t('Upload Photo') + ' ?', 'error'); return }
    const area = areaRef.current
    const canvas = document.createElement('canvas')
    const w = area.clientWidth
    const h = area.clientHeight
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d')
    // draw base photo
    const imgBase = new Image()
    imgBase.src = photo
    await imgLoad(imgBase)
    // center the base photo similar to displayed
    const ratio = Math.min(w / imgBase.width, h / imgBase.height)
    const pw = imgBase.width * ratio
    const ph = imgBase.height * ratio
    const px = (w - pw) / 2
    const py = (h - ph) / 2
    ctx.drawImage(imgBase, px, py, pw, ph)
    // draw outfit
    if(active){
      const outfitImg = new Image()
      outfitImg.src = active.src
      await imgLoad(outfitImg)
      ctx.save()
      ctx.translate(transform.x, transform.y)
      ctx.rotate(transform.rot * Math.PI/180)
      ctx.scale(transform.scale, transform.scale)
      ctx.drawImage(outfitImg, -outfitImg.width/2, -outfitImg.height/2)
      ctx.restore()
    }
    canvas.toBlob(b => {
      const url = URL.createObjectURL(b)
      const a = document.createElement('a')
      a.href = url
      a.download = 'stylemuse-composite.png'
      a.click()
      showToast(t('Exported Composite'), 'success')
    })
  }

  function imgLoad(img){
    return new Promise(res=>{ img.onload = res })
  }

  return (
    <div className="tryon-page">
      <h2>{t('Try On')}</h2>
      <div className="controls">
        <label>{t('Upload Photo')} <input type="file" accept="image/*" onChange={onUpload} /></label>
        <label>{t('Choose Outfit')} <select value={active.id} onChange={e=> setActive(placeholderOutfits.find(o=>o.id===e.target.value))}>
          {placeholderOutfits.map(o=> <option key={o.id} value={o.id}>{o.label}</option>)}
        </select></label>
        <div className="sliders">
          <label>Scale <input type="range" min="0.3" max="2" step="0.01" value={transform.scale} onChange={e=> setTransform(tr=>({...tr, scale: parseFloat(e.target.value)}))} /></label>
          <label>Rotate <input type="range" min="-180" max="180" step="1" value={transform.rot} onChange={e=> setTransform(tr=>({...tr, rot: parseFloat(e.target.value)}))} /></label>
        </div>
        <button onClick={exportComposite}>{t('Export Composite')}</button>
      </div>
      <div className="canvas-area" ref={areaRef}>
        {photo && <img ref={basePhotoRef} src={photo} alt="uploaded" className="base-photo" />}
        {active && (
          <img
            ref={dragRef}
            onPointerDown={onPointerDown}
            src={active.src}
            alt={active.label}
            className="outfit-layer"
            style={{ transform:`translate(${transform.x}px,${transform.y}px) scale(${transform.scale}) rotate(${transform.rot}deg)`, transformOrigin:'center center' }}
          />
        )}
      </div>
    </div>
  )
}
