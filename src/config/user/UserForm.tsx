import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { User } from '../../types/user';
import { FormInput, FormSelect } from '../../components/forms/FormField';
import { Modal } from '../../components/forms/Modal';

interface UserFormProps {
  user?: User;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (userData: Omit<User, 'userId' | 'isActive' | 'createdAt' | 'updatedAt'>) => Promise<void>;
}

export const UserForm: React.FC<UserFormProps> = ({ 
  user, 
  isOpen, 
  onClose, 
  onSubmit 
}) => {
  const { t } = useTranslation();
  const isEditing = !!user;

  // Perfis disponíveis
  const profiles = [
    { value: '2', label: t('manager') || 'Manager' },
    { value: '3', label: t('employee') || 'Employee' }
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

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        password: user.password || '',
        profile: user.profile.toString() || '3',
        preferredLanguage: user.preferredLanguage.toString() || '1',
        preferredTheme: user.preferredTheme.toString() || '1',
        companyId: user.companyId
      });
    }
  }, [user]);

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

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = t('nameRequired');
    }
    
    if (!formData.email.trim()) {
      newErrors.email = t('emailRequired');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('invalidEmail');
    }
    
    if (!isEditing && !formData.password.trim()) {
      newErrors.password = t('passwordRequired');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }
    
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
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? t('editEmployee') : t('addEmployee')}
    >
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <FormInput
            id="name"
            name="name"
            label={t('name')}
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            required
          />
          
          <FormInput
            id="email"
            name="email"
            label={t('email')}
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            required
          />
          
          {!isEditing && (
            <FormInput
              id="password"
              name="password"
              label={t('password')}
              type="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              required
            />
          )}
          
          <FormSelect
            id="profile"
            name="profile"
            label={t('profile')}
            value={formData.profile}
            onChange={handleChange}
            options={profiles}
            error={errors.profile}
            required
          />
          
          {/* Preferências de idioma e tema */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormSelect
              id="preferredLanguage"
              name="preferredLanguage"
              label={t('preferredLanguage')}
              value={formData.preferredLanguage}
              onChange={handleChange}
              options={[
                { value: '1', label: t('english') || 'English' },
                { value: '2', label: t('portuguese') || 'Portuguese' }
              ]}
              error={errors.preferredLanguage}
            />
            
            <FormSelect
              id="preferredTheme"
              name="preferredTheme"
              label={t('preferredTheme')}
              value={formData.preferredTheme}
              onChange={handleChange}
              options={[
                { value: '1', label: t('light') || 'Light' },
                { value: '2', label: t('dark') || 'Dark' }
              ]}
              error={errors.preferredTheme}
            />
          </div>
        </div>
        
        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 dark:text-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            {t('cancel')}
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {isEditing ? t('update') : t('save')}
          </button>
        </div>
      </form>
    </Modal>
  );
};