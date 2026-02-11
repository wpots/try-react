import { HomeAuthRedirect } from "@/components/HomeAuthRedirect";
import { LandingPage } from "@/components/LandingPage";

export default function HomePage(): React.JSX.Element {
  return (
    <>
      <HomeAuthRedirect />
      <LandingPage />
    </>
  );
}
