import React, { forwardRef } from 'react';
import { clsx } from 'clsx';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'solid' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children?: React.ReactNode;
  className?: string;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'solid',
      size = 'md',
      children = 'Button',
      className,
      ...rest
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type="button"
        className={clsx(
          'inline-flex items-center justify-center font-medium transition-colors focus:outline-none disabled:opacity-50',
          variant === 'solid' &&
            'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800',
          variant === 'outline' &&
            'border-2 border-blue-600 text-blue-600 hover:bg-blue-50',
          variant === 'ghost' && 'text-blue-600 hover:bg-blue-50',
          size === 'sm' && 'px-3 py-1.5 text-sm rounded-md',
          size === 'md' && 'px-4 py-2 text-base rounded-lg',
          size === 'lg' && 'px-6 py-3 text-lg rounded-xl',
          className
        )}
        {...rest}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
