// src/config/document/DocumentViewer.tsx
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Download, Calendar, Edit, Tag, FileText } from 'lucide-react';
import { Document } from '../../types/document';
import { Modal } from '../../components/forms/Modal';
import { StatusBadge } from '../../components/common/StatusBadge';
import { useDocumentStore } from '../../store/documentStore';
import { formatDateString } from '../../utils/formatDateString';

interface DocumentViewerProps {
  document: Document;
  isOpen: boolean;
  onClose: () => void;
}

export const DocumentViewer = ({ document, isOpen, onClose }: DocumentViewerProps) => {
  const { t } = useTranslation();
  const { folders } = useDocumentStore();
  const [activeTab, setActiveTab] = useState<'content' | 'details'>('content');

  // Encontrar o nome da pasta baseado no ID
  const folderName = folders.find(f => f.folderId === document.folderId)?.name || 'Unknown';

  const handleDownload = () => {
    // Criar um elemento link para download
    const element = document.createElement('a');
    
    // Criar um blob do conteúdo do documento
    const fileFormat = document.format === 'html' ? 'text/html' : 
                      document.format === 'md' ? 'text/markdown' : 'text/plain';
    
    const blob = new Blob([document.content], { type: fileFormat });
    element.href = URL.createObjectURL(blob);
    
    // Definir o nome do arquivo para download
    element.download = `${document.title}.${document.format}`;
    
    // Simular um clique no link para iniciar o download
    document.body.appendChild(element);
    element.click();
    
    // Remover o elemento após o download
    document.body.removeChild(element);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={document.title}
      maxWidth="xl"
    >
      <div>
        {/* Cabeçalho com informações básicas e botões de ação */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <StatusBadge
              label={document.isActive ? t('active') : t('inactive')}
              variant={document.isActive ? 'success' : 'danger'}
              size="md"
            />
            <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
              {document.format.toUpperCase()}
            </span>
          </div>
          
          <button
            onClick={handleDownload}
            className="flex items-center px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            <Download className="h-4 w-4 mr-1" />
            {t('download')}
          </button>
        </div>
        
        {/* Tabs de navegação */}
        <div className="border-b border-gray-200 dark:border-gray-700 mb-4">
          <nav className="flex -mb-px space-x-8">
            <button
              onClick={() => setActiveTab('content')}
              className={`py-2 px-1 border-b-2 font-medium text-sm focus:outline-none ${
                activeTab === 'content'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <FileText className="h-4 w-4 inline-block mr-1" />
              {t('content')}
            </button>
            <button
              onClick={() => setActiveTab('details')}
              className={`py-2 px-1 border-b-2 font-medium text-sm focus:outline-none ${
                activeTab === 'details'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <Edit className="h-4 w-4 inline-block mr-1" />
              {t('details')}
            </button>
          </nav>
        </div>
        
        {/* Conteúdo da aba selecionada */}
        {activeTab === 'content' ? (
          <div className="prose dark:prose-invert max-w-none">
            {/* Para documentos HTML, renderizamos o conteúdo como HTML */}
            {document.format === 'html' ? (
              <div dangerouslySetInnerHTML={{ __html: document.content }} />
            ) : (
              // Para outros formatos, mostramos como texto simples
              <pre className="whitespace-pre-wrap bg-gray-50 dark:bg-gray-800 p-4 rounded-lg overflow-auto max-h-96">
                {document.content}
              </pre>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                  <Calendar className="h-4 w-4 inline-block mr-1" />
                  {t('dates')}
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">{t('createdAt')}</span>
                    <span className="text-gray-700 dark:text-gray-300">
                      {formatDateString(document.createdAt)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">{t('updatedAt')}</span>
                    <span className="text-gray-700 dark:text-gray-300">
                      {formatDateString(document.updatedAt)}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                  <Tag className="h-4 w-4 inline-block mr-1" />
                  {t('location')}
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">{t('folder')}</span>
                    <span className="text-gray-700 dark:text-gray-300">
                      {folderName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">{t('format')}</span>
                    <span className="text-gray-700 dark:text-gray-300">
                      {document.format.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Espaço para metadados adicionais, como tags, permissões, etc */}
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                {t('metadata')}
              </h3>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {t('noAdditionalMetadata')}
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-6 flex justify-end">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          {t('close')}
        </button>
      </div>
    </Modal>
  );
};