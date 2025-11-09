import './gallery.css'
import pink from '../../assets/outfits/pink.svg'
import blue from '../../assets/outfits/blue.svg'
const items = [
  { id:'casual-1', label:'Casual 1', src: pink },
  { id:'y2k-1', label:'Y2K 1', src: blue },
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
