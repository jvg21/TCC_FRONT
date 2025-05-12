// src/store/documentStore.ts
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
    // Simulação - em um ambiente real, faríamos a requisição para a API
    try {
      // Dados de exemplo para simulação
      const mockDocuments: Document[] = [
        {
          documentId: 1,
          title: 'Política de Privacidade',
          content: '<p>Este é um documento de política de privacidade.</p>',
          format: 'html',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          userId: 1,
          folderId: 1,
          isActive: true
        },
        {
          documentId: 2,
          title: 'Manual do Usuário',
          content: '<p>Este é um manual de instruções para o usuário.</p>',
          format: 'html',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          userId: 2,
          folderId: 2,
          isActive: true
        },
        {
          documentId: 3,
          title: 'Contrato de Serviço',
          content: '<p>Termos e condições do contrato de serviço.</p>',
          format: 'html',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          userId: 1,
          folderId: 1,
          isActive: false
        }
      ];

      // Simulando uma chamada assíncrona
      setTimeout(() => {
        set({ documents: mockDocuments, loading: false });
      }, 500);
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
    
    try {
      // Simulação de adição de documento
      const newDocument: Document = {
        ...documentData,
        documentId: Math.floor(Math.random() * 1000) + 10, // Simulando um ID gerado
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Simular uma chamada de API com um tempo de espera
      await new Promise(resolve => setTimeout(resolve, 500));

      // Atualiza o estado com o novo documento
      set(state => ({
        documents: [...state.documents, newDocument],
        loading: false
      }));

      getNotificationStore().showNotification('Documento criado com sucesso!', 'success');

      return newDocument;
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
    
    try {
      // Simulação de atualização de documento
      const updatedDocument = {
        ...documentData,
        documentId: id,
        updatedAt: new Date().toISOString()
      };

      // Simular uma chamada de API com um tempo de espera
      await new Promise(resolve => setTimeout(resolve, 500));

      // Atualiza o estado com o documento atualizado
      set(state => ({
        documents: state.documents.map(doc =>
          doc.documentId === id ? { ...doc, ...documentData } : doc
        ),
        loading: false
      }));

      getNotificationStore().showNotification('Documento atualizado com sucesso!', 'success');
    } catch (error) {
      let errorMessage = 'Failed to update document';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      set({ error: errorMessage, loading: false });
      getNotificationStore().showError(errorMessage);
      throw error;
    }
  },

  toggleDocumentStatus: async (id: number) => {
    set({ loading: true, error: null });
    
    try {
      // Simular uma chamada de API com um tempo de espera
      await new Promise(resolve => setTimeout(resolve, 500));

      // Atualiza o estado alternando o status do documento
      set(state => ({
        documents: state.documents.map(doc =>
          doc.documentId === id ? { ...doc, isActive: !doc.isActive } : doc
        ),
        loading: false
      }));

      getNotificationStore().showNotification('Status do documento alterado com sucesso!', 'success');
    } catch (error) {
      let errorMessage = 'Failed to toggle document status';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      set({ error: errorMessage, loading: false });
      getNotificationStore().showError(errorMessage);
      throw error;
    }
  },

  fetchFolders: async () => {
    set({ loading: true, error: null });
    
    try {
      // Dados de exemplo para simulação
      const mockFolders: Folder[] = [
        {
          folderId: 1,
          name: 'Documentos Gerais',
          userId: 1,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          folderId: 2,
          name: 'Manuais',
          userId: 1,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          folderId: 3,
          name: 'Contratos',
          parentFolderId: 1,
          userId: 2,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];

      // Simulando uma chamada assíncrona
      setTimeout(() => {
        set({ folders: mockFolders, loading: false });
      }, 500);
    } catch (error) {
      let errorMessage = 'Failed to fetch folders';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      set({ error: errorMessage, loading: false });
      getNotificationStore().showError(errorMessage);
    }
  },

  addFolder: async (folderData: Omit<Folder, 'folderId' | 'isActive' | 'createdAt' | 'updatedAt'>) => {
    set({ loading: true, error: null });
    
    try {
      // Simulação de adição de pasta
      const newFolder: Folder = {
        ...folderData,
        folderId: Math.floor(Math.random() * 1000) + 10,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Simular uma chamada de API com um tempo de espera
      await new Promise(resolve => setTimeout(resolve, 500));

      // Atualiza o estado com a nova pasta
      set(state => ({
        folders: [...state.folders, newFolder],
        loading: false
      }));

      getNotificationStore().showNotification('Pasta criada com sucesso!', 'success');

      return newFolder;
    } catch (error) {
      let errorMessage = 'Failed to add folder';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      set({ error: errorMessage, loading: false });
      getNotificationStore().showError(errorMessage);
      throw error;
    }
  },

  fetchTags: async () => {
    set({ loading: true, error: null });
    
    try {
      // Dados de exemplo para simulação
      const mockTags: Tag[] = [
        {
          tagId: 1,
          name: 'Importante',
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          tagId: 2,
          name: 'Contrato',
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          tagId: 3,
          name: 'Manual',
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];

      // Simulando uma chamada assíncrona
      setTimeout(() => {
        set({ tags: mockTags, loading: false });
      }, 500);
    } catch (error) {
      let errorMessage = 'Failed to fetch tags';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      set({ error: errorMessage, loading: false });
      getNotificationStore().showError(errorMessage);
    }
  },

  addTag: async (tagData: Omit<Tag, 'tagId' | 'isActive' | 'createdAt' | 'updatedAt'>) => {
    set({ loading: true, error: null });
    
    try {
      // Simulação de adição de tag
      const newTag: Tag = {
        ...tagData,
        tagId: Math.floor(Math.random() * 1000) + 10,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Simular uma chamada de API com um tempo de espera
      await new Promise(resolve => setTimeout(resolve, 500));

      // Atualiza o estado com a nova tag
      set(state => ({
        tags: [...state.tags, newTag],
        loading: false
      }));

      getNotificationStore().showNotification('Tag criada com sucesso!', 'success');

      return newTag;
    } catch (error) {
      let errorMessage = 'Failed to add tag';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      set({ error: errorMessage, loading: false });
      getNotificationStore().showError(errorMessage);
      throw error;
    }
  },

  addTagToDocument: async (documentId: number, tagId: number) => {
    set({ loading: true, error: null });
    
    try {
      // Simular uma chamada de API com um tempo de espera
      await new Promise(resolve => setTimeout(resolve, 500));

      getNotificationStore().showNotification('Tag adicionada ao documento com sucesso!', 'success');
    } catch (error) {
      let errorMessage = 'Failed to add tag to document';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      set({ error: errorMessage, loading: false });
      getNotificationStore().showError(errorMessage);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  removeTagFromDocument: async (documentId: number, tagId: number) => {
    set({ loading: true, error: null });
    
    try {
      // Simular uma chamada de API com um tempo de espera
      await new Promise(resolve => setTimeout(resolve, 500));

      getNotificationStore().showNotification('Tag removida do documento com sucesso!', 'success');
    } catch (error) {
      let errorMessage = 'Failed to remove tag from document';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      set({ error: errorMessage, loading: false });
      getNotificationStore().showError(errorMessage);
      throw error;
    } finally {
      set({ loading: false });
    }
  }
}));