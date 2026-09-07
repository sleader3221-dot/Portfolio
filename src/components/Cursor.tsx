import { useEffect, useRef } from "react";
import "./styles/Cursor.css";

const Cursor = () => {
   const cursorRef = useRef<HTMLDivElement>(null);
   const dotRef = useRef<HTMLDivElement>(null);
   const posRef = useRef({ x: -100, y: -100 });
   const currentRef = useRef({ x: -100, y: -100 });
   const isHoverRef = useRef(false);
   const isIconsRef = useRef(false);
   const isDisableRef = useRef(false);

   useEffect(() => {
      const cursor = cursorRef.current;
      const dot = dotRef.current;
      if (!cursor || !dot) return;

      const onMouseMove = (e: MouseEvent) => {
         posRef.current.x = e.clientX;
         posRef.current.y = e.clientY;

         // Direct hardware-accelerated positioning of central pinpoint dot
         dot.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;

         // Ambient light orbs subtle parallax
         const xNorm = (e.clientX / window.innerWidth - 0.5) * 35;
         const yNorm = (e.clientY / window.innerHeight - 0.5) * 35;
         const circle1 = document.querySelector(".landing-circle1") as HTMLElement;
         const circle2 = document.querySelector(".landing-circle2") as HTMLElement;
         if (circle1) {
            circle1.style.transform = `translate(calc(-95% + ${xNorm * 0.4}px), calc(-75% + ${yNorm * 0.4}px))`;
         }
         if (circle2) {
            circle2.style.transform = `translate(calc(100% - 2px + ${-xNorm * 0.3}px), calc(-50% + ${-yNorm * 0.3}px))`;
         }

         // Detect cursor target elements
         const target = e.target as HTMLElement;
         const hoverElem = target.closest("a, button, [data-cursor], .gallery-card, .what-tags");
         if (hoverElem) {
            const cursorMode = (hoverElem as HTMLElement).dataset.cursor;
            if (cursorMode === "disable") {
               isDisableRef.current = true;
               isHoverRef.current = false;
               isIconsRef.current = false;
            } else if (cursorMode === "icons") {
               isIconsRef.current = true;
               isHoverRef.current = false;
               isDisableRef.current = false;
            } else {
               isHoverRef.current = true;
               isIconsRef.current = false;
               isDisableRef.current = false;
            }
         } else {
            isHoverRef.current = false;
            isIconsRef.current = false;
            isDisableRef.current = false;
         }

         cursor.classList.toggle("cursor-hover", isHoverRef.current);
         cursor.classList.toggle("cursor-icons", isIconsRef.current);
         cursor.classList.toggle("cursor-disable", isDisableRef.current);
      };

      let rafId = 0;
      const animate = () => {
         // Smooth fluid trailing lerp (0.12 = silky responsiveness)
         currentRef.current.x += (posRef.current.x - currentRef.current.x) * 0.12;
         currentRef.current.y += (posRef.current.y - currentRef.current.y) * 0.12;

         cursor.style.transform = `translate3d(${currentRef.current.x}px, ${currentRef.current.y}px, 0)`;
         rafId = requestAnimationFrame(animate);
      };

      window.addEventListener("mousemove", onMouseMove, { passive: true });
      rafId = requestAnimationFrame(animate);

      return () => {
         window.removeEventListener("mousemove", onMouseMove);
         cancelAnimationFrame(rafId);
      };
   }, []);

   return (
      <>
         <div ref={cursorRef} className="cursor-main" />
         <div ref={dotRef} className="cursor-dot" />
      </>
   );
};

export default Cursor;
