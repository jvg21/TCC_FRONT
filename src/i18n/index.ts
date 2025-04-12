import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
    
      login: 'Login',
      register: 'Register',
      forgotPassword: 'Forgot Password',
      email: 'Email',
      password: 'Password',
      submit: 'Submit',
      
     
      name: 'Name',
      dashboard: 'Dashboard',
      welcome: 'Welcome',
      logout: 'Logout',
      darkMode: 'Dark Mode',
      language: 'Language',
      settings: 'Settings',
      options: 'Options',
      
      
      employeeManagement: 'Employee Management',
      addEmployee: 'Add Employee',
      editEmployee: 'Edit Employee',
      deleteEmployee: 'Delete Employee',
      searchEmployees: 'Search employees...',
      confirmDelete: 'Are you sure you want to delete this employee?',
      cancel: 'Cancel',
      save: 'Save',
      department: 'Department',
      position: 'Position',
      hireDate: 'Hire Date',
      actions: 'Actions',
      selectDepartment: 'Select department',
      sectorManagement: 'Sector Management'
    },
  },
  pt: {
    translation: {
      
      login: 'Entrar',
      register: 'Cadastrar',
      forgotPassword: 'Esqueceu a Senha',
      email: 'Email',
      password: 'Senha',
      submit: 'Enviar',
      
      
      name: 'Nome',
      dashboard: 'Painel',
      welcome: 'Bem-vindo',
      logout: 'Sair',
      darkMode: 'Modo Escuro',
      language: 'Idioma',
      settings: 'Configurações',
      options: 'Opções',
      
      
      employeeManagement: 'Gestão de Funcionários',
      addEmployee: 'Adicionar Funcionário',
      editEmployee: 'Editar Funcionário',
      deleteEmployee: 'Excluir Funcionário',
      searchEmployees: 'Buscar funcionários...',
      confirmDelete: 'Tem certeza que deseja excluir este funcionário?',
      cancel: 'Cancelar',
      save: 'Salvar',
      department: 'Departamento',
      position: 'Cargo',
      hireDate: 'Data de Contratação',
      actions: 'Ações',
      selectDepartment: 'Selecione o departamento',

      sectorManagement: 'Gerenciamento de setores'
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('i18nextLng') || 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;