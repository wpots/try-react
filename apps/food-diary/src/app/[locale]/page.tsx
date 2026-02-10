import { HomeAuthRedirect } from "@/components/HomeAuthRedirect";
import { HomeSplash } from "@/components/HomeSplash";

export default function HomePage(): React.JSX.Element {
  return (
    <section>
      <HomeAuthRedirect />
      <HomeSplash />
    </section>
  );
}
