"use client";

import { useState, useEffect } from "react";
import { Link } from "@/i18n/navigation";
import classnames from "@/utils/classnames/classnames";
import type { LandingNavProps } from "./index";

export function LandingNav({
  appName = "The Real You",
  className,
  ...props
}: LandingNavProps): React.JSX.Element {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 10);
    }

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <Link
        href="#home"
        className={classnames(
          "fixed left-6 top-6 z-50",
          "flex items-center gap-3",
          "text-ds-on-surface-strong no-underline",
          "transition-all duration-300",
          isScrolled ? "scale-90" : "scale-100",
          className
        )}
      >
        <img
          src="/img/pebblesblue.png"
          alt={appName}
          className="h-12 w-12"
        />
        <h1 className="m-0 text-3xl font-normal" style={{ fontFamily: "var(--font-display)" }}>
          T<span className="text-base">he</span> r<span className="text-base">eal</span> y
          <span className="text-base">ou</span>
        </h1>
      </Link>

      <nav
        className={classnames(
          "fixed right-0 top-0 z-40",
          "flex items-center gap-6 px-8 py-6",
          "transition-colors duration-300",
          isScrolled ? "bg-ds-surface/95 shadow-ds-md backdrop-blur-sm" : "",
          className
        )}
        {...props}
      >
        <Link
          href="#introduction"
          className="hidden text-base font-medium text-ds-on-surface-strong no-underline transition-colors hover:text-ds-primary md:block"
        >
          meer informatie
        </Link>
        <Link
          href="#cta"
          className="text-base font-medium text-ds-on-surface-strong no-underline transition-colors hover:text-ds-primary"
        >
          aan de slag
        </Link>
        <Link
          href="#feedback"
          className="hidden text-base font-medium text-ds-on-surface-strong no-underline transition-colors hover:text-ds-primary md:block"
        >
          feedback
        </Link>
      </nav>
    </>
  );
}
