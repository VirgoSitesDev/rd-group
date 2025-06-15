import React from 'react';
import styled from 'styled-components';
import Container from '../layout/Container';
import Card from '../common/Card';
import ActionButton from '../common/ActionButton';

const ServicesSection = styled.section`
  padding: ${({ theme }) => theme.spacing.xl} 35px;
  background: ${({ theme }) => theme.colors.background.default};
`;

const ServicesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: ${({ theme }) => theme.spacing.xl};
  margin-top: ${({ theme }) => theme.spacing.xl};
`;

const SectionTitle = styled.h2`
  text-align: left;
  margin-bottom: 0;
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

const LocationCard = styled(Card)`
  text-align: center;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  border-radius: ${({ theme }) => theme.borderRadius.lg};

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
  }
`;

const MapContainer = styled.div`
  width: 100%;
  height: 45vh;
  position: relative;
  border-radius: ${({ theme }) => theme.borderRadius.lg} ${({ theme }) => theme.borderRadius.lg} 0 0;
  overflow: hidden;

  iframe {
    width: 100%;
    height: 100%;
    border: none;
    filter: grayscale(100%); /* Cambiato da 20% a 100% per scala di grigi completa */
    transition: filter 0.3s ease;
  }

  ${LocationCard}:hover & iframe {
    filter: grayscale(30%); /* Al hover rimane leggermente in scala di grigi */
  }
`;

const LocationInfo = styled.div`
  padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.md};
  display: flex;
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing.xs};
  align-items: start;
  justify-content: space-between;
`;

const LocationAddress = styled.div`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 1.2rem;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  padding-top: 3px;
  text-align: start;
  line-height: 1.1;
`;

const LocationsSection: React.FC = () => {
  const locations = [
    {
      name: "Sede Principale",
      address: "Via Bottaia, 2",
      fullAddress: "Via Bottaia, 2, 51100 Pistoia PT, Italia",
      // Aggiunto &markers=size:large%7Ccolor:red per marker grandi e rossi
      mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2879.8!2d10.9167!3d43.9333!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12d591a2b1234567%3A0x1234567890abcdef!2sVia%20Bottaia%2C%202%2C%2051100%20Pistoia%20PT%2C%20Italia!5e0!3m2!1sit!2sit!4v1234567890123&markers=size:large%7Ccolor:red%7CVia%20Bottaia%2C%202%2C%2051100%20Pistoia%20PT%2C%20Italia",
      googleMapsLink: "https://maps.google.com/?q=Via+Bottaia,+2,+51100+Pistoia+PT,+Italia"
    },
    {
      name: "Sede Secondaria",
      address: "Via Luigi Galvani, 2",
      fullAddress: "Via Luigi Galvani, 2, 51100 Pistoia PT, Italia",
      // Aggiunto &markers=size:large%7Ccolor:red per marker grandi e rossi
      mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2879.8!2d10.9167!3d43.9333!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12d591a2b1234567%3A0x1234567890abcdef!2sVia%20Luigi%20Galvani%2C%202%2C%2051100%20Pistoia%20PT%2C%20Italia!5e0!3m2!1sit!2sit!4v1234567890123&markers=size:large%7Ccolor:red%7CVia%20Luigi%20Galvani%2C%202%2C%2051100%20Pistoia%20PT%2C%20Italia",
      googleMapsLink: "https://maps.google.com/?q=Via+Luigi+Galvani,+2,+51100+Pistoia+PT,+Italia"
    },
    {
      name: "Sede Terza",
      address: "Via Fiorentina, 331",
      fullAddress: "Via Fiorentina, 331, 51100 Pistoia PT, Italia",
      // Aggiunto &markers=size:large%7Ccolor:red per marker grandi e rossi
      mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2879.8!2d10.9167!3d43.9333!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12d591a2b1234567%3A0x1234567890abcdef!2sVia%20Fiorentina%2C%20331%2C%2051100%20Pistoia%20PT%2C%20Italia!5e0!3m2!1sit!2sit!4v1234567890123&markers=size:large%7Ccolor:red%7CVia%20Fiorentina%2C%20331%2C%2051100%20Pistoia%20PT%2C%20Italia",
      googleMapsLink: "https://maps.google.com/?q=Via+Fiorentina,+331,+51100+Pistoia+PT,+Italia"
    }
  ];

  return (
    <ServicesSection id="sedi">
      <Container>
        <SectionTitle>DOVE SIAMO</SectionTitle>
        <ServicesGrid>
          {locations.map((location, index) => (
            <LocationCard key={index} hoverable padding="none">
              <MapContainer>
                <iframe
                  src={location.mapUrl}
                  width="100%"
                  height="200"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`Mappa di ${location.name}`}
                />
              </MapContainer>
              <LocationInfo>
                <LocationAddress>
                  {location.address}<br />
                  51100 Pistoia PT, Italia
                </LocationAddress>
                <ActionButton 
                  variant="primary"
                  href={location.googleMapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  as="a"
                >
                  Apri nelle mappe →
                </ActionButton>
              </LocationInfo>
            </LocationCard>
          ))}
        </ServicesGrid>
      </Container>
    </ServicesSection>
  );
};

export default LocationsSection;