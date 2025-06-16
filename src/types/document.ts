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
  versions?: DocumentVersion[]; // Versões do documento
  latestVersion?: DocumentVersion; // Última versão
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

export interface DocumentVersionRequest {
  documentId: number;
  content: string;
  comment?: string;
}

export interface DocumentVersionCommentRequest {
  documentVersionId: number;
  comment: string;
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

// Interfaces para comparação de versões
export interface VersionDiff {
  type: 'added' | 'removed' | 'modified' | 'unchanged';
  content: string;
  lineNumber?: number;
  oldLineNumber?: number;
  newLineNumber?: number;
}

export interface VersionComparison {
  version1: DocumentVersion;
  version2: DocumentVersion;
  differences: VersionDiff[];
  statistics: {
    added: number;
    removed: number;
    modified: number;
    unchanged: number;
  };
}

// Estado principal do store de documentos
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

// Estado do store de versões de documentos
export interface DocumentVersionState {
  versions: DocumentVersion[];
  loading: boolean;
  error: string | null;
  currentComparison?: VersionComparison;
  
  // Ações para versões
  fetchVersionsByDocumentId: (documentId: number) => Promise<void>;
  getVersionById: (documentVersionId: number) => Promise<DocumentVersion | null>;
  addVersionComment: (documentVersionId: number, comment: string) => Promise<void>;
  createVersion: (documentId: number, content: string, comment: string) => Promise<DocumentVersion | null>;
  compareVersions: (version1: DocumentVersion, version2: DocumentVersion) => VersionComparison;
  clearVersions: () => void;
  clearComparison: () => void;
}

// Tipos para formulários
export interface DocumentFormData {
  title: string;
  content: string;
  folderId: number;
  tags?: number[];
}

export interface VersionFormData {
  comment: string;
  content?: string;
}

// Tipos para filtros e busca
export interface DocumentFilters {
  search?: string;
  folderId?: number;
  tagIds?: number[];
  userId?: number;
  dateRange?: {
    start: string;
    end: string;
  };
  isActive?: boolean;
}

export interface VersionFilters {
  search?: string;
  userId?: number;
  dateRange?: {
    start: string;
    end: string;
  };
  hasComment?: boolean;
}

// Tipos para estatísticas
export interface DocumentStatistics {
  totalDocuments: number;
  activeDocuments: number;
  totalVersions: number;
  documentsWithVersions: number;
  averageVersionsPerDocument: number;
  recentActivity: {
    documentsCreated: number;
    versionsCreated: number;
    period: string;
  };
}

export interface VersionStatistics {
  totalVersions: number;
  versionsWithComments: number;
  latestVersionId: number;
  oldestVersionDate: string;
  newestVersionDate: string;
  averageVersionsPerDay: number;
}

// Tipos para exportação
export interface ExportOptions {
  format: 'pdf' | 'docx' | 'html' | 'txt';
  includeVersions?: boolean;
  includeComments?: boolean;
  versionRange?: {
    start: number;
    end: number;
  };
}

// Tipos para notificações relacionadas a documentos
export interface DocumentNotification {
  type: 'version_created' | 'comment_added' | 'document_updated' | 'document_shared';
  documentId: number;
  documentTitle: string;
  versionId?: number;
  message: string;
  userId: number;
  createdAt: string;
  read: boolean;
}