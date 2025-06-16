// src/config/document/DocumentViewer.tsx - Atualizado
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
  onEdit?: () => void;
}

export const DocumentViewer = ({ document, isOpen, onClose, onEdit }: DocumentViewerProps) => {
  const { t } = useTranslation();
  const { folders } = useDocumentStore();
  const [activeTab, setActiveTab] = useState<'content' | 'details'>('content');

  const folderName = folders.find(f => f.folderId === document.folderId)?.name || 'Unknown';

  const renderMarkdown = (text: string) => {
    return text
      // Headers
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold text-gray-900 dark:text-white mb-3">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">$1</h1>')
      // Bold
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
      .replace(/__(.*?)__/g, '<strong class="font-semibold">$1</strong>')
      // Italic
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      .replace(/_(.*?)_/g, '<em class="italic">$1</em>')
      // Strikethrough
      .replace(/~~(.*?)~~/g, '<del class="line-through">$1</del>')
      // Inline code
      .replace(/`([^`]+)`/g, '<code class="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm font-mono text-red-600 dark:text-red-400">$1</code>')
      // Links externos
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:underline dark:text-blue-400" target="_blank">$1</a>')
      // Links internos
      .replace(/\[\[([^\]]+)\]\]/g, '<span class="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-sm">$1</span>')
      // Tags
      .replace(/#(\w+)/g, '<span class="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-1 rounded text-sm">#$1</span>')
      // Blockquotes
      .replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-gray-300 dark:border-gray-600 pl-4 py-2 my-2 italic text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800">$1</blockquote>')
      // Checkboxes
      .replace(/^- \[ \] (.*$)/gim, '<div class="flex items-center mb-1"><input type="checkbox" class="mr-2 rounded" disabled> <span>$1</span></div>')
      .replace(/^- \[x\] (.*$)/gim, '<div class="flex items-center mb-1"><input type="checkbox" class="mr-2 rounded" checked disabled> <span class="line-through text-gray-500">$1</span></div>')
      // Listas
      .replace(/^\d+\. (.*$)/gim, '<li class="ml-4 mb-1">$1</li>')
      .replace(/^- (.*$)/gim, '<li class="ml-4 mb-1 list-disc">$1</li>')
      // Quebras de linha
      .replace(/\n/g, '<br />');
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const fileFormat = document.format === 'html' ? 'text/html' : 
                      document.format === 'md' ? 'text/markdown' : 'text/plain';
    
    const blob = new Blob([document.content], { type: fileFormat });
    element.href = URL.createObjectURL(blob);
    element.download = `${document.title}.${document.format}`;
    
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={document.title}
      maxWidth="4xl"
    >
      <div className="h-[80vh] flex flex-col">
        {/* Header com informações e botões */}
        <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <StatusBadge
              label={document.isActive ? t('active') : t('inactive')}
              variant={document.isActive ? 'success' : 'danger'}
            />
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {folderName}
            </span>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={handleDownload}
              className="px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center"
            >
              <Download className="h-4 w-4 mr-1" />
              {t('download')}
            </button>
            {onEdit && (
              <button
                onClick={onEdit}
                className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
              >
                <Edit className="h-4 w-4 mr-1" />
                {t('edit')}
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 mb-4">
          <button
            onClick={() => setActiveTab('content')}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'content'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <FileText className="h-4 w-4 inline mr-1" />
            {t('content')}
          </button>
          <button
            onClick={() => setActiveTab('details')}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'details'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <Tag className="h-4 w-4 inline mr-1" />
            {t('details')}
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'content' ? (
            <div className="prose prose-sm max-w-none dark:prose-invert">
              {document.format === 'md' ? (
                <div 
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(document.content) }}
                />
              ) : (
                <pre className="whitespace-pre-wrap text-gray-800 dark:text-gray-200">
                  {document.content}
                </pre>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {t('format')}
                  </label>
                  <p className="text-gray-900 dark:text-white">
                    {document.format.toUpperCase()}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {t('folder')}
                  </label>
                  <p className="text-gray-900 dark:text-white">{folderName}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {t('createdAt')}
                  </label>
                  <p className="text-gray-900 dark:text-white">
                    {formatDateString(document.createdAt)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {t('updatedAt')}
                  </label>
                  <p className="text-gray-900 dark:text-white">
                    {formatDateString(document.updatedAt)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};