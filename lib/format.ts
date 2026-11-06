/** 'YYYY-MM-DD' → '2026. 10. 16.' (시간대 때문에 하루 밀리지 않도록 직접 자름) */
export function formatDate(value: string | null): string {
  if (!value) return "";
  const [y, m, d] = value.split("-");
  if (!y || !m || !d) return value;
  return `${y}. ${Number(m)}. ${Number(d)}.`;
}
