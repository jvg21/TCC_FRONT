
interface MaskedFormInputProps {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  error?: string;
  required?: boolean;
  placeholder?: string;
  helpText?: string;
  className?: string;
  mask?: MaskType;
  maxLength?: number;
  autoComplete?: string;
}

export const MaskedFormInput: React.FC<MaskedFormInputProps> = ({ 
  id, 
  name, 
  label, 
  value, 
  onChange, 
  type = 'text', 
  error, 
  required = false,
  placeholder = '',
  helpText,
  className = '',
  mask,
  maxLength,
  autoComplete = 'off'
}) => {
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value;
    
    // Aplica máscara se especificada
    if (mask) {
      inputValue = InputMasks.applyMask(inputValue, mask);
    }
    
    // Cria evento sintético com valor mascarado
    const maskedEvent = {
      ...e,
      target: {
        ...e.target,
        name: e.target.name,
        value: inputValue
      }
    } as React.ChangeEvent<HTMLInputElement>;
    
    onChange(maskedEvent);
  };

  return (
    <FormField
      id={id}
      name={name}
      label={label}
      error={error}
      required={required}
      className={className}
      helpText={helpText}
    >
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        maxLength={maxLength}
        autoComplete={autoComplete}
        className={`mt-1 block w-full px-3 py-2 border ${
          error ? 'border-red-500' : 'border-gray-300'
        } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white placeholder-gray-400 dark:placeholder-gray-500`}
      />
    </FormField>
  );
};

// src/components/forms/FormField.tsx (Atualizado para manter compatibilidade)
import React, { ReactNode } from 'react';
import { InputMasks, MaskType } from '../utils/inputMasks';

interface FormFieldProps {
  id: string;
  name: string;
  label: string;
  error?: string;
  required?: boolean;
  className?: string;
  helpText?: string;
  children: ReactNode;
}

export const FormField: React.FC<FormFieldProps> = ({
  id,
  name,
  label,
  error,
  required = false,
  className = '',
  helpText,
  children
}) => {
  return (
    <div className={className}>
      <label 
        htmlFor={id} 
        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
      >
        {label}{required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      {children}
      
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
          <span className="w-4 h-4 mr-1">⚠</span>
          {error}
        </p>
      )}
      
      {helpText && !error && (
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          {helpText}
        </p>
      )}
    </div>
  );
};

// Mantém o FormInput original para compatibilidade
export const FormInput: React.FC<{
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  error?: string;
  required?: boolean;
  placeholder?: string;
  helpText?: string;
  className?: string;
}> = ({ 
  id, 
  name, 
  label, 
  value, 
  onChange, 
  type = 'text', 
  error, 
  required = false,
  placeholder = '',
  helpText,
  className = ''
}) => {
  return (
    <FormField
      id={id}
      name={name}
      label={label}
      error={error}
      required={required}
      className={className}
      helpText={helpText}
    >
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`mt-1 block w-full px-3 py-2 border ${
          error ? 'border-red-500' : 'border-gray-300'
        } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white placeholder-gray-400 dark:placeholder-gray-500`}
      />
    </FormField>
  );
};

export const FormSelect: React.FC<{
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
  error?: string;
  required?: boolean;
  placeholder?: string;
  helpText?: string;
  className?: string;
}> = ({ 
  id, 
  name, 
  label, 
  value, 
  onChange, 
  options, 
  error, 
  required = false,
  placeholder = '',
  helpText,
  className = ''
}) => {
  return (
    <FormField
      id={id}
      name={name}
      label={label}
      error={error}
      required={required}
      className={className}
      helpText={helpText}
    >
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        className={`mt-1 block w-full px-3 py-2 border ${
          error ? 'border-red-500' : 'border-gray-300'
        } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white`}
      >
        {placeholder && (
          <option value="">{placeholder}</option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FormField>
  );
};

export const FormTextarea: React.FC<{
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  rows?: number;
  error?: string;
  required?: boolean;
  placeholder?: string;
  helpText?: string;
  className?: string;
}> = ({ 
  id, 
  name, 
  label, 
  value, 
  onChange, 
  rows = 3, 
  error, 
  required = false,
  placeholder = '',
  helpText,
  className = ''
}) => {
  return (
    <FormField
      id={id}
      name={name}
      label={label}
      error={error}
      required={required}
      className={className}
      helpText={helpText}
    >
      <textarea
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        rows={rows}
        placeholder={placeholder}
        className={`mt-1 block w-full px-3 py-2 border ${
          error ? 'border-red-500' : 'border-gray-300'
        } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 resize-vertical`}
      />
    </FormField>
  );
};