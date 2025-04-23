// src/components/pages/ForgotPassword.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { KeyRound, ArrowLeft } from 'lucide-react';

import { getNotificationStore } from '../../store/notificationStore';

export const ForgotPassword = () => {
  const { t } = useTranslation();
  
  // Estados para diferentes etapas
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Estado para controlar a etapa atual do processo
  const [step, setStep] = useState(1); // 1: Email, 2: Token, 3: Nova senha
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Solicitação inicial de recuperação de senha
  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    try {
      const response = await fetch('https://localhost:7198/User/RequestPasswordRecovery', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      });
      
      const data = await response.json();
      
      if (data.erro) {
        throw new Error(data.mensagem || 'Erro ao solicitar recuperação de senha');
      }
      
      setStep(2);
      getNotificationStore().showNotification(t('tokenSentToEmail'), 'success');
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
        getNotificationStore().showError(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Validação do token
  const handleValidateToken = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    try {
      const response = await fetch('https://localhost:7198/User/ValidateTokenPasswordRecovery', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email,
          token 
        })
      });
      
      const data = await response.json();
      
      if (data.erro) {
        throw new Error(data.mensagem || 'Token inválido');
      }
      
      // Avançar para a definição da nova senha
      setStep(3);
      getNotificationStore().showNotification(t('tokenValidated'), 'success');
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
        getNotificationStore().showError(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (newPassword !== confirmPassword) {
      setError(t('passwordsDoNotMatch'));
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await fetch('https://localhost:7198/User/UpdatePasswordRecovery', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email,
          token,
          newPassword 
        })
      });
      
      const data = await response.json();
      
      if (data.erro) {
        throw new Error(data.mensagem || 'Erro ao atualizar senha');
      }
      
      getNotificationStore().showNotification(t('passwordUpdatedSuccessfully'), 'success');
      
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
        getNotificationStore().showError(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <form className="mt-8 space-y-6" onSubmit={handleRequestReset}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('email')}
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? t('sending') : t('sendResetToken')}
            </button>
          </form>
        );
      
      case 2:
        return (
          <form className="mt-8 space-y-6" onSubmit={handleValidateToken}>
            <div>
              <label htmlFor="token" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('enterToken')}
              </label>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                {t('tokenSentInstructions')}
              </p>
              <input
                id="token"
                type="text"
                required
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="123456"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-center text-lg tracking-widest"
                maxLength={6}
              />
            </div>

            <div className="flex justify-between space-x-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                {t('back')}
              </button>
              
              <button
                type="submit"
                disabled={isLoading || token.length !== 6}
                className="flex-1 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? t('validating') : t('validateToken')}
              </button>
            </div>
          </form>
        );
      
      case 3:
        return (
          <form className="mt-8 space-y-6" onSubmit={handleUpdatePassword}>
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('newPassword')}
              </label>
              <input
                id="newPassword"
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                minLength={6}
              />
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('confirmPassword')}
              </label>
              <input
                id="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                minLength={6}
              />
            </div>

            <div className="flex justify-between space-x-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                {t('back')}
              </button>
              
              <button
                type="submit"
                disabled={isLoading || newPassword.length < 6 || newPassword !== confirmPassword}
                className="flex-1 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? t('updating') : t('updatePassword')}
              </button>
            </div>
          </form>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <KeyRound className="mx-auto h-12 w-12 text-blue-500" />
          <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">{t('forgotPassword')}</h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {step === 1 && t('enterEmailInstructions')}
            {step === 2 && t('enterTokenInstructions')}
            {step === 3 && t('createNewPasswordInstructions')}
          </p>
        </div>
        
        {error && (
          <div className="rounded-md bg-red-50 dark:bg-red-900 p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800 dark:text-red-200">{error}</h3>
              </div>
            </div>
          </div>
        )}
        
        {renderStep()}
        
        <div className="text-center mt-4">
          <Link to="/login" className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400">
            {t('backToLogin')}
          </Link>
        </div>
      </div>
    </div>
  );
};