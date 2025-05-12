// src/config/document/Document.tsx
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FileText } from 'lucide-react';
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
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
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

  const openAddModal = () => {
    setCurrentDocument(null);
    setIsAddModalOpen(true);
  };

  const openEditModal = (document: Document) => {
    setCurrentDocument(document);
    setIsEditModalOpen(true);
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
    onEdit: openEditModal,
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
        onAddClick={openAddModal}
      />

      <div className="mb-6">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder={t('searchDocuments')}
        />
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
        />
      )}

      {/* Edit Document Modal */}
      {isEditModalOpen && currentDocument && (
        <DocumentForm
          document={currentDocument}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
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