import React from 'react';
import styled from 'styled-components';
import { PrivacyPolicyLink, CookiePolicyLink } from '../common/IubendaLinks';

const FooterContainer = styled.footer`
  background-color: ${({ theme }) => theme.colors.background.default};
  color: black;
  margin-top: auto;
  padding: 40px 0px;
`;

const NavigationDivider = styled.div`
  width: 100%;
  height: 0.8px;
  background-color: black;
  margin-bottom: 20px;
`;

const FooterContent = styled.div`
  max-width: 100vw;
  margin: 0 auto;
  padding: 20px 0px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  align-items: start;
  gap: 100px;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr;
    gap: 40px;
    text-align: center;
  }
`;

const LogoSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    justify-content: center;
  }
`;

const LogoCircle = styled.div`
  width: 110px;
  height: 110px;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 80px;
    height: 80px;
    margin-bottom: 10px;
  }
`;

const ContactSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;

  h3 {
    margin: 0 0 8px 0;
    font-size: 1.2rem;
    font-weight: 600;
    color: black;
  }

  p {
    margin: 0;
    font-size: 1.2rem;
    line-height: 1;
    color: black;
  }

  .phone {
    font-weight: 400;
    color: black;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    h3 {
      font-size: 1.1rem !important;
    }
  }
`;

const HoursSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;

  h3 {
    margin: 0 0 1px 0;
    font-size: 1.2rem;
    font-weight: 600;
    color: black;
  }

  p {
    margin: 0;
    font-size: 1.2rem;
    line-height: 1.2;
    color: black;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    h3 {
      font-size: 1.1rem !important;
    }
  }
`;

const AddressSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0px;

  @media (max-width: 768px) {
    text-align: center;
  }

  h3 {
    margin: 0 0 2px 0;
    font-size: 1.2rem;
    font-weight: 600;
    color: black;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    h3 {
      font-size: 1.1rem !important;
    }
  }
`;

const AddressItem = styled.div`
  font-size: 1.2rem;
  line-height: 1.2;
  
  .location-name {
    font-weight: 400;
    margin-bottom: 2px;
  }
  
  .address {
    color: black;
  }
`;

const PrivacySection = styled.div`
  padding: ${({ theme }) => theme.spacing.lg} 0;
  text-align: center;
  display: flex;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.xl};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.md};
  }
`;

const Footer: React.FC = () => {
  return (
    <FooterContainer>
      <NavigationDivider></NavigationDivider>
      <FooterContent>
        <LogoSection>
          <LogoCircle>
            <img src="/Logo_black.png" alt="RD Auto Logo" />
          </LogoCircle>
        </LogoSection>

        <ContactSection>
          <div>
            <h3>Telefono</h3>
            <p className="phone">RD Group: +39 057 318 74672</p>
            <p className="phone">RD Luxury: +39 0573 1941223</p>
          </div>
          
          <div>
            <h3>E-Mail</h3>
            <p>RD Group: rdautosrlpistoia@gmail.com</p>
            <p>RD Luxury: rdluxurysrl@gmail.com</p>
          </div>
        </ContactSection>

        <HoursSection>
          <h3>Lunedì - Sabato</h3>
          <div>
            <p>09:00 - 13:00</p>
            <p>15:00 - 19:00</p>
          </div>
          <div>
            <h3>Domenica</h3>
            <p>Chiuso</p>
          </div>
        </HoursSection>

        <AddressSection>
          <h3>Indirizzo</h3>
          
          <AddressItem>
            <div className="location-name">Via Bottaia di San Sebastiano, 2L</div>
            <div className="address">51100 Pistoia PT, Italia</div>
          </AddressItem>
          
          <AddressItem>
            <div className="location-name">Via Luigi Galvani, 2</div>
            <div className="address">51100 Pistoia PT, Italia</div>
          </AddressItem>
          
          <AddressItem>
            <div className="location-name">Via Fiorentina, 331</div>
            <div className="address">51100 Pistoia PT, Italia</div>
          </AddressItem>
        </AddressSection>
      </FooterContent>
        <PrivacySection>
          <PrivacyPolicyLink />
          <CookiePolicyLink />
        </PrivacySection>
    </FooterContainer>
  );
};

export default Footer;