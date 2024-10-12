export interface Option {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
  withCount?: boolean;
}

export interface DataTableFilterField<T> {
  label: string;
  value: keyof T;
  placeholder?: string;
  options?: Option[];
}
