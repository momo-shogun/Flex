import * as React from 'react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

/** Normalize to #rrggbb for native color input (6 hex digits). */
function toHex6(value: string): string {
  const hex = value.replace(/^#/, '').trim();
  if (hex.length === 6 && /^[0-9A-Fa-f]{6}$/.test(hex)) return `#${hex}`;
  if (hex.length === 3 && /^[0-9A-Fa-f]{3}$/.test(hex))
    return `#${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`;
  return value || '#000000';
}

export interface ColorPickerFieldProps {
  value: string;
  onChange: (hex: string) => void;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  disabled?: boolean;
}

export const ColorPickerField = React.forwardRef<HTMLInputElement, ColorPickerFieldProps>(
  (
    {
      value,
      onChange,
      placeholder = '#000000',
      className,
      inputClassName,
      disabled = false,
    },
    ref
  ) => {
    const hex6 = React.useMemo(() => toHex6(value || '#000000'), [value]);
    const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value);
    };
    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = e.target.value;
      onChange(v.startsWith('#') ? v : v ? `#${v}` : '');
    };
    return (
      <div className={cn('flex gap-2 items-center', className)}>
        <input
          ref={ref}
          type="color"
          value={hex6}
          onChange={handleColorChange}
          disabled={disabled}
          className="h-9 w-9 shrink-0 rounded border border-slate-600 cursor-pointer bg-transparent p-0.5 [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-0 [&::-webkit-color-swatch]:rounded"
          title="Pick color"
        />
        <Input
          value={value || ''}
          onChange={handleTextChange}
          placeholder={placeholder}
          disabled={disabled}
          className={cn('flex-1 font-mono text-xs', inputClassName)}
        />
      </div>
    );
  }
);
ColorPickerField.displayName = 'ColorPickerField';
