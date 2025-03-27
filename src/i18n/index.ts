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
      name: 'Name',
      submit: 'Submit',
      dashboard: 'Dashboard',
      welcome: 'Welcome',
      logout: 'Logout',
      darkMode: 'Dark Mode',
      language: 'Language',
    },
  },
  pt: {
    translation: {
      login: 'Entrar',
      register: 'Cadastrar',
      forgotPassword: 'Esqueceu a Senha',
      email: 'Email',
      password: 'Senha',
      name: 'Nome',
      submit: 'Enviar',
      dashboard: 'Painel',
      welcome: 'Bem-vindo',
      logout: 'Sair',
      darkMode: 'Modo Escuro',
      language: 'Idioma',
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;