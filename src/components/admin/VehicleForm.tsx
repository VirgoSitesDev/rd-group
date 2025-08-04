import React, { useState, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { FaTimes, FaUpload, FaTrash, FaSave } from 'react-icons/fa';
import { LuImagePlus } from "react-icons/lu";

import Button from '../common/Button';
import { useCreateVehicle, useUpdateVehicle } from '../../hooks/useCars';
import type { Car } from '../../types/car/car';
import { FuelType, TransmissionType, BodyType, CarCondition } from '../../types/car/car';

interface VehicleFormProps {
  vehicle?: Car | null;
  onClose: () => void;
  onSuccess: () => void;
}

const FormOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  overflow-y: auto;
  padding: ${({ theme }) => theme.spacing.md};
`;

const FormContainer = styled.div`
  background: white;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: ${({ theme }) => theme.shadows.xl};
`;

const FormHeader = styled.div`
  padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.xl};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: ${({ theme }) => theme.colors.background.default};
  border-radius: ${({ theme }) => theme.borderRadius.lg} ${({ theme }) => theme.borderRadius.lg} 0 0;
`;

const FormTitle = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text.primary};
  padding: ${({ theme }) => theme.spacing.xs};
  
  &:hover {
    color: ${({ theme }) => theme.colors.error};
  }
`;

const FormContent = styled.form`
  padding: ${({ theme }) => theme.spacing.xl};
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xl};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};

  &.full-width {
    grid-column: 1 / -1;
  }
`;

const FormLabel = styled.label`
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 0.9rem;
`;

const FormInput = styled.input`
  padding: ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary.main};
  }

  &[type="number"] {
    -moz-appearance: textfield;
    
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  }
`;

const FormSelect = styled.select`
  padding: ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 1rem;
  background: white;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary.main};
  }
`;

const FormTextArea = styled.textarea`
  padding: ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary.main};
  }
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
`;

const ImagesSection = styled.div`
  margin: ${({ theme }) => theme.spacing.xl} 0;
`;

const ImagesSectionTitle = styled.h3`
  margin: 0 0 ${({ theme }) => theme.spacing.lg} 0;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const ImageUploadArea = styled.div<{ $isDragOver: boolean }>`
  border: 3px dashed ${({ $isDragOver, theme }) => 
    $isDragOver ? theme.colors.primary.main : theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.xl};
  text-align: center;
  cursor: pointer;
  background: ${({ $isDragOver, theme }) => 
    $isDragOver ? `${theme.colors.primary.main}10` : theme.colors.background.default};
  transition: all 0.3s ease;
  margin-bottom: ${({ theme }) => theme.spacing.lg};

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary.main};
    background: ${({ theme }) => `${theme.colors.primary.main}05`};
  }
`;

const UploadIcon = styled.div`
  font-size: 3rem;
  color: ${({ theme }) => theme.colors.primary.main};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const UploadText = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 1.1rem;
`;

const UploadSubtext = styled.p`
  margin: ${({ theme }) => theme.spacing.xs} 0 0 0;
  color: ${({ theme }) => theme.colors.text.primary};
  opacity: 0.7;
  font-size: 0.9rem;
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const ImagePreviewGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

const ImagePreview = styled.div`
  position: relative;
  aspect-ratio: 4/3;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const PreviewImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const RemoveImageButton = styled.button`
  position: absolute;
  top: 4px;
  right: 4px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 0.8rem;

  &:hover {
    background: ${({ theme }) => theme.colors.error};
  }
`;

const PrimaryImageBadge = styled.div`
  position: absolute;
  bottom: 4px;
  left: 4px;
  background: ${({ theme }) => theme.colors.primary.main};
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: bold;
`;

const FormActions = styled.div`
  padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.xl};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  justify-content: flex-end;
  background: ${({ theme }) => theme.colors.background.default};
`;

const ProgressBar = styled.div<{ $progress: number }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: rgba(0, 0, 0, 0.1);
  z-index: 1001;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    width: ${({ $progress }) => $progress}%;
    background: ${({ theme }) => theme.colors.primary.main};
    transition: width 0.3s ease;
  }
`;

interface FormData {
  make: string;
  model: string;
  variant: string;
  year: number;
  mileage: number;
  price: number;
  fuelType: FuelType;
  transmission: TransmissionType;
  bodyType: BodyType;
  doors: number;
  seats: number;
  color: string;
  previousOwners: number;
  engineSize: number;
  power: number;
  horsepower: number;
  description: string;
  features: string;
  isLuxury: boolean;
  condition: CarCondition;
  location: string;
}

interface ImageFile {
  file: File;
  preview: string;
  id: string;
}

const VehicleForm: React.FC<VehicleFormProps> = ({ vehicle, onClose, onSuccess }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [imageFiles, setImageFiles] = useState<ImageFile[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const createVehicle = useCreateVehicle();
  const updateVehicle = useUpdateVehicle();

  const [formData, setFormData] = useState<FormData>({
    make: vehicle?.make || '',
    model: vehicle?.model || '',
    variant: vehicle?.variant || '',
    year: vehicle?.year || new Date().getFullYear(),
    mileage: vehicle?.mileage || 0,
    price: vehicle?.price || 0,
    fuelType: vehicle?.fuelType || FuelType.PETROL,
    transmission: vehicle?.transmission || TransmissionType.MANUAL,
    bodyType: vehicle?.bodyType || BodyType.SEDAN,
    doors: vehicle?.doors || 5,
    seats: vehicle?.seats || 5,
    color: vehicle?.color || '',
    previousOwners: vehicle?.previousOwners || 1,
    engineSize: vehicle?.engineSize || 0,
    power: vehicle?.power || 0,
    horsepower: vehicle?.horsepower || 0,
    description: vehicle?.description || '',
    features: vehicle?.features?.join(', ') || '',
    isLuxury: vehicle?.isLuxury || false,
    condition: vehicle?.condition || CarCondition.USED,
    location: vehicle?.location?.address || 'Via Bottaia, 2',
  });

  const handleInputChange = (field: keyof FormData, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files).filter(
      file => file.type.startsWith('image/')
    );
    
    if (files.length > 0) {
      addImageFiles(files);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).filter(
      file => file.type.startsWith('image/')
    );
    
    if (files.length > 0) {
      addImageFiles(files);
    }
    
    if (e.target) {
      e.target.value = '';
    }
  };

  const addImageFiles = (files: File[]) => {
    console.log('📸 Aggiunta nuove immagini:', files.length);
    
    const newImageFiles: ImageFile[] = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    }));

    setImageFiles(prev => [...prev, ...newImageFiles]);
  };

  const removeImageFile = (id: string) => {
    setImageFiles(prev => {
      const imageToRemove = prev.find(img => img.id === id);
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.preview);
      }
      return prev.filter(img => img.id !== id);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setUploadProgress(0);

    try {
      console.log('🚗 Inizio creazione veicolo con', imageFiles.length, 'immagini');

      const vehicleData = {
        ...formData,
        features: formData.features.split(',').map(f => f.trim()).filter(f => f),
        imageFiles: imageFiles.map(img => img.file), // Passa i file originali
        images: [], // Array vuoto, le immagini verranno gestite dal service
        location: {
          address: formData.location,
          city: 'Pistoia',
          region: 'Toscana',
          postalCode: '51100',
          country: 'Italia',
        },
        dealer: {
          id: 'rd-group-1',
          name: 'RD Group',
          phone: '+39 057 318 7467',
          email: 'rdautosrlpistoia@gmail.com',
          location: {
            address: 'Via Bottaia, 2',
            city: 'Pistoia',
            region: 'Toscana',
            postalCode: '51100',
            country: 'Italia',
          },
        },
      };

      if (vehicle) {
        // TODO: Implementare logica per l'aggiornamento
        console.log('⚠️ Update veicolo non ancora implementato con nuove immagini');
        await updateVehicle.mutateAsync({ id: vehicle.id, ...vehicleData });
      } else {
        console.log('🆕 Creazione nuovo veicolo...');
        
        // Simula progresso per la creazione del record
        setUploadProgress(10);
        
        await createVehicle.mutateAsync(vehicleData);
        
        // Simula progresso completato
        setUploadProgress(100);
      }

      console.log('✅ Veicolo salvato con successo!');
      
      // Pulisci le preview
      imageFiles.forEach(img => URL.revokeObjectURL(img.preview));
      
      onSuccess();

    } catch (error) {
      console.error('❌ Errore nel salvataggio veicolo:', error);
      
      let errorMessage = 'Errore sconosciuto durante il salvataggio';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      alert(`❌ Errore: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  // Cleanup delle preview quando il componente viene smontato
  React.useEffect(() => {
    return () => {
      imageFiles.forEach(img => URL.revokeObjectURL(img.preview));
    };
  }, []);

  return (
    <>
      {isSubmitting && uploadProgress > 0 && (
        <ProgressBar $progress={uploadProgress} />
      )}
      
      <FormOverlay onClick={(e) => e.target === e.currentTarget && onClose()}>
        <FormContainer>
          <FormHeader>
            <FormTitle>
              {vehicle ? 'Modifica Veicolo' : 'Aggiungi Nuovo Veicolo'}
            </FormTitle>
            <CloseButton onClick={onClose}>
              <FaTimes />
            </CloseButton>
          </FormHeader>

          <FormContent onSubmit={handleSubmit}>
            <FormGrid>
              <FormGroup>
                <FormLabel>Marca *</FormLabel>
                <FormInput
                  type="text"
                  value={formData.make}
                  onChange={(e) => handleInputChange('make', e.target.value)}
                  required
                />
              </FormGroup>

              <FormGroup>
                <FormLabel>Modello *</FormLabel>
                <FormInput
                  type="text"
                  value={formData.model}
                  onChange={(e) => handleInputChange('model', e.target.value)}
                  required
                />
              </FormGroup>

              <FormGroup>
                <FormLabel>Versione</FormLabel>
                <FormInput
                  type="text"
                  value={formData.variant}
                  onChange={(e) => handleInputChange('variant', e.target.value)}
                />
              </FormGroup>

              <FormGroup>
                <FormLabel>Anno *</FormLabel>
                <FormInput
                  type="number"
                  value={formData.year}
                  onChange={(e) => handleInputChange('year', parseInt(e.target.value))}
                  min="1950"
                  max={new Date().getFullYear() + 1}
                  required
                />
              </FormGroup>

              <FormGroup>
                <FormLabel>Chilometri *</FormLabel>
                <FormInput
                  type="number"
                  value={formData.mileage}
                  onChange={(e) => handleInputChange('mileage', parseInt(e.target.value))}
                  min="0"
                  required
                />
              </FormGroup>

              <FormGroup>
                <FormLabel>Prezzo (€) *</FormLabel>
                <FormInput
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', parseInt(e.target.value))}
                  min="0"
                  required
                />
              </FormGroup>

              <FormGroup>
                <FormLabel>Alimentazione *</FormLabel>
                <FormSelect
                  value={formData.fuelType}
                  onChange={(e) => handleInputChange('fuelType', e.target.value as FuelType)}
                  required
                >
                  <option value={FuelType.PETROL}>Benzina</option>
                  <option value={FuelType.DIESEL}>Diesel</option>
                  <option value={FuelType.ELECTRIC}>Elettrico</option>
                  <option value={FuelType.HYBRID}>Ibrido</option>
                  <option value={FuelType.LPG}>GPL</option>
                  <option value={FuelType.CNG}>Metano</option>
                </FormSelect>
              </FormGroup>

              <FormGroup>
                <FormLabel>Cambio *</FormLabel>
                <FormSelect
                  value={formData.transmission}
                  onChange={(e) => handleInputChange('transmission', e.target.value as TransmissionType)}
                  required
                >
                  <option value={TransmissionType.MANUAL}>Manuale</option>
                  <option value={TransmissionType.AUTOMATIC}>Automatico</option>
                  <option value={TransmissionType.SEMI_AUTOMATIC}>Semiautomatico</option>
                  <option value={TransmissionType.CVT}>CVT</option>
                </FormSelect>
              </FormGroup>

              <FormGroup>
                <FormLabel>Carrozzeria *</FormLabel>
                <FormSelect
                  value={formData.bodyType}
                  onChange={(e) => handleInputChange('bodyType', e.target.value as BodyType)}
                  required
                >
                  <option value={BodyType.SEDAN}>Berlina</option>
                  <option value={BodyType.HATCHBACK}>Utilitaria</option>
                  <option value={BodyType.ESTATE}>Station Wagon</option>
                  <option value={BodyType.SUV}>SUV</option>
                  <option value={BodyType.COUPE}>Coupé</option>
                  <option value={BodyType.CONVERTIBLE}>Cabrio</option>
                  <option value={BodyType.VAN}>Furgone</option>
                  <option value={BodyType.MINIVAN}>Monovolume</option>
                </FormSelect>
              </FormGroup>

              <FormGroup>
                <FormLabel>Colore</FormLabel>
                <FormInput
                  type="text"
                  value={formData.color}
                  onChange={(e) => handleInputChange('color', e.target.value)}
                />
              </FormGroup>

              <FormGroup>
                <FormLabel>Porte</FormLabel>
                <FormInput
                  type="number"
                  value={formData.doors}
                  onChange={(e) => handleInputChange('doors', parseInt(e.target.value))}
                  min="2"
                  max="6"
                />
              </FormGroup>

              <FormGroup>
                <FormLabel>Posti</FormLabel>
                <FormInput
                  type="number"
                  value={formData.seats}
                  onChange={(e) => handleInputChange('seats', parseInt(e.target.value))}
                  min="2"
                  max="9"
                />
              </FormGroup>

              <FormGroup>
                <FormLabel>Cilindrata (cc)</FormLabel>
                <FormInput
                  type="number"
                  value={formData.engineSize}
                  onChange={(e) => handleInputChange('engineSize', parseInt(e.target.value))}
                  min="0"
                />
              </FormGroup>

              <FormGroup>
                <FormLabel>Potenza (kW)</FormLabel>
                <FormInput
                  type="number"
                  value={formData.power}
                  onChange={(e) => handleInputChange('power', parseInt(e.target.value))}
                  min="0"
                />
              </FormGroup>

              <FormGroup>
                <FormLabel>Cavalli (CV)</FormLabel>
                <FormInput
                  type="number"
                  value={formData.horsepower}
                  onChange={(e) => handleInputChange('horsepower', parseInt(e.target.value))}
                  min="0"
                />
              </FormGroup>

              <FormGroup>
                <FormLabel>Proprietari precedenti</FormLabel>
                <FormInput
                  type="number"
                  value={formData.previousOwners}
                  onChange={(e) => handleInputChange('previousOwners', parseInt(e.target.value))}
                  min="0"
                  max="10"
                />
              </FormGroup>

              <FormGroup className="full-width">
                <FormLabel>Sede</FormLabel>
                <FormSelect
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                >
                  <option value="Via Bottaia, 2">Via Bottaia, 2</option>
                  <option value="Via Luigi Galvani, 2">Via Luigi Galvani, 2</option>
                  <option value="Via Fiorentina, 331">Via Fiorentina, 331</option>
                </FormSelect>
              </FormGroup>

              <FormGroup className="full-width">
                <CheckboxContainer>
                  <Checkbox
                    type="checkbox"
                    checked={formData.isLuxury}
                    onChange={(e) => handleInputChange('isLuxury', e.target.checked)}
                  />
                  <FormLabel style={{ margin: 0 }}>Veicolo Luxury</FormLabel>
                </CheckboxContainer>
              </FormGroup>

              <FormGroup className="full-width">
                <FormLabel>Descrizione</FormLabel>
                <FormTextArea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Descrizione dettagliata del veicolo..."
                />
              </FormGroup>

              <FormGroup className="full-width">
                <FormLabel>Accessori (separati da virgola)</FormLabel>
                <FormTextArea
                  value={formData.features}
                  onChange={(e) => handleInputChange('features', e.target.value)}
                  placeholder="Es: Climatizzatore, Cerchi in lega, Navigatore satellitare"
                />
              </FormGroup>
            </FormGrid>

            <ImagesSection>
              <ImagesSectionTitle>
                Immagini ({imageFiles.length})
                {isSubmitting && uploadProgress > 0 && (
                  <span style={{ marginLeft: '10px', color: '#cb1618' }}>
                    - Upload in corso... {uploadProgress}%
                  </span>
                )}
              </ImagesSectionTitle>

              <ImageUploadArea
                $isDragOver={isDragOver}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <UploadIcon>
                  <LuImagePlus />
                </UploadIcon>
                <UploadText>
                  Trascina le immagini qui o clicca per selezionare
                </UploadText>
                <UploadSubtext>
                  Formati supportati: JPG, PNG, WebP (max 10MB per immagine)
                  <br />
                  Le immagini verranno automaticamente convertite in WebP e ottimizzate
                </UploadSubtext>
              </ImageUploadArea>

              <HiddenFileInput
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
              />

              {imageFiles.length > 0 && (
                <ImagePreviewGrid>
                  {imageFiles.map((imageFile, index) => (
                    <ImagePreview key={imageFile.id}>
                      <PreviewImage src={imageFile.preview} alt={`Preview ${index + 1}`} />
                      {index === 0 && (
                        <PrimaryImageBadge>Principale</PrimaryImageBadge>
                      )}
                      <RemoveImageButton
                        type="button"
                        onClick={() => removeImageFile(imageFile.id)}
                      >
                        <FaTimes />
                      </RemoveImageButton>
                    </ImagePreview>
                  ))}
                </ImagePreviewGrid>
              )}
            </ImagesSection>

            <FormActions>
              <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                Annulla
              </Button>
              <Button 
                type="submit" 
                variant="primary" 
                disabled={isSubmitting}
                loading={isSubmitting}
              >
                <FaSave /> {vehicle ? 'Aggiorna' : 'Salva'} Veicolo
              </Button>
            </FormActions>
          </FormContent>
        </FormContainer>
      </FormOverlay>
    </>
  );
};

export default VehicleForm;