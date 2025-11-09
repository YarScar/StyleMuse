import './Footer.css'

export default function Footer(){
  const year = new Date().getFullYear()
  return (
    <footer className="sm-footer">
      <div>© {year} StyleMuse • Built with React + Vite</div>
      <div className="credits">
        Images via Hugging Face Inference API
      </div>
    </footer>
  )
}
