import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaArrowRight} from 'react-icons/fa';
import { LuImagePlus } from "react-icons/lu";

import Container from '../components/layout/Container';
import ActionButton from '../components/common/ActionButton';
import Header from '../components/layout/Header';
import LocationsSection from '@/components/sections/ServicesMapsSection';
import { useFeaturedCars } from '../hooks/useCars';

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
`;

const LegalText = styled.p`
  color: #656565;
  font-size: 1rem;
  line-height: 1.3;
  text-align: left;
  margin: 30px 50px;
`;

const SectionMaps = styled.div`
  width: 100ww;
  margin-bottom: 120px;
`

const AcquistiPage: React.FC = () => {
  const { data: featuredResult } = useFeaturedCars(1);
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
    document.title = 'Acquisizione Auto - RD Group Pistoia | Vendiamo la tua Auto';
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Vendi la tua auto a RD Group. Pagamento immediato e passaggio di proprietà a carico nostro. Compila il modulo per una valutazione gratuita.');
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
    // Logic to handle form submission
  };

  // Usa auto reale dal database se disponibile, altrimenti fallback
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
                        placeholder='Ex: Mercedes, BWM, etc...'
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
                        placeholder="MM/AAAA"
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
                        placeholder="Ex. 100 000km"
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

                  </GallerySection>
                  <div></div>
                  <ButtonContainer>
                    <ActionButton type="submit">
                      Richiedi informazioni<FaArrowRight />
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
        <LocationsSection></LocationsSection>
      </SectionMaps>
    </AcquistiPageContainer>
  );
};

export default AcquistiPage;