import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaArrowLeft, FaPhone, FaEnvelope, FaMapMarkerAlt, FaHeart, FaShare, FaCalendar, FaCar, FaGasPump, FaCog, FaTachometerAlt, FaPalette } from 'react-icons/fa';

import Container from '../components/layout/Container';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';
import { useCar } from '../hooks/useCars';

const PageContainer = styled.div`
  background: ${({ theme }) => theme.colors.background.default};
  min-height: 100vh;
  padding-top: ${({ theme }) => theme.spacing.md};
`;

const BackButton = styled(Button)`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  background: transparent;
  color: ${({ theme }) => theme.colors.text.primary};
  text-decoration: underline;
  text-transform: none;
  padding-bottom: ${({ theme }) => theme.spacing.md};
  padding-top: 15px;
  border: none;
  
  &:hover {
    background: ${({ theme }) => theme.colors.background.paper};
    transform: none;
    text-decoration: none;
  }

  svg {
    padding-top: 5px;
    font-size: 16px;
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
  height: 600px;
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
  height: 200px;
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
  border: 1px solid #e0e0e0;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  height: fit-content;
  position: sticky;
  top: ${({ theme }) => theme.spacing.xl};
`;

const CarHeader = styled.div`
  padding-bottom: ${({ theme }) => theme.spacing.xs};
`;

const CarTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: #000000;
  margin: 0 0 ${({ theme }) => theme.spacing.xs} 0;
`;

const CarMake = styled.h3`
  color: #656565;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 1.4rem;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  margin: 0;
  text-align: left;
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
  flex: 1;
`;

const CarDivider = styled.hr`
  width: 100%;
  height: 0.8px;
  background-color: #000000;
  border: none;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  margin-top: ${({ theme }) => theme.spacing.md};

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
    color: #000000;;
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
  margin-top: ${({ theme }) => theme.spacing.xl};
  border: 1px solid #e0e0e0;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
`;

const SectionTitle = styled.h2`
  color: #000000;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  font-size: 1.5rem;
`;

const Description = styled.p`
  color: ${({ theme }) => theme.colors.text.primary};
  line-height: 1.6;
  font-size: 1.1rem;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const FeaturesList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing.sm};
`;

const FeatureItem = styled.div`
  background: #000000;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  color: white;
  font-size: 0.9rem;
`;

const CarDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const { data: car, isLoading, error } = useCar(id || '');

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

  if (error || (!car && !isLoading)) {
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

  if (!car) return 'Nessuna macchina trovata';
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

            {/* 🔥 MIGLIORATO: Gestione immagini dal database */}
            {car.images && car.images.length > 1 && (
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
            )}

            <DescriptionSection>
              <SectionTitle>Descrizione</SectionTitle>
              <Description>{car.description}</Description>
              
              {/* 🔥 MIGLIORATO: Mostra features solo se esistono */}
              {car.features && car.features.length > 0 && (
                <>
                  <SectionTitle>Equipaggiamenti</SectionTitle>
                  <FeaturesList>
                    {car.features.map((feature, index) => (
                      <FeatureItem key={index}>{feature}</FeatureItem>
                    ))}
                  </FeaturesList>
                </>
              )}
            </DescriptionSection>
          </ImageSection>

          {/* Sezione Info */}
          <InfoSection>
            <CarHeader>
              <CarTitle>{car.model}</CarTitle>
              <CarMake>{car.make}</CarMake>
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
            
            <CarDivider></CarDivider>

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
      </Container>
    </PageContainer>
  );
};

export default CarDetailPage;