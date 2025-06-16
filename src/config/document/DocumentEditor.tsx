// src/config/document/DocumentEditor.tsx - Editor como página separada
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDocumentStore } from '../../store/documentStore';
import { useAuthStore } from '../../store/authStore';
import { useLanguage } from '../../hooks/useLanguage';
import { FormInput, FormSelect } from '../../components/forms/FormField';
import { MarkdownEditor } from '../../components/editor/MarkdownEditor';
import { Save, X, FileText, ArrowLeft } from 'lucide-react';
import { SectionHeader } from '../../components/common/SectionHeader';
import { PageLayout } from '../../components/common/PageLayout';

export const DocumentEditor = () => {
  const { t } = useLanguage();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { 
    documents, 
    folders, 
    fetchDocuments, 
    fetchFolders, 
    addDocument, 
    updateDocument, 
    getDocument 
  } = useDocumentStore();

  const isEditing = id !== 'new';
  const document = isEditing ? getDocument(parseInt(id || '0')) : null;

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    folderId: '1', // Pasta padrão
    userId: user?.userId || 0
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchFolders();
    if (isEditing) {
      fetchDocuments();
    }
  }, [fetchFolders, fetchDocuments, isEditing]);

  useEffect(() => {
    if (document) {
      setFormData({
        title: document.title || '',
        content: document.content || '',
        folderId: document.folderId.toString(),
        userId: document.userId
      });
    } else if (!isEditing) {
      setFormData({
        title: '',
        content: '# Novo Documento\n\nComece a escrever seu conteúdo aqui...',
        folderId: '1', // Pasta padrão
        userId: user?.userId || 0
      });
    }
  }, [document, isEditing, user]);

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

    setIsSaving(true);

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
      
      navigate('/documents');
    } catch (error) {
      console.error('Error saving document:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleBack = () => {
    navigate('/documents');
  };

  // Preparar opções de pastas
  const folderOptions = folders.map(folder => ({
    value: folder.folderId.toString(),
    label: folder.name
  }));

  return (
    <PageLayout>
      <SectionHeader
        title={isEditing ? (t('editDocument') || 'Edit Document') : (t('addDocument') || 'Add Document')}
        icon={<FileText className="h-8 w-8 text-blue-500" />}
        showAddButton={false}
        customActions={
          <button
            onClick={handleBack}
            className="flex items-center px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            {t('backToDocuments') || 'Back to Documents'}
          </button>
        }
      />

      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <form onSubmit={handleSubmit} className="flex flex-col h-[calc(100vh-200px)]">
          {/* Cabeçalho do formulário */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex space-x-4">
              {/* Título */}
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

            {errors.content && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.content}</p>
            )}
          </div>

          {/* Editor */}
          <div className="flex-1 p-6">
            <MarkdownEditor
              value={formData.content}
              onChange={handleContentChange}
              height="h-full"
              placeholder="Digite o conteúdo do documento em Markdown..."
              autoFocus={true}
              disableFullscreen={true}
            />
          </div>

          {/* Rodapé com botões */}
          <div className="p-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleBack}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 dark:text-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <X className="h-4 w-4 mr-1 inline" />
                {t('cancel') || 'Cancel'}
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                <Save className="h-4 w-4 mr-1" />
                {isSaving 
                  ? (t('saving') || 'Saving...') 
                  : isEditing 
                    ? (t('update') || 'Update') 
                    : (t('create') || 'Create')
                }
              </button>
            </div>
          </div>
        </form>
      </div>
    </PageLayout>
  );
};