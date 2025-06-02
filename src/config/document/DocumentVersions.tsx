// src/config/document/DocumentVersions.tsx
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, ArrowLeft, Download, Plus, FileText,GitCompare } from 'lucide-react';
import { DocumentVersion } from '../../types/document';
import { useDocumentStore } from '../../store/documentStore';
import { useAuthStore } from '../../store/authStore';
import { PageLayout } from '../../components/common/PageLayout';
import { SectionHeader } from '../../components/common/SectionHeader';
import { DataTable } from '../../components/common/DataTable';
import { SearchBar } from '../../components/common/SearchBar';
import { Modal } from '../../components/forms/Modal';
import { FormTextarea } from '../../components/forms/FormField';
import { formatDateString } from '../../utils/formatDateString';

export const DocumentVersions = () => {
  const { t } = useTranslation();
  const { documentId } = useParams<{ documentId: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { documents, getDocument } = useDocumentStore();
  
  const [versions, setVersions] = useState<DocumentVersion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateVersionOpen, setIsCreateVersionOpen] = useState(false);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [selectedVersions, setSelectedVersions] = useState<DocumentVersion[]>([]);
  const [newVersionComment, setNewVersionComment] = useState('');

  // Buscar o documento atual
  const currentDocument = documentId ? getDocument(parseInt(documentId)) : null;

  useEffect(() => {
    if (documentId) {
      fetchVersions(parseInt(documentId));
    }
  }, [documentId]);

  // Simular busca de versões (substituir por chamada real da API)
  const fetchVersions = async (docId: number) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulação de dados - substituir por chamada real da API
      const mockVersions: DocumentVersion[] = [
        {
          documentVersionId: 1,
          documentId: docId,
          content: '<p>Versão inicial do documento</p>',
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          userId: 1,
          comment: 'Versão inicial'
        },
        {
          documentVersionId: 2,
          documentId: docId,
          content: '<p>Versão inicial do documento com pequenas correções</p>',
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          userId: 2,
          comment: 'Correções de gramática'
        },
        {
          documentVersionId: 3,
          documentId: docId,
          content: '<p>Versão inicial do documento com pequenas correções e novos parágrafos adicionados</p>',
          createdAt: new Date().toISOString(),
          userId: 1,
          comment: 'Adicionado novo conteúdo'
        }
      ];

      setTimeout(() => {
        setVersions(mockVersions);
        setLoading(false);
      }, 500);
    } catch (err) {
      setError('Erro ao carregar versões');
      setLoading(false);
    }
  };

  // Criar nova versão
  const handleCreateVersion = async () => {
    if (!currentDocument || !newVersionComment.trim()) return;
    
    try {
      setLoading(true);
      
      const newVersion: DocumentVersion = {
        documentVersionId: versions.length + 1,
        documentId: currentDocument.documentId,
        content: currentDocument.content,
        createdAt: new Date().toISOString(),
        userId: user?.userId || 1,
        comment: newVersionComment
      };
      
      // Simular criação da versão
      setTimeout(() => {
        setVersions(prev => [...prev, newVersion]);
        setNewVersionComment('');
        setIsCreateVersionOpen(false);
        setLoading(false);
      }, 500);
      
    } catch (err) {
      setError('Erro ao criar versão');
      setLoading(false);
    }
  };

  // Comparar versões
  const handleCompareVersions = (version1: DocumentVersion, version2: DocumentVersion) => {
    setSelectedVersions([version1, version2]);
    setIsCompareModalOpen(true);
  };

  // Baixar versão
  const handleDownloadVersion = (version: DocumentVersion) => {
    const element = document.createElement('a');
    const blob = new Blob([version.content], { type: 'text/html' });
    element.href = URL.createObjectURL(blob);
    element.download = `${currentDocument?.title}_v${version.documentVersionId}.html`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Restaurar versão
  const handleRestoreVersion = async (version: DocumentVersion) => {
    if (!currentDocument) return;
    
    const confirmRestore = window.confirm(
      `${t('confirmRestoreVersion')} ${version.documentVersionId}?`
    );
    
    if (confirmRestore) {
      // Aqui você implementaria a lógica para restaurar a versão
      console.log('Restaurando versão', version.documentVersionId);
    }
  };

  // Filtrar versões
  const filteredVersions = versions.filter(version =>
    version.comment?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    formatDateString(version.createdAt).includes(searchTerm)
  );

  // Configuração das colunas da tabela
  const columns = [
    {
      header: t('versionNumber'),
      accessor: (version: DocumentVersion) => (
        <div className="flex items-center">
          <FileText className="h-4 w-4 text-blue-500 mr-2" />
          <span className="font-medium">v{version.documentVersionId}</span>
        </div>
      )
    },
    {
      header: t('comment'),
      accessor: (version: DocumentVersion) => (
        <div className="text-sm text-gray-700 dark:text-gray-300">
          {version.comment || t('noComment')}
        </div>
      )
    },
    {
      header: t('createdAt'),
      accessor: (version: DocumentVersion) => (
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {formatDateString(version.createdAt)}
        </div>
      )
    },
    {
      header: t('size'),
      accessor: (version: DocumentVersion) => (
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {(version.content.length / 1024).toFixed(1)} KB
        </div>
      )
    },
    {
      header: t('actions'),
      accessor: (version: DocumentVersion) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleDownloadVersion(version)}
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            title={t('download')}
          >
            <Download className="h-4 w-4" />
          </button>
          
          <button
            onClick={() => handleRestoreVersion(version)}
            className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
            title={t('restore')}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          
          {versions.length >= 2 && (
            <button
              onClick={() => {
                const otherVersion = versions.find(v => v.documentVersionId !== version.documentVersionId);
                if (otherVersion) {
                  handleCompareVersions(version, otherVersion);
                }
              }}
              className="text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300"
              title={t('compare')}
            >
              <GitCompare className="h-4 w-4" />
            </button>
          )}
        </div>
      ),
      className: 'text-right'
    }
  ];

  if (!currentDocument) {
    return (
      <PageLayout>
        <div className="text-center py-8">
          <p className="text-red-600 dark:text-red-400">{t('documentNotFound')}</p>
          <button
            onClick={() => navigate('/documents')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {t('backToDocuments')}
          </button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="mb-6">
        <button
          onClick={() => navigate('/documents')}
          className="flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          {t('backToDocuments')}
        </button>
        
        <SectionHeader
          title={`${t('documentVersions')}: ${currentDocument.title}`}
          icon={<Clock className="h-8 w-8 text-blue-500" />}
          showAddButton={true}
          addButtonLabel={t('createVersion')}
          onAddClick={() => setIsCreateVersionOpen(true)}
        />
      </div>

      <div className="mb-6">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder={t('searchVersions')}
        />
      </div>

      <DataTable
        columns={columns}
        data={filteredVersions}
        keyExtractor={(version) => version.documentVersionId.toString()}
        isLoading={loading}
        error={error}
        emptyMessage={t('noVersionsYet')}
        emptySearchMessage={t('noVersionsFound')}
        searchTerm={searchTerm}
      />

      {/* Modal de Criar Versão */}
      {isCreateVersionOpen && (
        <Modal
          isOpen={isCreateVersionOpen}
          onClose={() => setIsCreateVersionOpen(false)}
          title={t('createNewVersion')}
          maxWidth="md"
        >
          <div className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t('createVersionDescription')}
            </p>
            
            <FormTextarea
              id="comment"
              name="comment"
              label={t('versionComment')}
              value={newVersionComment}
              onChange={(e) => setNewVersionComment(e.target.value)}
              rows={3}
              placeholder={t('enterVersionComment')}
              required
            />
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={() => setIsCreateVersionOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 dark:text-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              {t('cancel')}
            </button>
            <button
              onClick={handleCreateVersion}
              disabled={!newVersionComment.trim() || loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {loading && (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              <Plus className="h-4 w-4 mr-1" />
              {t('createVersion')}
            </button>
          </div>
        </Modal>
      )}

      {/* Modal de Comparação */}
      {isCompareModalOpen && selectedVersions.length === 2 && (
        <Modal
          isOpen={isCompareModalOpen}
          onClose={() => setIsCompareModalOpen(false)}
          title={`${t('compareVersions')} v${selectedVersions[0].documentVersionId} vs v${selectedVersions[1].documentVersionId}`}
          maxWidth="xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                {t('version')} {selectedVersions[0].documentVersionId}
              </h3>
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg max-h-96 overflow-auto">
                <div dangerouslySetInnerHTML={{ __html: selectedVersions[0].content }} />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                {selectedVersions[0].comment}
              </p>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                {t('version')} {selectedVersions[1].documentVersionId}
              </h3>
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg max-h-96 overflow-auto">
                <div dangerouslySetInnerHTML={{ __html: selectedVersions[1].content }} />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                {selectedVersions[1].comment}
              </p>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <button
              onClick={() => setIsCompareModalOpen(false)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {t('close')}
            </button>
          </div>
        </Modal>
      )}
    </PageLayout>
  );
};