type TranslationDict = {
  [key: string]: string;
};

const translationDict: TranslationDict = {
  id: "ID",
  ruc: "RUC",
  business_name: "Razón social",
  business_type: "Tipo",
  business_status: "Estado",
  business_direction: "Dirección fiscal",
  phone: "Teléfono",
  country_code: "Código de país",
};

export function translateString(key: string) {
  return translationDict[key] || key;
}

const usertranslationView: TranslationDict = {
  // id: "ID",
  name: "Nombres",
  last_name: "Apellidos",
  email: "Correo",
  role: "Rol",
  phone: "Teléfono",
};

export function userViewTable(key: string) {
  return usertranslationView[key] || key;
}
