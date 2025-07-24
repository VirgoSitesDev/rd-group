import React from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import Container from '../layout/Container';

const ServicesSection = styled.section`
  padding: ${({ theme }) => theme.spacing.xl} 35px;
  background: ${({ theme }) => theme.colors.background.default};
`;

const SectionTitle = styled.h2`
  text-align: left;
  margin-bottom: 30;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 1rem;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  text-transform: uppercase;
  letter-spacing: 0.1px;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 2rem;
    text-align: center;
  }
`;

const ServicesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ theme }) => theme.spacing.xl};
  max-width: 100%;
  margin: 0 auto;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing.lg};
    max-width: 400px;

    & > :nth-child(5) {
      grid-column: 1;
      justify-self: stretch;
      max-width: none;
    }
  }
`;

const ServiceCard = styled.div`
  background: white;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: 4px solid #d3d3d3;
  text-decoration: none;
  color: inherit;
  display: block;
  overflow: hidden;
  position: relative;
  height: 320px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  cursor: pointer;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
    text-decoration: none;
    color: inherit;
  }
`;

const ServiceImage = styled.div`
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0,0,0,0.15);
    z-index: 2;
  }
`;

const ServiceInfo = styled.div`
  position: absolute;
  bottom: ${({ theme }) => theme.spacing.sm};
  left: ${({ theme }) => theme.spacing.sm};
  right: ${({ theme }) => theme.spacing.sm};
  z-index: 2;
  color: white;
`;

const ServiceTitle = styled.h4`
  margin: 0;
  font-size: 1.4rem;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: white;
  letter-spacing: 0.4px;
`;

const OurServices: React.FC = () => {
  const navigate = useNavigate();

  const services = [
    {
      title: "Vendita Auto Usate",
      description: "Ampio catalogo di auto usate selezionate e garantite",
      image: '/Servizio_1.jpg',
      link: "/auto"
    },
    {
      title: "Vendita Luxury",
      description: "Auto di lusso e sportive per clienti esigenti",
      image: '/Servizio_2.jpg',
      link: "/luxury"
    },
    {
      title: "Officina",
      description: "Servizio completo di manutenzione e riparazione",
      image: '/Servizio_3.jpg',
      link: "contact-scroll"
    },
    {
      title: "Acquisto Auto",
      description: "Acquistiamo la tua auto al miglior prezzo",
      image: '/Servizio_4.jpg',
      link: "/acquistiamo"
    },
    {
      title: "Carroattrezzi per i Clienti",
      description: "Servizio di soccorso stradale dedicato",
      image: '/Servizio_5.jpg',
      link: "contact-scroll"
    }
  ];

  const handleServiceClick = (service: typeof services[0]) => {
    if (service.link === "contact-scroll") {
      const contattiSection = document.getElementById('contatti');
      if (contattiSection) {
        contattiSection.scrollIntoView({ behavior: 'smooth' });
        window.history.replaceState(null, '', window.location.pathname);
      }
    } else {
      navigate(service.link);
    }
  };

  return (
    <ServicesSection>
      <Container>
        <SectionTitle>I Nostri Servizi</SectionTitle>
        
        <ServicesGrid>
          {services.map((service, index) => (
            <ServiceCard key={index} onClick={() => handleServiceClick(service)}> {/* Cambiato da to={service.link} */}
              <ServiceImage 
                style={{ 
                  backgroundImage: `url(${service.image})`
                }}
              />
              <ServiceInfo>
                <ServiceTitle>{service.title}</ServiceTitle>
              </ServiceInfo>
            </ServiceCard>
          ))}
        </ServicesGrid>
      </Container>
    </ServicesSection>
  );
};

export default OurServices;