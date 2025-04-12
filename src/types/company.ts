export interface Company {
  companyId: number;
  name: string;
  taxId: string;
  email: string;
  phone: string;
  adress: string;
  zipCode: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CompanyState {
  companies: Company[];
  loading: boolean;
  error: string | null;
  fetchCompanies: () => Promise<void>;
  getCompany: (id: number) => Company | undefined;
  addCompany: (companyData: Omit<Company, 'companyId' | 'isActive' | 'createdAt' | 'updatedAt'>) => Promise<any>;
  updateCompany: (id: number, company: Partial<Company>) => Promise<void>;
  deleteCompany: (id: number) => Promise<void>;
}