type TranslationDict = {
  [key: string]: string;
};

const translationDict: TranslationDict = {
  id: "ID",
  ruc: "RUC",
  corporate_name: "Razón social",
  type: "Tipo",
  status: "Estado",
  fiscal_address: "Dirección fiscal",
  country_code: "Código de país",
  phone: "Teléfono",
};

export function translateString(key: string) {
  return translationDict[key] || key;
}
