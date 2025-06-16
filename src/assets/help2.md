# Implementação do Novo Campo "novocampo" em Tasks e Documents

Este documento detalha o processo de adicionar um novo campo chamado "novocampo" para as funcionalidades de **Tasks** e **Documents**, seguindo os mesmos padrões estabelecidos no projeto.

## 1. Implementação em Tasks

Para adicionar "novocampo" à funcionalidade de Tasks, você precisará:

### 1.1 **Atualizar o tipo Task**:
```typescript
// src/types/task.ts
export interface Task {
  taskId: number;
  title: string;
  description: string;
  dueDate: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId?: number;
  createdById: number;
  groupId?: number;
  companyId: number;
  novocampo: string; // Novo campo adicionado
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  assignee?: User;
  createdBy?: User;
  group?: Group;
}
```

### 1.2 **Adicionar o campo ao formulário**:
```typescript
// src/config/task/TaskForm.tsx
// Atualizar o estado do formulário
const [formData, setFormData] = useState({
  title: '',
  description: '',
  dueDate: '',
  status: TaskStatus.Pending,
  priority: TaskPriority.Medium,
  assigneeId: '',
  groupId: '',
  novocampo: '' // Novo campo adicionado
});

useEffect(() => {
  if (task) {
    setFormData({
      title: task.title,
      description: task.description,
      dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
      status: task.status,
      priority: task.priority,
      assigneeId: task.assigneeId?.toString() || '',
      groupId: task.groupId?.toString() || '',
      novocampo: task.novocampo || ''
    });
  }
}, [task]);

// Adicionar o campo ao formulário (dentro do JSX)
<FormInput
  id="novocampo"
  name="novocampo"
  label={t('novocampo')}
  value={formData.novocampo}
  onChange={handleChange}
  error={errors.novocampo}
  required
/>
```

### 1.3 **Atualizar as colunas da tabela**:
```typescript
// src/config/task/columns.tsx
// Adicionar a coluna na configuração
{
  header: t('novocampo'),
  accessor: (task) => (
    <div className="text-sm text-gray-500 dark:text-gray-300">
      {task.novocampo}
    </div>
  )
},
```

### 1.4 **Atualizar o store de Tasks**:
```typescript
// src/store/taskStore.ts
// No método addTask, incluir o novo campo
const newTask: any = {
  title: taskData.title,
  description: taskData.description,
  dueDate: taskData.dueDate,
  status: taskData.status,
  priority: taskData.priority,
  assigneeId: taskData.assigneeId,
  groupId: taskData.groupId,
  novocampo: taskData.novocampo // Novo campo adicionado
};

// No método updateTask, incluir o novo campo
const updateData: any = {
  taskId: id,
  title: taskData.title,
  description: taskData.description,
  dueDate: taskData.dueDate,
  status: taskData.status,
  priority: taskData.priority,
  assigneeId: taskData.assigneeId,
  groupId: taskData.groupId,
  novocampo: taskData.novocampo // Novo campo adicionado
};
```

## 2. Implementação em Documents

Para adicionar "novocampo" à funcionalidade de Documents, siga estes passos:

### 2.1 **Atualizar o tipo Document**:
```typescript
// src/types/document.ts
export interface Document {
  documentId: number;
  title: string;
  content: string;
  folderId: number;
  userId: number;
  novocampo: string; // Novo campo adicionado
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  folder?: Folder;
  user?: User;
  tags?: Tag[];
  versions?: DocumentVersion[];
}
```

### 2.2 **Adicionar o campo ao formulário**:
```typescript
// src/config/document/DocumentForms.tsx
// Atualizar o estado do formulário
const [formData, setFormData] = useState({
  title: '',
  content: '',
  folderId: '1', // Pasta padrão
  userId: user?.userId || 0,
  novocampo: '' // Novo campo adicionado
});

useEffect(() => {
  if (document) {
    setFormData({
      title: document.title || '',
      content: document.content || '',
      folderId: document.folderId.toString(),
      userId: document.userId,
      novocampo: document.novocampo || ''
    });
  } else {
    setFormData({
      title: '',
      content: '# Novo Documento\n\nComece a escrever seu conteúdo aqui...',
      folderId: '1', // Pasta padrão
      userId: user?.userId || 0,
      novocampo: ''
    });
  }
}, [document, user]);

// Adicionar o campo ao formulário (dentro do JSX)
<FormInput
  id="novocampo"
  name="novocampo"
  label={t('novocampo')}
  value={formData.novocampo}
  onChange={handleChange}
  error={errors.novocampo}
  required
/>
```

### 2.3 **Atualizar as colunas da tabela**:
```typescript
// src/config/document/columns.tsx
// Adicionar a coluna na configuração
{
  header: t('novocampo'),
  accessor: (document) => (
    <div className="text-sm text-gray-500 dark:text-gray-300">
      {document.novocampo}
    </div>
  )
},
```

### 2.4 **Atualizar o store de Documents**:
```typescript
// src/store/documentStore.ts
// No método addDocument, incluir o novo campo
const newDocument: any = {
  title: documentData.title,
  content: documentData.content,
  folderId: documentData.folderId,
  novocampo: documentData.novocampo // Novo campo adicionado
};

// No método updateDocument, incluir o novo campo
const updateData: any = {
  documentId: id,
  title: documentData.title,
  content: documentData.content,
  folderId: documentData.folderId,
  novocampo: documentData.novocampo // Novo campo adicionado
};
```

## 3. Adicionando Traduções

Para que o novo campo apareça corretamente na interface, adicione as traduções necessárias:

### 3.1 **Arquivo de tradução em Português**:
```typescript
// src/i18n/translations/pt.ts
export const pt = {
  // ... outras traduções
  novocampo: 'Novo Campo',
  novocampoRequired: 'Novo Campo é obrigatório',
  // ... demais traduções
};
```

### 3.2 **Arquivo de tradução em Inglês**:
```typescript
// src/i18n/translations/en.ts
export const en = {
  // ... outras traduções
  novocampo: 'New Field',
  novocampoRequired: 'New Field is required',
  // ... demais traduções
};
```

## 4. Validação do Campo

Para adicionar validação ao novo campo, atualize a função de validação nos formulários:

### 4.1 **Validação em TaskForm**:
```typescript
// src/config/task/TaskForm.tsx
const validate = () => {
  const newErrors: Record<string, string> = {};
  
  if (!formData.title.trim()) {
    newErrors.title = t('titleRequired') || 'Title is required';
  }
  
  if (!formData.description.trim()) {
    newErrors.description = t('descriptionRequired') || 'Description is required';
  }
  
  if (!formData.novocampo.trim()) {
    newErrors.novocampo = t('novocampoRequired') || 'New Field is required';
  }
  
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
```

### 4.2 **Validação em DocumentForm**:
```typescript
// src/config/document/DocumentForms.tsx
const validate = () => {
  const newErrors: Record<string, string> = {};
  
  if (!formData.title.trim()) {
    newErrors.title = t('titleRequired') || 'Title is required';
  }
  
  if (!formData.content.trim()) {
    newErrors.content = t('contentRequired') || 'Content is required';
  }
  
  if (!formData.novocampo.trim()) {
    newErrors.novocampo = t('novocampoRequired') || 'New Field is required';
  }
  
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
```

## 5. Resumo dos Arquivos Modificados

Para cada funcionalidade (Task/Document), os seguintes arquivos precisam ser modificados:

### **Tasks:**
- `src/types/task.ts` - Atualizar interface Task
- `src/config/task/TaskForm.tsx` - Adicionar campo ao formulário
- `src/config/task/columns.tsx` - Adicionar coluna à tabela
- `src/store/taskStore.ts` - Atualizar métodos de CRUD
- `src/i18n/translations/pt.ts` e `src/i18n/translations/en.ts` - Traduções

### **Documents:**
- `src/types/document.ts` - Atualizar interface Document
- `src/config/document/DocumentForms.tsx` - Adicionar campo ao formulário
- `src/config/document/columns.tsx` - Adicionar coluna à tabela
- `src/store/documentStore.ts` - Atualizar métodos de CRUD
- `src/i18n/translations/pt.ts` e `src/i18n/translations/en.ts` - Traduções

Cada uma destas implementações segue exatamente os mesmos padrões estabelecidos no projeto para Empresas, Usuários e Grupos, mantendo total consistência com a base de código existente. 