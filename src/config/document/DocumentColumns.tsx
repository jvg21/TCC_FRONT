// src/config/document/DocumentColumns.tsx - Versão atualizada com botão de versões
import { Column } from '../../components/common/DataTable';
import { Document } from '../../types/document';
import { ActionButtons } from '../../components/common/ActionButtons';
import { StatusBadge } from '../../components/common/StatusBadge';
import { FileText, Edit, Maximize, Eye, Clock } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { formatDateString } from '../../utils/formatDateString';
import { useNavigate } from 'react-router-dom';

interface GetColumnsProps {
  onEdit: (document: Document) => void;
  onEditFullScreen: (document: Document) => void;
  onToggle: (document: Document) => void;
  onView: (document: Document) => void;
  currentUserId: number;
  isEmployee: boolean;
}

export const getDocumentColumns = ({
  onEdit,
  onEditFullScreen,
  onToggle,
  onView,
  currentUserId,
  isEmployee
}: GetColumnsProps): Column<Document>[] => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleViewVersions = (document: Document) => {
    navigate(`/documents/${document.documentId}/versions`);
  };

  const baseColumns: Column<Document>[] = [
    {
      header: t('title'),
      accessor: (document) => (
        <div className="flex items-center">
          <FileText className="h-5 w-5 text-blue-500 mr-2" />
          <div className="text-sm font-medium text-gray-900 dark:text-white">
            {document.title}
          </div>
        </div>
      )
    },
    {
      header: t('format'),
      accessor: (document) => (
        <div className="text-sm text-gray-500 dark:text-gray-300">
          {document.format.toUpperCase()}
        </div>
      )
    },
    {
      header: t('createdAt'),
      accessor: (document) => (
        <div className="text-sm text-gray-500 dark:text-gray-300">
          {formatDateString(document.createdAt)}
        </div>
      )
    },
    {
      header: t('updatedAt'),
      accessor: (document) => (
        <div className="text-sm text-gray-500 dark:text-gray-300">
          {formatDateString(document.updatedAt)}
        </div>
      )
    },
    {
      header: t('status'),
      accessor: (document) => (
        <StatusBadge
          label={document.isActive ? t('active') : t('inactive')}
          variant={document.isActive ? 'success' : 'danger'}
        />
      )
    }
  ];

  // Coluna de ações - só mostra se não for um funcionário ou se o usuário for dono do documento
  baseColumns.push({
    header: t('actions'),
    accessor: (document) => {
      // Usuário só pode editar/ativar/desativar documentos que ele criou, a menos que seja administrador (perfil 1 ou 2)
      const canModify = document.userId === currentUserId || !isEmployee;
      
      return (
        <div className="flex space-x-2">
          <button
            onClick={() => onView(document)}
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
            title={t('viewDocument')}
          >
            <Eye className="h-5 w-5" />
          </button>
          
          <button
            onClick={() => handleViewVersions(document)}
            className="text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 transition-colors duration-200"
            title={t('documentVersions')}
          >
            <Clock className="h-5 w-5" />
          </button>
          
          {canModify && (
            <div className="flex space-x-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(document);
                }}
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
                title={t('editDocument')}
              >
                <Edit className="h-5 w-5" />
              </button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEditFullScreen(document);
                }}
                className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 transition-colors duration-200"
                title={t('editFullScreen')}
              >
                <Maximize className="h-5 w-5" />
              </button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggle(document);
                }}
                className={`text-${document.isActive ? 'red' : 'green'}-600 hover:text-${document.isActive ? 'red' : 'green'}-800 dark:text-${document.isActive ? 'red' : 'green'}-400 dark:hover:text-${document.isActive ? 'red' : 'green'}-300 transition-colors duration-200`}
                title={document.isActive ? t('deactivateDocument') : t('activateDocument')}
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={document.isActive 
                    ? "M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" 
                    : "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"} />
                </svg>
              </button>
            </div>
          )}
        </div>
      );
    },
    className: 'text-right'
  });
  
  return baseColumns;
};