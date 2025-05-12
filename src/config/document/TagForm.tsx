// src/config/document/TagForm.tsx
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Tag } from '../../types/document';
import { useDocumentStore } from '../../store/documentStore';
import { FormInput } from '../../components/forms/FormField';
import { Modal } from '../../components/forms/Modal';

interface TagFormProps {
  tag?: Tag;
  isOpen: boolean;
  onClose: () => void;
}

export const TagForm = ({ tag, isOpen, onClose }: TagFormProps) => {
  const { t } = useTranslation();
  const { addTag } = useDocumentStore();
  const isEditing = !!tag;

  const [formData, setFormData] = useState({
    name: tag?.name || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
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
      newErrors.name = t('tagNameRequired');
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
      await addTag(formData);
      onClose();
    } catch (error) {
      console.error('Form submission failed:', error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? t('editTag') : t('addTag')}
      maxWidth="sm"
    >
      <form onSubmit={handleSubmit}>
        <div>
          <FormInput
            id="name"
            name="name"
            label={t('tagName')}
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
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