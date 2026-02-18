import type { Meta, StoryObj } from "@storybook/react";

interface ColorToken {
  className: string;
  label: string;
  textClassName: string;
  token: string;
}

interface ScaleToken {
  className: string;
  label: string;
  token: string;
}

interface TypographyToken {
  className: string;
  label: string;
  token: string;
}

const colorTokens: ColorToken[] = [
  {
    className: "bg-ds-surface",
    label: "Surface",
    textClassName: "text-ds-on-surface",
    token: "--color-ds-surface",
  },
  {
    className: "bg-ds-surface-soft",
    label: "Surface Soft",
    textClassName: "text-ds-on-surface-soft",
    token: "--color-ds-surface-soft",
  },
  {
    className: "bg-ds-surface-strong",
    label: "Surface Strong",
    textClassName: "text-ds-on-surface-strong",
    token: "--color-ds-surface-strong",
  },
  {
    className: "bg-ds-brand-primary",
    label: "Brand Primary",
    textClassName: "text-ds-on-primary",
    token: "--color-ds-brand-primary",
  },
  {
    className: "bg-ds-brand-primary-strong",
    label: "Brand Primary Strong",
    textClassName: "text-ds-on-surface-strong",
    token: "--color-ds-brand-primary-strong",
  },
  {
    className: "bg-ds-success",
    label: "Success",
    textClassName: "text-ds-on-success",
    token: "--color-ds-success",
  },
  {
    className: "bg-ds-warning",
    label: "Warning",
    textClassName: "text-ds-on-surface",
    token: "--color-ds-warning",
  },
  {
    className: "bg-ds-danger",
    label: "Danger",
    textClassName: "text-ds-on-primary",
    token: "--color-ds-danger",
  },
];

const spacingTokens: ScaleToken[] = [
  { className: "w-ds-xxs", label: "XXS", token: "--spacing-ds-xxs" },
  { className: "w-ds-xs", label: "XS", token: "--spacing-ds-xs" },
  { className: "w-ds-s", label: "S", token: "--spacing-ds-s" },
  { className: "w-ds-m", label: "M", token: "--spacing-ds-m" },
  { className: "w-ds-l", label: "L", token: "--spacing-ds-l" },
  { className: "w-ds-xl", label: "XL", token: "--spacing-ds-xl" },
  { className: "w-ds-xxl", label: "XXL", token: "--spacing-ds-xxl" },
  { className: "w-ds-3xl", label: "3XL", token: "--spacing-ds-3xl" },
];

const radiusTokens: ScaleToken[] = [
  { className: "rounded-ds-none", label: "None", token: "--radius-ds-none" },
  { className: "rounded-ds-sm", label: "SM", token: "--radius-ds-sm" },
  { className: "rounded-ds-md", label: "MD", token: "--radius-ds-md" },
  { className: "rounded-ds-lg", label: "LG", token: "--radius-ds-lg" },
  { className: "rounded-ds-xl", label: "XL", token: "--radius-ds-xl" },
  { className: "rounded-ds-2xl", label: "2XL", token: "--radius-ds-2xl" },
];

const shadowTokens: ScaleToken[] = [
  { className: "shadow-ds-none", label: "None", token: "--shadow-ds-none" },
  { className: "shadow-ds-sm", label: "SM", token: "--shadow-ds-sm" },
  { className: "shadow-ds-md", label: "MD", token: "--shadow-ds-md" },
  { className: "shadow-ds-lg", label: "LG", token: "--shadow-ds-lg" },
  { className: "shadow-ds-xl", label: "XL", token: "--shadow-ds-xl" },
];

const typographyTokens: TypographyToken[] = [
  {
    className: "font-ds-body-sm text-ds-on-surface-secondary",
    label: "Body Small",
    token: ".font-ds-body-sm",
  },
  {
    className: "font-ds-body-base text-ds-on-surface",
    label: "Body Base",
    token: ".font-ds-body-base",
  },
  {
    className: "font-ds-heading-sm text-ds-on-surface",
    label: "Heading Small",
    token: ".font-ds-heading-sm",
  },
  {
    className: "font-ds-heading-base text-ds-on-surface",
    label: "Heading Base",
    token: ".font-ds-heading-base",
  },
  {
    className: "font-ds-script-base text-ds-on-surface",
    label: "Script Base",
    token: ".font-ds-script-base",
  },
];

function SemanticTokenShowcase() {
  return (
    <div className="min-h-screen bg-ds-surface-soft p-ds-xxl text-ds-on-surface">
      <div className="mx-auto grid w-full max-w-5xl gap-ds-l">
        <section className="rounded-ds-xl border border-ds-border bg-ds-surface p-ds-l shadow-ds-sm">
          <h2 className="font-ds-heading-xxs text-ds-on-surface">
            Semantic Colors
          </h2>
          <p className="font-ds-body-sm text-ds-on-surface-secondary">
            Public color tokens mapped to utility classes.
          </p>
          <div className="mt-ds-s grid gap-ds-s md:grid-cols-2">
            {colorTokens.map((token) => (
              <div
                key={token.token}
                className="rounded-ds-lg border border-ds-border-subtle p-ds-s"
              >
                <div
                  className={`${token.className} ${token.textClassName} rounded-ds-md p-ds-m`}
                >
                  <p className="font-ds-label-base">{token.label}</p>
                </div>
                <p className="mt-ds-xs font-ds-body-sm text-ds-on-surface-secondary">
                  <code>{token.token}</code>
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-ds-xl border border-ds-border bg-ds-surface p-ds-l shadow-ds-sm">
          <h2 className="font-ds-heading-xxs text-ds-on-surface">
            Spacing Scale
          </h2>
          <div className="mt-ds-s grid gap-ds-s">
            {spacingTokens.map((token) => (
              <div key={token.token} className="flex items-center gap-ds-s">
                <p className="w-ds-4xl font-ds-label-sm text-ds-on-surface-secondary">
                  {token.label}
                </p>
                <div className="w-full rounded-ds-full bg-ds-brand-primary-soft p-ds-xxs">
                  <div
                    className={`${token.className} h-ds-s rounded-ds-full bg-ds-brand-primary`}
                  />
                </div>
                <p className="w-ds-5xl font-ds-body-sm text-ds-on-surface-secondary">
                  <code>{token.token}</code>
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-ds-xl border border-ds-border bg-ds-surface p-ds-l shadow-ds-sm">
          <h2 className="font-ds-heading-xxs text-ds-on-surface">
            Radius and Shadow
          </h2>
          <div className="mt-ds-s grid gap-ds-l md:grid-cols-2">
            <div className="grid gap-ds-s">
              {radiusTokens.map((token) => (
                <div key={token.token} className="flex items-center gap-ds-s">
                  <div
                    className={`${token.className} h-ds-4xl w-ds-4xl border border-ds-border bg-ds-surface-subtle`}
                  />
                  <p className="font-ds-body-sm text-ds-on-surface-secondary">
                    <span className="font-ds-label-sm text-ds-on-surface">
                      {token.label}
                    </span>{" "}
                    <code>{token.token}</code>
                  </p>
                </div>
              ))}
            </div>

            <div className="grid gap-ds-s">
              {shadowTokens.map((token) => (
                <div key={token.token} className="flex items-center gap-ds-s">
                  <div
                    className={`${token.className} h-ds-4xl w-ds-4xl rounded-ds-lg border border-ds-border bg-ds-surface`}
                  />
                  <p className="font-ds-body-sm text-ds-on-surface-secondary">
                    <span className="font-ds-label-sm text-ds-on-surface">
                      {token.label}
                    </span>{" "}
                    <code>{token.token}</code>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-ds-xl border border-ds-border bg-ds-surface p-ds-l shadow-ds-sm">
          <h2 className="font-ds-heading-xxs text-ds-on-surface">Typography</h2>
          <div className="mt-ds-s grid gap-ds-s">
            {typographyTokens.map((token) => (
              <div key={token.token} className="rounded-ds-md bg-ds-surface-muted p-ds-s">
                <p className={token.className}>
                  Mindful eating starts with noticing how you feel.
                </p>
                <p className="mt-ds-xxs font-ds-body-sm text-ds-on-surface-secondary">
                  <code>{token.token}</code>
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

const meta = {
  title: "Foundations/Semantic Tokens",
  tags: ["autodocs", "a11y"],
  parameters: {
    layout: "fullscreen",
  },
  render: () => <SemanticTokenShowcase />,
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Overview: Story = {};
