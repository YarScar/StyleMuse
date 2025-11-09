# 👗 StyleMuse — AI Fashion Stylist (React + Vite, Frontend Only)

**StyleMuse** is an AI-powered **fashion stylist web app** built with **React (Vite + JSX + CSS)**.  
It helps users visualize outfits, try them on virtually, and even generate new fashion looks using AI — all running completely on the frontend (no server or database needed).

---

## ✨ Features

### 🧍‍♀️ Virtual Outfit Try-On
- Upload a photo of yourself and preview outfits directly on top of your image.  
- Uses **HTML Canvas** or simple CSS overlays to layer outfits visually.  
- 100% frontend — no backend image processing.

### 🖼️ AI Outfit Image Generator
- Generate **realistic outfit images** using the **Hugging Face Stable Diffusion API**.  
- Example prompt:  
  > “A modern streetwear outfit, oversized hoodie, cargo pants, sneakers, neutral background.”  
- Displays the generated outfit instantly in your browser.

### 👗 Outfit Gallery (Preloaded)
- Browse local outfit images stored in `/assets/outfits/`.  
- Organized by style (e.g., casual, minimalist, formal, date night).  
- Click to preview or overlay on your uploaded photo.

### 👕 My Closet (Local Storage)
- Upload your own outfit pictures and store them locally (no account needed).  
- The app can suggest mix & match ideas using your saved items.

### 🌎 Language Translation
- Integrated with **LibreTranslate API** — free and open source.  
- Lets users translate text or style prompts into any supported language.

---

## 🧰 Tech Stack

| Purpose | Tool |
|----------|------|
| Framework | React (Vite + JSX) |
| Styling | CSS / CSS Modules |
| AI Image Generation | Hugging Face Stable Diffusion API |
| Translation | [LibreTranslate](https://libretranslate.com/) |
| Data Storage | LocalStorage / IndexedDB |
| Image Layering | HTML Canvas / CSS |

---

## ⚙️ Installation & Setup

### 1. Create your Vite + React project
```bash
npm create vite@latest stylemuse -- --template react
