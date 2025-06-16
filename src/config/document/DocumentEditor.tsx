// src/components/document/DocumentEditor.tsx - Editor integrado com versionamento
import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Save, 
  Clock, 
  GitBranch, 
  Eye, 
  ArrowLeft,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { Document, DocumentVersion } from '../../types/document';
import { useDocumentStore } from '../../store/documentStore';
import { useDocumentVersionStore } from '../../store/documentVersionStore';
import { useAuthStore } from '../../store/authStore';
import { PageLayout } from '../../components/common/PageLayout';
import { MarkdownEditor } from '../../components/editor/MarkdownEditor';
import { VersionHistoryWidget } from './VersionHistoryWidget';
import { VersionCompare } from './VersionCompare';
import { Modal } from '../../components/forms/Modal';
import { FormTextarea } from '../../components/forms/FormField';

interface DocumentEditorProps {
  documentId?: number;
  isNewDocument?: boolean;
}

export const DocumentEditor = ({ documentId, isNewDocument = false }: DocumentEditorProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { 
    documents, 
    getDocument, 
    updateDocument, 
    addDocument,
    loading: documentLoading 
  } = useDocumentStore();
  
  const { 
    versions, 
    createVersion,
    loading: versionLoading 
  } = useDocumentVersionStore();

  // Estados do editor
  const [document, setDocument] = useState<Document | null>(null);
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);

  // Estados dos modais
  const [showVersionModal, setShowVersionModal] = useState(false);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [selectedVersions, setSelectedVersions] = useState<DocumentVersion[]>([]);
  const [versionComment, setVersionComment] = useState('');

  // Estados de preview
  const [previewMode, setPreviewMode] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState<DocumentVersion | null>(null);

  // Carregar documento
  useEffect(() => {
    if (documentId && !isNewDocument) {
      const doc = getDocument(documentId);
      if (doc) {
        setDocument(doc);
        setContent(doc.content);
        setTitle(doc.title);
      }
    }
  }, [documentId, isNewDocument, getDocument]);

  // Auto-save funcionalidade
  useEffect(() => {
    if (!autoSaveEnabled || isNewDocument || !document) return;

    const autoSaveTimer = setTimeout(() => {
      if (hasUnsavedChanges) {
        handleSave(false); // false = não criar versão, apenas salvar
      }
    }, 30000); // Auto-save a cada 30 segundos

    return () => clearTimeout(autoSaveTimer);
  }, [content, title, hasUnsavedChanges, autoSaveEnabled, document]);

  // Detectar mudanças
  useEffect(() => {
    if (document) {
      const hasChanges = content !== document.content || title !== document.title;
      setHasUnsavedChanges(hasChanges);
    }
  }, [content, title, document]);

  // Prevenir saída sem salvar
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // Salvar documento
  const handleSave = useCallback(async (createVersionFlag = false, comment = '') => {
    if (!document && !isNewDocument) return;

    try {
      if (isNewDocument) {
        // Criar novo documento
        const newDoc = await addDocument({
          title,
          content,
          userId: user?.userId || 1,
          folderId: 1, // Pasta padrão
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
        
        if (newDoc) {
          setDocument(newDoc);
          setHasUnsavedChanges(false);
          setLastSaved(new Date());
          navigate(`/documents/${newDoc.documentId}/edit`);
        }
      } else if (document) {
        // Atualizar documento existente
        await updateDocument(document.documentId, {
          title,
          content
        });

        // Criar versão se solicitado
        if (createVersionFlag) {
          await createVersion(document.documentId, content, comment);
        }

        setHasUnsavedChanges(false);
        setLastSaved(new Date());
      }
    } catch (error) {
      console.error('Error saving document:', error);
    }
  }, [document, isNewDocument, title, content, user, addDocument, updateDocument, createVersion, navigate]);

  // Criar nova versão
  const handleCreateVersion = async () => {
    if (!document || !versionComment.trim()) return;

    try {
      await handleSave(true, versionComment);
      setVersionComment('');
      setShowVersionModal(false);
    } catch (error) {
      console.error('Error creating version:', error);
    }
  };

  // Comparar versões
  const handleCompareVersions = (version1: DocumentVersion, version2: DocumentVersion) => {
    setSelectedVersions([version1, version2]);
    setShowCompareModal(true);
  };

  // Visualizar versão específica
  const handleVersionPreview = (version: DocumentVersion) => {
    setSelectedVersion(version);
    setPreviewMode(true);
  };

  // Restaurar versão
  const handleRestoreVersion = async (version: DocumentVersion) => {
    const confirmRestore = window.confirm(
      t('confirmRestoreVersion', { version: version.documentVersionId })
    );

    if (confirmRestore) {
      setContent(version.content);
      setHasUnsavedChanges(true);
      setPreviewMode(false);
      setSelectedVersion(null);
    }
  };

  // Atalhos de teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 's':
            e.preventDefault();
            handleSave();
            break;
          case 'p':
            e.preventDefault();
            setPreviewMode(!previewMode);
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSave, previewMode]);

  const loading = documentLoading || versionLoading;

  return (
    <PageLayout>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/documents')}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="flex-1">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t('documentTitle')}
                className="text-xl font-bold text-gray-900 bg-transparent border-none outline-none w-full"
              />
              <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                {lastSaved && (
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    <span>{t('lastSaved')}: {lastSaved.toLocaleTimeString()}</span>
                  </div>
                )}
                {hasUnsavedChanges && (
                  <div className="flex items-center space-x-1">
                    <AlertCircle className="h-3 w-3 text-yellow-500" />
                    <span>{t('unsavedChanges')}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className={`p-2 rounded transition-colors ${
                previewMode 
                  ? 'bg-blue-100 text-blue-600' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              title={t('togglePreview')}
            >
              <Eye className="h-4 w-4" />
            </button>

            {!isNewDocument && document && (
              <button
                onClick={() => setShowVersionModal(true)}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                title={t('createVersion')}
              >
                <GitBranch className="h-4 w-4" />
              </button>
            )}

            <button
              onClick={() => handleSave()}
              disabled={loading || (!hasUnsavedChanges && !isNewDocument)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Save className="h-4 w-4" />
              <span>{loading ? t('saving') : t('save')}</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Editor */}
          <div className="flex-1 flex flex-col">
            {previewMode && selectedVersion ? (
              // Preview de versão específica
              <div className="flex-1 p-6 overflow-y-auto bg-white">
                <div className="max-w-4xl mx-auto">
                  <div className="flex items-center justify-between mb-6 p-4 bg-blue-50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-blue-900">
                        {t('viewingVersion')} {selectedVersion.documentVersionId}
                      </h3>
                      <p className="text-sm text-blue-700">
                        {selectedVersion.comment || t('noComment')}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleRestoreVersion(selectedVersion)}
                        className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                      >
                        {t('restore')}
                      </button>
                      <button
                        onClick={() => setSelectedVersion(null)}
                        className="px-3 py-1 bg-gray-300 text-gray-700 rounded text-sm hover:bg-gray-400"
                      >
                        {t('close')}
                      </button>
                    </div>
                  </div>
                  <div 
                    className="prose prose-lg max-w-none"
                    dangerouslySetInnerHTML={{ __html: selectedVersion.content }}
                  />
                </div>
              </div>
            ) : previewMode ? (
              // Preview do conteúdo atual
              <div className="flex-1 p-6 overflow-y-auto bg-white">
                <div className="max-w-4xl mx-auto">
                  <div 
                    className="prose prose-lg max-w-none"
                    dangerouslySetInnerHTML={{ __html: content }}
                  />
                </div>
              </div>
            ) : (
              // Editor
              <div className="flex-1">
                <MarkdownEditor
                  value={content}
                  onChange={setContent}
                  placeholder={t('startWriting')}
                />
              </div>
            )}
          </div>

          {/* Sidebar - Version History */}
          {!isNewDocument && document && (
            <div className="w-80 border-l border-gray-200 bg-gray-50 overflow-y-auto">
              <div className="p-4">
                <VersionHistoryWidget
                  documentId={document.documentId}
                  maxVersions={10}
                  onVersionSelect={handleVersionPreview}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 bg-white px-4 py-2">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-4">
              <span>{content.length} {t('characters')}</span>
              <span>{content.split(/\s+/).filter(word => word.length > 0).length} {t('words')}</span>
              {autoSaveEnabled && (
                <div className="flex items-center space-x-1">
                  <Clock className="h-3 w-3" />
                  <span>{t('autoSaveEnabled')}</span>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={autoSaveEnabled}
                  onChange={(e) => setAutoSaveEnabled(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <span>{t('autoSave')}</span>
              </label>
            </div>
          </div>
        </div>

        {/* Modal: Criar Versão */}
        <Modal
          isOpen={showVersionModal}
          onClose={() => setShowVersionModal(false)}
          title={t('createNewVersion')}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('versionComment')}
              </label>
              <FormTextarea
                value={versionComment}
                onChange={(e) => setVersionComment(e.target.value)}
                placeholder={t('describeChanges')}
                rows={3}
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowVersionModal(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                {t('cancel')}
              </button>
              <button
                onClick={handleCreateVersion}
                disabled={!versionComment.trim() || loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? t('creating') : t('createVersion')}
              </button>
            </div>
          </div>
        </Modal>

        {/* Modal: Comparar Versões */}
        {showCompareModal && selectedVersions.length === 2 && (
          <VersionCompare
            version1={selectedVersions[0]}
            version2={selectedVersions[1]}
            onClose={() => setShowCompareModal(false)}
          />
        )}
      </div>
    </PageLayout>
  );
};