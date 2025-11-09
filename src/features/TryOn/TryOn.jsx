// DEPRECATED: TryOn feature retained but not routed.
import pink from '../../assets/outfits/pink.svg'
import blue from '../../assets/outfits/blue.svg'
import { useState, useRef, useEffect } from 'react'
import { useI18n } from '../../context/I18nContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import './tryon.css'

const placeholderOutfits = [
  { id:'y2k-pink', label:'Pink Puff', src: pink },
  { id:'y2k-blue', label:'Blue Shine', src: blue },
]

export default function TryOn(){
  const { t } = useI18n()
  const { showToast } = useToast()
  const [photo, setPhoto] = useState(null)
  const [active, setActive] = useState(placeholderOutfits[0])
  const [transform, setTransform] = useState({ x:0, y:0, scale:1, rot:0, flip:false })
  const areaRef = useRef(null)
  const dragging = useRef(null) // { mode:'move'|'scale'|'rotate', start:{x,y}, orig:{x,y,scale,rot} }
  const OUTFIT_BASE = 240

  function centerOutfit(){
    const area = areaRef.current
    if(!area) return
    const ax = (area.clientWidth - OUTFIT_BASE)/2
    const ay = (area.clientHeight - OUTFIT_BASE)/2
    setTransform({ x:ax, y:ay, scale:1, rot:0, flip:false })
  }

  useEffect(()=>{
    centerOutfit()
    const onResize = ()=> centerOutfit()
    window.addEventListener('resize', onResize)
    return ()=> window.removeEventListener('resize', onResize)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  useEffect(()=>{
    // recenter on outfit change
    centerOutfit()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[active?.id])

  function onUpload(e){
    const f = e.target.files?.[0]; if(!f) return
    const r = new FileReader()
    r.onload = ()=> setPhoto(r.result)
    r.readAsDataURL(f)
  }

  function onOutfitDown(e, mode='move'){
    e.preventDefault()
    dragging.current = {
      mode,
      start: { x: e.clientX, y: e.clientY },
      orig: { ...transform }
    }
  }

  useEffect(()=>{
    function onMove(e){
      const d = dragging.current
      if(!d) return
      e.preventDefault()
      const dx = e.clientX - d.start.x
      const dy = e.clientY - d.start.y
      if(d.mode === 'move'){
        setTransform(tr => ({ ...tr, x: d.orig.x + dx, y: d.orig.y + dy }))
      }else if(d.mode === 'scale'){
        const cx = d.orig.x + (OUTFIT_BASE * d.orig.scale)/2
        const cy = d.orig.y + (OUTFIT_BASE * d.orig.scale)/2
        const dist0 = Math.hypot(d.start.x - cx, d.start.y - cy)
        const dist1 = Math.hypot(e.clientX - cx, e.clientY - cy)
        const ns = Math.max(0.2, Math.min(4, d.orig.scale * (dist1 / Math.max(10, dist0))))
        setTransform(tr => ({ ...tr, scale: ns }))
      }else if(d.mode === 'rotate'){
        const cx = d.orig.x + (OUTFIT_BASE * d.orig.scale)/2
        const cy = d.orig.y + (OUTFIT_BASE * d.orig.scale)/2
        const a0 = Math.atan2(d.start.y - cy, d.start.x - cx)
        const a1 = Math.atan2(e.clientY - cy, e.clientX - cx)
        const deg = (a1 - a0) * 180/Math.PI
        setTransform(tr => ({ ...tr, rot: d.orig.rot + deg }))
      }
    }
    function onUp(){ dragging.current = null }
    window.addEventListener('pointermove', onMove, { passive:false })
    window.addEventListener('pointerup', onUp)
    return ()=>{
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }
  },[transform])

  // Wheel: zoom, Shift+Wheel rotate
  useEffect(()=>{
    function onWheel(e){
      if(!areaRef.current?.contains(e.target)) return
      e.preventDefault()
      const dir = e.deltaY > 0 ? -1 : 1
      if(e.shiftKey){
        setTransform(tr => ({ ...tr, rot: tr.rot + dir * 5 }))
      }else{
        setTransform(tr => {
          const ns = Math.max(0.2, Math.min(4, tr.scale + dir * 0.06))
          return { ...tr, scale: ns }
        })
      }
    }
    window.addEventListener('wheel', onWheel, { passive:false })
    return ()=> window.removeEventListener('wheel', onWheel)
  },[])

  // Keyboard: +/- zoom, [/] rotate, 0 reset, F flip
  useEffect(()=>{
    function onKey(e){
      if(e.target && ['INPUT','TEXTAREA','SELECT'].includes(e.target.tagName)) return
      if(e.key === '+') setTransform(tr=>({ ...tr, scale: Math.min(4, tr.scale+0.06) }))
      if(e.key === '-') setTransform(tr=>({ ...tr, scale: Math.max(0.2, tr.scale-0.06) }))
      if(e.key === '[') setTransform(tr=>({ ...tr, rot: tr.rot - 5 }))
      if(e.key === ']') setTransform(tr=>({ ...tr, rot: tr.rot + 5 }))
      if(e.key === '0') centerOutfit()
      if(e.key.toLowerCase() === 'f') setTransform(tr=>({ ...tr, flip: !tr.flip }))
    }
    window.addEventListener('keydown', onKey)
    return ()=> window.removeEventListener('keydown', onKey)
  },[])

  async function exportComposite(){
    if(!photo){ showToast(t('Upload Photo') + ' ?', 'error'); return }
    const area = areaRef.current
    const w = area.clientWidth, h = area.clientHeight
    const canvas = document.createElement('canvas')
    canvas.width = w; canvas.height = h
    const ctx = canvas.getContext('2d')

    const base = new Image(); base.src = photo; await imgLoad(base)
    const ratio = Math.min(w/base.width, h/base.height)
    const pw = base.width*ratio, ph = base.height*ratio
    const px = (w-pw)/2, py = (h-ph)/2
    ctx.drawImage(base, px, py, pw, ph)

    if(active){
      const outfit = new Image(); outfit.src = active.src; await imgLoad(outfit)
      ctx.save()
      const drawW = OUTFIT_BASE, drawH = OUTFIT_BASE
      const cx = transform.x + (drawW*transform.scale)/2
      const cy = transform.y + (drawH*transform.scale)/2
      ctx.translate(cx, cy)
      ctx.rotate(transform.rot * Math.PI/180)
      ctx.scale(transform.scale * (transform.flip ? -1 : 1), transform.scale)
      ctx.drawImage(outfit, -drawW/2, -drawH/2, drawW, drawH)
      ctx.restore()
    }

    canvas.toBlob(b=>{
      const url = URL.createObjectURL(b)
      const a = document.createElement('a')
      a.href = url; a.download = 'stylemuse-tryon.png'
      a.click()
      showToast(t('Exported Composite'), 'success')
    })
  }

  function imgLoad(img){ return new Promise(res => { img.onload = res }) }

  return (
    <div className="tryon-page">
      <h2>{t('Try On')}</h2>

      <div className="tryon-controls">
        <label className="upload">{t('Upload Photo')} <input type="file" accept="image/*" onChange={onUpload} /></label>
        <div className="spacer" />
        <button onClick={()=> setTransform(tr=>({ ...tr, flip: !tr.flip }))}>{transform.flip ? 'Unflip' : 'Flip'}</button>
        <button onClick={centerOutfit}>Reset</button>
        <button onClick={exportComposite}>{t('Export Composite')}</button>
      </div>

      <div className="canvas-area" ref={areaRef}>
        {photo && <img src={photo} alt="uploaded" className="base-photo" />}
        {active && (
          <div
            className="outfit-wrap"
            style={{
              transform: `translate(${transform.x}px, ${transform.y}px)`,
              width: OUTFIT_BASE*transform.scale,
              height: OUTFIT_BASE*transform.scale
            }}
            onPointerDown={(e)=> onOutfitDown(e,'move')}
          >
            <img
              src={active.src}
              alt={active.label}
              className="outfit-layer"
              style={{
                transform: `scale(${transform.scale * (transform.flip ? -1 : 1)}, ${transform.scale}) rotate(${transform.rot}deg)`,
                transformOrigin:'top left',
                width: OUTFIT_BASE,
                height: OUTFIT_BASE
              }}
              onDoubleClick={()=> setTransform(tr=>({ ...tr, flip: !tr.flip }))}
              draggable={false}
            />
            <div className="handle scale" onPointerDown={(e)=> onOutfitDown(e,'scale')} />
            <div className="handle rotate" onPointerDown={(e)=> onOutfitDown(e,'rotate')} />
          </div>
        )}
      </div>

      <div className="rack">
        {placeholderOutfits.map(o=>(
          <button
            key={o.id}
            className={`rack-item ${active?.id===o.id?'active':''}`}
            onClick={()=> setActive(o)}
            title={o.label}
          >
            <img src={o.src} alt={o.label} />
            <span>{o.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
