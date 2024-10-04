export interface SpecificAnalyticChart {
  month: boolean;
  amount: number;
  average: string;
}

export interface GeneralTopSupplier {
  ruc: string;
  business_name: string;
  total: number;
}

export interface GeneralExpenditureComposition {
  label: string;
  total: number;
}

export interface TypeprincipalSuppliers {
  ruc: string;
  business_name: string;
  total: number;
}

export interface GeneralAnalyticsByLabel {
  principalSuppliers: TypeprincipalSuppliers[];
  buyForMonth: {
    enero: number;
    febrero: number;
    marzo: number;
    abril: number;
    mayo: number;
    junio: number;
    julio: number;
    agosto: number;
    septiembre: number;
    octubre: number;
    noviembre: number;
    diciembre: number;
  };
}
