// src/components/forms/CompanyForm.tsx (Refactored)
import { useState, useEffect } from 'react';
import { useCompanyStore } from '../../store/companyStore';
import { Company } from '../../types/company';
import { useLanguage } from '../../hooks/useLanguage';
import { FormInput } from '../../components/forms/FormField';
import { Modal } from '../../components/forms/Modal';

interface CompanyFormProps {
  company?: Company;
  isOpen: boolean;
  onClose: () => void;
}

export const CompanyForm = ({ company, isOpen, onClose }: CompanyFormProps) => {
  const { t } = useLanguage();
  const { addCompany, updateCompany, deleteCompany } = useCompanyStore();
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

  useEffect(() => {
    if (company) {
      setFormData({
        name: company.name,
        taxId: company.taxId,
        email: company.email,
        phone: company.phone,
        adress: company.adress,
        zipCode: company.zipCode,
      });
    }
  }, [company]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    // Update form data with new value
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = t('nameRequired');
    }
    
    if (!formData.taxId.trim()) {
      newErrors.taxId = t('taxIdRequired');
    } 
    // else if (!/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/.test(formData.taxId)) {
    //   newErrors.taxId = t('invalidTaxId');
    // }
    
    if (!formData.email.trim()) {
      newErrors.email = t('emailRequired');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('invalidEmail');
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = t('phoneRequired');
    }
    
    if (!formData.adress.trim()) {
      newErrors.adress = t('adressRequired');
    }
    
    if (!formData.zipCode.trim()) {
      newErrors.zipCode = t('zipCodeRequired');
    } 
    // else if (!/^\d{5}-\d{3}$/.test(formData.zipCode)) {
    //   newErrors.zipCode = t('invalidZipCode');
    // }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Clean form data before sending to API
  const cleanFormData = () => {
    const cleanedData = { ...formData };
    
    // Remove punctuation from taxId: 00.000.000/0000-00 -> 00000000000000
    cleanedData.taxId = cleanedData.taxId.replace(/[^\d]/g, '');
    
    // Remove punctuation from phone: (00) 00000-0000 -> 00000000000
    cleanedData.phone = cleanedData.phone.replace(/[^\d]/g, '');
    
    // Remove punctuation from zipCode: 00000-000 -> 00000000
    cleanedData.zipCode = cleanedData.zipCode.replace(/[^\d]/g, '');
    
    return cleanedData;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }
    
    try {
      // Clean data before sending to API
      const cleanedData = cleanFormData();
      
      if (isEditing && company) {
        await updateCompany(company.companyId, cleanedData);
      } else {
        await addCompany(cleanedData);
      }
      onClose();
    } catch (error) {
      console.error('Form submission failed:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen} 
      onClose={onClose} 
      title={isEditing ? t('editCompany') : t('addCompany')}
      maxWidth="lg"
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
            id="taxId"
            name="taxId"
            label={t('taxId')}
            value={formData.taxId}
            onChange={handleChange}
            error={errors.taxId}
            required
            placeholder="00.000.000/0000-00"
            helpText={`${t('formatInfo')}: 00.000.000/0000-00`}
          />

          <FormInput
            id="email"
            name="email"
            label={t('email')}
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            type="email"
            required
          />

          <FormInput
            id="phone"
            name="phone"
            label={t('phone')}
            value={formData.phone}
            onChange={handleChange}
            error={errors.phone}
            required
            placeholder="00 00 00000-0000"
            helpText={`${t('formatInfo')}: 00 00 00000-0000`}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              id="adress"
              name="adress"
              label={t('adress')}
              value={formData.adress}
              onChange={handleChange}
              error={errors.adress}
              required
            />

            <FormInput
              id="zipCode"
              name="zipCode"
              label={t('zipCode')}
              value={formData.zipCode}
              onChange={handleChange}
              error={errors.zipCode}
              required
              placeholder="00000-000"
              helpText={`${t('formatInfo')}: 00000-000`}
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          >
            {t('cancel')}
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {isEditing ? t('update') : t('create')}
          </button>
        </div>
      </form>
    </Modal>
  );
};