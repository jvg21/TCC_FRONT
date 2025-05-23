// src/i18n/translations/en.ts - English translations

export const enTranslations = {
  // Authentication
  login: 'Login',
  register: 'Register',
  forgotPassword: 'Forgot Password',
  email: 'Email',
  password: 'Password',
  submit: 'Submit',
  loading: 'Loading...',
  
  // General UI
  name: 'Name',
  dashboard: 'Dashboard',
  welcome: 'Welcome',
  logout: 'Logout',
  darkMode: 'Dark Mode',
  lightMode: 'Light Mode',
  language: 'Language',
  changeLanguage: 'Change Language',
  settings: 'Settings',
  options: 'Options',
  close: 'Close',
  back: 'Back',
  
  // Employee Management
  employeeManagement: 'Employee Management',
  addEmployee: 'Add Employee',
  editEmployee: 'Edit Employee',
  deleteEmployee: 'Delete Employee',
  searchEmployees: 'Search employees...',
  confirmDelete: 'Are you sure you want to delete this?',
  cancel: 'Cancel',
  save: 'Save',
  department: 'Department',
  position: 'Position',
  hireDate: 'Hire Date',
  actions: 'Actions',
  selectDepartment: 'Select department',
  sectorManagement: 'Sector Management',
  
  // Company Management
  companies: 'Companies',
  addCompany: 'Add Company',
  editCompany: 'Edit Company',
  searchCompanies: 'Search companies...',
  taxId: 'Tax ID',  // CNPJ
  phone: 'Phone',
  adress: 'Address',  // Mantendo a grafia do contrato (adress em vez de address)
  zipCode: 'ZIP Code',
  isActive: 'Active',
  createdAt: 'Created At',
  updatedAt: 'Updated At',
  status: 'Status',
  active: 'Active',
  inactive: 'Inactive',
  contact: 'Contact',
  noCompaniesFound: 'No companies found matching your search',
  noCompaniesYet: 'No companies added yet',
  delete: 'Delete',
  update: 'Update',
  create: 'Create',
  
  // Validation
  nameRequired: 'Name is required',
  taxIdRequired: 'Tax ID is required',
  invalidTaxId: 'Invalid Tax ID format',
  emailRequired: 'Email is required',
  invalidEmail: 'Invalid email format',
  phoneRequired: 'Phone is required',
  adressRequired: 'Address is required',
  zipCodeRequired: 'ZIP Code is required',
  invalidZipCode: 'Invalid ZIP Code format',
  titleRequired: 'Title is required',
  descriptionRequired: 'Description is required',
  
  // Document Management
  documents: 'Documents',
  addDocument: 'Add Document',
  editDocument: 'Edit Document',
  documentWorkspace: 'Document Workspace',
  searchDocuments: 'Search documents...',
  noDocumentsFound: 'No documents found matching your search',
  noDocumentsYet: 'No documents added yet',
  title: 'Title',
  format: 'Format',
  folder: 'Folder',
  content: 'Content',
  
  // Task Management - Novos textos adicionados
  tasks: 'Tasks',
  taskDashboard: 'Task Dashboard',
  addTask: 'Add Task',
  editTask: 'Edit Task',
  taskManagement: 'Task Management',
  searchTasks: 'Search tasks...',
  noTasksFound: 'No tasks found matching your search',
  noTasksYet: 'No tasks added yet',
  description: 'Description',
  dueDate: 'Due Date',
  assignee: 'Assignee',
  viewDetails: 'View Details',
  quickActions: 'Quick Actions',
  changeStatus: 'Change Status',
  changePriority: 'Change Priority',
  people: 'People',
  createdBy: 'Created By',
  group: 'Group',
  noGroup: 'No Group',
  unassigned: 'Unassigned',
  assignTask: 'Assign Task',
  unassign: 'Unassign',
  deactivateTask: 'Deactivate Task',
  activateTask: 'Activate Task',
  deactivateTaskConfirmation: 'Are you sure you want to deactivate this task: {{title}}?',
  activateTaskConfirmation: 'Are you sure you want to activate this task: {{title}}?',
  currentlyAssignedTo: 'Currently assigned to',
  searchUsers: 'Search users...',
  noUsers: 'No users available',
  noUsersFound: 'No users found matching your search',
  
  // Task Statuses
  todo: 'To Do',
  inProgress: 'In Progress',
  inReview: 'In Review',
  done: 'Done',
  archived: 'Archived',
  pending: 'Pending',
  noTodoTasks: 'No pending tasks',
  noInProgressTasks: 'No tasks in progress',
  noReviewTasks: 'No tasks in review',
  noCompletedTasks: 'No completed tasks',
  
  // Task Priorities
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  urgent: 'Urgent',
  
  // Task Dashboard
  upcomingDeadlines: 'Upcoming Deadlines',
  noUpcomingDeadlines: 'No upcoming deadlines',
  taskStatistics: 'Task Statistics',
  totalTasks: 'Total Tasks',
  completed: 'Completed',
  allTasks: 'All Tasks',
  
  // Theme preferences
  darkModeEnabled: 'Dark mode is enabled',
  darkModeDisabled: 'Dark mode is disabled',
  toggleTheme: 'Toggle theme',
  
  // Dates and timestamps
  dates: 'Dates',
  
  // User roles
  administrator: 'Administrator',
  manager: 'Manager',
  employee: 'Employee',
  unknown: 'Unknown',
  
  // User preferences
  preferredLanguage: 'Preferred Language',
  preferredTheme: 'Preferred Theme',
  english: 'English',
  portuguese: 'Portuguese',
  light: 'Light',
  dark: 'Dark',
  
  // Group management
  groups: 'Groups',
  addGroup: 'Add Group',
  editGroup: 'Edit Group',
  deleteGroup: 'Delete Group',
  searchGroups: 'Search groups...',
  noGroupsFound: 'No groups found matching your search',
  noGroupsYet: 'No groups added yet',
  users: 'Users',
  selectedUsers: 'Selected Users',
  addUsers: 'Add Users',
  noUsersSelected: 'No users selected',
  usersInGroup: 'Users in Group',
  totalUsers: 'Total Users',
  noUsersInGroup: 'No users in this group',
  
  // Error messages
  formatInfo: 'Format Info',
  deleteGroupConfirmation: 'Are you sure you want to delete this group?',
  confirmDeactivation: 'Confirm Deactivation',
  confirmActivation: 'Confirm Activation',
  deactivateCompanyConfirmation: 'Are you sure you want to deactivate this company?',
  activateCompanyConfirmation: 'Are you sure you want to activate this company?',
  deactivate: 'Deactivate',
  activate: 'Activate',
  
  // Specific task translations
  assign: 'Assign',
  
  // Other
  pageNotFound: 'Page Not Found',
  pageNotFoundMessage: 'Sorry, the page you are looking for does not exist.',
  goHome: 'Go Home',
  goBack: 'Go Back',
};