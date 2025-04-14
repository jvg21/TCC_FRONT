// src/components/forms/UserForm.tsx
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { User } from '../../types/user';
import { Modal } from './Modal';
import { FormInput } from './FormField';

interface UserFormProps {
  user?: User;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (userData: Omit<User, 'id'>) => Promise<void>;
}

export const UserForm: React.FC<UserFormProps> = ({ 
  user, 
  isOpen, 
  onClose, 
  onSubmit 
}) => {
  const { t } = useTranslation();
  const isEditing = !!user;

  // Departamentos disponíveis
  const departments = ['IT', 'HR', 'Finance', 'Marketing', 'Sales'];

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    position: '',
    hireDate: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        department: user.department || '',
        position: user.position || '',
        hireDate: user.hireDate || ''
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
    
    if (!formData.department.trim()) {
      newErrors.department = t('departmentRequired');
    }
    
    if (!formData.position.trim()) {
      newErrors.position = t('positionRequired');
    }
    
    if (!formData.hireDate.trim()) {
      newErrors.hireDate = t('hireDateRequired');
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
      await onSubmit(formData);
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
          
          <FormSelect
            id="department"
            name="department"
            label={t('department')}
            value={formData.department}
            onChange={handleChange}
            options={departments.map(dept => ({ value: dept, label: dept }))}
            placeholder={t('selectDepartment')}
            error={errors.department}
            required
          />
          
          <FormInput
            id="position"
            name="position"
            label={t('position')}
            value={formData.position}
            onChange={handleChange}
            error={errors.position}
            required
          />
          
          <FormInput
            id="hireDate"
            name="hireDate"
            label={t('hireDate')}
            type="date"
            value={formData.hireDate}
            onChange={handleChange}
            error={errors.hireDate}
            required
          />
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