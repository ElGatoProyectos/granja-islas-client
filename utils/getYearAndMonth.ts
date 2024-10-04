export function getYearAndMonth({ dateString }: { dateString: string | Date }) {
  const date = new Date(dateString);
  const yearStarted = date.getUTCFullYear();
  const monthStarted = date.getUTCMonth() + 1;
  return { yearStarted, monthStarted };
}
