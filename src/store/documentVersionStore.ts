// src/store/documentVersionStore.ts - Seguindo padrões do projeto
import { create } from 'zustand';
import { DocumentVersion } from '../types/document';
import { getCookie } from '../utils/cookies';
import { getNotificationStore } from './notificationStore';

interface DocumentVersionState {
  versions: DocumentVersion[];
  loading: boolean;
  error: string | null;
  
  // Ações
  fetchVersionsByDocumentId: (documentId: number) => Promise<void>;
  getVersionById: (documentVersionId: number) => Promise<DocumentVersion | null>;
  addVersionComment: (documentVersionId: number, comment: string) => Promise<void>;
  createVersion: (documentId: number, content: string, comment: string) => Promise<DocumentVersion | null>;
  clearVersions: () => void;
  
  // Função para enriquecer versões com dados de usuário
  enrichVersionsWithUserData: (versions: DocumentVersion[], users: any[]) => DocumentVersion[];
}

export const useDocumentVersionStore = create<DocumentVersionState>((set, get) => ({
  versions: [],
  loading: false,
  error: null,

  fetchVersionsByDocumentId: async (documentId: number) => {
    set({ loading: true, error: null });
    const token = getCookie('authToken');

    try {
      const response = await fetch(`https://localhost:7198/DocumentVersion/GetListDocumentVersionByDocumentId/${documentId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.erro) {
        throw new Error(data.mensagem || 'Failed to fetch document versions');
      }

      // Mapear do DTO para o tipo frontend
      const mappedVersions: DocumentVersion[] = (data.objeto || []).map((version: any) => ({
        documentVersionId: version.documentVersionId,
        documentId: version.documentId,
        content: version.content,
        createdAt: version.createdAt,
        updatedAt: version.updatedAt,
        userId: version.userId,
        comment: version.comment
      }));

      set({ versions: mappedVersions, loading: false });

    } catch (error) {
      let errorMessage = 'Failed to fetch document versions';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      set({ error: errorMessage, loading: false });
      getNotificationStore().showError(errorMessage);
    }
  },

  getVersionById: async (documentVersionId: number) => {
    set({ loading: true, error: null });
    const token = getCookie('authToken');

    try {
      const response = await fetch(`https://localhost:7198/DocumentVersion/GetDocumentVersionById/${documentVersionId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.erro) {
        throw new Error(data.mensagem || 'Failed to fetch document version');
      }

      // Mapear do DTO para o tipo frontend
      const version: DocumentVersion = {
        documentVersionId: data.objeto.documentVersionId,
        documentId: data.objeto.documentId,
        content: data.objeto.content,
        createdAt: data.objeto.createdAt,
        updatedAt: data.objeto.updatedAt,
        userId: data.objeto.userId,
        comment: data.objeto.comment
      };

      set({ loading: false });
      return version;

    } catch (error) {
      let errorMessage = 'Failed to fetch document version';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      set({ error: errorMessage, loading: false });
      getNotificationStore().showError(errorMessage);
      return null;
    }
  },

  addVersionComment: async (documentVersionId: number, comment: string) => {
    set({ loading: true, error: null });
    const token = getCookie('authToken');

    try {
      const requestData = {
        documentVersionId: documentVersionId,
        comment: comment
      };

      const response = await fetch('https://localhost:7198/DocumentVersion/AddCommentDocumentVersion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestData)
      });

      const data = await response.json();

      if (data.erro) {
        throw new Error(data.mensagem || 'Failed to add comment to version');
      }

      // Mapear a versão atualizada
      const updatedVersion: DocumentVersion = {
        documentVersionId: data.objeto.documentVersionId,
        documentId: data.objeto.documentId,
        content: data.objeto.content,
        createdAt: data.objeto.createdAt,
        updatedAt: data.objeto.updatedAt,
        userId: data.objeto.userId,
        comment: data.objeto.comment
      };

      // Atualizar a versão na lista local
      set(state => ({
        versions: state.versions.map(version => 
          version.documentVersionId === documentVersionId ? updatedVersion : version
        ),
        loading: false
      }));

      getNotificationStore().showNotification('Comment added successfully', 'success');

    } catch (error) {
      let errorMessage = 'Failed to add comment to version';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      set({ error: errorMessage, loading: false });
      getNotificationStore().showError(errorMessage);
    }
  },

  createVersion: async (documentId: number, content: string, comment: string) => {
    set({ loading: true, error: null });
    const token = getCookie('authToken');

    try {
      // Nota: Vou assumir que existe um endpoint para criar versão
      // Se não existir, precisará ser implementado no backend
      const requestData = {
        documentId: documentId,
        content: content,
        comment: comment
      };

      const response = await fetch('https://localhost:7198/DocumentVersion/AddDocumentVersion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestData)
      });

      const data = await response.json();

      if (data.erro) {
        throw new Error(data.mensagem || 'Failed to create document version');
      }

      // Mapear a nova versão
      const newVersion: DocumentVersion = {
        documentVersionId: data.objeto.documentVersionId,
        documentId: data.objeto.documentId,
        content: data.objeto.content,
        createdAt: data.objeto.createdAt,
        updatedAt: data.objeto.updatedAt,
        userId: data.objeto.userId,
        comment: data.objeto.comment
      };

      // Adicionar a nova versão à lista
      set(state => ({
        versions: [newVersion, ...state.versions],
        loading: false
      }));

      getNotificationStore().showNotification('Version created successfully', 'success');
      return newVersion;

    } catch (error) {
      let errorMessage = 'Failed to create document version';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      set({ error: errorMessage, loading: false });
      getNotificationStore().showError(errorMessage);
      return null;
    }
  },

  // Função para enriquecer versões com dados de usuário
  enrichVersionsWithUserData: (versions: DocumentVersion[], users: any[]) => {
    return versions.map(version => ({
      ...version,
      user: users.find(user => user.userId === version.userId)
    }));
  },

  clearVersions: () => {
    set({ versions: [], error: null });
  }
}));