// src/config/document/Document.tsx - Seguindo padrões do projeto
import { useState, useEffect } from 'react';
import { FileText, Filter, X, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDocumentStore } from '../../store/documentStore';
import { useAuthStore } from '../../store/authStore';
import { useLanguage } from '../../hooks/useLanguage';
import { Document } from '../../types/document';
import { DataTable } from '../../components/common/DataTable';
import { SearchBar } from '../../components/common/SearchBar';
import { ConfirmationModal } from '../../components/forms/ConfirmationModal';
import { DocumentViewer } from './DocumentViewer';
import { getDocumentColumns } from './DocumentColumns';
import { PageLayout } from '../../components/common/PageLayout';
import { SectionHeader } from '../../components/common/SectionHeader';

interface DocumentFilters {
  dateFrom: string;
  dateTo: string;
  status: string; // 'all', 'active', 'inactive'
}

export const DocumentManagement = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { user: currentUser } = useAuthStore();
  const { 
    documents, 
    loading, 
    error, 
    fetchDocuments, 
    toggleDocumentStatus 
  } = useDocumentStore();

  // Estados para modais e formulários
  const [searchTerm, setSearchTerm] = useState('');
  const [currentDocument, setCurrentDocument] = useState<Document | null>(null);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Filtros - seguindo padrão do TaskPage
  const [filters, setFilters] = useState<DocumentFilters>({
    dateFrom: '',
    dateTo: '',
    status: 'active' // Filtrar apenas ativos por padrão
  });

  // Verificar se o usuário é funcionário (perfil 3)
  const isEmployee = currentUser?.profile === 3;

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  // Função para alterar filtros - seguindo padrão do TaskPage
  const handleFilterChange = (key: keyof DocumentFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Função para limpar filtros - seguindo padrão do TaskPage
  const clearFilters = () => {
    setFilters({
      dateFrom: '',
      dateTo: '',
      status: 'active'
    });
  };

  // Filtrar documentos baseado no termo de busca e filtros - seguindo padrão do TaskPage
  const filteredDocuments = documents.filter(document => {
    // Filtro de texto
    const matchesSearch = document.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      document.content.toLowerCase().includes(searchTerm.toLowerCase());

    // Filtro de data
    const matchesDate = (!filters.dateFrom || new Date(document.createdAt) >= new Date(filters.dateFrom)) &&
      (!filters.dateTo || new Date(document.createdAt) <= new Date(filters.dateTo));

    // Filtro de status
    const matchesStatus = filters.status === 'all' || 
      (filters.status === 'active' && document.isActive) ||
      (filters.status === 'inactive' && !document.isActive);

    return matchesSearch && matchesDate && matchesStatus;
  });

  const handleToggleStatus = async (document: Document) => {
    try {
      await toggleDocumentStatus(document.documentId);
      setIsStatusModalOpen(false);
      setCurrentDocument(null);
    } catch (error) {
      console.error('Toggle status failed:', error);
    }
  };

  const handleCreateDocument = () => {
    navigate('/documents/new');
  };

  const openStatusModal = (document: Document) => {
    setCurrentDocument(document);
    setIsStatusModalOpen(true);
  };

  const openViewer = (document: Document) => {
    setCurrentDocument(document);
    setIsViewerOpen(true);
  };

  // Get columns configuration
  const columns = getDocumentColumns({
    onToggle: openStatusModal,
    onView: openViewer,
    currentUserId: currentUser?.userId || 0,
    isEmployee
  });

  return (
    <PageLayout>
      <SectionHeader
        title={t('documents') || 'Documents'}
        icon={<FileText className="h-8 w-8 text-blue-500" />}
        showAddButton={true}
        addButtonLabel={t('addDocument') || 'Add Document'}
        onAddClick={handleCreateDocument}
      />

      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder={t('searchDocuments') || 'Search documents...'}
          />
          
          <div className="flex space-x-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <Filter className="h-4 w-4 mr-2" />
              {t('filters') || 'Filters'}
            </button>
            
            {/* <button
              onClick={handleCreateDocument}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center whitespace-nowrap"
            >
              <Plus className="h-5 w-5 mr-2" />
              {t('createDocument') || 'Create Document'}
            </button> */}
          </div>
        </div>

        {/* Filtros - seguindo padrão do TaskPage */}
        {showFilters && (
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Data De */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('dateFrom') || 'Date From'}
                </label>
                <input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                />
              </div>

              {/* Data Até */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('dateTo') || 'Date To'}
                </label>
                <input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                />
              </div>

              {/* Status - com opção "Todos" */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('status') || 'Status'}
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                >
                  <option value="all">{t('allStatuses') || 'All Statuses'}</option>
                  <option value="active">{t('active') || 'Active'}</option>
                  <option value="inactive">{t('inactive') || 'Inactive'}</option>
                </select>
              </div>
            </div>

            {/* Botão limpar filtros */}
            <div className="mt-4 flex justify-end">
              <button
                onClick={clearFilters}
                className="flex items-center px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                <X className="h-4 w-4 mr-1" />
                {t('clearFilters') || 'Clear Filters'}
              </button>
            </div>
          </div>
        )}
      </div>

      <DataTable
        columns={columns}
        data={filteredDocuments}
        keyExtractor={(document) => document.documentId.toString()}
        isLoading={loading}
        error={error}
        emptyMessage={t('noDocumentsYet') || 'No documents yet'}
        emptySearchMessage={t('noDocumentsFound') || 'No documents found'}
        searchTerm={searchTerm}
      />

      {/* Modais apenas para status e viewer */}
      
      {/* Toggle Status Confirmation Modal */}
      {isStatusModalOpen && currentDocument && (
        <ConfirmationModal
          isOpen={isStatusModalOpen}
          onClose={() => setIsStatusModalOpen(false)}
          onConfirm={() => handleToggleStatus(currentDocument)}
          title={currentDocument.isActive ? (t('deactivateDocument') || 'Deactivate Document') : (t('activateDocument') || 'Activate Document')}
          message={currentDocument.isActive 
            ? (t('deactivateDocumentConfirmation') || `Are you sure you want to deactivate "${currentDocument.title}"?`)
            : (t('activateDocumentConfirmation') || `Are you sure you want to activate "${currentDocument.title}"?`)}
          confirmLabel={currentDocument.isActive ? (t('deactivate') || 'Deactivate') : (t('activate') || 'Activate')}
          cancelLabel={t('cancel') || 'Cancel'}
          variant={currentDocument.isActive ? 'danger' : 'success'}
        />
      )}

      {/* Document Viewer Modal */}
      {isViewerOpen && currentDocument && (
        <DocumentViewer
          document={currentDocument}
          isOpen={isViewerOpen}
          onClose={() => setIsViewerOpen(false)}
        />
      )}
    </PageLayout>
  );
};