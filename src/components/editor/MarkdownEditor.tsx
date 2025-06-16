// src/components/editor/MarkdownEditor.tsx - Versão completa com downloads e formatação avançada
import React, { useState, useRef, useEffect } from 'react';
import { 
  Bold, Italic, Strikethrough, Code, Link, Image, 
  List, ListOrdered, Quote, Hash, Eye, 
  EyeOff, Download, Split, Copy, ChevronDown, Palette, Type
} from 'lucide-react';

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
  placeholder = "Digite seu markdown aqui...",
  height = "h-96",
  showToolbar = true,
  autoFocus = false,
  disableFullscreen = false
}) => {
  const [showPreview, setShowPreview] = useState(true);
  const [splitView, setSplitView] = useState(true);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showFontMenu, setShowFontMenu] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
          insertText('**', '**', 'texto em negrito');
          break;
        case 'i':
          e.preventDefault();
          e.stopPropagation();
          insertText('*', '*', 'texto em itálico');
          break;
        case 'k':
          e.preventDefault();
          e.stopPropagation();
          insertText('[', '](url)', 'texto do link');
          break;
        case '`':
          e.preventDefault();
          e.stopPropagation();
          insertText('`', '`', 'código');
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
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
      .replace(/__(.*?)__/g, '<strong class="font-semibold">$1</strong>')
      // Italic
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      .replace(/_(.*?)_/g, '<em class="italic">$1</em>')
      // Strikethrough
      .replace(/~~(.*?)~~/g, '<del class="line-through">$1</del>')
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

    // Tables
    html = html.replace(/\|(.+)\|/g, (match, content) => {
      const cells = content.split('|').map((cell: string) => cell.trim());
      const cellElements = cells.map((cell: string) => `<td class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm">${cell}</td>`).join('');
      return `<tr>${cellElements}</tr>`;
    });

    if (html.includes('<tr>')) {
      html = html.replace(/(<tr>.*<\/tr>)/g, '<table class="border-collapse border border-gray-300 dark:border-gray-600 w-full my-4 text-sm">$1</table>');
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

  const downloadAsPDF = () => {
    // Para PDF, vamos criar um HTML otimizado para impressão
    const htmlForPDF = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Documento PDF</title>
    <style>
        @page { margin: 2cm; }
        body { font-family: 'Times New Roman', serif; line-height: 1.6; color: #000; }
        h1, h2, h3 { color: #000; page-break-after: avoid; }
        h1 { font-size: 24px; }
        h2 { font-size: 20px; }
        h3 { font-size: 16px; }
        code { background: #f0f0f0; padding: 2px 4px; border-radius: 3px; }
        pre { background: #f0f0f0; padding: 16px; border-radius: 6px; page-break-inside: avoid; }
        blockquote { border-left: 4px solid #ccc; margin: 0; padding-left: 16px; color: #666; }
        table { border-collapse: collapse; width: 100%; page-break-inside: avoid; }
        td, th { border: 1px solid #000; padding: 8px; text-align: left; }
        img { max-width: 100%; height: auto; }
    </style>
</head>
<body>
    ${renderMarkdown(value)}
    <script>
        window.onload = function() {
            window.print();
            setTimeout(function() {
                window.close();
            }, 1000);
        }
    </script>
</body>
</html>`;
    
    const blob = new Blob([htmlForPDF], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const newWindow = window.open(url, '_blank');
    
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 1000);
    
    setShowDownloadMenu(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(value);
  };

  // // Cores predefinidas
  // const colors = [
  //   '#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF',
  //   '#FFA500', '#800080', '#008000', '#800000', '#000080', '#808000', '#808080'
  // ];

  // Fontes predefinidas
  const fonts = [
    'Arial', 'Times New Roman', 'Courier New', 'Helvetica', 'Georgia', 
    'Verdana', 'Comic Sans MS', 'Impact', 'Trebuchet MS', 'Palatino'
  ];

  // const insertColor = (color: string) => {
  //   insertText(`<color=${color}>`, '</color>', 'texto colorido');
  //   setShowColorPicker(false);
  // };

  const insertFont = (font: string) => {
    insertText(`<font=${font}>`, '</font>', 'texto com fonte');
    setShowFontMenu(false);
  };

  const toolbar = showToolbar && (
    <div className="flex flex-wrap items-center gap-1 p-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
      {/* Formatação básica */}
      <button 
        type="button"
        onClick={() => insertText('**', '**', 'negrito')} 
        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded" 
        title="Negrito (Ctrl+B)"
      >
        <Bold size={16} />
      </button>
      <button 
        type="button" 
        onClick={() => insertText('*', '*', 'itálico')} 
        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded" 
        title="Itálico (Ctrl+I)"
      >
        <Italic size={16} />
      </button>
      <button 
        type="button" 
        onClick={() => insertText('~~', '~~', 'tachado')} 
        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded" 
        title="Tachado"
      >
        <Strikethrough size={16} />
      </button>
      
      {/* Cor do texto */}
      {/* <div className="relative">
        <button 
          type="button" 
          onClick={() => setShowColorPicker(!showColorPicker)}
          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded" 
          title="Cor do texto"
        >
          <Palette size={16} />
        </button>
        {showColorPicker && (
          <div className="absolute top-10 left-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg p-2 z-50">
            <div className="grid grid-cols-7 gap-1">
              {colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => insertColor(color)}
                  className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                  title={`Cor: ${color}`}
                />
              ))}
            </div>
          </div>
        )}
      </div> */}

      {/* Fonte */}
      <div className="relative">
        <button 
          type="button" 
          onClick={() => setShowFontMenu(!showFontMenu)}
          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded" 
          title="Fonte"
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
                  className="block w-full text-left px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-sm"
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
        onClick={() => insertText('# ', '', 'Título')} 
        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-xs font-bold" 
        title="Título H1"
      >
        H1
      </button>
      <button 
        type="button" 
        onClick={() => insertText('## ', '', 'Subtítulo')} 
        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-xs font-bold" 
        title="Título H2"
      >
        H2
      </button>
      <button 
        type="button" 
        onClick={() => insertText('### ', '', 'Título')} 
        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-xs font-bold" 
        title="Título H3"
      >
        H3
      </button>
      <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1"></div>
      
      {/* Elementos */}
      <button 
        type="button" 
        onClick={() => insertText('`', '`', 'código')} 
        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded" 
        title="Código inline"
      >
        <Code size={16} />
      </button>
      <button 
        type="button" 
        onClick={() => insertText('[', '](url)', 'texto do link')} 
        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded" 
        title="Link (Ctrl+K)"
      >
        <Link size={16} />
      </button>
      <button 
        type="button" 
        onClick={() => insertText('![alt](', ')', 'url-da-imagem')} 
        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded" 
        title="Imagem"
      >
        <Image size={16} />
      </button>
      <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1"></div>
      
      {/* Listas */}
      <button 
        type="button" 
        onClick={() => insertText('- ', '', 'item da lista')} 
        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded" 
        title="Lista"
      >
        <List size={16} />
      </button>
      <button 
        type="button" 
        onClick={() => insertText('1. ', '', 'item numerado')} 
        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded" 
        title="Lista numerada"
      >
        <ListOrdered size={16} />
      </button>
      <button 
        type="button" 
        onClick={() => insertText('- [ ] ', '', 'tarefa')} 
        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded" 
        title="Checkbox"
      >
        <input type="checkbox" className="w-4 h-4" disabled />
      </button>
      <button 
        type="button" 
        onClick={() => insertText('> ', '', 'citação')} 
        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded" 
        title="Citação"
      >
        <Quote size={16} />
      </button>
      <button 
        type="button" 
        onClick={() => insertText('#', '', 'tag')} 
        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded" 
        title="Tag"
      >
        <Hash size={16} />
      </button>
      
      <div className="ml-auto flex items-center gap-1">
        {/* Controles de visualização */}
        <button 
          type="button" 
          onClick={() => setSplitView(!splitView)} 
          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded" 
          title="Dividir vista"
        >
          <Split size={16} />
        </button>
        <button 
          type="button" 
          onClick={() => setShowPreview(!showPreview)} 
          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded" 
          title="Toggle Preview"
        >
          {showPreview ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
        
        {/* Copiar */}
        <button 
          type="button" 
          onClick={copyToClipboard} 
          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded" 
          title="Copiar"
        >
          <Copy size={16} />
        </button>
        
        {/* Menu de download */}
        <div className="relative">
          <button 
            type="button" 
            onClick={() => setShowDownloadMenu(!showDownloadMenu)}
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded flex items-center" 
            title="Download"
          >
            <Download size={16} />
            <ChevronDown size={12} className="ml-1" />
          </button>
          
          {showDownloadMenu && (
            <div className="absolute top-10 right-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg py-2 z-50 w-40">
              <button
                type="button"
                onClick={downloadAsMarkdown}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
              >
                📝 Markdown (.md)
              </button>
              <button
                type="button"
                onClick={downloadAsHTML}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
              >
                🌐 HTML (.html)
              </button>
              <button
                type="button"
                onClick={downloadAsText}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
              >
                📄 Texto (.txt)
              </button>
              <button
                type="button"
                onClick={downloadAsPDF}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
              >
                📑 PDF (Imprimir)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Fechar menus quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.relative')) {
        setShowDownloadMenu(false);
        setShowColorPicker(false);
        setShowFontMenu(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className={`${height} border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden bg-white dark:bg-gray-900`}>
      {toolbar}
      
      <div className={`flex ${splitView && showPreview ? 'divide-x' : ''} divide-gray-200 dark:divide-gray-700 h-full`}>
        {/* Editor */}
        <div className={`${splitView && showPreview ? 'w-1/2' : 'w-full'} ${!showPreview || splitView ? 'block' : 'hidden'}`}>
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full h-full p-4 resize-none border-none outline-none bg-transparent text-gray-900 dark:text-gray-100 font-mono text-sm leading-relaxed"
            placeholder={placeholder}
            spellCheck={false}
          />
        </div>
        
        {/* Preview */}
        {showPreview && (
          <div className={`${splitView ? 'w-1/2' : 'w-full'} overflow-y-auto bg-white dark:bg-gray-900`}>
            <div 
              className="p-4 prose prose-sm max-w-none dark:prose-invert"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(value) }}
            />
          </div>
        )}
      </div>
    </div>
  );
};