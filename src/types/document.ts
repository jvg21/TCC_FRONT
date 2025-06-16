import { User } from "./user";

export interface Document {
  documentId: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  userId: number;
  folderId: number;
  isActive: boolean;
  
  // Relacionamentos opcionais para exibição
  user?: User; // Usuário que criou o documento
  folder?: Folder; // Pasta onde está o documento
}

export interface DocumentVersion {
  documentVersionId: number;
  documentId: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  userId: number;
  comment?: string;
  
  // Relacionamentos opcionais
  document?: Document;
  user?: User;
}

export interface DocumentTag {
  documentTagId: number;
  documentId: number;
  tagId: number;
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
  parentFolderId?: number | null;
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
  
  // Ações básicas do CRUD de documentos
  fetchDocuments: () => Promise<void>;
  getDocument: (id: number) => Document | undefined;
  addDocument: (documentData: Omit<Document, 'documentId' | 'isActive' | 'createdAt' | 'updatedAt'>) => Promise<any>;
  updateDocument: (id: number, documentData: Partial<Document>) => Promise<void>;
  toggleDocumentStatus: (id: number) => Promise<void>;
  
  // Ações para pastas
  fetchFolders: () => Promise<void>;
  addFolder: (folderData: Omit<Folder, 'folderId' | 'isActive' | 'createdAt' | 'updatedAt'>) => Promise<any>;
  
  // Ações para tags
  fetchTags: () => Promise<void>;
  addTag: (tagData: Omit<Tag, 'tagId' | 'isActive' | 'createdAt' | 'updatedAt'>) => Promise<any>;
  addTagToDocument: (documentId: number, tagId: number) => Promise<void>;
  removeTagFromDocument: (documentId: number, tagId: number) => Promise<void>;
}