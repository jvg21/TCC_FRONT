// src/components/editor/MarkdownEditor.tsx - Seguindo padrões do projeto com traduções
import React, { useState, useRef, useEffect } from 'react';
import { 
  Bold, Italic, Strikethrough, Link, Image, Code, List, ListOrdered, 
  Quote, Hash, Split, Eye, EyeOff, Download, Copy, Maximize2, Minimize2,
  Type, Palette
} from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  height?: string;
  showToolbar?: boolean;
  autoFocus?: boolean;
  disableFullscreen?: boolean;
}

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  value,
  onChange,
  placeholder,
  height = "h-96",
  showToolbar = true,
  autoFocus = false,
  disableFullscreen = false
}) => {
  const { t } = useLanguage();
  const [showPreview, setShowPreview] = useState(true);
  const [splitView, setSplitView] = useState(true);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showFontMenu, setShowFontMenu] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Placeholder padrão traduzido
  const defaultPlaceholder = placeholder || t('typeMarkdownHere') || 'Digite seu markdown aqui...';

  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [autoFocus]);

  const insertText = (before: string, after = '', placeholder = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end) || placeholder;
    
    const newText = value.substring(0, start) + before + selectedText + after + value.substring(end);
    onChange(newText);
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length);
    }, 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // PROTEÇÃO: Bloquear Ctrl+S para evitar salvamento acidental
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    // PROTEÇÃO: Bloquear Enter em certas condições que podem submeter formulário
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    // Atalhos de formatação permitidos
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault();
          e.stopPropagation();
          insertText('**', '**', t('boldText') || 'texto em negrito');
          break;
        case 'i':
          e.preventDefault();
          e.stopPropagation();
          insertText('*', '*', t('italicText') || 'texto em itálico');
          break;
        case 'k':
          e.preventDefault();
          e.stopPropagation();
          insertText('[', '](url)', t('linkText') || 'texto do link');
          break;
        case '`':
          e.preventDefault();
          e.stopPropagation();
          insertText('`', '`', t('codeText') || 'código');
          break;
      }
    }
    
    // Tab para indentação
    if (e.key === 'Tab') {
      e.preventDefault();
      e.stopPropagation();
      insertText('  ');
    }
  };

  const renderMarkdown = (text: string) => {
    let html = text
      // Headers
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold text-gray-900 dark:text-white mb-3">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">$1</h1>')
      // Bold
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900 dark:text-white">$1</strong>')
      .replace(/__(.*?)__/g, '<strong class="font-semibold text-gray-900 dark:text-white">$1</strong>')
      // Italic
      .replace(/\*(.*?)\*/g, '<em class="italic text-gray-900 dark:text-white">$1</em>')
      .replace(/_(.*?)_/g, '<em class="italic text-gray-900 dark:text-white">$1</em>')
      // Strikethrough
      .replace(/~~(.*?)~~/g, '<del class="line-through text-gray-600 dark:text-gray-400">$1</del>')
      // Cores (HTML tags personalizadas)
      .replace(/<color=(.*?)>(.*?)<\/color>/g, '<span style="color: $1">$2</span>')
      // Fontes (HTML tags personalizadas)
      .replace(/<font=(.*?)>(.*?)<\/font>/g, '<span style="font-family: $1">$2</span>')
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
      .replace(/^\d+\. (.*$)/gim, '<li class="ml-4 mb-1 text-gray-900 dark:text-white">$1</li>')
      // Listas não ordenadas
      .replace(/^- (.*$)/gim, '<li class="ml-4 mb-1 list-disc text-gray-900 dark:text-white">$1</li>')
      // Checkboxes
      .replace(/^- \[ \] (.*$)/gim, '<div class="flex items-center mb-1"><input type="checkbox" class="mr-2 rounded" disabled> <span class="text-gray-900 dark:text-white">$1</span></div>')
      .replace(/^- \[x\] (.*$)/gim, '<div class="flex items-center mb-1"><input type="checkbox" class="mr-2 rounded" checked disabled> <span class="line-through text-gray-500 dark:text-gray-400">$1</span></div>')
      // Quebras de linha
      .replace(/\n/g, '<br />');

    // Code blocks
    html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
      return `<pre class="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto my-4 border border-gray-200 dark:border-gray-700"><code class="text-sm font-mono text-gray-800 dark:text-gray-200">${code.trim()}</code></pre>`;
    });

    // Tabelas
    if (html.includes('|')) {
      html = html.replace(/((\|.*\|\n?)+)/g, (match) => {
        const rows = match.trim().split('\n');
        if (rows.length < 2) return match;
        
        const headerRow = rows[0];
        const separatorRow = rows[1];
        const dataRows = rows.slice(2);
        
        if (!separatorRow.includes('---')) return match;
        
        let tableHtml = '<table class="border-collapse border border-gray-300 dark:border-gray-600 w-full my-4 text-sm">';
        
        // Header
        tableHtml += '<thead class="bg-gray-50 dark:bg-gray-700">';
        tableHtml += '<tr>';
        headerRow.split('|').slice(1, -1).forEach(cell => {
          tableHtml += `<th class="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left font-semibold text-gray-900 dark:text-white">${cell.trim()}</th>`;
        });
        tableHtml += '</tr>';
        tableHtml += '</thead>';
        
        // Body
        tableHtml += '<tbody>';
        dataRows.forEach(row => {
          tableHtml += '<tr class="hover:bg-gray-50 dark:hover:bg-gray-800">';
          row.split('|').slice(1, -1).forEach(cell => {
            tableHtml += `<td class="border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-900 dark:text-white">${cell.trim()}</td>`;
          });
          tableHtml += '</tr>';
        });
        tableHtml += '</tbody>';
        tableHtml += '</table>';
        
        return tableHtml;
      });
    }

    return html;
  };

  // Funções de download
  const downloadAsMarkdown = () => {
    const blob = new Blob([value], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'documento.md';
    a.click();
    URL.revokeObjectURL(url);
    setShowDownloadMenu(false);
  };

  const downloadAsHTML = () => {
    const html = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Documento</title>
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
    ${renderMarkdown(value)}
</body>
</html>`;
    
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'documento.html';
    a.click();
    URL.revokeObjectURL(url);
    setShowDownloadMenu(false);
  };

  const downloadAsText = () => {
    // Remover markdown e manter apenas texto
    const textContent = value
      .replace(/[#*`~]/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
      .replace(/<color=.*?>(.*?)<\/color>/g, '$1')
      .replace(/<font=.*?>(.*?)<\/font>/g, '$1');
    
    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'documento.txt';
    a.click();
    URL.revokeObjectURL(url);
    setShowDownloadMenu(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(value);
  };

  // Fontes predefinidas
  const fonts = [
    'Arial', 'Times New Roman', 'Courier New', 'Helvetica', 'Georgia', 
    'Verdana', 'Comic Sans MS', 'Impact', 'Trebuchet MS', 'Palatino'
  ];

  const insertFont = (font: string) => {
    insertText(`<font=${font}>`, '</font>', t('text') || 'texto com fonte');
    setShowFontMenu(false);
  };

  const toolbar = showToolbar && (
    <div className="flex flex-wrap items-center gap-1 p-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
      {/* Formatação básica */}
      <button 
        type="button"
        onClick={() => insertText('**', '**', t('boldText') || 'negrito')} 
        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-700 dark:text-gray-300" 
        title={t('boldTooltip') || 'Negrito (Ctrl+B)'}
      >
        <Bold size={16} />
      </button>
      <button 
        type="button" 
        onClick={() => insertText('*', '*', t('italicText') || 'itálico')} 
        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-700 dark:text-gray-300" 
        title={t('italicTooltip') || 'Itálico (Ctrl+I)'}
      >
        <Italic size={16} />
      </button>
      <button 
        type="button" 
        onClick={() => insertText('~~', '~~', t('strikethroughText') || 'tachado')} 
        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-700 dark:text-gray-300" 
        title={t('strikethroughTooltip') || 'Tachado'}
      >
        <Strikethrough size={16} />
      </button>
      
      {/* Fonte */}
      <div className="relative">
        <button 
          type="button" 
          onClick={() => setShowFontMenu(!showFontMenu)}
          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-700 dark:text-gray-300" 
          title={t('fontTooltip') || 'Fonte'}
        >
          <Type size={16} />
        </button>
        {showFontMenu && (
          <div className="absolute top-10 left-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg p-2 z-50 w-40">
            <div className="max-h-48 overflow-y-auto">
              {fonts.map((font) => (
                <button
                  key={font}
                  type="button"
                  onClick={() => insertFont(font)}
                  className="block w-full text-left px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-sm text-gray-700 dark:text-gray-300"
                  style={{ fontFamily: font }}
                >
                  {font}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1"></div>
      
      {/* Headers */}
      <button 
        type="button" 
        onClick={() => insertText('# ', '', t('header1') || 'Título')} 
        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-xs font-bold text-gray-700 dark:text-gray-300" 
        title={t('header1Tooltip') || 'Título H1'}
      >
        H1
      </button>
      <button 
        type="button" 
        onClick={() => insertText('## ', '', t('header2') || 'Subtítulo')} 
        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-xs font-bold text-gray-700 dark:text-gray-300" 
        title={t('header2Tooltip') || 'Título H2'}
      >
        H2
      </button>
      <button 
        type="button" 
        onClick={() => insertText('### ', '', t('header3') || 'Título')} 
        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-xs font-bold text-gray-700 dark:text-gray-300" 
        title={t('header3Tooltip') || 'Título H3'}
      >
        H3
      </button>
      <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1"></div>
      
      {/* Elementos */}
      <button 
        type="button" 
        onClick={() => insertText('`', '`', t('codeText') || 'código')} 
        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-700 dark:text-gray-300" 
        title={t('codeTooltip') || 'Código inline'}
      >
        <Code size={16} />
      </button>
      <button 
        type="button" 
        onClick={() => insertText('[', '](url)', t('linkText') || 'texto do link')} 
        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-700 dark:text-gray-300" 
        title={t('linkTooltip') || 'Link (Ctrl+K)'}
      >
        <Link size={16} />
      </button>
      <button 
        type="button" 
        onClick={() => insertText('![' + (t('imageAlt') || 'alt') + '](', ')', t('imageUrl') || 'url-da-imagem')} 
        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-700 dark:text-gray-300" 
        title={t('imageTooltip') || 'Imagem'}
      >
        <Image size={16} />
      </button>
      <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1"></div>
      
      {/* Listas */}
      <button 
        type="button" 
        onClick={() => insertText('- ', '', t('listItem') || 'item da lista')} 
        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-700 dark:text-gray-300" 
        title={t('listTooltip') || 'Lista'}
      >
        <List size={16} />
      </button>
      <button 
        type="button" 
        onClick={() => insertText('1. ', '', t('numberedItem') || 'item numerado')} 
        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-700 dark:text-gray-300" 
        title={t('numberedListTooltip') || 'Lista numerada'}
      >
        <ListOrdered size={16} />
      </button>
      <button 
        type="button" 
        onClick={() => insertText('- [ ] ', '', t('task') || 'tarefa')} 
        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-700 dark:text-gray-300" 
        title={t('checkboxTooltip') || 'Checkbox'}
      >
        <input type="checkbox" className="w-4 h-4" disabled />
      </button>
      <button 
        type="button" 
        onClick={() => insertText('> ', '', t('citation') || 'citação')} 
        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-700 dark:text-gray-300" 
        title={t('quoteTooltip') || 'Citação'}
      >
        <Quote size={16} />
      </button>
      <button 
        type="button" 
        onClick={() => insertText('#', '', t('tag') || 'tag')} 
        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-700 dark:text-gray-300" 
        title={t('tagTooltip') || 'Tag'}
      >
        <Hash size={16} />
      </button>
      
      <div className="ml-auto flex items-center gap-1">
        {/* Controles de visualização */}
        <button 
          type="button" 
          onClick={() => setSplitView(!splitView)} 
          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-700 dark:text-gray-300" 
          title={t('splitViewTooltip') || 'Dividir vista'}
        >
          <Split size={16} />
        </button>
        <button 
          type="button" 
          onClick={() => setShowPreview(!showPreview)} 
          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-700 dark:text-gray-300" 
          title={t('togglePreviewTooltip') || 'Alternar Visualização'}
        >
          {showPreview ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
        
        {/* Menu de download */}
        <div className="relative">
          <button 
            type="button" 
            onClick={() => setShowDownloadMenu(!showDownloadMenu)}
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-700 dark:text-gray-300" 
            title={t('downloadTooltip') || 'Download'}
          >
            <Download size={16} />
          </button>
          {showDownloadMenu && (
            <div className="absolute top-10 right-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg p-2 z-50 w-32">
              <button
                type="button"
                onClick={downloadAsMarkdown}
                className="block w-full text-left px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-sm text-gray-700 dark:text-gray-300"
              >
                {t('markdown') || 'Markdown'}
              </button>
              <button
                type="button"
                onClick={downloadAsHTML}
                className="block w-full text-left px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-sm text-gray-700 dark:text-gray-300"
              >
                {t('html') || 'HTML'}
              </button>
              <button
                type="button"
                onClick={downloadAsText}
                className="block w-full text-left px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-sm text-gray-700 dark:text-gray-300"
              >
                {t('text') || 'Texto'}
              </button>
            </div>
          )}
        </div>
        
        <button 
          type="button" 
          onClick={copyToClipboard}
          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-700 dark:text-gray-300" 
          title={t('copyTooltip') || 'Copiar'}
        >
          <Copy size={16} />
        </button>
      </div>
    </div>
  );

  return (
    <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden bg-white dark:bg-gray-900">
      {toolbar}
      
      <div className={`flex ${splitView && showPreview ? 'divide-x divide-gray-200 dark:divide-gray-700' : ''} ${height}`}>
        {/* Editor */}
        <div className={`${splitView && showPreview ? 'w-1/2' : 'w-full'} flex flex-col`}>
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={defaultPlaceholder}
            className="flex-1 p-4 border-none resize-none focus:outline-none bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          />
        </div>
        
        {/* Preview */}
        {showPreview && (
          <div className={`${splitView ? 'w-1/2' : 'w-full'} p-4 overflow-y-auto bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white`}>
            <div 
              className="prose prose-sm max-w-none dark:prose-invert"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(value) }}
            />
          </div>
        )}
      </div>
    </div>
  );
};