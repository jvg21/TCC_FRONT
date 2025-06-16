// src/config/document/DocumentVersions.tsx - Seguindo padrões do projeto
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Clock, 
  ArrowLeft, 
  Download, 
  Plus, 
  FileText, 
  GitCompare, 
  MessageSquare, 
  Edit3,
  RotateCcw,
  User,
  Calendar
} from 'lucide-react';
import { DocumentVersion } from '../../types/document';
import { useDocumentStore } from '../../store/documentStore';
import { useDocumentVersionStore } from '../../store/documentVersionStore';
import { useAuthStore } from '../../store/authStore';
import { PageLayout } from '../../components/common/PageLayout';
import { SectionHeader } from '../../components/common/SectionHeader';
import { DataTable } from '../../components/common/DataTable';
import { SearchBar } from '../../components/common/SearchBar';
import { Modal } from '../../components/forms/Modal';
import { formatDateString } from '../../utils/formatDateString';
import { FormTextarea } from '../../components/forms/FormField';

export const DocumentVersions = () => {
  const { t } = useTranslation();
  const { documentId } = useParams<{ documentId: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { documents, getDocument } = useDocumentStore();
  const { 
    versions, 
    loading, 
    error, 
    fetchVersionsByDocumentId, 
    addVersionComment,
    createVersion,
    clearVersions 
  } = useDocumentVersionStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateVersionOpen, setIsCreateVersionOpen] = useState(false);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [selectedVersions, setSelectedVersions] = useState<DocumentVersion[]>([]);
  const [newVersionComment, setNewVersionComment] = useState('');
  const [selectedVersionForComment, setSelectedVersionForComment] = useState<DocumentVersion | null>(null);
  const [newCommentText, setNewCommentText] = useState('');

  // Buscar o documento atual
  const currentDocument = documentId ? getDocument(parseInt(documentId)) : null;

  useEffect(() => {
    if (documentId) {
      fetchVersionsByDocumentId(parseInt(documentId));
    }

    // Limpar versões ao sair da tela
    return () => {
      clearVersions();
    };
  }, [documentId, fetchVersionsByDocumentId, clearVersions]);

  // Criar nova versão
  const handleCreateVersion = async () => {
    if (!currentDocument || !newVersionComment.trim()) return;
    
    try {
      const newVersion = await createVersion(
        currentDocument.documentId,
        currentDocument.content,
        newVersionComment
      );
      
      if (newVersion) {
        setNewVersionComment('');
        setIsCreateVersionOpen(false);
      }
    } catch (err) {
      console.error('Error creating version:', err);
    }
  };

  // Adicionar comentário a uma versão
  const handleAddComment = async () => {
    if (!selectedVersionForComment || !newCommentText.trim()) return;

    try {
      await addVersionComment(selectedVersionForComment.documentVersionId, newCommentText);
      setNewCommentText('');
      setSelectedVersionForComment(null);
      setIsCommentModalOpen(false);
    } catch (err) {
      console.error('Error adding comment:', err);
    }
  };

  // Abrir modal de comentário
  const openCommentModal = (version: DocumentVersion) => {
    setSelectedVersionForComment(version);
    setNewCommentText(version.comment || '');
    setIsCommentModalOpen(true);
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

  // Restaurar versão (implementar conforme necessário)
  const handleRestoreVersion = async (version: DocumentVersion) => {
    if (!currentDocument) return;
    
    const confirmRestore = window.confirm(
      `${t('confirmRestoreVersion')} ${version.documentVersionId}?`
    );
    
    if (confirmRestore) {
      // Aqui você implementaria a lógica para restaurar a versão
      // Provavelmente atualizando o documento com o conteúdo da versão selecionada
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
        <div className="max-w-xs">
          <p className="text-sm text-gray-900 truncate">
            {version.comment || t('noComment')}
          </p>
        </div>
      )
    },
    {
      header: t('createdAt'),
      accessor: (version: DocumentVersion) => (
        <div className="flex items-center text-sm text-gray-500">
          <Calendar className="h-4 w-4 mr-1" />
          {formatDateString(version.createdAt)}
        </div>
      )
    },
    {
      header: t('user'),
      accessor: (version: DocumentVersion) => (
        <div className="flex items-center text-sm text-gray-500">
          <User className="h-4 w-4 mr-1" />
          {t('userId')} {version.userId}
        </div>
      )
    },
    {
      header: t('actions'),
      accessor: (version: DocumentVersion) => (
        <div className="flex space-x-2">
          <button
            onClick={() => openCommentModal(version)}
            className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
            title={t('editComment')}
          >
            <MessageSquare className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDownloadVersion(version)}
            className="p-1 text-green-600 hover:text-green-800 transition-colors"
            title={t('download')}
          >
            <Download className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleRestoreVersion(version)}
            className="p-1 text-orange-600 hover:text-orange-800 transition-colors"
            title={t('restore')}
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      )
    }
  ];

  if (!currentDocument) {
    return (
      <PageLayout>
        <div className="text-center py-8">
          <p className="text-gray-500">{t('documentNotFound')}</p>
          <button
            onClick={() => navigate('/documents')}
            className="mt-4 text-blue-600 hover:text-blue-800"
          >
            {t('backToDocuments')}
          </button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="space-y-6">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/documents')}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {t('documentVersions')}
              </h1>
              <p className="text-sm text-gray-500">
                {currentDocument.title}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsCreateVersionOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>{t('createVersion')}</span>
          </button>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-blue-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">{t('totalVersions')}</p>
                <p className="text-2xl font-bold text-gray-900">{versions.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <GitCompare className="h-8 w-8 text-green-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">{t('latestVersion')}</p>
                <p className="text-2xl font-bold text-gray-900">
                  v{versions.length > 0 ? Math.max(...versions.map(v => v.documentVersionId)) : 0}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <MessageSquare className="h-8 w-8 text-yellow-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">{t('versionsWithComments')}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {versions.filter(v => v.comment && v.comment.trim()).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder={t('searchVersions')}
          />
        </div>

        {/* Tabela de versões */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <SectionHeader title={t('versionHistory')} />
          <DataTable
            columns={columns}
            data={filteredVersions}
            keyExtractor={(version) => version.documentVersionId.toString()}
            isLoading={loading}
            error={error}
            emptyMessage={t('noVersionsFound')}
            emptySearchMessage={t('noVersionsFound')}
            searchTerm={searchTerm}
          />
        </div>

        {/* Modal: Criar nova versão */}
        <Modal
          isOpen={isCreateVersionOpen}
          onClose={() => setIsCreateVersionOpen(false)}
          title={t('createNewVersion')}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('versionComment')}
              </label>
              <FormTextarea
                value={newVersionComment}
                onChange={(e) => setNewVersionComment(e.target.value)}
                placeholder={t('enterVersionComment')}
                rows={3}
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsCreateVersionOpen(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {t('cancel')}
              </button>
              <button
                onClick={handleCreateVersion}
                disabled={!newVersionComment.trim() || loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? t('creating') : t('createVersion')}
              </button>
            </div>
          </div>
        </Modal>

        {/* Modal: Adicionar/Editar comentário */}
        <Modal
          isOpen={isCommentModalOpen}
          onClose={() => setIsCommentModalOpen(false)}
          title={t('editVersionComment')}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('comment')}
              </label>
              <FormTextarea
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                placeholder={t('enterComment')}
                rows={3}
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsCommentModalOpen(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {t('cancel')}
              </button>
              <button
                onClick={handleAddComment}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? t('saving') : t('save')}
              </button>
            </div>
          </div>
        </Modal>

        {/* Modal: Comparar versões */}
        <Modal
          isOpen={isCompareModalOpen}
          onClose={() => setIsCompareModalOpen(false)}
          title={t('compareVersions')}
          size="xl"
        >
          <div className="space-y-4">
            {selectedVersions.length === 2 && (
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">
                    {t('version')} {selectedVersions[0].documentVersionId}
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
                    <div 
                      className="prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: selectedVersions[0].content }}
                    />
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">
                    {t('version')} {selectedVersions[1].documentVersionId}
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
                    <div 
                      className="prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: selectedVersions[1].content }}
                    />
                  </div>
                </div>
              </div>
            )}
            <div className="flex justify-end">
              <button
                onClick={() => setIsCompareModalOpen(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {t('close')}
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </PageLayout>
  );
};