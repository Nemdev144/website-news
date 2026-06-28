"use client";

import { ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";

const SCROLL_THRESHOLD = 320;

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > SCROLL_THRESHOLD);
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <button
      type="button"
      aria-label="Scroll to top"
      onClick={scrollToTop}
      className={[
        "fixed bottom-6 right-6 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-brand-800 text-white shadow-lg transition-all duration-300 hover:bg-brand-900 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-800",
        visible
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none translate-y-3 opacity-0",
      ].join(" ")}
    >
      <ChevronUp className="h-5 w-5" strokeWidth={2.5} />
    </button>
  );
}
