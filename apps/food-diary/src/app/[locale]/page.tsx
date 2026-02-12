"use client";

import { PageHeader } from "@/components/PageHeader/PageHeader";
import { PageFooter } from "@/components/PageFooter/PageFooter";
import { useHomeAuthRedirect } from "@/hooks/useHomeAuthRedirect";
import { LandingPage } from "@/templates/LandingPage";

export default function HomePage(): React.JSX.Element {
  useHomeAuthRedirect();

  return (
    <>
      <PageHeader />
      <LandingPage />
      <PageFooter />
    </>
  );
}
