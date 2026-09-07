# Karthik M Achalakar — 3D Interactive Portfolio

[![Vercel Deployment](https://img.shields.io/badge/Deploy-Vercel-black?style=flat&logo=vercel)](https://vercel.com)
[![React](https://img.shields.io/badge/React-18.3-61dafb?style=flat&logo=react)](https://react.dev)
[![Three.js](https://img.shields.io/badge/Three.js-0.168-black?style=flat&logo=three.js)](https://threejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue?style=flat&logo=typescript)](https://www.typescriptlang.org)
[![Lenis](https://img.shields.io/badge/Smooth_Scroll-Lenis-teal?style=flat)](https://github.com/darkroomengineering/lenis)

An ultra-premium, interactive 3D portfolio website showcasing the engineering, AI/ML systems, and digital forensics projects of **Karthik M Achalakar**. Built with Three.js, React Three Fiber, Rapier physics, GSAP, and Lenis smooth scrolling.

---

## 🚀 Live Demo & Links

- **Devpost Profile:** [devpost.com/karthikma321](https://devpost.com/karthikma321)
- **GitHub:** [github.com/sleader3221-dot](https://github.com/sleader3221-dot)
- **LinkedIn:** [linkedin.com/in/karthik-ma](https://linkedin.com/in/karthik-ma)
- **Email:** [karthikma704@gmail.com](mailto:karthikma704@gmail.com)

---

## 🌟 Highlights & Features

- **Interactive 3D Character Model**: Real-time WebGL character rendering with Three.js, custom Draco decompression, dynamic emissive monitor lighting, and camera orbit transitions.
- **Ultra-Smooth Scrolling**: Powered by **Lenis** with customized cubic-bezier exponential deceleration and zero-lag GSAP `ScrollTrigger` synchronicity (60–120 FPS).
- **Interactive Tech Arsenal Sphere Physics**: 30 dynamic rigid-body physics spheres powered by `@react-three/rapier` with custom texture shaders and viewport-activated `IntersectionObserver`.
- **Top Scroll Progress Indicator**: Ultra-thin gradient indicator tracking reading progress.
- **Adaptive Glassmorphic Header**: Blur-saturate glassmorphic navbar with smooth opacity transitions.
- **Hardware-Accelerated Fluid Cursor**: Direct GPU `translate3d` mouse cursor with trailing neon aura and background orb parallax.
- **Devpost Winner Showcase**: 7 award-winning hackathon projects with live homepage preview screenshots, dual action links, and interactive 3D cards.

---

## 🏆 Featured Projects (Devpost Winners)

| Project | Category / Description | Awards / Recognition | Live Link |
|---|---|---|---|
| **ProofSIFT** | Autonomous DFIR Triage Agent (Python, TypeScript, SQLite, MITRE ATT&CK) | 🏆 3rd Place SANS "Find Evil" | [Live Demo](https://proof-sift.vercel.app/) |
| **Fin Wise** | Gamified Financial Literacy Platform for Teens | 🏆 2nd Overall HackMars 3.0 | [Live Demo](https://fin-wise-swart.vercel.app/) |
| **ShieldNet** | Decentralized Cybersecurity & Real-time Threat Intelligence | 🏆 Devpost Winner | [Live Demo](https://shield-net-three.vercel.app/) |
| **NexusAI** | Autonomous FinTech Command Center | 🏆 Devlance 2026 Winner | [Live Demo](https://nexus-ai-peach-theta.vercel.app/) |
| **NeuroFlow AI** | Adaptive Learning Platform with Spaced Repetition & Knowledge Graphs | 🏆 Devpost Winner | [Live Demo](https://neuro-flow-rnn5.vercel.app/) |
| **Civora** | AI Site-Safety Command Center (Digital Twin & Risk Intelligence) | 🏆 Devpost Winner | [Live Demo](https://civora-zeta.vercel.app/) |
| **Kavacha AI** | AI-Powered Security & Threat Alert Management | 🏆 Devpost Winner | [Live Demo](https://kavacha-ai.vercel.app/) |

---

## 🛠️ Tech Stack

- **Frontend Core:** React 18, TypeScript, Vite
- **3D Graphics & Physics:** Three.js, `@react-three/fiber`, `@react-three/drei`, `@react-three/rapier`
- **Animations & Physics Scroll:** Lenis (`@studio-freight/lenis`), GSAP 3, GSAP ScrollTrigger, SplitText
- **Styling & UI:** CSS Modules, Geist Font, React Icons, React Fast Marquee
- **Cloud & Deployment:** Vercel, Git

---

## 💻 Getting Started Locally

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- `npm` or `yarn` or `pnpm`

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/sleader3221-dot/Portfolio.git
   cd Portfolio
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

5. **Preview production build:**
   ```bash
   npm run preview
   ```

---

## ☁️ Vercel Deployment

This project includes a fully configured `vercel.json` optimized for Vite:

- Automatic SPA routing (`rewrites` to `/index.html`)
- Preconfigured MIME types (`application/wasm` for Draco decoders)
- Caching headers for 3D assets (`/models/*`, `/images/*`, `/draco/*`)
- Production security headers (`nosniff`, `SAMEORIGIN`, `X-XSS-Protection`)

Deploying to Vercel is as simple as connecting this GitHub repository on [vercel.com/new](https://vercel.com/new) and clicking **Deploy**.

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
