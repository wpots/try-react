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
          "fixed left-4 top-4 z-50",
          "flex items-center gap-2",
          "text-foreground-strong no-underline",
          "transition-transform duration-300",
          isScrolled ? "scale-75" : "scale-100",
          className
        )}
      >
        <img
          src="/img/icons/favicon-96x96.png"
          alt={appName}
          className="h-12 w-12"
        />
        <h1 className="m-0 font-display text-2xl font-normal">
          T<span className="text-sm">he</span> r<span className="text-sm">eal</span> y
          <span className="text-sm">ou</span>
        </h1>
      </Link>

      <nav
        className={classnames(
          "fixed right-0 top-0 z-40",
          "flex items-center gap-6 px-8 py-6",
          "transition-colors duration-300",
          isScrolled ? "bg-surface/95 shadow-md backdrop-blur-sm" : "",
          className
        )}
        {...props}
      >
        <Link
          href="#introduction"
          className="hidden text-foreground-strong no-underline hover:text-interactive md:block"
        >
          meer informatie
        </Link>
        <Link
          href="#cta"
          className="text-foreground-strong no-underline hover:text-interactive"
        >
          aan de slag
        </Link>
        <Link
          href="#feedback"
          className="hidden text-foreground-strong no-underline hover:text-interactive md:block"
        >
          feedback
        </Link>
      </nav>
    </>
  );
}
