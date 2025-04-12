import { useState, useEffect } from 'react';
import { Building, Plus, Edit, Search } from 'lucide-react';
import { Company } from '../../types/company';
import { useCompanyStore } from '../../store/companyStore';
import { useLanguage } from '../../hooks/useLanguage';
import { NavBar } from '../NavBar';
import { CompanyForm } from '../CompanyForm';
import { ToggleSwitch } from '../ToggleSwitch';

export const CompaniesManagement = () => {
  const { t } = useLanguage();
  const { companies, loading, error, fetchCompanies, deleteCompany } = useCompanyStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [showToggleModal, setShowToggleModal] = useState<Company | null>(null);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  const filteredCompanies = companies.filter(company => 
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.phone.includes(searchTerm) ||
    company.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.taxId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleActivation = async (company: Company) => {
    try {
      await deleteCompany(company.companyId);
      setShowToggleModal(null);
    } catch (error) {
      console.error('Toggle activation failed:', error);
    }
  };

  const handleEdit = (company: Company) => {
    setEditingCompany(company);
  };

  const handleCloseEdit = () => {
    setEditingCompany(null);
  };

  // Toggle Switch Component
  

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <NavBar />

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center">
                <Building className="h-8 w-8 text-blue-500 mr-2" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {t('companies')}
                </h2>
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                <Plus className="h-5 w-5 mr-1" />
                {t('addCompany')}
              </button>
            </div>

            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder={t('searchCompanies')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors duration-200"
                />
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <div className="bg-red-100 dark:bg-red-900 p-4 rounded-lg text-red-700 dark:text-red-200">
                {error}
              </div>
            ) : filteredCompanies.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                {searchTerm ? t('noCompaniesFound') : t('noCompaniesYet')}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        {t('name')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        {t('taxId')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        {t('contact')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        {t('email')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        {t('zipCode')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        {t('status')}
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        {t('actions')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredCompanies.map((company) => (
                      <tr key={company.companyId} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {company.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500 dark:text-gray-300">
                            {company.taxId}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500 dark:text-gray-300">
                            {company.phone}
                          </div>
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500 dark:text-gray-300">
                          {company.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500 dark:text-gray-300">
                          {company.zipCode}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            company.isActive 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          }`}>
                            {company.isActive ? t('active') : t('inactive')}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-3">
                            <button
                              onClick={() => handleEdit(company)}
                              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
                              title={t('editCompany')}
                            >
                              <Edit className="h-5 w-5" />
                            </button>
                            <ToggleSwitch 
                              isActive={company.isActive}
                              onChange={() => setShowToggleModal(company)}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Add Company Modal */}
      {showAddModal && (
        <CompanyForm
          onClose={() => setShowAddModal(false)}
          isOpen={showAddModal}
        />
      )}

      {/* Edit Company Modal */}
      {editingCompany && (
        <CompanyForm
          company={editingCompany}
          onClose={handleCloseEdit}
          isOpen={!!editingCompany}
        />
      )}

      {/* Toggle Activation Modal */}
      {showToggleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6 transform transition-all duration-300 ease-in-out scale-100 opacity-100">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              {showToggleModal.isActive ? t('confirmDeactivation') : t('confirmActivation')}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              {showToggleModal.isActive 
                ? t('deactivateCompanyConfirmation') 
                : t('activateCompanyConfirmation')}
            </p>
            <div className="flex flex-col sm:flex-row justify-end gap-3 sm:space-x-4">
              <button
                onClick={() => setShowToggleModal(null)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
              >
                {t('cancel')}
              </button>
              <button
                onClick={() => handleToggleActivation(showToggleModal)}
                className={`px-4 py-2 text-white rounded-lg transition-colors duration-200 ${
                  showToggleModal.isActive
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {showToggleModal.isActive ? t('deactivate') : t('activate')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};