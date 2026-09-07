import "./styles/Career.css";

const Career = () => {
   return (
      <div className="career-section section-container">
         <div className="career-container">
            <h2>
               My Education <span>&</span>
               <br /> Journey
            </h2>

            <div className="career-info">
               <div className="career-timeline">
                  <div className="career-dot"></div>
               </div>
               <div className="career-info-box">
                  <div className="career-info-in">
                     <div className="career-role">
                        <h4>B.E. Electrical &amp; Electronics Engineering</h4>
                        <h5>Ramaiah Institute of Technology, Bengaluru</h5>
                     </div>
                     <h3>2024–2028</h3>
                  </div>
                  <p>
                     CGPA 8.45 / 10. Building intelligent systems at the intersection of
                     software engineering, AI/ML and digital forensics alongside my core curriculum.
                  </p>
               </div>
               <div className="career-info-box">
                  <div className="career-info-in">
                     <div className="career-role">
                        <h4>PCMC — Pre-University</h4>
                        <h5>Sri Siddaganga PU College, Davanagere</h5>
                     </div>
                     <h3>2024</h3>
                  </div>
                  <p>
                     561 / 600 · 93.50%. Physics, Chemistry, Mathematics &amp; Computer Science track.
                  </p>
               </div>
               <div className="career-info-box">
                  <div className="career-info-in">
                     <div className="career-role">
                        <h4>SSLC</h4>
                        <h5>National English Medium High School, Koppal</h5>
                     </div>
                     <h3>2022</h3>
                  </div>
                  <p>609 / 625 · 97.44%.</p>
               </div>
               <div className="career-info-box">
                  <div className="career-info-in">
                     <div className="career-role">
                        <h4>Certifications</h4>
                        <h5>Google · Cisco · L&amp;T EduTech</h5>
                     </div>
                     <h3>2024–2026</h3>
                  </div>
                  <p>
                     Google IT Support Professional Certificate (Coursera) · Python Essentials 1
                     (Cisco / OpenEDG) · Fundamentals of Digital Design for VLSI Chip Design
                     (L&amp;T EduTech / Coursera).
                  </p>
               </div>
            </div>
         </div>
      </div>
   );
};

export default Career;
