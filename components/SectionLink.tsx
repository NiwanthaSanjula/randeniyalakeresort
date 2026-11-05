"use client";

import { type ComponentPropsWithoutRef, type MouseEvent } from "react";
import { useLenis } from "lenis/react";

export default function SectionLink({ href, onClick, ...props }: ComponentPropsWithoutRef<"a">) {
  const lenis = useLenis();

  function navigate(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event);
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || !href?.startsWith("#")) return;
    const target = document.getElementById(href.slice(1));
    if (!target) return;

    event.preventDefault();
    const margin = Number.parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
    const top = Math.max(0, target.getBoundingClientRect().top + window.scrollY - margin);
    if (window.location.hash !== href) window.history.pushState(window.history.state, "", href);

    if (lenis) {
      // Cancel existing inertia and synchronize with native focus/scroll changes.
      lenis.scrollTo(window.scrollY, { immediate: true });
      lenis.scrollTo(top);
    } else {
      window.scrollTo({ top, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
    }
  }

  return <a {...props} href={href} onClick={navigate} />;
}
