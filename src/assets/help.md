# Implementação do Novo Campo "novocampo" em Diferentes Funcionalidades

Vou detalhar o processo de adicionar um novo campo chamado "novocampo" para cada uma das três funcionalidades principais do sistema: Empresa, Usuário e Grupo.

## 1. Implementação em Empresas

Para adicionar "novocampo" à funcionalidade de Empresas, você precisará:

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

   useEffect(() => {
    if (company) {
      setFormData({
        name: company.name,
        taxId: company.taxId,
        email: company.email,
        phone: company.phone,
        adress: company.adress,
        zipCode: company.zipCode,
        novocampo: company.novocampo
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
   // src/config/company/columns.tsx
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

   
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        password: user.password || '',
        profile: user.profile.toString() || '3',
        preferredLanguage: user.preferredLanguage.toString() || '1',
        preferredTheme: user.preferredTheme.toString() || '1',
        companyId: user.companyId,
        novocampo:user.novocampo

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
   // src/config/user/columns.tsx
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
   // src/config/company/GroupForms.tsx
   // Atualizar o estado do formulário
   const [formData, setFormData] = useState({
     name: '',
     description: '',
     novocampo: '' // Novo campo adicionado
   });
   // ALTERAR USE EEFECT
    useEffect(() => {
        if (group) {
            setFormData({
                name: group.name,
                description: group.description
                novocampo: group.novocampo
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
   // src/config/group/columns.tsx
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

Cada uma destas implementações inclui a atualização do tipo de dados, adição do campo ao formulário de entrada e adição do campo à visualização em tabela. Lembre-se de adicionar também as devidas traduções no arquivo de idiomas para que o novo campo apareça corretamente na interface.