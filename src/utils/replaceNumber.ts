export const e2p = (s: number) =>
  s.toString().replace(/\d/g, (d: string) => "۰۱۲۳۴۵۶۷۸۹"[d]);
