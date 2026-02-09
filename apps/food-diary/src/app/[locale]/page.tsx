import { aboutContent, translateAbout } from "@/lib/aboutContent";
import type { AppLocale } from "@/i18n/config";
import { HomeAuthRedirect } from "@/components/HomeAuthRedirect";

type HomePageProps = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({
  params,
}: HomePageProps): Promise<React.JSX.Element> {
  const { locale } = await params;
  const appLocale: AppLocale = locale === "en" ? "en" : "nl";

  return (
    <section className="grid gap-10 pb-24">
      <HomeAuthRedirect />
      {aboutContent.map((chapter) => {
        const title = translateAbout(chapter.title, appLocale);
        const intro = translateAbout(chapter.intro, appLocale);

        return (
          <article key={title} className="grid gap-4">
            <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
            {intro ? <p className="leading-7">{intro}</p> : null}
            {chapter.articles?.map((content) => {
              const heading = translateAbout(content.heading, appLocale);
              const body = translateAbout(content.body, appLocale);

              return (
                <p key={heading} className="leading-7">
                  <strong>{heading} </strong>
                  {body}
                </p>
              );
            })}
          </article>
        );
      })}
    </section>
  );
}
