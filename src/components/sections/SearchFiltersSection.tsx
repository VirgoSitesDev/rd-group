import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaSearch, FaChevronDown } from 'react-icons/fa';
import Container from '../layout/Container';
import Button from '../common/Button';
import type { CarFilters } from '../../types/car/car';
import FeaturedHighlightSection from './FeaturedHighlightSection';
import OtherHighlightCars from './OtherHighlightCars';
import { useCars } from '../../hooks/useCars';

const SearchSection = styled.section`
  background: ${({ theme }) => theme.colors.background.default};
  padding: ${({ theme }) => theme.spacing.xxl} 0;
  position: relative;
  z-index: 10;
`;

const SearchContainer = styled.div`
  background: white;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  padding: ${({ theme }) => theme.spacing.xl};
  margin: 0 auto;
  margin-top: -180px;
  max-width: 94vw;
  position: relative;
  z-index: 300;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    margin-top: 0px;
    padding: ${({ theme }) => theme.spacing.md};

  }
`;

const FiltersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xl};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: ${({ theme }) => theme.spacing.xl};
  }
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

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    gap: ${({ theme }) => theme.spacing.xs};
  }
`;

const FilterLabel = styled.label`
  font-size: 1rem;
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
    transition: transform 0.2s ease;
  }
`;

const DropdownContainer = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: ${({ theme }) => theme.shadows.md};
  z-index: 1000;
  max-height: ${({ isOpen }) => isOpen ? '200px' : '0'};
  overflow-y: auto;
  opacity: ${({ isOpen }) => isOpen ? 1 : 0};
  transform: ${({ isOpen }) => isOpen ? 'translateY(0)' : 'translateY(-10px)'};
  transition: all 0.2s ease;
  pointer-events: ${({ isOpen }) => isOpen ? 'all' : 'none'};
`;

const DropdownItem = styled.div`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  cursor: pointer;
  font-size: 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border}20;
  
  &:hover {
    background: ${({ theme }) => theme.colors.primary.main}10;
    color: ${({ theme }) => theme.colors.primary.main};
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const FilterInput = styled.input`
  padding: ${({ theme }) => theme.spacing.sm};
  height: 28px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: #F9F9F9;
  font-size: 1rem;
  font-weight: bold;
  transition: border-color 0.2s ease;

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

const ApplyFiltersButton = styled(Button)`
  background: transparent;
  color: ${({ theme }) => theme.colors.primary.main} !important;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.md};
  font-size: 1.1rem;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  text-transform: none;
  text-decoration: underline !important;
  letter-spacing: normal;
  margin-left: auto;
  display: flex;
  border: none;
  justify-content: flex-end;
  
  &:hover {
    background: transparent !important;
    color: ${({ theme }) => theme.colors.primary.main} !important;
  }
`;

const Divider = styled.hr`
  width: 100%;
  height: 0.7px;
  background-color: #000;
  border: none;
  margin: ${({ theme }) => theme.spacing.lg} 0 0 0;
`;

interface SearchFiltersProps {
  onSearch?: (filters: CarFilters) => void;
}

const SearchFiltersSection: React.FC<SearchFiltersProps> = ({ onSearch }) => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<CarFilters>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const { data: allCarsResult } = useCars({}, 1, 1000);

  const availableMakes = useMemo(() => {
    if (!allCarsResult?.cars) return [];
    const makes = [...new Set(allCarsResult.cars.map(car => car.make))];
    return makes.sort();
  }, [allCarsResult]);

  useEffect(() => {
    if (!filters.make?.length || !allCarsResult?.cars) {
      setAvailableModels([]);
      return;
    }
    
    const modelsForMake = allCarsResult.cars
      .filter(car => filters.make!.includes(car.make))
      .map(car => car.model);
    
    const uniqueModels = [...new Set(modelsForMake)].sort();
    setAvailableModels(uniqueModels);
  }, [filters.make, allCarsResult]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openDropdown) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [openDropdown]);

  const toggleDropdown = (dropdownName: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setOpenDropdown(openDropdown === dropdownName ? null : dropdownName);
  };

  const selectDropdownValue = (field: keyof CarFilters, value: string) => {
    if (field === 'make') {
      setFilters(prev => ({
        ...prev,
        make: value ? [value] : undefined,
        model: undefined
      }));
    } else {
      setFilters(prev => ({
        ...prev,
        [field]: value ? [value] : undefined
      }));
    }
    setOpenDropdown(null);
  };

  const handlePriceChange = (field: 'priceMin' | 'priceMax', value: string) => {
    const numValue = value ? parseInt(value.replace(/\D/g, '')) : undefined;
    setFilters(prev => ({
      ...prev,
      [field]: numValue
    }));
  };

  const handleSearchKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleApplyFilters();
    }
  };

  const handleApplyFilters = () => {
    const finalFilters = {
      ...filters,
      search: searchQuery.trim() || undefined
    };
    
    if (onSearch) {
      onSearch(finalFilters);
    } else {
      const searchParams = new URLSearchParams();
      const currentParams = new URLSearchParams(window.location.search);
      const isLuxury = currentParams.get('luxury');
      if (isLuxury === 'true') {
        searchParams.set('luxury', 'true');
      }
      
      Object.entries(finalFilters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          if (Array.isArray(value)) {
            if (value.length > 0) {
              searchParams.set(key, value.join(','));
            }
          } else {
            searchParams.set(key, value.toString());
          }
        }
      });
      navigate(`/auto?${searchParams.toString()}`);
    }
  };

  const formatPrice = (value: string) => {
    const numValue = value.replace(/\D/g, '');
    return numValue ? `${parseInt(numValue).toLocaleString('it-IT')}€` : '';
  };

  const getDisplayValue = (field: keyof CarFilters) => {
    switch (field) {
      case 'make':
        return filters.make?.[0] || 'Marca';
      case 'model':
        return filters.model?.[0] || 'Modello';
      case 'fuelType':
        const fuelTranslations = {
          'petrol': 'Benzina',
          'diesel': 'Diesel',
          'hybrid': 'Ibrido',
          'electric': 'Elettrico',
          'lpg': 'GPL',
          'cng': 'Metano'
        };
        return filters.fuelType?.[0] ? fuelTranslations[filters.fuelType[0] as keyof typeof fuelTranslations] || filters.fuelType[0] : 'Alimentazione';
      case 'transmission':
        const transTranslations = {
          'manual': 'Manuale',
          'automatic': 'Automatico',
          'semi_automatic': 'Semiautomatico'
        };
        return filters.transmission?.[0] ? transTranslations[filters.transmission[0] as keyof typeof transTranslations] || filters.transmission[0] : 'Cambio';
      case 'mileageMax':
        if (!filters.mileageMax) return 'Chilometraggio';
        if (filters.mileageMax <= 30000) return 'Fino a 30.000 km';
        if (filters.mileageMax <= 50000) return 'Fino a 50.000 km';
        if (filters.mileageMax <= 100000) return 'Fino a 100.000 km';
        if (filters.mileageMax <= 150000) return 'Fino a 150.000 km';
        return 'Fino a 200.000 km';
      case 'location':
        return filters.location || 'Dove si trova';
      default:
        return '';
    }
  };

  return (
    <SearchSection>
      <Container>
        <SearchContainer>

          <FiltersGrid>
            {/* Marca */}
            <FilterGroup>
              <FilterLabel onClick={(e) => toggleDropdown('make', e)}>
                {getDisplayValue('make')}
                <FaChevronDown style={{ transform: openDropdown === 'make' ? 'rotate(180deg)' : 'rotate(0deg)' }} />
              </FilterLabel>
              <DropdownContainer isOpen={openDropdown === 'make'}>
                <DropdownItem onClick={() => selectDropdownValue('make', '')}>
                  Tutte le marche
                </DropdownItem>
                {availableMakes.map(make => (
                  <DropdownItem key={make} onClick={() => selectDropdownValue('make', make)}>
                    {make}
                  </DropdownItem>
                ))}
              </DropdownContainer>
            </FilterGroup>

            {/* Alimentazione */}
            <FilterGroup>
              <FilterLabel onClick={(e) => toggleDropdown('fuelType', e)}>
                {getDisplayValue('fuelType')}
                <FaChevronDown style={{ transform: openDropdown === 'fuelType' ? 'rotate(180deg)' : 'rotate(0deg)' }} />
              </FilterLabel>
              <DropdownContainer isOpen={openDropdown === 'fuelType'}>
                <DropdownItem onClick={() => selectDropdownValue('fuelType', '')}>
                  Tutte
                </DropdownItem>
                <DropdownItem onClick={() => selectDropdownValue('fuelType', 'petrol')}>
                  Benzina
                </DropdownItem>
                <DropdownItem onClick={() => selectDropdownValue('fuelType', 'diesel')}>
                  Diesel
                </DropdownItem>
                <DropdownItem onClick={() => selectDropdownValue('fuelType', 'hybrid')}>
                  Ibrido
                </DropdownItem>
                <DropdownItem onClick={() => selectDropdownValue('fuelType', 'electric')}>
                  Elettrico
                </DropdownItem>
                <DropdownItem onClick={() => selectDropdownValue('fuelType', 'lpg')}>
                  GPL
                </DropdownItem>
                <DropdownItem onClick={() => selectDropdownValue('fuelType', 'cng')}>
                  Metano
                </DropdownItem>
              </DropdownContainer>
            </FilterGroup>

            {/* Chilometraggio */}
            <FilterGroup>
              <FilterLabel onClick={(e) => toggleDropdown('mileage', e)}>
                {getDisplayValue('mileageMax')}
                <FaChevronDown style={{ transform: openDropdown === 'mileage' ? 'rotate(180deg)' : 'rotate(0deg)' }} />
              </FilterLabel>
              <DropdownContainer isOpen={openDropdown === 'mileage'}>
                <DropdownItem onClick={() => setFilters(prev => ({ ...prev, mileageMax: undefined }))}>
                  Tutti i km
                </DropdownItem>
                <DropdownItem onClick={() => setFilters(prev => ({ ...prev, mileageMax: 30000 }))}>
                  Fino a 30.000 km
                </DropdownItem>
                <DropdownItem onClick={() => setFilters(prev => ({ ...prev, mileageMax: 50000 }))}>
                  Fino a 50.000 km
                </DropdownItem>
                <DropdownItem onClick={() => setFilters(prev => ({ ...prev, mileageMax: 100000 }))}>
                  Fino a 100.000 km
                </DropdownItem>
                <DropdownItem onClick={() => setFilters(prev => ({ ...prev, mileageMax: 150000 }))}>
                  Fino a 150.000 km
                </DropdownItem>
                <DropdownItem onClick={() => setFilters(prev => ({ ...prev, mileageMax: 200000 }))}>
                  Fino a 200.000 km
                </DropdownItem>
              </DropdownContainer>
            </FilterGroup>

            {/* Prezzo Da */}
            <FilterGroup>
              <FilterLabel>Da</FilterLabel>
              <FilterInput 
                type="text"
                placeholder="0€"
                onChange={(e) => handlePriceChange('priceMin', e.target.value)}
                value={filters.priceMin ? formatPrice(filters.priceMin.toString()) : ''}
              />
            </FilterGroup>

            {/* Modello */}
            <FilterGroup>
              <FilterLabel onClick={(e) => filters.make?.length ? toggleDropdown('model', e) : null}>
                {getDisplayValue('model')}
                <FaChevronDown style={{ 
                  transform: openDropdown === 'model' ? 'rotate(180deg)' : 'rotate(0deg)',
                  opacity: filters.make?.length ? 1 : 0.5
                }} />
              </FilterLabel>
              <DropdownContainer isOpen={openDropdown === 'model' && !!filters.make?.length}>
                <DropdownItem onClick={() => selectDropdownValue('model', '')}>
                  Tutti i modelli
                </DropdownItem>
                {availableModels.map(model => (
                  <DropdownItem key={model} onClick={() => selectDropdownValue('model', model)}>
                    {model}
                  </DropdownItem>
                ))}
              </DropdownContainer>
            </FilterGroup>

            {/* Cambio */}
            <FilterGroup>
              <FilterLabel onClick={(e) => toggleDropdown('transmission', e)}>
                {getDisplayValue('transmission')}
                <FaChevronDown style={{ transform: openDropdown === 'transmission' ? 'rotate(180deg)' : 'rotate(0deg)' }} />
              </FilterLabel>
              <DropdownContainer isOpen={openDropdown === 'transmission'}>
                <DropdownItem onClick={() => selectDropdownValue('transmission', '')}>
                  Tutti
                </DropdownItem>
                <DropdownItem onClick={() => selectDropdownValue('transmission', 'manual')}>
                  Manuale
                </DropdownItem>
                <DropdownItem onClick={() => selectDropdownValue('transmission', 'automatic')}>
                  Automatico
                </DropdownItem>
                <DropdownItem onClick={() => selectDropdownValue('transmission', 'semi_automatic')}>
                  Semiautomatico
                </DropdownItem>
              </DropdownContainer>
            </FilterGroup>

            {/* Prezzo A */}
            <FilterGroup>
              <FilterLabel>A</FilterLabel>
              <FilterInput 
                type="text"
                placeholder="200.000€"
                onChange={(e) => handlePriceChange('priceMax', e.target.value)}
                value={filters.priceMax ? formatPrice(filters.priceMax.toString()) : ''}
              />
            </FilterGroup>
          </FiltersGrid>

          <ApplyFiltersButton onClick={handleApplyFilters}>
            Applica filtri
          </ApplyFiltersButton>
          
          <Divider />
          <FeaturedHighlightSection />
          <OtherHighlightCars />
        </SearchContainer>
      </Container>
    </SearchSection>
  );
};

export default SearchFiltersSection;