// src/config/document/DocumentBrowser.tsx
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Folder, Plus, File, ChevronRight, ChevronDown, Tag as TagIcon, Settings } from 'lucide-react';
import { Document, Folder as FolderType, Tag } from '../../types/document';
import { useDocumentStore } from '../../store/documentStore';
import { useAuthStore } from '../../store/authStore';
import { ContentCard } from '../../components/common/PageLayout';
import { FolderForm } from './FolderForm';
import { TagForm } from './TagForm';

interface DocumentBrowserProps {
  onDocumentSelect: (document: Document) => void;
  onAddDocument: () => void;
  selectedDocumentId?: number;
}

export const DocumentBrowser = ({ 
  onDocumentSelect, 
  onAddDocument,
  selectedDocumentId 
}: DocumentBrowserProps) => {
  const { t } = useTranslation();
  const { documents, folders, tags, fetchFolders, fetchTags } = useDocumentStore();
  const { user } = useAuthStore();
  const [expandedFolders, setExpandedFolders] = useState<number[]>([]);
  const [isFolderFormOpen, setIsFolderFormOpen] = useState(false);
  const [isTagFormOpen, setIsTagFormOpen] = useState(false);
  
  // Permissões baseadas no perfil do usuário
  const canManageStructure = user?.profile !== 3; // Apenas administradores e gerentes
  
  useEffect(() => {
    fetchFolders();
    fetchTags();
  }, [fetchFolders, fetchTags]);
  
  // Função para alternar a expansão de uma pasta
  const toggleFolder = (folderId: number) => {
    setExpandedFolders(prev => 
      prev.includes(folderId)
        ? prev.filter(id => id !== folderId)
        : [...prev, folderId]
    );
  };
  
  // Preparar a hierarquia de pastas (pastas de nível superior primeiro)
  const rootFolders = folders.filter(f => !f.parentFolderId && f.isActive);
  
  // Função para renderizar uma pasta e seus documentos aninhados
  const renderFolder = (folder: FolderType) => {
    const isExpanded = expandedFolders.includes(folder.folderId);
    const childFolders = folders.filter(f => f.parentFolderId === folder.folderId && f.isActive);
    const folderDocuments = documents.filter(d => d.folderId === folder.folderId && d.isActive);
    
    return (
      <div key={folder.folderId} className="mb-1">
        <div 
          className="flex items-center py-1 px-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
          onClick={() => toggleFolder(folder.folderId)}
        >
          {isExpanded ? <ChevronDown className="h-4 w-4 mr-1" /> : <ChevronRight className="h-4 w-4 mr-1" />}
          <Folder className="h-5 w-5 text-blue-500 mr-2" />
          <span className="text-sm font-medium">{folder.name}</span>
          <span className="ml-auto text-xs text-gray-500 dark:text-gray-400">
            {folderDocuments.length}
          </span>
        </div>
        
        {isExpanded && (
          <div className="pl-6">
            {childFolders.map(childFolder => renderFolder(childFolder))}
            
            {folderDocuments.map(doc => (
              <div 
                key={doc.documentId} 
                className={`flex items-center py-1 px-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer 
                  ${doc.documentId === selectedDocumentId ? 'bg-blue-50 dark:bg-blue-900' : ''}`}
                onClick={() => onDocumentSelect(doc)}
              >
                <File className="h-5 w-5 text-gray-500 mr-2" />
                <span className="text-sm truncate">{doc.title}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };
  
  return (
    <ContentCard title={t('documentBrowser')} className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={onAddDocument}
          className="flex items-center text-sm px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-1" />
          {t('newDocument')}
        </button>
        
        {canManageStructure && (
          <div className="flex space-x-2">
            <button
              onClick={() => setIsFolderFormOpen(true)}
              className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
              title={t('addFolder')}
            >
              <Folder className="h-4 w-4 text-gray-600 dark:text-gray-300" />
            </button>
            <button
              onClick={() => setIsTagFormOpen(true)}
              className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
              title={t('addTag')}
            >
              <TagIcon className="h-4 w-4 text-gray-600 dark:text-gray-300" />
            </button>
          </div>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('folders')}
          </h3>
          {rootFolders.length > 0 ? (
            <div>
              {rootFolders.map(folder => renderFolder(folder))}
            </div>
          ) : (
            <div className="text-sm text-gray-500 dark:text-gray-400 italic">
              {t('noFolders')}
            </div>
          )}
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('tags')}
          </h3>
          {tags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {tags.filter(tag => tag.isActive).map(tag => (
                <span 
                  key={tag.tagId}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                >
                  <TagIcon className="h-3 w-3 mr-1" />
                  {tag.name}
                </span>
              ))}
            </div>
          ) : (
            <div className="text-sm text-gray-500 dark:text-gray-400 italic">
              {t('noTags')}
            </div>
          )}
        </div>
      </div>
      
      {/* Modais de formulário */}
      {isFolderFormOpen && (
        <FolderForm 
          isOpen={isFolderFormOpen} 
          onClose={() => setIsFolderFormOpen(false)} 
        />
      )}
      
      {isTagFormOpen && (
        <TagForm 
          isOpen={isTagFormOpen} 
          onClose={() => setIsTagFormOpen(false)} 
        />
      )}
    </ContentCard>
  );
};