import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaArrowRight, FaBars, FaTimes } from 'react-icons/fa';
import Button from '../common/Button';
import { useFeaturedCars } from '../../hooks/useCars';

interface HeaderProps {
  featuredCar?: {
    make: string;
    model: string;
    price: number;
    year: number;
    mileage: number;
    fuelType: string;
    transmission: string;
    power: string;
    image?: string;
  };
  showHero?: boolean;
  backgroundImage?: string;
}

const HeaderContainer = styled.header<{ $showHero: boolean }>`
  height: ${({ $showHero }) => $showHero ? '100vh' : '240px'};
  overflow: ${({ $showHero }) => $showHero ? 'hidden' : 'visible'};
  position: ${({ $showHero }) => $showHero ? 'relative' : 'relative'};
  top: 0;
  left: 0;
  right: 0;
  z-index: 1;
  width: 100%;
  background: ${({ $showHero }) => $showHero ? 'transparent' : '#000000'};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    height: ${({ $showHero }) => $showHero ? '100vh' : '110px'};
  }
`;

const BackgroundOverlay = styled.div<{ $showHero: boolean; backgroundImage?: string }>`
  display: ${({ $showHero }) => $showHero ? 'block' : 'none'};
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('${({ backgroundImage }) => backgroundImage || '/hero-car-background.jpg'}') center/cover;
  z-index: 1;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.7));
  }
`;

const GradientOverlay = styled.div<{ $showHero: boolean }>`
  display: ${({ $showHero }) => $showHero ? 'block' : 'none'};
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2;
`;

const NavigationBar = styled.div<{ $showHero: boolean }>`
  position: ${({ $showHero }) => $showHero ? 'absolute' : 'relative'};
  top: 0;
  z-index: ${({ theme }) => theme.zIndex.sticky};
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 33px;
  padding: 30px 10px;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: row;
    justify-content: center;
    padding: 20px;
    gap: 0;
    position: relative;
  }
`;

const LogoSection = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  cursor: pointer;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.8;
    text-decoration: none;
  }
`;

const LogoVector = styled.div`
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  img {
    width: 100px;
    height: 100px;
    object-fit: contain;
    filter: brightness(0) invert(1);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 70px;
    height: 70px;
    
    img {
      width: 70px;
      height: 70px;
    }
  }
`;

const CompanyDescription = styled.p`
  color: #ffffff;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 14px;
  font-weight: 400;
  letter-spacing: 0;
  line-height: normal;
  white-space: nowrap;
  width: fit-content;
  margin: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`;

const NavigationSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 33px;
  padding: 0px 20px;
  width: 100%;
  max-width: 100vw;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`;

const NavLinksContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 40px;
  flex-wrap: wrap;
  justify-content: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`;

const NavLink = styled(Link)<{ $isActive: boolean; $showHero: boolean }>`
  color: ${({ $showHero, theme }) => $showHero ? '#ffffff' : '#ffffff'};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ $showHero }) => $showHero ? '1rem' : '1rem'};
  font-weight: 700;
  letter-spacing: 0;
  line-height: normal;
  white-space: nowrap;
  text-decoration: none;
  text-transform: uppercase;
  transition: all 0.2s ease;
  opacity: ${({ $isActive }) => $isActive ? 1 : 0.8};

  &:hover {
    opacity: 1;
    color: #D9D9D9;
    text-decoration: none;
  }
`;

const NavigationDivider = styled.div`
  width: 100%;
  height: 1px;
  background-color: rgba(255, 255, 255, 0.7);
  margin-bottom: -1px;
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.sm};
  z-index: 1001;
  position: absolute;
  right: 20px;
  top: 35px;
  transform: translateY(-50%);

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: block;
    svg {
      font-size: 1.2rem !important;
    }
  }
`;

const MobileMenuOverlay = styled.div<{ $isOpen: boolean }>`
  display: none;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    opacity: ${({ $isOpen }) => $isOpen ? 1 : 0};
    visibility: ${({ $isOpen }) => $isOpen ? 'visible' : 'hidden'};
    transition: opacity 0.3s ease, visibility 0.3s ease;
    z-index: 999;
  }
`;

const MobileMenu = styled.div<{ $isOpen: boolean }>`
  display: none;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 0;
    right: 0;
    height: 100vh;
    width: 280px;
    background: #000;
    transform: translateX(${({ $isOpen }) => $isOpen ? '0' : '100%'});
    transition: transform 0.3s ease;
    z-index: 1000;
    padding: ${({ theme }) => theme.spacing.xl};
    overflow-y: auto;
  }
`;

const MobileMenuHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const MobileNavLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const MobileNavLink = styled(Link)<{ $isActive: boolean }>`
  color: white;
  font-size: 1.2rem;
  font-weight: 600;
  text-decoration: none;
  padding: ${({ theme }) => theme.spacing.sm} 0;
  transition: all 0.2s ease;
  opacity: ${({ $isActive }) => $isActive ? 1 : 0.8};
`;

const HeroContentContainer = styled.div<{ $showHero: boolean }>`
  display: ${({ $showHero }) => $showHero ? 'flex' : 'none'};
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: calc(100% - 280px);
  align-items: flex-end;
  justify-content: space-between;
  padding: 0 ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.xxl};
  padding-bottom: 150px;
  z-index: 3;
  max-width: 100vw;
  margin: 0 auto;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
    justify-content: flex-end;
    align-items: flex-start;
    padding: 0 ${({ theme }) => theme.spacing.lg};
    padding-bottom: 60px;
    height: auto;
  }
`;

const LeftSection = styled.div`
  flex: 1;
  max-width: 360px;
  padding: ${({ theme }) => theme.spacing.xl};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    max-width: 100%;
    padding: 0;
    gap: ${({ theme }) => theme.spacing.lg};
  }
`;

const LuxurySection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    gap: ${({ theme }) => theme.spacing.md};
  }
`;

const LuxuryTitle = styled.h2`
  color: white;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 1.1rem;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  letter-spacing: 2px;
  margin: 0;
  text-transform: uppercase;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 1.2rem;
    letter-spacing: 3px;
  }
`;

const LuxuryDescription = styled.p`
  color: white;
  font-size: 1.1rem;
  font-weight: ${({ theme }) => theme.typography.fontWeight.regular};
  line-height: 1.2;
  margin: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 1.1rem;
    line-height: 1.4;
  }
`;

const LuxuryButton = styled(Button)`
  align-self: flex-start;
  background: transparent;
  border: none;
  color: white;
  text-decoration: none;
  padding: 0;
  font-size: 1.1rem;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  
  &:hover {
    background: transparent;
    color: #D9D9D9;
  }

  svg {
    font-size: 1rem;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 1.1rem;
    margin-top: ${({ theme }) => theme.spacing.md};
  }
`;

const RightSection = styled.div`
  width: 360px;
  padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.md};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`;

const CarDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  min-width: 310px;
`;

const CarHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
`;

const CarMake = styled.h3`
  color: white;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 1.6rem;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  margin: 0;
  text-align: right;
`;

const CarModel = styled.h4`
  color: white;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 1.2rem;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  margin: -2px 0 ${({ theme }) => theme.spacing.sm} 0;
  text-align: left;
  line-height: 1.1;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const CarPrice = styled.div`
  color: ${({ theme }) => theme.colors.primary.main};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 1.5rem;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  text-align: right;
`;

const CarDetailsDivider = styled.hr`
  width: 100%;
  height: 1px;
  background-color: #ffffff;
  opacity: 0.6;
  border: none;
  margin: 0;
`;

const CarSpecs = styled.div`
  display: flex;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const SpecColumn = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const SpecItem = styled.div`
  display: flex;
  align-items: center;
  color: white;
  font-size: 1rem;
  font-weight: 600;
`;

const DiscoverButton = styled(Button)`
  align-self: flex-end;
  background-color: ${({ theme }) => theme.colors.primary.main};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  color: white;
  font-size: 1.1rem;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  
  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.primary.main};
    color: white;
    text-decoration: none;
    transform: translateY(-1px);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }

  svg {
    font-size: 0.8rem;
    margin-left: 8px;
  }
`;

const Header: React.FC<HeaderProps> = ({ 
  showHero = false,
  backgroundImage,
  featuredCar: propFeaturedCar
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { data: featuredResult } = useFeaturedCars(1);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const featuredCar = {
    id: 16,
    make: "MERCEDES",
    model: "G63 AMG",
    price: 69800,
    year: 2013,
    mileage: 181000,
    fuelType: "Benzina",
    transmission: "Semiautomatico",
    power: "400KW"
  };

  const isActiveRoute = (path: string) => {
    if (path === '/luxury') {
      return location.pathname === '/auto' && 
             new URLSearchParams(location.search).get('luxury') === 'true';
    }
    if (path === '/sedi') {
      return (location.pathname === '/' && location.hash === '#sedi') || 
             location.pathname === '/sedi';
    }
    if (path === '/contatti') {
      return (location.pathname === '/' && location.hash === '#contatti') || 
             location.pathname === '/contatti';
    }
    return location.pathname === path;
  };

  return (
    <HeaderContainer $showHero={showHero}>
      {showHero && <BackgroundOverlay $showHero={showHero} backgroundImage={backgroundImage} />}
      {showHero && <GradientOverlay $showHero={showHero} />}

      <NavigationBar $showHero={showHero}>
        <LogoSection to="/">
          <LogoVector className="hide-mobile">
            <img src="/logo.svg" alt="RD Group Logo" />
          </LogoVector>
          <CompanyDescription>
            Rivenditore di auto a Pistoia, Italia
          </CompanyDescription>
        </LogoSection>

        <MobileMenuButton onClick={toggleMobileMenu}>
          <FaBars />
        </MobileMenuButton>
        
        <NavigationSection>
          <NavLinksContainer>
            <NavLink 
              to="/auto" 
              $isActive={isActiveRoute('/auto')}
              $showHero={showHero}
            >
              RD Group
            </NavLink>
            
            <NavLink 
              to="/auto?luxury=true" 
              $isActive={isActiveRoute('/luxury')}
              $showHero={showHero}
            >
              RD Luxury
            </NavLink>
            
            <NavLink 
              to="/#sedi" 
              $isActive={isActiveRoute('/sedi')}
              $showHero={showHero}
              onClick={(e) => {
                if (location.pathname === '/') {
                  e.preventDefault();
                  const sediSection = document.getElementById('sedi');
                  if (sediSection) {
                    sediSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }
              }}
            >
              Sedi
            </NavLink>
            
            <NavLink 
              to="/acquistiamo" 
              $isActive={isActiveRoute('/acquistiamo')}
              $showHero={showHero}
            >
              Acquistiamo la tua auto
            </NavLink>
            
            <NavLink 
              to="/#contatti" 
              $isActive={isActiveRoute('/contatti')}
              $showHero={showHero}
              onClick={(e) => {
                if (location.pathname === '/') {
                  e.preventDefault();
                  const contattiSection = document.getElementById('contatti');
                  if (contattiSection) {
                    contattiSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }
              }}
            >
              Contatti
            </NavLink>
          </NavLinksContainer>
          
          <NavigationDivider />
        </NavigationSection>
      </NavigationBar>

      <MobileMenuOverlay $isOpen={isMobileMenuOpen} onClick={closeMobileMenu} />
      <MobileMenu $isOpen={isMobileMenuOpen}>
        <MobileMenuHeader>
          <MobileMenuButton onClick={closeMobileMenu}>
            <FaTimes />
          </MobileMenuButton>
        </MobileMenuHeader>
        
        <MobileNavLinks>
          <MobileNavLink 
            to="/auto" 
            $isActive={isActiveRoute('/auto')}
            onClick={closeMobileMenu}
          >
            RD Group
          </MobileNavLink>
          
          <MobileNavLink 
            to="/auto?luxury=true" 
            $isActive={isActiveRoute('/luxury')}
            onClick={closeMobileMenu}
          >
            RD Luxury
          </MobileNavLink>
          
          <MobileNavLink 
            to="/#sedi" 
            $isActive={isActiveRoute('/sedi')}
            onClick={(e) => {
              closeMobileMenu();
              if (location.pathname === '/') {
                e.preventDefault();
                const sediSection = document.getElementById('sedi');
                if (sediSection) {
                  sediSection.scrollIntoView({ behavior: 'smooth' });
                }
              } else {
                e.preventDefault();
                navigate('/#sedi');
                setTimeout(() => {
                  const sediSection = document.getElementById('sedi');
                  if (sediSection) {
                    sediSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }, 100);
              }
            }}
          >
            Sedi
          </MobileNavLink>
          
          <MobileNavLink 
            to="/acquistiamo" 
            $isActive={isActiveRoute('/acquistiamo')}
            onClick={closeMobileMenu}
          >
            Acquistiamo la tua auto
          </MobileNavLink>
          
          <MobileNavLink 
            to="/#contatti" 
            $isActive={isActiveRoute('/contatti')}
            onClick={(e) => {
              closeMobileMenu();
              if (location.pathname === '/') {
                e.preventDefault();
                const contattiSection = document.getElementById('contatti-form');
                if (contattiSection) {
                  contattiSection.scrollIntoView({ behavior: 'smooth' });
                }
              } else {
                e.preventDefault();
                navigate('/#contatti');

                const scrollToContact = (attempts = 0) => {
                  const contattiSection = document.getElementById('contatti-form');
                  if (contattiSection) {
                    contattiSection.scrollIntoView({ behavior: 'smooth' });
                  } else if (attempts < 20) {
                    setTimeout(() => scrollToContact(attempts + 1), 100);
                  } else {
                    const mainContattiSection = document.getElementById('contatti');
                    if (mainContattiSection) {
                      mainContattiSection.scrollIntoView({ behavior: 'smooth' });
                    }
                  }
                };
                setTimeout(() => scrollToContact(), 200);
              }
            }}
          >
            Contatti
          </MobileNavLink>
        </MobileNavLinks>
      </MobileMenu>

      {showHero && (
        <HeroContentContainer $showHero={showHero}>
          <LeftSection>
            <LuxurySection>
              <LuxuryTitle>LUXURY</LuxuryTitle>
              <LuxuryDescription>
                Abbiamo una nuova occasione tra le auto di lusso, sembra perfetta per te
              </LuxuryDescription>
            </LuxurySection>
            
            <LuxuryButton 
              as={Link} 
              to="/auto?luxury=true"
              variant="ghost"
            >
              Vai alla sezione luxury <FaArrowRight />
            </LuxuryButton>
          </LeftSection>

          <RightSection>
            <CarDetails>
              <CarHeader>
                <CarMake>{featuredCar.make}</CarMake>
                <CarModel>{featuredCar.model}</CarModel>
                <CarPrice>€ {featuredCar.price.toLocaleString('it-IT')}</CarPrice>
              </CarHeader>

              <CarDetailsDivider />

              <CarSpecs>
                <SpecColumn>
                  <SpecItem>
                    <span>{featuredCar.mileage.toLocaleString()}Km</span>
                  </SpecItem>
                  <SpecItem>
                    <span>{featuredCar.year}</span>
                  </SpecItem>
                </SpecColumn>

                <SpecColumn>
                  <SpecItem>
                    <span>{featuredCar.fuelType}</span>
                  </SpecItem>
                  <SpecItem>
                    <span>{featuredCar.transmission}</span>
                  </SpecItem>
                  <SpecItem>
                    <span>{featuredCar.power}</span>
                  </SpecItem>
                </SpecColumn>
              </CarSpecs>
            </CarDetails>

            <DiscoverButton 
              as={Link} 
              to={featuredCar ? `/auto/${featuredCar.model}-${featuredCar.model}-${featuredCar.id}` : "/auto?luxury=true"}
              variant="primary"
            >
              Scopri di più <FaArrowRight />
            </DiscoverButton>
          </RightSection>
        </HeroContentContainer>
      )}
    </HeaderContainer>
  );
};

export default Header;