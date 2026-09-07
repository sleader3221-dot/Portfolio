import { useState, useCallback, useEffect, useRef } from "react";
import "./styles/Work.css";
import { MdArrowOutward } from "react-icons/md";

type Project = {
   title: string;
   category: string;
   tools: string[];
   image: string;
   link: string;
   devpostLink: string;
   accent: string;
   badge: string;
};

const DEFAULT_ACCENT = "#5eead4";

// All 7 Devpost WINNER projects — local Puppeteer screenshots + live Vercel URLs
const KARTHIK_PROJECTS: Project[] = [
   {
      title: "ProofSIFT",
      category: "Autonomous DFIR Triage Agent — 3rd Place SANS Find Evil",
      tools: ["Python", "TypeScript", "SQLite", "MITRE ATT&CK", "YARA", "Evidence Graphs"],
      image: "/images/projects/proofsift.png",
      link: "https://proof-sift.vercel.app/",
      devpostLink: "https://devpost.com/software/proofsift",
      accent: "#5eead4",
      badge: "🏆 Winner",
   },
   {
      title: "Fin Wise",
      category: "Gamified Financial Literacy — 2nd Overall HackMars 3.0",
      tools: ["React", "Fintech UX", "Product Design", "Dashboards", "Gamification"],
      image: "/images/projects/finwise.png",
      link: "https://fin-wise-swart.vercel.app/",
      devpostLink: "https://devpost.com/software/fin-wise-o9p4av",
      accent: "#84cc16",
      badge: "🏆 Winner",
   },
   {
      title: "ShieldNet",
      category: "AI Decentralized Cybersecurity & Fintech Intelligence Platform",
      tools: ["React", "AI/ML", "Blockchain", "Real-time Threat Detection", "Fintech"],
      image: "/images/projects/shieldnet.png",
      link: "https://shield-net-three.vercel.app/",
      devpostLink: "https://devpost.com/software/shieldnet-cagprz",
      accent: "#f59e0b",
      badge: "🏆 Winner",
   },
   {
      title: "NexusAI",
      category: "Autonomous FinTech Command Center — Devlance 2026",
      tools: ["React", "AI/ML", "Portfolio Optimization", "Fraud Detection", "Compliance"],
      image: "/images/projects/nexusai.png",
      link: "https://nexus-ai-peach-theta.vercel.app/",
      devpostLink: "https://devpost.com/software/nexusai-autonomous-fintech-command-center",
      accent: "#a78bfa",
      badge: "🏆 Winner",
   },
   {
      title: "NeuroFlow AI",
      category: "AI-Powered Adaptive Learning Platform with Spaced Repetition",
      tools: ["React", "Vite", "AI Tutor", "Spaced Repetition", "Knowledge Graphs"],
      image: "/images/projects/neuroflow.png",
      link: "https://neuro-flow-rnn5.vercel.app/",
      devpostLink: "https://devpost.com/software/neuroflow-ai-m4h6pi",
      accent: "#06b6d4",
      badge: "🏆 Winner",
   },
   {
      title: "Civora",
      category: "AI Site-Safety Command Center — Catches Risks 18 min Early",
      tools: ["React", "AI/ML", "Digital Twin", "Real-time Analytics", "Safety Intelligence"],
      image: "/images/projects/civora.png",
      link: "https://civora-zeta.vercel.app/",
      devpostLink: "https://devpost.com/software/civora",
      accent: "#ef4444",
      badge: "🏆 Winner",
   },
   {
      title: "Kavacha AI",
      category: "AI-Powered Security & Threat Intelligence Platform",
      tools: ["React", "AI/ML", "Real-time Alerts", "Security Dashboard", "Zoho Integration"],
      image: "/images/projects/kavacha.png",
      link: "https://kavacha-ai.vercel.app/",
      devpostLink: "https://devpost.com/karthikma321",
      accent: "#f97316",
      badge: "🏆 Winner",
   },
];

const Work = () => {
   const [projects] = useState<Project[]>(KARTHIK_PROJECTS);
   const [activeCard, setActiveCard] = useState<number | null>(null);
   const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
   const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set());

   const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
   const sectionRef = useRef<HTMLDivElement>(null);

   useEffect(() => {
      if (projects.length === 0) return;
      const observer = new IntersectionObserver(
         (entries) => {
            entries.forEach((entry) => {
               const index = Number(entry.target.getAttribute("data-index"));
               if (entry.isIntersecting) {
                  setVisibleCards((prev) => {
                     if (prev.has(index)) return prev;
                     const next = new Set(prev);
                     next.add(index);
                     return next;
                  });
               }
            });
         },
         { threshold: 0.15, rootMargin: "0px 0px -50px 0px" },
      );
      cardRefs.current.forEach((ref) => { if (ref) observer.observe(ref); });
      return () => observer.disconnect();
   }, [projects]);

   const handleMouseMove = useCallback(
      (e: React.MouseEvent<HTMLDivElement>, index: number) => {
         const card = cardRefs.current[index];
         if (!card) return;
         const rect = card.getBoundingClientRect();
         setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      },
      [],
   );

   return (
      <div className="work-section" id="work" ref={sectionRef}>
         <div className="work-container section-container">
            <div className="work-header">
               <div className="work-header-line" />
               <h2>
                  Featured <span>Projects</span>
               </h2>
               <p className="work-subtitle">
                  7 Devpost Winner-badged projects across AI, cybersecurity, fintech &amp; forensics —
                  built across 61 hackathons with measurable real-world impact.
               </p>
            </div>

            <div className="work-counter">
               <span className="work-counter-num">{projects.length}</span>
               <span className="work-counter-label">Winner Projects</span>
            </div>

            <div className="gallery-grid">
               {projects.map((project, index) => (
                  <div
                     key={`${project.title}-${index}`}
                     className={`gallery-card ${
                        visibleCards.has(index) ? "gallery-card--visible" : ""
                     } ${activeCard === index ? "gallery-card--active" : ""}`}
                     data-index={index}
                     ref={(el) => { cardRefs.current[index] = el; }}
                     onMouseEnter={() => setActiveCard(index)}
                     onMouseLeave={() => setActiveCard(null)}
                     onMouseMove={(e) => handleMouseMove(e, index)}
                     style={{
                        "--card-accent": project.accent || DEFAULT_ACCENT,
                        "--delay": `${index * 0.08}s`,
                        "--mouse-x": `${mousePos.x}px`,
                        "--mouse-y": `${mousePos.y}px`,
                     } as React.CSSProperties}
                  >
                     <div className="gallery-card-glow" />

                     <div className="gallery-card-number" style={{ color: "gold", fontSize: "0.78rem", fontWeight: 700 }}>
                        {project.badge}
                     </div>

                     <div className="gallery-card-image">
                        <img
                           src={project.image}
                           alt={project.title}
                           loading="lazy"
                           onError={(e) => {
                              (e.currentTarget as HTMLImageElement).style.display = "none";
                           }}
                        />
                        <div className="gallery-card-image-overlay" />
                     </div>

                     <div className="gallery-card-content">
                        <h3 className="gallery-card-title">{project.title}</h3>
                        <p className="gallery-card-category">{project.category}</p>

                        {project.tools.length > 0 && (
                           <div className="gallery-card-tools">
                              {project.tools.map((tool, i) => (
                                 <span key={`${tool}-${i}`} className="gallery-tool-pill">{tool}</span>
                              ))}
                           </div>
                        )}

                        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "0.75rem" }}>
                           <a
                              href={project.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="gallery-card-link"
                              data-cursor="disable"
                           >
                              <span>Live Demo</span>
                              <MdArrowOutward />
                           </a>
                           <a
                              href={project.devpostLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="gallery-card-link"
                              data-cursor="disable"
                              style={{ opacity: 0.65 }}
                           >
                              <span>Devpost</span>
                              <MdArrowOutward />
                           </a>
                        </div>
                     </div>

                     <div className="gallery-card-accent-line" />
                  </div>
               ))}
            </div>
         </div>
      </div>
   );
};

export default Work;
