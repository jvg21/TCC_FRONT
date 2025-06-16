// src/config/company/CompanyFormFixed.tsx
import { useState, useEffect } from 'react';
import { useCompanyStore } from '../../store/companyStore';
import { Company } from '../../types/company';
import { useLanguage } from '../../hooks/useLanguage';
import { FormInput } from '../../components/forms/FormField';
import { Modal } from '../../components/forms/Modal';
import { InputMasks, Validators } from '../../components/utils/inputMasks';

interface CompanyFormProps {
  company?: Company;
  isOpen: boolean;
  onClose: () => void;
}

export const CompanyForm = ({ company, isOpen, onClose }: CompanyFormProps) => {
  const { t } = useLanguage();
  const { addCompany, updateCompany } = useCompanyStore();
  const isEditing = !!company;

  const [formData, setFormData] = useState({
    name: '',
    taxId: '',
    email: '',
    phone: '',
    adress: '',
    zipCode: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (company) {
      setFormData({
        name: company.name || '',
        taxId: company.taxId || '',
        email: company.email || '',
        phone: company.phone || '',
        adress: company.adress || '',
        zipCode: company.zipCode || '',
      });
    } else {
      // Reset form for new company
      setFormData({
        name: '',
        taxId: '',
        email: '',
        phone: '',
        adress: '',
        zipCode: ''
      });
    }
    setErrors({});
  }, [company, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    let processedValue = value;

    // Aplica máscaras específicas para campos que precisam
    switch (name) {
      case 'taxId':
        processedValue = InputMasks.cnpj(value);
        break;
      case 'phone':
        processedValue = InputMasks.phone(value);
        break;
      case 'zipCode':
        processedValue = InputMasks.zipCode(value);
        break;
      default:
        processedValue = value;
    }

    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));
    
    // Clear error when field is edited
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
        
      case 'taxId':
        if (!Validators.required(value)) {
          return t('taxIdRequired');
        }
        if (!Validators.cnpj(value)) {
          return t('invalidTaxId');
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
        
      case 'phone':
        if (!Validators.required(value)) {
          return t('phoneRequired');
        }
        if (!Validators.phone(value)) {
          return t('invalidPhone') || 'Formato de telefone inválido';
        }
        break;
        
      case 'adress':
        if (!Validators.required(value)) {
          return t('adressRequired');
        }
        if (!Validators.maxLength(value, 255)) {
          return t('adressMaxLength') || 'Endereço deve ter no máximo 255 caracteres';
        }
        break;
        
      case 'zipCode':
        if (!Validators.required(value)) {
          return t('zipCodeRequired');
        }
        if (!Validators.zipCode(value)) {
          return t('invalidZipCode');
        }
        break;
        
      default:
        break;
    }
    return '';
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Validate all fields
    Object.keys(formData).forEach(fieldName => {
      const value = formData[fieldName as keyof typeof formData];
      const error = validateField(fieldName, value);
      if (error) {
        newErrors[fieldName] = error;
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Clean form data before sending to API (remove masks)
  const cleanFormData = () => {
    return {
      ...formData,
      taxId: InputMasks.cleanNumeric(formData.taxId),
      phone: InputMasks.cleanNumeric(formData.phone),
      zipCode: InputMasks.cleanNumeric(formData.zipCode)
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const cleanedData = cleanFormData();
      
      if (isEditing && company) {
        await updateCompany(company.companyId, cleanedData);
      } else {
        await addCompany(cleanedData);
      }
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
      taxId: '',
      email: '',
      phone: '',
      adress: '',
      zipCode: ''
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen} 
      onClose={handleCancel} 
      title={isEditing ? t('editCompany') : t('addCompany')}
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} noValidate>
        <div className="space-y-6">
          {/* Nome da Empresa */}
          <FormInput
            id="name"
            name="name"
            label={t('name')}
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            required
            placeholder="Ex: Empresa LTDA"
          />

          {/* CNPJ com máscara */}
          <FormInput
            id="taxId"
            name="taxId"
            label={t('taxId')}
            value={formData.taxId}
            onChange={handleChange}
            error={errors.taxId}
            required
            placeholder="00.000.000/0000-00"
            helpText="Formato: 00.000.000/0000-00"
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
            placeholder="empresa@exemplo.com"
          />

          {/* Telefone com máscara */}
          <FormInput
            id="phone"
            name="phone"
            label={t('phone')}
            value={formData.phone}
            onChange={handleChange}
            error={errors.phone}
            required
            placeholder="00 00000-0000"
            helpText="Formato: 00 00000-0000"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Endereço */}
            <FormInput
              id="adress"
              name="adress"
              label={t('adress')}
              value={formData.adress}
              onChange={handleChange}
              error={errors.adress}
              required
              placeholder="Rua, número, bairro"
            />

            {/* CEP com máscara */}
            <FormInput
              id="zipCode"
              name="zipCode"
              label={t('zipCode')}
              value={formData.zipCode}
              onChange={handleChange}
              error={errors.zipCode}
              required
              placeholder="00000-000"
              helpText="Formato: 00000-000"
            />
          </div>
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