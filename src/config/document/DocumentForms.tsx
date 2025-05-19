// src/config/document/DocumentForms.tsx - Versão atualizada
import { useState, useEffect } from 'react';
import { useDocumentStore } from '../../store/documentStore';
import { Document } from '../../types/document';
import { useLanguage } from '../../hooks/useLanguage';
import { useAuthStore } from '../../store/authStore';
import { FormInput, FormSelect, FormTextarea } from '../../components/forms/FormField';
import { Modal } from '../../components/forms/Modal';
import { FullScreenModal } from '../../components/forms/FullScreenModal';
import { Save, X } from 'lucide-react';

interface DocumentFormProps {
  document?: Document;
  isOpen: boolean;
  onClose: () => void;
  isEmbedded?: boolean;
  isFullScreen?: boolean;
}

export const DocumentForm = ({ 
  document, 
  isOpen, 
  onClose, 
  isEmbedded = false,
  isFullScreen = false
}: DocumentFormProps) => {
  const { t } = useLanguage();
  const { user } = useAuthStore();
  const { addDocument, updateDocument, folders, fetchFolders } = useDocumentStore();
  const isEditing = !!document;

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    format: 'html', // Formato padrão
    folderId: '1', // Pasta padrão
    userId: user?.userId || 0
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Carregar pastas ao montar o componente
  useEffect(() => {
    fetchFolders();
  }, [fetchFolders]);

  // Carregar dados do documento ao editar
  useEffect(() => {
    if (document) {
      setFormData({
        title: document.title || '',
        content: document.content || '',
        format: document.format || 'html',
        folderId: document.folderId.toString(),
        userId: document.userId
      });
    }
  }, [document]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    // Atualiza os dados do formulário
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Limpa erros quando o campo é editado
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = t('titleRequired');
    }
    
    if (!formData.content.trim()) {
      newErrors.content = t('contentRequired');
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
      const documentData = {
        ...formData,
        folderId: parseInt(formData.folderId),
        userId: formData.userId
      };
      
      if (isEditing && document) {
        await updateDocument(document.documentId, documentData);
      } else {
        await addDocument(documentData);
      }
      
      onClose();
    } catch (error) {
      console.error('Form submission failed:', error);
    }
  };

  // Formatar as opções de pasta para o formulário
  const folderOptions = folders.map(folder => ({
    value: folder.folderId.toString(),
    label: folder.name
  }));

  // Opções de formato de documento
  const formatOptions = [
    { value: 'html', label: 'HTML' },
    { value: 'md', label: 'Markdown' },
    { value: 'txt', label: t('plainText') },
    { value: 'doc', label: 'Word Document' },
    { value: 'pdf', label: 'PDF' }
  ];

  // Conteúdo do formulário
  const formContent = (
    <form onSubmit={handleSubmit} className={isFullScreen ? 'h-full flex flex-col' : ''}>
      <div className={`space-y-4 ${isFullScreen ? 'flex-1 overflow-auto p-6' : ''}`}>
        <FormInput
          id="title"
          name="title"
          label={t('title')}
          value={formData.title}
          onChange={handleChange}
          error={errors.title}
          required
        />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormSelect
            id="format"
            name="format"
            label={t('format')}
            value={formData.format}
            onChange={handleChange}
            options={formatOptions}
            error={errors.format}
          />
          
          <FormSelect
            id="folderId"
            name="folderId"
            label={t('folder')}
            value={formData.folderId}
            onChange={handleChange}
            options={folderOptions}
            error={errors.folderId}
            required
          />
        </div>
        
        <FormTextarea
          id="content"
          name="content"
          label={t('content')}
          value={formData.content}
          onChange={handleChange}
          error={errors.content}
          required
          rows={isFullScreen ? 20 : 10}
          placeholder={t('enterDocumentContent')}
          className={isFullScreen ? 'flex-1' : ''}
        />
      </div>
      
      <div className={`${isFullScreen ? 'p-4 border-t border-gray-200 dark:border-gray-700' : 'mt-6'} flex justify-end space-x-3`}>
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 dark:text-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center"
        >
          <X className="h-4 w-4 mr-2" />
          {t('cancel')}
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
        >
          <Save className="h-4 w-4 mr-2" />
          {isEditing ? t('update') : t('save')}
        </button>
      </div>
    </form>
  );

  // Para formulários embutidos (no DocumentWorkspace), renderizamos sem o Modal
  if (isEmbedded) {
    return (
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-white dark:bg-gray-800 p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {isEditing ? t('editDocument') : t('addDocument')}
          </h2>
        </div>
        
        <div className="flex-1 overflow-auto p-4">
          {formContent}
        </div>
      </div>
    );
  }

  // Se o modo de tela cheia estiver ativado, usamos o FullScreenModal
  if (isFullScreen) {
    return (
      <FullScreenModal
        isOpen={isOpen}
        onClose={onClose}
        title={isEditing ? t('editDocument') : t('addDocument')}
      >
        {formContent}
      </FullScreenModal>
    );
  }

  // Caso contrário, usamos o Modal normal
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? t('editDocument') : t('addDocument')}
      maxWidth="lg"
    >
      {formContent}
    </Modal>
  );
};