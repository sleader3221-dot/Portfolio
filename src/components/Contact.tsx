import { MdArrowOutward, MdCopyright } from "react-icons/md";
import "./styles/Contact.css";

const Contact = () => {
   return (
      <div className="contact-section section-container" id="contact">
         <div className="contact-container">
            <h3>Contact</h3>
            <div className="contact-flex">
               <div className="contact-box">
                  <h4>Connect</h4>
                  <p>
                     <a
                        href="https://linkedin.com/in/karthik-ma"
                        target="_blank"
                        rel="noreferrer"
                        data-cursor="disable"
                     >
                        LinkedIn — karthik-ma
                     </a>
                  </p>
                  <p>
                     <a href="mailto:karthikma704@gmail.com" data-cursor="disable">
                        Email — karthikma704@gmail.com
                     </a>
                  </p>
                  <p>
                     <a href="tel:+919606168200" data-cursor="disable">
                        Phone — +91 96061 68200
                     </a>
                  </p>
                  <h4 style={{ marginTop: "1.5rem" }}>Location</h4>
                  <p>Bengaluru, India · Open to internships</p>
               </div>
               <div className="contact-box">
                  <h4>Social</h4>
                  <a
                     href="https://github.com/sleader3221-dot"
                     target="_blank"
                     rel="noreferrer"
                     data-cursor="disable"
                     className="contact-social"
                  >
                     GitHub <MdArrowOutward />
                  </a>
                  <a
                     href="https://linkedin.com/in/karthik-ma"
                     target="_blank"
                     rel="noreferrer"
                     data-cursor="disable"
                     className="contact-social"
                  >
                     LinkedIn <MdArrowOutward />
                  </a>
                  <a
                     href="https://devpost.com/karthikma321"
                     target="_blank"
                     rel="noreferrer"
                     data-cursor="disable"
                     className="contact-social"
                  >
                     Devpost <MdArrowOutward />
                  </a>
               </div>
            </div>
            <div className="contact-box contact-copyright">
               <h2>
                  Designed and Developed by <span>Karthik M Achalakar</span>
               </h2>
               <h5>
                  <MdCopyright /> 2026
               </h5>
            </div>
         </div>
      </div>
   );
};

export default Contact;
