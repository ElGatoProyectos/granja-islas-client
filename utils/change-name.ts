type TranslationDict = {
  [key: string]: string;
};

const translationDict: TranslationDict = {
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
type TranslationFunction = (key: string) => string;

export function transformData(
  dataArray: Array<{ [key: string]: any }>,
  translateFn: TranslationFunction
): Array<{ [key: string]: any }> {
  return dataArray.map((item) => {
    const translatedItem: { [key: string]: any } = {};

    // Filtrar y traducir solo las claves que tienen una traducción
    for (const key in item) {
      const translatedKey = translateFn(key);
      if (translatedKey !== key) {
        // Solo añade si hay una traducción
        translatedItem[translatedKey] = item[key];
      }
    }

    return translatedItem;
  });
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

const productsView: TranslationDict = {
  title: "Producto",
  code: "Número",
  issue_date: "Emisión",
  ruc: "RUC",
  business_name: "Proveedor",
  amount: "Cantidad",
  unit_measure: "Medida",
  price: "Precio unitario",
  igv: "IGV",
  total: "Importe Total",
};

export function productsViewTable(key: string) {
  return productsView[key] || key;
}

const receiptTranslationView: TranslationDict = {
  code: "Número",
  ruc: "RUC",
  business_name: "Proveedor",
  issue_date: "Fecha",
  currency_code: "Moneda",
  amount_base: "Monto",
  igv: "IGV",
  total: "Importe Total",
  bill_status_payment: "Tipo de comprobante",
  bill_status: "Estado",
  amount_paid: "Pagado",
  amount_pending: "Pendiente",
};

export function receiptViewTable(key: string) {
  return receiptTranslationView[key] || key;
}

const listTranslationView: TranslationDict = {
  label: "Etiqueta de producto",
  lastPurchaseDate: "Ultima compra",
  currencyCode: "Moneda",
  lastPrice: "Ultimo precio",
  averagePrice: "Precio promedio",
  lowestPrice: "Precio mas bajo",
  higher_price: "Precio mas alto",
  business_name: "Proveedor",
  business_status: "Estado",
};

export function listViewTable(key: string) {
  return listTranslationView[key] || key;
}

const documentsLabelTranslationView: TranslationDict = {
  issue_date: "Fecha de emisión",
  code: "Número",
  ruc: "RUC",
  business_name: "Proveedor",
  currency_code: "Moneda",
  price: "Precio unitario",
};

export function documentsLabelViewTable(key: string) {
  return documentsLabelTranslationView[key] || key;
}

/* products of supplier */

const productsOfSupplierView: TranslationDict = {
  title: "Producto",
  labels: "Etiquetas",
  code: "Número",
  issue_date: "Emisión",
  amount: "Cantidad",
  unit_measure: "Medida",
  price: "Precio unitario",
  igv: "IGV",
  total: "Importe Total",
};

export function productsOfSupplierViewTable(key: string) {
  return productsOfSupplierView[key] || key;
}
