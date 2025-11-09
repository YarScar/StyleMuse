import { set, get, del, keys } from 'idb-keyval'

const CLOSET_PREFIX = 'closet:'

export async function saveClosetItem(file){
  const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`
  const dataUrl = await fileToDataUrl(file)
  await set(CLOSET_PREFIX+id, { id, dataUrl, name: file.name, created: Date.now() })
  return id
}

export async function listCloset(){
  const allKeys = await keys()
  const ours = allKeys.filter(k => k.startsWith(CLOSET_PREFIX))
  const entries = await Promise.all(ours.map(k => get(k)))
  return entries.sort((a,b)=>b.created - a.created)
}

export async function removeCloset(id){
  await del(CLOSET_PREFIX+id)
}

function fileToDataUrl(file){
  return new Promise(res=>{
    const r = new FileReader()
    r.onload = ()=> res(r.result)
    r.readAsDataURL(file)
  })
}
