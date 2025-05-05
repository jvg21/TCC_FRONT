# Implementação do Novo Campo "novocampo" em Diferentes Funcionalidades

Este guia detalha o processo completo para adicionar um novo campo chamado "novocampo" para cada uma das três funcionalidades principais do sistema: Empresa, Usuário e Grupo.

## 1. Implementação em Empresas

Para adicionar "novocampo" à funcionalidade de Empresas, você precisará modificar os seguintes arquivos:

1. **Atualizar o tipo Company**:
   ```typescript
   // src/types/company.ts
   export interface Company {
     companyId: number;
     name: string;
     taxId: string;
     email: string;
     phone: string;
     adress: string;
     zipCode: string;
     novocampo: string; // Novo campo adicionado
     isActive: boolean;
     createdAt: string;
     updatedAt: string;
   }
   ```

2. **Adicionar o campo ao formulário**:
   ```typescript
   // src/config/company/CompanyForm.tsx
   // Adicionar ao estado do formulário
   const [formData, setFormData] = useState({
     name: '',
     taxId: '',
     email: '',
     phone: '',
     adress: '',
     zipCode: '',
     novocampo: '' // Novo campo adicionado
   });

   // Adicionar ao useEffect para edição
   useEffect(() => {
     if (company) {
       setFormData({
         name: company.name,
         taxId: company.taxId,
         email: company.email,
         phone: company.phone,
         adress: company.adress,
         zipCode: company.zipCode,
         novocampo: company.novocampo || '' // Incluir valor existente ou vazio
       });
     }
   }, [company]);
   
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

3. **Atualizar as colunas da tabela**:
   ```typescript
   // src/config/company/CompanyColumns.tsx
   // Adicionar a coluna na configuração
   {
     header: t('novocampo'),
     accessor: (company) => (
       <div className="text-sm text-gray-500 dark:text-gray-300">
         {company.novocampo}
       </div>
     )
   },
   ```

4. **Adicionar validação para o campo (opcional)**:
   ```typescript
   // src/config/company/CompanyForm.tsx
   // No método validate()
   if (!formData.novocampo.trim()) {
     newErrors.novocampo = t('novocampoRequired');
   }
   ```

5. **Atualizar arquivo de idiomas (opcional)**:
   ```typescript
   // src/i18n/index.ts
   // Adicionar nas traduções em inglês
   novocampo: 'New Field',
   novocampoRequired: 'New Field is required',
   
   // Adicionar nas traduções em português
   novocampo: 'Novo Campo',
   novocampoRequired: 'Novo Campo é obrigatório',
   ```

## 2. Implementação em Usuários

Para adicionar "novocampo" à funcionalidade de Usuários, siga estes passos:

1. **Atualizar o tipo User**:
   ```typescript
   // src/types/user.ts
   export interface User {
     userId: number;
     name: string;
     email: string;
     password?: string;
     profile: number;
     preferredLanguage: number;
     preferredTheme: number;
     novocampo: string; // Novo campo adicionado
     createdAt: Date;
     updatedAt: Date;
     lastLoginAt?: Date;
     companyId: number;
     isActive: boolean;
   }
   ```

2. **Adicionar o campo ao formulário**:
   ```typescript
   // src/config/user/UserForm.tsx
   // Atualizar o estado inicial
   const [formData, setFormData] = useState({
     name: '',
     email: '',
     password: '',
     profile: '3',
     preferredLanguage: '1',
     preferredTheme: '1',
     novocampo: '', // Novo campo adicionado
     companyId: 0
   });

   // Atualizar o useEffect para edição
   useEffect(() => {
     if (user) {
       setFormData({
         name: user.name || '',
         email: user.email || '',
         password: user.password || '',
         profile: user.profile.toString() || '3',
         preferredLanguage: user.preferredLanguage.toString() || '1',
         preferredTheme: user.preferredTheme.toString() || '1',
         novocampo: user.novocampo || '',
         companyId: user.companyId
       });
     }
   }, [user]);
   
   // Adicionar ao formulário (dentro do JSX)
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

3. **Atualizar as colunas da tabela**:
   ```typescript
   // src/config/user/UserColumns.tsx
   // Adicionar a nova coluna
   {
     header: t('novocampo'),
     accessor: (user) => (
       <div className="text-sm text-gray-500 dark:text-gray-300">
         {user.novocampo}
       </div>
     )
   },
   ```

4. **Adicionar validação para o campo (opcional)**:
   ```typescript
   // src/config/user/UserForm.tsx
   // No método validate()
   if (!formData.novocampo.trim()) {
     newErrors.novocampo = t('novocampoRequired');
   }
   ```

## 3. Implementação em Grupos

Para adicionar "novocampo" à funcionalidade de Grupos, faça o seguinte:

1. **Atualizar o tipo Group**:
   ```typescript
   // src/types/group.ts
   export interface Group {
     groupId: number;
     name: string;
     description: string;
     novocampo: string; // Novo campo adicionado
     isActive: boolean;
     companyId: number;
     userId: number;
     createdAt: string;
     updatedAt: string;
     users?: User[];
   }
   ```

2. **Adicionar o campo ao formulário**:
   ```typescript
   // src/config/group/GroupForms.tsx
   // Atualizar o estado do formulário
   const [formData, setFormData] = useState({
     name: '',
     description: '',
     novocampo: '' // Novo campo adicionado
   });
   
   // Atualizar o useEffect para edição
   useEffect(() => {
     if (group) {
       setFormData({
         name: group.name,
         description: group.description,
         novocampo: group.novocampo || ''
       });
     }
   }, [group]);
   
   // Adicionar ao formulário (dentro do JSX)
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

3. **Atualizar as colunas da tabela**:
   ```typescript
   // src/config/group/GroupColumns.tsx
   // Adicionar à configuração de colunas
   {
     header: t('novocampo'),
     accessor: (group) => (
       <div className="text-sm text-gray-500 dark:text-gray-300">
         {group.novocampo}
       </div>
     )
   },
   ```

4. **Adicionar validação para o campo (opcional)**:
   ```typescript
   // src/config/group/GroupForms.tsx
   // No método validate()
   if (!formData.novocampo.trim()) {
     newErrors.novocampo = t('novocampoRequired');
   }
   ```

## Resumo dos Arquivos a Modificar

### Para Empresas
- src/types/company.ts
- src/config/company/CompanyForm.tsx
- src/config/company/CompanyColumns.tsx

### Para Usuários
- src/types/user.ts
- src/config/user/UserForm.tsx
- src/config/user/UserColumns.tsx

### Para Grupos
- src/types/group.ts
- src/config/group/GroupForms.tsx
- src/config/group/GroupColumns.tsx

### Geral
- src/i18n/index.ts (para adicionar traduções)