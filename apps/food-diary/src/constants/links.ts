export const HELP_URLS = {
  reportIssue: process.env.NEXT_PUBLIC_REPORT_ISSUE_URL ?? "https://github.com/wpots/try-react/issues",
  buyCoffee: process.env.NEXT_PUBLIC_BUY_COFFEE_URL ?? "https://buymeacoffee.com",
} as const;
