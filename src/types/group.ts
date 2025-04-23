// Atualização do src/types/group.ts
// Garantindo que o tipo Group inclui corretamente o array de usuários

import { User } from "./user";

export interface Group {
  groupId: number;
  name: string;
  description: string;
  isActive: boolean;
  companyId: number;
  userId: number; 
  createdAt: string;
  updatedAt: string;
  users?: User[]; // Usuários associados ao grupo
}

export interface GroupState {
  groups: Group[];
  loading: boolean;
  error: string | null;
  fetchGroups: () => Promise<void>;
  getGroup: (id: number) => Group | undefined;
  addGroup: (groupData: Omit<Group, 'groupId' | 'isActive' | 'createdAt' | 'updatedAt'>) => Promise<Group>;
  updateGroup: (id: number, group: Partial<Group>) => Promise<void>;
  toggleGroupStatus: (id: number) => Promise<void>;
  addUserToGroup: (groupId: number, userId: number) => Promise<any>;
  removeUserFromGroup: (groupId: number, userId: number) => Promise<any>;
}