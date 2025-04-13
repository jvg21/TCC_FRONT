// src/types/group.ts

export interface Group {
  groupId: number;
  name: string;
  description: string;
  isActive: boolean;
  CompanyId: number;
  createdAt: string;
  updatedAt: string;
}

export interface GroupState {
  groups: Group[];
  loading: boolean;
  error: string | null;
  fetchGroups: () => Promise<void>;
  getGroup: (id: number) => Group | undefined;
  addGroup: (groupData: Omit<Group, 'groupId' | 'isActive' | 'createdAt' | 'updatedAt'>) => Promise<any>;
  updateGroup: (id: number, group: Partial<Group>) => Promise<void>;
  deleteGroup: (id: number) => Promise<void>;
  toggleGroupStatus: (id: number) => Promise<void>;
  addUserToGroup: (groupId: number, userId: string) => Promise<void>;
  removeUserFromGroup: (groupId: number, userId: string) => Promise<void>;
}