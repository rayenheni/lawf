import { LangProvider, useLang } from "./context";
import type { Lang } from "./content";
import { FloatingActions, Footer, Header } from "./components/chrome";
import { Hero } from "./sections/Hero";
import { About } from "./sections/About";
import { Career, Expertise, Method } from "./sections/Expertise";
import { Testimonies } from "./sections/Testimonies";
import { Contact } from "./sections/Contact";

/** Must be the first focusable element in the document. */
function SkipLink() {
  const { t } = useLang();
  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-100 focus:border focus:border-brass-500 focus:bg-navy-900 focus:px-5 focus:py-3 focus:text-label focus:uppercase focus:tracking-[0.16em] focus:text-white"
    >
      {t.a11y.skip}
    </a>
  );
}

function Page() {
  return (
    <div className="min-h-screen bg-white">
      <SkipLink />
      <Header />
      <main id="main">
        <Hero />
        <About />
        <Expertise />
        <Method />
        <Career />
        <Testimonies />
        <Contact />
      </main>
      <Footer />
      <FloatingActions />
    </div>
  );
}

export default function App({ initialLang }: { initialLang?: Lang }) {
  return (
    <LangProvider initialLang={initialLang}>
      <Page />
    </LangProvider>
  );
}
