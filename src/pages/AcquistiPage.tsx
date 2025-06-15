import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaArrowRight} from 'react-icons/fa';
import { LuImagePlus } from "react-icons/lu";

import Container from '../components/layout/Container';
import ActionButton from '../components/common/ActionButton';
import Header from '../components/layout/Header';
import LocationsSection from '@/components/sections/ServicesMapsSection';

const AcquistiPageContainer = styled.div`
  background: ${({ theme }) => theme.colors.background.default};
  min-height: 100vh;
`;

const ContactContent = styled.section`
  padding: ${({ theme }) => theme.spacing.xxl} 0;
  background: ${({ theme }) => theme.colors.background.default};
  margin-top: 0;
`;

const ContactGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.xxl};
  align-items: start;

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing.xl};
  }
`;

const MainTitle = styled.h2`
  color: ${({ theme }) => theme.colors.primary.main};
  font-size: 1.8rem;
  font-weight: ${({ theme }) => theme.typography.fontWeight.regular};
  margin: 50px 30px;
  text-align: left;
  grid-column: 1 / -1;
  width: 45%;
  line-height: 1.4;
  
  .bold {
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
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
  font-size: 0.8rem;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: #000000; 
  text-transform: uppercase;
  letter-spacing: 0.4px;
`;

const FormInput = styled.input`
  padding: ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: #F9F9F9;
  font-size: 1.2rem;
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
`;

const GallerySubtitle = styled.p`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 1.2rem;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const GalleryGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const ImageUpload = styled.div`
  aspect-ratio: 1.2;
  border: 3px dashed #949494;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: border-color 0.2s ease;
  background: #fafafa;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary.main};
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

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

const LegalText = styled.p`
  color: #656565;
  font-size: 1.2rem;
  line-height: 1.5;
  text-align: left;
  margin: 30px 50px;
`;

const SectionMaps = styled.div`
  width: 100ww;
  margin-bottom: 120px;
`

const AcquistiPage: React.FC = () => {
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

  useEffect(() => {
    document.title = 'Contatti - RD Group Pistoia | Come Raggiungerci';
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Contatta RD Group per qualsiasi informazione. Visita le nostre sedi a Pistoia o chiama il +39 057 318 7467. Siamo qui per aiutarti a trovare la tua auto ideale.');
    }
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Richiesta inviata! Vi contatteremo presto.');
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
  };

  // Auto di esempio per la hero - puoi personalizzarla
  const featuredCarForContacts = {
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
      {/* Hero Section - Identica alla Homepage utilizzando il componente Header */}
      <Header 
        showHero={true} 
        featuredCar={featuredCarForContacts}
        backgroundImage="/Car_Luxury.jpg"
      />

      {/* Contact Content */}
      <ContactContent id="contact-form">
        <Container>
          <ContactGrid>
            {/* Titolo principale */}
            <MainTitle>
              Compriamo subito la tua auto con <span className="bold">pagamento immediato e passaggio di proprietà a carico nostro!</span>
            </MainTitle>
            
            {/* Form Section - Container bianco */}
            <FormSection>
              <form onSubmit={handleSubmit}>
                <FormInnerGrid>
                  {/* Colonna sinistra - Campi del form */}
                  <FormFieldsColumn>
                    <FormGroup>
                      <FormLabel htmlFor="nome">Nome</FormLabel>
                      <FormInput
                        type="text"
                        id="nome"
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
                        value={formData.marca}
                        onChange={(e) => handleInputChange('marca', e.target.value)}
                        placeholder='Ex: Mercedes, BWM, etc...'
                      />
                    </FormGroup>

                    <FormGroup>
                      <FormLabel htmlFor="anno">Anno</FormLabel>
                      <FormInput
                        type="number"
                        id="anno"
                        value={formData.anno}
                        onChange={(e) => handleInputChange('anno', e.target.value)}
                        placeholder="MM/AAAA"
                      />
                    </FormGroup>

                    <FormGroup>
                      <FormLabel htmlFor="km">KM</FormLabel>
                      <FormInput
                        type="number"
                        id="km"
                        value={formData.km}
                        onChange={(e) => handleInputChange('km', e.target.value)}
                        placeholder="Ex. 100 000km"
                      />
                    </FormGroup>

                    <FormGroup>
                      <FormLabel htmlFor="note">Altre note</FormLabel>
                      <FormTextArea
                        id="note"
                        value={formData.note}
                        onChange={(e) => handleInputChange('note', e.target.value)}
                        placeholder="Inserisci qui eventuali note"
                      />
                    </FormGroup>
                  </FormFieldsColumn>

                  <GallerySection>
                    <GalleryTitle>Galleria</GalleryTitle>
                    <GallerySubtitle>Almeno 2 immagini</GallerySubtitle>
                    <GalleryGrid>
                      <ImageUpload>
                        <input type="file" accept="image/*" />
                        <LuImagePlus />
                        <span>Aggiungi foto</span>
                      </ImageUpload>

                      {[2, 3, 4].map((index) => (
                        <ImageUpload key={index}>
                          <input type="file" accept="image/*" />
                          <LuImagePlus />
                          <span>Aggiungi foto</span>
                        </ImageUpload>
                      ))}
                    </GalleryGrid>
                    
                    {/* Pulsante ora è in un container separato e allineato a destra */}
                    <ButtonContainer>
                      <ActionButton type="submit">
                        Richiedi informazioni<FaArrowRight />
                      </ActionButton>
                    </ButtonContainer>
                  </GallerySection>
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
        <LocationsSection></LocationsSection>
      </SectionMaps>
    </AcquistiPageContainer>
  );
};

export default AcquistiPage;