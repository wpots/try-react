export default function classnames(
  ...args: Array<string | undefined | null | false>
): string {
  return args.filter(Boolean).join(" ");
}
