import React from 'react';
import styled from 'styled-components';

interface ContainerProps {
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
}

const getMaxWidth = (size: ContainerProps['maxWidth']) => {
  switch (size) {
    case 'sm':
      return '640px';
    case 'md':
      return '768px';
    case 'lg':
      return '1024px';
    case 'xl':
      return '100vw';
    case 'full':
      return '100%';
    default:
      return '100vw';
  }
};

const getPadding = (size: ContainerProps['padding'], theme: any) => {
  switch (size) {
    case 'none':
      return '0';
    case 'sm':
      return `0 ${theme.spacing.sm}`;
    case 'md':
      return `0 ${theme.spacing.md}`;
    case 'lg':
      return `0 ${theme.spacing.lg}`;
    default:
      return `0 ${theme.spacing.md}`;
  }
};

const ContainerWrapper = styled.div<ContainerProps>`
  max-width: ${({ maxWidth }) => getMaxWidth(maxWidth)};
  margin: 0 auto;
  padding: ${({ padding, theme }) => getPadding(padding, theme)};
  width: 100%;

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: ${({ padding, theme }) => 
      padding === 'none' ? '0' : 
      padding === 'sm' ? `0 ${theme.spacing.md}` :
      padding === 'md' ? `0 ${theme.spacing.lg}` :
      padding === 'lg' ? `0 ${theme.spacing.xl}` :
      `0 ${theme.spacing.lg}`
    };
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    padding: ${({ padding, theme }) => 
      padding === 'none' ? '0' : 
      padding === 'sm' ? `0 ${theme.spacing.lg}` :
      padding === 'md' ? `0 ${theme.spacing.xl}` :
      padding === 'lg' ? `0 ${theme.spacing.xxl}` :
      `0 ${theme.spacing.xl}`
    };
  }
`;

const Container: React.FC<ContainerProps> = ({ 
  children, 
  maxWidth = 'xl', 
  padding = 'lg',
  className 
}) => {
  return (
    <ContainerWrapper 
      maxWidth={maxWidth} 
      padding={padding}
      className={className}
    >
      {children}
    </ContainerWrapper>
  );
};

export default Container;