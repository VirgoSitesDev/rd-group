import { theme } from '@/styles/theme';
import React from 'react';
import styled, { keyframes } from 'styled-components';

interface LoadingProps {
  type?: 'spinner' | 'skeleton' | 'dots' | 'pulse';
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  fullScreen?: boolean;
  className?: string;
}

// Animazioni
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0% { opacity: 1; }
  50% { opacity: 0.4; }
  100% { opacity: 1; }
`;

const bounce = keyframes`
  0%, 80%, 100% { 
    transform: scale(0);
    opacity: 0.5;
  } 
  40% { 
    transform: scale(1);
    opacity: 1;
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`;

// Container principale - FIXED: Semplifica le tipizzazioni
const LoadingContainer = styled.div<{ $fullScreen?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.md};
  
  ${({ $fullScreen, theme }) => $fullScreen && `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: ${theme.colors.background.default}F0;
    z-index: ${theme.zIndex.modal};
  `}
  
  ${({ $fullScreen, theme }) => !$fullScreen && `
    padding: ${theme.spacing.xl};
  `}
`;

// Spinner - FIXED: Semplifica le tipizzazioni
const Spinner = styled.div<{ $size: LoadingProps['size'] }>`
  border: 3px solid ${({ theme }) => theme.colors.border};
  border-top: 3px solid ${({ theme }) => theme.colors.primary.main};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
  
  ${({ $size }) => {
    switch ($size) {
      case 'sm':
        return `width: 24px; height: 24px;`;
      case 'lg':
        return `width: 64px; height: 64px;`;
      default:
        return `width: 40px; height: 40px;`;
    }
  }}
`;

// Dots
const DotsContainer = styled.div`
  display: flex;
  gap: 8px;
`;

const Dot = styled.div<{ $size: LoadingProps['size']; $delay: number }>`
  background-color: ${({ theme }) => theme.colors.primary.main};
  border-radius: 50%;
  animation: ${bounce} 1.4s ease-in-out infinite both;
  animation-delay: ${({ $delay }) => $delay}s;
  
  ${({ $size }) => {
    switch ($size) {
      case 'sm':
        return `width: 8px; height: 8px;`;
      case 'lg':
        return `width: 16px; height: 16px;`;
      default:
        return `width: 12px; height: 12px;`;
    }
  }}
`;

// Skeleton
const SkeletonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  width: 100%;
`;

const SkeletonLine = styled.div<{ $width?: string; $height?: string }>`
background: ${theme.colors.primary.main};
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s ease-in-out infinite;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  
  width: ${({ $width }) => $width || '100%'};
  height: ${({ $height }) => $height || '16px'};
`;

// Pulse
const PulseContainer = styled.div<{ $size: LoadingProps['size'] }>`
  background-color: ${({ theme }) => theme.colors.primary.main};
  border-radius: 50%;
  animation: ${pulse} 1.5s ease-in-out infinite;
  
  ${({ $size }) => {
    switch ($size) {
      case 'sm':
        return `width: 24px; height: 24px;`;
      case 'lg':
        return `width: 64px; height: 64px;`;
      default:
        return `width: 40px; height: 40px;`;
    }
  }}
`;

// Testo di caricamento
const LoadingText = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 0.9rem;
  text-align: center;
`;

const Loading: React.FC<LoadingProps> = ({
  type = 'spinner',
  size = 'md',
  text,
  fullScreen = false,
  className
}) => {
  const renderLoadingContent = () => {
    switch (type) {
      case 'spinner':
        return <Spinner $size={size} />;
      
      case 'dots':
        return (
          <DotsContainer>
            <Dot $size={size} $delay={0} />
            <Dot $size={size} $delay={0.2} />
            <Dot $size={size} $delay={0.4} />
          </DotsContainer>
        );
      
      case 'pulse':
        return <PulseContainer $size={size} />;
      
      case 'skeleton':
        return (
          <SkeletonContainer>
            <SkeletonLine $height="20px" $width="80%" />
            <SkeletonLine $height="16px" $width="60%" />
            <SkeletonLine $height="16px" $width="90%" />
            <SkeletonLine $height="16px" $width="40%" />
          </SkeletonContainer>
        );
      
      default:
        return <Spinner $size={size} />;
    }
  };

  return (
    <LoadingContainer $fullScreen={fullScreen} className={className}>
      {renderLoadingContent()}
      {text && <LoadingText>{text}</LoadingText>}
    </LoadingContainer>
  );
};

export default Loading;