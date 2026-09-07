import "./styles/About.css";

const About = () => {
   return (
      <div className="about-section" id="about">
         <div className="about-me">
            <h3 className="title">About Me</h3>
            <p className="para">
               I'm <strong>Karthik M Achalakar</strong> — a Software, AI/ML &amp; DFIR Engineer
               based in Bengaluru, India. I build evidence-driven intelligent systems: from
               autonomous forensic triage agents to award-winning fintech products, all engineered
               for trust, clarity and measurable results.
            </p>
            <p className="para" style={{ marginTop: "1rem" }}>
               Currently pursuing B.E. in Electrical &amp; Electronics Engineering at Ramaiah
               Institute of Technology (CGPA 8.45/10, 2024–2028). I've competed in 52 hackathons,
               shipped 12 published projects, and earned placements including 3rd at SANS "Find Evil"
               and 2nd Overall at HackMars 3.0.
            </p>
            <p className="para" style={{ marginTop: "1rem" }}>
               Open to internships in Software Engineering, AI/ML and Cybersecurity / DFIR.
            </p>
         </div>
      </div>
   );
};

export default About;
