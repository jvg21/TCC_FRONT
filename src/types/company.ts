export interface Company {
    id: string;
    name: string;
    cnpj: string;
    email: string;
    phone: string;
    address: string;
  }
  
  export interface CompanyState {
    companies: Company[];
    loading: boolean;
    error: string | null;
    fetchCompanies: () => Promise<void>;
    getCompany: (id: string) => Company | undefined;
    addCompany: (company: Omit<Company, 'id'>) => Promise<void>;
    updateCompany: (id: string, company: Partial<Company>) => Promise<void>;
    deleteCompany: (id: string) => Promise<void>;
  }