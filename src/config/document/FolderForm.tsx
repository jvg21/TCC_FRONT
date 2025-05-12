// src/config/document/FolderForm.tsx
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Folder } from '../../types/document';
import { useDocumentStore } from '../../store/documentStore';
import { useAuthStore } from '../../store/authStore';
import { FormInput, FormSelect } from '../../components/forms/FormField';
import { Modal } from '../../components/forms/Modal';

interface FolderFormProps {
  folder?: Folder;
  isOpen: boolean;
  onClose: () => void;
}

export const FolderForm = ({ folder, isOpen, onClose }: FolderFormProps) => {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const { addFolder, folders } = useDocumentStore();
  const isEditing = !!folder;

  const [formData, setFormData] = useState({
    name: folder?.name || '',
    parentFolderId: folder?.parentFolderId ? folder.parentFolderId.toString() : '',
    userId: user?.userId || 0
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
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
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }
    
    try {
      const folderData = {
        ...formData,
        parentFolderId: formData.parentFolderId ? parseInt(formData.parentFolderId) : undefined,
        userId: formData.userId
      };
      
      await addFolder(folderData);
      onClose();
    } catch (error) {
      console.error('Form submission failed:', error);
    }
  };

  // Preparar opções de pastas pai (somente pastas ativas)
  const parentFolderOptions = [
    { value: '', label: t('noParentFolder') }
  ].concat(
    folders
      .filter(f => f.isActive && (!folder || f.folderId !== folder.folderId)) // Remover a pasta atual para evitar loops
      .map(f => ({
        value: f.folderId.toString(),
        label: f.name
      }))
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? t('editFolder') : t('addFolder')}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <FormInput
            id="name"
            name="name"
            label={t('folderName')}
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            required
          />
          
          <FormSelect
            id="parentFolderId"
            name="parentFolderId"
            label={t('parentFolder')}
            value={formData.parentFolderId}
            onChange={handleChange}
            options={parentFolderOptions}
            error={errors.parentFolderId}
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