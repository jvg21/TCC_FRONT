// src/components/document/VersionCompare.tsx - Componente para comparação avançada de versões
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  GitCompare, 
  ArrowLeft, 
  ArrowRight, 
  Plus, 
  Minus, 
  Download,
  Calendar,
  User,
  MessageSquare,
  FileText
} from 'lucide-react';
import { DocumentVersion, Document } from '../../types/document';
import { User as UserType } from '../../types/user';
import { useUserStore } from '../../store/userStore';
import { useDocumentStore } from '../../store/documentStore';
import { formatDateString } from '../../utils/formatDateString';

interface VersionCompareProps {
  version1: DocumentVersion;
  version2: DocumentVersion;
  onClose: () => void;
}

interface DiffResult {
  type: 'added' | 'removed' | 'modified' | 'unchanged';
  content: string;
  lineNumber?: number;
}

export const VersionCompare = ({ version1, version2, onClose }: VersionCompareProps) => {
  const { t } = useTranslation();
  const { users, fetchUsers, getUser } = useUserStore();
  const { getDocument } = useDocumentStore();
  
  const [diffResults, setDiffResults] = useState<DiffResult[]>([]);
  const [viewMode, setViewMode] = useState<'side-by-side' | 'unified'>('side-by-side');
  const [loading, setLoading] = useState(true);

  // Buscar informações do documento e usuários
  const document = getDocument(version1.documentId);
  const user1 = getUser(version1.userId);
  const user2 = getUser(version2.userId);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Carregar usuários se não estiverem carregados
        if (users.length === 0) {
          await fetchUsers();
        }
        generateDiff();
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [version1, version2, users.length, fetchUsers]);

  // Função simples para gerar diff (implementação básica)
  const generateDiff = () => {
    const lines1 = version1.content.split('\n');
    const lines2 = version2.content.split('\n');
    const maxLines = Math.max(lines1.length, lines2.length);
    const results: DiffResult[] = [];

    for (let i = 0; i < maxLines; i++) {
      const line1 = lines1[i] || '';
      const line2 = lines2[i] || '';

      if (line1 === line2) {
        results.push({
          type: 'unchanged',
          content: line1,
          lineNumber: i + 1
        });
      } else if (!line1 && line2) {
        results.push({
          type: 'added',
          content: line2,
          lineNumber: i + 1
        });
      } else if (line1 && !line2) {
        results.push({
          type: 'removed',
          content: line1,
          lineNumber: i + 1
        });
      } else {
        results.push({
          type: 'modified',
          content: line2,
          lineNumber: i + 1
        });
      }
    }

    setDiffResults(results);
  };

  // Estatísticas das diferenças
  const stats = {
    added: diffResults.filter(r => r.type === 'added').length,
    removed: diffResults.filter(r => r.type === 'removed').length,
    modified: diffResults.filter(r => r.type === 'modified').length,
    unchanged: diffResults.filter(r => r.type === 'unchanged').length
  };

  // Exportar comparação
  const handleExportDiff = () => {
    const documentTitle = document?.title || t('unknownDocument');
    const diffContent = [
      `${t('documentComparison')}: ${documentTitle}`,
      `${t('version')} ${version1.documentVersionId} vs ${t('version')} ${version2.documentVersionId}`,
      `${t('generatedAt')}: ${new Date().toLocaleString()}`,
      '',
      `${t('statistics')}:`,
      `${t('linesAdded')}: ${stats.added}`,
      `${t('linesRemoved')}: ${stats.removed}`,
      `${t('linesModified')}: ${stats.modified}`,
      '',
      '--- DIFF ---',
      '',
      ...diffResults.map(result => {
        const prefix = {
          'added': '+ ',
          'removed': '- ',
          'modified': '~ ',
          'unchanged': '  '
        }[result.type];
        
        return `${prefix}${result.content}`;
      })
    ].join('\n');

    const element = document.createElement('a');
    const blob = new Blob([diffContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(blob);
    element.download = `${documentTitle}_compare_v${version1.documentVersionId}_vs_v${version2.documentVersionId}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white rounded-lg p-8">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
            <span className="text-gray-900">{t('loadingComparison')}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-7xl h-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <GitCompare className="h-6 w-6 text-blue-500" />
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {t('compareVersions')}
              </h2>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <FileText className="h-4 w-4" />
                <span>{document?.title || t('unknownDocument')}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('side-by-side')}
                className={`px-3 py-1 text-sm rounded ${
                  viewMode === 'side-by-side' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {t('sideBySide')}
              </button>
              <button
                onClick={() => setViewMode('unified')}
                className={`px-3 py-1 text-sm rounded ${
                  viewMode === 'unified' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {t('unified')}
              </button>
            </div>
            <button
              onClick={handleExportDiff}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors"
              title={t('exportDiff')}
            >
              <Download className="h-5 w-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
            >
              ×
            </button>
          </div>
        </div>

        {/* Version Info */}
        <div className="grid grid-cols-2 gap-6 p-6 bg-gray-50 border-b border-gray-200">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <span className="font-medium text-gray-900">
                {t('version')} {version1.documentVersionId}
              </span>
              <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
                {t('older')}
              </span>
            </div>
            <div className="grid grid-cols-1 gap-2 text-sm">
              <div className="flex items-center space-x-2 text-gray-600">
                <Calendar className="h-3 w-3" />
                <span>{formatDateString(version1.createdAt)}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <User className="h-3 w-3" />
                <span>{user1?.name || `${t('userId')} ${version1.userId}`}</span>
              </div>
              {version1.comment && (
                <div className="flex items-start space-x-2 text-gray-600">
                  <MessageSquare className="h-3 w-3 mt-0.5 flex-shrink-0" />
                  <span className="text-xs break-words">{version1.comment}</span>
                </div>
              )}
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <span className="font-medium text-gray-900">
                {t('version')} {version2.documentVersionId}
              </span>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                {t('newer')}
              </span>
            </div>
            <div className="grid grid-cols-1 gap-2 text-sm">
              <div className="flex items-center space-x-2 text-gray-600">
                <Calendar className="h-3 w-3" />
                <span>{formatDateString(version2.createdAt)}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <User className="h-3 w-3" />
                <span>{user2?.name || `${t('userId')} ${version2.userId}`}</span>
              </div>
              {version2.comment && (
                <div className="flex items-start space-x-2 text-gray-600">
                  <MessageSquare className="h-3 w-3 mt-0.5 flex-shrink-0" />
                  <span className="text-xs break-words">{version2.comment}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="flex items-center justify-center space-x-8 p-4 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Plus className="h-4 w-4 text-green-600" />
            <span className="text-sm text-gray-700">
              {stats.added} {t('linesAdded')}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Minus className="h-4 w-4 text-red-600" />
            <span className="text-sm text-gray-700">
              {stats.removed} {t('linesRemoved')}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <ArrowRight className="h-4 w-4 text-yellow-600" />
            <span className="text-sm text-gray-700">
              {stats.modified} {t('linesModified')}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">
              {t('totalLines')}: {diffResults.length}
            </span>
          </div>
        </div>

        {/* Content Comparison */}
        <div className="flex-1 overflow-hidden">
          {viewMode === 'side-by-side' ? (
            <div className="grid grid-cols-2 h-full">
              <div className="border-r border-gray-200 overflow-y-auto">
                <div className="p-4">
                  <div className="sticky top-0 bg-white border-b border-gray-200 pb-2 mb-4">
                    <h3 className="font-medium text-gray-900 flex items-center space-x-2">
                      <span>{t('version')} {version1.documentVersionId}</span>
                      <span className="text-sm text-gray-500">
                        ({user1?.name || `${t('userId')} ${version1.userId}`})
                      </span>
                    </h3>
                  </div>
                  <div className="space-y-1 font-mono text-sm">
                    {version1.content.split('\n').map((line, index) => {
                      const diffLine = diffResults.find(d => d.lineNumber === index + 1);
                      const bgColor = diffLine ? {
                        'removed': 'bg-red-50 border-l-4 border-red-400',
                        'modified': 'bg-yellow-50 border-l-4 border-yellow-400',
                        'unchanged': '',
                        'added': ''
                      }[diffLine.type] : '';

                      return (
                        <div
                          key={index}
                          className={`flex items-start space-x-2 py-1 px-2 ${bgColor}`}
                        >
                          <span className="text-gray-400 w-8 text-right flex-shrink-0">
                            {index + 1}
                          </span>
                          <span className="flex-1 whitespace-pre-wrap break-words">
                            {line || ' '}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="overflow-y-auto">
                <div className="p-4">
                  <div className="sticky top-0 bg-white border-b border-gray-200 pb-2 mb-4">
                    <h3 className="font-medium text-gray-900 flex items-center space-x-2">
                      <span>{t('version')} {version2.documentVersionId}</span>
                      <span className="text-sm text-gray-500">
                        ({user2?.name || `${t('userId')} ${version2.userId}`})
                      </span>
                    </h3>
                  </div>
                  <div className="space-y-1 font-mono text-sm">
                    {version2.content.split('\n').map((line, index) => {
                      const diffLine = diffResults.find(d => d.lineNumber === index + 1);
                      const bgColor = diffLine ? {
                        'added': 'bg-green-50 border-l-4 border-green-400',
                        'modified': 'bg-yellow-50 border-l-4 border-yellow-400',
                        'unchanged': '',
                        'removed': ''
                      }[diffLine.type] : '';

                      return (
                        <div
                          key={index}
                          className={`flex items-start space-x-2 py-1 px-2 ${bgColor}`}
                        >
                          <span className="text-gray-400 w-8 text-right flex-shrink-0">
                            {index + 1}
                          </span>
                          <span className="flex-1 whitespace-pre-wrap break-words">
                            {line || ' '}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full overflow-y-auto p-4">
              <div className="sticky top-0 bg-white border-b border-gray-200 pb-2 mb-4">
                <h3 className="font-medium text-gray-900">
                  {t('unifiedDiff')}
                </h3>
                <p className="text-sm text-gray-500">
                  {t('showingChangesBetween')} {t('version')} {version1.documentVersionId} → {version2.documentVersionId}
                </p>
              </div>
              <div className="space-y-1 font-mono text-sm">
                {diffResults.map((result, index) => {
                  const bgColor = {
                    'added': 'bg-green-50 border-l-4 border-green-400',
                    'removed': 'bg-red-50 border-l-4 border-red-400',
                    'modified': 'bg-yellow-50 border-l-4 border-yellow-400',
                    'unchanged': 'bg-white'
                  }[result.type];

                  const textColor = {
                    'added': 'text-green-800',
                    'removed': 'text-red-800',
                    'modified': 'text-yellow-800',
                    'unchanged': 'text-gray-700'
                  }[result.type];

                  const icon = {
                    'added': <Plus className="h-3 w-3" />,
                    'removed': <Minus className="h-3 w-3" />,
                    'modified': <ArrowRight className="h-3 w-3" />,
                    'unchanged': null
                  }[result.type];

                  return (
                    <div
                      key={index}
                      className={`flex items-start space-x-2 py-1 px-2 ${bgColor}`}
                    >
                      <span className="text-gray-400 w-8 text-right flex-shrink-0">
                        {result.lineNumber}
                      </span>
                      <div className="w-4 flex justify-center flex-shrink-0">
                        {icon && (
                          <span className={textColor}>
                            {icon}
                          </span>
                        )}
                      </div>
                      <span className={`flex-1 whitespace-pre-wrap break-words ${textColor}`}>
                        {result.content || ' '}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              <span>{t('document')}: {document?.title || t('unknownDocument')}</span>
              <span className="mx-2">•</span>
              <span>{t('comparing')} {version1.documentVersionId} → {version2.documentVersionId}</span>
              <span className="mx-2">•</span>
              <span>{diffResults.length} {t('totalLines')}</span>
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              {t('close')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};