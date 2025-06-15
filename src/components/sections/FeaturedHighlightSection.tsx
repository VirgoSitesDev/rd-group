import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaArrowRight, FaMapMarkerAlt } from 'react-icons/fa';
import { useFeaturedCars } from '../../hooks/useCars';
import ActionButton from '../common/ActionButton';

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

const CarHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
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

const FeaturedHighlightSection: React.FC = () => {
  const { data: featuredResult, isLoading } = useFeaturedCars(1); // Tornato a 1 auto
  
  const featuredCar = {
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
	  url: '/car.jpg',
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
  };

  const handleCarClick = () => {
    window.location.href = `/auto/${featuredCar.id}`;
  };

  if (isLoading) {
    return null; // Or a skeleton loader
  }

  return (
        <FeaturedGrid>
          {/* Primo container - Promotional Box */}
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

          {/* Secondo container - Featured Car (layout orizzontale) */}
          <FeaturedCarContainer>
            <CarCard onClick={handleCarClick}>
              <CarImageContainer>
                {featuredCar.images?.[0] ? (
					<img 
						src={featuredCar.images[0].url} 
						alt={featuredCar.images[0].altText}
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

				<LocationBadge style={{ position: 'relative', top: 'auto', right: 'auto', marginBottom: '16px' }}>
					<FaMapMarkerAlt />
					{featuredCar.location.address} Wagen {featuredCar.location.city}
				</LocationBadge>

                <CarHeader>
                  <CarBrand>{featuredCar.make}</CarBrand>
                  <CarModel>{featuredCar.model}</CarModel>
                  <CarPrice>{featuredCar.price.toLocaleString('it-IT')}€</CarPrice>
                </CarHeader>

                <CarSpecs>
                  <CarTags>
                    {featuredCar.features.map((feature, index) => (
                      <CarTag key={index}>{feature}</CarTag>
                    ))}
                  </CarTags>

				  <CarDivider />

                  <CarDetails>
                    <CarDetail>
                      <strong>{featuredCar.mileage.toLocaleString()}Km</strong>
                    </CarDetail>
                    <CarDetail>
                      <strong>
                        {featuredCar.fuelType === 'petrol' ? 'Benzina' :
                         featuredCar.fuelType === 'diesel' ? 'Diesel' :
                         featuredCar.fuelType === 'electric' ? 'Elettrico' :
                         featuredCar.fuelType === 'hybrid' ? 'Ibrido' : 'Benzina'}
                      </strong>
                    </CarDetail>
                    <CarDetail>
                      <strong>{featuredCar.year}</strong>
                    </CarDetail>
                    <CarDetail>
                      <strong>
                        {featuredCar.transmission === 'manual' ? 'Manuale' :
                         featuredCar.transmission === 'automatic' ? 'Automatico' :
                         featuredCar.transmission === 'semi_automatic' ? 'Semiautomatico' : 'Manuale'}
                      </strong>
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
                    handleCarClick();
                  }}
                  >
                    Scopri di più <FaArrowRight />
                  </ActionButton>
                </CarActions>
              </CarInfo>
            </CarCard>
          </FeaturedCarContainer>
        </FeaturedGrid>
  );
};

export default FeaturedHighlightSection;