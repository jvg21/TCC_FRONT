// src/i18n/index.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Carrega idioma do localStorage
const savedLanguage = localStorage.getItem('i18nextLng');

const resources = {
  en: {
    translation: {
      // Authentication
      login: 'Login',
      register: 'Register',
      forgotPassword: 'Forgot Password',
      email: 'Email',
      password: 'Password',
      submit: 'Submit',
      loading: 'Loading...',
      
      // General UI
      name: 'Name',
      dashboard: 'Dashboard',
      welcome: 'Welcome',
      logout: 'Logout',
      darkMode: 'Dark Mode',
      language: 'Language',
      changeLanguage: 'Change Language',
      settings: 'Settings',
      options: 'Options',
      close: 'Close',
      
      // Employee Management
      employeeManagement: 'Employee Management',
      addEmployee: 'Add Employee',
      editEmployee: 'Edit Employee',
      deleteEmployee: 'Delete Employee',
      searchEmployees: 'Search employees...',
      confirmDelete: 'Are you sure you want to delete this?',
      cancel: 'Cancel',
      save: 'Save',
      department: 'Department',
      position: 'Position',
      hireDate: 'Hire Date',
      actions: 'Actions',
      selectDepartment: 'Select department',
      sectorManagement: 'Sector Management',
      
      // Company Management
      companies: 'Companies',
      addCompany: 'Add Company',
      editCompany: 'Edit Company',
      searchCompanies: 'Search companies...',
      taxId: 'Tax ID',  // CNPJ
      phone: 'Phone',
      adress: 'Address',  // Mantendo a grafia do contrato (adress em vez de address)
      zipCode: 'ZIP Code',
      isActive: 'Active',
      createdAt: 'Created At',
      updatedAt: 'Updated At',
      status: 'Status',
      active: 'Active',
      inactive: 'Inactive',
      contact: 'Contact',
      noCompaniesFound: 'No companies found matching your search',
      noCompaniesYet: 'No companies added yet',
      delete: 'Delete',
      update: 'Update',
      create: 'Create',
      
      // Validation
      nameRequired: 'Name is required',
      taxIdRequired: 'Tax ID is required',
      invalidTaxId: 'Invalid Tax ID format',
      emailRequired: 'Email is required',
      invalidEmail: 'Invalid email format',
      phoneRequired: 'Phone is required',
      adressRequired: 'Address is required',
      zipCodeRequired: 'ZIP Code is required',
      invalidZipCode: 'Invalid ZIP Code format',
      
      // Sector Management
      selectedEmployees: 'Selected Employees',
      searchSectors: 'Search sectors...',
      addSector: 'Add Sector',
      editSector: 'Edit Sector',
      deleteSector: 'Delete Sector',
      description: 'Description',
      employees: 'Employees',
      noEmployeesSelected: 'No employees selected',
      
      // Confirmation dialogs
      deleteCompanyConfirmation: 'Are you sure you want to delete this company?',
      
      // Theme preferences
      darkModeEnabled: 'Dark mode is enabled',
      darkModeDisabled: 'Dark mode is disabled',
      toggleTheme: 'Toggle theme'
    },
  },
  pt: {
    translation: {
      // Authentication
      login: 'Entrar',
      register: 'Cadastrar',
      forgotPassword: 'Esqueceu a Senha',
      email: 'Email',
      password: 'Senha',
      submit: 'Enviar',
      loading: 'Carregando...',
      
      // General UI
      name: 'Nome',
      dashboard: 'Painel',
      welcome: 'Bem-vindo',
      logout: 'Sair',
      darkMode: 'Modo Escuro',
      language: 'Idioma',
      changeLanguage: 'Mudar Idioma',
      settings: 'Configurações',
      options: 'Opções',
      close: 'Fechar',
      
      // Employee Management
      employeeManagement: 'Gestão de Funcionários',
      addEmployee: 'Adicionar Funcionário',
      editEmployee: 'Editar Funcionário',
      deleteEmployee: 'Excluir Funcionário',
      searchEmployees: 'Buscar funcionários...',
      confirmDelete: 'Tem certeza que deseja excluir este item?',
      cancel: 'Cancelar',
      save: 'Salvar',
      department: 'Departamento',
      position: 'Cargo',
      hireDate: 'Data de Contratação',
      actions: 'Ações',
      selectDepartment: 'Selecione o departamento',
      sectorManagement: 'Gerenciamento de Setores',
      
      // Company Management
      companies: 'Empresas',
      addCompany: 'Adicionar Empresa',
      editCompany: 'Editar Empresa',
      searchCompanies: 'Buscar empresas...',
      taxId: 'CNPJ',
      phone: 'Telefone',
      adress: 'Endereço',
      zipCode: 'CEP',
      isActive: 'Ativo',
      createdAt: 'Criado Em',
      updatedAt: 'Atualizado Em',
      status: 'Status',
      active: 'Ativo',
      inactive: 'Inativo',
      contact: 'Contato',
      noCompaniesFound: 'Nenhuma empresa encontrada correspondente à sua busca',
      noCompaniesYet: 'Nenhuma empresa adicionada ainda',
      delete: 'Excluir',
      update: 'Atualizar',
      create: 'Criar',
      
      // Validation
      nameRequired: 'Nome é obrigatório',
      taxIdRequired: 'CNPJ é obrigatório',
      invalidTaxId: 'Formato de CNPJ inválido',
      emailRequired: 'Email é obrigatório',
      invalidEmail: 'Formato de email inválido',
      phoneRequired: 'Telefone é obrigatório',
      adressRequired: 'Endereço é obrigatório',
      zipCodeRequired: 'CEP é obrigatório',
      invalidZipCode: 'Formato de CEP inválido',
      
      // Sector Management
      selectedEmployees: 'Funcionários Selecionados',
      searchSectors: 'Buscar setores...',
      addSector: 'Adicionar Setor',
      editSector: 'Editar Setor',
      deleteSector: 'Excluir Setor',
      description: 'Descrição',
      employees: 'Funcionários',
      noEmployeesSelected: 'Nenhum funcionário selecionado',
      
      // Confirmation dialogs
      deleteCompanyConfirmation: 'Tem certeza que deseja excluir esta empresa?',
      
      // Theme preferences
      darkModeEnabled: 'Modo escuro está ativado',
      darkModeDisabled: 'Modo escuro está desativado',
      toggleTheme: 'Alternar tema'
    },
  },
};

// Inicializa i18next
i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLanguage || 'en', // Use saved language or default to English
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    // Enable debug in development mode
    debug: process.env.NODE_ENV === 'development',
  });

// Adiciona um listener para salvar a linguagem no localStorage quando mudar
i18n.on('languageChanged', (lng) => {
  localStorage.setItem('i18nextLng', lng);
});

export default i18n;