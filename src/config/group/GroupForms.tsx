import { useState, useEffect } from 'react';
import { X, Search, UserPlus } from 'lucide-react';
import { Group } from '../../types/group';
import { User } from '../../types/user';
import { useLanguage } from '../../hooks/useLanguage';
import { useGroupStore } from '../../store/groupStore';
import { useUserStore } from '../../store/userStore';
import { useAuthStore } from '../../store/authStore';
import { Modal } from '../../components/forms/Modal';
import { FormInput } from '../../components/forms/FormField';
import { StatusBadge } from '../../components/common/StatusBadge';

interface GroupFormProps {
    group?: Group;
    isOpen: boolean;
    onClose: () => void;
}

export const GroupForm = ({ group, isOpen, onClose }: GroupFormProps) => {
    const { t } = useLanguage();
    const { addGroup, updateGroup, addUserToGroup, removeUserFromGroup } = useGroupStore();
    const { fetchUsers, users } = useUserStore();
    const { user: currentUser } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const isEditing = !!group;

    const [formData, setFormData] = useState({
        name: '',
        description: ''
    });

    // Carregar dados do grupo ao editar
    useEffect(() => {
        if (group) {
            setFormData({
                name: group.name,
                description: group.description
            });
        }
    }, [group]);

    const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
    const [availableUsers, setAvailableUsers] = useState<User[]>([]);
    const [userSearchTerm, setUserSearchTerm] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Carregar usuários disponíveis na empresa atual
    useEffect(() => {
        const loadUsers = async () => {
            setLoadingUsers(true);
            try {
                await fetchUsers();
            } catch (error) {
                console.error('Failed to fetch users:', error);
            } finally {
                setLoadingUsers(false);
            }
        };

        loadUsers();
    }, [fetchUsers]);

    // Filtrar usuários da empresa atual e definir listas
    useEffect(() => {
        if (users.length > 0) {
            // Inicialmente, todos os usuários disponíveis são da empresa atual
            const usersInSameCompany = users.filter(u =>
                u.companyId === currentUser?.companyId && u.isActive
            );

            if (group && group.users) {
                // Se estiver editando, configura os usuários selecionados
                const groupUserIds = group.users.map(u => u.userId);
                const initialSelectedUsers = usersInSameCompany.filter(u =>
                    groupUserIds.includes(u.userId)
                );
                setSelectedUsers(initialSelectedUsers);

                // Usuários disponíveis são aqueles que não estão no grupo
                const initialAvailableUsers = usersInSameCompany.filter(u =>
                    !groupUserIds.includes(u.userId)
                );
                setAvailableUsers(initialAvailableUsers);
            } else {
                // Se estiver criando, todos os usuários da empresa estão disponíveis
                setAvailableUsers(usersInSameCompany);
            }
        }
    }, [users, group, currentUser?.companyId]);



    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;

        // Atualiza os dados do formulário
        setFormData({
            ...formData,
            [name]: value
        });

        // Limpa erros quando o campo é editado
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = t('nameRequired');
        }

        if (!formData.description.trim()) {
            newErrors.description = t('descriptionRequired');
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Filtrar usuários disponíveis com base no termo de busca
    const filteredAvailableUsers = availableUsers.filter(
        user =>
            user.name.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(userSearchTerm.toLowerCase())
    );

    // Adicionar usuário ao grupo
    const handleAddUser = (user: User) => {
        // Atualiza a lista de usuários selecionados
        setSelectedUsers([...selectedUsers, user]);

        // Remove o usuário da lista de disponíveis
        setAvailableUsers(availableUsers.filter(u => u.userId !== user.userId));
    };

    // Remover usuário do grupo
    const handleRemoveUser = (user: User) => {
        // Remove o usuário da lista de selecionados
        setSelectedUsers(selectedUsers.filter(u => u.userId !== user.userId));

        // Adiciona o usuário de volta à lista de disponíveis
        setAvailableUsers([...availableUsers, user]);
    };

    // Manipular submissão do formulário
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        setLoading(true);
        try {
            if (isEditing && group) {
                // Atualizar grupo existente
                await updateGroup(group.groupId, formData);

                // Sincronizar usuários no grupo
                const currentUserIds = group.users?.map(u => u.userId) || [];
                const newUserIds = selectedUsers.map(u => u.userId);

                // Usuários a adicionar (estão em newUserIds mas não em currentUserIds)
                const usersToAdd = selectedUsers.filter(u =>
                    !currentUserIds.includes(u.userId)
                );

                // Usuários a remover (estão em currentUserIds mas não em newUserIds)
                const usersToRemove = group.users?.filter(u =>
                    !newUserIds.includes(u.userId)
                ) || [];

                // Adicionar novos usuários
                for (const user of usersToAdd) {
                    await addUserToGroup(group.groupId, user.userId);
                }

                // Remover usuários que não estão mais no grupo
                for (const user of usersToRemove) {
                    await removeUserFromGroup(group.groupId, user.userId);
                }

            } else {
                // Criar novo grupo - adicionando o userId do usuário atual
                const newGroup = await addGroup({
                    ...formData,
                    companyId: currentUser?.companyId || 0,
                    userId: currentUser?.userId || 0
                });

                // Adicionar usuários ao novo grupo
                if (newGroup && newGroup.groupId) {
                    for (const user of selectedUsers) {
                        await addUserToGroup(newGroup.groupId, user.userId);
                    }
                }
            }

            onClose();
        } catch (error) {
            console.error('Form submission failed:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={isEditing ? t('editGroup') : t('addGroup')}
            maxWidth="lg"
        >
            <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                    <FormInput
                        id="name"
                        name="name"
                        label={t('name')}
                        value={formData.name}
                        onChange={handleChange}
                        error={errors.name}
                        required
                    />

                    <FormInput
                        id="description"
                        name="description"
                        label={t('description')}
                        value={formData.description}
                        onChange={handleChange}
                        error={errors.description}
                        required
                    />

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {t('users')}
                        </label>

                        {/* Usuários Selecionados */}
                        <div className="mb-4">
                            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                {t('selectedUsers')} ({selectedUsers.length})
                            </h4>
                            {selectedUsers.length > 0 ? (
                                <div className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md p-2 min-h-[60px]">
                                    <div className="flex flex-wrap gap-2">
                                        {selectedUsers.map((user) => (
                                            <div
                                                key={user.userId}
                                                className="flex items-center space-x-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full text-xs"
                                            >
                                                <span>{user.name}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveUser(user)}
                                                    className="text-blue-500 hover:text-blue-700 dark:text-blue-300 dark:hover:text-blue-100"
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md p-3 text-center text-sm text-gray-500 dark:text-gray-400 italic">
                                    {t('noUsersSelected')}
                                </div>
                            )}
                        </div>

                        {/* Adicionar Usuários */}
                        <div className="mt-4">
                            <div className="flex justify-between items-center">
                                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    {t('addUsers')}
                                </h4>

                                {/* Barra de Pesquisa */}
                                <div className="relative w-64">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Search className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        className="block w-full pl-10 pr-3 py-1.5 text-sm border border-gray-300 rounded-md leading-5 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        placeholder={t('searchUsers')}
                                        value={userSearchTerm}
                                        onChange={(e) => setUserSearchTerm(e.target.value)}
                                    />
                                    {userSearchTerm && (
                                        <button
                                            type="button"
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                            onClick={() => setUserSearchTerm('')}
                                        >
                                            <X className="h-4 w-4 text-gray-400" />
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Lista de Usuários Disponíveis */}
                            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-sm mt-2 max-h-60 overflow-y-auto">
                                {loadingUsers ? (
                                    <div className="flex justify-center items-center py-6">
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                                    </div>
                                ) : filteredAvailableUsers.length > 0 ? (
                                    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                                        {filteredAvailableUsers.map((user) => (
                                            <li key={user.userId} className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 flex justify-between items-center">
                                                <div>
                                                    <div className="font-medium text-sm dark:text-white">{user.name}</div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400">{user.email}</div>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <StatusBadge
                                                        label={t(user.profile === 1 ? 'administrator' : user.profile === 2 ? 'manager' : 'employee')}
                                                        variant={user.profile === 1 ? 'info' : user.profile === 2 ? 'warning' : 'default'}
                                                        size="sm"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => handleAddUser(user)}
                                                        className="p-1 rounded-full text-blue-600 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-900"
                                                        title={t('addToGroup')}
                                                    >
                                                        <UserPlus className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400 italic">
                                        {userSearchTerm ? t('noUsersFound') : t('noUsersAvailable')}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex justify-end space-x-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 dark:text-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                        disabled={loading}
                    >
                        {t('cancel')}
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                        disabled={loading}
                    >
                        {loading && (
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        )}
                        {isEditing ? t('update') : t('create')}
                    </button>
                </div>
            </form>
        </Modal>
    );
};