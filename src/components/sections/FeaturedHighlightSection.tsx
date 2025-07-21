import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaArrowRight, FaMapMarkerAlt } from 'react-icons/fa';
import { useFeaturedCars } from '../../hooks/useCars';
import ActionButton from '../common/ActionButton';
import Loading from '../common/Loading';

const FeaturedGrid = styled.div`
  padding: 80px 0;
  display: flex;
  gap: ${({ theme }) => theme.spacing.xl};
  align-items: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.lg};
  }
`;

const PromotionalContainer = styled.div`
  width: 350px;
  flex-shrink: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    width: 100%;
  }
`;

const FeaturedCarContainer = styled.div`
  flex: 1;
  min-width: 400px;

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    min-width: auto;
    width: 100%;
  }
`;

const PromotionalBox = styled.div`
  background: rgba(203, 22, 24, 0.08);
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.xxl};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 60vh;

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    min-height: auto;
    padding: ${({ theme }) => theme.spacing.xl};
  }
`;

const PromoTitle = styled.h3`
  color: #d32f2f;
  font-size: 1.2rem;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const PromoText = styled.p`
  color: ${({ theme }) => theme.colors.primary.main};
  font-size: 1.2rem;
  line-height: 1.5;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  flex: 1;
`;

const PromoLink = styled(Link)`
  color: ${({ theme }) => theme.colors.primary.main};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  font-size: 1.2rem;
  text-decoration: underline;
  align-self: flex-start;

  &:hover {
    text-decoration: underline;
    color: ${({ theme }) => theme.colors.primary.main};
  }

  svg {
    font-size: 0.8rem;
  }
`;

const CarCard = styled.div`
  background: white;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  display: flex;
  align-items: stretch;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    flex-direction: column;
  }
`;

const CarImageContainer = styled.div`
  position: relative;
  flex: 1;
  min-height: 300px;
  background: #f5f5f5;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    min-height: 200px;
  }
`;

const LocationBadge = styled.div`
  position: absolute;
  top: ${({ theme }) => theme.spacing.md};
  right: ${({ theme }) => theme.spacing.md};
  background: #000000;
  color: white;
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: 2px;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 4px;
  width: fit-content;

  svg {
    font-size: 0.7rem;
  }
`;

const CarInfo = styled.div`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.md};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-width: 340px;
  max-width: 340px;
`;

const CarBrand = styled.div`
  font-size: 1.1rem;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 0px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const CarModel = styled.h4`
  font-size: 1.8rem;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 ${({ theme }) => theme.spacing.xs} 0;
`;

const CarPrice = styled.div`
  font-size: 1.7rem;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.primary.main};
`;

const CarBodyType = styled.div`
  background: #000000;
  color: white;
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: 2px;
  font-size: 0.8rem;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  text-transform: uppercase;
  width: fit-content;
  margin-top: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const CarSpecs = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const CarTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const CarTag = styled.span`
  background: #000000;
  color: white;
  padding: 1px 4px;
  border-radius: 2px;
  font-size: 0.8rem;
  font-weight: ${({ theme }) => theme.typography.fontWeight.regular};
  text-transform: uppercase;
`;

const CarDivider = styled.hr`
  width: 100%;
  height: 0.8px;
  background-color: #000000;
  border: none;
  margin: ${({ theme }) => theme.spacing.md} 0;
`;

const CarDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.lg};
  font-size: 1rem;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  line-height: 1.2;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing.sm};
  }
`;

const CarDetail = styled.div`
  color: ${({ theme }) => theme.colors.text.primary};
  line-height: 1.1;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  
  strong {
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

const CarActions = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xxl};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const FeaturedHighlightSection: React.FC = () => {
  const navigate = useNavigate();
  const { data: featuredResult, isLoading, error } = useFeaturedCars(3);
  
  const handleCarClick = (carId: string) => {
    navigate(`/auto/${carId}`);
  };

  const getTranslatedFuelType = (fuelType: string) => {
    const translations: Record<string, string> = {
      'petrol': 'Benzina',
      'diesel': 'Diesel',
      'electric': 'Elettrico',
      'hybrid': 'Ibrido',
      'plugin_hybrid': 'Ibrido Plugin',
      'lpg': 'GPL',
      'cng': 'Metano'
    };
    return translations[fuelType] || fuelType;
  };

  const getTranslatedTransmission = (transmission: string) => {
    const translations: Record<string, string> = {
      'manual': 'Manuale',
      'automatic': 'Automatico',
      'semi_automatic': 'Semiautomatico',
      'cvt': 'CVT'
    };
    return translations[transmission] || transmission;
  };

  const getTranslatedBodyType = (bodyType: string) => {
    const translations: Record<string, string> = {
      'sedan': 'Berlina',
      'hatchback': 'Berlina',
      'estate': 'Station Wagon',
      'suv': 'SUV',
      'coupe': 'Coupé',
      'convertible': 'Cabrio',
      'pickup': 'Pick-up',
      'van': 'Furgone',
      'minivan': 'Monovolume',
      'other': 'Berlina'
    };
    return translations[bodyType] || bodyType;
  };

  if (isLoading) {
    return (
      <LoadingContainer>
        <Loading type="spinner" size="md" text="Caricamento auto in evidenza..." />
      </LoadingContainer>
    );
  }

  if (error || !featuredResult?.cars?.length) {
    return (
      <EmptyState>
        <h3>Nessuna auto in evidenza disponibile</h3>
        <p>Non ci sono auto da mostrare al momento. Torna più tardi!</p>
      </EmptyState>
    );
  }

  const featuredCar = featuredResult.cars[0];

  return (
    <FeaturedGrid>
      <PromotionalContainer>
        <PromotionalBox>
          <div>
            <PromoTitle>In evidenza</PromoTitle>
            <PromoText>
              Questa auto è arrivata nelle ultime 24 ore, dai un'occhiata, 
              potrebbe essere la tua occasione
            </PromoText>
          </div>
          <PromoLink to="/auto?recent=true">
            Gli ultimi arrivi <FaArrowRight />
          </PromoLink>
        </PromotionalBox>
      </PromotionalContainer>

      <FeaturedCarContainer>
        <CarCard onClick={() => handleCarClick(featuredCar.id)}>
          <CarImageContainer>
            {featuredCar.images?.[0] ? (
              <img 
                src={featuredCar.images[0].url} 
                alt={featuredCar.images[0].altText}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'flex';
                  target.style.alignItems = 'center';
                  target.style.justifyContent = 'center';
                  target.style.fontSize = '4rem';
                  target.innerHTML = '🚗';
                }}
              />
            ) : (
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                height: '100%',
                background: '#f5f5f5',
                fontSize: '4rem',
                opacity: 0.8
              }}>
                🚗
              </div>
            )}
            <LocationBadge>
              <FaMapMarkerAlt />
              {featuredCar.location.city}
            </LocationBadge>
          </CarImageContainer>

          <CarInfo>
            {/* Sezione superiore - solo marca e modello */}
            <div>
              <CarBrand>{featuredCar.make}</CarBrand>
              <CarModel>{featuredCar.model}</CarModel>
            </div>

            {/* Sezione inferiore - dal prezzo in giù */}
            <div>
              <CarPrice>{featuredCar.price.toLocaleString('it-IT')}€</CarPrice>
              
              <CarBodyType>
                {getTranslatedBodyType(featuredCar.bodyType)}
              </CarBodyType>

              <CarSpecs>
                {featuredCar.features && featuredCar.features.length > 0 && (
                  <CarTags>
                    {featuredCar.features.slice(0, 3).map((feature, index) => (
                      <CarTag key={index}>{feature}</CarTag>
                    ))}
                  </CarTags>
                )}

                <CarDivider />

                <CarDetails>
                  <CarDetail>
                    <strong>{featuredCar.mileage.toLocaleString()}Km</strong>
                  </CarDetail>
                  <CarDetail>
                    <strong>{getTranslatedFuelType(featuredCar.fuelType)}</strong>
                  </CarDetail>
                  <CarDetail>
                    <strong>{featuredCar.year}</strong>
                  </CarDetail>
                  <CarDetail>
                    <strong>{getTranslatedTransmission(featuredCar.transmission)}</strong>
                  </CarDetail>
                  <CarDetail>
                    <strong>{featuredCar.power}KW</strong>
                  </CarDetail>
                </CarDetails>
              </CarSpecs>

              <CarActions>
                <ActionButton 
                  variant="primary"
                  onClick={(e) => {
                    e?.stopPropagation();
                    handleCarClick(featuredCar.id);
                  }}
                >
                  Scopri di più <FaArrowRight />
                </ActionButton>
              </CarActions>
            </div>
          </CarInfo>
        </CarCard>
      </FeaturedCarContainer>
    </FeaturedGrid>
  );
};

export default FeaturedHighlightSection;