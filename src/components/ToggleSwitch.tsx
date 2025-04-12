// src/components/ToggleSwitch.tsx
import React from 'react';

interface ToggleSwitchProps {
  isActive: boolean;
  onChange: () => void;
  disabled?: boolean;
  activeColor?: string;
  inactiveColor?: string;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  labelPosition?: 'left' | 'right';
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  isActive,
  onChange,
  disabled = false,
  activeColor = 'bg-green-500 hover:bg-green-600',
  inactiveColor = 'bg-red-500 hover:bg-red-600',
  size = 'md',
  label,
  labelPosition = 'right'
}) => {
  const sizes = {
    sm: {
      container: 'h-4 w-8',
      toggle: 'h-3 w-3',
      translateX: isActive ? 'translate-x-4' : 'translate-x-1',
      labelClass: 'text-xs'
    },
    md: {
      container: 'h-6 w-11',
      toggle: 'h-5 w-5',
      translateX: isActive ? 'translate-x-5' : 'translate-x-1',
      labelClass: 'text-sm'
    },
    lg: {
      container: 'h-8 w-14',
      toggle: 'h-6 w-6',
      translateX: isActive ? 'translate-x-7' : 'translate-x-1',
      labelClass: 'text-base'
    }
  };

  const currentSize = sizes[size];

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (!disabled) onChange();
    }
  };

  const toggle = (
    <button
      type="button"
      onClick={disabled ? undefined : onChange}
      onKeyDown={handleKeyDown}
      disabled={disabled}
      className={`relative inline-flex ${currentSize.container} items-center rounded-full transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
        isActive ? activeColor : inactiveColor
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      role="switch"
      aria-checked={isActive}
    >
      <span className="sr-only">{isActive ? 'Active' : 'Inactive'}</span>
      <span 
        className={`inline-block ${currentSize.toggle} transform rounded-full bg-white shadow-md transition-transform duration-300 ease-in-out ${
          currentSize.translateX
        }`} 
      />
    </button>
  );

  if (!label) return toggle;

  return (
    <div className="flex items-center gap-2">
      {labelPosition === 'left' && (
        <span className={`${currentSize.labelClass} font-medium ${disabled ? 'opacity-50' : ''}`}>
          {label}
        </span>
      )}
      
      {toggle}
      
      {labelPosition === 'right' && (
        <span className={`${currentSize.labelClass} font-medium ${disabled ? 'opacity-50' : ''}`}>
          {label}
        </span>
      )}
    </div>
  );
};