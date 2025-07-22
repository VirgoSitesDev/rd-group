import React from 'react';
import styled from 'styled-components';
import { FaExclamationTriangle, FaTrash, FaTimes } from 'react-icons/fa';
import Button from '../common/Button';
import type { Car } from '../../types/car/car';

interface DeleteConfirmDialogProps {
  vehicle: Car;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const DialogOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1100;
`;

const DialogContainer = styled.div`
  background: white;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  max-width: 500px;
  width: 90%;
  box-shadow: ${({ theme }) => theme.shadows.xl};
  animation: slideIn 0.2s ease-out;

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-20px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
`;

const DialogHeader = styled.div`
  padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.xl};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.background.default};
  border-radius: ${({ theme }) => theme.borderRadius.lg} ${({ theme }) => theme.borderRadius.lg} 0 0;
`;

const WarningIcon = styled.div`
  color: ${({ theme }) => theme.colors.warning};
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: ${({ theme }) => theme.colors.warning}20;
  border-radius: 50%;
`;

const DialogTitle = styled.h3`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 1.2rem;
`;

const DialogContent = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
`;

const VehicleInfo = styled.div`
  background: ${({ theme }) => theme.colors.background.default};
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin: ${({ theme }) => theme.spacing.lg} 0;
  border-left: 4px solid ${({ theme }) => theme.colors.primary.main};
`;

const VehicleTitle = styled.div`
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  font-size: 1.1rem;
`;

const VehicleDetails = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 0.9rem;
`;

const VehicleDetail = styled.div`
  display: flex;
  justify-content: space-between;
`;

const WarningMessage = styled.p`
  color: ${({ theme }) => theme.colors.text.primary};
  margin: ${({ theme }) => theme.spacing.lg} 0 0 0;
  line-height: 1.5;
  
  strong {
    color: ${({ theme }) => theme.colors.error};
  }
`;

const DialogActions = styled.div`
  padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.xl};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  justify-content: flex-end;
  background: ${({ theme }) => theme.colors.background.default};
  border-radius: 0 0 ${({ theme }) => theme.borderRadius.lg} ${({ theme }) => theme.borderRadius.lg};
`;

const DeleteConfirmDialog: React.FC<DeleteConfirmDialogProps> = ({
  vehicle,
  onConfirm,
  onCancel,
  isLoading = false
}) => {

  const formatPrice = (price: number) => {
    return `€${price.toLocaleString('it-IT')}`;
  };

  const formatMileage = (mileage: number) => {
    return `${mileage.toLocaleString('it-IT')} km`;
  };

  const getFuelTypeLabel = (fuelType: string) => {
    const labels: Record<string, string> = {
      'petrol': 'Benzina',
      'diesel': 'Diesel',
      'electric': 'Elettrico',
      'hybrid': 'Ibrido',
      'lpg': 'GPL',
      'cng': 'Metano'
    };
    return labels[fuelType] || fuelType;
  };

  const getTransmissionLabel = (transmission: string) => {
    const labels: Record<string, string> = {
      'manual': 'Manuale',
      'automatic': 'Automatico',
      'semi_automatic': 'Semiautomatico'
    };
    return labels[transmission] || transmission;
  };

  return (
    <DialogOverlay onClick={onCancel}>
      <DialogContainer onClick={(e) => e.stopPropagation()}>
        <DialogHeader>
          <WarningIcon>
            <FaExclamationTriangle />
          </WarningIcon>
          <DialogTitle>Conferma Eliminazione</DialogTitle>
        </DialogHeader>

        <DialogContent>
          <p>Sei sicuro di voler eliminare questo veicolo dal catalogo?</p>

          <VehicleInfo>
            <VehicleTitle>
              {vehicle.make} {vehicle.model} {vehicle.variant && `(${vehicle.variant})`}
            </VehicleTitle>
            <VehicleDetails>
              <VehicleDetail>
                <span>Anno:</span>
                <strong>{vehicle.year}</strong>
              </VehicleDetail>
              <VehicleDetail>
                <span>Prezzo:</span>
                <strong>{formatPrice(vehicle.price)}</strong>
              </VehicleDetail>
              <VehicleDetail>
                <span>Km:</span>
                <strong>{formatMileage(vehicle.mileage)}</strong>
              </VehicleDetail>
              <VehicleDetail>
                <span>Alimentazione:</span>
                <strong>{getFuelTypeLabel(vehicle.fuelType)}</strong>
              </VehicleDetail>
              <VehicleDetail>
                <span>Cambio:</span>
                <strong>{getTransmissionLabel(vehicle.transmission)}</strong>
              </VehicleDetail>
              <VehicleDetail>
                <span>Categoria:</span>
                <strong>{vehicle.isLuxury ? 'Luxury' : 'Standard'}</strong>
              </VehicleDetail>
            </VehicleDetails>
          </VehicleInfo>

          <WarningMessage>
            <strong>Attenzione:</strong> Questa azione non può essere annullata. 
            Il veicolo e tutte le sue immagini verranno eliminati definitivamente 
            dal database e non saranno più visibili nel catalogo pubblico.
          </WarningMessage>
        </DialogContent>

        <DialogActions>
          <Button 
            variant="outline" 
            onClick={onCancel}
            disabled={isLoading}
          >
            <FaTimes /> Annulla
          </Button>
          <Button 
            variant="danger" 
            onClick={onConfirm}
            disabled={isLoading}
            loading={isLoading}
          >
            <FaTrash /> Elimina Definitivamente
          </Button>
        </DialogActions>
      </DialogContainer>
    </DialogOverlay>
  );
};

export default DeleteConfirmDialog;