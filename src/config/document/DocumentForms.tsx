// src/config/document/DocumentForm.tsx - Seguindo padrões do projeto
import { useState, useEffect } from 'react';
import { useDocumentStore } from '../../store/documentStore';
import { Document } from '../../types/document';
import { useLanguage } from '../../hooks/useLanguage';
import { useAuthStore } from '../../store/authStore';
import { FormInput, FormSelect } from '../../components/forms/FormField';
import { Modal } from '../../components/forms/Modal';
import { FullScreenModal } from '../../components/forms/FullScreenModal';
import { MarkdownEditor } from '../../components/editor/MarkdownEditor';
import { Save, X, Maximize2 } from 'lucide-react';

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
    folderId: '1', // Pasta padrão
    userId: user?.userId || 0
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isFullScreenMode, setIsFullScreenMode] = useState(isFullScreen);

  useEffect(() => {
    fetchFolders();
  }, [fetchFolders]);

  useEffect(() => {
    if (document) {
      setFormData({
        title: document.title || '',
        content: document.content || '',
        folderId: document.folderId.toString(),
        userId: document.userId
      });
    } else {
      setFormData({
        title: '',
        content: '# Novo Documento\n\nComece a escrever seu conteúdo aqui...',
        folderId: '1', // Pasta padrão
        userId: user?.userId || 0
      });
    }
  }, [document, user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleContentChange = (content: string) => {
    setFormData(prev => ({ ...prev, content }));
    
    if (errors.content) {
      setErrors(prev => ({ ...prev, content: '' }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = t('titleRequired') || 'Title is required';
    }
    
    if (!formData.content.trim()) {
      newErrors.content = t('contentRequired') || 'Content is required';
    }
    
    if (!formData.folderId) {
      newErrors.folderId = t('folderRequired') || 'Folder is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      if (isEditing && document) {
        await updateDocument(document.documentId, {
          title: formData.title,
          content: formData.content,
          folderId: parseInt(formData.folderId)
        });
      } else {
        await addDocument({
          title: formData.title,
          content: formData.content,
          folderId: parseInt(formData.folderId),
          userId: formData.userId
        });
      }
      
      if (isFullScreenMode) {
        handleCloseFullScreen();
      } else {
        onClose();
      }
    } catch (error) {
      console.error('Error saving document:', error);
    }
  };

  const toggleFullScreen = () => {
    setIsFullScreenMode(true);
  };

  const handleCloseFullScreen = () => {
    setIsFullScreenMode(false);
    onClose();
  };

  // Preparar opções de pastas
  const folderOptions = folders.map(folder => ({
    value: folder.folderId.toString(),
    label: folder.name
  }));

  const formContent = (
    <form onSubmit={handleSubmit} className={`flex flex-col ${isFullScreenMode ? 'h-full' : 'h-[80vh]'}`}>
      <div className="flex flex-col space-y-6 mb-6">
        {/* Título */}
        <div className="flex space-x-4">
          <div className="flex-1">
            <FormInput
              id="title"
              name="title"
              label={t('title') || 'Title'}
              value={formData.title}
              onChange={handleChange}
              error={errors.title}
              required
            />
          </div>

          {/* Pasta */}
          <div className="w-64">
            <FormSelect
              id="folderId"
              name="folderId"
              label={t('folder') || 'Folder'}
              value={formData.folderId}
              onChange={handleChange}
              options={folderOptions}
              error={errors.folderId}
              required
            />
          </div>
        </div>

        {/* Editor Markdown */}
        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('content') || 'Content'}
              {errors.content && <span className="text-red-500 ml-1">*</span>}
            </label>
            
            {!isFullScreenMode && (
              <button
                type="button"
                onClick={toggleFullScreen}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                title="Tela cheia"
              >
                <Maximize2 size={16} />
              </button>
            )}
          </div>
          
          <div className="flex-1">
            <MarkdownEditor
              value={formData.content}
              onChange={handleContentChange}
              height={isFullScreenMode ? "h-full" : "h-96"}
              placeholder="Digite o conteúdo do documento em Markdown..."
              autoFocus={true}
              disableFullscreen={true} // Desabilitar fullscreen interno
            />
          </div>
          
          {errors.content && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.content}</p>
          )}
        </div>
      </div>
      
      <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          type="button"
          onClick={isFullScreenMode ? handleCloseFullScreen : onClose}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 dark:text-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          <X className="h-4 w-4 mr-1 inline" />
          {t('cancel') || 'Cancel'}
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
        >
          <Save className="h-4 w-4 mr-1" />
          {isEditing ? (t('update') || 'Update') : (t('create') || 'Create')}
        </button>
      </div>
    </form>
  );

  if (isFullScreenMode) {
    return (
      <FullScreenModal 
        isOpen={isOpen} 
        onClose={handleCloseFullScreen}
        title={isEditing ? (t('editDocument') || 'Edit Document') : (t('addDocument') || 'Add Document')}
      >
        {formContent}
      </FullScreenModal>
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? (t('editDocument') || 'Edit Document') : (t('addDocument') || 'Add Document')}
      maxWidth="xl"
    >
      <div className="h-[80vh]">
        {formContent}
      </div>
    </Modal>
  );
};