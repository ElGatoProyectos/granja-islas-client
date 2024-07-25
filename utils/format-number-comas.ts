export function formatNumberWithCommas(value: any) {
  return `S/.${value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
}
