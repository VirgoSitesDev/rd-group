import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaSearch, FaFilter, FaCar, FaMapMarkerAlt, FaChevronDown, FaArrowRight } from 'react-icons/fa';

import Container from '../components/layout/Container';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';
import ActionButton from '../components/common/ActionButton';
import { useCars, useCarManagement } from '../hooks/useCars';
import type { CarFilters, FuelType, TransmissionType, BodyType } from '../types/car/car';

const CatalogHeader = styled.div`
  background: transparent;
  padding: ${({ theme }) => theme.spacing.xxl} 0 ${({ theme }) => theme.spacing.xxl} 0;
`;

const SearchTitle = styled.h2`
  background: white;
  border: 1px solid #d0d0d0;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  width: 50vw;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  margin: 0 auto ${({ theme }) => theme.spacing.xl} auto;
  text-align: center;
  color: #656565;
  font-size: 1.3rem;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: ${({ theme }) => theme.spacing.sm};

  svg {
    color: ${({ theme }) => theme.colors.text.primary};
	font-size: 1rem;
  }
`;

const MainContainer = styled.div`
  display: grid;
  grid-template-columns: 15% 85%;
  gap: ${({ theme }) => theme.spacing.xl};
  align-items: start;

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing.lg};
  }
`;

const FiltersSection = styled.div`
  background: white;
  padding: ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  border: 1px solid #e0e0e0;
  position: sticky;
  top: ${({ theme }) => theme.spacing.md};
  max-height: calc(100vh - ${({ theme }) => theme.spacing.xl});
  overflow-y: auto;

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    position: static;
    max-height: none;
    overflow-y: visible;
  }
`;

const FiltersGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xxl};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const FilterGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  cursor: pointer;
  position: relative;
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary.main};
  }
`;

const FilterLabel = styled.label`
  font-size: 1.1rem;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: #000000;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  
  svg {
    padding-left: 5px;
    font-size: 1rem;
    color: #000000;
  }
`;

const HiddenSelect = styled.select`
  position: absolute;
  opacity: 0;
  pointer-events: none;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
`;

const FilterInput = styled.input`
  padding: ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: #F9F9F9;
  font-size: 1rem;
  font-weight: bold;
  transition: border-color 0.2s ease;
  width: 100%;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary.main};
  }

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary.main};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

const FiltersActions = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 0;
  padding-top: ${({ theme }) => theme.spacing.xs};

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    flex-direction: row;
    justify-content: flex-start;
  }
`;

const FullWidthActionButton = styled(ActionButton)`
  width: 100%;
`;

const ResultsSection = styled.div`
`;

const CarsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
  padding: 0;
  margin: 0;
  width: 100%;
  max-width: 100%;
  overflow: hidden;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
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
  padding: 0;
  margin: 0;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  }
`;

const CarImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 320px;
  background: #f5f5f5;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const CarLocationBadge = styled.div`
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

const CarContent = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
`;

const CarHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const CarMake = styled.div`
  font-size: 1.1rem;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 0px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const CarModel = styled.h3`
  font-size: 1.8rem;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 ${({ theme }) => theme.spacing.xs} 0;
  line-height: 1.2;
`;

const CarPrice = styled.div`
  font-size: 1.7rem;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.primary.main};
`;

const CarDivider = styled.hr`
  width: 100%;
  height: 0.8px;
  background-color: #000000;
  border: none;
  margin: ${({ theme }) => theme.spacing.md} 0;
`;

const CarSpecs = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const CarSpecsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.xs};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  font-size: 1rem;
  line-height: 1.2;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing.sm};
  }
`;

const CarSpec = styled.div`
  color: ${({ theme }) => theme.colors.text.primary};
  line-height: 1.1;

  strong {
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

const CarTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
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

const CarActions = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const NoResults = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xxl};
  color: ${({ theme }) => theme.colors.text.primary};
  
  h3 {
    margin-bottom: ${({ theme }) => theme.spacing.md};
    color: ${({ theme }) => theme.colors.text.primary};
    font-size: 1.5rem;
  }
  
  p {
    font-size: 1.1rem;
    margin-bottom: ${({ theme }) => theme.spacing.xl};
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.xxl};
  padding: ${({ theme }) => theme.spacing.xl} 0;
`;

const PaginationButton = styled(Button)`
  min-width: 120px;
  border: none;
  color: ${({theme}) => theme.colors.primary.main};
  text-decoration: underline;
  text-transform: none;
  margin-top: -4px;
`;

const CatalogPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(1);
  const [sorting, setSorting] = useState({ field: 'createdAt', direction: 'desc' as 'asc' | 'desc' });

  const filters = useMemo(() => {
    const urlFilters: CarFilters = {};
    
    const make = searchParams.get('make');
    if (make) urlFilters.make = make.split(',');
    
    const model = searchParams.get('model');
    if (model) urlFilters.model = model.split(',');
    
    const priceMin = searchParams.get('priceMin');
    if (priceMin) urlFilters.priceMin = parseInt(priceMin);
    
    const priceMax = searchParams.get('priceMax');
    if (priceMax) urlFilters.priceMax = parseInt(priceMax);
    
    const yearMin = searchParams.get('yearMin');
    if (yearMin) urlFilters.yearMin = parseInt(yearMin);
    
    const yearMax = searchParams.get('yearMax');
    if (yearMax) urlFilters.yearMax = parseInt(yearMax);
    
    const mileageMin = searchParams.get('mileageMin');
    if (mileageMin) urlFilters.mileageMin = parseInt(mileageMin);
    
    const mileageMax = searchParams.get('mileageMax');
    if (mileageMax) urlFilters.mileageMax = parseInt(mileageMax);
    
    const fuelType = searchParams.get('fuelType');
    if (fuelType) urlFilters.fuelType = fuelType.split(',') as FuelType[];
    
    const transmission = searchParams.get('transmission');
    if (transmission) urlFilters.transmission = transmission.split(',') as TransmissionType[];
    
    const bodyType = searchParams.get('bodyType');
    if (bodyType) urlFilters.bodyType = bodyType.split(',') as BodyType[];
    
    const isLuxury = searchParams.get('luxury');
    if (isLuxury === 'true') urlFilters.isLuxury = true;
    
    const location = searchParams.get('location');
    if (location) urlFilters.location = location;
    
    return urlFilters;
  }, [searchParams]);

  const { data: searchResult, isLoading, error } = useCars(filters, page, 20);
  const { syncStatus } = useCarManagement();

  useEffect(() => {
    const getPageTitle = () => {
      if (filters.isLuxury) return 'Auto di Lusso - RD Group Pistoia';
      if (filters.make?.length === 1) return `${filters.make[0]} Usate - RD Group Pistoia`;
      return 'Catalogo Auto Usate - RD Group Pistoia';
    };
    
    document.title = getPageTitle();
  }, [filters]);

  const [localFilters, setLocalFilters] = useState<CarFilters>(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleFilterChange = (field: keyof CarFilters, value: any) => {
    setLocalFilters(prev => ({
      ...prev,
      [field]: value || undefined
    }));
  };

  const handlePriceChange = (field: 'priceMin' | 'priceMax', value: string) => {
    const numValue = value ? parseInt(value.replace(/\D/g, '')) : undefined;
    setLocalFilters(prev => ({
      ...prev,
      [field]: numValue
    }));
  };

  const handleApplyFilters = () => {
    const newSearchParams = new URLSearchParams();
    
    Object.entries(localFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        if (Array.isArray(value)) {
          if (value.length > 0) {
            newSearchParams.set(key, value.join(','));
          }
        } else {
          newSearchParams.set(key, value.toString());
        }
      }
    });
    
    setSearchParams(newSearchParams);
    setPage(1);
  };

  const handleClearFilters = () => {
    setLocalFilters({});
    setSearchParams(new URLSearchParams());
    setPage(1);
  };

  const handleCarClick = (carId: string) => {
    navigate(`/auto/${carId}`);
  };

  const formatPrice = (value: string) => {
    const numValue = value.replace(/\D/g, '');
    return numValue ? `${parseInt(numValue).toLocaleString('it-IT')}€` : '';
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

  const getPageDisplayTitle = () => {
    if (filters.isLuxury) return 'Auto di Lusso';
    if (filters.make?.length === 1) return `Auto ${filters.make[0]}`;
    return 'Catalogo Auto Usate';
  };

  const getPageDisplaySubtitle = () => {
    if (filters.isLuxury) return 'Scopri la nostra selezione di auto di lusso e sportive';
    if (filters.make?.length === 1) return `Trova la ${filters.make[0]} perfetta per te`;
    return 'Trova l\'auto perfetta per te nel nostro ampio catalogo';
  };

  return (
    <>
      <CatalogHeader>
        <Container>
          <SearchTitle>
            <FaSearch />
            Cerca la tua prossima auto
          </SearchTitle>
        </Container>
      </CatalogHeader>

      <Container>
        <MainContainer>
          <FiltersSection>   
            <FiltersGrid>
              <FilterGroup>
                <FilterLabel>
                  Marca
                  <FaChevronDown />
                </FilterLabel>
                <HiddenSelect 
                  id="make"
                  value={localFilters.make?.[0] || ''}
                  onChange={(e) => handleFilterChange('make', e.target.value ? [e.target.value] : undefined)}
                >
                  <option value="">Tutte le marche</option>
                  <option value="Audi">Audi</option>
                  <option value="BMW">BMW</option>
                  <option value="Mercedes-Benz">Mercedes-Benz</option>
                  <option value="Volkswagen">Volkswagen</option>
                  <option value="Ford">Ford</option>
                  <option value="Fiat">Fiat</option>
                  <option value="Abarth">Abarth</option>
                  <option value="Alfa Romeo">Alfa Romeo</option>
                  <option value="Ferrari">Ferrari</option>
                  <option value="Lamborghini">Lamborghini</option>
                  <option value="Porsche">Porsche</option>
                </HiddenSelect>
              </FilterGroup>

              <FilterGroup>
                <FilterLabel>
                  Modello
                  <FaChevronDown />
                </FilterLabel>
              </FilterGroup>

              <FilterGroup>
                <FilterLabel>
                  Alimentazione
                  <FaChevronDown />
                </FilterLabel>
                <HiddenSelect 
                  id="fuelType"
                  value={localFilters.fuelType?.[0] || ''}
                  onChange={(e) => handleFilterChange('fuelType', e.target.value ? [e.target.value as FuelType] : undefined)}
                >
                  <option value="">Tutti</option>
                  <option value="petrol">Benzina</option>
                  <option value="diesel">Diesel</option>
                  <option value="hybrid">Ibrido</option>
                  <option value="electric">Elettrico</option>
                  <option value="lpg">GPL</option>
                </HiddenSelect>
              </FilterGroup>

              <FilterGroup>
                <FilterLabel>
                  Chilometraggio
                  <FaChevronDown />
                </FilterLabel>
              </FilterGroup>

              <FilterGroup>
                <FilterLabel>
                  Cambio
                  <FaChevronDown />
                </FilterLabel>
                <HiddenSelect 
                  id="transmission"
                  value={localFilters.transmission?.[0] || ''}
                  onChange={(e) => handleFilterChange('transmission', e.target.value ? [e.target.value as TransmissionType] : undefined)}
                >
                  <option value="">Tutti</option>
                  <option value="manual">Manuale</option>
                  <option value="automatic">Automatico</option>
                  <option value="semi_automatic">Semiautomatico</option>
                </HiddenSelect>
              </FilterGroup>

              <FilterGroup>
                <FilterLabel>
                  Dove si trova
                  <FaChevronDown />
                </FilterLabel>
              </FilterGroup>

              <FilterGroup>
                <FilterLabel>Da</FilterLabel>
                <FilterInput 
                  type="text"
                  placeholder="0€"
                  onChange={(e) => handlePriceChange('priceMin', e.target.value)}
                  value={localFilters.priceMin ? formatPrice(localFilters.priceMin.toString()) : ''}
                />
              </FilterGroup>

              <FilterGroup>
                <FilterLabel>A</FilterLabel>
                <FilterInput 
                  type="text"
                  placeholder="200.000€"
                  onChange={(e) => handlePriceChange('priceMax', e.target.value)}
                  value={localFilters.priceMax ? formatPrice(localFilters.priceMax.toString()) : ''}
                />
              </FilterGroup>
            </FiltersGrid>

            <FiltersActions>
              <FullWidthActionButton onClick={handleApplyFilters} variant="primary">
                Applica Filtri
              </FullWidthActionButton>
            </FiltersActions>
          </FiltersSection>

          <ResultsSection>

            {isLoading && (
              <LoadingContainer>
                <Loading type="spinner" size="lg" text="Caricamento auto in corso..." />
              </LoadingContainer>
            )}
            
            {error && (
              <NoResults>
                <h3>Errore nel caricamento</h3>
                <p>Si è verificato un errore durante il caricamento delle auto. Riprova più tardi.</p>
                <Button onClick={() => window.location.reload()}>
                  Ricarica Pagina
                </Button>
              </NoResults>
            )}

            {!isLoading && !error && searchResult && (
              <>
                {searchResult.cars.length === 0 ? (
                  <NoResults>
                    <h3>Nessuna auto trovata</h3>
                    <p>Prova a modificare i filtri di ricerca per trovare più risultati.</p>
                    <Button onClick={handleClearFilters}>
                      Rimuovi Filtri
                    </Button>
                  </NoResults>
                ) : (
                  <>
                    <CarsGrid>
                      {searchResult.cars.map((car) => (
                        <CarCard key={car.id} onClick={() => handleCarClick(car.id)}>
                          <CarImageContainer>
                            <CarLocationBadge>
                              <FaMapMarkerAlt />
                              {car.location.city}
                            </CarLocationBadge>
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
                                fontSize: '4rem',
                                opacity: 0.7
                              }}>
                                🚗
                              </div>
                            )}
                          </CarImageContainer>

                          <CarContent>
                            <CarHeader>
                              <CarMake>{car.make}</CarMake>
                              <CarModel>{car.model}</CarModel>
                              <CarPrice>{car.price.toLocaleString('it-IT')}€</CarPrice>
                            </CarHeader>

                            <CarSpecs>
                              {car.features && car.features.length > 0 && (
                                <CarTags>
                                  {car.features.slice(0, 2).map((feature, index) => (
                                    <CarTag key={index}>{feature}</CarTag>
                                  ))}
                                </CarTags>
                              )}

                              <CarDivider />

                              <CarSpecsGrid>
                                <CarSpec>
                                  <strong>{car.mileage.toLocaleString()}Km</strong>
                                </CarSpec>
                                <CarSpec>
                                  <strong>{getTranslatedFuelType(car.fuelType)}</strong>
                                </CarSpec>
                                <CarSpec>
                                  <strong>{car.year}</strong>
                                </CarSpec>
                                <CarSpec>
                                  <strong>{getTranslatedTransmission(car.transmission)}</strong>
                                </CarSpec>
                                <CarSpec>
                                  <strong>{car.power}KW</strong>
                                </CarSpec>
                              </CarSpecsGrid>
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
                          </CarContent>
                        </CarCard>
                      ))}
                    </CarsGrid>

                    {searchResult.total > 20 && (
                      <PaginationContainer>
                        {page > 1 && (
                          <PaginationButton 
                            variant="outline" 
                            onClick={() => setPage(page - 1)}
                          >
                            ← Precedente
                          </PaginationButton>
                        )}
                        
                        <span style={{ margin: '0 1rem', color: '#666' }}>
                          Pagina {page} di {Math.ceil(searchResult.total / 20)}
                        </span>
                        
                        {searchResult.hasMore && (
                          <PaginationButton 
                            variant="outline" 
                            onClick={() => setPage(page + 1)}
                          >
                            Successiva →
                          </PaginationButton>
                        )}
                      </PaginationContainer>
                    )}
                  </>
                )}
              </>
            )}
          </ResultsSection>
        </MainContainer>
      </Container>
    </>
  );
};

export default CatalogPage;