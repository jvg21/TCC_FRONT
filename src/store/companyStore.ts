import { create } from 'zustand';
import { Company, CompanyState } from '../types/company';

export const useCompanyStore = create<CompanyState>((set, get) => ({
  companies: [],
  loading: false,
  error: null,

  fetchCompanies: async () => {
    set({ loading: true, error: null });
    try {
      // Simulate API call
      const mockCompanies: Company[] = [
        {
          id: '1',
          name: 'Acme Corp',
          cnpj: '12.345.678/0001-90',
          email: 'contact@acme.com',
          phone: '(11) 99999-9999',
          address: '123 Main St, São Paulo, SP'
        },
        {
          id: '2',
          name: 'TechSolutions Inc',
          cnpj: '98.765.432/0001-10',
          email: 'info@techsolutions.com',
          phone: '(21) 88888-8888',
          address: '456 Innovation Ave, Rio de Janeiro, RJ'
        },
      ];
      
      setTimeout(() => {
        set({ companies: mockCompanies, loading: false });
      }, 500); // Simulate network delay
    } catch (error) {
      set({ error: 'Failed to fetch companies', loading: false });
    }
  },

  getCompany: (id: string) => {
    return get().companies.find(company => company.id === id);
  },

  addCompany: async (companyData: Omit<Company, 'id'>) => {
    set({ loading: true, error: null });
    try {
      // Simulate API call
      const newCompany: Company = {
        id: Date.now().toString(),
        ...companyData
      };
      
      setTimeout(() => {
        set(state => ({ 
          companies: [...state.companies, newCompany],
          loading: false 
        }));
      }, 500);
    } catch (error) {
      set({ error: 'Failed to add company', loading: false });
    }
  },

  updateCompany: async (id: string, companyData: Partial<Company>) => {
    set({ loading: true, error: null });
    try {
      // Simulate API call
      setTimeout(() => {
        set(state => ({
          companies: state.companies.map(company => 
            company.id === id ? { ...company, ...companyData } : company
          ),
          loading: false
        }));
      }, 500);
    } catch (error) {
      set({ error: 'Failed to update company', loading: false });
    }
  },

  deleteCompany: async (id: string) => {
    set({ loading: true, error: null });
    try {
      // Simulate API call
      setTimeout(() => {
        set(state => ({
          companies: state.companies.filter(company => company.id !== id),
          loading: false
        }));
      }, 500);
    } catch (error) {
      set({ error: 'Failed to delete company', loading: false });
    }
  }
}));