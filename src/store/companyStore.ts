import { create } from 'zustand';
import { Company, CompanyState } from '../types/company';
import { getCookie } from '../utils/cookies';
import { getNotificationStore } from './notificationStore';

export const useCompanyStore = create<CompanyState>((set, get) => ({
  companies: [],
  loading: false,
  error: null,

  fetchCompanies: async () => {
    set({ loading: true, error: null });
    const token = getCookie('authToken');

    try {
      const response = await fetch('https://localhost:7198/Company/GetListCompanies', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.erro) {
        // API indica erro
        throw new Error(data.mensagem || 'Failed to fetch companies');
      }

      set({ companies: data.objeto, loading: false });

    } catch (error) {
      let errorMessage = 'Failed to fetch companies';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      set({ error: errorMessage, loading: false });
      getNotificationStore().showError(errorMessage);
    }
  },

  getCompany: (id: number) => {
    return get().companies.find(company => company.companyId === id);
  },

  addCompany: async (companyData: Omit<Company, 'companyId' | 'isActive' | 'createdAt' | 'updatedAt'>) => {
    set({ loading: true, error: null });
    const token = getCookie('authToken');

    try {
      const newCompany = {
        ...companyData,
        isActive: true, // valor padrão para novas empresas
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const response = await fetch('https://localhost:7198/Company/AddCompany', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...newCompany })
      });

      const data = await response.json();

      if (data.erro) {
        throw new Error(data.mensagem || 'Failed to add company');
      }

      // Atualiza o estado com a nova empresa
      set(state => ({
        companies: [...state.companies, data.objeto],
        loading: false
      }));

      getNotificationStore().showNotification(data.mensagem, 'success');

      return data.objeto;

    } catch (error) {
      let errorMessage = 'Failed to add company';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      set({ error: errorMessage, loading: false });
      getNotificationStore().showError(errorMessage);
      throw error; // propagar o erro para o chamador
    }
  },

  updateCompany: async (id: number, companyData: Partial<Company>) => {
    set({ loading: true, error: null });
    const token = getCookie('authToken');
    try {
      const updateCompany = {
        ...companyData,
        companyId: id,
        updatedAt: new Date()
      };
      const response = await fetch('https://localhost:7198/Company/UpdateCompany', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...updateCompany })
      });

      const data = await response.json();

      if (data.erro) {
        throw new Error(data.mensagem || 'Failed to update company');
      }
      set(state => ({
        companies: state.companies.map(company =>
          company.companyId === id ? { ...company, ...companyData } : company
        ),
        loading: false
      }));
      getNotificationStore().showNotification(data.mensagem, 'success');


    } catch (error) {
      let errorMessage = 'Failed to update company';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      set({ error: errorMessage, loading: false });
      getNotificationStore().showError(errorMessage);
      throw error; // propagar o erro para o chamador
    }
  },

  deleteCompany: async (id: number) => {
    set({ loading: true, error: null });
    const token = getCookie('authToken');
    try {
      const response = await fetch(`https://localhost:7198/Company/ToggleStatusCompany/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      const data = await response.json();

      if (data.erro) {
        throw new Error(data.mensagem || 'Failed to update company');
      } 
      set(state => ({
        companies: state.companies.map(company =>
          company.companyId === id ? { ...company,isActive:!company.isActive} : company
        ),
        loading: false
      }));
      getNotificationStore().showNotification(data.mensagem, 'success');

    } catch (error) {
      let errorMessage = 'Failed to update company';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      set({ error: errorMessage, loading: false });
      getNotificationStore().showError(errorMessage);
      throw error;
    }
  }
}));