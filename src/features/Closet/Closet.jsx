import { useEffect, useState } from 'react'
import { saveClosetItem, listCloset, removeCloset } from '../../lib/storage.js'
import './closet.css'

export default function Closet(){
  const [items, setItems] = useState([])

  async function refresh(){ setItems(await listCloset()) }
  useEffect(()=>{ refresh() },[])

  async function onAdd(e){
    const f = e.target.files?.[0]
    if(!f) return
    await saveClosetItem(f)
    await refresh()
  }
  async function onDelete(id){
    await removeCloset(id)
    await refresh()
  }

  return (
    <div className="closet-page">
      <div className="bar">
        <label>Upload <input type="file" accept="image/*" onChange={onAdd} /></label>
      </div>
      <div className="grid">
        {items.map(it=> (
          <div className="card" key={it.id}>
            <img src={it.dataUrl} alt={it.name} />
            <div className="row">
              <span className="name">{it.name}</span>
              <button onClick={()=>onDelete(it.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
