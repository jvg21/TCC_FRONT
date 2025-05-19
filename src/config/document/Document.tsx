// src/config/document/Document.tsx - Versão atualizada
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FileText, Maximize } from 'lucide-react';
import { Document } from '../../types/document';
import { useDocumentStore } from '../../store/documentStore';
import { useAuthStore } from '../../store/authStore';
import { SectionHeader } from '../../components/common/SectionHeader';
import { PageLayout } from '../../components/common/PageLayout';
import { getDocumentColumns } from './DocumentColumns';
import { DataTable } from '../../components/common/DataTable';
import { SearchBar } from '../../components/common/SearchBar';
import { ConfirmationModal } from '../../components/forms/ConfirmationModal';
import { DocumentForm } from './DocumentForms';
import { DocumentViewer } from './DocumentViewer';

export const DocumentManagement = () => {
  const { t } = useTranslation();
  const { documents, loading, error, fetchDocuments, toggleDocumentStatus } = useDocumentStore();
  const { user: currentUser } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAddFullScreenOpen, setIsAddFullScreenOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isEditFullScreenOpen, setIsEditFullScreenOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [currentDocument, setCurrentDocument] = useState<Document | null>(null);
  
  // Check if current user is an employee (Profile 3)
  const isEmployee = currentUser?.profile === 3;

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const filteredDocuments = documents.filter(
    document =>
      document.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      document.format.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleStatus = async (document: Document) => {
    try {
      await toggleDocumentStatus(document.documentId);
      setIsStatusModalOpen(false);
      setCurrentDocument(null);
    } catch (error) {
      console.error('Toggle status failed:', error);
    }
  };

  const openAddModal = (fullScreen = false) => {
    setCurrentDocument(null);
    if (fullScreen) {
      setIsAddFullScreenOpen(true);
    } else {
      setIsAddModalOpen(true);
    }
  };

  const openEditModal = (document: Document, fullScreen = false) => {
    setCurrentDocument(document);
    if (fullScreen) {
      setIsEditFullScreenOpen(true);
    } else {
      setIsEditModalOpen(true);
    }
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
    onEdit: (doc) => openEditModal(doc, false),
    onEditFullScreen: (doc) => openEditModal(doc, true),
    onToggle: openStatusModal,
    onView: openViewer,
    currentUserId: currentUser?.userId || 0,
    isEmployee
  });

  return (
    <PageLayout>
      <SectionHeader
        title={t('documents')}
        icon={<FileText className="h-8 w-8 text-blue-500" />}
        showAddButton={true}
        addButtonLabel={t('addDocument')}
        onAddClick={() => openAddModal(true)}
      />

      <div className="mb-6 flex justify-between items-center">
        <div className="flex-1 mr-4">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder={t('searchDocuments')}
          />
        </div>
        {/* <button
          onClick={() => openAddModal(true)}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center whitespace-nowrap"
        >
          <Maximize className="h-5 w-5 mr-2" />
          {t('createFullScreen')}
        </button> */}
      </div>

      <DataTable
        columns={columns}
        data={filteredDocuments}
        keyExtractor={(document) => document.documentId.toString()}
        isLoading={loading}
        error={error}
        emptyMessage={t('noDocumentsYet')}
        emptySearchMessage={t('noDocumentsFound')}
        searchTerm={searchTerm}
      />

      {/* Add Document Modal */}
      {isAddModalOpen && (
        <DocumentForm
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          isFullScreen={false}
        />
      )}

      {/* Add Document Full Screen */}
      {isAddFullScreenOpen && (
        <DocumentForm
          isOpen={isAddFullScreenOpen}
          onClose={() => setIsAddFullScreenOpen(false)}
          isFullScreen={true}
        />
      )}

      {/* Edit Document Modal */}
      {isEditModalOpen && currentDocument && (
        <DocumentForm
          document={currentDocument}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          isFullScreen={false}
        />
      )}

      {/* Edit Document Full Screen */}
      {isEditFullScreenOpen && currentDocument && (
        <DocumentForm
          document={currentDocument}
          isOpen={isEditFullScreenOpen}
          onClose={() => setIsEditFullScreenOpen(false)}
          isFullScreen={true}
        />
      )}

      {/* Toggle Status Confirmation Modal */}
      {isStatusModalOpen && currentDocument && (
        <ConfirmationModal
          isOpen={isStatusModalOpen}
          onClose={() => setIsStatusModalOpen(false)}
          onConfirm={() => handleToggleStatus(currentDocument)}
          title={currentDocument.isActive ? t('deactivateDocument') : t('activateDocument')}
          message={currentDocument.isActive 
            ? t('deactivateDocumentConfirmation', { title: currentDocument.title }) 
            : t('activateDocumentConfirmation', { title: currentDocument.title })}
          confirmLabel={currentDocument.isActive ? t('deactivate') : t('activate')}
          cancelLabel={t('cancel')}
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