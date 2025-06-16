// src/components/forms/RichTextEditor.tsx
import { useState, useRef, useCallback } from 'react';
import { 
  Bold, 
  Italic, 
  Underline, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  List,
  ListOrdered,
  Image,
  Link,
  Type,
  Palette,
  Code
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  height?: string;
}

export const RichTextEditor = ({ 
  value, 
  onChange, 
  placeholder = 'Digite seu conteúdo...', 
  error,
  height = '400px' 
}: RichTextEditorProps) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const executeCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleImageUpload = useCallback(async (file: File) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('https://localhost:7198/Supabase/UploadImage', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${document.cookie.split('authToken=')[1]?.split(';')[0]}`
        },
        body: formData
      });

      const data = await response.json();
      
      if (!data.erro) {
        const imageUrl = data.objeto;
        executeCommand('insertImage', imageUrl);
      } else {
        alert('Erro ao fazer upload da imagem: ' + data.mensagem);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Erro ao fazer upload da imagem');
    } finally {
      setIsUploading(false);
    }
  }, []);

  const handleFileSelect = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        handleImageUpload(file);
      }
    };
    input.click();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (items) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          e.preventDefault();
          const file = items[i].getAsFile();
          if (file) {
            handleImageUpload(file);
          }
          break;
        }
      }
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const insertLink = () => {
    const url = prompt('Digite a URL do link:');
    if (url) {
      executeCommand('createLink', url);
    }
  };

  const toolbarButtons = [
    { icon: Bold, command: 'bold', title: 'Negrito' },
    { icon: Italic, command: 'italic', title: 'Itálico' },
    { icon: Underline, command: 'underline', title: 'Sublinhado' },
    { separator: true },
    { icon: AlignLeft, command: 'justifyLeft', title: 'Alinhar à esquerda' },
    { icon: AlignCenter, command: 'justifyCenter', title: 'Centralizar' },
    { icon: AlignRight, command: 'justifyRight', title: 'Alinhar à direita' },
    { separator: true },
    { icon: List, command: 'insertUnorderedList', title: 'Lista com marcadores' },
    { icon: ListOrdered, command: 'insertOrderedList', title: 'Lista numerada' },
    { separator: true },
    { icon: Link, command: 'custom', action: insertLink, title: 'Inserir link' },
    { icon: Image, command: 'custom', action: handleFileSelect, title: 'Inserir imagem' },
    { separator: true },
    { icon: Code, command: 'formatBlock', value: 'pre', title: 'Código' }
  ];

  return (
    <div className="border border-gray-300 dark:border-gray-600 rounded-md overflow-hidden">
      {/* Toolbar */}
      <div className="bg-gray-50 dark:bg-gray-700 px-3 py-2 border-b border-gray-300 dark:border-gray-600 flex flex-wrap gap-1">
        {toolbarButtons.map((button, index) => {
          if (button.separator) {
            return (
              <div 
                key={index} 
                className="w-px h-6 bg-gray-300 dark:bg-gray-500 mx-1" 
              />
            );
          }

          const IconComponent = button.icon;
          return (
            <button
              key={index}
              type="button"
              onClick={() => {
                if (button.action) {
                  button.action();
                } else {
                  executeCommand(button.command, button.value);
                }
              }}
              disabled={isUploading && button.icon === Image}
              className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 disabled:opacity-50"
              title={button.title}
            >
              <IconComponent className="h-4 w-4" />
            </button>
          );
        })}
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onPaste={handlePaste}
        dangerouslySetInnerHTML={{ __html: value }}
        className={`p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none overflow-y-auto ${
          error ? 'border-red-500' : ''
        }`}
        style={{ minHeight: height }}
        data-placeholder={placeholder}
      />
      
      {error && (
        <div className="px-3 py-2 bg-red-50 dark:bg-red-900 text-red-600 dark:text-red-300 text-sm">
          {error}
        </div>
      )}
    </div>
  );
};