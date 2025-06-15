// src/pages/CarDetailPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaArrowLeft, FaPhone, FaEnvelope, FaMapMarkerAlt, FaHeart, FaShare, FaCalendar, FaCar, FaGasPump, FaCog, FaTachometerAlt, FaPalette } from 'react-icons/fa';

import Container from '../components/layout/Container';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';
import { useCar } from '../hooks/useCars';

// Mock data per sviluppo - sostituiremo con dati veri
const mockCarData = {
  id: 'featured-abarth',
  make: 'ABARTH',
  model: '595 Turismo 1.4 T-Jet',
  price: 15400,
  year: 2015,
  mileage: 68000,
  fuelType: 'petrol',
  transmission: 'manual',
  power: 118,
  images: [
    { id: '1', url: '/src/assets/images/Car_1.jpg', altText: 'ABARTH 595 Turismo', isPrimary: true, order: 0 },
    { id: '2', url: '/src/assets/images/Car_2.jpg', altText: 'ABARTH 595 Turismo', isPrimary: false, order: 1 },
    { id: '3', url: '/src/assets/images/car.jpg', altText: 'ABARTH 595 Turismo', isPrimary: false, order: 2 }
  ],
  description: 'Bellissima Abarth 595 Turismo in perfette condizioni. Auto tenuta maniacalmente, sempre tagliandata in concessionaria. Perfetta per chi cerca prestazioni e divertimento di guida.',
  features: ['Climatizzatore', 'ABS', 'Airbag', 'Radio CD', 'Cerchi in lega', 'Fendinebbia'],
  doors: 3,
  seats: 4,
  color: 'Nero',
  bodyType: 'coupe',
  engineSize: 1400,
  horsepower: 160,
  condition: 'used',
  availability: 'available',
  previousOwners: 1,
  currency: 'EUR',
  location: {
    address: 'Via Bottaia, 2',
    city: 'Pistoia',
    region: 'Toscana',
    postalCode: '51100',
    country: 'Italia'
  },
  dealer: {
    id: '1',
    name: 'RD Group',
    phone: '+39 057 318 7467',
    email: 'rdautosrlpistoia@gmail.com',
    location: {
      address: 'Via Bottaia, 2',
      city: 'Pistoia',
      region: 'Toscana',
      postalCode: '51100',
      country: 'Italia'
    }
  },
  isLuxury: false,
  createdAt: new Date(),
  updatedAt: new Date()
};

const PageContainer = styled.div`
  background: ${({ theme }) => theme.colors.background.default};
  min-height: 100vh;
  padding-top: ${({ theme }) => theme.spacing.xl};
`;

const BackButton = styled(Button)`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  background: transparent;
  color: ${({ theme }) => theme.colors.text.primary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  
  &:hover {
    background: ${({ theme }) => theme.colors.background.paper};
    transform: none;
  }
`;

const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: ${({ theme }) => theme.spacing.xxl};
  margin-bottom: ${({ theme }) => theme.spacing.xxl};

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing.xl};
  }
`;

const ImageSection = styled.div``;

const MainImage = styled.div`
  width: 100%;
  height: 500px;
  background: #f5f5f5;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  overflow: hidden;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  position: relative;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    height: 300px;
  }
`;

const ImageGallery = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: ${({ theme }) => theme.spacing.sm};
`;

const ThumbnailImage = styled.div<{ $isActive: boolean }>`
  height: 100px;
  background: #f5f5f5;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  overflow: hidden;
  cursor: pointer;
  border: 3px solid ${({ $isActive, theme }) => $isActive ? theme.colors.primary.main : 'transparent'};
  transition: border-color 0.2s ease;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary.main};
  }
`;

const InfoSection = styled.div`
  background: white;
  padding: ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  height: fit-content;
  position: sticky;
  top: ${({ theme }) => theme.spacing.xl};
`;

const CarHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  padding-bottom: ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const CarTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 ${({ theme }) => theme.spacing.sm} 0;
`;

const CarPrice = styled.div`
  font-size: 2rem;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.primary.main};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.lg};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
  }
`;

const PrimaryButton = styled(Button)`
  flex: 1;
`;

const SecondaryButton = styled(Button)`
  background: transparent;
  color: ${({ theme }) => theme.colors.primary.main};
  border: 2px solid ${({ theme }) => theme.colors.primary.main};
  
  &:hover {
    background: ${({ theme }) => theme.colors.primary.main};
    color: white;
  }
`;

const SpecsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const SpecItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.text.primary};

  svg {
    color: ${({ theme }) => theme.colors.primary.main};
    font-size: 1.1rem;
  }
`;

const DealerInfo = styled.div`
  background: #f9f9f9;
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const DealerName = styled.h3`
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 ${({ theme }) => theme.spacing.sm} 0;
`;

const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const ContactItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 0.9rem;

  svg {
    color: ${({ theme }) => theme.colors.primary.main};
    font-size: 0.9rem;
  }
`;

const DescriptionSection = styled.div`
  background: white;
  padding: ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const SectionTitle = styled.h2`
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  font-size: 1.5rem;
`;

const Description = styled.p`
  color: ${({ theme }) => theme.colors.text.primary};
  line-height: 1.6;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const FeaturesList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing.sm};
`;

const FeatureItem = styled.div`
  background: #f9f9f9;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 0.9rem;
`;

const CarDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  // Per ora usiamo dati mock, in futuro useremo: const { data: car, isLoading, error } = useCar(id!);
  const car = mockCarData;
  const isLoading = false;
  const error = null;

  useEffect(() => {
    if (car) {
      document.title = `${car.make} ${car.model} - ${car.price.toLocaleString('it-IT')}€ | RD Group`;
    }
  }, [car]);

  const handleContactDealer = () => {
    window.location.href = `tel:${car?.dealer.phone}`;
  };

  const handleEmailDealer = () => {
    const subject = `Interesse per ${car?.make} ${car?.model}`;
    const body = `Salve, sono interessato/a alla ${car?.make} ${car?.model} del ${car?.year} al prezzo di ${car?.price.toLocaleString('it-IT')}€. Potete fornirmi maggiori informazioni?`;
    window.location.href = `mailto:${car?.dealer.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const getTranslatedSpec = (key: string, value: any): string => {
    const translations: Record<string, Record<string, string>> = {
      fuelType: {
        'petrol': 'Benzina',
        'diesel': 'Diesel',
        'electric': 'Elettrico',
        'hybrid': 'Ibrido'
      },
      transmission: {
        'manual': 'Manuale',
        'automatic': 'Automatico',
        'semi_automatic': 'Semiautomatico'
      }
    };
    
    return translations[key]?.[value] || value;
  };

  if (isLoading) {
    return (
      <PageContainer>
        <Container>
          <Loading type="spinner" size="lg" text="Caricamento dettagli auto..." />
        </Container>
      </PageContainer>
    );
  }

  if (error || !car) {
    return (
      <PageContainer>
        <Container>
          <BackButton variant="outline" onClick={() => navigate('/auto')}>
            <FaArrowLeft /> Torna al Catalogo
          </BackButton>
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <h2>Auto non trovata</h2>
            <p>L'auto che stai cercando non è disponibile o è stata rimossa.</p>
            <Button onClick={() => navigate('/auto')}>
              Visualizza Tutte le Auto
            </Button>
          </div>
        </Container>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Container>
        <BackButton variant="outline" onClick={() => navigate('/auto')}>
          <FaArrowLeft /> Torna al Catalogo
        </BackButton>

        <DetailGrid>
          {/* Sezione Immagini */}
          <ImageSection>
            <MainImage>
              <img 
                src={car.images[activeImageIndex]?.url || '/placeholder-car.jpg'} 
                alt={car.images[activeImageIndex]?.altText || `${car.make} ${car.model}`}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'flex';
                  target.style.alignItems = 'center';
                  target.style.justifyContent = 'center';
                  target.style.fontSize = '4rem';
                  target.innerHTML = '🚗';
                }}
              />
            </MainImage>

            <ImageGallery>
              {car.images.map((image, index) => (
                <ThumbnailImage
                  key={image.id}
                  $isActive={activeImageIndex === index}
                  onClick={() => setActiveImageIndex(index)}
                >
                  <img 
                    src={image.url} 
                    alt={image.altText}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'flex';
                      target.style.alignItems = 'center';
                      target.style.justifyContent = 'center';
                      target.style.fontSize = '2rem';
                      target.innerHTML = '🚗';
                    }}
                  />
                </ThumbnailImage>
              ))}
            </ImageGallery>
          </ImageSection>

          {/* Sezione Info */}
          <InfoSection>
            <CarHeader>
              <CarTitle>{car.make} {car.model}</CarTitle>
              <CarPrice>{car.price.toLocaleString('it-IT')}€</CarPrice>
              
              <ActionButtons>
                <PrimaryButton onClick={handleContactDealer}>
                  <FaPhone /> Chiama Ora
                </PrimaryButton>
                <SecondaryButton onClick={handleEmailDealer}>
                  <FaEnvelope /> Invia Email
                </SecondaryButton>
              </ActionButtons>
            </CarHeader>

            <SpecsGrid>
              <SpecItem>
                <FaCalendar />
                <span>{car.year}</span>
              </SpecItem>
              <SpecItem>
                <FaTachometerAlt />
                <span>{car.mileage.toLocaleString()} Km</span>
              </SpecItem>
              <SpecItem>
                <FaGasPump />
                <span>{getTranslatedSpec('fuelType', car.fuelType)}</span>
              </SpecItem>
              <SpecItem>
                <FaCog />
                <span>{getTranslatedSpec('transmission', car.transmission)}</span>
              </SpecItem>
              <SpecItem>
                <FaCar />
                <span>{car.power}KW</span>
              </SpecItem>
              <SpecItem>
                <FaPalette />
                <span>{car.color}</span>
              </SpecItem>
            </SpecsGrid>

            <DealerInfo>
              <DealerName>{car.dealer.name}</DealerName>
              <ContactInfo>
                <ContactItem>
                  <FaMapMarkerAlt />
                  <span>{car.location.address}, {car.location.city}</span>
                </ContactItem>
                <ContactItem>
                  <FaPhone />
                  <span>{car.dealer.phone}</span>
                </ContactItem>
                <ContactItem>
                  <FaEnvelope />
                  <span>{car.dealer.email}</span>
                </ContactItem>
              </ContactInfo>
            </DealerInfo>
          </InfoSection>
        </DetailGrid>

        {/* Sezione Descrizione */}
        <DescriptionSection>
          <SectionTitle>Descrizione</SectionTitle>
          <Description>{car.description}</Description>
          
          <SectionTitle>Equipaggiamenti</SectionTitle>
          <FeaturesList>
            {car.features.map((feature, index) => (
              <FeatureItem key={index}>{feature}</FeatureItem>
            ))}
          </FeaturesList>
        </DescriptionSection>
      </Container>
    </PageContainer>
  );
};

export default CarDetailPage;