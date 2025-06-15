import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaSearch, FaChevronDown } from 'react-icons/fa';
import Container from '../layout/Container';
import Button from '../common/Button';
import type { CarFilters } from '../../types/car/car';
import FeaturedHighlightSection from './FeaturedHighlightSection';
import OtherHighlightCars from './OtherHighlightCars';

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
  margin-top: -150px;
  max-width: 94vw;
  position: relative;
  z-index: 300;
`;

const SearchTitle = styled.h2`
  background: #F9F9F9;
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

const FiltersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xl};

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

const FilterGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  cursor: pointer;
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary.main};
  }
`;

const FilterLabel = styled.label`
  font-size: 1.2rem;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
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

const ApplyFiltersButton = styled(Button)`
  background: transparent;
  color: ${({ theme }) => theme.colors.primary.main};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.md};
  font-size: 1.1rem;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  text-transform: none;
  text-decoration: underline;
  letter-spacing: normal;
  margin-left: auto;
  display: flex;
  justify-content: flex-end;
  
  &:hover {
    background: transparent;
    color: ${({ theme }) => theme.colors.primary.main};
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

  const handleFilterChange = (field: keyof CarFilters, value: string) => {
    const newFilters = {
      ...filters,
      [field]: value || undefined
    };
    setFilters(newFilters);
  };

  const handlePriceChange = (field: 'priceMin' | 'priceMax', value: string) => {
    const numValue = value ? parseInt(value.replace(/\D/g, '')) : undefined;
    setFilters(prev => ({
      ...prev,
      [field]: numValue
    }));
  };

  const handleApplyFilters = () => {
    if (onSearch) {
      onSearch(filters);
    } else {
      // Navigate to catalog page with filters
      const searchParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
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

  return (
    <SearchSection>
      <Container>
        <SearchContainer>
          <SearchTitle>
            <FaSearch />
            Cerca la tua prossima auto
          </SearchTitle>

          <FiltersGrid>
            <FilterGroup>
              <FilterLabel>
                Marca
                <FaChevronDown />
              </FilterLabel>
            </FilterGroup>

            <FilterGroup>
              <FilterLabel>
                Alimentazione
                <FaChevronDown />
              </FilterLabel>
            </FilterGroup>

            <FilterGroup>
              <FilterLabel>
                Chilometraggio
                <FaChevronDown />
              </FilterLabel>
            </FilterGroup>

            <FilterGroup>
              <FilterLabel>Da</FilterLabel>
              <FilterInput 
                type="text"
                placeholder="0€"
                onChange={(e) => handlePriceChange('priceMin', e.target.value)}
                value={filters.priceMin ? formatPrice(filters.priceMin.toString()) : ''}
              />
            </FilterGroup>

            <FilterGroup>
              <FilterLabel>
                Modello
                <FaChevronDown />
              </FilterLabel>
            </FilterGroup>

            <FilterGroup>
              <FilterLabel>
                Cambio
                <FaChevronDown />
              </FilterLabel>
            </FilterGroup>

            <FilterGroup>
              <FilterLabel>
                Dove si trova
                <FaChevronDown />
              </FilterLabel>
            </FilterGroup>

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