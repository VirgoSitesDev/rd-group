import React from 'react';
import styled from 'styled-components';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined' | 'flat';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'; // FIXED: Aggiungi 'xl'
  hoverable?: boolean;
  clickable?: boolean;
  onClick?: () => void;
  className?: string;
  // FIXED: Aggiungi style prop
  style?: React.CSSProperties;
}

const getCardVariant = (variant: CardProps['variant'], theme: any) => {
  switch (variant) {
    case 'elevated':
      return `
        background: ${theme.colors.background.paper};
        box-shadow: ${theme.shadows.lg};
        border: none;
      `;
    case 'outlined':
      return `
        background: ${theme.colors.background.paper};
        border: 1px solid ${theme.colors.border};
        box-shadow: none;
      `;
    case 'flat':
      return `
        background: ${theme.colors.background.paper};
        border: none;
        box-shadow: none;
      `;
    default:
      return `
        background: ${theme.colors.background.paper};
        box-shadow: ${theme.shadows.sm};
        border: 1px solid ${theme.colors.border}40;
      `;
  }
};

const getCardPadding = (padding: CardProps['padding'], theme: any) => {
  switch (padding) {
    case 'none':
      return '0';
    case 'sm':
      return theme.spacing.md;
    case 'lg':
      return theme.spacing.xl;
    case 'xl':
      return theme.spacing.xxl; // FIXED: Aggiungi supporto per xl
    default:
      return theme.spacing.lg;
  }
};

const StyledCard = styled.div<CardProps>`
  ${({ variant, theme }) => getCardVariant(variant, theme)}
  
  padding: ${({ padding, theme }) => getCardPadding(padding, theme)};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  cursor: ${({ clickable }) => clickable ? 'pointer' : 'default'};

  ${({ hoverable, theme }) => hoverable && `
    &:hover {
      transform: translateY(-4px);
      box-shadow: ${theme.shadows.xl};
    }
  `}

  ${({ clickable, hoverable, theme }) => clickable && !hoverable && `
    &:hover {
      box-shadow: ${theme.shadows.md};
    }
    
    &:active {
      transform: translateY(1px);
    }
  `}

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary.main}40;
  }
`;

const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  hoverable = false,
  clickable = false,
  onClick,
  className,
  style, // FIXED: Accetta style prop
  ...restProps // FIXED: Passa tutte le altre props
}) => {
  const handleClick = () => {
    if (clickable && onClick) {
      onClick();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (clickable && onClick && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      onClick();
    }
  };

  return (
    <StyledCard
      variant={variant}
      padding={padding}
      hoverable={hoverable}
      clickable={clickable}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={clickable ? 0 : undefined}
      role={clickable ? 'button' : undefined}
      className={className}
      style={style} // FIXED: Passa style
      {...restProps} // FIXED: Spread delle props rimanenti
    >
      {children}
    </StyledCard>
  );
};

export default Card;