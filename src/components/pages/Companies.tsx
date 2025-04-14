// src/components/pages/Companies.tsx (Refactored)
import { useState, useEffect } from 'react';
import { Building } from 'lucide-react';
import { Company } from '../../types/company';
import { useCompanyStore } from '../../store/companyStore';
import { useLanguage } from '../../hooks/useLanguage';
import { CompanyForm } from '../forms/CompanyForm';
import { PageLayout } from '../common/PageLayout';
import { SectionHeader } from '../common/SectionHeader';
import { SearchBar } from '../common/SearchBar';
import { DataTable, Column } from '../common/DataTable';
import { ActionButtons } from '../common/ActionButtons';
import { StatusBadge } from '../common/StatusBadge';
import { ConfirmationModal } from '../forms/ConfirmationModal';

export const CompaniesManagement = () => {
  const { t } = useLanguage();
  const { companies, loading, error, fetchCompanies, deleteCompany } = useCompanyStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [toggleCompany, setToggleCompany] = useState<Company | null>(null);

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
      setToggleCompany(null);
    } catch (error) {
      console.error('Toggle activation failed:', error);
    }
  };

  // Table columns definition
  const columns: Column<Company>[] = [
    {
      header: t('name'),
      accessor: (company) => (
        <div className="text-sm font-medium text-gray-900 dark:text-white">
          {company.name}
        </div>
      )
    },
    {
      header: t('taxId'),
      accessor: (company) => (
        <div className="text-sm text-gray-500 dark:text-gray-300">
          {company.taxId}
        </div>
      )
    },
    {
      header: t('contact'),
      accessor: (company) => (
        <div className="text-sm text-gray-500 dark:text-gray-300">
          {company.phone}
        </div>
      )
    },
    {
      header: t('email'),
      accessor: (company) => (
        <div className="text-sm text-gray-500 dark:text-gray-300">
          {company.email}
        </div>
      )
    },
    {
      header: t('zipCode'),
      accessor: (company) => (
        <div className="text-sm text-gray-500 dark:text-gray-300">
          {company.zipCode}
        </div>
      )
    },
    {
      header: t('status'),
      accessor: (company) => (
        <StatusBadge
          label={company.isActive ? t('active') : t('inactive')}
          variant={company.isActive ? 'success' : 'danger'}
        />
      )
    },
    {
      header: t('actions'),
      accessor: (company) => (
        <ActionButtons
          onEdit={() => setEditingCompany(company)}
          onToggle={() => setToggleCompany(company)}
          isActive={company.isActive}
          showToggle={true}
          showDelete={false}
          editTooltip={t('editCompany')}
        />
      ),
      className: 'text-right'
    }
  ];

  return (
    <PageLayout>
      <SectionHeader
        title={t('companies')}
        icon={<Building className="h-8 w-8 text-blue-500" />}
        showAddButton={true}
        addButtonLabel={t('addCompany')}
        onAddClick={() => setShowAddModal(true)}
      />

      <div className="mb-6">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder={t('searchCompanies')}
        />
      </div>

      <DataTable
        columns={columns}
        data={filteredCompanies}
        keyExtractor={(company) => company.companyId}
        isLoading={loading}
        error={error}
        emptyMessage={t('noCompaniesYet')}
        emptySearchMessage={t('noCompaniesFound')}
        searchTerm={searchTerm}
      />

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
          onClose={() => setEditingCompany(null)}
          isOpen={!!editingCompany}
        />
      )}

      {/* Toggle Activation Modal */}
      {toggleCompany && (
        <ConfirmationModal
          isOpen={!!toggleCompany}
          onClose={() => setToggleCompany(null)}
          onConfirm={() => handleToggleActivation(toggleCompany)}
          title={toggleCompany.isActive ? t('confirmDeactivation') : t('confirmActivation')}
          message={toggleCompany.isActive 
            ? t('deactivateCompanyConfirmation') 
            : t('activateCompanyConfirmation')}
          confirmLabel={toggleCompany.isActive ? t('deactivate') : t('activate')}
          cancelLabel={t('cancel')}
          variant={toggleCompany.isActive ? 'danger' : 'success'}
        />
      )}
    </PageLayout>
  );
};