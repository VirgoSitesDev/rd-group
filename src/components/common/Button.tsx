import React from 'react';
import styled from 'styled-components';

export interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  onClick?: (event?: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  style?: React.CSSProperties;
  as?: any;
  to?: string;
  href?: string;
}

const getButtonStyles = (variant: ButtonProps['variant'], theme: any) => {
  switch (variant) {
    case 'primary':
      return `
        background: ${theme.colors.primary.main};
        color: white;
        border: none;
        text-decoration: none;
        
        &:hover:not(:disabled) {
          background: ${theme.colors.primary.main};
          color: white;
          text-decoration: none;
          transform: translateY(-1px);
          box-shadow: ${theme.shadows.md};
        }

        &:focus:not(:disabled), &:active:not(:disabled) {
          background: ${theme.colors.primary.main};
          color: white;
          text-decoration: none;
        }

        &:visited {
          color: white;
          text-decoration: none;
        }

        /* Override specifico per quando viene usato come Link */
        &&&& {
          color: white !important;
          text-decoration: none !important;
        }

        &&&&:hover, &&&&:focus, &&&&:active, &&&&:visited {
          color: white !important;
          text-decoration: none !important;
        }
      `;
    case 'outline':
      return `
        background: transparent;
        color: ${theme.colors.primary.main};
        border: 2px solid ${theme.colors.primary.main};
        
        &:hover:not(:disabled) {
          background: ${theme.colors.primary.main};
          color: white;
        }
      `;
    case 'ghost':
      return `
        background: transparent;
        color: ${theme.colors.primary.main};
        border: none;
        
        &:hover:not(:disabled) {
          background: ${theme.colors.primary.main}10;
          color: ${theme.colors.primary.main};
        }
      `;
    case 'danger':
      return `
        background: ${theme.colors.error};
        color: white;
        border: none;
        
        &:hover:not(:disabled) {
          background: ${theme.colors.error}DD;
          color: white;
          transform: translateY(-1px);
        }
      `;
    default:
      return `
        background: ${theme.colors.primary.main};
        color: white;
        border: none;
        text-decoration: none;
        
        &:hover:not(:disabled) {
          background: ${theme.colors.primary.main};
          color: white;
          text-decoration: none;
          transform: translateY(-1px);
          box-shadow: ${theme.shadows.md};
        }

        &:focus:not(:disabled), &:active:not(:disabled) {
          background: ${theme.colors.primary.main};
          color: white;
          text-decoration: none;
        }

        &:visited {
          color: white;
          text-decoration: none;
        }

        /* Override specifico per quando viene usato come Link */
        &&&& {
          color: white !important;
          text-decoration: none !important;
        }

        &&&&:hover, &&&&:focus, &&&&:active, &&&&:visited {
          color: white !important;
          text-decoration: none !important;
        }
      `;
  }
};

const getButtonSize = (size: ButtonProps['size'], theme: any) => {
  switch (size) {
    case 'sm':
      return `
        padding: ${theme.spacing.sm} ${theme.spacing.md};
        font-size: 0.875rem;
        min-height: 36px;
      `;
    case 'lg':
      return `
        padding: ${theme.spacing.lg} ${theme.spacing.xl};
        font-size: 1.125rem;
        min-height: 52px;
      `;
    default:
      return `
        padding: ${theme.spacing.md} ${theme.spacing.lg};
        font-size: 1rem;
        min-height: 44px;
      `;
  }
};

const StyledButton = styled.button<ButtonProps>`
  ${({ variant, theme }) => getButtonStyles(variant, theme)}
  ${({ size, theme }) => getButtonSize(size, theme)}
  
  width: ${({ fullWidth }) => fullWidth ? '100%' : 'auto'};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  position: relative;
  overflow: hidden;
  color: white;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
    box-shadow: none !important;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary.main}40;
  }

  /* Loading state */
  ${({ loading }) => loading && `
    pointer-events: none;
    
    &::after {
      content: '';
      position: absolute;
      width: 16px;
      height: 16px;
      border: 2px solid transparent;
      border-top: 2px solid currentColor;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `}
`;

const ButtonContent = styled.span<{ loading?: boolean }>`
  opacity: ${({ loading }) => loading ? 0 : 1};
  transition: opacity 0.2s ease;
`;

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  className,
  style,
  as,
  to,
  href,
  ...restProps
}) => {
  return (
    <StyledButton
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      disabled={disabled || loading}
      loading={loading}
      onClick={onClick}
      type={type}
      className={className}
      style={style}
      as={as}
      to={to}
      href={href}
      {...restProps}
    >
      <ButtonContent loading={loading}>
        {children}
      </ButtonContent>
    </StyledButton>
  );
};

export default Button;