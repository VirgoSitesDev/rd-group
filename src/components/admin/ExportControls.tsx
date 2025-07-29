import React, { useState } from 'react';
import styled from 'styled-components';
import { FaDownload, FaTimes, FaFileExcel } from 'react-icons/fa';
import Button from '../common/Button';

interface ExportControlsProps {
  onClose: () => void;
  onExport: (options: ExportOptions) => Promise<void>;
  isLoading?: boolean;
}

export interface ExportOptions {
  type: 'all' | 'recent';
  recentCount?: number;
  includeLuxury: boolean;
  includeStandard: boolean;
  columns: string[];
  format: 'xlsx' | 'csv';
}

const DialogOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1100;
`;

const DialogContainer = styled.div`
  background: white;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
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
  justify-content: space-between;
  background: ${({ theme }) => theme.colors.background.default};
  border-radius: ${({ theme }) => theme.borderRadius.lg} ${({ theme }) => theme.borderRadius.lg} 0 0;
`;

const DialogTitle = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  
  h3 {
    margin: 0;
    color: ${({ theme }) => theme.colors.text.primary};
    font-size: 1.2rem;
  }

  svg {
    color: ${({ theme }) => theme.colors.primary.main};
    font-size: 1.3rem;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text.primary};
  padding: ${({ theme }) => theme.spacing.xs};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  
  &:hover {
    color: ${({ theme }) => theme.colors.error};
    background: ${({ theme }) => theme.colors.error}10;
  }
`;

const DialogContent = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
  max-height: 80vh;
  overflow-y: auto;
`;

const FormSection = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};

  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h4`
  margin: 0 0 ${({ theme }) => theme.spacing.md} 0;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 1rem;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
`;

const RadioGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const RadioOption = styled.label`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary.main};
    background: ${({ theme }) => theme.colors.primary.main}05;
  }

  input[type="radio"] {
    width: 16px;
    height: 16px;
  }
`;

const RadioContent = styled.div`
  flex: 1;
`;

const RadioTitle = styled.div`
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 2px;
`;

const RadioDescription = styled.div`
  color: ${({ theme }) => theme.colors.text.primary};
  opacity: 0.7;
  font-size: 0.9rem;
`;

const NumberInput = styled.input`
  width: 100px;
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: 0.9rem;
  margin-left: ${({ theme }) => theme.spacing.sm};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary.main};
  }
`;

const CheckboxGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.sm};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

const CheckboxOption = styled.label`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.background.default};
  }

  input[type="checkbox"] {
    width: 16px;
    height: 16px;
  }
`;

const FormatSelector = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const FormatButton = styled.button<{ $isSelected: boolean }>`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 2px solid ${({ $isSelected, theme }) => 
    $isSelected ? theme.colors.primary.main : theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ $isSelected, theme }) => 
    $isSelected ? theme.colors.primary.main : 'white'};
  color: ${({ $isSelected, theme }) => 
    $isSelected ? 'white' : theme.colors.text.primary};
  cursor: pointer;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  transition: all 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary.main};
    background: ${({ $isSelected, theme }) => 
      $isSelected ? theme.colors.primary.main : `${theme.colors.primary.main}10`};
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

const ExportControls: React.FC<ExportControlsProps> = ({
  onClose,
  onExport,
  isLoading = false
}) => {
  const [exportType, setExportType] = useState<'all' | 'recent'>('all');
  const [recentCount, setRecentCount] = useState(50);
  const [includeLuxury, setIncludeLuxury] = useState(true);
  const [includeStandard, setIncludeStandard] = useState(true);
  const [format, setFormat] = useState<'xlsx' | 'csv'>('xlsx');
  const [selectedColumns, setSelectedColumns] = useState<string[]>([
    'make', 'model', 'year', 'price', 'mileage', 'fuelType', 'transmission'
  ]);

  const availableColumns = [
    { key: 'make', label: 'Marca' },
    { key: 'model', label: 'Modello' },
    { key: 'variant', label: 'Versione' },
    { key: 'year', label: 'Anno' },
    { key: 'price', label: 'Prezzo' },
    { key: 'mileage', label: 'Chilometri' },
    { key: 'fuelType', label: 'Alimentazione' },
    { key: 'transmission', label: 'Cambio' },
    { key: 'bodyType', label: 'Carrozzeria' },
    { key: 'color', label: 'Colore' },
    { key: 'doors', label: 'Porte' },
    { key: 'seats', label: 'Posti' },
    { key: 'power', label: 'Potenza (kW)' },
    { key: 'horsepower', label: 'Cavalli (CV)' },
    { key: 'engineSize', label: 'Cilindrata' },
    { key: 'previousOwners', label: 'Proprietari precedenti' },
    { key: 'location', label: 'Sede' },
    { key: 'condition', label: 'Condizione' },
    { key: 'isLuxury', label: 'Categoria' },
    { key: 'createdAt', label: 'Data inserimento' },
  ];

  const handleColumnChange = (columnKey: string, checked: boolean) => {
    if (checked) {
      setSelectedColumns(prev => [...prev, columnKey]);
    } else {
      setSelectedColumns(prev => prev.filter(key => key !== columnKey));
    }
  };

  const handleExport = async () => {
    const options: ExportOptions = {
      type: exportType,
      recentCount: exportType === 'recent' ? recentCount : undefined,
      includeLuxury,
      includeStandard,
      columns: selectedColumns,
      format
    };

    await onExport(options);
  };

  const canExport = selectedColumns.length > 0 && (includeLuxury || includeStandard);

  return (
    <DialogOverlay onClick={onClose}>
      <DialogContainer onClick={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>
            <FaFileExcel />
            <h3>Esporta Catalogo</h3>
          </DialogTitle>
          <CloseButton onClick={onClose}>
            <FaTimes />
          </CloseButton>
        </DialogHeader>

        <DialogContent>
          <FormSection>
            <SectionTitle>Tipo di Export</SectionTitle>
            <RadioGroup>
              <RadioOption>
                <input
                  type="radio"
                  name="exportType"
                  checked={exportType === 'all'}
                  onChange={() => setExportType('all')}
                />
                <RadioContent>
                  <RadioTitle>Tutto il Catalogo</RadioTitle>
                  <RadioDescription>
                    Esporta tutti i veicoli presenti nel database
                  </RadioDescription>
                </RadioContent>
              </RadioOption>

              <RadioOption>
                <input
                  type="radio"
                  name="exportType"
                  checked={exportType === 'recent'}
                  onChange={() => setExportType('recent')}
                />
                <RadioContent>
                  <RadioTitle>Ultime Aggiunte</RadioTitle>
                  <RadioDescription>
                    Esporta solo gli ultimi veicoli aggiunti
                    <NumberInput
                      type="number"
                      min="1"
                      max="1000"
                      value={recentCount}
                      onChange={(e) => setRecentCount(parseInt(e.target.value) || 50)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </RadioDescription>
                </RadioContent>
              </RadioOption>
            </RadioGroup>
          </FormSection>

          <FormSection>
            <SectionTitle>Categorie da Includere</SectionTitle>
            <CheckboxGroup>
              <CheckboxOption>
                <input
                  type="checkbox"
                  checked={includeLuxury}
                  onChange={(e) => setIncludeLuxury(e.target.checked)}
                />
                Veicoli Luxury
              </CheckboxOption>
              <CheckboxOption>
                <input
                  type="checkbox"
                  checked={includeStandard}
                  onChange={(e) => setIncludeStandard(e.target.checked)}
                />
                Veicoli Standard
              </CheckboxOption>
            </CheckboxGroup>
          </FormSection>

          <FormSection>
            <SectionTitle>Formato File</SectionTitle>
            <FormatSelector>
              <FormatButton
                $isSelected={format === 'xlsx'}
                onClick={() => setFormat('xlsx')}
              >
                Excel (.xlsx)
              </FormatButton>
              <FormatButton
                $isSelected={format === 'csv'}
                onClick={() => setFormat('csv')}
              >
                CSV (.csv)
              </FormatButton>
            </FormatSelector>
          </FormSection>

          <FormSection>
            <SectionTitle>Colonne da Esportare ({selectedColumns.length})</SectionTitle>
            <CheckboxGroup>
              {availableColumns.map((column) => (
                <CheckboxOption key={column.key}>
                  <input
                    type="checkbox"
                    checked={selectedColumns.includes(column.key)}
                    onChange={(e) => handleColumnChange(column.key, e.target.checked)}
                  />
                  {column.label}
                </CheckboxOption>
              ))}
            </CheckboxGroup>
          </FormSection>
        </DialogContent>

        <DialogActions>
          <Button 
            variant="outline" 
            onClick={onClose}
            disabled={isLoading}
          >
            Annulla
          </Button>
          <Button 
            variant="primary" 
            onClick={handleExport}
            disabled={isLoading || !canExport}
            loading={isLoading}
          >
            <FaDownload /> Esporta Catalogo
          </Button>
        </DialogActions>
      </DialogContainer>
    </DialogOverlay>
  );
};

export default ExportControls;