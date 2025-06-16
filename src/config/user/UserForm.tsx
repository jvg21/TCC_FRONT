// src/config/user/EnhancedUserForm.tsx
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { User } from '../../types/user';
import { FormInput, FormSelect } from '../../components/forms/FormField';
import { Modal } from '../../components/forms/Modal';
import { Validators } from '../../components/utils/inputMasks';

interface EnhancedUserFormProps {
  user?: User;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (userData: Omit<User, 'userId' | 'isActive' | 'createdAt' | 'updatedAt'>) => Promise<void>;
}

export const UserForm: React.FC<EnhancedUserFormProps> = ({ 
  user, 
  isOpen, 
  onClose, 
  onSubmit 
}) => {
  const { t } = useTranslation();
  const isEditing = !!user;

  // Perfis disponíveis
  const profiles = [
    { value: '2', label: t('manager') || 'Gerente' },
    { value: '3', label: t('employee') || 'Funcionário' }
  ];

  // Idiomas disponíveis
  const languages = [
    { value: '1', label: 'Português' },
    { value: '2', label: 'English' }
  ];

  // Temas disponíveis
  const themes = [
    { value: '1', label: t('lightMode') || 'Modo Claro' },
    { value: '2', label: t('darkMode') || 'Modo Escuro' }
  ];

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    profile: '3', // Default to employee
    preferredLanguage: '1',
    preferredTheme: '1',
    companyId: 0
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        password: '', // Always empty for security
        profile: user.profile.toString() || '3',
        preferredLanguage: user.preferredLanguage.toString() || '1',
        preferredTheme: user.preferredTheme.toString() || '1',
        companyId: user.companyId
      });
    } else {
      // Reset form for new user
      setFormData({
        name: '',
        email: '',
        password: '',
        profile: '3',
        preferredLanguage: '1',
        preferredTheme: '1',
        companyId: 0
      });
    }
    setErrors({});
  }, [user, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateField = (fieldName: string, value: string): string => {
    switch (fieldName) {
      case 'name':
        if (!Validators.required(value)) {
          return t('nameRequired');
        }
        if (!Validators.maxLength(value, 100)) {
          return t('nameMaxLength') || 'Nome deve ter no máximo 100 caracteres';
        }
        break;
        
      case 'email':
        if (!Validators.required(value)) {
          return t('emailRequired');
        }
        if (!Validators.email(value)) {
          return t('invalidEmail');
        }
        break;
        
      case 'password':
        if (!isEditing && !Validators.required(value)) {
          return t('passwordRequired') || 'Senha é obrigatória';
        }
        if (value && !Validators.minLength(value, 6)) {
          return t('passwordMinLength') || 'Senha deve ter pelo menos 6 caracteres';
        }
        break;
        
      default:
        break;
    }
    return '';
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Validate key fields
    ['name', 'email', 'password'].forEach(fieldName => {
      const value = formData[fieldName as keyof typeof formData];
      const error = validateField(fieldName, value);
      if (error) {
        newErrors[fieldName] = error;
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Converter campos para números apropriados
      const userData = {
        ...formData,
        profile: parseInt(formData.profile, 10),
        preferredLanguage: parseInt(formData.preferredLanguage, 10),
        preferredTheme: parseInt(formData.preferredTheme, 10),
        companyId: formData.companyId
      };
      
      await onSubmit(userData);
      onClose();
    } catch (error) {
      console.error('Form submission failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      profile: '3',
      preferredLanguage: '1',
      preferredTheme: '1',
      companyId: 0
    });
    setErrors({});
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
      title={isEditing ? t('editUser') || 'Editar Usuário' : t('addUser') || 'Adicionar Usuário'}
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} noValidate>
        <div className="space-y-6">
          {/* Nome */}
          <FormInput
            id="name"
            name="name"
            label={t('name')}
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            required
            placeholder="Nome completo do usuário"
            helpText="Nome será exibido no sistema"
          />

          {/* Email */}
          <FormInput
            id="email"
            name="email"
            label={t('email')}
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            required
            placeholder="usuario@empresa.com"
            helpText="Email será usado para login"
          />

          {/* Senha */}
          <FormInput
            id="password"
            name="password"
            label={t('password')}
            type="password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            required={!isEditing}
            placeholder={isEditing ? "Deixe em branco para manter a senha atual" : "Mínimo 6 caracteres"}
            helpText={isEditing ? "Deixe em branco para não alterar" : "Mínimo 6 caracteres"}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Perfil */}
            <FormSelect
              id="profile"
              name="profile"
              label={t('profile') || 'Perfil'}
              value={formData.profile}
              onChange={handleChange}
              options={profiles}
              required
              helpText="Nível de acesso do usuário"
            />

            {/* Idioma Preferido */}
            <FormSelect
              id="preferredLanguage"
              name="preferredLanguage"
              label={t('preferredLanguage') || 'Idioma'}
              value={formData.preferredLanguage}
              onChange={handleChange}
              options={languages}
              helpText="Idioma da interface"
            />
          </div>

          {/* Tema Preferido */}
          <FormSelect
            id="preferredTheme"
            name="preferredTheme"
            label={t('preferredTheme') || 'Tema'}
            value={formData.preferredTheme}
            onChange={handleChange}
            options={themes}
            helpText="Aparência da interface"
          />
        </div>

        <div className="mt-8 flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4">
          <button
            type="button"
            onClick={handleCancel}
            disabled={isSubmitting}
            className="w-full sm:w-auto px-6 py-2 border border-gray-300 text-gray-700 dark:text-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {t('cancel')}
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {t('saving') || 'Salvando...'}
              </>
            ) : (
              isEditing ? t('update') : t('create')
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};