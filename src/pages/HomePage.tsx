import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import SearchFiltersSection from '../components/sections/SearchFiltersSection';
import ServicesMapsSection from '../components/sections/ServicesMapsSection';
import OurServices from '../components/sections/Services';
import WhoWeAre from '../components/sections/WhoWeAre';

const HomePage: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    document.title = 'RD Group - Auto Usate Pistoia | Vendita Auto Usate di Qualità';
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'RD Group è il tuo concessionario di fiducia per auto usate a Pistoia. Ampio catalogo, servizio officina e acquistiamo la tua auto. Contattaci!');
    }
  }, []);

  useEffect(() => {
    if (location.hash) {
      const timer = setTimeout(() => {
        const targetId = location.hash.substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          targetElement.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [location.hash]);

  return (
    <>
      <SearchFiltersSection />
      <ServicesMapsSection />
      <OurServices />
      <WhoWeAre />
    </>
  );
};

export default HomePage;