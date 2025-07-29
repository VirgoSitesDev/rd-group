import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { FaUser, FaCar, FaCalendar, FaPhone, FaEnvelope, FaMapMarkerAlt, FaArrowLeft, FaDownload } from 'react-icons/fa';
import Container from '../components/layout/Container';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';
import { supabase } from '../services/supabase';

const SummaryContainer = styled.div`
  background: ${({ theme }) => theme.colors.background.default};
  min-height: 100vh;
  padding: ${({ theme }) => theme.spacing.xl} 0;
`;

const BackButton = styled(Button)`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  background: transparent;
  color: ${({ theme }) => theme.colors.text.primary};
  text-decoration: underline;
  text-transform: none;
  border: none;
  padding: 0;
  
  &:hover {
    background: transparent !important;
    color: ${({ theme }) => theme.colors.primary.main} !important;
  }
`;

const SummaryCard = styled.div`
  background: white;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const SummaryHeader = styled.div`
  background: ${({ theme }) => theme.colors.primary.main};
  color: white;
  padding: ${({ theme }) => theme.spacing.xl};
  text-align: center;
`;

const SummaryTitle = styled.h1`
  margin: 0 0 ${({ theme }) => theme.spacing.sm} 0;
  font-size: 2rem;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
`;

const SummarySubtitle = styled.p`
  margin: 0;
  opacity: 0.9;
  font-size: 1.1rem;
`;

const SummaryContent = styled.div`
  padding: ${({ theme }) => theme.spacing.xxl};
`;

const InfoSection = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xxl};
`;

const SectionTitle = styled.h2`
  color: ${({ theme }) => theme.colors.primary.main};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  font-size: 1.3rem;
  
  svg {
    font-size: 1.2rem;
  }
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.background.default};
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border-left: 4px solid ${({ theme }) => theme.colors.primary.main};
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const InfoLabel = styled.span`
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.primary.main};
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const InfoValue = styled.span`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 1.1rem;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

const NotesSection = styled.div`
  background: #fff9e6;
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border-left: 4px solid #ffc107;
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

const NotesTitle = styled.h3`
  color: #856404;
  margin: 0 0 ${({ theme }) => theme.spacing.sm} 0;
  font-size: 1.1rem;
`;

const NotesContent = styled.p`
  color: #856404;
  white-space: pre-wrap;
  margin: 0;
  line-height: 1.5;
`;

const ImagesSection = styled.div`
  margin-top: ${({ theme }) => theme.spacing.xxl};
`;

const ImagesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
`;

const ImageContainer = styled.div<{ $isMain?: boolean }>`
  position: relative;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  
  ${({ $isMain }) => $isMain && `
    grid-column: 1 / -1;
    max-height: 500px;
  `}
`;

const CarImage = styled.img<{ $isMain?: boolean }>`
  width: 100%;
  height: ${({ $isMain }) => $isMain ? '500px' : '250px'};
  object-fit: cover;
  display: block;
`;

const ImageBadge = styled.div<{ $isMain?: boolean }>`
  position: absolute;
  top: ${({ theme }) => theme.spacing.md};
  left: ${({ theme }) => theme.spacing.md};
  background: ${({ $isMain, theme }) => $isMain ? theme.colors.primary.main : 'rgba(0, 0, 0, 0.7)'};
  color: white;
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: 0.8rem;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  text-transform: uppercase;
`;

const ContactActions = styled.div`
  background: ${({ theme }) => theme.colors.primary.main};
  color: white;
  padding: ${({ theme }) => theme.spacing.xl};
  display: flex;
  gap: ${({ theme }) => theme.spacing.lg};
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
`;

const ContactButton = styled.a`
  background: white;
  color: ${({ theme }) => theme.colors.primary.main};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  text-decoration: none;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  transition: all 0.2s ease;
  
  &:hover {
    background: ${({ theme }) => theme.colors.background.default};
    text-decoration: none;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const PrintButton = styled(Button)`
  background: white;
  color: ${({ theme }) => theme.colors.primary.main};
  border: none;
  
  &:hover {
    background: ${({ theme }) => theme.colors.background.default} !important;
    color: ${({ theme }) => theme.colors.primary.main} !important;
  }
`;

const ErrorContainer = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xxl};
  
  h2 {
    color: ${({ theme }) => theme.colors.error};
    margin-bottom: ${({ theme }) => theme.spacing.lg};
  }
  
  p {
    color: ${({ theme }) => theme.colors.text.primary};
    margin-bottom: ${({ theme }) => theme.spacing.xl};
  }
`;

const Footer = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl};
  color: ${({ theme }) => theme.colors.text.primary};
  background: ${({ theme }) => theme.colors.background.default};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  
  h3 {
    color: ${({ theme }) => theme.colors.primary.main};
    margin-bottom: ${({ theme }) => theme.spacing.md};
  }
  
  p {
    margin: ${({ theme }) => theme.spacing.xs} 0;
  }
`;

interface AcquisitionData {
  id: string;
  customer_data: {
    nome: string;
    cognome: string;
    mail: string;
    telefono: string;
  };
  vehicle_data: {
    marca: string;
    anno: string;
    km: string;
    note: string;
  };
  images: string[];
  created_at: string;
}

const AcquisitionSummaryPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<AcquisitionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        setError('ID riepilogo non valido');
        setLoading(false);
        return;
      }

      try {
        const { data: summaryData, error: dbError } = await supabase
          .from('acquisition_summaries')
          .select('*')
          .eq('id', id)
          .single();

        if (dbError) {
          console.error('Errore database:', dbError);
          setError('Riepilogo non trovato nel database');
        } else if (summaryData) {
          setData(summaryData);
        } else {
          setError('Riepilogo non trovato');
        }
      } catch (err) {
        console.error('Errore nel recupero dati:', err);
        setError('Errore nel caricamento del riepilogo');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  const handleBack = () => {
    window.history.back();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('it-IT', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <SummaryContainer>
        <Container>
          <Loading type="spinner" size="lg" text="Caricamento riepilogo..." />
        </Container>
      </SummaryContainer>
    );
  }

  if (error || !data) {
    return (
      <SummaryContainer>
        <Container>
          <BackButton onClick={handleBack}>
            <FaArrowLeft /> Torna Indietro
          </BackButton>
          
          <ErrorContainer>
            <h2>Riepilogo non disponibile</h2>
            <p>{error || 'Il riepilogo richiesto non è stato trovato o potrebbe essere scaduto.'}</p>
            <Button onClick={handleBack}>
              Torna Indietro
            </Button>
          </ErrorContainer>
        </Container>
      </SummaryContainer>
    );
  }

  return (
    <SummaryContainer>
      <Container>
        <BackButton onClick={handleBack}>
          <FaArrowLeft /> Torna Indietro
        </BackButton>

        <SummaryCard>
          <SummaryHeader>
            <SummaryTitle>🚗 Richiesta Acquisizione Auto</SummaryTitle>
            <SummarySubtitle>
              RD Group - {formatDate(data.created_at)}
            </SummarySubtitle>
          </SummaryHeader>

          <SummaryContent>
            <InfoSection>
              <SectionTitle>
                <FaUser /> Dati Cliente
              </SectionTitle>
              <InfoGrid>
                <InfoItem>
                  <InfoLabel>Nome Completo</InfoLabel>
                  <InfoValue>{data.customer_data.nome} {data.customer_data.cognome}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Email</InfoLabel>
                  <InfoValue>{data.customer_data.mail}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Telefono</InfoLabel>
                  <InfoValue>{data.customer_data.telefono}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Data Richiesta</InfoLabel>
                  <InfoValue>{formatDate(data.created_at)}</InfoValue>
                </InfoItem>
              </InfoGrid>
            </InfoSection>

            <InfoSection>
              <SectionTitle>
                <FaCar /> Dati Veicolo
              </SectionTitle>
              <InfoGrid>
                <InfoItem>
                  <InfoLabel>Marca</InfoLabel>
                  <InfoValue>{data.vehicle_data.marca || 'Non specificata'}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Anno</InfoLabel>
                  <InfoValue>{data.vehicle_data.anno || 'Non specificato'}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Chilometraggio</InfoLabel>
                  <InfoValue>
                    {data.vehicle_data.km 
                      ? `${parseInt(data.vehicle_data.km).toLocaleString('it-IT')} km`
                      : 'Non specificato'
                    }
                  </InfoValue>
                </InfoItem>
              </InfoGrid>

              {data.vehicle_data.note && (
                <NotesSection>
                  <NotesTitle>📝 Note Aggiuntive</NotesTitle>
                  <NotesContent>{data.vehicle_data.note}</NotesContent>
                </NotesSection>
              )}
            </InfoSection>

            {data.images && data.images.length > 0 && (
              <ImagesSection>
                <SectionTitle>
                  📸 Foto del Veicolo ({data.images.length} immagini)
                </SectionTitle>
                <ImagesGrid>
                  {data.images.map((imageUrl, index) => (
                    <ImageContainer key={index} $isMain={index === 0}>
                      <CarImage 
                        src={imageUrl} 
                        alt={`Foto ${index + 1} del veicolo`}
                        $isMain={index === 0}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'flex';
                          target.style.alignItems = 'center';
                          target.style.justifyContent = 'center';
                          target.style.fontSize = '4rem';
                          target.innerHTML = '🚗';
                        }}
                      />
                      <ImageBadge $isMain={index === 0}>
                        {index === 0 ? '🌟 Foto Principale' : `Foto ${index + 1}`}
                      </ImageBadge>
                    </ImageContainer>
                  ))}
                </ImagesGrid>
              </ImagesSection>
            )}
          </SummaryContent>

          <ContactActions>
            <div>
              <strong>Contatta direttamente il cliente:</strong>
            </div>
            <ContactButton href={`tel:${data.customer_data.telefono}`}>
              <FaPhone /> Chiama: {data.customer_data.telefono}
            </ContactButton>
            <ContactButton href={`mailto:${data.customer_data.mail}?subject=Valutazione auto ${data.vehicle_data.marca || 'veicolo'}`}>
              <FaEnvelope /> Email: {data.customer_data.mail}
            </ContactButton>
            <PrintButton onClick={handlePrint}>
              <FaDownload /> Stampa / Salva PDF
            </PrintButton>
          </ContactActions>
        </SummaryCard>

        <Footer>
          <h3>RD Group - Concessionario Auto Pistoia</h3>
          <p>📍 Via Bottaia, 2 - 51100 Pistoia (PT)</p>
          <p>📞 +39 057 318 7467 | ✉️ rdautosrlpistoia@gmail.com</p>
          <hr style={{ margin: '20px 0', border: 'none', borderTop: '1px solid #ddd' }} />
          <p style={{ fontSize: '0.9rem', opacity: 0.7 }}>
            Riepilogo generato automaticamente - ID: {data.id}
          </p>
        </Footer>
      </Container>
    </SummaryContainer>
  );
};

export default AcquisitionSummaryPage;