import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useCompanyStore } from '../store/companyStore';
import { Company } from '../types/company';
import { useLanguage } from '../hooks/useLanguage';

interface CompanyFormProps {
  company?: Company;
  isOpen: boolean;
  onClose: () => void;
}

export const CompanyForm = ({ company, isOpen, onClose }: CompanyFormProps) => {
  const { t } = useLanguage();
  const { addCompany, updateCompany,deleteCompany } = useCompanyStore();
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
    
    // Atualizar o formData com o novo valor
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Limpar erro quando o campo é editado
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
    } else if (!/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/.test(formData.taxId)) {
      newErrors.taxId = t('invalidTaxId');
    }
    
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
    } else if (!/^\d{5}-\d{3}$/.test(formData.zipCode)) {
      newErrors.zipCode = t('invalidZipCode');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Função para limpar os dados antes de enviar para a API
  const cleanFormData = () => {
    // Cria uma cópia do formData para não modificar o estado diretamente
    const cleanedData = { ...formData };
    
    // Remove pontuações do CNPJ/taxId: 00.000.000/0000-00 -> 00000000000000
    cleanedData.taxId = cleanedData.taxId.replace(/[^\d]/g, '');
    
    // Remove pontuações do telefone: (00) 00000-0000 -> 00000000000
    cleanedData.phone = cleanedData.phone.replace(/[^\d]/g, '');
    
    // Remove pontuações do CEP: 00000-000 -> 00000000
    cleanedData.zipCode = cleanedData.zipCode.replace(/[^\d]/g, '');
    
    return cleanedData;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }
    
    try {
      // Limpa os dados antes de enviar para a API
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
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-lg w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-medium text-gray-900 dark:text-white">
            {isEditing ? t('editCompany') : t('addCompany')}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            aria-label={t('close')}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('name')}*
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 border ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white`}
              />
              {errors.name && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="taxId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('taxId')}*
              </label>
              <input
                id="taxId"
                name="taxId"
                type="text"
                placeholder="00.000.000/0000-00"
                value={formData.taxId}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 border ${
                  errors.taxId ? 'border-red-500' : 'border-gray-300'
                } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white`}
              />
              {errors.taxId && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.taxId}</p>}
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {t('formatInfo')}: 00.000.000/0000-00
              </p>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('email')}*
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 border ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white`}
              />
              {errors.email && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('phone')}*
              </label>
              <input
                id="phone"
                name="phone"
                type="text"
                placeholder="(00) 00000-0000"
                value={formData.phone}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 border ${
                  errors.phone ? 'border-red-500' : 'border-gray-300'
                } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white`}
              />
              {errors.phone && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.phone}</p>}
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {t('formatInfo')}: (00) 00000-0000
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="adress" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('adress')}*
                </label>
                <input
                  id="adress"
                  name="adress"
                  type="text"
                  value={formData.adress}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 border ${
                    errors.adress ? 'border-red-500' : 'border-gray-300'
                  } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white`}
                />
                {errors.adress && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.adress}</p>}
              </div>

              <div>
                <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('zipCode')}*
                </label>
                <input
                  id="zipCode"
                  name="zipCode"
                  type="text"
                  placeholder="00000-000"
                  value={formData.zipCode}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 border ${
                    errors.zipCode ? 'border-red-500' : 'border-gray-300'
                  } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white`}
                />
                {errors.zipCode && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.zipCode}</p>}
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {t('formatInfo')}: 00000-000
                </p>
              </div>
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
      </div>
    </div>
  );
};