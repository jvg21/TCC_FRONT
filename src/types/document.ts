// src/types/document.ts
import { User } from "./user";

export interface Document {
  documentId: number;
  title: string;
  content: string;
  format: string;
  createdAt: string;
  updatedAt: string;
  userId: number;
  folderId: number;
  isActive: boolean;
  user?: User; // Usuário que criou o documento (opcional, para exibição)
}

export interface DocumentVersion {
  documentVersionId: number;
  documentId: number;
  content: string;
  createdAt: string;
  userId: number;
  comment?: string;
}

export interface DocumentTag {
  tagId: number;
  documentId: number;
  createdAt: string;
}

export interface Tag {
  tagId: number;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Folder {
  folderId: number;
  name: string;
  parentFolderId?: number;
  userId: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentState {
  documents: Document[];
  folders: Folder[];
  tags: Tag[];
  loading: boolean;
  error: string | null;
  
  // Document actions
  fetchDocuments: () => Promise<void>;
  getDocument: (id: number) => Document | undefined;
  addDocument: (documentData: Omit<Document, 'documentId' | 'isActive' | 'createdAt' | 'updatedAt'>) => Promise<any>;
  updateDocument: (id: number, documentData: Partial<Document>) => Promise<void>;
  toggleDocumentStatus: (id: number) => Promise<void>;
  
  // Folder actions
  fetchFolders: () => Promise<void>;
  addFolder: (folderData: Omit<Folder, 'folderId' | 'isActive' | 'createdAt' | 'updatedAt'>) => Promise<any>;
  
  // Tag actions
  fetchTags: () => Promise<void>;
  addTag: (tagData: Omit<Tag, 'tagId' | 'isActive' | 'createdAt' | 'updatedAt'>) => Promise<any>;
  addTagToDocument: (documentId: number, tagId: number) => Promise<void>;
  removeTagFromDocument: (documentId: number, tagId: number) => Promise<void>;
}