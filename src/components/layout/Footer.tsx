import React from 'react';
import styled from 'styled-components';

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
  max-width: 90vw;
  margin: 0 auto;
  padding: 20px 0px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  align-items: start;
  gap: 100px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 40px;
    text-align: center;
  }
`;

const LogoSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
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
            <p className="phone">+39 057 318 7467</p>
          </div>
          
          <div>
            <h3>E-Mail</h3>
            <p>rdautosrlpistoia@gmail.com</p>
          </div>
        </ContactSection>

        <HoursSection>
          <h3>Lunedì - Sabato</h3>
          <div>
            <p>08:30 - 13:00</p>
            <p>14:30 - 19:30</p>
          </div>
          <div>
            <h3>Domenica</h3>
            <p>Chiuso</p>
          </div>
        </HoursSection>

        <AddressSection>
          <h3>Indirizzo</h3>
          
          <AddressItem>
            <div className="location-name">Via Bottaia, 2</div>
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
    </FooterContainer>
  );
};

export default Footer;