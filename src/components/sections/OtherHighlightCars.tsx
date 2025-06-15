import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaArrowRight, FaMapMarkerAlt } from 'react-icons/fa';
import { useFeaturedCars } from '../../hooks/useCars';
import ActionButton from '../common/ActionButton';

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

const FeaturedHighlightSection: React.FC = () => {
  const { data: featuredResult, isLoading } = useFeaturedCars(2);
  
  const featuredCars = [
    {
      id: 'featured-abarth',
      make: 'ABARTH',
      model: '595 Turismo 1.4',
      price: 15400,
      year: 2015,
      mileage: 68000,
      fuelType: 'petrol',
      transmission: 'manual',
      power: 118,
      images: [{
        id: '1',
        url: '/Car_1.jpg',
        altText: 'ABARTH 595 Turismo',
        isPrimary: true,
        order: 0
      }],
      location: {
        address: 'via Empoli 19/21',
        city: 'Firenze',
        region: 'TM',
        postalCode: '50121',
        country: 'Italia'
      },
      doors: 3,
      seats: 4,
      color: 'Nero',
      bodyType: 'coupe' as any,
      engineSize: 1400,
      horsepower: 160,
      condition: 'used' as any,
      availability: 'available' as any,
      features: ['Coupé'],
      description: '',
      previousOwners: 1,
      currency: 'EUR',
      dealer: {
        id: '1',
        name: 'RD Group',
        phone: '+39 057 318 7467',
        email: 'info@rdgroup.it',
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
    },
    {
      id: 'featured-bmw',
      make: 'BMW',
      model: 'X3 xDrive20d',
      price: 28900,
      year: 2019,
      mileage: 45000,
      fuelType: 'diesel',
      transmission: 'automatic',
      power: 140,
      images: [{
        id: '2',
        url: '/Car_2.jpg',
        altText: 'BMW X3',
        isPrimary: true,
        order: 0
      }],
      location: {
        address: 'via Empoli 19/21',
        city: 'Firenze',
        region: 'TM',
        postalCode: '50121',
        country: 'Italia'
      },
      doors: 5,
      seats: 5,
      color: 'Bianco',
      bodyType: 'suv' as any,
      engineSize: 2000,
      horsepower: 190,
      condition: 'used' as any,
      availability: 'available' as any,
      features: ['SUV', 'Premium'],
      description: '',
      previousOwners: 1,
      currency: 'EUR',
      dealer: {
        id: '1',
        name: 'RD Group',
        phone: '+39 057 318 7467',
        email: 'info@rdgroup.it',
        location: {
          address: 'Via Bottaia, 2',
          city: 'Pistoia',
          region: 'Toscana',
          postalCode: '51100',
          country: 'Italia'
        }
      },
      isLuxury: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  const handleCarClick = (carId: string) => {
    window.location.href = `/auto/${carId}`;
  };

  if (isLoading) {
    return null;
  }

  return (
        <FeaturedGrid>
          {featuredCars.map((car, index) => (
            <CarCard key={car.id} onClick={() => handleCarClick(car.id)}>
              <CarImageContainer>
                <LocationBadge>
                  <FaMapMarkerAlt />
                  {car.location.address} Wagen {car.location.city}
                </LocationBadge>
                {car.images?.[0] ? (
                  <img 
                    src={car.images[0].url} 
                    alt={car.images[0].altText}
                  />
                ) : (
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    height: '100%',
                    background: 'white',
                    color: 'white',
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
                  <CarTags>
                    {car.features.map((feature, featureIndex) => (
                      <CarTag key={featureIndex}>{feature}</CarTag>
                    ))}
                  </CarTags>
                  
                  <CarDivider />

                  <CarDetails>
                    <CarDetail>
                      <strong>{car.mileage.toLocaleString()}Km</strong>
                    </CarDetail>
                    <CarDetail>
                      <strong>
                        {car.fuelType === 'petrol' ? 'Benzina' :
                         car.fuelType === 'diesel' ? 'Diesel' :
                         car.fuelType === 'electric' ? 'Elettrico' :
                         car.fuelType === 'hybrid' ? 'Ibrido' : 'Benzina'}
                      </strong>
                    </CarDetail>
                    <CarDetail>
                      <strong>{car.year}</strong>
                    </CarDetail>
                    <CarDetail>
                      <strong>
                        {car.transmission === 'manual' ? 'Manuale' :
                         car.transmission === 'automatic' ? 'Automatico' :
                         car.transmission === 'semi_automatic' ? 'Semiautomatico' : 'Manuale'}
                      </strong>
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
            <PromoLink to="/auto?recent=true">
              Visita la pagina di ricerca <FaArrowRight />
            </PromoLink>
          </PromotionalBox>
        </FeaturedGrid>
  );
};

export default FeaturedHighlightSection;