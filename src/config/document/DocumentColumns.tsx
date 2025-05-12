// src/config/document/DocumentColumns.tsx
import { Column } from '../../components/common/DataTable';
import { Document } from '../../types/document';
import { ActionButtons } from '../../components/common/ActionButtons';
import { StatusBadge } from '../../components/common/StatusBadge';
import { FileText, Edit } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { formatDateString } from '../../utils/formatDateString';

interface GetColumnsProps {
  onEdit: (document: Document) => void;
  onToggle: (document: Document) => void;
  onView: (document: Document) => void;
  currentUserId: number;
  isEmployee: boolean;
}

export const getDocumentColumns = ({
  onEdit,
  onToggle,
  onView,
  currentUserId,
  isEmployee
}: GetColumnsProps): Column<Document>[] => {
  const { t } = useLanguage();

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
            <FileText className="h-5 w-5" />
          </button>
          
          <ActionButtons
            onEdit={canModify ? () => onEdit(document) : undefined}
            onToggle={canModify ? () => onToggle(document) : undefined}
            isActive={document.isActive}
            showToggle={canModify}
            showDelete={false}
            editTooltip={t('editDocument')}
          />
        </div>
      );
    },
    className: 'text-right'
  });
  
  return baseColumns;
};