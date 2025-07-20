import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaSearch, FaCar, FaMapMarkerAlt, FaChevronDown, FaArrowRight, FaTimes } from 'react-icons/fa';

import Container from '../components/layout/Container';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';
import CarActionButton from '../components/common/ActionButton';

import { useCars } from '../hooks/useCars';
import type { CarFilters, FuelType, TransmissionType, BodyType } from '../types/car/car';

const CatalogHeader = styled.div`
  background: transparent;
  padding: ${({ theme }) => theme.spacing.xxl} 0 ${({ theme }) => theme.spacing.xl} 0;
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
  grid-template-columns: 25% 75%;
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
  gap: ${({ theme }) => theme.spacing.lg};
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



const PriceInputsRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const FiltersActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  padding-top: ${({ theme }) => theme.spacing.md};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const ApplyButton = styled(Button)`
  width: 100%;
  font-size: 0.9rem;
`;

const ClearButton = styled(Button)`
  width: 100%;
  font-size: 0.9rem;
`;

const ActiveFiltersContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const ActiveFilterTag = styled.div`
  background: ${({ theme }) => theme.colors.primary.main};
  color: white;
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  
  svg {
    cursor: pointer;
    font-size: 0.8rem;
    
    &:hover {
      opacity: 0.7;
    }
  }
`;

const ResultsSection = styled.div``;

const ResultsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  padding: 0 ${({ theme }) => theme.spacing.sm};
`;

const ResultsCount = styled.div`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 1.1rem;
  
  strong {
    color: ${({ theme }) => theme.colors.primary.main};
  }
`;

const SortingSelect = styled.select`
  padding: ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: white;
  font-size: 0.9rem;
  cursor: pointer;
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
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

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
  const { data: allCarsResult } = useCars({}, 1, 1000);

  const [localFilters, setLocalFilters] = useState<CarFilters>(filters);

  // Estrai marche e modelli unici dal database
  const availableMakes = useMemo(() => {
    if (!allCarsResult?.cars) return [];
    const makes = [...new Set(allCarsResult.cars.map(car => car.make))];
    return makes.sort();
  }, [allCarsResult]);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  // Aggiorna modelli quando cambia la marca
  useEffect(() => {
    if (!localFilters.make?.length || !allCarsResult?.cars) {
      setAvailableModels([]);
      return;
    }
    
    const modelsForMake = allCarsResult.cars
      .filter(car => localFilters.make!.includes(car.make))
      .map(car => car.model);
    
    const uniqueModels = [...new Set(modelsForMake)].sort();
    setAvailableModels(uniqueModels);
  }, [localFilters.make, allCarsResult]);

  // Chiudi dropdown quando clicchi fuori
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openDropdown) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [openDropdown]);

  useEffect(() => {
    const getPageTitle = () => {
      if (filters.isLuxury) return 'Auto di Lusso - RD Group Pistoia';
      if (filters.make?.length === 1) return `${filters.make[0]} Usate - RD Group Pistoia`;
      return 'Catalogo Auto Usate - RD Group Pistoia';
    };
    
    document.title = getPageTitle();
  }, [filters]);

  const toggleDropdown = (dropdownName: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setOpenDropdown(openDropdown === dropdownName ? null : dropdownName);
  };

  const selectDropdownValue = (field: keyof CarFilters, value: string) => {
    if (field === 'make') {
      setLocalFilters(prev => ({
        ...prev,
        make: value ? [value] : undefined,
        model: undefined // Reset model quando cambia marca
      }));
    } else {
      setLocalFilters(prev => ({
        ...prev,
        [field]: value ? [value] : undefined
      }));
    }
    setOpenDropdown(null);
  };

  const handleFilterChange = (field: keyof CarFilters, value: string) => {
    if (field === 'make') {
      setLocalFilters(prev => ({
        ...prev,
        make: value ? [value] : undefined,
        model: undefined // Reset model quando cambia marca
      }));
    } else {
      setLocalFilters(prev => ({
        ...prev,
        [field]: value ? [value] : undefined
      }));
    }
  };

  const handlePriceChange = (field: 'priceMin' | 'priceMax', value: string) => {
    const numValue = value ? parseInt(value.replace(/\D/g, '')) : undefined;
    setLocalFilters(prev => ({
      ...prev,
      [field]: numValue
    }));
  };

  const handleMileageChange = (value: string) => {
    if (!value) {
      setLocalFilters(prev => ({
        ...prev,
        mileageMax: undefined
      }));
      return;
    }

    const ranges = {
      '30000': 30000,
      '50000': 50000,
      '100000': 100000,
      '150000': 150000,
      '200000': 200000
    };

    setLocalFilters(prev => ({
      ...prev,
      mileageMax: ranges[value as keyof typeof ranges]
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

  const removeFilter = (field: keyof CarFilters) => {
    setLocalFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[field];
      return newFilters;
    });
    
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete(field);
    setSearchParams(newSearchParams);
  };

  const handleCarClick = (carId: string) => {
    navigate(`/auto/${carId}`);
  };

  const formatPrice = (value: string) => {
    const numValue = value.replace(/\D/g, '');
    return numValue ? `${parseInt(numValue).toLocaleString('it-IT')}€` : '';
  };

  const getDisplayValue = (field: keyof CarFilters) => {
    switch (field) {
      case 'make':
        return localFilters.make?.[0] || 'Marca';
      case 'model':
        return localFilters.model?.[0] || 'Modello';
      case 'fuelType':
        const fuelTranslations = {
          'petrol': 'Benzina',
          'diesel': 'Diesel',
          'hybrid': 'Ibrido',
          'electric': 'Elettrico',
          'lpg': 'GPL',
          'cng': 'Metano'
        };
        return localFilters.fuelType?.[0] ? fuelTranslations[localFilters.fuelType[0] as keyof typeof fuelTranslations] || localFilters.fuelType[0] : 'Alimentazione';
      case 'transmission':
        const transTranslations = {
          'manual': 'Manuale',
          'automatic': 'Automatico',
          'semi_automatic': 'Semiautomatico'
        };
        return localFilters.transmission?.[0] ? transTranslations[localFilters.transmission[0] as keyof typeof transTranslations] || localFilters.transmission[0] : 'Cambio';
      case 'mileageMax':
        if (!localFilters.mileageMax) return 'Chilometraggio';
        if (localFilters.mileageMax <= 30000) return 'Fino a 30.000 km';
        if (localFilters.mileageMax <= 50000) return 'Fino a 50.000 km';
        if (localFilters.mileageMax <= 100000) return 'Fino a 100.000 km';
        if (localFilters.mileageMax <= 150000) return 'Fino a 150.000 km';
        return 'Fino a 200.000 km';
      case 'location':
        return localFilters.location || 'Località';
      default:
        return '';
    }
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

  const getActiveFilterTags = () => {
    const tags = [];
    
    if (localFilters.make?.length) {
      tags.push({ key: 'make', label: `Marca: ${localFilters.make[0]}` });
    }
    if (localFilters.model?.length) {
      tags.push({ key: 'model', label: `Modello: ${localFilters.model[0]}` });
    }
    if (localFilters.fuelType?.length) {
      tags.push({ key: 'fuelType', label: `Alimentazione: ${getTranslatedFuelType(localFilters.fuelType[0])}` });
    }
    if (localFilters.transmission?.length) {
      tags.push({ key: 'transmission', label: `Cambio: ${getTranslatedTransmission(localFilters.transmission[0])}` });
    }
    if (localFilters.priceMin) {
      tags.push({ key: 'priceMin', label: `Da: ${localFilters.priceMin.toLocaleString()}€` });
    }
    if (localFilters.priceMax) {
      tags.push({ key: 'priceMax', label: `Fino a: ${localFilters.priceMax.toLocaleString()}€` });
    }
    if (localFilters.mileageMax) {
      tags.push({ key: 'mileageMax', label: `Km: max ${localFilters.mileageMax.toLocaleString()}` });
    }
    if (localFilters.location) {
      tags.push({ key: 'location', label: `Località: ${localFilters.location}` });
    }
    if (localFilters.isLuxury) {
      tags.push({ key: 'isLuxury', label: 'Solo Luxury' });
    }
    
    return tags;
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
            {getActiveFilterTags().length > 0 && (
              <ActiveFiltersContainer>
                {getActiveFilterTags().map(tag => (
                  <ActiveFilterTag key={tag.key}>
                    {tag.label}
                    <FaTimes onClick={() => removeFilter(tag.key as keyof CarFilters)} />
                  </ActiveFilterTag>
                ))}
              </ActiveFiltersContainer>
            )}

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

              {/* Modello */}
              <FilterGroup>
                <FilterLabel onClick={(e) => localFilters.make?.length ? toggleDropdown('model', e) : null}>
                  {getDisplayValue('model')}
                  <FaChevronDown style={{ 
                    transform: openDropdown === 'model' ? 'rotate(180deg)' : 'rotate(0deg)',
                    opacity: localFilters.make?.length ? 1 : 0.5
                  }} />
                </FilterLabel>
                <DropdownContainer isOpen={openDropdown === 'model' && !!localFilters.make?.length}>
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

              {/* Chilometraggio */}
              <FilterGroup>
                <FilterLabel onClick={(e) => toggleDropdown('mileage', e)}>
                  {getDisplayValue('mileageMax')}
                  <FaChevronDown style={{ transform: openDropdown === 'mileage' ? 'rotate(180deg)' : 'rotate(0deg)' }} />
                </FilterLabel>
                <DropdownContainer isOpen={openDropdown === 'mileage'}>
                  <DropdownItem onClick={() => { setLocalFilters(prev => ({ ...prev, mileageMax: undefined })); setOpenDropdown(null); }}>
                    Tutti i km
                  </DropdownItem>
                  <DropdownItem onClick={() => { setLocalFilters(prev => ({ ...prev, mileageMax: 30000 })); setOpenDropdown(null); }}>
                    Fino a 30.000 km
                  </DropdownItem>
                  <DropdownItem onClick={() => { setLocalFilters(prev => ({ ...prev, mileageMax: 50000 })); setOpenDropdown(null); }}>
                    Fino a 50.000 km
                  </DropdownItem>
                  <DropdownItem onClick={() => { setLocalFilters(prev => ({ ...prev, mileageMax: 100000 })); setOpenDropdown(null); }}>
                    Fino a 100.000 km
                  </DropdownItem>
                  <DropdownItem onClick={() => { setLocalFilters(prev => ({ ...prev, mileageMax: 150000 })); setOpenDropdown(null); }}>
                    Fino a 150.000 km
                  </DropdownItem>
                  <DropdownItem onClick={() => { setLocalFilters(prev => ({ ...prev, mileageMax: 200000 })); setOpenDropdown(null); }}>
                    Fino a 200.000 km
                  </DropdownItem>
                </DropdownContainer>
              </FilterGroup>

              {/* Prezzo */}
              <FilterGroup style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                <FilterLabel>Prezzo</FilterLabel>
                <PriceInputsRow>
                  <FilterInput 
                    type="text"
                    placeholder="Da €"
                    onChange={(e) => handlePriceChange('priceMin', e.target.value)}
                    value={localFilters.priceMin ? formatPrice(localFilters.priceMin.toString()) : ''}
                  />
                  <FilterInput 
                    type="text"
                    placeholder="A €"
                    onChange={(e) => handlePriceChange('priceMax', e.target.value)}
                    value={localFilters.priceMax ? formatPrice(localFilters.priceMax.toString()) : ''}
                  />
                </PriceInputsRow>
              </FilterGroup>

              {/* Località */}
              <FilterGroup>
                <FilterLabel onClick={(e) => toggleDropdown('location', e)}>
                  {getDisplayValue('location')}
                  <FaChevronDown style={{ transform: openDropdown === 'location' ? 'rotate(180deg)' : 'rotate(0deg)' }} />
                </FilterLabel>
                <DropdownContainer isOpen={openDropdown === 'location'}>
                  <DropdownItem onClick={() => { setLocalFilters(prev => ({ ...prev, location: undefined })); setOpenDropdown(null); }}>
                    Tutte le sedi
                  </DropdownItem>
                  <DropdownItem onClick={() => { setLocalFilters(prev => ({ ...prev, location: 'Pistoia' })); setOpenDropdown(null); }}>
                    Pistoia
                  </DropdownItem>
                  <DropdownItem onClick={() => { setLocalFilters(prev => ({ ...prev, location: 'Via Bottaia' })); setOpenDropdown(null); }}>
                    Via Bottaia, 2
                  </DropdownItem>
                  <DropdownItem onClick={() => { setLocalFilters(prev => ({ ...prev, location: 'Via Galvani' })); setOpenDropdown(null); }}>
                    Via Luigi Galvani, 2
                  </DropdownItem>
                  <DropdownItem onClick={() => { setLocalFilters(prev => ({ ...prev, location: 'Via Fiorentina' })); setOpenDropdown(null); }}>
                    Via Fiorentina, 331
                  </DropdownItem>
                </DropdownContainer>
              </FilterGroup>
            </FiltersGrid>

            <FiltersActions>
              <ApplyButton onClick={handleApplyFilters} variant="primary">
                Applica Filtri
              </ApplyButton>
              {getActiveFilterTags().length > 0 && (
                <ClearButton onClick={handleClearFilters} variant="outline">
                  Cancella Filtri
                </ClearButton>
              )}
            </FiltersActions>
          </FiltersSection>

          <ResultsSection>
            {searchResult && (
              <ResultsHeader>
                <ResultsCount>
                  <strong>{searchResult.total}</strong> auto trovate
                  {filters.isLuxury && ' nella categoria Luxury'}
                </ResultsCount>
                
                <SortingSelect 
                  value={`${sorting.field}-${sorting.direction}`}
                  onChange={(e) => {
                    const [field, direction] = e.target.value.split('-');
                    setSorting({ field: field as any, direction: direction as any });
                  }}
                >
                  <option value="createdAt-desc">Più recenti</option>
                  <option value="price-asc">Prezzo crescente</option>
                  <option value="price-desc">Prezzo decrescente</option>
                  <option value="year-desc">Anno decrescente</option>
                  <option value="mileage-asc">Km crescenti</option>
                </SortingSelect>
              </ResultsHeader>
            )}

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
                              <CarActionButton 
                                variant="primary"
                                onClick={(e) => {
                                  e?.stopPropagation();
                                  handleCarClick(car.id);
                                }}
                              >
                                Scopri di più <FaArrowRight />
                              </CarActionButton>
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