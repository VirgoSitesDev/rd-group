import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { FaArrowRight, FaTrash, FaTimes} from 'react-icons/fa';
import { LuImagePlus } from "react-icons/lu";

import Container from '../components/layout/Container';
import ActionButton from '../components/common/ActionButton';
import Header from '../components/layout/Header';
import LocationsSection from '@/components/sections/ServicesMapsSection';
import { useFeaturedCars } from '../hooks/useCars';
import { uploadVehicleImages } from '../services/uploadService';

const AcquistiPageContainer = styled.div`
  background: ${({ theme }) => theme.colors.background.default};
  min-height: 100vh;
`;

const ContactContent = styled.section`
  padding: ${({ theme }) => theme.spacing.xxl} 0;
  background: ${({ theme }) => theme.colors.background.default};
  margin-top: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    padding: ${({ theme }) => theme.spacing.md} 0;
  }
`;

const ContactGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.xxl};
  align-items: start;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing.md};
  }
`;

const MainTitle = styled.h2`
  color: ${({ theme }) => theme.colors.primary.main};
  font-size: 1.6rem;
  font-weight: ${({ theme }) => theme.typography.fontWeight.regular};
  margin: 50px 30px;
  text-align: left;
  grid-column: 1 / -1;
  width: 45%;
  line-height: 1.4;
  
  .bold {
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    margin: 20px 10px;
    width: 80%;
  }

  .bold {
    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
      width: 80%;
    }
  }
`;

const FormSection = styled.div`
  background: white;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  margin: 0 50px;
  padding: ${({ theme }) => theme.spacing.xl};
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  border: 1px solid #d3d3d3;
  grid-column: 1 / -1;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    margin: 0px;
    padding: ${({ theme }) => theme.spacing.md};
  }
`;

const FormInnerGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.xl};
  align-items: start;

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing.xl};
  }
`;

const FormFieldsColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const FormLabel = styled.label`
  font-size: 0.9rem;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: black; 
  text-transform: uppercase;
  letter-spacing: 0.4px;
`;

const FormInput = styled.input`
  padding: ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  height: 28px;
  background: #F9F9F9;
  font-size: 1rem;
  font-weight: ${({ theme }) => theme.typography.fontWeight.light};
  color: ${({ theme }) => theme.colors.text.primary};
  transition: border-color 0.2s ease, background-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary.main};
    background: white;
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.text.primary};
    font-weight: ${({ theme }) => theme.typography.fontWeight.regular};
  }
`;

const FormTextArea = styled.textarea`
  padding: ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: #F9F9F9;
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text.primary};
  min-height: 120px;
  resize: vertical;
  font-family: inherit;
  transition: border-color 0.2s ease, background-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary.main};
    background: white;
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

const GallerySection = styled.div`
  width: 100%;
`;

const GalleryTitle = styled.h3`
  font-size: 0.8rem;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: #000000;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  margin-bottom: 2px;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 1.1rem !important;
  }
`;

const GallerySubtitle = styled.p`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 1.2rem;
  margin-bottom: ${({ theme }) => theme.spacing.lg};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 0.9rem !important;
  }
`;

const GalleryGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const ImageUpload = styled.div<{ $isDragOver?: boolean; $hasImage?: boolean }>`
  aspect-ratio: 1.2;
  border: 3px dashed ${({ $isDragOver, theme }) => 
    $isDragOver ? theme.colors.primary.main : '#949494'};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${({ $isDragOver, $hasImage }) => 
    $isDragOver ? 'rgba(203, 22, 24, 0.1)' : $hasImage ? 'transparent' : '#fafafa'};
  position: relative;
  overflow: hidden;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary.main};
    background: ${({ $hasImage }) => $hasImage ? 'transparent' : 'rgba(203, 22, 24, 0.05)'};
  }

  input {
    display: none;
  }

  svg {
    font-size: 1.5rem;
    color: #949494;
    margin-bottom: ${({ theme }) => theme.spacing.xs};
  }

  span {
    font-size: 0.8rem;
    color: ${({ theme }) => theme.colors.text.primary};
    text-align: center;
  }

  &:first-child {
    grid-column: 1 / -1;
    aspect-ratio: 2.6;
  }
`;

const ImagePreview = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PreviewImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
`;

const RemoveImageButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  z-index: 10;

  &:hover {
    background: ${({ theme }) => theme.colors.error};
    transform: scale(1.1);
  }
`;

const MainImageBadge = styled.div`
  position: absolute;
  bottom: 8px;
  left: 8px;
  background: ${({ theme }) => theme.colors.primary.main};
  color: white;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: bold;
  z-index: 10;
`;

const UploadProgress = styled.div<{ $progress: number }>`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: rgba(0, 0, 0, 0.1);
  
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

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const LegalText = styled.p`
  color: #656565;
  font-size: 1rem;
  line-height: 1.3;
  text-align: left;
  margin: 30px 50px;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    margin: 20px 05px;
    font-size: 0.8rem !important;
  }
`;

const SectionMaps = styled.div`
  width: 100ww;
  margin-bottom: 120px;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    margin-top: 30px;
  }
`;

interface ImageFile {
  file: File;
  preview: string;
  id: string;
  isUploading?: boolean;
  uploadProgress?: number;
  error?: string;
  url?: string;
}

const AcquistiPage: React.FC = () => {

  const { data: featuredResult } = useFeaturedCars(1);
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  
  const [formData, setFormData] = useState({
    nome: '',
    cognome: '',
    mail: '',
    telefono: '',
    marca: '',
    anno: '',
    km: '',
    note: ''
  });

  const [images, setImages] = useState<ImageFile[]>([]);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const MAX_IMAGES = 4;
  const MAX_FILE_SIZE = 10 * 1024 * 1024;
  const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

  useEffect(() => {
    document.title = 'Acquisizione Auto - RD Group Pistoia | Vendiamo la tua Auto';
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Vendi la tua auto a RD Group. Pagamento immediato e passaggio di proprietà a carico nostro. Compila il modulo per una valutazione gratuita.');
    }

    return () => {
      images.forEach(image => {
        URL.revokeObjectURL(image.preview);
      });
    };
  }, []);

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return `Formato non supportato. Usa: ${ALLOWED_TYPES.join(', ')}`;
    }
    
    if (file.size > MAX_FILE_SIZE) {
      return `File troppo grande. Max: ${MAX_FILE_SIZE / 1024 / 1024}MB`;
    }
    
    return null;
  };

  const addImages = (files: File[]) => {
    const availableSlots = MAX_IMAGES - images.length;
    const filesToAdd = files.slice(0, availableSlots);
    
    const newImages: ImageFile[] = [];
    
    filesToAdd.forEach(file => {
      const error = validateFile(file);
      if (!error) {
        const imageFile: ImageFile = {
          file,
          preview: URL.createObjectURL(file),
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          isUploading: false,
          uploadProgress: 0,
          error: undefined
        };
        newImages.push(imageFile);
      }
    });
    
    setImages(prev => [...prev, ...newImages]);
  };

  const removeImage = (id: string) => {
    setImages(prev => {
      const imageToRemove = prev.find(img => img.id === id);
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.preview);
      }
      return prev.filter(img => img.id !== id);
    });
  };

  const handleFileSelect = (slotIndex: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      if (slotIndex === 0) {
        addImages(files);
      } else {
        if (images.length < MAX_IMAGES) {
          addImages([files[0]]);
        }
      }
    }
    if (e.target) {
      e.target.value = '';
    }
  };

  const handleDragOver = (index: number) => (e: React.DragEvent) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOverIndex(null);
  };

  const handleDrop = (index: number) => (e: React.DragEvent) => {
    e.preventDefault();
    setDragOverIndex(null);
    
    const files = Array.from(e.dataTransfer.files).filter(file => 
      file.type.startsWith('image/')
    );
    
    if (files.length > 0) {
      addImages(files);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    if (images.length < 2) {
      e.preventDefault();
      alert('⚠️ Aggiungi almeno 2 immagini per procedere');
      return;
    }
  
    e.preventDefault();
    setIsSubmitting(true);
  
    try {
      let imageUrls: string[] = [];
  
      if (images.length > 0) {
        console.log('📤 Caricamento immagini su cloud...');
        
        setImages(prev => prev.map(img => ({ 
          ...img, 
          isUploading: true, 
          uploadProgress: 0 
        })));
  
        try {
          const imageFiles = images.map(img => img.file);
          
          const uploadedUrls = await uploadVehicleImages(imageFiles, (completed, total) => {
            const progress = Math.round((completed / total) * 100);
            setImages(prev => prev.map(img => ({ 
              ...img, 
              uploadProgress: progress 
            })));
          });
  
          imageUrls = uploadedUrls;
          console.log('✅ Immagini caricate:', imageUrls);
  
          setImages(prev => prev.map((img, index) => ({ 
            ...img, 
            isUploading: false, 
            uploadProgress: 100,
            url: uploadedUrls[index]
          })));
  
        } catch (uploadError) {
          console.error('❌ Errore caricamento immagini:', uploadError);
          alert('❌ Errore nel caricamento delle immagini. Riprova più tardi.');
          setIsSubmitting(false);
          return;
        }
      }
  
      const submitFormData = new FormData();
      
      submitFormData.append('form-name', 'acquisizione');
      submitFormData.append('nome', formData.nome);
      submitFormData.append('cognome', formData.cognome);
      submitFormData.append('mail', formData.mail);
      submitFormData.append('telefono', formData.telefono);
      submitFormData.append('marca', formData.marca);
      submitFormData.append('anno', formData.anno);
      submitFormData.append('km', formData.km);
      submitFormData.append('note', formData.note);
      
      submitFormData.append('numero-immagini', images.length.toString());

      images.forEach((imageFile, index) => {
        submitFormData.append(`immagine-file-${index + 1}`, imageFile.file);
        submitFormData.append(`immagine-info-${index + 1}`, 
          `Nome: ${imageFile.file.name}, Dimensione: ${(imageFile.file.size / 1024 / 1024).toFixed(2)}MB${index === 0 ? ' (PRINCIPALE)' : ''}`
        );
      });

      const urlsFormatted = imageUrls.length > 0 
        ? imageUrls.map((url, index) => `
📷 IMMAGINE ${index + 1}${index === 0 ? ' (PRINCIPALE)' : ''}
Link diretto: ${url}
Link per visualizzare: ${url}
-------------------`).join('\n')
        : 'Nessuna immagine caricata';

      const filesSummary = images.map((img, index) => 
        `${index + 1}. ${img.file.name} (${(img.file.size / 1024 / 1024).toFixed(2)}MB)${index === 0 ? ' - PRINCIPALE' : ''}`
      ).join('\n');

      const completeReport = `
IMMAGINI DELL'AUTO (${images.length} foto):

=== LINK PERMANENTI ===
${urlsFormatted}

TUTTI I LINK IN UNA RIGA:
${imageUrls.join(' | ')}

=== FILE ALLEGATI ===
${filesSummary}

Nota: I file immagine sono anche allegati a questa email.
      `.trim();

      submitFormData.append('immagini-complete', completeReport);

      imageUrls.forEach((url, index) => {
        submitFormData.append(`immagine-url-${index + 1}`, url);
      });

      console.log('📤 Invio form completo a Netlify...');

      const response = await fetch('/', {
        method: 'POST',
        body: submitFormData
      });
  
      if (response.ok) {
        alert('✅ Richiesta inviata con successo! Ti contatteremo presto per la valutazione.');
        
        setFormData({
          nome: '',
          cognome: '',
          mail: '',
          telefono: '',
          marca: '',
          anno: '',
          km: '',
          note: ''
        });
        
        images.forEach(image => URL.revokeObjectURL(image.preview));
        setImages([]);
      } else {
        const errorText = await response.text();
        throw new Error(`Errore HTTP: ${response.status} - ${response.statusText}`);
      }
      
    } catch (error) {
      console.error('Errore invio form:', error);
      alert('❌ Errore nell\'invio. Riprova più tardi o contattaci direttamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getImageSlots = () => {
    const slots = [];
    
    slots.push(
      <ImageUpload
        key="main"
        $isDragOver={dragOverIndex === 0}
        $hasImage={images.length > 0}
        onClick={() => {
          if (images.length < MAX_IMAGES) {
            fileInputRefs.current[0]?.click();
          }
        }}
        onDragOver={handleDragOver(0)}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop(0)}
      >
        <input
          ref={el => { fileInputRefs.current[0] = el; }}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect(0)}
        />
        
        {images.length > 0 && images[0] ? (
          <ImagePreview>
            <PreviewImage src={images[0].preview} alt="Anteprima" />
            <MainImageBadge>Principale</MainImageBadge>
            <RemoveImageButton
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeImage(images[0].id);
              }}
            >
              <FaTimes />
            </RemoveImageButton>
            {images[0].isUploading && (
              <UploadProgress $progress={images[0].uploadProgress || 0} />
            )}
          </ImagePreview>
        ) : (
          <>
            <LuImagePlus />
            <span>Aggiungi foto principale</span>
          </>
        )}
      </ImageUpload>
    );

    for (let i = 1; i < 4; i++) {
      const slotIndex = i;
      const imageIndex = i;
      const hasImage = images[imageIndex];
      const canAddMore = images.length < MAX_IMAGES;
      
      slots.push(
        <ImageUpload
          key={slotIndex}
          $isDragOver={dragOverIndex === slotIndex}
          $hasImage={!!hasImage}
          onClick={() => {
            if (!hasImage && canAddMore) {
              fileInputRefs.current[slotIndex]?.click();
            }
          }}
          onDragOver={handleDragOver(slotIndex)}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop(slotIndex)}
        >
          <input
            ref={el => { fileInputRefs.current[slotIndex] = el; }}
            type="file"
            accept="image/*"
            onChange={handleFileSelect(slotIndex)}
          />
          
          {hasImage ? (
            <ImagePreview>
              <PreviewImage src={hasImage.preview} alt="Anteprima" />
              <RemoveImageButton
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeImage(hasImage.id);
                }}
              >
                <FaTimes />
              </RemoveImageButton>
              {hasImage.isUploading && (
                <UploadProgress $progress={hasImage.uploadProgress || 0} />
              )}
            </ImagePreview>
          ) : (
            <>
              <LuImagePlus />
              <span>{canAddMore ? 'Aggiungi foto' : `${images.length}/${MAX_IMAGES}`}</span>
            </>
          )}
        </ImageUpload>
      );
    }

    return slots;
  };

  const heroFeaturedCar = featuredResult?.cars?.[0];
  const featuredCarForContacts = heroFeaturedCar ? {
    make: heroFeaturedCar.make.toUpperCase(),
    model: heroFeaturedCar.model.toUpperCase(),
    price: heroFeaturedCar.price,
    year: heroFeaturedCar.year,
    mileage: heroFeaturedCar.mileage,
    fuelType: heroFeaturedCar.fuelType === 'diesel' ? 'Diesel' : 
              heroFeaturedCar.fuelType === 'petrol' ? 'Benzina' : 
              heroFeaturedCar.fuelType === 'electric' ? 'Elettrico' : 
              heroFeaturedCar.fuelType === 'hybrid' ? 'Ibrido' : 'Benzina',
    transmission: heroFeaturedCar.transmission === 'automatic' ? 'Automatico' : 
                  heroFeaturedCar.transmission === 'manual' ? 'Manuale' : 
                  heroFeaturedCar.transmission === 'semi_automatic' ? 'Semiautomatico' : 'Automatico',
    power: `${heroFeaturedCar.power}KW`,
  } : {
    make: "MERCEDES",
    model: "G63 AMG",
    price: 69800,
    year: 2013,
    mileage: 181000,
    fuelType: "Benzina",
    transmission: "Semiautomatico",
    power: "400KW"
  };

  return (
    <AcquistiPageContainer>
      <form 
        name="acquisizione" 
        data-netlify="true"
        hidden
        style={{ display: 'none' }}
      >
        <input type="text" name="nome" />
        <input type="text" name="cognome" />
        <input type="email" name="mail" />
        <input type="tel" name="telefono" />
        <input type="text" name="marca" />
        <input type="text" name="anno" />
        <input type="text" name="km" />
        <textarea name="note"></textarea>
        
        <input type="text" name="numero-immagini" />
        <textarea name="immagini-complete"></textarea>
        
        <input type="file" name="immagine-file-1" />
        <input type="file" name="immagine-file-2" />
        <input type="file" name="immagine-file-3" />
        <input type="file" name="immagine-file-4" />
        
        <input type="text" name="immagine-info-1" />
        <input type="text" name="immagine-info-2" />
        <input type="text" name="immagine-info-3" />
        <input type="text" name="immagine-info-4" />
        
        <input type="text" name="immagine-url-1" />
        <input type="text" name="immagine-url-2" />
        <input type="text" name="immagine-url-3" />
        <input type="text" name="immagine-url-4" />
      </form>
  
      <Header 
        showHero={true} 
        featuredCar={featuredCarForContacts}
        backgroundImage="/Car_Luxury.jpg"
      />

      <ContactContent id="contact-form">
        <Container>
          <ContactGrid>
            <MainTitle>
              Compriamo subito la tua auto con <span className="bold">pagamento immediato e passaggio di proprietà a carico nostro!</span>
            </MainTitle>

            <FormSection>
              <form 
                onSubmit={handleSubmit}
                data-netlify="true"
                name="acquisizione"
                method="POST"
              >
                <input type="hidden" name="form-name" value="acquisizione" />
                <div style={{ display: 'none' }}>
                  <input name="bot-field" />
                </div>
                
                <FormInnerGrid>
                  <FormFieldsColumn>
                    <FormGroup>
                      <FormLabel htmlFor="nome">Nome</FormLabel>
                      <FormInput
                        type="text"
                        id="nome"
                        name="nome"
                        value={formData.nome}
                        onChange={(e) => handleInputChange('nome', e.target.value)}
                        placeholder='Nome'
                        required
                      />
                    </FormGroup>

                    <FormGroup>
                      <FormLabel htmlFor="cognome">Cognome</FormLabel>
                      <FormInput
                        type="text"
                        id="cognome"
                        name="cognome"
                        value={formData.cognome}
                        onChange={(e) => handleInputChange('cognome', e.target.value)}
                        placeholder='Cognome'
                        required
                      />
                    </FormGroup>

                    <FormGroup>
                      <FormLabel htmlFor="mail">Mail</FormLabel>
                      <FormInput
                        type="email"
                        id="mail"
                        name="mail"
                        value={formData.mail}
                        onChange={(e) => handleInputChange('mail', e.target.value)}
                        placeholder='example@gmail.com'
                        required
                      />
                    </FormGroup>

                    <FormGroup>
                      <FormLabel htmlFor="telefono">Telefono</FormLabel>
                      <FormInput
                        type="tel"
                        id="telefono"
                        name="telefono"
                        value={formData.telefono}
                        onChange={(e) => handleInputChange('telefono', e.target.value)}
                        placeholder='+39 000 000 0000'
                        required
                      />
                    </FormGroup>

                    <FormGroup>
                      <FormLabel htmlFor="marca">Marca</FormLabel>
                      <FormInput
                        id="marca"
                        name="marca"
                        value={formData.marca}
                        onChange={(e) => handleInputChange('marca', e.target.value)}
                        placeholder='Ex: Mercedes, BMW, etc...'
                      />
                    </FormGroup>

                    <FormGroup>
                      <FormLabel htmlFor="anno">Anno</FormLabel>
                      <FormInput
                        type="number"
                        id="anno"
                        name="anno"
                        value={formData.anno}
                        onChange={(e) => handleInputChange('anno', e.target.value)}
                        placeholder="2020"
                      />
                    </FormGroup>

                    <FormGroup>
                      <FormLabel htmlFor="km">KM</FormLabel>
                      <FormInput
                        type="number"
                        id="km"
                        name="km"
                        value={formData.km}
                        onChange={(e) => handleInputChange('km', e.target.value)}
                        placeholder="Es. 100000"
                      />
                    </FormGroup>

                    <FormGroup>
                      <FormLabel htmlFor="note">Altre note</FormLabel>
                      <FormTextArea
                        id="note"
                        name="note"
                        value={formData.note}
                        onChange={(e) => handleInputChange('note', e.target.value)}
                        placeholder="Inserisci qui eventuali note"
                      />
                    </FormGroup>
                  </FormFieldsColumn>

                  <GallerySection>
                    <GalleryTitle>Galleria</GalleryTitle>
                    <GallerySubtitle>
                      Almeno 2 immagini ({images.length}/{MAX_IMAGES})
                    </GallerySubtitle>
                    <GalleryGrid>
                      {getImageSlots()}
                    </GalleryGrid>
                    
                    {images.length >= 2 && (
                      <div style={{ 
                        color: '#4caf50', 
                        fontSize: '0.9rem', 
                        textAlign: 'center',
                        marginTop: '8px'
                      }}>
                        ✅ Numero minimo di immagini raggiunto
                      </div>
                    )}
                  </GallerySection>
                  
                  <div></div>
                  
                  <ButtonContainer>
                    <ActionButton 
                      type="submit" 
                      disabled={isSubmitting || images.length < 2}
                    >
                      {isSubmitting ? 'Invio in corso...' : 'Richiedi informazioni'}
                      <FaArrowRight />
                    </ActionButton>
                  </ButtonContainer>
                </FormInnerGrid>
              </form>
            </FormSection>
          </ContactGrid>

          <LegalText>
            L'offerta economica relativa al veicolo sarà formulata e trasmessa dal nostro team esclusivamente a seguito della ricezione della richiesta da parte dell'interessato e del completamento di una valutazione tecnica accurata. L'interessato avrà facoltà di accettare o rifiutare l'offerta senza alcun obbligo, fermo restando che l'invio della richiesta non comporta alcun impegno contrattuale da entrambe le parti.
          </LegalText>
        </Container>
      </ContactContent>
      
      <SectionMaps>
        <LocationsSection />
      </SectionMaps>
    </AcquistiPageContainer>
  );
};

export default AcquistiPage;