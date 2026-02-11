"use client";

import { Button } from "@repo/ui";
import { LandingNav } from "@/components/LandingNav";
import { LandingHero } from "@/components/LandingHero";
import { LandingSection, FeatureCard } from "@/components/LandingSection";
import { LandingFooter } from "@/components/LandingFooter";
import type { LandingPageProps } from "./index";

export function LandingPage({
  locale = "nl",
  ...props
}: LandingPageProps): React.JSX.Element {
  return (
    <div {...props}>
      <LandingNav />

      <LandingHero backgroundImage="/img/hero_bg.jpg" />

      <main className="bg-ds-surface">
        <LandingSection id="introduction" variant="callout">
          <h2 className="mb-6 text-4xl font-semibold text-ds-on-surface-strong md:text-5xl">
            The Real You biedt jou een makkelijke en veilige manier.
          </h2>
          <p className="text-xl leading-relaxed text-ds-on-surface md:text-2xl">
            Dat het bijhouden van een eetdagboek moeilijk kan zijn, weten wij. Maar
            het is belangrijk dat je je meer bewust wordt van wat je eet. Je krijgt
            inzicht in je gedachten en gedragingen met betrekking tot eten en zo kun
            je verstandigere keuzes maken voor jezelf. Daarom wordt er aan mensen met
            een eetprobleem vaak gevraagd een eetdagboek bij te houden. De theorie is
            simpel en je doel is helder.{" "}
            <strong>The Real You app</strong> wil jou helpen met de uitvoering.
          </p>
        </LandingSection>

        <LandingSection id="features" maxWidth="full">
          <div className="grid gap-12 md:grid-cols-2">
            <div className="space-y-10">
              <article>
                <h5 className="mb-3 text-2xl font-semibold text-ds-on-surface-strong">
                  (Eet)momenten
                </h5>
                <p className="text-lg leading-relaxed text-ds-on-surface">
                  Misschien vind je het bijhouden van een eetdagboek erg
                  confronterend. De app is bedoeld je ontbijt, lunch, avondeten en
                  tussendoortjes te registreren, maar je kunt ook gewoon even een
                  'momentje' bijhouden met alleen je gevoelens en gedachten.
                </p>
              </article>

              <article>
                <h5 className="mb-3 text-2xl font-semibold text-ds-on-surface-strong">
                  Zonder triggers
                </h5>
                <p className="text-lg leading-relaxed text-ds-on-surface">
                  Anders dan de meeste apps waarmee je je voeding kunt bijhouden,
                  worden er in <strong>The Real You app</strong> geen calorieen
                  bijgehouden. Zo kun je zonder regels of oordeel je eten bijhouden.
                </p>
              </article>

              <article>
                <h5 className="mb-3 text-2xl font-semibold text-ds-on-surface-strong">
                  Gevoelens
                </h5>
                <p className="text-lg leading-relaxed text-ds-on-surface">
                  Simpel een paar emoticons aanvinken, kun je aanvullen met het
                  opschrijven van wat er op dat moment door je heen ging.
                </p>
              </article>

              <article>
                <h5 className="mb-3 text-2xl font-semibold text-ds-on-surface-strong">
                  Gedragingen
                </h5>
                <p className="text-lg leading-relaxed text-ds-on-surface">
                  Heb je je maaltijd overgeslagen? Of was het een vreetbui. Heb je
                  expres te weinig gegeten.
                </p>
              </article>

              <article>
                <h5 className="mb-3 text-2xl font-semibold text-ds-on-surface-strong">
                  Export
                </h5>
                <p className="text-lg leading-relaxed text-ds-on-surface">
                  Je kunt makkelijk via de export een datum bereik selecteren en
                  exporteren in een overzichtelijk PDF bestand. Zo kun je er makkelijk
                  met je zorgverlener over praten.
                </p>
              </article>

              <article>
                <h5 className="mb-3 text-2xl font-semibold text-ds-on-surface-strong">
                  Bewaarde momenten
                </h5>
                <p className="text-lg leading-relaxed text-ds-on-surface">
                  Met een vinkje kun je momenten bewaren voor later. Misschien is er
                  een moment dat je specifiek wilt bespreken. In het overzicht of in de
                  export functie kun je deze makkelijk op bewaarde momenten filteren.
                </p>
              </article>
            </div>

            <figure className="flex items-center justify-center sticky top-24 self-start">
              <div className="relative w-full max-w-sm">
                <img
                  src="/img/phone_mockup.png"
                  alt="App preview"
                  className="h-auto w-full drop-shadow-2xl"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <img
                    src="/img/slide_moment.png"
                    alt="App screen"
                    className="h-[85%] w-auto"
                  />
                </div>
              </div>
            </figure>
          </div>
        </LandingSection>

        <LandingSection id="cta" variant="callout">
          <h2 className="mb-6 text-4xl font-semibold text-ds-on-surface-strong md:text-5xl">
            Je kunt gelijk beginnen
          </h2>
          <p className="mb-8 text-xl leading-relaxed text-ds-on-surface md:text-2xl">
            <strong>The Real You app</strong> is als website altijd beschikbaar. Je
            hoeft niets te downloaden. Voor een echt 'app' gevoel, kun je hem
            eenvoudig toevoegen aan je homescreen op je smartphone of tablet. Ga naar
            The Real You App en je kunt gelijk aan de slag.
          </p>
          <Button
            className="bg-ds-primary px-10 py-4 text-xl font-semibold text-ds-on-primary hover:bg-ds-primary-hover"
            onClick={() => (window.location.href = "/auth/login")}
          >
            The Real You App
          </Button>
        </LandingSection>

        <LandingSection id="focus" maxWidth="full">
          <div className="grid gap-12 md:grid-cols-3">
            <FeatureCard
              icon="/img/003-like.svg"
              title="Eenvoudig"
              description="Een overzicht, een invoerformulier en een exportfunctie. Geen verplichte velden. Geen ellenlange vragenlijst en vinkjes. Gewoon het minimale wat nodig is en dan een beetje wat wenselijk."
            />
            <FeatureCard
              icon="/img/002-tablet.svg"
              title="Toegankelijk"
              description="Vanaf het web bereikbaar. Ook zonder inlog, maar zeker ook mét, gewoon met je google of facebook account. Met een account kun je vanaf al je devices bij je eetdagboek."
            />
            <FeatureCard
              icon="/img/001-shield.svg"
              title="Veilig"
              description="Jouw gegevens zijn volledig anoniem. Het is niet mogelijk vanuit de database jouw account te herleiden naar je facebook of google profiel. Tevens worden alle gegevens die je invoert op de server encrypt. Jij bent de enige die bij jouw privacy gevoelige data kan."
            />
          </div>
        </LandingSection>

        <LandingSection id="feedback" variant="muted">
          <h2 className="mb-6 text-4xl font-semibold text-ds-on-surface-strong md:text-5xl">
            Onze Focus
          </h2>
          <p className="mb-8 text-xl leading-relaxed text-ds-on-surface md:text-2xl">
            Deze app blijft volop in ontwikkeling. Wij zijn zelf ervaringsdeskundige en
            hebben nog wensen. En omdat wij graag samenwerken met hulpverleners die ons
            precies kunnen vertellen wat ze nodig hebben van The Real You om jouw
            behandeling goed te kunnen ondersteunen. We willen ook van onze gebruikers
            graag horen wat jullie ervaring is met de app.
          </p>
          <Button
            variant="secondary"
            className="px-10 py-4 text-xl font-semibold"
            onClick={() => (window.location.href = "/feedback")}
          >
            Laat jouw feedback achter
          </Button>
        </LandingSection>

        <LandingSection id="future" maxWidth="full">
          <h2 className="mb-12 text-center text-4xl font-semibold text-ds-on-surface-strong md:text-5xl">
            Binnenkort verwacht....
          </h2>
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
            <article>
              <h3 className="mb-3 text-2xl font-semibold text-ds-on-surface-strong">
                Offline beschikbaar
              </h3>
              <p className="text-lg leading-relaxed text-ds-on-surface">
                Als je een wifi zone uitloopt en nog niet hebt opgeslagen? De laatste
                dagen van de maand en je data bundel is op? Wij werken aan het offline
                beschikbaar maken van de app.
              </p>
            </article>

            <article>
              <h3 className="mb-3 text-2xl font-semibold text-ds-on-surface-strong">
                Persoonlijke Inzichten
              </h3>
              <p className="text-lg leading-relaxed text-ds-on-surface">
                Je zult gaandeweg wellicht wat mantra's hebben die je helpen. Deze
                kunnen opslaan in de app en dan regelmatig voorbij zien komen, maakt de
                app straks nog persoonlijker.
              </p>
            </article>

            <article>
              <h3 className="mb-3 text-2xl font-semibold text-ds-on-surface-strong">
                Motivatie en Tips
              </h3>
              <p className="text-lg leading-relaxed text-ds-on-surface">
                Iedereen heeft lastige momenten of een kleine terugval. Wij willen je
                tips en/of meditatietool een handvat geven als je even vast zit.
              </p>
            </article>

            <article>
              <h3 className="mb-3 text-2xl font-semibold text-ds-on-surface-strong">
                Koppeling met Zorgverlener
              </h3>
              <p className="text-lg leading-relaxed text-ds-on-surface">
                Een online portal waar een zorgverlener of buddy kan inloggen en meteen
                kan meekijken, berichten achterlaten om zo directer contact te hebben en
                makkelijker te kunnen bijsturen.
              </p>
            </article>
          </div>
        </LandingSection>
      </main>

      <LandingFooter />
    </div>
  );
}
