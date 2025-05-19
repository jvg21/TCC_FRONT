// src/config/document/DocumentWorkspace.tsx - Versão atualizada
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Document } from '../../types/document';
import { useDocumentStore } from '../../store/documentStore';
import { PageLayout } from '../../components/common/PageLayout';
import { DocumentBrowser } from './DocumentBrowser';
import { DocumentViewer } from './DocumentViewer';
import { ConfirmationModal } from '../../components/forms/ConfirmationModal';
import { FileText, Save, History, Tag as TagIcon, Maximize, Minimize, Edit } from 'lucide-react';
import { DocumentForm } from './DocumentForms';

/**
 * Componente principal para o ambiente de trabalho de documentos.
 * Inclui navegador de documentos, visualizador e editor em uma única interface.
 */
export const DocumentWorkspace = () => {
  const { t } = useTranslation();
  const { documents, toggleDocumentStatus } = useDocumentStore();
  
  // Estados para controle dos componentes
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isAddingDocument, setIsAddingDocument] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  
  // Manipuladores de ação
  const handleDocumentSelect = (document: Document) => {
    setSelectedDocument(document);
    setIsEditMode(false);
    setIsFullScreen(false);
  };
  
  const handleAddDocument = (fullScreen = false) => {
    setSelectedDocument(null);
    setIsAddingDocument(true);
    setIsFullScreen(fullScreen);
  };
  
  const handleEditDocument = (fullScreen = false) => {
    if (selectedDocument) {
      setIsEditMode(true);
      setIsFullScreen(fullScreen);
    }
  };
  
  const handleToggleStatus = async () => {
    if (selectedDocument) {
      try {
        await toggleDocumentStatus(selectedDocument.documentId);
        
        // Atualizar o documento selecionado com o novo status
        const updatedDocument = documents.find(d => d.documentId === selectedDocument.documentId);
        if (updatedDocument) {
          setSelectedDocument(updatedDocument);
        }
        
        setIsStatusModalOpen(false);
      } catch (error) {
        console.error('Toggle status failed:', error);
      }
    }
  };

  const handleCloseForm = () => {
    setIsEditMode(false);
    setIsAddingDocument(false);
    setIsFullScreen(false);
  };
  
  return (
    <PageLayout>
      <div className="flex h-[calc(100vh-200px)] gap-4">
        {/* Navegador de documentos (sidebar) */}
        <div className="w-64 flex-shrink-0 overflow-auto">
          <DocumentBrowser
            onDocumentSelect={handleDocumentSelect}
            onAddDocument={() => handleAddDocument(false)}
            selectedDocumentId={selectedDocument?.documentId}
          />
        </div>
        
        {/* Área principal - Visualizador/Editor de documentos */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {selectedDocument && !isEditMode ? (
            // Modo visualização
            <div className="flex-1 flex flex-col">
              <div className="bg-white dark:bg-gray-800 p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-blue-500 mr-2" />
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{selectedDocument.title}</h2>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditDocument(false)}
                    className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                    title={t('editInSidebar')}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    {t('edit')}
                  </button>
                  
                  <button
                    onClick={() => handleEditDocument(true)}
                    className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
                    title={t('editFullScreen')}
                  >
                    <Maximize className="h-4 w-4 mr-1" />
                    {t('fullScreen')}
                  </button>
                  
                  <button
                    onClick={() => setIsStatusModalOpen(true)}
                    className={`px-3 py-1 rounded-lg flex items-center 
                      ${selectedDocument.isActive 
                        ? 'bg-red-600 text-white hover:bg-red-700' 
                        : 'bg-green-600 text-white hover:bg-green-700'}`}
                  >
                    {selectedDocument.isActive ? t('deactivate') : t('activate')}
                  </button>
                </div>
              </div>
              
              <div className="flex-1 overflow-auto p-4">
                {/* Para documentos HTML, renderizamos o conteúdo como HTML */}
                {selectedDocument.format === 'html' ? (
                  <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: selectedDocument.content }} />
                ) : (
                  // Para outros formatos, mostramos como texto simples
                  <pre className="whitespace-pre-wrap bg-gray-50 dark:bg-gray-800 p-4 rounded-lg overflow-auto">
                    {selectedDocument.content}
                  </pre>
                )}
              </div>
            </div>
          ) : isEditMode && selectedDocument ? (
            // Modo edição para documento existente
            <DocumentForm
              document={selectedDocument}
              isOpen={true}
              onClose={handleCloseForm}
              isEmbedded={!isFullScreen}
              isFullScreen={isFullScreen}
            />
          ) : isAddingDocument ? (
            // Modo de adição de novo documento
            <DocumentForm
              isOpen={true}
              onClose={handleCloseForm}
              isEmbedded={!isFullScreen}
              isFullScreen={isFullScreen}
            />
          ) : (
            // Mensagem quando nenhum documento está selecionado
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <FileText className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {t('noDocumentSelected')}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mb-4">
                {t('selectDocumentMessage')}
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => handleAddDocument(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  {t('createNewDocument')}
                </button>
                {/* <button
                  onClick={() => handleAddDocument(true)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
                >
                  <Maximize className="h-4 w-4 mr-2" />
                  {t('createInFullScreen')}
                </button> */}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Modal de confirmação para alteração de status */}
      {isStatusModalOpen && selectedDocument && (
        <ConfirmationModal
          isOpen={isStatusModalOpen}
          onClose={() => setIsStatusModalOpen(false)}
          onConfirm={handleToggleStatus}
          title={selectedDocument.isActive ? t('deactivateDocument') : t('activateDocument')}
          message={selectedDocument.isActive 
            ? t('deactivateDocumentConfirmation', { title: selectedDocument.title }) 
            : t('activateDocumentConfirmation', { title: selectedDocument.title })}
          confirmLabel={selectedDocument.isActive ? t('deactivate') : t('activate')}
          cancelLabel={t('cancel')}
          variant={selectedDocument.isActive ? 'danger' : 'success'}
        />
      )}
    </PageLayout>
  );
};