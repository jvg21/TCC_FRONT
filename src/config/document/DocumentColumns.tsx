// src/config/document/DocumentColumns.tsx - Seguindo padrões do projeto
import { Column } from '../../components/common/DataTable';
import { Document } from '../../types/document';
import { StatusBadge } from '../../components/common/StatusBadge';
import { FileText, Edit, Eye, Clock } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { formatDateString } from '../../utils/formatDateString';
import { useNavigate } from 'react-router-dom';

interface GetColumnsProps {
  onToggle: (document: Document) => void;
  onView: (document: Document) => void;
  currentUserId: number;
  isEmployee: boolean;
}

export const getDocumentColumns = ({
  onToggle,
  onView,
  currentUserId,
  isEmployee
}: GetColumnsProps): Column<Document>[] => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleEdit = (document: Document) => {
    navigate(`/documents/edit/${document.documentId}`);
  };

  const handleViewVersions = (document: Document) => {
    navigate(`/documents/${document.documentId}/versions`);
  };

  const baseColumns: Column<Document>[] = [
    {
      header: t('title') || 'Title',
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
      header: t('content') || 'Content',
      accessor: (document) => (
        <div className="text-sm text-gray-500 dark:text-gray-300 max-w-xs truncate">
          {document.content.replace(/[#*`]/g, '').substring(0, 100)}...
        </div>
      )
    },
    {
      header: t('createdAt') || 'Created At',
      accessor: (document) => (
        <div className="text-sm text-gray-500 dark:text-gray-300">
          {formatDateString(document.createdAt)}
        </div>
      )
    },
    {
      header: t('updatedAt') || 'Updated At',
      accessor: (document) => (
        <div className="text-sm text-gray-500 dark:text-gray-300">
          {formatDateString(document.updatedAt)}
        </div>
      )
    },
    {
      header: t('status') || 'Status',
      accessor: (document) => (
        <StatusBadge
          label={document.isActive ? (t('active') || 'Active') : (t('inactive') || 'Inactive')}
          variant={document.isActive ? 'success' : 'danger'}
        />
      )
    }
  ];

  // Coluna de ações - só mostra se não for um funcionário ou se o usuário for dono do documento
  baseColumns.push({
    header: t('actions') || 'Actions',
    accessor: (document) => {
      // Usuário só pode editar/ativar/desativar documentos que ele criou, a menos que seja administrador (perfil 1 ou 2)
      const canModify = document.userId === currentUserId || !isEmployee;
      
      return (
        <div className="flex space-x-2">
          <button
            onClick={() => onView(document)}
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
            title={t('viewDocument') || 'View Document'}
          >
            <Eye className="h-5 w-5" />
          </button>
          
          <button
            onClick={() => handleViewVersions(document)}
            className="text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 transition-colors duration-200"
            title={t('documentVersions') || 'Document Versions'}
          >
            <Clock className="h-5 w-5" />
          </button>
          
          {canModify && (
            <div className="flex space-x-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleEdit(document);
                }}
                className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 transition-colors duration-200"
                title={t('editDocument') || 'Edit Document'}
              >
                <Edit className="h-5 w-5" />
              </button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggle(document);
                }}
                className={`text-${document.isActive ? 'red' : 'green'}-600 hover:text-${document.isActive ? 'red' : 'green'}-800 dark:text-${document.isActive ? 'red' : 'green'}-400 dark:hover:text-${document.isActive ? 'red' : 'green'}-300 transition-colors duration-200`}
                title={document.isActive ? (t('deactivateDocument') || 'Deactivate Document') : (t('activateDocument') || 'Activate Document')}
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={document.isActive 
                    ? "M10 14L21 3 12 14l7-7-7 7-7-7 7 7z"
                    : "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"} />
                </svg>
              </button>
            </div>
          )}
        </div>
      );
    }
  });

  return baseColumns;
};