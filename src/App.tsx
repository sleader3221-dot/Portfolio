import Field from "./components/Field";
import Preloader from "./components/Preloader";
import Header from "./components/Header";
import Rail from "./components/Rail";
import Cursor from "./components/Cursor";
import Choreography from "./components/Choreography";
import Hero from "./sections/Hero";
import Subject from "./sections/Subject";
import Method from "./sections/Method";
import Marquee from "./components/Marquee";
import Evidence from "./sections/Evidence";
import Toolkit from "./sections/Toolkit";
import Record from "./sections/Record";
import Contact from "./sections/Contact";

export default function App() {
  return (
    <>
      <a className="skip-link" href="#subject">
        Skip to content
      </a>
      <Field />
      <div className="atmosphere" aria-hidden="true" />
      <Preloader />
      <Header />
      <Rail />
      <main id="main">
        <Hero />
        <Subject />
        <Method />
        <Marquee />
        <Evidence />
        <Toolkit />
        <Record />
        <Contact />
      </main>
      <Cursor />
      <div className="grain" aria-hidden="true" />
      <Choreography />
    </>
  );
}
