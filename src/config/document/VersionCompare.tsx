// src/config/document/VersionCompare.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { DocumentVersion } from '../../types/document';
import { formatDateString } from '../../utils/formatDateString';

interface VersionCompareProps {
  version1: DocumentVersion;
  version2: DocumentVersion;
  className?: string;
}

export const VersionCompare: React.FC<VersionCompareProps> = ({ 
  version1, 
  version2, 
  className = '' 
}) => {
  const { t } = useTranslation();

  // Função simples para calcular diferenças de texto
  const calculateDifferences = (text1: string, text2: string) => {
    const words1 = text1.replace(/<[^>]*>/g, '').split(/\s+/);
    const words2 = text2.replace(/<[^>]*>/g, '').split(/\s+/);
    
    const totalWords = Math.max(words1.length, words2.length);
    const commonWords = words1.filter(word => words2.includes(word)).length;
    
    return {
      similarity: totalWords > 0 ? Math.round((commonWords / totalWords) * 100) : 100,
      wordsAdded: words2.length - words1.length,
      lengthDiff: text2.length - text1.length
    };
  };

  const differences = calculateDifferences(version1.content, version2.content);

  return (
    <>
    <div className={`space-y-6 ${className}`}>
      {/* Estatísticas da comparação */}
      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
          {t('comparisonStats')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-500 dark:text-gray-400">{t('similarity')}:</span>
            <span className="ml-2 font-medium">{differences.similarity}%</span>
          </div>
          <div>
            <span className="text-gray-500 dark:text-gray-400">{t('wordsChanged')}:</span>
            <span className={`ml-2 font-medium ${differences.wordsAdded >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {differences.wordsAdded >= 0 ? '+' : ''}{differences.wordsAdded}
            </span>
          </div>
          <div>
            <span className="text-gray-500 dark:text-gray-400">{t('sizeChange')}:</span>
            <span className={`ml-2 font-medium ${differences.lengthDiff >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {differences.lengthDiff >= 0 ? '+' : ''}{differences.lengthDiff} {t('characters')}
            </span>
          </div>
        </div>
      </div>

      {/* Comparação lado a lado */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Versão 1 */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {t('version')} {version1.documentVersionId}
            </h3>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {formatDateString(version1.createdAt)}
            </span>
          </div>
          
          <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded-lg">
            <div className="prose dark:prose-invert max-w-none text-sm">
              <div dangerouslySetInnerHTML={{ __html: version1.content }} />
            </div>
          </div>
          
          {version1.comment && (
            <div className="text-sm text-gray-600 dark:text-gray-400 italic">
              "{version1.comment}"
            </div>
          )}
        </div>

        {/* Versão 2 */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {t('version')} {version2.documentVersionId}
            </h3>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {formatDateString(version2.createdAt)}
            </span>
          </div>
          
          <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-4 rounded-lg">
            <div className="prose dark:prose-invert max-w-none text-sm">
              <div dangerouslySetInnerHTML={{ __html: version2.content }} />
            </div>
          </div>
          
          {version2.comment && (
            <div className="text-sm text-gray-600 dark:text-gray-400 italic">
              "{version2.comment}"
            </div>
          )}
        </div>
      </div>

      {/* Legenda */}
      <div className="flex justify-center space-x-6 text-sm">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-red-200 border-l-4 border-red-500 mr-2"></div>
          <span className="text-gray-600 dark:text-gray-400">{t('olderVersion')}</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-green-200 border-l-4 border-green-500 mr-2"></div>
          <span className="text-gray-600 dark:text-gray-400">{t('newerVersion')}</span>
        </div>
      </div>
    </div>
    </>
  );
};
