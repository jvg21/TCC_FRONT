// src/config/document/DocumentForms.tsx - Corrigido
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
    format: 'md',
    folderId: '1',
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
        format: 'md',
        folderId: document.folderId.toString(),
        userId: document.userId
      });
    } else {
      setFormData({
        title: '',
        content: '# Novo Documento\n\nComece a escrever seu conteúdo aqui...',
        format: 'md',
        folderId: '1',
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
    
    if (!validate()) return;
    
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
      
      // Fechar modal fullscreen primeiro
      if (isFullScreenMode) {
        setIsFullScreenMode(false);
      }
      
      // Depois fechar modal principal
      onClose();
    } catch (error) {
      console.error('Form submission failed:', error);
    }
  };

  const folderOptions = folders.map(folder => ({
    value: folder.folderId.toString(),
    label: folder.name
  }));

  const toggleFullScreen = () => {
    setIsFullScreenMode(!isFullScreenMode);
  };

  const handleCloseFullScreen = () => {
    setIsFullScreenMode(false);
    // Não fechar o modal principal
  };

  const formContent = (
    <form onSubmit={handleSubmit} className="h-full flex flex-col">
      <div className="space-y-4 flex-1 flex flex-col">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            id="title"
            name="title"
            label={t('title')}
            value={formData.title}
            onChange={handleChange}
            error={errors.title}
            required
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

        {/* Editor Markdown */}
        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('content')}
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
          
          <MarkdownEditor
            value={formData.content}
            onChange={handleContentChange}
            height="flex-1"
            placeholder="Digite o conteúdo do documento em Markdown..."
            autoFocus={true}
            disableFullscreen={true} // Desabilitar fullscreen interno
          />
          
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
          {t('cancel')}
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
        >
          <Save className="h-4 w-4 mr-1" />
          {isEditing ? t('update') : t('create')}
        </button>
      </div>
    </form>
  );

  if (isFullScreenMode) {
    return (
      <FullScreenModal 
        isOpen={isOpen} 
        onClose={handleCloseFullScreen}
        title={isEditing ? t('editDocument') : t('addDocument')}
      >
        {formContent}
      </FullScreenModal>
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? t('editDocument') : t('addDocument')}
      maxWidth="6xl"
    >
      <div className="h-[80vh]">
        {formContent}
      </div>
    </Modal>
  );
};