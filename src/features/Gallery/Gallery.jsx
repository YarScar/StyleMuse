import './gallery.css'

const items = [
  { id:'casual-1', label:'Casual 1', src:'/src/assets/outfits/pink.svg' },
  { id:'y2k-1', label:'Y2K 1', src:'/src/assets/outfits/blue.svg' },
]

export default function Gallery(){
  return (
    <div className="gallery-page">
      {items.map(i=> (
        <figure key={i.id}>
          <img src={i.src} alt={i.label} />
          <figcaption>{i.label}</figcaption>
        </figure>
      ))}
    </div>
  )
}
