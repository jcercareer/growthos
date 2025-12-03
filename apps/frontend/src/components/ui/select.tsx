import * as React from 'react';
import { cn } from '@/lib/utils';

// Simple Select wrapper components that work without Radix UI

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  onValueChange?: (value: string) => void;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, value, onValueChange, onChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      if (onValueChange) {
        onValueChange(e.target.value);
      }
      if (onChange) {
        onChange(e);
      }
    };

    return (
      <select
        className={cn(
          'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={ref}
        value={value}
        onChange={handleChange}
        {...props}
      >
        {children}
      </select>
    );
  }
);
Select.displayName = 'Select';

// SelectTrigger - acts as the select itself in our simple implementation
const SelectTrigger = Select;

// SelectValue - placeholder component (not needed for native select, but kept for API compatibility)
const SelectValue = ({ placeholder }: { placeholder?: string }) => {
  return null; // Placeholder is handled by the <option> with value=""
};

// SelectContent - wrapper for options (just passes through children)
const SelectContent = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

// SelectItem - option element
interface SelectItemProps {
  value: string;
  children: React.ReactNode;
  disabled?: boolean;
}

const SelectItem = ({ value, children, disabled }: SelectItemProps) => {
  return (
    <option value={value} disabled={disabled}>
      {children}
    </option>
  );
};

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem };
