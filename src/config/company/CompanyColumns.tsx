// src/config/company/columns.tsx
import { Column } from '../../components/common/DataTable';
import { Company } from '../../types/company';
import { ActionButtons } from '../../components/common/ActionButtons';
import { StatusBadge } from '../../components/common/StatusBadge';
import { useLanguage } from '../../hooks/useLanguage';

interface GetColumnsProps {
  onEdit: (company: Company) => void;
  onToggle: (company: Company) => void;
}

export const getCompanyColumns = ({ onEdit, onToggle }: GetColumnsProps): Column<Company>[] => {
  const { t } = useLanguage();

  return [
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
          onEdit={() => onEdit(company)}
          onToggle={() => onToggle(company)}
          isActive={company.isActive}
          showToggle={true}
          showDelete={false}
          editTooltip={t('editCompany')}
        />
      ),
      className: 'text-right'
    }
  ];
};