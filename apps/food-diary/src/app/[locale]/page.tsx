"use client";

import { useHomeAuthRedirect } from "@/hooks/useHomeAuthRedirect";
import { LandingPage } from "@/components/LandingPage";

export default function HomePage(): React.JSX.Element {
  useHomeAuthRedirect();

  return <LandingPage />;
}
