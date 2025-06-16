// src/store/documentStore.ts - Atualizado para backend
import { create } from 'zustand';
import { Document, DocumentState, Folder, Tag } from '../types/document';
import { getCookie } from '../utils/cookies';
import { getNotificationStore } from './notificationStore';

export const useDocumentStore = create<DocumentState>((set, get) => ({
  documents: [],
  folders: [],
  tags: [],
  loading: false,
  error: null,

  fetchDocuments: async () => {
    set({ loading: true, error: null });
    const token = getCookie('authToken');

    try {
      const response = await fetch('https://localhost:7198/Document/GetListDocument', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.erro) {
        throw new Error(data.mensagem || 'Failed to fetch documents');
      }

      set({ documents: data.objeto || [], loading: false });

    } catch (error) {
      let errorMessage = 'Failed to fetch documents';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      set({ error: errorMessage, loading: false });
      getNotificationStore().showError(errorMessage);
    }
  },

  getDocument: (id: number) => {
    return get().documents.find(document => document.documentId === id);
  },

  addDocument: async (documentData: Omit<Document, 'documentId' | 'isActive' | 'createdAt' | 'updatedAt'>) => {
    set({ loading: true, error: null });
    const token = getCookie('authToken');

    try {
      // Preparar dados para envio, seguindo o padrão do DocumentRequestDTO
      const newDocument: any = {
        title: documentData.title,
        content: documentData.content,
        folderId: documentData.folderId
      };

      // Remover campos undefined/null
      Object.keys(newDocument).forEach(key => 
        newDocument[key] === undefined && delete newDocument[key]
      );

      const response = await fetch('https://localhost:7198/Document/AddDocument', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newDocument)
      });

      const data = await response.json();

      if (data.erro) {
        throw new Error(data.mensagem || 'Failed to add document');
      }

      // Atualizar lista de documentos
      await get().fetchDocuments();
      
      set({ loading: false });
      getNotificationStore().showNotification('Document created successfully', 'success');
      return data.objeto;

    } catch (error) {
      let errorMessage = 'Failed to add document';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      set({ error: errorMessage, loading: false });
      getNotificationStore().showError(errorMessage);
      throw error;
    }
  },

  updateDocument: async (id: number, documentData: Partial<Document>) => {
    set({ loading: true, error: null });
    const token = getCookie('authToken');

    try {
      // Preparar dados para envio seguindo o padrão do DocumentRequestDTO
      const updateData: any = {
        documentId: id,
        title: documentData.title,
        content: documentData.content,
        folderId: documentData.folderId
      };

      // Remover campos undefined/null
      Object.keys(updateData).forEach(key => 
        updateData[key] === undefined && delete updateData[key]
      );

      const response = await fetch('https://localhost:7198/Document/UpdateDocument', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      });

      const data = await response.json();

      if (data.erro) {
        throw new Error(data.mensagem || 'Failed to update document');
      }

      // Atualizar lista de documentos
      await get().fetchDocuments();
      
      set({ loading: false });
      getNotificationStore().showNotification('Document updated successfully', 'success');

    } catch (error) {
      let errorMessage = 'Failed to update document';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      set({ error: errorMessage, loading: false });
      getNotificationStore().showError(errorMessage);
    }
  },

  toggleDocumentStatus: async (id: number) => {
    set({ loading: true, error: null });
    const token = getCookie('authToken');

    try {
      const response = await fetch(`https://localhost:7198/Document/ToogleStatusDocument/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.erro) {
        throw new Error(data.mensagem || 'Failed to toggle document status');
      }

      // Atualizar lista de documentos
      await get().fetchDocuments();
      
      set({ loading: false });
      getNotificationStore().showNotification('Document status updated successfully', 'success');

    } catch (error) {
      let errorMessage = 'Failed to toggle document status';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      set({ error: errorMessage, loading: false });
      getNotificationStore().showError(errorMessage);
    }
  },

  // Funções para pastas (implementação básica para folder padrão)
  fetchFolders: async () => {
    // Por enquanto, usar pasta padrão
    const defaultFolder: Folder = {
      folderId: 1,
      name: 'Default',
      userId: 1,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    set({ folders: [defaultFolder] });
  },

  addFolder: async (folderData: Omit<Folder, 'folderId' | 'isActive' | 'createdAt' | 'updatedAt'>) => {
    // Implementação futura quando a API de folders estiver disponível
    console.log('Add folder not implemented yet');
    return Promise.resolve();
  },

  // Funções para tags (implementação futura)
  fetchTags: async () => {
    set({ tags: [] });
  },

  addTag: async (tagData: Omit<Tag, 'tagId' | 'isActive' | 'createdAt' | 'updatedAt'>) => {
    // Implementação futura quando a API de tags estiver disponível
    console.log('Add tag not implemented yet');
    return Promise.resolve();
  },

  addTagToDocument: async (documentId: number, tagId: number) => {
    // Implementação futura
    console.log('Add tag to document not implemented yet');
  },

  removeTagFromDocument: async (documentId: number, tagId: number) => {
    // Implementação futura
    console.log('Remove tag from document not implemented yet');
  }
}));