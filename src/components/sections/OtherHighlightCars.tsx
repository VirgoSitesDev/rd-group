import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaArrowRight, FaMapMarkerAlt } from 'react-icons/fa';
import { useFeaturedCars } from '../../hooks/useCars';
import ActionButton from '../common/ActionButton';
import Loading from '../common/Loading';

const FeaturedGrid = styled.div`
  padding: 0px 0;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => theme.spacing.xl};
  align-items: stretch;

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing.lg};
  }
`;

const PromotionalBox = styled.div`
  background: rgba(203, 22, 24, 0.08);
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.xxl};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border: 4px dashed #cb1618;
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    pointer-events: none;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    min-height: auto;
    padding: ${({ theme }) => theme.spacing.xl};
  }
`;

const PromoLink = styled(Link)`
  color: ${({ theme }) => theme.colors.primary.main};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  text-decoration: underline;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  font-size: 1.1rem;
  align-self: center;

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
  border: 1px solid #e0e0e0;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  display: flex;
  padding: 0;
  margin: 0;
  flex-direction: column;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  }
`;

const CarImageContainer = styled.div`
  position: relative;
  height: 280px;
  background: #f5f5f5;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const LocationBadge = styled.div`
  position: absolute;
  top: ${({ theme }) => theme.spacing.md};
  left: ${({ theme }) => theme.spacing.md};
  background: #000000;
  color: white;
  padding: 2px ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  border-radius: 2px;
  font-size: 0.7rem;
  display: flex;
  align-items: center;
  gap: 4px;
  width: fit-content;
  z-index: 10;

  svg {
    font-size: 0.7rem;
  }
`;

const CarInfo = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
`;

const CarBrand = styled.div`
  font-size: 1rem;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 0px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const CarModel = styled.h4`
  font-size: 1.6rem;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: black;
  margin: 0 0 ${({ theme }) => theme.spacing.xs} 0;
  line-height: 1.2;
`;

const CarPrice = styled.div`
  font-size: 1.5rem;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.primary.main};
  padding-bottom: ${({ theme }) => theme.spacing.md};
`;

const CarBodyType = styled.div`
  background: #000000;
  color: white;
  padding: 2px ${({ theme }) => theme.spacing.sm};
  border-radius: 4px;
  font-size: 0.7rem;
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
  gap: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.xs};
  font-size: 1rem;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  line-height: 1.2;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing.sm};
  }
`;

const CarDetail = styled.div`
  color: ${({ theme }) => theme.colors.text.primary};
  line-height: 1.1;

  strong {
    color: black;
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
  grid-column: 1 / -1;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xxl};
  color: ${({ theme }) => theme.colors.text.primary};
  grid-column: 1 / -1;
`;

const OtherHighlightCars: React.FC = () => {
  const navigate = useNavigate();
  const { data: featuredResult, isLoading, error } = useFeaturedCars(6);
  
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
      <FeaturedGrid>
        <LoadingContainer>
          <Loading type="spinner" size="md" text="Caricamento auto..." />
        </LoadingContainer>
      </FeaturedGrid>
    );
  }

  if (error || !featuredResult?.cars?.length) {
    return (
      <FeaturedGrid>
        <EmptyState>
          <h3>Nessuna auto disponibile</h3>
          <p>Non ci sono auto da mostrare al momento.</p>
        </EmptyState>
      </FeaturedGrid>
    );
  }

  const otherCars = featuredResult.cars.slice(1, 3);

  return (
    <FeaturedGrid>
      {otherCars.map((car) => (
        <CarCard key={car.id} onClick={() => handleCarClick(car.id)}>
          <CarImageContainer>
            <LocationBadge>
              <FaMapMarkerAlt />
              {car.location.city}
            </LocationBadge>
            {car.images?.[0] ? (
              <img 
                src={car.images[0].url} 
                alt={car.images[0].altText}
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
          </CarImageContainer>

          <CarInfo>
            {/* Sezione superiore - solo marca e modello */}
            <div>
              <CarBrand>{car.make}</CarBrand>
              <CarModel>{car.model}</CarModel>
            </div>

            {/* Sezione inferiore - dal prezzo in giù */}
            <div>
              <CarPrice>{car.price.toLocaleString('it-IT')}€</CarPrice>
              
              <CarBodyType>
                {getTranslatedBodyType(car.bodyType)}
              </CarBodyType>

              <CarSpecs>
                {car.features && car.features.length > 0 && (
                  <CarTags>
                    {car.features.slice(0, 2).map((feature, featureIndex) => (
                      <CarTag key={featureIndex}>{feature}</CarTag>
                    ))}
                  </CarTags>
                )}
                
                <CarDivider />

                <CarDetails>
                  <CarDetail>
                    <strong>{car.mileage.toLocaleString()}Km</strong>
                  </CarDetail>
                  <CarDetail>
                    <strong>{getTranslatedFuelType(car.fuelType)}</strong>
                  </CarDetail>
                  <CarDetail>
                    <strong>{car.year}</strong>
                  </CarDetail>
                  <CarDetail>
                    <strong>{getTranslatedTransmission(car.transmission)}</strong>
                  </CarDetail>
                  <CarDetail>
                    <strong>{car.power}KW</strong>
                  </CarDetail>
                </CarDetails>
              </CarSpecs>

              <CarActions>
                <ActionButton 
                  variant="primary"
                  onClick={(e) => {
                    e?.stopPropagation();
                    handleCarClick(car.id);
                  }}
                >
                  Scopri di più <FaArrowRight />
                </ActionButton>
              </CarActions>
            </div>
          </CarInfo>
        </CarCard>
      ))}

      <PromotionalBox>
        <PromoLink to="/auto">
          Visita la pagina di ricerca <FaArrowRight />
        </PromoLink>
      </PromotionalBox>
    </FeaturedGrid>
  );
};

export default OtherHighlightCars;