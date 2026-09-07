import { useEffect, useRef } from "react";
import Lenis from "@studio-freight/lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HoverLinks from "./HoverLinks";
import "./styles/Navbar.css";

gsap.registerPlugin(ScrollTrigger);

export let lenis: Lenis | null = null;

const Navbar = () => {
   const progressRef = useRef<HTMLDivElement>(null);
   const navRef = useRef<HTMLDivElement>(null);

   useEffect(() => {
      // Initialize Lenis with ultra-premium smooth physics
      lenis = new Lenis({
         duration: 1.3,
         easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
         orientation: "vertical",
         gestureOrientation: "vertical",
         smoothWheel: true,
         wheelMultiplier: 0.9,
         touchMultiplier: 1.5,
         infinite: false,
      });

      // Synchronize Lenis scroll with GSAP ScrollTrigger
      lenis.on("scroll", ScrollTrigger.update);

      const rafCallback = (time: number) => {
         lenis?.raf(time * 1000);
      };
      gsap.ticker.add(rafCallback);
      gsap.ticker.lagSmoothing(0);

      // Scroll progress bar & header glassmorphism
      lenis.on("scroll", ({ progress }: { progress: number }) => {
         if (progressRef.current) {
            progressRef.current.style.transform = `scaleX(${progress})`;
         }
         if (navRef.current) {
            if (progress > 0.015) {
               navRef.current.classList.add("header--scrolled");
            } else {
               navRef.current.classList.remove("header--scrolled");
            }
         }
      });

      // Smooth section jumping with Lenis
      const links = document.querySelectorAll<HTMLAnchorElement>(".header ul a");
      const clickHandlers: { el: HTMLAnchorElement; fn: (e: MouseEvent) => void }[] = [];

      links.forEach((el) => {
         const fn = (e: MouseEvent) => {
            e.preventDefault();
            const href = el.getAttribute("data-href") || el.getAttribute("href");
            if (!href) return;
            const target = document.querySelector(href);
            if (target && lenis) {
               lenis.scrollTo(target as HTMLElement, {
                  offset: -60,
                  duration: 1.6,
                  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
               });
            }
         };
         el.addEventListener("click", fn);
         clickHandlers.push({ el, fn });
      });

      return () => {
         clickHandlers.forEach(({ el, fn }) => el.removeEventListener("click", fn));
         gsap.ticker.remove(rafCallback);
         lenis?.destroy();
         lenis = null;
      };
   }, []);

   return (
      <>
         {/* Top Ultra-Thin Scroll Progress Bar */}
         <div className="scroll-progress-track">
            <div ref={progressRef} className="scroll-progress-bar" />
         </div>

         <div ref={navRef} className="header">
            <a href="/#" className="navbar-title" data-cursor="disable">
               KMA
            </a>
            <ul>
               <li>
                  <a data-href="#about" href="#about">
                     <HoverLinks text="ABOUT" />
                  </a>
               </li>
               <li>
                  <a data-href="#work" href="#work">
                     <HoverLinks text="WORK" />
                  </a>
               </li>
               <li>
                  <a data-href="#contact" href="#contact">
                     <HoverLinks text="CONTACT" />
                  </a>
               </li>
            </ul>
         </div>

         <div className="landing-circle1"></div>
         <div className="landing-circle2"></div>
         <div className="nav-fade"></div>
      </>
   );
};

export default Navbar;
