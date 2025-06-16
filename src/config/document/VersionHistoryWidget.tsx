// src/components/document/VersionHistoryWidget.tsx - Widget compacto para histórico de versões
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Clock, 
  GitBranch, 
  Eye, 
  MessageSquare, 
  ChevronRight,
  FileText,
  User
} from 'lucide-react';
import { DocumentVersion } from '../../types/document';
import { useDocumentVersionStore } from '../../store/documentVersionStore';
import { useUserStore } from '../../store/userStore';
import { formatDateString } from '../../utils/formatDateString';
import { Link } from 'react-router-dom';

interface VersionHistoryWidgetProps {
  documentId: number;
  maxVersions?: number;
  showActions?: boolean;
  onVersionSelect?: (version: DocumentVersion) => void;
}

export const VersionHistoryWidget = ({ 
  documentId, 
  maxVersions = 5, 
  showActions = true,
  onVersionSelect 
}: VersionHistoryWidgetProps) => {
  const { t } = useTranslation();
  const { 
    versions, 
    loading, 
    fetchVersionsByDocumentId,
    clearVersions 
  } = useDocumentVersionStore();
  
  const { users, fetchUsers, getUser } = useUserStore();
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    fetchVersionsByDocumentId(documentId);
    
    // Buscar usuários para mostrar nomes
    if (users.length === 0) {
      fetchUsers();
    }
    
    return () => {
      clearVersions();
    };
  }, [documentId, fetchVersionsByDocumentId, clearVersions, users.length, fetchUsers]);

  // Ordenar versões por data de criação (mais recente primeiro)
  const sortedVersions = [...versions].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  // Versões a serem exibidas
  const displayedVersions = isExpanded 
    ? sortedVersions 
    : sortedVersions.slice(0, maxVersions);

  const hasMoreVersions = sortedVersions.length > maxVersions;

  // Obter estatísticas rápidas
  const latestVersion = sortedVersions[0];
  const totalVersions = versions.length;
  const versionsWithComments = versions.filter(v => v.comment && v.comment.trim()).length;

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-300 rounded w-1/3 mb-3"></div>
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-3 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (versions.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center space-x-2 mb-3">
          <Clock className="h-4 w-4 text-gray-400" />
          <h3 className="text-sm font-medium text-gray-900">
            {t('versionHistory')}
          </h3>
        </div>
        <p className="text-sm text-gray-500">{t('noVersionsYet')}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-blue-500" />
            <h3 className="text-sm font-medium text-gray-900">
              {t('versionHistory')}
            </h3>
          </div>
          {showActions && (
            <Link
              to={`/documents/${documentId}/versions`}
              className="text-xs text-blue-600 hover:text-blue-800 flex items-center space-x-1"
            >
              <span>{t('viewAll')}</span>
              <ChevronRight className="h-3 w-3" />
            </Link>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-gray-900">{totalVersions}</div>
            <div className="text-xs text-gray-500">{t('versions')}</div>
          </div>
          <div>
            <div className="text-lg font-bold text-gray-900">
              {latestVersion ? latestVersion.documentVersionId : 0}
            </div>
            <div className="text-xs text-gray-500">{t('latest')}</div>
          </div>
          <div>
            <div className="text-lg font-bold text-gray-900">{versionsWithComments}</div>
            <div className="text-xs text-gray-500">{t('withComments')}</div>
          </div>
        </div>
      </div>

      {/* Version List */}
      <div className="p-4">
        <div className="space-y-3">
          {displayedVersions.map((version, index) => {
            const isLatest = index === 0;
            const versionUser = getUser(version.userId);
            
            return (
              <div
                key={version.documentVersionId}
                className={`relative pl-6 pb-3 ${
                  index < displayedVersions.length - 1 ? 'border-l-2 border-gray-200' : ''
                }`}
              >
                {/* Timeline dot */}
                <div className={`absolute -left-2 top-1 w-4 h-4 rounded-full border-2 ${
                  isLatest 
                    ? 'bg-blue-500 border-blue-500' 
                    : 'bg-white border-gray-300'
                }`}>
                  {isLatest && (
                    <div className="w-2 h-2 bg-white rounded-full absolute top-1 left-1"></div>
                  )}
                </div>

                {/* Version content */}
                <div 
                  className={`cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors ${
                    onVersionSelect ? 'hover:shadow-sm' : ''
                  }`}
                  onClick={() => onVersionSelect?.(version)}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-3 w-3 text-gray-400" />
                      <span className="text-sm font-medium text-gray-900">
                        v{version.documentVersionId}
                      </span>
                      {isLatest && (
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded">
                          {t('current')}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-500">
                      {formatDateString(version.createdAt)}
                    </span>
                  </div>

                  {version.comment && (
                    <div className="flex items-start space-x-1 mt-1">
                      <MessageSquare className="h-3 w-3 text-gray-400 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-gray-600 line-clamp-2">
                        {version.comment}
                      </p>
                    </div>
                  )}

                  <div className="flex items-center space-x-3 mt-2 text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                      <User className="h-3 w-3" />
                      <span>{versionUser?.name || `${t('userId')} ${version.userId}`}</span>
                    </div>
                    {version.updatedAt !== version.createdAt && (
                      <span>{t('updated')} {formatDateString(version.updatedAt)}</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Show more/less button */}
        {hasMoreVersions && (
          <div className="mt-4 text-center">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center space-x-1 mx-auto"
            >
              <span>
                {isExpanded 
                  ? t('showLess')
                  : t('showMore', { count: sortedVersions.length - maxVersions })
                }
              </span>
              <ChevronRight 
                className={`h-3 w-3 transition-transform ${
                  isExpanded ? 'rotate-90' : ''
                }`} 
              />
            </button>
          </div>
        )}
      </div>

      {/* Quick actions */}
      {showActions && latestVersion && (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">
              {t('lastUpdate')}: {formatDateString(latestVersion.createdAt)}
            </span>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onVersionSelect?.(latestVersion)}
                className="flex items-center space-x-1 text-blue-600 hover:text-blue-800"
              >
                <Eye className="h-3 w-3" />
                <span>{t('view')}</span>
              </button>
              <Link
                to={`/documents/${documentId}/versions`}
                className="flex items-center space-x-1 text-blue-600 hover:text-blue-800"
              >
                <GitBranch className="h-3 w-3" />
                <span>{t('compare')}</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};