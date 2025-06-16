// src/config/document/DocumentViewer.tsx - Seguindo padrões do projeto
import { useState } from 'react';
import { Document } from '../../types/document';
import { useLanguage } from '../../hooks/useLanguage';
import { Modal } from '../../components/forms/Modal';
import { FullScreenModal } from '../../components/forms/FullScreenModal';
import { formatDateString } from '../../utils/formatDateString';
import { FileText, Calendar, User, Folder, Maximize2, Minimize2, Download, Eye, EyeOff } from 'lucide-react';

interface DocumentViewerProps {
  document: Document;
  isOpen: boolean;
  onClose: () => void;
}

export const DocumentViewer = ({ document, isOpen, onClose }: DocumentViewerProps) => {
  const { t } = useLanguage();
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showRawMarkdown, setShowRawMarkdown] = useState(false);

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  const toggleRawMarkdown = () => {
    setShowRawMarkdown(!showRawMarkdown);
  };

  const downloadDocument = () => {
    const element = document.createElement('a');
    const blob = new Blob([document.content], { type: 'text/markdown' });
    element.href = URL.createObjectURL(blob);
    element.download = `${document.title}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const downloadAsHTML = () => {
    const html = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${document.title}</title>
    <style>
        body { font-family: system-ui, -apple-system, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px; }
        h1, h2, h3 { color: #333; }
        code { background: #f4f4f4; padding: 2px 4px; border-radius: 3px; }
        pre { background: #f4f4f4; padding: 16px; border-radius: 6px; overflow-x: auto; }
        blockquote { border-left: 4px solid #ddd; margin: 0; padding-left: 16px; color: #666; }
        table { border-collapse: collapse; width: 100%; }
        td, th { border: 1px solid #ddd; padding: 8px; text-align: left; }
    </style>
</head>
<body>
    ${renderMarkdown(document.content)}
</body>
</html>`;
    
    const element = document.createElement('a');
    const blob = new Blob([html], { type: 'text/html' });
    element.href = URL.createObjectURL(blob);
    element.download = `${document.title}.html`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const renderMarkdown = (text: string) => {
    let html = text
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
      // Links internos (wikilinks)
      .replace(/\[\[([^\]]+)\]\]/g, '<span class="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-sm">$1</span>')
      // Tags
      .replace(/#(\w+)/g, '<span class="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-1 rounded text-sm">#$1</span>')
      // Blockquotes
      .replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-gray-300 dark:border-gray-600 pl-4 py-2 my-2 italic text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800">$1</blockquote>')
      // Listas ordenadas
      .replace(/^\d+\. (.*$)/gim, '<li class="ml-4 mb-1">$1</li>')
      // Listas não ordenadas
      .replace(/^- (.*$)/gim, '<li class="ml-4 mb-1 list-disc">$1</li>')
      // Checkboxes
      .replace(/^- \[ \] (.*$)/gim, '<div class="flex items-center mb-1"><input type="checkbox" class="mr-2 rounded" disabled> <span>$1</span></div>')
      .replace(/^- \[x\] (.*$)/gim, '<div class="flex items-center mb-1"><input type="checkbox" class="mr-2 rounded" checked disabled> <span class="line-through text-gray-500">$1</span></div>')
      // Quebras de linha
      .replace(/\n/g, '<br />');

    // Code blocks
    html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
      return `<pre class="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto my-4 border border-gray-200 dark:border-gray-700"><code class="text-sm font-mono text-gray-800 dark:text-gray-200">${code.trim()}</code></pre>`;
    });

    return html;
  };

  const documentInfo = (
    <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <FileText className="h-6 w-6 text-blue-500 mr-2" />
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">{document.title}</h1>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={toggleRawMarkdown}
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
            title={showRawMarkdown ? "Show Rendered" : "Show Raw Markdown"}
          >
            {showRawMarkdown ? <Eye size={16} /> : <EyeOff size={16} />}
          </button>
          
          <button
            onClick={downloadDocument}
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
            title="Download Markdown"
          >
            <Download size={16} />
          </button>
          
          <button
            onClick={downloadAsHTML}
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
            title="Download HTML"
          >
            <Download size={16} />
          </button>
          
          {!isFullScreen && (
            <button
              onClick={toggleFullScreen}
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
              title="Full Screen"
            >
              <Maximize2 size={16} />
            </button>
          )}
          
          {isFullScreen && (
            <button
              onClick={toggleFullScreen}
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
              title="Exit Full Screen"
            >
              <Minimize2 size={16} />
            </button>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <div className="flex items-center text-gray-600 dark:text-gray-400">
          <Calendar className="h-4 w-4 mr-2" />
          <span>{t('created') || 'Created'}: {formatDateString(document.createdAt)}</span>
        </div>
        
        <div className="flex items-center text-gray-600 dark:text-gray-400">
          <Calendar className="h-4 w-4 mr-2" />
          <span>{t('updated') || 'Updated'}: {formatDateString(document.updatedAt)}</span>
        </div>
        
        <div className="flex items-center text-gray-600 dark:text-gray-400">
          <User className="h-4 w-4 mr-2" />
          <span>{t('author') || 'Author'}: {document.user?.name || 'Unknown'}</span>
        </div>
      </div>
    </div>
  );

  const content = (
    <div className={`flex flex-col ${isFullScreen ? 'h-full' : 'h-[80vh]'}`}>
      {documentInfo}
      
      <div className="flex-1 overflow-y-auto">
        {showRawMarkdown ? (
          <pre className="whitespace-pre-wrap font-mono text-sm bg-gray-100 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            {document.content}
          </pre>
        ) : (
          <div 
            className="prose prose-sm max-w-none dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(document.content) }}
          />
        )}
      </div>
    </div>
  );

  if (isFullScreen) {
    return (
      <FullScreenModal
        isOpen={isOpen}
        onClose={onClose}
        title={`${t('viewDocument') || 'View Document'}: ${document.title}`}
      >
        {content}
      </FullScreenModal>
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${t('viewDocument') || 'View Document'}: ${document.title}`}
      maxWidth="6xl"
    >
      {content}
    </Modal>
  );
};