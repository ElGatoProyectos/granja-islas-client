export function formatNumberWithCommas(value: any) {
  return `S/.${value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
}

export function formatWithCommas(value: string | number) {
  return `${value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
}
