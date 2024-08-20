export function formatNumberWithCommas(value: any) {
  return `S/.${value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
}

export function formatWithCommas(value: string | number) {
  if (typeof value === "string") {
    value = Number(value).toFixed(2);
  }
  if (typeof value === "number") {
    value = value.toFixed(2);
  }
  return `${value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
}
