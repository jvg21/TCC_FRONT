// src/components/pages/Companies.tsx (Updated)
import { useState, useEffect } from 'react';
import { Building } from 'lucide-react';
import { Company } from '../../types/company';
import { useCompanyStore } from '../../store/companyStore';
import { useLanguage } from '../../hooks/useLanguage';
import { getCompanyColumns } from './CompanyColumns';
import { SectionHeader } from '../../components/common/SectionHeader';
import { PageLayout } from '../../components/common/PageLayout';
import { SearchBar } from '../../components/common/SearchBar';
import { DataTable } from '../../components/common/DataTable';
import { CompanyForm } from './CompanyForm';
import { ConfirmationModal } from '../../components/forms/ConfirmationModal';

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

  // Get columns configuration
  const columns = getCompanyColumns({
    onEdit: setEditingCompany,
    onToggle: setToggleCompany
  });

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