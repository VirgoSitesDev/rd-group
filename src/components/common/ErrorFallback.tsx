import React from 'react';
import styled from 'styled-components';
import { FaExclamationTriangle, FaRedo } from 'react-icons/fa';
import Button from './Button';
import Container from '../layout/Container';

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

const ErrorContainer = styled.div`
  min-height: 50vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xxl} 0;
`;

const ErrorContent = styled.div`
  max-width: 500px;
  margin: 0 auto;
`;

const ErrorIcon = styled.div`
  font-size: 4rem;
  color: ${({ theme }) => theme.colors.error};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const ErrorTitle = styled.h1`
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  font-size: 2rem;
`;

const ErrorMessage = styled.p`
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  line-height: 1.6;
`;

const ErrorDetails = styled.details`
  margin-top: ${({ theme }) => theme.spacing.lg};
  text-align: left;
  
  summary {
    cursor: pointer;
    color: ${({ theme }) => theme.colors.text.primary};
    margin-bottom: ${({ theme }) => theme.spacing.md};
    
    &:hover {
      color: ${({ theme }) => theme.colors.primary.main};
    }
  }
`;

const ErrorCode = styled.pre`
  background-color: ${({ theme }) => theme.colors.background.default};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  overflow-x: auto;
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const ErrorActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  justify-content: center;
  margin-top: ${({ theme }) => theme.spacing.xl};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
  }
`;

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ 
  error, 
  resetErrorBoundary 
}) => {
  const handleRefresh = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    window.location.href = '/';
  };

  return (
    <Container>
      <ErrorContainer>
        <ErrorContent>
          <ErrorIcon>
            <FaExclamationTriangle />
          </ErrorIcon>
          
          <ErrorTitle>
            Oops! Qualcosa è andato storto
          </ErrorTitle>
          
          <ErrorMessage>
            Si è verificato un errore inaspettato. Il nostro team è stato notificato 
            e stiamo lavorando per risolvere il problema. Nel frattempo, puoi provare 
            a ricaricare la pagina o tornare alla homepage.
          </ErrorMessage>

          <ErrorActions>
            <Button 
              variant="primary" 
              onClick={resetErrorBoundary}
            >
              <FaRedo /> Riprova
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handleRefresh}
            >
              Ricarica Pagina
            </Button>
            
            <Button 
              variant="ghost" 
              onClick={handleGoHome}
            >
              Torna alla Home
            </Button>
          </ErrorActions>

          {/* Dettagli tecnici dell'errore (solo in dev) */}
          {process.env.NODE_ENV === 'development' && (
            <ErrorDetails>
              <summary>Dettagli tecnici dell'errore</summary>
              <ErrorCode>
                <strong>Nome:</strong> {error.name}{'\n'}
                <strong>Messaggio:</strong> {error.message}{'\n'}
                <strong>Stack trace:</strong>{'\n'}{error.stack}
              </ErrorCode>
            </ErrorDetails>
          )}
        </ErrorContent>
      </ErrorContainer>
    </Container>
  );
};

export default ErrorFallback;