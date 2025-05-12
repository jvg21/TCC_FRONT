import React, { useState } from 'react';
import { 
  Save, 
  ArrowLeft, 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  Link, 
  Image, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  MoreHorizontal,
  Users,
  Clock,
  Tag,
  ChevronDown,
  X,
  Check,
  FileText,
  Folder
} from 'lucide-react';

export default function DocumentEditorScreen() {
  const [docTitle, setDocTitle] = useState('Relatório de Progresso - Maio 2025');
  const [docContent, setDocContent] = useState('');
  const [showTagsModal, setShowTagsModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  
  const [tags, setTags] = useState(['Relatório', 'Progresso', 'Mensal']);
  const [newTag, setNewTag] = useState('');
  
  const [folderPath, setFolderPath] = useState('Documentos > Relatórios > 2025');
  
  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };
  
  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  
  const handleSaveDocument = () => {
    // Simulação de salvamento
    console.log("Documento salvo:", { docTitle, docContent, tags, folderPath });
    setShowSaveModal(false);
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <button className="p-1.5 rounded-full hover:bg-gray-100">
            <ArrowLeft className="h-5 w-5 text-gray-500" />
          </button>
          
          <div className="flex items-center border-r border-gray-200 pr-4">
            <FileText className="h-5 w-5 text-blue-600 mr-2" />
            <span className="text-sm font-medium text-gray-700">Doc</span>
          </div>
          
          <div className="text-sm text-gray-500 flex items-center">
            <Folder className="h-4 w-4 mr-1 text-gray-400" />
            <span>{folderPath}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button className="flex items-center text-sm text-gray-700 px-3 py-1.5 border border-gray-300 rounded-md hover:bg-gray-50">
            <Users className="h-4 w-4 mr-1.5" />
            <span>Compartilhar</span>
          </button>
          
          <button 
            onClick={() => setShowSaveModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-md text-sm font-medium flex items-center"
          >
            <Save className="h-4 w-4 mr-1.5" />
            <span>Salvar</span>
          </button>
        </div>
      </header>

      {/* Document Title */}
      <div className="bg-white px-8 py-4 border-b border-gray-200">
        <input
          type="text"
          value={docTitle}
          onChange={(e) => setDocTitle(e.target.value)}
          className="text-xl font-semibold text-gray-800 w-full outline-none border-b-2 border-transparent focus:border-blue-500 pb-1"
          placeholder="Título do documento"
        />
        
        <div className="flex items-center mt-2 text-sm text-gray-500">
          <Clock className="h-4 w-4 mr-1" />
          <span>Última edição: Hoje às 14:30</span>
          
          <div className="mx-3 h-1 w-1 rounded-full bg-gray-300"></div>
          
          <button 
            onClick={() => setShowTagsModal(true)}
            className="flex items-center hover:text-blue-600"
          >
            <Tag className="h-4 w-4 mr-1" />
            <span>Tags: {tags.length}</span>
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white px-8 py-2 border-b border-gray-200 flex items-center space-x-1">
        <div className="flex items-center mr-2">
          <select className="text-sm border border-gray-300 rounded px-2 py-1 mr-2">
            <option>Parágrafo</option>
            <option>Título 1</option>
            <option>Título 2</option>
            <option>Título 3</option>
          </select>
          
          <select className="text-sm border border-gray-300 rounded px-2 py-1">
            <option>Arial</option>
            <option>Times New Roman</option>
            <option>Calibri</option>
            <option>Roboto</option>
          </select>
        </div>
        
        <div className="h-6 w-px bg-gray-300 mx-1"></div>
        
        <button className="p-1.5 rounded hover:bg-gray-100">
          <Bold className="h-4 w-4 text-gray-700" />
        </button>
        
        <button className="p-1.5 rounded hover:bg-gray-100">
          <Italic className="h-4 w-4 text-gray-700" />
        </button>
        
        <button className="p-1.5 rounded hover:bg-gray-100">
          <Underline className="h-4 w-4 text-gray-700" />
        </button>
        
        <div className="h-6 w-px bg-gray-300 mx-1"></div>
        
        <button className="p-1.5 rounded hover:bg-gray-100">
          <AlignLeft className="h-4 w-4 text-gray-700" />
        </button>
        
        <button className="p-1.5 rounded hover:bg-gray-100">
          <AlignCenter className="h-4 w-4 text-gray-700" />
        </button>
        
        <button className="p-1.5 rounded hover:bg-gray-100">
          <AlignRight className="h-4 w-4 text-gray-700" />
        </button>
        
        <div className="h-6 w-px bg-gray-300 mx-1"></div>
        
        <button className="p-1.5 rounded hover:bg-gray-100">
          <List className="h-4 w-4 text-gray-700" />
        </button>
        
        <button className="p-1.5 rounded hover:bg-gray-100">
          <ListOrdered className="h-4 w-4 text-gray-700" />
        </button>
        
        <div className="h-6 w-px bg-gray-300 mx-1"></div>
        
        <button className="p-1.5 rounded hover:bg-gray-100">
          <Link className="h-4 w-4 text-gray-700" />
        </button>
        
        <button className="p-1.5 rounded hover:bg-gray-100">
          <Image className="h-4 w-4 text-gray-700" />
        </button>
        
        <button className="p-1.5 rounded hover:bg-gray-100">
          <MoreHorizontal className="h-4 w-4 text-gray-700" />
        </button>
      </div>

      {/* Editor Content */}
      <div className="flex-grow px-8 py-6 bg-white">
        <textarea
          className="w-full h-full min-h-[400px] outline-none resize-none text-gray-800"
          placeholder="Comece a escrever seu documento aqui..."
          value={docContent}
          onChange={(e) => setDocContent(e.target.value)}
        ></textarea>
      </div>
      
      {/* Tags Modal */}
      {showTagsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Gerenciar Tags</h2>
              <button onClick={() => setShowTagsModal(false)}>
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Adicionar nova tag
              </label>
              <div className="flex">
                <input 
                  type="text" 
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Digite uma nova tag"
                />
                <button 
                  onClick={handleAddTag}
                  className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700"
                >
                  Adicionar
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags atuais
              </label>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <div key={index} className="flex items-center bg-gray-100 rounded-full px-3 py-1">
                    <span className="text-sm text-gray-800">{tag}</span>
                    <button 
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1.5 text-gray-500 hover:text-gray-700"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
                {tags.length === 0 && (
                  <span className="text-sm text-gray-500 italic">Nenhuma tag adicionada</span>
                )}
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button 
                onClick={() => setShowTagsModal(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
              >
                Concluído
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Save Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Salvar Documento</h2>
              <button onClick={() => setShowSaveModal(false)}>
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome do arquivo
                </label>
                <input 
                  type="text" 
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Local de salvamento
                </label>
                <div className="flex items-center px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
                  <Folder className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-700">{folderPath}</span>
                  <button className="ml-2 text-blue-600 text-sm">
                    Alterar
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Versão
                </label>
                <div className="flex items-center">
                  <select className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Nova versão (v1.1)</option>
                    <option>Substituir versão atual (v1.0)</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button 
                onClick={() => setShowSaveModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button 
                onClick={handleSaveDocument}
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
