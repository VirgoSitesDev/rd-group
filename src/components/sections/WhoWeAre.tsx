import React, { useState } from 'react';
import styled from 'styled-components';
import { FaArrowRight, FaUser, FaCar } from 'react-icons/fa';
import Container from '../layout/Container';
import ActionButton from '../common/ActionButton';

const WhoWeAreSection = styled.section`
  padding: ${({ theme }) => theme.spacing.xxl} 35px;
  background: ${({ theme }) => theme.colors.background.default};
`;

const SectionTitle = styled.h2`
  text-align: left;
  margin-bottom: 15px;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 1rem;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  text-transform: uppercase;
  letter-spacing: 0.1px;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    text-align: center;
    font-size: 1.2rem;
  }
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing.xxl};
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.xxl};

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing.xl};
  }
`;

const ImageContainer = styled.div`
  position: relative;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100vh;
    object-fit: cover;
    display: block;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    order: -1;
    
    img {
      height: 300px;
    }
  }
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const MainText = styled.p`
  font-size: 1.1rem;
  line-height: 1.6;
  padding: 0 20px;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
`;

const ContactFormSection = styled.div`
  padding: 0;
  margin-top: 150px;
  margin-bottom: 200px;
  display: flex;
  gap: ${({ theme }) => theme.spacing.xl};
  align-items: stretch;

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.lg};
  }
`;

const ContactContainer = styled.div`
  flex: 1;
  min-width: 400px;
  max-height: 500px;
  background: white;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.xl};
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    min-width: auto;
    width: 100%;
  }
`;

const ContactForm = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.xl};
  align-items: start;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing.lg};
  }
`;

const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  height: 100%;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const FormLabel = styled.label`
  font-size: 0.9rem;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const FormInput = styled.input`
  padding: ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: #F9F9F9;
  font-size: 1.2rem;
  font-weight: ${({ theme }) => theme.typography.fontWeight.light};
  color: ${({ theme }) => theme.colors.text.primary};
  transition: border-color 0.2s ease, background-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary.main};
    background: white;
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.text.primary};
    font-weight: ${({ theme }) => theme.typography.fontWeight.regular};
  }
`;

const FormTextArea = styled.textarea`
  padding: ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: #F9F9F9;
  font-size: 1.2rem;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.primary};
  min-height: 320px;
  flex: 1;
  resize: vertical;
  font-family: inherit;
  transition: border-color 0.2s ease, background-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary.main};
    background: white;
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.text.primary};
    font-weight: ${({ theme }) => theme.typography.fontWeight.regular};
  }
`;

const PromotionalContainer = styled.div`
  width: 350px;
  flex-shrink: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
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
  min-height: 540px;
  margin-top: -20px;

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
  color: #cb1618;
  font-size: 1.2rem;
  line-height: 1.5;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  flex: 1;
`;

interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  carModel: string;
}

const WhoWeAre: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    carModel: ''
  });

  const handleInputChange = (field: keyof ContactFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Qui implementeresti l'invio del form
    alert('Richiesta inviata! Vi contatteremo presto.');
    setFormData({ 
      firstName: '', 
      lastName: '', 
      email: '',
      phone: '',
      carModel: '' 
    });
  };

  return (
    <WhoWeAreSection>
      <Container>
        <SectionTitle>CHI SIAMO</SectionTitle>
        
        <ContentGrid>
          <ImageContainer>
            <img 
              src="/Chi_Siamo.jpg"
              alt="Meccanico al lavoro nel nostro centro assistenza"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'flex';
                target.style.alignItems = 'center';
                target.style.justifyContent = 'center';
                target.style.background = 'white';
                target.style.color = 'white';
                target.style.fontSize = '4rem';
                target.innerHTML = '🔧';
              }}
            />
          </ImageContainer>

          <ContentContainer id="contatti">
            <MainText>
              RD Group nasce dalla passione per le quattro ruote dei suoi titolari che hanno da sempre seguito il mondo dei motori e continuano ad aggiornarsi sulle novità del settore, precedendo il
              futuro delle auto. Il focus dell'azienda è rivolto al segmento luxury nel quale si riassume il meglio della tecnologia e del comfort e si hanno prestazioni di eccellenza. È facile innamorarsi
              di questo tipo di vetture che consentono di stare al volante minimizzando la fatica e che godono di optional di eccezione sia per la guida sia per l'intrattenimento dei passeggeri.
            </MainText>
          </ContentContainer>
        </ContentGrid>

        <ContactFormSection>
          <PromotionalContainer>
            <PromotionalBox>
              <div>
                <PromoTitle>Non trovi la tua prossima auto? Te la troviamo noi</PromoTitle>
                <PromoText>
                  Compila comodamente il modulo a lato e ti informeremo al più presto
                </PromoText>
              </div>
            </PromotionalBox>
          </PromotionalContainer>

          <ContactContainer>
            <ContactForm onSubmit={handleSubmit}>
              <LeftColumn>
                <FormGroup>
                  <FormLabel htmlFor="firstName">NOME</FormLabel>
                  <FormInput
                    type="text"
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    placeholder="Nome"
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <FormLabel htmlFor="lastName">COGNOME</FormLabel>
                  <FormInput
                    type="text"
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    placeholder="Cognome"
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <FormLabel htmlFor="email">MAIL</FormLabel>
                  <FormInput
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="example@gmail.com"
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <FormLabel htmlFor="phone">TELEFONO</FormLabel>
                  <FormInput
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+39 000 000 0000"
                    required
                  />
                </FormGroup>
              </LeftColumn>

              <RightColumn>
                <FormGroup style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <FormLabel htmlFor="carModel">CHE AUTO CERCHI?</FormLabel>
                  <FormTextArea
                    id="carModel"
                    value={formData.carModel}
                    onChange={(e) => handleInputChange('carModel', e.target.value)}
                    placeholder="Inserisci qui le specifiche o nome dell'auto che cerchi"
                    required
                  />
                </FormGroup>

                <ActionButton type="submit">
                  Richiedi <FaArrowRight />
                </ActionButton>
              </RightColumn>
            </ContactForm>
          </ContactContainer>
        </ContactFormSection>
      </Container>
    </WhoWeAreSection>
  );
};

export default WhoWeAre;