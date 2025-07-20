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
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  text-decoration: underline;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  font-size: 1.4rem;
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
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  }
`;

const CarImageContainer = styled.div`
  position: relative;
  height: 380px;
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
  padding: ${({ theme }) => theme.spacing.xl};
`;

const CarHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const CarDivider = styled.hr`
  width: 100%;
  height: 0.8px;
  background-color: #000000;
  border: none;
  margin: ${({ theme }) => theme.spacing.md} 0;
`;

const CarBrand = styled.div`
  font-size: 1.1rem;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 0px;;
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

  // Prendiamo le auto dalla seconda in poi (la prima è già usata in FeaturedHighlightSection)
  // e aggiungiamo il promotional box alla fine
  const otherCars = featuredResult.cars.slice(1, 3); // Prendiamo 2 auto

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
            <CarHeader>
              <CarBrand>{car.make}</CarBrand>
              <CarModel>{car.model}</CarModel>
              <CarPrice>{car.price.toLocaleString('it-IT')}€</CarPrice>
            </CarHeader>

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