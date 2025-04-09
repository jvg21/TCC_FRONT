import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Pencil, Trash2, Search, X, UserPlus, Users } from 'lucide-react';
import { NavBar } from '../NavBar';

interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  position: string;
  hireDate: string;
}

interface Sector {
  id: string;
  name: string;
  description: string;
  employees: Employee[];
}

export const SectorManagement = () => {
  const { t } = useTranslation();
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentSector, setCurrentSector] = useState<Sector | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Employee-related state
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployees, setSelectedEmployees] = useState<Employee[]>([]);
  const [employeeSearchTerm, setEmployeeSearchTerm] = useState('');
  
  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    // Simulate fetching data from an API
    const mockEmployees: Employee[] = [
      {
        id: '1',
        name: 'John Doe',
        email: 'john.doe@company.com',
        department: 'IT',
        position: 'Software Developer',
        hireDate: '2022-01-15',
      },
      {
        id: '2',
        name: 'Jane Smith',
        email: 'jane.smith@company.com',
        department: 'HR',
        position: 'HR Manager',
        hireDate: '2021-08-10',
      },
      {
        id: '3',
        name: 'Bob Johnson',
        email: 'bob.johnson@company.com',
        department: 'Finance',
        position: 'Accountant',
        hireDate: '2023-03-22',
      },
      {
        id: '4',
        name: 'Alice Williams',
        email: 'alice.williams@company.com',
        department: 'Marketing',
        position: 'Marketing Specialist',
        hireDate: '2022-05-18',
      },
      {
        id: '5',
        name: 'Carlos Rodriguez',
        email: 'carlos.rodriguez@company.com',
        department: 'IT',
        position: 'Systems Analyst',
        hireDate: '2021-11-30',
      },
    ];
    
    const mockSectors: Sector[] = [
      {
        id: '1',
        name: 'Development',
        description: 'Software development team',
        employees: [mockEmployees[0], mockEmployees[4]],
      },
      {
        id: '2',
        name: 'Human Resources',
        description: 'HR department',
        employees: [mockEmployees[1]],
      },
      {
        id: '3',
        name: 'Finance',
        description: 'Finance department',
        employees: [mockEmployees[2]],
      },
    ];
    
    setEmployees(mockEmployees);
    setSectors(mockSectors);
  }, []);

  const filteredSectors = sectors.filter(
    sector =>
      sector.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sector.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredEmployees = employees.filter(
    employee =>
      employee.name.toLowerCase().includes(employeeSearchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(employeeSearchTerm.toLowerCase()) ||
      employee.department.toLowerCase().includes(employeeSearchTerm.toLowerCase()) ||
      employee.position.toLowerCase().includes(employeeSearchTerm.toLowerCase())
  );

  const resetForm = () => {
    setName('');
    setDescription('');
    setSelectedEmployees([]);
    setEmployeeSearchTerm('');
    setCurrentSector(null);
  };

  const openAddModal = () => {
    resetForm();
    setIsAddModalOpen(true);
  };

  const openEditModal = (sector: Sector) => {
    setCurrentSector(sector);
    setName(sector.name);
    setDescription(sector.description);
    setSelectedEmployees([...sector.employees]);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (sector: Sector) => {
    setCurrentSector(sector);
    setIsDeleteModalOpen(true);
  };

  const handleAddSector = (e: React.FormEvent) => {
    e.preventDefault();
    const newSector: Sector = {
      id: (sectors.length + 1).toString(),
      name,
      description,
      employees: selectedEmployees,
    };
    setSectors([...sectors, newSector]);
    setIsAddModalOpen(false);
    resetForm();
  };

  const handleEditSector = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentSector) {
      const updatedSectors = sectors.map(sector =>
        sector.id === currentSector.id
          ? { ...sector, name, description, employees: selectedEmployees }
          : sector
      );
      setSectors(updatedSectors);
      setIsEditModalOpen(false);
      resetForm();
    }
  };

  const handleDeleteSector = () => {
    if (currentSector) {
      const updatedSectors = sectors.filter(
        sector => sector.id !== currentSector.id
      );
      setSectors(updatedSectors);
      setIsDeleteModalOpen(false);
      resetForm();
    }
  };

  const toggleEmployeeSelection = (employee: Employee) => {
    if (selectedEmployees.some(e => e.id === employee.id)) {
      setSelectedEmployees(selectedEmployees.filter(e => e.id !== employee.id));
    } else {
      setSelectedEmployees([...selectedEmployees, employee]);
    }
  };

  const isEmployeeSelected = (employee: Employee) => {
    return selectedEmployees.some(e => e.id === employee.id);
  };

  // Translate these terms - add to your i18n resources
  const sectorManagement = t('sectorManagement') || 'Sector Management';
  const addSector = t('addSector') || 'Add Sector';
  const editSector = t('editSector') || 'Edit Sector';
  const deleteSector = t('deleteSector') || 'Delete Sector';
  const searchSectors = t('searchSectors') || 'Search sectors...';
  const confirmDelete = t('confirmDelete') || 'Are you sure you want to delete this sector?';
  const cancel = t('cancel') || 'Cancel';
  const save = t('save') || 'Save';
  const nameLabel = t('name') || 'Name';
  const descriptionLabel = t('description') || 'Description';
  const employeesLabel = t('employees') || 'Employees';
  const searchEmployees = t('searchEmployees') || 'Search employees...';
  const selectedEmployeesLabel = t('selectedEmployees') || 'Selected Employees';
  const actions = t('actions') || 'Actions';
  const noEmployeesSelected = t('noEmployeesSelected') || 'No employees selected';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <NavBar />

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {sectorManagement}
              </h2>
              <button
                onClick={openAddModal}
                className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center gap-2 hover:bg-blue-700"
              >
                <Plus className="w-5 h-5" />
                {addSector}
              </button>
            </div>

            <div className="mb-6 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder={searchSectors}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setSearchTerm('')}
                >
                  <X className="h-5 w-5 text-gray-400" />
                </button>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {nameLabel}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {descriptionLabel}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {employeesLabel}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {actions}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredSectors.map((sector) => (
                    <tr key={sector.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {sector.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {sector.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        <div className="flex items-center">
                          <Users className="h-5 w-5 mr-2" />
                          <span>{sector.employees.length}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => openEditModal(sector)}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            <Pencil className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => openDeleteModal(sector)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* Add Sector Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              {addSector}
            </h3>
            <form onSubmit={handleAddSector}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {nameLabel}
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {descriptionLabel}
                  </label>
                  <textarea
                    id="description"
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {employeesLabel}
                  </label>
                  
                  {/* Employee Search Bar */}
                  <div className="relative mb-4">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder={searchEmployees}
                      value={employeeSearchTerm}
                      onChange={(e) => setEmployeeSearchTerm(e.target.value)}
                    />
                    {employeeSearchTerm && (
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setEmployeeSearchTerm('')}
                      >
                        <X className="h-5 w-5 text-gray-400" />
                      </button>
                    )}
                  </div>
                  
                  {/* Employee List */}
                  <div className="mt-2 border border-gray-300 dark:border-gray-600 rounded-md max-h-48 overflow-y-auto">
                    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                      {filteredEmployees.map((employee) => (
                        <li key={employee.id} className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700">
                          <label className="flex items-center space-x-3 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={isEmployeeSelected(employee)}
                              onChange={() => toggleEmployeeSelection(employee)}
                              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <div className="flex-1">
                              <div className="font-medium dark:text-white">{employee.name}</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">{employee.email}</div>
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {employee.department} - {employee.position}
                            </div>
                          </label>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* Selected Employees */}
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {selectedEmployeesLabel} ({selectedEmployees.length})
                    </h4>
                    {selectedEmployees.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {selectedEmployees.map((employee) => (
                          <div 
                            key={employee.id}
                            className="flex items-center space-x-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full text-xs"
                          >
                            <span>{employee.name}</span>
                            <button
                              type="button"
                              onClick={() => toggleEmployeeSelection(employee)}
                              className="text-blue-500 hover:text-blue-700 dark:text-blue-300 dark:hover:text-blue-100"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                        {noEmployeesSelected}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 dark:text-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  {cancel}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Sector Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              {editSector}
            </h3>
            <form onSubmit={handleEditSector}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {nameLabel}
                  </label>
                  <input
                    id="edit-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div>
                  <label htmlFor="edit-description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {descriptionLabel}
                  </label>
                  <textarea
                    id="edit-description"
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {employeesLabel}
                  </label>
                  
                  {/* Employee Search Bar */}
                  <div className="relative mb-4">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder={searchEmployees}
                      value={employeeSearchTerm}
                      onChange={(e) => setEmployeeSearchTerm(e.target.value)}
                    />
                    {employeeSearchTerm && (
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setEmployeeSearchTerm('')}
                      >
                        <X className="h-5 w-5 text-gray-400" />
                      </button>
                    )}
                  </div>
                  
                  {/* Employee List */}
                  <div className="mt-2 border border-gray-300 dark:border-gray-600 rounded-md max-h-48 overflow-y-auto">
                    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                      {filteredEmployees.map((employee) => (
                        <li key={employee.id} className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700">
                          <label className="flex items-center space-x-3 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={isEmployeeSelected(employee)}
                              onChange={() => toggleEmployeeSelection(employee)}
                              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <div className="flex-1">
                              <div className="font-medium dark:text-white">{employee.name}</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">{employee.email}</div>
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {employee.department} - {employee.position}
                            </div>
                          </label>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* Selected Employees */}
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {selectedEmployeesLabel} ({selectedEmployees.length})
                    </h4>
                    {selectedEmployees.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {selectedEmployees.map((employee) => (
                          <div 
                            key={employee.id}
                            className="flex items-center space-x-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full text-xs"
                          >
                            <span>{employee.name}</span>
                            <button
                              type="button"
                              onClick={() => toggleEmployeeSelection(employee)}
                              className="text-blue-500 hover:text-blue-700 dark:text-blue-300 dark:hover:text-blue-100"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                        {noEmployeesSelected}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 dark:text-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  {cancel}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              {deleteSector}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {confirmDelete}
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 dark:text-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                {cancel}
              </button>
              <button
                onClick={handleDeleteSector}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                {deleteSector}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};